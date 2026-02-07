# Adinplay 연동 가이드

## 📋 현재 상태

✅ **완료된 작업:**
- 힌트 시스템 구현 (대륙 힌트, 방향 힌트)
- 광고 시청 추적 시스템
- Adinplay SDK 연동 준비 코드
- 테스트 모드로 동작 가능

⏳ **대기 중:**
- Adinplay 계정 승인
- Game ID 발급

---

## 🚀 Adinplay 승인 후 할 일

### 1단계: index.html 수정

`index.html` 파일에서 Adinplay 스크립트 주석을 해제하세요:

```html
<!-- 현재 (주석 처리됨) -->
<!--
  <script
    async
    src="https://api.adinplay.com/libs/aiptag/pub/GEO/geomantle.com/tag.min.js"
    data-game-id="YOUR_GAME_ID"
  ></script>
-->

<!-- 승인 후 (주석 해제 및 ID 교체) -->
<script
  async
  src="https://api.adinplay.com/libs/aiptag/pub/GEO/geomantle.com/tag.min.js"
  data-game-id="실제_발급받은_GAME_ID"
></script>
```

### 2단계: 테스트 모드 비활성화

`src/utils/adinplay.js` 파일을 열고:

```javascript
// 변경 전
const TESTING_MODE = true;

// 변경 후
const TESTING_MODE = false;
```

### 3단계: 빌드 및 배포

```bash
npm run build
```

배포 후 실제 환경에서 광고가 정상적으로 표시되는지 확인하세요.

---

## 🎮 힌트 시스템 작동 방식

### 힌트 1: 대륙 힌트
- **해금 조건:** 광고 1회 시청
- **내용:** "정답 국가는 [대륙]에 위치해 있습니다"
- **예시:** "정답 국가는 아시아에 위치해 있습니다!"

### 힌트 2: 방향 힌트
- **해금 조건:** 광고 2회 시청
- **내용:** 가장 가까운 추측에서의 방향과 거리
- **예시:** "일본에서 ↖️ 방향으로 약 1200km 떨어져 있습니다!"

---

## 🧪 테스트 방법

### 현재 (테스트 모드)
1. "광고 보고 힌트 받기" 버튼 클릭
2. 0.5초 후 자동으로 힌트 해금
3. 콘솔에 `[Adinplay 테스트 모드]` 메시지 표시

### 프로덕션 (실제 광고)
1. "광고 보고 힌트 받기" 버튼 클릭
2. Adinplay 광고 영상 재생
3. 광고 시청 완료 후 힌트 해금

---

## 📊 수익 모델

### AdSense (일반 콘텐츠)
- 게임 완료 모달
- 추측 리스트 (3번째 항목 후)
- 통계/아카이브 페이지

### Adinplay (보상형)
- 대륙 힌트 (1회 시청)
- 방향 힌트 (2회 시청)

---

## ⚠️ 주의사항

1. **AdSense와 Adinplay 병행**
   - 두 플랫폼 모두 정책을 준수해야 합니다
   - Adinplay 광고는 사용자 선택에 의해서만 표시됩니다
   - AdSense 광고는 콘텐츠가 충분한 곳에만 배치됩니다

2. **테스트 환경**
   - 개발 환경(`npm run dev`)에서는 광고 플레이스홀더만 표시됩니다
   - 실제 광고는 프로덕션 빌드에서만 작동합니다

3. **광고 정책**
   - 사용자에게 광고 시청을 강제하지 마세요
   - 힌트 없이도 게임을 플레이할 수 있어야 합니다
   - 광고 클릭을 유도하는 문구를 사용하지 마세요

---

## 🔧 문제 해결

### 광고가 표시되지 않는 경우

1. **브라우저 콘솔 확인**
   ```javascript
   console.log(window.aipPlayer); // undefined이면 SDK 미로드
   ```

2. **스크립트 로드 확인**
   - 개발자 도구 > Network 탭에서 adinplay 스크립트 확인
   - Game ID가 정확한지 확인

3. **CORS 문제**
   - 배포된 도메인이 Adinplay에 등록되어 있는지 확인

### 힌트가 해금되지 않는 경우

1. **localStorage 확인**
   ```javascript
   localStorage.getItem('geoMantle_adsWatched');
   localStorage.getItem('geoMantle_hintsUnlocked');
   ```

2. **테스트 모드 확인**
   - `src/utils/adinplay.js`의 `TESTING_MODE` 값 확인

---

## 📞 지원

- Adinplay 지원: [Adinplay Dashboard](https://adinplay.com)
- Google AdSense 지원: [AdSense Help Center](https://support.google.com/adsense)

---

## ✅ 체크리스트

배포 전 확인사항:

- [ ] Adinplay 계정 승인 완료
- [ ] Game ID 발급 완료
- [ ] index.html의 스크립트 주석 해제 및 ID 교체
- [ ] adinplay.js의 TESTING_MODE를 false로 변경
- [ ] 로컬 환경에서 테스트 완료
- [ ] 프로덕션 빌드 완료
- [ ] 배포 후 실제 광고 표시 확인
- [ ] AdSense 광고도 정상 표시 확인
