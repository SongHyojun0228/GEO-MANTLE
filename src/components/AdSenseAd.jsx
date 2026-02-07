import React, { useEffect } from 'react';

function AdSenseAd({ adSlot, adFormat = 'auto', fullWidthResponsive = true, style = {} }) {
  useEffect(() => {
    try {
      // AdSense 광고 로드
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  // 개발 환경에서는 플레이스홀더 표시
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div
        className="bg-gray-700 border-2 border-dashed border-gray-500 rounded-md flex items-center justify-center"
        style={{ minHeight: '100px', ...style }}
      >
        <span className="text-gray-400 text-sm">📢 AdSense 광고 영역 (프로덕션에서 표시됨)</span>
      </div>
    );
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', ...style }}
      data-ad-client="ca-pub-6608961257112881"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive.toString()}
    ></ins>
  );
}

export default AdSenseAd;
