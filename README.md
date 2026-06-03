# 수강신청 사이트 프론트엔드

React + Vite 기반의 수강신청 사이트 샘플입니다. Cloudflare Pages 배포를 고려해 SPA 방식으로 구성했습니다.

## 포함된 화면

- 로그인 페이지
- Home 탭: 현재 시각 크게 표시, 신청 시작 시간, 신청 기간, 대상별 일정, 주의사항
- 수강신청 탭: 교양/전공 라디오, 검색/필터/정렬, 신청/취소/불가 툴팁, 예비 신청 인원
- 사전 신청함 탭: 관심 과목 담기, 전체 신청, 삭제
- 신청 확인 탭: 신청 완료 과목, 신청 학점 요약, 취소
- 시간표 탭: 신청/취소 결과 자동 반영

## admin 로그인

admin 로그인은 주소/admin 에서 가능합니다.


## 환경변수

로컬 개발 시 프로젝트 루트에 `.env.development` 파일을 만들고 아래 값을 입력합니다.

```env
VITE_API_BASE_URL=백엔드_api_주소/api

## 실행 방법

```bash
npm install
npm run dev
```

## 빌드 방법

```bash
npm run build
```

빌드 결과는 `dist/` 폴더에 생성됩니다.

## Cloudflare Pages 설정

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js 버전: 20 이상 권장

`public/_redirects` 파일이 포함되어 있어 SPA 배포 시 새로고침 문제를 줄일 수 있습니다.

## 주요 구조

```txt
src/
├─ api/           백엔드 API 호출 함수
├─ components/    공통 UI 컴포넌트
├─ data/          임시 표시 데이터
├─ pages/         로그인/메인 페이지
├─ tabs/          메인 내부 탭 화면
├─ styles/        전역 CSS
└─ utils/         수강신청 규칙 계산 함수
```
