// 화면 연결. 고객 데이터는 console·외부 전송 금지.
import { readWorkbook, sheetRowsWith, UserError } from './sheet.js';
import { openOrderFile } from './decrypt.js';
import { parseOrders, lotteFile, toMatchRecords, ORDER_HEADERS } from './toLotte.js';
import { parseInvoices, matchInvoices, INVOICE_HEADERS } from './match.js';
import { naverFile } from './toNaver.js';
import { saveRecords, loadRecords, clearRecords } from './store.js';
import { renderReport } from './report.js';

const $ = (id) => document.getElementById(id);
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

function say(id, text, kind = '') {
  const n = $(id);
  n.textContent = text;
  n.className = `msg ${kind}`;
}

function errorText(e) {
  return e instanceof UserError ? e.message : '처리 중 오류가 발생했습니다. 파일을 확인하세요.';
}

function download({ bytes, name }, mime) {
  const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function fmtTime(ms) {
  const d = new Date(ms);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function refreshKeep() {
  const data = loadRecords();
  $('keepText').textContent = data
    ? `주문 데이터 보관 중: ${data.records.length}행 (${fmtTime(data.savedAt)} 저장, 24시간 후 자동 삭제)`
    : '보관된 주문 데이터 없음';
  $('clearBtn').disabled = !data;
  $('reorder').hidden = !!data;
  return data;
}

async function readOrders(file) {
  const plain = await openOrderFile(await file.arrayBuffer());
  return parseOrders(sheetRowsWith(readWorkbook(plain), ORDER_HEADERS));
}

function keep(orders) {
  return saveRecords(toMatchRecords(orders))
    ? ''
    : '\n(브라우저 저장소를 쓸 수 없어 2단계에서 주문파일을 다시 올려야 합니다)';
}

async function onOrderFile(e) {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  say('msg1', '처리 중…');
  try {
    const orders = await readOrders(file);
    download(lotteFile(orders), XLSX_MIME);
    const manual = orders.filter((o) => !o.orderNo).length;
    say('msg1', `롯데업로드 파일을 내려받았습니다. ${orders.length}행 (수기 행 ${manual}행 포함)${keep(orders)}`, 'ok');
  } catch (err) {
    say('msg1', errorText(err), 'err');
  }
  refreshKeep();
}

async function onReorder(e) {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  say('msg2', '주문파일 읽는 중…');
  try {
    const orders = await readOrders(file);
    say('msg2', `주문파일 ${orders.length}행을 불러왔습니다. 이제 송장파일을 올리세요.${keep(orders)}`, 'ok');
  } catch (err) {
    say('msg2', errorText(err), 'err');
  }
  refreshKeep();
}

async function onInvoiceFile(e) {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  $('report').replaceChildren();
  const data = refreshKeep();
  if (!data) { say('msg2', '보관된 주문 데이터가 없습니다. 주문파일(1번)을 먼저 올리세요.', 'err'); return; }
  say('msg2', '처리 중…');
  try {
    const buf = new Uint8Array(await file.arrayBuffer());
    if (!buf.length) throw new UserError('빈 파일입니다.');
    const invoices = parseInvoices(sheetRowsWith(readWorkbook(buf), INVOICE_HEADERS));
    const result = matchInvoices(data.records, invoices);
    renderReport($('report'), result);
    if (!result.assigned.length) throw new UserError('발송처리할 행이 없습니다. 아래 목록을 확인하세요.');
    download(naverFile(result.assigned), 'application/vnd.ms-excel');
    clearRecords();
    say('msg2', `발송처리 파일을 내려받았습니다. ${result.assigned.length}행. 보관 데이터는 삭제했습니다.`, 'ok');
  } catch (err) {
    say('msg2', errorText(err), 'err');
  }
  refreshKeep();
}

$('orderFile').addEventListener('change', onOrderFile);
$('orderFile2').addEventListener('change', onReorder);
$('invoiceFile').addEventListener('change', onInvoiceFile);
$('clearBtn').addEventListener('click', () => {
  clearRecords();
  refreshKeep();
  say('msg2', '보관 데이터를 삭제했습니다.');
});
refreshKeep();
