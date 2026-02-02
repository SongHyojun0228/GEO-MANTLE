// src/utils/geo.js

/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 * @param {number} lat1 Latitude of point 1 in degrees.
 * @param {number} lon1 Longitude of point 1 in degrees.
 * @param {number} lat2 Latitude of point 2 in degrees.
 * @param {number} lon2 Longitude of point 2 in degrees.
 * @returns {number} Distance in kilometers.
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

/**
 * Calculates the initial bearing from point 1 to point 2.
 * @param {number} lat1 Latitude of point 1 in degrees.
 * @param {number} lon1 Longitude of point 1 in degrees.
 * @param {number} lat2 Latitude of point 2 in degrees.
 * @param {number} lon2 Longitude of point 2 in degrees.
 * @returns {number} Bearing in degrees (0-360).
 */
function calculateBearing(lat1, lon1, lat2, lon2) {
  lat1 = lat1 * Math.PI / 180;
  lon1 = lon1 * Math.PI / 180;
  lat2 = lat2 * Math.PI / 180;
  lon2 = lon2 * Math.PI / 180;

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360; // Normalize to 0-360
}

/**
 * Converts a bearing in degrees to an arrow symbol.
 * @param {number} bearing Bearing in degrees (0-360).
 * @returns {string} Arrow symbol.
 */
export function getDirectionArrow(bearing) {
  if (bearing >= 337.5 || bearing < 22.5) return "⬆️"; // North
  if (bearing >= 22.5 && bearing < 67.5) return "↗️";  // North-East
  if (bearing >= 67.5 && bearing < 112.5) return "➡️"; // East
  if (bearing >= 112.5 && bearing < 157.5) return "↘️"; // South-East
  if (bearing >= 157.5 && bearing < 202.5) return "⬇️"; // South
  if (bearing >= 202.5 && bearing < 247.5) return "↙️"; // South-West
  if (bearing >= 247.5 && bearing < 292.5) return "⬅️"; // West
  if (bearing >= 292.5 && bearing < 337.5) return "↖️"; // North-West
  return "";
}

/**
 * Calculates distance, bearing, and direction arrow between two points.
 * @param {number} lat1 Latitude of point 1 in degrees.
 * @param {number} lon1 Longitude of point 1 in degrees.
 * @param {number} lat2 Latitude of point 2 in degrees.
 * @param {number} lon2 Longitude of point 2 in degrees.
 * @returns {{distance: number, direction: string}} Object containing distance and direction arrow.
 */
export function getGeoDetails(lat1, lon1, lat2, lon2) {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  const bearing = calculateBearing(lat1, lon1, lat2, lon2);
  const direction = getDirectionArrow(bearing);
  return { distance, direction };
}
