/**
 * Federo Health — Cryptographic Authentication & Hash-Chained Audit Trail
 * ======================================================================
 * Uses browser Web Crypto API (SubtleCrypto) for:
 *  1. ECDSA P-256 keypair generation per hospital
 *  2. Nonce challenge signing & cryptographic verification
 *  3. SHA-256 hash generation for data & model weights
 *  4. Immutable-style SHA-256 hash-chained audit logs
 */

// ── ArrayBuffer / String conversion helpers ─────────────────────────────────
export function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToBuffer(hex) {
  const bytes = new Uint8Array(Math.ceil(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes.buffer;
}

export function stringToBuffer(str) {
  return new TextEncoder().encode(str);
}

export function bufferToString(buf) {
  return new TextDecoder().decode(buf);
}

// ── SHA-256 Hashing ─────────────────────────────────────────────────────────
export async function sha256Hex(data) {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  const buf = stringToBuffer(str);
  const digest = await window.crypto.subtle.digest('SHA-256', buf);
  return bufferToHex(digest);
}

// ── Web Crypto ECDSA Keypair Generation ──────────────────────────────────────
export async function generateHospitalKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true, // extractable
    ['sign', 'verify']
  );

  // Export keys to JWK format so they can be stored/inspected
  const pubJwk = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);
  const privJwk = await window.crypto.subtle.exportKey('jwk', keyPair.privateKey);

  // Compute a public key fingerprint (hex string) for easy visual identification
  const fingerprint = await sha256Hex(JSON.stringify(pubJwk));
  const pubKeyHex = `04${pubJwk.x || ''}${pubJwk.y || ''}`.slice(0, 48) + '...';

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
    pubJwk,
    privJwk,
    fingerprint: `0x${fingerprint.slice(0, 16)}`,
    fullFingerprint: fingerprint,
    pubKeyHex,
  };
}

// ── Nonce Challenge Generator & Signer ──────────────────────────────────────
export function generateChallengeNonce() {
  const randomBytes = new Uint8Array(16);
  window.crypto.getRandomValues(randomBytes);
  return `nonce-${Date.now()}-${bufferToHex(randomBytes)}`;
}

export async function signChallengeNonce(privateKey, nonce) {
  const data = stringToBuffer(nonce);
  const signature = await window.crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' },
    },
    privateKey,
    data
  );
  return bufferToHex(signature);
}

export async function verifyChallengeSignature(publicKey, nonce, signatureHex) {
  try {
    const data = stringToBuffer(nonce);
    const signature = hexToBuffer(signatureHex);
    const isValid = await window.crypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: { name: 'SHA-256' },
      },
      publicKey,
      signature,
      data
    );
    return isValid;
  } catch (err) {
    console.error('Signature verification failed:', err);
    return false;
  }
}

// ── Import/Export JWK Key helpers ───────────────────────────────────────────
export async function importPublicKeyFromJwk(jwk) {
  return await window.crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['verify']
  );
}

export async function importPrivateKeyFromJwk(jwk) {
  return await window.crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign']
  );
}

// ── Model Weight & Payload Signing ──────────────────────────────────────────
export async function signModelPackage(privateKey, modelData) {
  const payloadStr = JSON.stringify({
    modelId: modelData.id || modelData.modelId,
    version: modelData.version || 'v1.0',
    weightsHash: modelData.weightsHash,
    datasetSource: modelData.datasetSource,
    metrics: modelData.metrics,
    timestamp: modelData.timestamp || new Date().toISOString(),
  });
  
  const payloadHash = await sha256Hex(payloadStr);
  const signatureHex = await signChallengeNonce(privateKey, payloadHash);

  return {
    payloadHash,
    signature: signatureHex,
    signedAt: new Date().toISOString(),
  };
}

export async function verifyModelPackageSignature(publicKey, modelData, signatureHex) {
  const payloadStr = JSON.stringify({
    modelId: modelData.id || modelData.modelId,
    version: modelData.version || 'v1.0',
    weightsHash: modelData.weightsHash,
    datasetSource: modelData.datasetSource,
    metrics: modelData.metrics,
    timestamp: modelData.timestamp,
  });
  const payloadHash = await sha256Hex(payloadStr);
  return await verifyChallengeSignature(publicKey, payloadHash, signatureHex);
}

// ── Hash-Chained Audit Trail ────────────────────────────────────────────────
export const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

export async function computeAuditLogHash(prevHash, entry) {
  const canonicalString = `${prevHash}|${entry.timestamp}|${entry.hospitalId}|${entry.userId}|${entry.action}|${JSON.stringify(entry.details || {})}`;
  return await sha256Hex(canonicalString);
}

export async function verifyAuditChainIntegrity(chain) {
  if (!Array.isArray(chain) || chain.length === 0) {
    return { valid: true, errorIndex: -1, checkedCount: 0 };
  }

  let expectedPrevHash = GENESIS_HASH;

  for (let i = 0; i < chain.length; i++) {
    const entry = chain[i];
    if (entry.prevHash !== expectedPrevHash) {
      return {
        valid: false,
        errorIndex: i,
        reason: `Broken chain link at index ${i}: prevHash mismatch. Expected ${expectedPrevHash.slice(0, 10)}... got ${entry.prevHash.slice(0, 10)}...`,
        checkedCount: i + 1,
      };
    }

    const calculatedHash = await computeAuditLogHash(entry.prevHash, entry);
    if (calculatedHash !== entry.hash) {
      return {
        valid: false,
        errorIndex: i,
        reason: `Tampered log data at index ${i}: hash signature mismatch. Recomputed: ${calculatedHash.slice(0, 10)}... recorded: ${entry.hash.slice(0, 10)}...`,
        checkedCount: i + 1,
      };
    }

    expectedPrevHash = entry.hash;
  }

  return { valid: true, errorIndex: -1, checkedCount: chain.length };
}
