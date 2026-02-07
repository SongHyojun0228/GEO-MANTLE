import React from 'react';

function GameStats({ stats, averageGuesses }) {
  return (
    <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
      <h2 className="text-2xl font-semibold text-teal-400 mb-4">📊 나의 통계</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 p-4 rounded-md text-center">
          <div className="text-3xl font-bold text-teal-300">{stats.totalPlays}</div>
          <div className="text-sm text-gray-400 mt-1">총 플레이</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-md text-center">
          <div className="text-3xl font-bold text-green-400">{stats.successfulGames}</div>
          <div className="text-sm text-gray-400 mt-1">성공한 게임</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-md text-center">
          <div className="text-3xl font-bold text-yellow-400">{averageGuesses}</div>
          <div className="text-sm text-gray-400 mt-1">평균 추측 횟수</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-md text-center">
          <div className="text-3xl font-bold text-orange-400">{stats.currentStreak}</div>
          <div className="text-sm text-gray-400 mt-1">연속 성공</div>
        </div>
      </div>
      <div className="mt-4 bg-gray-700 p-3 rounded-md text-center">
        <div className="text-gray-300">
          최고 연속 기록: <span className="font-bold text-purple-400">{stats.bestStreak}</span>회
        </div>
      </div>
    </div>
  );
}

export default GameStats;
