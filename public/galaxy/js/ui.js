// 화면 연결. 고객 데이터는 console·외부 전송 금지. 값은 textContent로만 넣는다(XSS 방지).
import { readWorkbook, sheetRowsWith, UserError } from './sheet.js';
import { INVOICE_HEADERS, parseNames, invoiceIndex, lookup } from './names.js';

const $ = (id) => document.getElementById(id);
let index = null;
let results = [];

function say(text, kind = '') {
  $('msg').textContent = text;
  $('msg').className = `msg ${kind}`;
}

function cell(text, className = '') {
  return Object.assign(document.createElement('td'), { textContent: text, className });
}

function render() {
  const names = parseNames($('names').value);
  results = index ? lookup(names, index) : [];
  $('copyBtn').disabled = !results.length;
  if (!index) { $('result').replaceChildren(); return; }
  if (!names.length) { say('이름을 붙여넣으세요.'); $('result').replaceChildren(); return; }

  const rows = results.map((r) => {
    const tr = document.createElement('tr');
    const inv = r.invoice ? cell(r.invoice) : cell(r.name ? '없음' : '', 'miss');
    if (r.others) inv.append(Object.assign(document.createElement('small'), { textContent: ` (송장 ${r.others + 1}개 중 맨 위)` }));
    tr.append(cell(r.name), inv);
    return tr;
  });
  $('result').replaceChildren(...rows);
  const asked = results.filter((r) => r.name).length;
  const found = results.filter((r) => r.invoice).length;
  say(`${asked}명 중 ${found}명 찾음${asked - found ? `, ${asked - found}명 없음` : ''}`, found === asked ? 'ok' : 'err');
}

async function onFile(e) {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  index = null;
  say('처리 중…');
  try {
    const buf = new Uint8Array(await file.arrayBuffer());
    if (!buf.length) throw new UserError('빈 파일입니다.');
    index = invoiceIndex(sheetRowsWith(readWorkbook(buf), INVOICE_HEADERS));
    $('fileName').textContent = `불러온 파일: ${file.name}`;
    render();
  } catch (err) {
    $('fileName').textContent = '송장파일 선택';
    render();
    say(err instanceof UserError ? err.message : '처리 중 오류가 발생했습니다. 파일을 확인하세요.', 'err');
  }
}

// 붙여넣은 이름과 줄 위치가 맞도록 없는 사람은 빈 줄로 복사한다.
async function onCopy() {
  const text = results.map((r) => r.invoice).join('\n');
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    document.body.append(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  say(`송장번호 ${results.length}줄을 복사했습니다. 이름 옆 칸에 붙여넣으세요.`, 'ok');
}

$('file').addEventListener('change', onFile);
$('names').addEventListener('input', render);
$('copyBtn').addEventListener('click', onCopy);
