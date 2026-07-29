# 🎮 GameNest

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO_Client-4.8-010101?logo=socketdotio&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)

**게임 정보 탐색, 커뮤니티, 실시간 채팅을 한 곳에서 제공하는 게임 포털 SPA 프론트엔드입니다.**

## 소개

GameNest는 게임 목록·상세 정보 열람, 찜하기·별점 평가, 커뮤니티 게시판(글쓰기·댓글·스크랩), Steam 뉴스, 실시간 오픈채팅 기능을 제공하는 React 기반 싱글 페이지 애플리케이션입니다.

이 저장소는 **프론트엔드 전용**이며, REST API와 Socket.IO 서버는 별도의 백엔드에서 제공됩니다. `.env`의 `VITE_API_BASE_URL`(`https://gamenest2.ddns.net`)과 `vercel.json`에 기록된 `https://gamenest-server.onrender.com`을 통해 백엔드와 통신합니다 — 자세한 내용은 [통신 방식](#통신-방식--api) 섹션 참고.

git log 기준 첫 커밋은 2025-07-24, 작성자는 `taewoo01`입니다.

## 주요 기능

| 기능 | 진입점 | 설명 |
|---|---|---|
| 게임 목록/검색/정렬 | `src/pages/GameList.tsx` (`/`) | 전체 게임 카드 목록, 제목 검색, 등록순·날짜순·찜순·별점순·제목순 정렬 |
| 게임 상세 | `src/pages/GameDetail.tsx` (`/game/:id`) | 게임 정보, 영상(react-player), 찜하기, 별점 평가, 댓글 |
| 카테고리별 게임 | `src/pages/CategoryPage.tsx` (`/category/:type/:value`) | 개발사·플랫폼·모드·태그별 게임 목록 |
| 커뮤니티 게시판 | `src/pages/Community.tsx` (`/community`) | 카테고리 탭, 검색, 무한 스크롤 게시글 목록 |
| 글쓰기 | `src/pages/WriteEditor.tsx` (`/write`) | Tiptap 기반 리치 텍스트 에디터(굵게·색상·글머리·이미지·링크 등) |
| 게시글 상세 | `src/pages/PostDetail.tsx` (`/community/:id`) | 본문, 좋아요/스크랩, 댓글·대댓글 |
| 마이페이지 | `MyPosts.tsx`/`MyComments.tsx`/`MyScraps.tsx`/`LikedGames.tsx` | 내가 쓴 글/댓글, 스크랩한 글, 찜한 게임 목록 |
| Steam 뉴스 | `src/pages/SteamNews.tsx` (`/steamnews`) | 업데이트/이벤트 필터, 키워드 검색이 가능한 뉴스 피드 |
| 실시간 오픈채팅 | `src/pages/Chat.tsx` (`/chat`) | Socket.IO 기반 1개의 공개 채팅방 |
| 회원 인증 | `src/components/modals/*.tsx` | 로그인/회원가입/아이디·비밀번호 찾기/정보수정/비밀번호 변경 모달 |

## 동작 방식

1. `src/main.tsx`가 React 앱을 `#root`에 마운트하고, `App.tsx`가 `react-router-dom`으로 각 페이지 라우트를 정의합니다.
2. 모든 REST 요청은 `src/axiosInstance.ts`를 거칩니다. 요청 인터셉터가 `localStorage`의 `token`을 `Authorization: Bearer` 헤더에 자동으로 붙이고, 응답 인터셉터는 `401` 응답을 받으면 토큰을 지우고 `tokenExpired` 이벤트를 발생시켜 로그아웃 상태로 되돌립니다.
3. 로그인(`LoginModal`) 성공 시 서버가 내려준 JWT를 `localStorage`에 저장하고, 페이로드를 직접 디코딩해 `userId`/`nickname`을 화면 상태에 반영합니다(별도 인증 라이브러리 없이 `atob` 기반 수동 디코딩).
4. `Chat.tsx`는 REST와 별개로 `socket.io-client`로 `VITE_API_BASE_URL`에 소켓을 연결하고, JWT를 `auth.token`으로 전달해 인증합니다. 최초 메시지 목록은 `GET /chat/messages`로 불러오고, 이후 메시지는 `chat message` 이벤트를 주고받아 실시간으로 갱신합니다.
5. 배포본(Vercel)은 `vercel.json`의 `rewrites`로 `/api/*` 요청을 `gamenest-server.onrender.com`으로 프록시하고 나머지 경로는 `index.html`로 보내 SPA 라우팅을 지원합니다. 단, 프론트 코드는 `/api/*` 상대경로가 아니라 `VITE_API_BASE_URL` 절대경로로 직접 요청하므로 이 리라이트 규칙은 실제로는 사용되지 않는 것으로 보입니다(자세한 내용은 [참고](#참고) 참조).

## 기술 스택

- **프레임워크**: React 18, TypeScript, Vite 7
- **라우팅**: React Router v6
- **스타일**: TailwindCSS 3 (PostCSS + Autoprefixer)
- **통신**: Axios(JWT 인터셉터 포함), Socket.IO Client(실시간 채팅)
- **에디터**: Tiptap(`@tiptap/react`, `starter-kit` 및 확장 모듈들)
- **UI 보조**: lucide-react, react-icons, react-infinite-scroll-component, react-player, react-chat-elements
- **코드 품질**: ESLint(typescript-eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh)
- **배포**: Vercel

`package.json`에는 있지만 `src/` 어디에서도 import되지 않는(코드에서 미사용) 의존성: `fuse.js`, `dayjs`, `clsx`, `jwt-decode` — 실제 JWT 디코딩은 각 컴포넌트가 `atob`로 직접 구현하고 있습니다.

## 프로젝트 구조

```
GameNest/
├─ public/
│  └─ vite.svg              # 기본 파비콘. GameCard가 참조하는 /placeholder.png는 실제로 존재하지 않음(깨진 이미지 폴백)
├─ src/
│  ├─ main.tsx               # 엔트리포인트, React root 렌더링
│  ├─ App.tsx                 # 라우터 정의(전 페이지 <Route> 매핑)
│  ├─ axiosInstance.ts        # baseURL=VITE_API_BASE_URL, JWT 자동첨부, 401 처리 공용 axios 인스턴스
│  ├─ App.css / index.css     # Tailwind 지시자만 사용, Vite 템플릿 기본 스타일은 주석 처리됨
│  ├─ vite-env.d.ts
│  ├─ assets/react.svg        # Vite 템플릿 잔재로 보이는 미사용 자산
│  ├─ layout/
│  │  └─ Nav.tsx              # 상단 내비게이션, 카테고리 드롭다운, 로그인/사용자 메뉴, 인증 모달 트리거
│  ├─ components/
│  │  ├─ common/GameCard.tsx      # 게임 목록/카테고리/찜 목록 공용 카드 UI
│  │  ├─ comments/comments.tsx    # 게임·커뮤니티 공용 댓글/대댓글 컴포넌트
│  │  └─ modals/                  # 로그인·회원가입·아이디/비번찾기·정보수정·비번변경·별점 모달 8종
│  └─ pages/
│     ├─ GameList.tsx         # "/" 전체 게임 목록·검색·정렬
│     ├─ GameDetail.tsx       # "/game/:id" 게임 상세·찜·별점·댓글
│     ├─ CategoryPage.tsx     # "/category/:type/:value" 카테고리별 게임 목록
│     ├─ Community.tsx        # "/community" 게시판 목록
│     ├─ WriteEditor.tsx      # "/write" 글쓰기 에디터
│     ├─ PostDetail.tsx       # "/community/:id" 게시글 상세
│     ├─ MyPosts.tsx          # "/myposts" 내가 쓴 글
│     ├─ MyComments.tsx       # "/myComment" 내가 쓴 댓글
│     ├─ MyScraps.tsx         # "/myScrap" 스크랩한 글
│     ├─ LikedGames.tsx       # "/likeGame" 찜한 게임
│     ├─ SteamNews.tsx        # "/steamnews" Steam 뉴스 (파일명과 달리 export default 컴포넌트명은 News)
│     └─ Chat.tsx             # "/chat" Socket.IO 실시간 채팅
├─ index.html                 # Vite 엔트리 HTML(타이틀이 기본값 "Vite + React + TS" 그대로 남아있음)
├─ vite.config.ts             # dev 서버 프록시: /api → http://192.168.0.3:5000 (로컬 백엔드)
├─ vercel.json                 # 배포 시 /api/* → gamenest-server.onrender.com 리라이트 + SPA fallback
├─ tailwind.config.cjs / postcss.config.cjs
├─ eslint.config.js
├─ tsconfig.json / tsconfig.app.json / tsconfig.node.json
└─ .env                        # VITE_API_BASE_URL=https://gamenest2.ddns.net
```

## 통신 방식 / API

프론트엔드는 `axiosInstance`(baseURL = `VITE_API_BASE_URL`)를 통해 아래 REST 엔드포인트를 호출합니다.

| 영역 | 메서드 & 경로 | 사용 위치 |
|---|---|---|
| 인증 | `POST /auth/login` | LoginModal |
| 인증 | `POST /auth/register` | SignupModal |
| 인증 | `POST /auth/find-password` | FindPasswordModal |
| 인증 | `PUT /auth/update-password-no-login` | ChangePasswordModal |
| 인증 | `PUT /auth/change-password` | updatePWModal |
| 인증 | `PATCH /auth/update` | ModifyInfoModal |
| 게임 | `GET /game/list?sort=` | GameList |
| 게임 | `GET /game/:id/detail?user_id=` | GameDetail |
| 게임 | `POST /game/:id/like` | GameDetail |
| 게임 | `POST /game/:id/rating` | GameDetail |
| 게임 | `GET /game/likes` | LikedGames |
| 게임 | `GET /game/category/:type/:value?sort=` | CategoryPage |
| 커뮤니티 | `GET /community?category=&search=` | Community |
| 커뮤니티 | `POST /community/:id` (조회수 증가) | Community |
| 커뮤니티 | `GET /community/:id` | PostDetail |
| 커뮤니티 | `POST /community/:id/action` (`type: "like"\|"scrap"`) | PostDetail |
| 커뮤니티 | `POST /community/write` | WriteEditor |
| 커뮤니티 | `GET /community/my-posts` | MyPosts |
| 댓글 | `GET/POST /gameComment/:id/comments`, `PUT/DELETE /gameComment/:id/comments/:commentId` | Comments (type="game") |
| 댓글 | `GET/POST /communityComment/:id/comments`, `PUT/DELETE /communityComment/:id/comments/:commentId` | Comments (type="community") |
| 마이페이지 | `GET /myComment` | MyComments |
| 마이페이지 | `GET /myScrap` | MyScraps |
| 채팅 | `GET /chat/messages` | Chat |

실시간 채팅(Socket.IO, `VITE_API_BASE_URL`에 연결):

| 이벤트 | 방향 | 페이로드 |
|---|---|---|
| `chat message` | emit(전송) | `{ text: string }` |
| `chat message` | on(수신) | `{ user: string; text: string; date: string }` |
| `connect_error` | on | 연결 실패 로그 |

## 시작하기

**요구 사항**: Node.js, npm, 그리고 위 API를 제공하는 백엔드 서버(별도 저장소, 이 프론트는 백엔드 없이는 대부분의 기능이 동작하지 않습니다)

```bash
# 의존성 설치
npm install

# .env에 백엔드 주소 설정 (예시)
# VITE_API_BASE_URL=http://localhost:5000

# 개발 서버 실행
npm run dev
```

| 명령어 | 설명 |
|---|---|
| `npm run dev` | Vite 개발 서버 실행 (기본 포트 5173) |
| `npm run build` | 타입 체크(`tsc -b`) 후 프로덕션 빌드 |
| `npm run lint` | ESLint 검사 |
| `npm run preview` | 빌드 결과 로컬 미리보기 |
| `npm run tw:init` | Tailwind 설정 파일 재생성 |

## 참고

- **`FindIdModal.tsx`가 공용 axios 인스턴스를 우회합니다**: 다른 모든 모달/페이지는 `axiosInstance`(=`VITE_API_BASE_URL`)를 쓰는데, 이 모달만 `axios.post("http://192.168.0.4:5000/auth/find-id", ...)`로 하드코딩된 로컬 IP를 직접 호출합니다. 배포 환경에서는 동작하지 않을 가능성이 높습니다.
- **`WriteEditor.tsx`의 작성자 ID가 하드코딩되어 있습니다**: 다른 페이지는 JWT를 디코딩해 로그인 사용자 ID를 구하는데, 글쓰기 저장 시에는 `const user_id = 1;`로 고정되어 있어 실제 로그인 사용자와 무관하게 항상 1번 사용자로 글이 등록됩니다.
- **`vercel.json`의 `/api/*` 리라이트가 실제로 쓰이지 않는 것으로 보입니다**: 프론트는 axios `baseURL`을 `VITE_API_BASE_URL`(절대 URL)로 직접 지정해 호출하므로, `/api/...` 상대경로 요청 자체가 발생하지 않습니다. `vite.config.ts`의 dev 프록시(`/api` → `192.168.0.3:5000`)도 마찬가지로 코드에서 사용되는 경로 패턴과 일치하지 않습니다.
- **`SteamNews.tsx`에 대량의 죽은 코드가 남아있습니다**: 파일 대부분(약 1,000줄)이 이전 구현들의 주석 처리된 히스토리이고, 실제로 사용되는 컴포넌트는 파일 맨 아래의 `News`(default export) 하나뿐입니다.
- **미사용 의존성**: `fuse.js`, `dayjs`, `clsx`, `jwt-decode`가 `package.json`에 있지만 `src/` 코드 어디에서도 import되지 않습니다. JWT 디코딩은 각 파일에서 `atob` 기반으로 직접 구현되어 있습니다.
- **`GameCard`의 이미지 폴백 파일이 없습니다**: 썸네일 로드 실패 시 `/placeholder.png`로 대체하지만 `public/`에 해당 파일이 존재하지 않아, 원본 이미지가 깨지면 대체 이미지도 함께 깨집니다.
- **`index.html`의 `<title>`이 Vite 기본값(`Vite + React + TS`)** 그대로이며 "GameNest"로 바뀌어 있지 않습니다.
- 백엔드(REST API, Socket.IO 서버, DB)는 이 저장소에 포함되어 있지 않습니다. `.env`의 `VITE_API_BASE_URL`(`https://gamenest2.ddns.net`)과 `vercel.json`에 등장하는 `https://gamenest-server.onrender.com`이 서로 다른 백엔드 주소를 가리키고 있어, 실제 운영 환경에서 어떤 것이 최종적으로 쓰이는지는 배포 설정을 별도로 확인해야 합니다.
