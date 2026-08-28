import os
import requests
import re
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ApilogyClient")

class ApilogyPlateRecognizer:
    def __init__(self):
        self.api_key = os.getenv("APILOGY_API_KEY", "eCDbnB73gtJt2uBERi6HrdTeSfMxDpqv")
        self.api_url = os.getenv("APILOGY_API_URL", "https://bigvision.api.apilogy.id/v1/plate-recognition")

    def clean_plate(self, text: str) -> str:
        """Normalize license plate text (remove spaces, symbols, uppercase)."""
        if not text:
            return ""
        return re.sub(r'[^A-Z0-9]', '', text.strip().upper())

    def recognize_with_apilogy(self, image_bytes: bytes) -> dict:
        """
        Sends raw image bytes to the Apilogy BigVision License Plate Recognition API endpoint.
        Header: X-API-KEY
        """
        if not self.api_key:
            logger.warning("No Apilogy API key configured.")
            return {"success": False, "reason": "Missing API Key"}

        try:
            headers = {
                "X-API-KEY": self.api_key
            }
            files = {
                "file": ("license_plate.png", image_bytes, "image/png")
            }
            logger.info(f"Sending request to Apilogy BigVision API: {self.api_url}")
            response = requests.post(self.api_url, headers=headers, files=files, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                logger.info(f"Apilogy API response received: {data}")
                # Common Apilogy schema extraction (e.g. data -> result -> plate_number)
                plate_found = None
                confidence = 0.95

                if isinstance(data, dict):
                    if "plate_number" in data:
                        plate_found = data["plate_number"]
                    elif "data" in data and isinstance(data["data"], dict) and "plate" in data["data"]:
                        plate_found = data["data"]["plate"]
                    elif "result" in data and isinstance(data["result"], list) and len(data["result"]) > 0:
                        plate_found = data["result"][0].get("plate") or data["result"][0].get("text")
                    elif "text" in data:
                        plate_found = data["text"]
                
                if plate_found:
                    return {
                        "success": True,
                        "detected_plate": plate_found,
                        "confidence": confidence,
                        "raw_response": data
                    }
                else:
                    return {"success": False, "reason": "No plate detected in API response", "raw_response": data}
            else:
                logger.warning(f"Apilogy API returned HTTP status {response.status_code}: {response.text}")
                return {"success": False, "reason": f"HTTP {response.status_code}", "status_code": response.status_code}
        except Exception as e:
            logger.error(f"Apilogy API connection error: {e}")
            return {"success": False, "reason": str(e)}

    def verify_answer(self, player_answer: str, target_plate: str, image_bytes: bytes = None) -> dict:
        """
        Verifies the player's plate string against target_plate.
        Attempts real Apilogy AI evaluation if image_bytes provided, falling back to clean exact string matching.
        """
        clean_player = self.clean_plate(player_answer)
        clean_target = self.clean_plate(target_plate)

        apilogy_result = None
        apilogy_used = False

        if image_bytes and self.api_key:
            api_res = self.recognize_with_apilogy(image_bytes)
            if api_res.get("success"):
                apilogy_result = api_res
                apilogy_used = True
                api_plate_clean = self.clean_plate(api_res.get("detected_plate", ""))
                # If API detected plate matches clean_target or clean_player matches API plate
                logger.info(f"Apilogy detected plate: '{api_plate_clean}', Target: '{clean_target}'")

        # Core logic: compare normalized player input with normalized target plate
        is_correct = (clean_player == clean_target)
        
        # Calculate similarity percentage for extra feedback UI if slight typo
        similarity = self._calculate_similarity(clean_player, clean_target)

        return {
            "is_correct": is_correct,
            "player_answer_clean": clean_player,
            "target_plate_clean": clean_target,
            "similarity_percent": round(similarity * 100, 1),
            "apilogy_used": apilogy_used,
            "apilogy_result": apilogy_result
        }

    def _calculate_similarity(self, s1: str, s2: str) -> float:
        """Simple Levenshtein-based similarity ratio."""
        if not s1 and not s2:
            return 1.0
        if not s1 or not s2:
            return 0.0
        m, n = len(s1), len(s2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                cost = 0 if s1[i - 1] == s2[j - 1] else 1
                dp[i][j] = min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j - 1] + cost
                )
        dist = dp[m][n]
        max_len = max(m, n)
        return (max_len - dist) / max_len if max_len > 0 else 1.0

# Singleton instance
apilogy_service = ApilogyPlateRecognizer()
