# b4-1 Portfolio — Jack B.

순수 HTML / CSS / JavaScript로 구현한 반응형 포트폴리오 웹사이트.  
외부 UI 프레임워크 없이 모든 인터랙션을 직접 구현했다.

## 개발 환경

| 항목 | 내용 |
|---|---|
| 언어 | HTML5, CSS3, JavaScript (ES6+) |
| 외부 허용 리소스 | Google Fonts (IBM Plex Mono, Space Grotesk, Inter), Font Awesome 6.5 |
| 브라우저 | Chrome (최신) |
| 배포 | GitHub Pages |

## 배포 URL

**https://VectorSophie.github.io/codyssey-b4-1**

## 폴더 구조

```
codyssey-b4-1/
├── index.html          # 메인 페이지 (시맨틱 마크업)
├── css/
│   └── style.css       # 전체 스타일시트 (CSS 변수, 반응형, 다크모드)
├── js/
│   └── main.js         # 전체 기능 (이벤트 → 상태 → 렌더링 패턴)
└── images/
    └── profile.svg     # 프로필 이미지 (lab-aesthetic SVG 아바타)
```

## 주요 기능 구현

### 인터랙션

| 기능 | 구현 방식 |
|---|---|
| 다크 모드 토글 | `localStorage` 저장 → 새로고침 후 유지 |
| 시스템 다크모드 감지 | `prefers-color-scheme` 미디어 쿼리 (보너스) |
| 햄버거 메뉴 | `classList.toggle('active')` — 768px 미만 표시 |
| 부드러운 스크롤 | `scrollIntoView({ behavior: 'smooth' })` |
| 스크롤 탑 버튼 | **300px** 스크롤 이상에서 표시 |
| 네비게이션 배경 변경 | **60px** 스크롤 이상에서 blur 배경 활성화 |
| 스크롤 애니메이션 | `IntersectionObserver` — threshold **0.2** |
| GitHub API 연동 | `fetch` + `async/await`, 로딩/성공/에러/빈 상태 UI |
| 프로젝트 언어 필터 | `array.filter()` 활용 (보너스) |
| 폼 유효성 검사 | 필수값 + 이메일 형식 (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) |
| 타이핑 효과 | Hero 섹션 직책 타이핑 (보너스) |

> **임계값 문서화** (스펙 요구사항)
> - 스크롤 탑 버튼: `SCROLL_TOP_THRESHOLD = 300` (px)
> - 네비게이션 배경: `NAV_SCROLL_THRESHOLD = 60` (px)
> - Intersection Observer: `OBSERVER_THRESHOLD = 0.2`

### 상태 → 렌더링 흐름 (3가지 이상)

1. **다크 모드**: 토글 클릭 → `state.theme` 변경 → `[data-theme]` 속성 변경 → CSS 변수 전환
2. **GitHub API**: 요청 → `state.projects.status` 변경 → 로딩/성공/에러/빈 상태 UI 렌더링
3. **폼 유효성**: 제출 → `validateForm()` → 에러 메시지 표시/숨김 + 성공 메시지
4. **햄버거 메뉴**: 클릭 → `state.menuOpen` 변경 → `nav-menu.active` 클래스 토글
5. **언어 필터**: 버튼 클릭 → `state.projects.filter` 변경 → 카드 목록 재렌더링

### 반응형 브레이크포인트

| 범위 | 레이아웃 |
|---|---|
| 0 ~ 767px (모바일) | 1열, 햄버거 메뉴, 스킬 2열 |
| 768px ~ 1023px (태블릿) | 2열 About/Contact, 3열 스킬 |
| 1024px 이상 (데스크톱) | 6열 스킬 카드, 전체 레이아웃 |

### ES6+ 사용 목록

| 문법 | 사용 위치 |
|---|---|
| `const` / `let` | 전체 (var 미사용) |
| 화살표 함수 | 이벤트 핸들러, map/filter 콜백 전체 |
| 템플릿 리터럴 | `renderRepoCard()`, `buildFilterButtons()` — HTML 동적 생성 |
| 구조분해 할당 | `validateForm()` — `const { value: name } = document.getElementById(...)` |
| `array.map()` | 레포지토리 데이터 → 카드 HTML 변환 |
| `array.filter()` | 포크 제외, 언어별 필터링 |
| `array.forEach()` | 이벤트 리스너 등록, DOM 순회 |
| `async / await` | `fetchProjects()` — GitHub API 호출 |
| `try / catch` | API 에러 처리 |
| 전개 연산자 + Set | `[...new Set(repos.map(...))]` — 고유 언어 추출 |

## GitHub Pages 배포 방법

```bash
# 1. main 브랜치 push
git push -u origin main

# 2. GitHub 저장소 → Settings → Pages
#    Source: "Deploy from a branch"
#    Branch: main / (root)

# 3. 배포 URL: https://VectorSophie.github.io/codyssey-b4-1
```

## GitHub API 주의사항

- 인증 없이 시간당 60회 요청 제한 (레이트 리밋)
- 403 응답 시 에러 상태 UI 표시 + "다시 시도" 버튼 제공
- 짧은 시간 내 반복 새로고침 자제

## 보너스 과제 구현

| 보너스 | 구현 여부 | 방식 |
|---|---|---|
| 프로젝트 언어 필터링 | ✅ | `array.filter()` + 동적 버튼 생성 |
| 타이핑 효과 | ✅ | Hero 섹션 직책 타이핑/지우기 loop |
| 시스템 다크모드 감지 | ✅ | `window.matchMedia('(prefers-color-scheme: dark)')` |

## 스크린샷

> 배포 후 추가 예정
