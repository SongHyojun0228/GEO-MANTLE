/**
 * Adinplay SDK 연동 유틸리티
 *
 * 사용 방법:
 * 1. Adinplay 승인 후 index.html의 스크립트 주석 해제
 * 2. Game ID를 실제 ID로 교체
 * 3. 아래 showRewardedAd 함수에서 TESTING_MODE를 false로 변경
 */

// 테스트 모드 (Adinplay 승인 전에는 true로 설정)
const TESTING_MODE = true;

/**
 * 보상형 광고 표시
 * @param {Function} onReward - 광고 시청 완료 시 호출될 콜백
 * @param {Function} onError - 광고 로드 실패 시 호출될 콜백
 */
export function showRewardedAd(onReward, onError) {
  if (TESTING_MODE) {
    // 테스트 모드: 즉시 보상 제공
    console.log('[Adinplay 테스트 모드] 광고 시청 완료 시뮬레이션');
    setTimeout(() => {
      onReward();
    }, 500);
    return;
  }

  // 실제 Adinplay SDK 사용
  if (window.aipPlayer && window.aipPlayer.showPreroll) {
    window.aipPlayer.showPreroll({
      onReward: () => {
        console.log('[Adinplay] 광고 시청 완료');
        onReward();
      },
      onError: (error) => {
        console.error('[Adinplay] 광고 로드 실패:', error);
        if (onError) onError(error);
      },
    });
  } else {
    console.error('[Adinplay] SDK가 로드되지 않았습니다.');
    if (onError) onError(new Error('Adinplay SDK not loaded'));
  }
}

/**
 * Adinplay SDK 로드 확인
 * @returns {boolean} SDK 로드 여부
 */
export function isAdinplayLoaded() {
  if (TESTING_MODE) return true;
  return typeof window.aipPlayer !== 'undefined';
}

/**
 * Adinplay 초기화 대기
 * @returns {Promise<void>}
 */
export function waitForAdinplay() {
  if (TESTING_MODE) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 50; // 5초 (100ms * 50)

    const checkInterval = setInterval(() => {
      attempts++;

      if (isAdinplayLoaded()) {
        clearInterval(checkInterval);
        console.log('[Adinplay] SDK 로드 완료');
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        console.error('[Adinplay] SDK 로드 시간 초과');
        reject(new Error('Adinplay SDK load timeout'));
      }
    }, 100);
  });
}

/**
 * 게임 시작 시 호출 (Adinplay에 게임 시작 알림)
 */
export function notifyGameStart() {
  if (TESTING_MODE) return;

  if (window.aipPlayer && window.aipPlayer.gameStart) {
    window.aipPlayer.gameStart();
    console.log('[Adinplay] 게임 시작 알림');
  }
}

/**
 * 게임 종료 시 호출 (Adinplay에 게임 종료 알림)
 */
export function notifyGameEnd() {
  if (TESTING_MODE) return;

  if (window.aipPlayer && window.aipPlayer.gameEnd) {
    window.aipPlayer.gameEnd();
    console.log('[Adinplay] 게임 종료 알림');
  }
}

export default {
  showRewardedAd,
  isAdinplayLoaded,
  waitForAdinplay,
  notifyGameStart,
  notifyGameEnd,
};
