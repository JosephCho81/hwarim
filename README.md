<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/149a27b4-8e2a-4fcf-9a65-d7abcd68ed85

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 갤럭시글로벌 송장번호 찾기 (`/galaxy/`)

`public/galaxy/`는 홈페이지와 별개인 정적 도구다(hwarim.vercel.app/galaxy/). 파일은 브라우저 안에서만 처리하고 서버로 보내지 않는다.

- 사용: 이름을 한 줄에 한 명씩 붙여넣고 롯데 ALPS 송장파일(.xlsx)을 올리면 이름 옆에 운송장번호가 나온다. 「송장번호만 복사」는 붙여넣은 줄 순서대로 송장번호만 복사한다(없는 이름은 빈 줄).
- 매칭: 송장파일의 `수하인명` ↔ 붙여넣은 이름(공백 무시). 운송장번호가 숫자가 아닌 행은 무시.
  - 롯데는 한 사람의 여러 박스에 `홍길동_1`, `홍길동_2` 꼬리를 붙인다. 꼬리 없이 넣으면 맨 위 송장(화면에 "송장 N개 중 맨 위" 표시), 꼬리째 넣으면 그 박스 송장.
  - 이름만으로 매칭하므로 동명이인은 구분하지 못한다.
- 원본 소스: 별도 폴더 `~/galaxy`(git 아님). 여기서 수정·테스트한 뒤 `public/galaxy/`로 복사하고, `index.html`에는 `<base href="/galaxy/">`를 넣는다(`~/galaxy/scripts/sync-hwarim.sh`).
- 테스트(`~/galaxy`에서): `npm test`(단위, `sample/3.xlsx` 사용), `npm run e2e`(Edge 실제 브라우저).
- 2026-11-23 이전의 주문파일→롯데 업로드, 송장→네이버 발송처리 흐름은 제거했다(`~/galaxy/_backup_20261123_old_flow/`에 백업).
