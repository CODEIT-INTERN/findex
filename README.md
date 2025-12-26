# Findex 인덱스 관리 대시보드

React + TypeScript + Vite로 구축된 Findex 인덱스 관리 대시보드입니다. 지수 현황을 시각화하고, 데이터/지수/연동 상태를 한 곳에서 관리하도록 구성했습니다.

## 주요 기능
### 1. **대시보드**: 주요 지수 카드, 지수 차트, 지수 성과를 제공.
<img width="694" height="904" alt="image" src="https://github.com/user-attachments/assets/1dbf5b87-feca-4507-8800-1138dbe8000c" />

- 즐겨찾기한 주요 지수 목록 (일/주/월간)
- 지수 정보 차트 (월/분기/년, 지수 정보)
- 지수 성과 (일/주/월, 지수 정보 필터)

### 2. **지수 관리**: 지수 목록을 조회·정렬하고 신규 등록, 수정, 삭제, Open API 연동 동기화를 수행합니다.
<img width="1917" height="907" alt="image" src="https://github.com/user-attachments/assets/9b25834c-6f48-485c-ad59-a4832251d8f6" />

- 지수 목록 (분류명, 지수명, 즐겨찾기 필터)
- 지수 등록
- 지수 Open API 연동
- 지수 삭제, 수정

### 3. **데이터 관리**: 데이터 목록을 조회·정렬하고 신규 등록, 수정, 삭제, Open API 연동 동기화를 수행합니다. Export csv 다운로드를 지원합니다.
<img width="1918" height="908" alt="image" src="https://github.com/user-attachments/assets/a8c8c2f8-51f3-44de-bdc4-c5a30254f81f" />

- 지수 데이터 목록 (지수 정보, 기간 필터)
- 지수 데이터 내보내기 (csv 파일)
- 지수 데이터 등록
- 지수 데이터 Open API 연동
- 지수 삭제, 수정

### 4. **연동 관리**: 외부 시스템 연동 상태, 동기화 이력, 최신 동기화 결과를 모니터링합니다.
<img width="1917" height="905" alt="image" src="https://github.com/user-attachments/assets/01e5b2b6-bb1b-4076-b007-f3dbacf8ca14" />

- 지수 연동 관리
- 연동 성공, 실패, 마지막 시간 (최근 7일)
- 자동 연동 지수 목록 (지수 정보, 활성화 유무 필터)
- 연동 이력 (작업자명, 유형, 지수 정보, 기간, 활성화 상태 필터)

## 기술 스택
- **프런트엔드**: React 19, TypeScript, Vite
- **스타일링**: Tailwind CSS 4, Pretendard 폰트
- **상태 관리**: Zustand
- **UI & 그래프**: React Aria Components, Recharts, Untitled UI

## 환경 설정 (Environment Variables)

외부 API 통신을 위해 환경 변수 설정이 필요합니다.

### 설정 방법

1. 루트 디렉토리에 `.env` 파일을 생성합니다.
2. 아래 내용을 참고하여 환경 변수를 설정합니다.

| 변수명 | 필수 여부 | 설명 |
| :--- | :---: | :--- |
| `API_PROXY_TARGET` | **필수** | API 요청을 전달할 타겟 서버 주소 |

**설정 예시:**
```env
API_PROXY_TARGET=http://sprint-project-example.com/sb/findex
```

## 프로젝트 구조

```
src/
├─ api/                   # axios 기반 API 클라이언트 및 도메인별 래퍼
├─ assets/                # 아이콘 등 정적 에셋
├─ components/
│  ├─ layout/             # 최상위 레이아웃과 사이드 내비게이션
│  ├─ common/             # 전역 공용 컴포넌트
│  └─ pages/              # 각 페이지에 사용된 컴포넌트
│     ├─ dashboard/       # 주요 지수 카드, 추세·성과 차트
│     ├─ index-management/# 지수 목록 테이블, 등록/수정 모달, 필터
│     ├─ data-management/ # 데이터 테이블, 필터, 데이터/동기화 모달
│     └─ integrations/    # 연동 현황 카드, 동기화 이력/리스트
├─ constants/             # 네비게이션 등 상수 정의
├─ hooks/                 # 커스텀 훅
├─ pages/                 # 라우트 엔트리 컴포넌트
│  ├─ Dashboard.tsx
│  ├─ IndexManagement.tsx
│  ├─ DataManagement.tsx
│  └─ Integrations.tsx
├─ store/                 # Zustand 스토어
├─ styles/                # Tailwind 4 기반 전역 스타일
├─ utils/                 # 테이블 정렬, 클래스 병합 등 유틸리티
└─ main.tsx               # 라우터 및 전역 프로바이더 진입점
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
