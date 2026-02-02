# Geo-Mantle 🌍

Geo-Mantle은 플레이어가 추측한 국가와 실제 정답 국가의 근접성을 기반으로 미스터리 국가를 식별하는 대화형 지리 추측 게임입니다. 매일 새로운 도전이 제시되며, 플레이어는 각 추측에 대한 정답과의 거리 및 방향에 대한 피드백을 받습니다.

## ✨ 기능

*   **일일 챌린지:** 매일 새로운 미스터리 국가를 추측합니다.
*   **인터랙티브 지도:** Leaflet 기반의 글로벌 지도에서 추측을 시각화합니다.
*   **근접성 피드백:** 각 추측에 대해 실시간 거리 (km) 및 방향 화살표를 받습니다.
*   **유사도 점수:** 추측이 정답과 얼마나 가까운지 백분율 유사도 점수로 확인합니다.
*   **추측 기록:** 그날의 모든 추측 기록을 추적합니다.
*   **안내 모달:** 게임 플레이 방법에 대한 명확한 안내를 제공합니다.
*   **결과 공유:** 게임 결과를 클립보드에 쉽게 복사하여 친구들과 공유할 수 있습니다.
*   **지속성:** 게임 진행 상황은 당일에 한해 로컬에 저장됩니다.

## 🚀 사용된 기술

*   **React**: 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리입니다.
*   **Vite**: 번개처럼 빠른 개발 경험을 제공하는 고속 빌드 도구입니다.
*   **Leaflet**: 모바일 친화적인 대화형 지도를 위한 오픈 소스 JavaScript 라이브러리입니다.
*   **React-Leaflet**: Leaflet 지도를 위한 React 컴포넌트입니다.
*   **Tailwind CSS**: 빠른 UI 개발을 위한 유틸리티 우선 CSS 프레임워크입니다.
*   **OpenStreetMap Nominatim**: 위치 이름을 좌표로 변환하는 지오코딩 서비스입니다.

## 🛠️ 설치

로컬 환경에서 프로젝트를 설정하려면 다음 간단한 단계를 따르십시오.

### 전제 조건

[Node.js](https://nodejs.org/en/) (npm 포함)가 설치되어 있는지 확인하십시오. 선호하는 경우 [Yarn](https://yarnpkg.com/)을 사용할 수도 있습니다.

### 저장소 복제 (Clone)

```bash
git clone https://github.com/your-username/geo-mantle.git
cd geo-mantle
```

### 의존성 설치

```bash
npm install
# 또는
yarn install
```

## 🎮 사용법

### 개발 서버 실행

개발 모드로 프로젝트를 실행하려면:

```bash
npm run dev
# 또는
yarn dev
```

[http://localhost:5173](http://localhost:5173) (또는 터미널에 표시되는 포트)를 열어 브라우저에서 확인하십시오. 파일을 편집하면 페이지가 자동으로 다시 로드됩니다.

### 배포용 빌드

프로덕션용 애플리케이션을 빌드하려면:

```bash
npm run build
# 또는
yarn build
```

이 명령은 React를 프로덕션 모드로 번들링하고 최적의 성능을 위해 빌드를 최적화합니다. 빌드된 결과물은 `dist/` 디렉토리에 저장됩니다.

## ☁️ 배포

이 프로젝트는 프런트엔드 전용 애플리케이션이며 정적 호스팅 서비스에 쉽게 배포할 수 있습니다. [Vercel](https://vercel.com/)에 원활하게 배포되도록 구성되었습니다.

**배포된 사이트:** [https://geo-mantle.vercel.app/](https://geo-mantle.vercel.app/)

## 🔍 SEO 및 수익 창출

이 프로젝트는 Google 검색 결과에 잘 노출되고 광고 수익을 창출하기 위해 다음과 같이 설정되었습니다.

*   **Google AdSense**: `index.html`에 애드센스 스크립트와 메타 태그가 추가되었으며, 루트 디렉토리에 `ads.txt` 파일이 포함되어 광고 게재를 위한 기본 설정이 완료되었습니다.
*   **Google Search Console**: 사이트 소유권 확인을 위해 `index.html`에 `google-site-verification` 메타 태그가 추가되었습니다.
*   **Sitemap**: 검색 엔진이 사이트 구조를 더 잘 이해하고 크롤링할 수 있도록 `public/sitemap.xml` 파일이 생성되었습니다.

## 라이선스

MIT 라이선스에 따라 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하십시오.

## 문의

Your Name - [your_email@example.com](mailto:your_email@example.com)
프로젝트 링크: [https://github.com/your-username/geo-mantle](https://github.com/your-username/geo-mantle)