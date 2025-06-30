# 🍊Tamnara-FE

**타임라인 기반 뉴스 탐색 플랫폼, 탐나라**의 프론트엔드입니다.<br/>
사용자는 뉴스를 검색하거나 생성/업데이트할 수 있으며, 뉴스는 타임라인 형태로 요약되어 최신순으로 정렬됩니다.<br/>
이를 통해 사용자는 빠르게 최신 이슈의 흐름과 인과를 한눈에 파악할 수 있습니다.<br/>

<br/>

## 주요 기능

### 👩‍💼 회원

- 카카오 소셜 로그인 및 회원가입
- 회원 정보 수정
- 회원 탈퇴

### 🗞️ 뉴스

- 뉴스 생성 및 업데이트
- 북마크 추가/삭제
- 댓글 작성 및 삭제
- 키워드 기반 뉴스 검색

### 🔔 알림

- 핫이슈 생성 알림
- 북마크 업데이트 및 삭제 예고
- 투표 시작 및 결과 공개 알림

### 🗳️ 투표

- 매주 새로운 투표 시작
- 매주 이전 투표 결과 공개

<br/>

## 기술 스택

| 기술 스택                          | 역할             |
| ---------------------------------- | ---------------- |
| React (TypeScript)                 | UI 개발          |
| Vite                               | 빌드 도구        |
| Zustand                            | 글로벌 상태 관리 |
| Axios                              | API 통신         |
| React Router                       | 페이지 라우팅    |
| Tailwind CSS + daisyUI + Heroicons | 스타일링         |

<br/>

## 프로젝트 실행

```bash
# 패키지 설치
npm install

# 로컬 개발 서버 실행
npm run dev

# 디버깅 용 로컬 개발 서버 빌드
npm run build
```

<br/>

## 주요 디렉토리 구조

```bash
frontend/
├── src/
│   ├── assets/              # 프로젝트 이미지 및 아이콘
│   ├── components/          # 공통 컴포넌트: 헤더, 검색창, 메뉴 사이드바, 알림창 사이드바
│   │   ├── form/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── ...
│   ├── constants/           # 메시지, URL 등 상수 정의
│   ├── hooks/               # 커스텀 훅
│   ├── pages/               # 페이지별 컴포넌트
│   │   ├── PN/              # 뉴스 관련 페이지
│   │   ├── PU/              # 회원 관련 페이지
│   │   ├── PV/              # 투표 관련 페이지
│   │   └── PL/              # 로딩 페이지 등
│   ├── routes/              # 라우팅 설정
│   ├── stores/              # Zustand 기반 글로벌 상태 관리
│   ├── utils/               # 공통 유틸리티 함수
│   ├── App.tsx              # 앱 엔트리 포인트
│   ├── main.tsx             # 렌더링 및 초기 설정
│   └── index.css            # 글로벌 CSS
├── dist/                    # 빌드 결과물
├── Dockerfile               # 배포용 Docker 설정
├── Dockerfile.dev           # 개발용 Docker 설정
├── nginx.conf               # Nginx 설정 파일
├── package.json
├── tsconfig.json            # TypeScript 설정
├── tailwind.config.js       # Tailwind CSS 설정
├── vite.config.ts           # Vite 설정
└── README.md

```

<br/>

## 페이지

<h3>메인 페이지</h3>
<table>
  <thead>
    <tr>
      <th>페이지</th>
      <th>설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/233b2cb1-e33a-4ee1-906c-eef91928b90a" alt="메인 페이지"/></td>
      <td>헤더의 '탐나라' 로고 클릭 시 메인 페이지로 이동한다.<br/>배너 캐러셀을 통해 핫이슈를 확인할 수 있다. 일반 뉴스 목록은 전체/경제/스포츠/연예/KTB 카테고리로 나누어진다.<br/>뉴스 목록은 업데이트일의 역순으로 정렬되며, 뉴스 카드 20개 단위로 무한 스크롤링 기능이 적용된다.<br/>뉴스 카드를 클릭하면 뉴스 상세 페이지로 이동한다.</td>
    </tr>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/7c488228-276e-40d9-bffb-6611d565ec7c" alt="로그아웃/메뉴 사이드바"/></td>
      <td>헤더의 햄버거 아이콘을 클릭하면 나타난다.<br/>- '로그인' 버튼 → 로그인 페이지로 이동</td>
    </tr>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/af2d1584-8962-4e00-8df4-678b80b6e90b"  alt="로그인/마이페이지"/></td>
      <td>헤더의 햄버거 아이콘을 클릭하면 나타난다.<br/>- '회원정보 수정' 버튼 → 회원정보 수정 페이지로 이동<br/>- '북마크 목록' 버튼 → 북마크 목록 페이지로 이동<br/>- '투표하기' 버튼 → 투표 페이지로 이동<br/>- '로그아웃' 버튼을 클릭 → 로그아웃</td>
    </tr>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/4c211425-06cb-454c-83b3-f499b6184091" alt="알림창 사이드바"/></td>
      <td>헤더의 알림 아이콘을 클릭하면 나타난다.<br/>핫이슈, 북마크 알림, 투표 알림 등 다양한 실시간 알림 내역을 확인할 수 있다.</td>
    </tr>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/a8503a79-e16b-49ee-87c9-cf097ef577fd" alt="검색창 컴포넌트"/></td>
      <td>헤더의 돋보기 아이콘을 클릭하면 나타난다.<br/>6개 이하의 태그를 입력하여 뉴스를 검색할 수 있다.<br/>올바르지 않은 태그를 입력하면 토스트 메시지가 나타난다.</td>
    </tr>
  </tbody>
</table>

<h3>로그인 페이지</h3>
<table>
  <thead>
    <tr>
      <th>페이지</th>
      <th>설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/f31808ec-e854-4bd7-8f7c-b11c71492edd" alt="로그인 페이지"/></td>
      <td>카카오 로그인 버튼을 클릭하여 로그인할 수 있다.<br/>로그인에 성공하면 메인 페이지로 이동한다.</td>
    </tr>
  </tbody>
</table>

<h3>회원정보 수정 페이지</h3>
<table>
  <thead>
    <tr>
      <th>페이지</th>
      <th>설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/ff407a6c-4051-4e1a-ba14-748e980305d7" alt="회원정보 수정 페이지"/></td>
      <td>이메일을 확인하고 닉네임을 수정하거나, 회원탈퇴 모달창을 띄울 수 있다.</td>
    </tr>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/5a639bc3-a21c-4240-84d9-70d62e6ae7c0" alt="회원탈퇴 모달창"/></td>
      <td>탈퇴 문구를 입력하고 회원탈퇴를 할 수 있다.</td>
    </tr>
  </tbody>
</table>

<h3>북마크 목록 페이지</h3>
<table>
  <thead>
    <tr>
      <th>페이지</th>
      <th>설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/b91994e4-3aea-40d2-9e5f-5653cc35924f" alt="북마크 목록 페이지"/></td>
      <td>북마크한 뉴스 목록을 조회할 수 있다.<br/>뉴스 목록은 북마크한 역순으로 정렬되며, 뉴스 카드 20개 단위로 무한 스크롤링 기능이 적용된다.</td>
    </tr>
  </tbody>
</table>

<h3>검색 결과 페이지</h3>
<table>
  <thead>
    <tr>
      <th>페이지</th>
      <th>설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/5cd38dc8-4ee7-4f46-84a9-3c92be0f4c5a" alt="검색 결과 페이지"/></td>
      <td>검색 결과를 조회할 수 있다.<br/>뉴스 목록은 업데이트일의 역순으로 정렬되며, 뉴스 카드 20개 단위로 무한 스크롤링 기능이 적용된다.</td>
    </tr>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/05a134ec-bf0b-4aa1-8e07-afc82c6c4a3e" alt="검색 결과 페이지/타임라인 생성"/></td>
      <td>검색 키워드 기반으로 뉴스를 생성할 수 있다.<br/>뉴스 생성에 성공하면 해당 뉴스의 상세 페이지로 이동한다.</td>
    </tr>
  </tbody>
</table>

<h3>뉴스 상세 페이지</h3>
<table>
  <thead>
    <tr>
      <th>페이지</th>
      <th>설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/abe54f1c-5684-4661-8744-bbfb49933de3" alt="뉴스 상세 페이지"/></td>
      <td>뉴스의 상세 타임라인을 조회할 수 있다.</td>
    </tr>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/7a2b2367-73fe-4e6d-8d46-1f396c1f7117" alt="뉴스 상세 페이지/타임라인 카드 출처 확인"/></td>
      <td>타임라인 카드의 책 아이콘을 클릭하여 요약에 사용된 뉴스 출처를 확인할 수 있다.</td>
    </tr>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/444d8acb-847a-4e80-9248-ed8356ef6f1c" alt="뉴스 상세 페이지/여론 통계 및 댓글"/></td>
      <td>해당 이슈에 대한 대중 여론을 긍정/중립/부정으로 나누어 확인할 수 있다.<br/>댓글을 작성하여 다른 회원들과 의견을 나눌 수 있다.</td>
    </tr>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/fc64f165-929b-4f08-a47d-4e738a773279" alt="뉴스 상세 페이지/업데이트"/></td>
      <td>업데이트 버튼을 눌러 최신 정보를 기반으로 뉴스를 업데이트할 수 있다.<br/>마지막 업데이트일로부터 24시간이 지났을 경우에만 업데이트 가능하다.</td>
    </tr>
  </tbody>
</table>

<h3>투표 페이지</h3>
<table>
  <thead>
    <tr>
      <th>페이지</th>
      <th>설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/69af3a21-96e4-4687-a762-a2da7a46d84f" alt="투표 페이지/투표 전"/></td>
      <td>매주 업데이트되는 투표에 1회 참여할 수 있다.</td>
    </tr>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/896e418d-0881-4377-aa49-c5d224f1536d" alt="투표 페이지/투표 후"/></td>
      <td>투표에 참여하면 투표 폼이 비활성화된다.</td>
    </tr>
  </tbody>
</table>

<h3>로딩 페이지</h3>
<table>
  <thead>
    <tr>
      <th>페이지</th>
      <th>설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/e2bc058b-ba2e-45bd-a7c5-7398841f998b" alt="로딩 페이지" width="1385"/></td>
      <td>카카오 소셜 로그인이 오래 걸릴 경우 로딩 페이지가 나타난다.</td>
    </tr>
  </tbody>
</table>
