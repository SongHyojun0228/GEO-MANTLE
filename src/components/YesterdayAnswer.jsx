import React from 'react';

function YesterdayAnswer({ yesterdayData }) {
  if (!yesterdayData || !yesterdayData.country) {
    return null;
  }

  const { country, guessCount } = yesterdayData;

  return (
    <div className="w-full max-w-md bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-lg shadow-lg mb-4">
      <h2 className="text-2xl font-semibold text-purple-200 mb-3">📅 어제의 정답</h2>
      <div className="bg-black bg-opacity-30 p-4 rounded-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl font-bold text-white">{country.name}</span>
          <span className="text-lg text-purple-300">{country.englishName}</span>
        </div>
        <div className="text-gray-300 mt-3">
          <div className="flex justify-between items-center">
            <span>나의 추측 횟수:</span>
            <span className="font-bold text-yellow-300">{guessCount}번</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YesterdayAnswer;
