const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetches next license plate challenge from Python Flask backend with difficulty filter.
 */
export async function fetchChallenge(excludeId = null, difficulty = 'normal') {
  try {
    let url = `${API_BASE_URL}/get-challenge?difficulty=${difficulty}`;
    if (excludeId) {
      url += `&exclude_id=${excludeId}`;
    }
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn("Backend API unavailable, using fallback mock challenge:", error);
    return {
      car_id: 101,
      vehicle_type: "Taksi Retro Kuning",
      vehicle_name: "Yellow Classic Taxi",
      vehicle_color: "#FFCC00",
      coin_multiplier: difficulty === 'easy' ? 1.0 : (difficulty === 'hard' ? 2.5 : 1.5),
      hint: "Plat DKI Jakarta (B) - Angka 4 digit",
      difficulty: difficulty,
      image_url: `${API_BASE_URL}/plate-image/101?difficulty=${difficulty}`
    };
  }
}

/**
 * Sends player typed answer to Python backend for AI verification.
 */
export async function verifyPlate(carId, playerAnswer, streak = 0, doubleCoins = false, difficulty = 'normal') {
  try {
    const res = await fetch(`${API_BASE_URL}/verify-plate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        car_id: carId,
        player_answer: playerAnswer,
        streak: streak,
        double_coins: doubleCoins,
        difficulty: difficulty
      })
    });
    if (!res.ok) {
      throw new Error(`Verification HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Plate verification error:", error);
    const cleanAnswer = playerAnswer.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const isMockCorrect = cleanAnswer.length >= 4;
    return {
      is_correct: isMockCorrect,
      car_id: carId,
      player_answer: playerAnswer,
      official_plate: isMockCorrect ? "B 1402 SKS" : null,
      total_reward: isMockCorrect ? 150 : 0,
      remarks: isMockCorrect ? "Hore! Jawabanmu sangat jeli! 🌟" : "Aduh, matamu kurang fokus, coba periksa lagi!",
      apilogy_used: false,
      similarity_percent: isMockCorrect ? 100 : 50
    };
  }
}

/**
 * Returns complete image URL for plate canvas with difficulty parameter
 */
export function getPlateImageUrl(carId, difficulty = 'normal') {
  return `${API_BASE_URL}/plate-image/${carId}?difficulty=${difficulty}`;
}
