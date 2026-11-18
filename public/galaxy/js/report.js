// 2단계 결과 화면(건수 + 목록). 모든 값은 textContent로만 넣는다(XSS 방지).
function el(tag, props = {}, children = []) {
  const n = document.createElement(tag);
  Object.assign(n, props);
  for (const c of children) n.append(c);
  return n;
}

function table(head, rows) {
  if (!rows.length) return el('p', { className: 'empty', textContent: '없음' });
  const thead = el('thead', {}, [el('tr', {}, head.map((h) => el('th', { textContent: h })))]);
  const tbody = el('tbody', {}, rows.map((r) => el('tr', {}, r.map((v) => el('td', { textContent: String(v ?? '') })))));
  return el('div', { className: 'table-wrap' }, [el('table', {}, [thead, tbody])]);
}

function section(title, head, rows, { warn = false, open = false } = {}) {
  const summary = el('summary', {}, [title, el('span', { className: 'count', textContent: `${rows.length}건` })]);
  return el('details', { className: warn && rows.length ? 'warn' : '', open: open && rows.length > 0 }, [summary, table(head, rows)]);
}

export function renderReport(root, r) {
  root.replaceChildren(
    section('① 발송처리 파일에 반영', ['상품주문번호', '수취인', '배송방법', '택배사', '송장번호'],
      r.assigned.map((a) => [a.orderNo, a.name, a.method, a.carrier, a.invoice])),
    section('② 주문에 있으나 송장 없음', ['상품주문번호', '수취인', '상품명', '옵션'],
      r.noInvoice.map((o) => [o.orderNo, o.name, o.product, o.option]), { warn: true, open: true }),
    section('③ 송장에 있으나 주문과 매칭 안 됨', ['NO', '수하인', '운송장번호', '상품명', '상품상세', '사유'],
      r.unmatched.map((u) => [u.no, u.name, u.invoice, u.product, u.option, u.reason]), { warn: true, open: true }),
    section('④ 한 주문에 송장 여러 개 → 맨 위 채택', ['상품주문번호', '수취인', '채택 송장', '미채택 송장'],
      r.multi.map((m) => [m.orderNo, m.name, m.adopted, m.rejected.join(', ')]), { warn: true, open: true }),
    section('⑤ 주소 판별 불가', ['NO', '수하인', '운송장번호', '송장 주소', '후보(상품주문번호: 주소)'],
      r.ambiguous.map((a) => [a.no, a.name, a.invoice, a.address,
        a.candidates.map((c) => `${c.orderNo}: ${c.address}`).join(' / ')]), { warn: true, open: true }),
    section('⑥ 주문파일 수기 행(상품주문번호 없음, 제외)', ['수취인', '상품명', '옵션', '확인된 송장'],
      r.manual.map((m) => [m.name, m.product, m.option, m.invoices.join(', ') || '-'])),
  );
}
