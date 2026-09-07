/**
 * Federo Health — Offline-First Upload/Sync Queue
 * ================================================
 * Simulates low-bandwidth resilience using localStorage.
 * Items transition: QUEUED → SYNCING → SYNCED | FAILED
 *
 * In production this would be replaced by a Service Worker + Background Sync API.
 */

const STORAGE_KEY = 'federo_sync_queue';

export const SyncStatus = {
  QUEUED: 'QUEUED',
  SYNCING: 'SYNCING',
  SYNCED: 'SYNCED',
  FAILED: 'FAILED',
};

function loadQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // Quota exceeded — silently ignore in demo
  }
}

/**
 * Add an item to the sync queue.
 * @param {object} item - { type: 'upload'|'train', label, payload, timestamp }
 * @returns {string} item ID
 */
export function enqueue(item) {
  const queue = loadQueue();
  const id = `sq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const entry = { id, status: SyncStatus.QUEUED, ...item, enqueuedAt: new Date().toISOString() };
  queue.push(entry);
  saveQueue(queue);
  return id;
}

/**
 * Get current queue contents.
 * @returns {Array}
 */
export function getQueue() {
  return loadQueue();
}

/**
 * Update a single item's status in the queue.
 */
export function updateItemStatus(id, status, extra = {}) {
  const queue = loadQueue().map(item =>
    item.id === id ? { ...item, status, ...extra } : item
  );
  saveQueue(queue);
  return queue;
}

/**
 * Remove all SYNCED items from the queue.
 */
export function clearSynced() {
  const queue = loadQueue().filter(item => item.status !== SyncStatus.SYNCED);
  saveQueue(queue);
  return queue;
}

/**
 * Clear the entire queue.
 */
export function clearAll() {
  saveQueue([]);
}

/**
 * Flush the queue — process items in sequence.
 * Calls onStatusChange(updatedQueue) after each item status change.
 * Calls processor(item) → Promise for each QUEUED item.
 *
 * @param {Function} processor    - async (item) => any — the actual API call
 * @param {Function} onStatusChange - (queue) => void — called after each state change
 */
export async function flushQueue(processor, onStatusChange) {
  let queue = loadQueue();
  const pending = queue.filter(item => item.status === SyncStatus.QUEUED);

  for (const item of pending) {
    // Mark as SYNCING
    queue = updateItemStatus(item.id, SyncStatus.SYNCING);
    if (onStatusChange) onStatusChange([...queue]);

    // Small delay so the UI can show "Syncing" state
    await new Promise(r => setTimeout(r, 600));

    try {
      const result = await processor(item);
      queue = updateItemStatus(item.id, SyncStatus.SYNCED, { result, syncedAt: new Date().toISOString() });
    } catch (err) {
      queue = updateItemStatus(item.id, SyncStatus.FAILED, { error: err.message });
    }

    if (onStatusChange) onStatusChange([...queue]);

    // Brief pause between items
    await new Promise(r => setTimeout(r, 300));
  }

  return loadQueue();
}
