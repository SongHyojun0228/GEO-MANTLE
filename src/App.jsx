import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import { countries, getDailyAnswerCountry } from './data/countries';
import { getGeoDetails } from './utils/geo';
import world_map_1 from './assets/world_map_1.png';            
import world_map_2 from './assets/world_map_2.png';   

// Fix for default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

// Helper function to check if a name matches a country or its aliases
const matchesCountry = (nameToCheck, country) => {
  const lowerNameToCheck = nameToCheck.toLowerCase();
  if (country.name.toLowerCase() === lowerNameToCheck) return true;
  if (country.aliases && country.aliases.some(alias => alias.toLowerCase() === lowerNameToCheck)) return true;
  return false;
};

function App() {
  // Determine today's answer country
  const today = new Date();
  const currentDateString = today.toDateString();
  const todayAnswerCountry = getDailyAnswerCountry(today);

  // Initialize state from localStorage or default values
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState(() => {
    const savedDate = localStorage.getItem('geoMantle_date');
    if (savedDate === currentDateString) {
      const savedGuesses = localStorage.getItem('geoMantle_guesses');
      return savedGuesses ? JSON.parse(savedGuesses) : [];
    }
    return [];
  });
  const [isCorrect, setIsCorrect] = useState(() => {
    const savedDate = localStorage.getItem('geoMantle_date');
    if (savedDate === currentDateString) {
      const savedIsCorrect = localStorage.getItem('geoMantle_isCorrect');
      return savedIsCorrect ? JSON.parse(savedIsCorrect) : false;
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('결과 복사하기');
  const [uniqueGuessesCount, setUniqueGuessesCount] = useState(() => {
    const savedDate = localStorage.getItem('geoMantle_date');
    if (savedDate === currentDateString) {
      const savedUniqueGuessesCount = localStorage.getItem('geoMantle_uniqueGuessesCount');
      return savedUniqueGuessesCount ? JSON.parse(savedUniqueGuessesCount) : 0;
    }
    return 0;
  });
  const [showInstructionsModal, setShowInstructionsModal] = useState(false); // New state for instructions modal

  // Store the current date in localStorage if it's a new day or not set
  // This useEffect also handles resetting game state for a new day
  useEffect(() => {
    const savedDate = localStorage.getItem('geoMantle_date');
    if (savedDate !== currentDateString) {
      localStorage.setItem('geoMantle_date', currentDateString);
      // Ensure all game state is reset for a new day
      localStorage.removeItem('geoMantle_guesses');
      localStorage.removeItem('geoMantle_isCorrect');
      localStorage.removeItem('geoMantle_uniqueGuessesCount');
      // Update state directly if a reset occurs within this effect
      setGuesses([]);
      setIsCorrect(false);
      setUniqueGuessesCount(0);
    }
    // Debug log for the answer (always show for current day's answer)
    console.log('오늘의 정답 국가:', todayAnswerCountry.name);
  }, [currentDateString, todayAnswerCountry.name]); // Run once per day or on initial mount

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('geoMantle_guesses', JSON.stringify(guesses));
  }, [guesses]);

  useEffect(() => {
    localStorage.setItem('geoMantle_isCorrect', JSON.stringify(isCorrect));
  }, [isCorrect]);

  useEffect(() => {
    localStorage.setItem('geoMantle_uniqueGuessesCount', JSON.stringify(uniqueGuessesCount));
  }, [uniqueGuessesCount]);


  const geocodeLocation = async (locationName) => {
    try {
      // Prioritize country search for OpenStreetMap Nominatim
      const countryResponse = await fetch(`https://nominatim.openstreetmap.org/search?country=${locationName}&format=json&limit=1`);
      if (!countryResponse.ok) {
        throw new Error('Geocoding API request failed.');
      }
      const countryData = await countryResponse.json();
      if (countryData && countryData.length > 0) {
        const { lat, lon, display_name } = countryData[0];
        // Try to find the most relevant name for comparison (e.g., exact match or common name)
        const extractedName = countryData[0].address.country || display_name.split(',').find(part => part.trim().toLowerCase() === locationName.toLowerCase()) || display_name.split(',')[0];
        return { name: extractedName, lat: parseFloat(lat), lon: parseFloat(lon) };
      }

      // Fallback to general search if country-specific search fails
      const generalResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${locationName}&format=json&limit=1`);
      if (!generalResponse.ok) {
        throw new Error('Geocoding API request failed.');
      }
      const generalData = await generalResponse.json();
      if (generalData && generalData.length > 0) {
        const { lat, lon, display_name } = generalData[0];
        const extractedName = generalData[0].address.country || display_name.split(',').find(part => part.trim().toLowerCase() === locationName.toLowerCase()) || display_name.split(',')[0];
        return { name: extractedName, lat: parseFloat(lat), lon: parseFloat(lon) };
      }
      return null;
    } catch (err) {
      console.error("Geocoding error:", err);
      setError("위치 검색 중 오류가 발생했습니다. 다시 시도해주세요.");
      return null;
    }
  };

  const handleGuess = async (e) => {
    e.preventDefault();
    setError('');
    if (!guess) {
      setError("국가 이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    // Find in local list, checking aliases
    let guessedLocation = countries.find(country => matchesCountry(guess, country));

    if (!guessedLocation) {
      // If not in local list, try geocoding API
      guessedLocation = await geocodeLocation(guess);
    }

    if (guessedLocation) {
      const { lat: answerLat, lon: answerLon } = todayAnswerCountry;
      const { distance, direction } = getGeoDetails(
        guessedLocation.lat,
        guessedLocation.lon,
        answerLat,
        answerLon
      );

      const similarity = Math.max(0, 100 - (distance / 100)); // Simple similarity for now, max 100%

      const newGuess = {
        name: guessedLocation.name,
        lat: guessedLocation.lat, // Store lat/lon for marker
        lon: guessedLocation.lon, // Store lat/lon for marker
        distance: distance.toFixed(0),
        direction,
        similarity: similarity.toFixed(0),
      };

      // Check if this guess already exists in the list
      const existingGuessIndex = guesses.findIndex(
        (item) => matchesCountry(item.name, guessedLocation)
      );

      let updatedGuesses;
      if (existingGuessIndex !== -1) {
        // Remove the existing guess
        updatedGuesses = guesses.filter(
          (_, index) => index !== existingGuessIndex
        );
        // Add the new (re-guessed) item to the top
        setGuesses([newGuess, ...updatedGuesses]);
        // Do not increment uniqueGuessesCount for duplicates
      } else {
        // Add new guess to the top
        setGuesses((prev) => [newGuess, ...prev]);
        setUniqueGuessesCount((prevCount) => prevCount + 1); // Increment for unique guesses
      }

      // Check for correctness, using aliases for todayAnswerCountry
      if (matchesCountry(guessedLocation.name, todayAnswerCountry)) {
        setIsCorrect(true);
      }
    } else {
      setError("입력하신 국가를 찾을 수 없습니다. 다른 국가를 시도해주세요.");
    }
    setGuess('');
    setIsLoading(false);
  };

  const getSimilarityColor = (similarity) => {
    const sim = parseInt(similarity);
    if (sim > 90) return 'text-red-500';
    if (sim > 70) return 'text-orange-400';
    if (sim > 50) return 'text-yellow-300';
    return 'text-gray-400';
  };

  const formatResultsForClipboard = () => {
    let resultString = `Geo-Mantle 🌍\n`;
    resultString += `오늘의 정답: ${todayAnswerCountry.name}\n\n`;
    resultString += `나의 추측: ${uniqueGuessesCount}번만에 성공!\n\n`; // Use uniqueGuessesCount here

    guesses.forEach((item, index) => {
      // For visual feedback, could use emojis based on similarity or direction
      let visualCue = item.direction; // Using direction as a visual cue
      if (matchesCountry(item.name, todayAnswerCountry)) { // Check against aliases here too
        visualCue = '✅'; // Correct answer
      }

      resultString += `${item.name} ${visualCue} ${item.similarity}%\n`;
    });
    resultString += `\n#GeoMantle`; // A simple hashtag
    return resultString;
  };

  const handleCopyResults = async () => {
    try {
      const results = formatResultsForClipboard();
      await navigator.clipboard.writeText(results);
      setCopyFeedback('복사 완료!');
      setTimeout(() => setCopyFeedback('결과 복사하기'), 2000); // Reset text after 2 seconds
    } catch (err) {
      console.error("Failed to copy results:", err);
      setCopyFeedback('복사 실패!');
      setTimeout(() => setCopyFeedback('결과 복사하기'), 2000);
    }
  };

  const handleCloseModal = () => {
    setIsCorrect(false);
  };

  const handleToggleInstructionsModal = () => {
    setShowInstructionsModal((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full max-w-md flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-teal-400">🌍 Geo-Mantle</h1>
        <button
          onClick={handleToggleInstructionsModal}
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
        >
          어떻게 플레이하나요?
        </button>
      </header>

      <div className="flex flex-col items-center mt-4 space-y-4 mb-8 w-full max-w-md">
        <img src={world_map_1} alt="World Map 1" className="w-full h-auto rounded-lg shadow-md" />
        <img src={world_map_2} alt="World Map 2" className="w-full h-auto rounded-lg shadow-md" />
      </div>

      {/* Map Section */}
      <section className="w-full max-w-md mb-8">
        <div className="bg-gray-800 p-2 rounded-lg shadow-lg relative z-0">
          <MapContainer
            center={[20, 0]} // Center of the world
            zoom={2}
            minZoom={1}
            maxZoom={10}
            scrollWheelZoom={true}
            style={{ height: '300px', width: '100%', borderRadius: '8px' }}
            zoomControl={true} // Enable zoom controls
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {guesses.map((item, index) => (
              item.lat && item.lon && (
                <Marker key={index} position={[item.lat, item.lon]}>
                  <Popup>{item.name}</Popup>
                </Marker>
              )
            ))}
            {isCorrect && todayAnswerCountry.lat && todayAnswerCountry.lon && (
              <Marker position={[todayAnswerCountry.lat, todayAnswerCountry.lon]} icon={L.divIcon({
                className: 'my-custom-pin',
                iconAnchor: [0, 24],
                labelAnchor: [-6, 0],
                popupAnchor: [0, -36],
                html: `<span class="bg-green-500 text-white font-bold p-1 rounded-full text-xs whitespace-nowrap">${todayAnswerCountry.name} ✅</span>`
              })}>
                <Popup>정답: {todayAnswerCountry.name}</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </section>

      {/* Input Area */}
      <main className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <form onSubmit={handleGuess} className="flex flex-col space-y-4">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="국가 이름을 입력하세요..."
            className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-100"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? '검색 중...' : '추측하기'}
          </button>
        </form>
        {error && (
          <p className="text-red-400 mt-4 text-center">{error}</p>
        )}
      </main>

      {/* Result List */}
      <section className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">내 추측 ({uniqueGuessesCount}회)</h2>
        {guesses.length === 0 ? (
          <p className="text-gray-400">아직 추측이 없습니다. 첫 번째 국가를 입력해보세요!</p>
        ) : (
          <ul className="space-y-3">
            {guesses.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-3 bg-gray-700 rounded-md border border-gray-600"
              >
                <span className="text-gray-200 font-medium">{item.name}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">{item.distance} km</span>
                  <span className="text-2xl">{item.direction}</span>
                  <span className={`font-bold ${getSimilarityColor(item.similarity)}`}>
                    {item.similarity}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Success Modal (Placeholder) */}
      {isCorrect && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-700 p-8 rounded-lg shadow-xl text-center relative"> {/* Added relative for positioning */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold"
              aria-label="모달 닫기"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-green-400 mb-4">🎉 정답입니다! 🎉</h2>
            <p className="text-gray-200 mb-6">
              축하합니다! <span className="font-semibold">{todayAnswerCountry.name}</span>을(를) 맞혔습니다!
            </p>
            <button
              onClick={handleCopyResults}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
            >
              {copyFeedback}
            </button>
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      {showInstructionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-left relative max-w-lg">
            <button
              onClick={handleToggleInstructionsModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold"
              aria-label="설명 닫기"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-teal-400 mb-4">어떻게 플레이하나요?</h2>
            <div className="text-gray-200 space-y-3">
              <p>
                매일 새로운 국가가 오늘의 정답으로 선정됩니다. 당신의 목표는 이 정답 국가를 추측하는 것입니다.
              </p>
              <p>
                입력창에 국가 이름을 입력하고 "추측하기" 버튼을 누르면, 시스템은 당신이 입력한 국가와 정답 국가 사이의 **거리(km)**와 **방향(화살표)**을 계산하여 리스트로 보여줍니다.
              </p>
              <p>
                정답에 가까워질수록 리스트의 항목 색깔이 붉게 변하며 유사도를 %로 표시합니다.
              </p>
              <p>
                추측 기록은 매일 자정(00시)에 초기화됩니다. 그 전까지는 페이지를 새로고침해도 기록이 유지됩니다.
              </p>
              <p>
                "북한"과 "조선민주주의인민공화국"처럼 여러 이름으로 불리는 국가들은 모두 같은 국가로 인식됩니다.
              </p>
            </div>
            <button
              onClick={handleToggleInstructionsModal}
              className="mt-6 px-6 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors w-full"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;