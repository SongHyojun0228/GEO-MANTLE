import React, { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import { countries, getDailyAnswerCountry } from "./data/countries";
import { getGeoDetails } from "./utils/geo";
import {
  getStats,
  updateStatsOnGameComplete,
  getAverageGuesses,
  saveYesterdayAnswer,
  getYesterdayAnswer,
  addToArchive,
  getArchive,
  getAdsWatched,
  incrementAdsWatched,
  getUnlockedHints,
  unlockHint,
  checkAndResetForNewDay,
} from "./utils/storage";
import {
  generateContinentHint,
  generateDistanceHint,
  canUnlockHint,
  adsNeededForNextHint,
} from "./utils/hints";
import { showRewardedAd } from "./utils/adinplay";
import { useLanguage } from "./i18n/LanguageContext";
import GameStats from "./components/GameStats";
import YesterdayAnswer from "./components/YesterdayAnswer";
import RecentArchive from "./components/RecentArchive";
import HintSystem from "./components/HintSystem";
import AdSenseAd from "./components/AdSenseAd";
import world_map_1 from "./assets/world_map_1.png";
import world_map_2 from "./assets/world_map_2.png";

// Fix for default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/marker-icon-2x.png",
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
});

// Helper function to check if a name matches a country or its aliases
const matchesCountry = (nameToCheck, country) => {
  const lowerNameToCheck = nameToCheck.toLowerCase();
  if (country.name.toLowerCase() === lowerNameToCheck) return true;
  if (country.englishName && country.englishName.toLowerCase() === lowerNameToCheck) return true;
  if (
    country.aliases &&
    country.aliases.some((alias) => alias.toLowerCase() === lowerNameToCheck)
  )
    return true;
  return false;
};

// Helper to get display name based on language
const getCountryDisplayName = (country, lang) => {
  if (typeof country === 'string') return country;
  return lang === 'en' ? (country.englishName || country.name) : country.name;
};

function App() {
  const { lang, setLang, t } = useLanguage();

  // Determine today's answer country
  const today = new Date();
  const currentDateString = today.toDateString();
  const todayAnswerCountry = getDailyAnswerCountry(today);

  // Initialize state from localStorage or default values
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState(() => {
    const savedDate = localStorage.getItem("geoMantle_date");
    if (savedDate === currentDateString) {
      const savedGuesses = localStorage.getItem("geoMantle_guesses");
      return savedGuesses ? JSON.parse(savedGuesses) : [];
    }
    return [];
  });
  const [isCorrect, setIsCorrect] = useState(() => {
    const savedDate = localStorage.getItem("geoMantle_date");
    if (savedDate === currentDateString) {
      const savedIsCorrect = localStorage.getItem("geoMantle_isCorrect");
      return savedIsCorrect ? JSON.parse(savedIsCorrect) : false;
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");
  const [uniqueGuessesCount, setUniqueGuessesCount] = useState(() => {
    const savedDate = localStorage.getItem("geoMantle_date");
    if (savedDate === currentDateString) {
      const savedUniqueGuessesCount = localStorage.getItem(
        "geoMantle_uniqueGuessesCount",
      );
      return savedUniqueGuessesCount ? JSON.parse(savedUniqueGuessesCount) : 0;
    }
    return 0;
  });
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [stats, setStats] = useState(() => getStats());
  const [archive, setArchive] = useState(() => getArchive());
  const [yesterdayAnswer, setYesterdayAnswer] = useState(() =>
    getYesterdayAnswer(),
  );
  const [adsWatchedCount, setAdsWatchedCount] = useState(() => getAdsWatched());
  const [unlockedHints, setUnlockedHints] = useState(() => getUnlockedHints());

  useEffect(() => {
    const isNewDay = checkAndResetForNewDay(currentDateString);

    if (isNewDay) {
      setGuesses([]);
      setIsCorrect(false);
      setUniqueGuessesCount(0);
      setAdsWatchedCount(0);
      setUnlockedHints({ continent: false, distance: false });

      const newYesterdayAnswer = getYesterdayAnswer();
      setYesterdayAnswer(newYesterdayAnswer);
    }

    console.log("Today's answer:", todayAnswerCountry.name);
  }, [currentDateString, todayAnswerCountry.name]);

  useEffect(() => {
    localStorage.setItem("geoMantle_guesses", JSON.stringify(guesses));
  }, [guesses]);

  useEffect(() => {
    localStorage.setItem("geoMantle_isCorrect", JSON.stringify(isCorrect));
  }, [isCorrect]);

  useEffect(() => {
    localStorage.setItem(
      "geoMantle_uniqueGuessesCount",
      JSON.stringify(uniqueGuessesCount),
    );
  }, [uniqueGuessesCount]);

  const geocodeLocation = async (locationName) => {
    try {
      const countryResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?country=${locationName}&format=json&limit=1`,
      );
      if (!countryResponse.ok) {
        throw new Error("Geocoding API request failed.");
      }
      const countryData = await countryResponse.json();
      if (countryData && countryData.length > 0) {
        const { lat, lon, display_name } = countryData[0];
        const extractedName =
          countryData[0].address.country ||
          display_name
            .split(",")
            .find(
              (part) =>
                part.trim().toLowerCase() === locationName.toLowerCase(),
            ) ||
          display_name.split(",")[0];
        return {
          name: extractedName,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
        };
      }

      const generalResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${locationName}&format=json&limit=1`,
      );
      if (!generalResponse.ok) {
        throw new Error("Geocoding API request failed.");
      }
      const generalData = await generalResponse.json();
      if (generalData && generalData.length > 0) {
        const { lat, lon, display_name } = generalData[0];
        const extractedName =
          generalData[0].address.country ||
          display_name
            .split(",")
            .find(
              (part) =>
                part.trim().toLowerCase() === locationName.toLowerCase(),
            ) ||
          display_name.split(",")[0];
        return {
          name: extractedName,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
        };
      }
      return null;
    } catch (err) {
      console.error("Geocoding error:", err);
      setError(t('geocodingError'));
      return null;
    }
  };

  const handleGuess = async (e) => {
    e.preventDefault();
    setError("");
    if (!guess) {
      setError(t('enterCountryName'));
      return;
    }

    setIsLoading(true);
    let guessedLocation = countries.find((country) =>
      matchesCountry(guess, country),
    );

    if (!guessedLocation) {
      guessedLocation = await geocodeLocation(guess);
    }

    if (guessedLocation) {
      const { lat: answerLat, lon: answerLon } = todayAnswerCountry;
      const { distance, direction } = getGeoDetails(
        guessedLocation.lat,
        guessedLocation.lon,
        answerLat,
        answerLon,
      );

      const similarity = Math.max(0, 100 - distance / 100);

      const newGuess = {
        name: guessedLocation.name,
        englishName: guessedLocation.englishName || guessedLocation.name,
        lat: guessedLocation.lat,
        lon: guessedLocation.lon,
        distance: distance.toFixed(0),
        direction,
        similarity: similarity.toFixed(0),
      };

      const existingGuessIndex = guesses.findIndex((item) =>
        matchesCountry(item.name, guessedLocation),
      );

      let updatedGuesses;
      if (existingGuessIndex !== -1) {
        updatedGuesses = guesses.filter(
          (_, index) => index !== existingGuessIndex,
        );
        setGuesses([newGuess, ...updatedGuesses]);
      } else {
        setGuesses((prev) => [newGuess, ...prev]);
        setUniqueGuessesCount((prevCount) => prevCount + 1);
      }

      if (matchesCountry(guessedLocation.name, todayAnswerCountry)) {
        setIsCorrect(true);

        const finalGuessCount =
          existingGuessIndex !== -1
            ? uniqueGuessesCount
            : uniqueGuessesCount + 1;
        const updatedStats = updateStatsOnGameComplete(
          finalGuessCount,
          true,
          today,
        );
        setStats(updatedStats);

        const updatedArchive = addToArchive(
          todayAnswerCountry,
          finalGuessCount,
          today,
          true,
        );
        setArchive(updatedArchive);

        saveYesterdayAnswer(todayAnswerCountry, finalGuessCount, today);

        // GA4 이벤트 트래킹
        if (window.gtag) {
          window.gtag('event', 'game_completed', {
            country: todayAnswerCountry.englishName,
            guesses: finalGuessCount,
            language: lang,
          });
        }
      }
    } else {
      setError(t('countryNotFound'));
    }
    setGuess("");
    setIsLoading(false);
  };

  const getSimilarityColor = (similarity) => {
    const sim = parseInt(similarity);
    if (sim > 90) return "text-red-500";
    if (sim > 70) return "text-orange-400";
    if (sim > 50) return "text-yellow-300";
    return "text-gray-400";
  };

  const formatResultsForClipboard = () => {
    const answerName = getCountryDisplayName(todayAnswerCountry, lang);
    let resultString = `Geo-Mantle 🌍\n`;
    resultString += `${t('todaysAnswer')}: ${answerName}\n\n`;
    resultString += `${t('myGuessResult')}: ${uniqueGuessesCount}${t('successIn')}\n\n`;

    guesses.forEach((item) => {
      let visualCue = item.direction;
      if (matchesCountry(item.name, todayAnswerCountry)) {
        visualCue = "✅";
      }
      const displayName = lang === 'en' ? (item.englishName || item.name) : item.name;
      resultString += `${displayName} ${visualCue} ${item.similarity}%\n`;
    });
    resultString += `\n#GeoMantle`;
    return resultString;
  };

  const handleCopyResults = async () => {
    try {
      const results = formatResultsForClipboard();
      await navigator.clipboard.writeText(results);
      setCopyFeedback(t('copied'));
      setTimeout(() => setCopyFeedback(""), 2000);
    } catch (err) {
      console.error("Failed to copy results:", err);
      setCopyFeedback(t('copyFailed'));
      setTimeout(() => setCopyFeedback(""), 2000);
    }
  };

  const handleCloseModal = () => {
    setIsCorrect(false);
  };

  const handleToggleInstructionsModal = () => {
    setShowInstructionsModal((prev) => !prev);
  };

  const handleWatchAd = () => {
    showRewardedAd(
      () => {
        const newAdsCount = incrementAdsWatched();
        setAdsWatchedCount(newAdsCount);

        if (
          canUnlockHint(newAdsCount, "continent") &&
          !unlockedHints.continent
        ) {
          const updatedHints = unlockHint("continent");
          setUnlockedHints(updatedHints);
          alert(t('continentHintUnlocked'));
        } else if (
          canUnlockHint(newAdsCount, "distance") &&
          !unlockedHints.distance
        ) {
          const updatedHints = unlockHint("distance");
          setUnlockedHints(updatedHints);
          alert(t('distanceHintUnlocked'));
        }
      },
      (error) => {
        console.error("Ad load failed:", error);
        alert(t('adLoadFailed'));
      },
    );
  };

  const answerDisplayName = getCountryDisplayName(todayAnswerCountry, lang);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full max-w-md flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-teal-400 shrink-0">🌍 Geo-Mantle</h1>
        <div className="flex items-center space-x-2 shrink-0">
          {/* Language Toggle */}
          <div className="flex bg-gray-700 rounded-md overflow-hidden text-sm">
            <button
              onClick={() => setLang('ko')}
              className={`px-3 py-2 font-medium transition-colors ${
                lang === 'ko'
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              KR
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-2 font-medium transition-colors ${
                lang === 'en'
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              ENG
            </button>
          </div>
          <button
            onClick={handleToggleInstructionsModal}
            className="px-3 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors text-sm whitespace-nowrap"
          >
            {t('howToPlay')}
          </button>
        </div>
      </header>
      {/* Stats & Content */}
      <GameStats stats={stats} averageGuesses={getAverageGuesses()} />
      {yesterdayAnswer && <YesterdayAnswer yesterdayData={yesterdayAnswer} />}
      {archive.length > 0 && <RecentArchive archive={archive} />}
      <div className="flex flex-col items-center mt-4 space-y-4 mb-8 w-full max-w-md">
        <img
          src={world_map_1}
          alt="World Map 1"
          className="w-full h-auto rounded-lg shadow-md"
        />
        <img
          src={world_map_2}
          alt="World Map 2"
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>
      {/* Map Section */}
      <section className="w-full max-w-md mb-8">
        <div className="bg-gray-800 p-2 rounded-lg shadow-lg relative z-0">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            minZoom={1}
            maxZoom={10}
            scrollWheelZoom={true}
            style={{ height: "300px", width: "100%", borderRadius: "8px" }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {guesses.map(
              (item, index) =>
                item.lat &&
                item.lon && (
                  <Marker key={index} position={[item.lat, item.lon]}>
                    <Popup>{lang === 'en' ? (item.englishName || item.name) : item.name}</Popup>
                  </Marker>
                ),
            )}
            {isCorrect && todayAnswerCountry.lat && todayAnswerCountry.lon && (
              <Marker
                position={[todayAnswerCountry.lat, todayAnswerCountry.lon]}
                icon={L.divIcon({
                  className: "my-custom-pin",
                  iconAnchor: [0, 24],
                  labelAnchor: [-6, 0],
                  popupAnchor: [0, -36],
                  html: `<span class="bg-green-500 text-white font-bold p-1 rounded-full text-xs whitespace-nowrap">${answerDisplayName} ✅</span>`,
                })}
              >
                <Popup>{t('answer')}: {answerDisplayName}</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </section>
      {/* Hint System */}
      <HintSystem
        answerCountry={todayAnswerCountry}
        guesses={guesses}
        adsWatchedCount={adsWatchedCount}
        unlockedHints={unlockedHints}
        onWatchAd={handleWatchAd}
      />
      {/* Input Area */}
      <main className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <form onSubmit={handleGuess} className="flex flex-col space-y-4">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={t('inputPlaceholder')}
            className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-100"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? t('searching') : t('guessButton')}
          </button>
        </form>
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      </main>
      {/* Result List */}
      <section className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">
          {t('myGuesses')} ({uniqueGuessesCount}{t('timesUnit')})
        </h2>
        {guesses.length === 0 ? (
          <div className="text-gray-400">
            <p className="mb-2">{t('noGuessesYet')}</p>
            {!unlockedHints.distance && (
              <p
                className="text-sm text-yellow-400 mt-3"
                dangerouslySetInnerHTML={{ __html: t('hintBasicDirection') }}
              />
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {guesses.map((item, index) => (
              <React.Fragment key={index}>
                <li className="flex justify-between items-center p-3 bg-gray-700 rounded-md border border-gray-600">
                  <span className="text-gray-200 font-medium">
                    {lang === 'en' ? (item.englishName || item.name) : item.name}
                  </span>
                  <div className="flex items-center space-x-4">
                    {unlockedHints.distance && (
                      <span className="text-gray-300">{item.distance} km</span>
                    )}
                    <span className="text-2xl">{item.direction}</span>
                    {unlockedHints.distance && (
                      <span
                        className={`font-bold ${getSimilarityColor(item.similarity)}`}
                      >
                        {item.similarity}%
                      </span>
                    )}
                  </div>
                </li>
                {index === 2 && guesses.length >= 3 && (
                  <li className="my-4">
                    <AdSenseAd
                      adSlot="YOUR_AD_SLOT_ID_2"
                      style={{ minHeight: "100px" }}
                    />
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        )}
      </section>
      {/* Success Modal */}
      {isCorrect && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-700 p-8 rounded-lg shadow-xl text-center relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold"
              aria-label={t('closeModal')}
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-green-400 mb-2">
              {t('correct')}
            </h2>
            <p className="text-gray-200 mb-2">
              {t('congratulations')}{" "}
              <span className="font-semibold">{answerDisplayName}</span>
              {t('youGuessed')}
            </p>
            <p className="text-4xl font-bold text-teal-300 mb-6">
              {uniqueGuessesCount}{t('guessCountResult')}
            </p>
            <button
              onClick={handleCopyResults}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors mb-4"
            >
              {copyFeedback || t('copyResults')}
            </button>
            <div className="mt-4">
              <AdSenseAd adSlot="YOUR_AD_SLOT_ID" />
            </div>
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
              aria-label={t('closeDescription')}
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-teal-400 mb-4">
              {t('instructionsTitle')}
            </h2>
            <div className="text-gray-200 space-y-3">
              <p>{t('instruction1')}</p>
              <p>{t('instruction2')}</p>
              <p>{t('instruction3')}</p>
              <p>{t('instruction4')}</p>
              <p>{t('instruction5')}</p>
            </div>
            <button
              onClick={handleToggleInstructionsModal}
              className="mt-6 px-6 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors w-full"
            >
              {t('closeButton')}
            </button>
          </div>
        </div>
      )}
      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-left relative max-w-lg max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">{t('privacyPolicy')}</h2>
            <div className="text-gray-300 space-y-4 text-sm">
              <p>{t('privacyIntro')}</p>
              <div>
                <h3 className="font-semibold text-gray-100 mb-1">{t('privacySection1Title')}</h3>
                <p>{t('privacySection1Content')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-100 mb-1">{t('privacySection2Title')}</h3>
                <p>{t('privacySection2Content')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-100 mb-1">{t('privacySection3Title')}</h3>
                <p>{t('privacySection3Content')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-100 mb-1">{t('privacySection4Title')}</h3>
                <p>{t('privacySection4Content')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-100 mb-1">{t('privacySection5Title')}</h3>
                <p>{t('privacySection5Content')}</p>
              </div>
              <p className="text-gray-500 text-xs">{t('privacyLastUpdated')}</p>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="mt-6 px-6 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors w-full"
            >
              {t('closeButton')}
            </button>
          </div>
        </div>
      )}
      {/* Footer */}
      <footer className="w-full max-w-md mt-8 mb-4 text-center">
        <button
          onClick={() => setShowPrivacyModal(true)}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors underline"
        >
          {t('privacyPolicy')}
        </button>
      </footer>
      <Analytics />
    </div>
  );
}

export default App;
