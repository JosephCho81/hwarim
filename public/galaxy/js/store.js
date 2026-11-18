// 매칭용 데이터의 브라우저 보관(localStorage). 서버 저장 없음.
const KEY = 'galaxy.matchData.v1';
export const TTL_MS = 24 * 60 * 60 * 1000;

function storage() {
  try { return globalThis.localStorage || null; } catch { return null; }
}

export function saveRecords(records, now = Date.now()) {
  const s = storage();
  if (!s) return false;
  try {
    s.setItem(KEY, JSON.stringify({ savedAt: now, records }));
    return true;
  } catch {
    return false;
  }
}

// 만료(24시간)됐거나 깨졌으면 지우고 null
export function loadRecords(now = Date.now()) {
  const s = storage();
  if (!s) return null;
  let data = null;
  try { data = JSON.parse(s.getItem(KEY) || 'null'); } catch { data = null; }
  if (!data || !Array.isArray(data.records) || typeof data.savedAt !== 'number' || now - data.savedAt > TTL_MS) {
    clearRecords();
    return null;
  }
  return data;
}

export function clearRecords() {
  const s = storage();
  try { s && s.removeItem(KEY); } catch { /* 저장소 차단 시 무시 */ }
}
