# Findex 인덱스 관리 대시보드

React + TypeScript + Vite로 구축된 Findex 인덱스 관리 대시보드입니다. 지수 현황을 시각화하고, 데이터/지수/연동 상태를 한 곳에서 관리하도록 구성했습니다.

## 주요 기능
- **대시보드**: 주요 지수 카드, 지수 차트, 지수 성과를 제공.
- **지수 관리**: 지수 목록을 조회·정렬하고 신규 등록, 수정, 삭제, Open API 연동 동기화를 수행합니다.
- **데이터 관리**: 데이터 목록을 조회·정렬하고 신규 등록, 수정, 삭제, Open API 연동 동기화를 수행합니다. Export csv 다운로드를 지원합니다.
- **연동 관리**: 외부 시스템 연동 상태, 동기화 이력, 최신 동기화 결과를 모니터링합니다.

## 기술 스택
- **프런트엔드**: React 19, TypeScript, Vite
- **스타일링**: Tailwind CSS 4, Pretendard 폰트
- **상태 관리**: Zustand
- **UI & 그래프**: React Aria Components, Recharts, Untitled UI

## 프로젝트 구조

```
src/
├─ api/              # axios 기반 API 클라이언트 및 도메인별 API 래퍼
├─ components/       # 공용 UI 컴포넌트와 페이지 구성 요소
    ├─ common/
    └─ pages/
├─ constants/        # 네비게이션 등 상수 정의
├─ hooks/            # 커스텀 훅 (무한 스크롤 등)
├─ pages/            # 라우트 엔트리: 대시보드, 지수/데이터/연동 관리
├─ store/            # Zustand 스토어
├─ styles/           # Tailwind 4 기반 전역 스타일
└─ utils/            # 테이블 정렬, 클래스 병합 등 유틸리티
```

## 빠른 시작
### 1) 의존성 설치
```bash
npm install
```

### 2) 개발 서버 실행
```bash
npm run dev
```
- 기본적으로 `http://localhost:5173`에서 앱을 확인할 수 있습니다.

### 3) 빌드
```bash
npm run build
```
- 타입 체크 후 프로덕션 빌드를 생성합니다.

## 라우팅
`src/main.tsx`의 `createBrowserRouter`를 통해 `/dashboard`, `/index-management`, `/data-management`, `/integrations` 네 개의 화면을 제공합니다. 기본 경로(`/`) 접근 시 대시보드로 리다이렉션됩니다.
