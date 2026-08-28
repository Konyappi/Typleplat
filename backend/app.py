import os
import random
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from dotenv import load_dotenv

from plate_generator import get_challenge_info, generate_cartoon_vehicle_image, CHALLENGES_DB
from apilogy_client import apilogy_service

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

CORRECT_REMARKS = [
    "Hore! Jawabanmu sangat jeli! 🌟 Mata kamu tajam seperti elang!",
    "Luar biasa! Plat berhasil teridentifikasi dengan sempurna! 🚀",
    "Mantap jiwa! Sistem AI Guru sangat bangga padamu! 💯",
    "Bagus sekali! Pengemudi ini sekarang diizinkan melintas! 🚗💨",
    "Super presisi! Kamu layak mendapatkan gelar Master Tycoon Plat! 👑",
    "Wadaw jago banget! Langsung sapu bersih jalanan! 🏁"
]

INCORRECT_REMARKS = [
    "Aduh, matamu kurang fokus! Coba periksa huruf/angkanya lagi! 🧐",
    "Hmm, sepertinya ada lumpur yang menghalangi pandanganmu. Coba tebak lagi! 🔍",
    "Sedikit lagi! Perhatikan spasi dan karakter belakangnya! ⚠️",
    "Waduh salah sebut! Mobilnya hampir kabur nih, ayo coba lagi! 🚕",
    "Jangan buru-buru! Gunakan fitur Kaca Pembesar jika plat terlalu buram! 🔬"
]

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "Tycoon Plate Typer AI Gateway Evaluator",
        "apilogy_api_key_configured": bool(apilogy_service.api_key),
        "apilogy_url": apilogy_service.api_url
    })

@app.route("/api/get-challenge", methods=["GET"])
def get_challenge():
    """
    Returns structured JSON with challenge metrics.
    Query params: ?difficulty=easy|normal|hard&exclude_id=101
    """
    exclude_id = request.args.get("exclude_id", type=int)
    car_id = request.args.get("car_id", type=int)
    difficulty = request.args.get("difficulty", "normal").lower()

    if difficulty not in ["easy", "normal", "hard"]:
        difficulty = "normal"

    if not car_id:
        filtered_ids = [k for k, v in CHALLENGES_DB.items() if v.get("base_difficulty") == difficulty]
        if not filtered_ids:
            filtered_ids = list(CHALLENGES_DB.keys())
        if exclude_id and len(filtered_ids) > 1 and exclude_id in filtered_ids:
            filtered_ids.remove(exclude_id)
        car_id = random.choice(filtered_ids)

    challenge = get_challenge_info(car_id, difficulty=difficulty)

    response_payload = {
        "car_id": challenge["car_id"],
        "vehicle_type": challenge["vehicle_type"],
        "vehicle_name": challenge["vehicle_name"],
        "vehicle_color": challenge["vehicle_color"],
        "coin_multiplier": challenge["coin_multiplier"],
        "hint": challenge["hint"],
        "difficulty": difficulty,
        "image_url": challenge["image_url"]
    }
    return jsonify(response_payload)

@app.route("/api/plate-image/<int:car_id>", methods=["GET"])
def get_plate_image(car_id):
    """
    Generates and serves cartoon vehicle image based on car_id & difficulty.
    """
    difficulty = request.args.get("difficulty", "normal").lower()
    if difficulty not in ["easy", "normal", "hard"]:
        difficulty = "normal"

    img_bytes = generate_cartoon_vehicle_image(car_id, difficulty=difficulty)
    return Response(img_bytes, mimetype="image/jpeg")

@app.route("/api/verify-plate", methods=["POST"])
def verify_plate():
    """
    Verifies the player's typed answer against the challenge vehicle plate.
    Payload: { "car_id": 101, "player_answer": "B 1402 SKS", "difficulty": "normal", "streak": 3, "double_coins": false }
    """
    data = request.get_json() or {}
    car_id = data.get("car_id")
    player_answer = data.get("player_answer", "")
    current_streak = data.get("streak", 0)
    has_double_coins = data.get("double_coins", False)
    difficulty = data.get("difficulty", "normal").lower()

    if not car_id or car_id not in CHALLENGES_DB:
        return jsonify({"error": "Invalid or missing car_id"}), 400

    challenge = get_challenge_info(car_id, difficulty=difficulty)
    target_plate = challenge["target_plate"]
    img_bytes = generate_cartoon_vehicle_image(car_id, difficulty=difficulty)

    eval_result = apilogy_service.verify_answer(player_answer, target_plate, image_bytes=img_bytes)

    is_correct = eval_result["is_correct"]
    similarity_percent = eval_result["similarity_percent"]
    apilogy_used = eval_result["apilogy_used"]

    if is_correct:
        base_coins = int(100 * challenge["coin_multiplier"])
        streak_bonus = min(current_streak * 25, 250)
        total_coins = base_coins + streak_bonus
        if has_double_coins:
            total_coins *= 2

        remarks = random.choice(CORRECT_REMARKS)
        return jsonify({
            "is_correct": True,
            "car_id": car_id,
            "player_answer": player_answer,
            "official_plate": target_plate,
            "coins_earned": base_coins,
            "streak_bonus": streak_bonus,
            "total_reward": total_coins,
            "confidence_score": 99.2 if apilogy_used else 95.0,
            "remarks": remarks,
            "apilogy_used": apilogy_used,
            "similarity_percent": 100.0
        })
    else:
        remarks = random.choice(INCORRECT_REMARKS)
        return jsonify({
            "is_correct": False,
            "car_id": car_id,
            "player_answer": player_answer,
            "official_plate": None,
            "coins_earned": 0,
            "streak_bonus": 0,
            "total_reward": 0,
            "confidence_score": 0.0,
            "remarks": remarks,
            "apilogy_used": apilogy_used,
            "similarity_percent": similarity_percent
        })

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"🚀 Starting Tycoon Plate Typer AI Gateway on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
