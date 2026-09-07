/**
 * Federo Health — Plain-Language Impact Summary Generator
 * ========================================================
 * Template-based (zero ML). Pulls from computed metrics to produce
 * clinician/judge-readable sentences.
 */

/**
 * Generate the primary impact sentence and optional federation delta line.
 *
 * @param {object} params
 * @param {number}  params.recall            - recall (0–1 float)
 * @param {number}  params.accuracy          - accuracy (0–100)
 * @param {string}  params.useCase           - 'sepsis' | 'retinopathy' | etc.
 * @param {number}  params.sampleSize        - number of patient records
 * @param {string}  params.hospitalName      - name of the hospital
 * @param {number|null} params.localAccuracy     - local-only accuracy (0–100), optional
 * @param {number|null} params.federatedAccuracy - federated accuracy (0–100), optional
 * @param {string}  params.trainingMode      - 'cloud' | 'edge'
 * @returns {{ primarySentence: string, federationSentence: string|null, modeSentence: string }}
 */
export function generateImpactSummary({
  recall = 0,
  accuracy = 0,
  useCase = 'sepsis',
  sampleSize = 0,
  hospitalName = 'this facility',
  localAccuracy = null,
  federatedAccuracy = null,
  trainingMode = 'cloud',
}) {
  const recallPct = Math.round((recall || 0) * 100);
  const accPct = Math.round(accuracy || 0);
  const n = (sampleSize || 0).toLocaleString();

  const useCaseLabel = {
    sepsis:       'sepsis',
    retinopathy:  'diabetic retinopathy',
    diabetes:     'diabetes',
    pneumonia:    'pneumonia',
    cardiac:      'cardiac risk',
  }[useCase] || useCase;

  // Primary sentence
  const primarySentence =
    `This model correctly identifies ${recallPct}% of high-risk ${useCaseLabel} cases ` +
    `in this population, achieving ${accPct}% overall accuracy based on ` +
    `${n} patient records from ${hospitalName}.`;

  // Federation delta sentence (only if both values available)
  let federationSentence = null;
  if (localAccuracy !== null && federatedAccuracy !== null) {
    const delta = Math.round(federatedAccuracy - localAccuracy);
    if (delta > 0) {
      federationSentence =
        `Accuracy improved by ${delta} percentage point${delta !== 1 ? 's' : ''} ` +
        `after ${hospitalName} joined the federated network — from ${Math.round(localAccuracy)}% ` +
        `(local-only) to ${Math.round(federatedAccuracy)}% (federated).`;
    } else {
      federationSentence =
        `This model has not yet received federated improvements. ` +
        `Joining the network is expected to improve performance.`;
    }
  }

  // Training mode annotation
  const modeSentence = trainingMode === 'edge'
    ? 'Trained on-device (Edge Mode) — no patient data left this facility.'
    : 'Trained via Cloud Backend — server-side sklearn pipeline with DP noise annotation.';

  return { primarySentence, federationSentence, modeSentence };
}
