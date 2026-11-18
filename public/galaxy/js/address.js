// 주소 유사도: 1번 통합배송지와 3번 수하인기본주소의 행정구역 토큰 겹침 수.
const SIDO = [
  [/^서울(특별시|시)?$/, '서울'],
  [/^부산(광역시|시)?$/, '부산'],
  [/^대구(광역시|시)?$/, '대구'],
  [/^인천(광역시|시)?$/, '인천'],
  [/^광주(광역시|시)?$/, '광주'],
  [/^전남광주통합특별시$/, '광주'],
  [/^대전(광역시|시)?$/, '대전'],
  [/^울산(광역시|시)?$/, '울산'],
  [/^세종(특별자치시|시)?$/, '세종'],
  [/^경기(도)?$/, '경기'],
  [/^강원(도|특별자치도)?$/, '강원'],
  [/^충(청북도|북)$/, '충북'],
  [/^충(청남도|남)$/, '충남'],
  [/^(전라북도|전북|전북특별자치도)$/, '전북'],
  [/^(전라남도|전남)$/, '전남'],
  [/^(경상북도|경북)$/, '경북'],
  [/^(경상남도|경남)$/, '경남'],
  [/^제주(도|특별자치도)?$/, '제주'],
];

export function normSido(word) {
  for (const [re, short] of SIDO) if (re.test(word)) return short;
  return null;
}

const REGION = /^[가-힣0-9]+(시|군|구|읍|면|동|리|가)$/;

export function addressTokens(address) {
  const text = String(address || '');
  const tokens = new Set();
  const words = text.replace(/\([^)]*\)/g, ' ').split(/\s+/).filter(Boolean);
  words.forEach((w, i) => {
    const sido = i === 0 ? normSido(w) : null;
    if (sido) tokens.add(`@${sido}`);
    else if (REGION.test(w) && !/^\d/.test(w)) tokens.add(w);
  });
  // 1번 주소 괄호 안의 동명, 예: "(성황동, 광양센트럴자이)" → 성황동
  for (const m of text.matchAll(/\(([^)]*)\)/g)) {
    for (const part of m[1].split(',')) {
      const p = part.trim();
      if (/^[가-힣0-9]+(동|리|가)$/.test(p)) tokens.add(p);
    }
  }
  return tokens;
}

export function addressScore(a, b) {
  const ta = addressTokens(a);
  let n = 0;
  for (const t of addressTokens(b)) if (ta.has(t)) n++;
  return n;
}

// 후보 주소 중 target과 가장 많이 겹치는 하나. 동점이면 null.
export function pickAddress(target, candidates) {
  let best = null;
  let bestScore = -1;
  let tie = false;
  for (const c of candidates) {
    const s = addressScore(c, target);
    if (s > bestScore) { best = c; bestScore = s; tie = false; }
    else if (s === bestScore) tie = true;
  }
  return tie || bestScore <= 0 ? null : best;
}
