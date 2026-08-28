import io
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Predefined dataset of cartoon vehicles
CAR_ARCHETYPES = [
    {
        "id_prefix": 100,
        "type": "Taksi Retro Kuning",
        "name": "Yellow Classic Taxi",
        "body_color": "#FFCC00",
        "roof_color": "#FFFFFF",
        "accent_color": "#000000",
        "coin_mult": 1.0,
        "region_hint": "Plat Wilayah DKI Jakarta (B)"
    },
    {
        "id_prefix": 200,
        "type": "Mobil Sport Merah",
        "name": "Red Velocity Supercar",
        "body_color": "#FF3366",
        "roof_color": "#CC0033",
        "accent_color": "#FFCC00",
        "coin_mult": 1.5,
        "region_hint": "Plat Wilayah Bandung (D)"
    },
    {
        "id_prefix": 300,
        "type": "Truk Box Express",
        "name": "Heavy Delivery Truck",
        "body_color": "#3399FF",
        "roof_color": "#66B2FF",
        "accent_color": "#FFFFFF",
        "coin_mult": 1.2,
        "region_hint": "Plat Wilayah Surabaya (L)"
    },
    {
        "id_prefix": 400,
        "type": "Angkot Legend Biru",
        "name": "Blue City Minibus",
        "body_color": "#00CC99",
        "roof_color": "#009973",
        "accent_color": "#FFFFFF",
        "coin_mult": 1.3,
        "region_hint": "Plat Wilayah Bogor (F)"
    },
    {
        "id_prefix": 500,
        "type": "Jeep Offroad Garang",
        "name": "Offroad Monster Jeep",
        "body_color": "#4D80E6",
        "roof_color": "#1A4099",
        "accent_color": "#FF9900",
        "coin_mult": 1.8,
        "region_hint": "Plat Wilayah Bali (DK)"
    },
    {
        "id_prefix": 600,
        "type": "Mobil Polisi Patroli",
        "name": "Police Cruiser Patrol",
        "body_color": "#2A2A2A",
        "roof_color": "#FFFFFF",
        "accent_color": "#0066FF",
        "coin_mult": 2.0,
        "region_hint": "Plat Wilayah Semarang (H)"
    }
]

# Database of challenges mapped to difficulty levels
CHALLENGES_DB = {
    # EASY CHALLENGES (Clear plates, simple 2-4 digit numbers)
    101: {"plate": "B 1234 A", "archetype_idx": 0, "hint": "Plat DKI Jakarta (B) - Sangat Jelas", "base_difficulty": "easy"},
    201: {"plate": "D 8888 BK", "archetype_idx": 1, "hint": "Plat Bandung (D) - Angka Kembar", "base_difficulty": "easy"},
    301: {"plate": "L 555 OK", "archetype_idx": 2, "hint": "Plat Surabaya (L) - Truk Logistik", "base_difficulty": "easy"},
    401: {"plate": "F 4321 BA", "archetype_idx": 3, "hint": "Plat Bogor (F) - Angkot Kota", "base_difficulty": "easy"},

    # NORMAL CHALLENGES (Moderate mud, standard 4 digit plates)
    102: {"plate": "B 1402 SKS", "archetype_idx": 0, "hint": "Plat DKI Jakarta (B) - Seri SKS", "base_difficulty": "normal"},
    202: {"plate": "D 1845 AB", "archetype_idx": 1, "hint": "Plat Bandung (D) - Mobil Sport", "base_difficulty": "normal"},
    302: {"plate": "L 1024 OK", "archetype_idx": 2, "hint": "Plat Surabaya (L) - Berdebu Lumpur", "base_difficulty": "normal"},
    501: {"plate": "DK 3210 XYZ", "archetype_idx": 4, "hint": "Plat Bali (DK) - Jeep Pantai", "base_difficulty": "normal"},

    # HARD CHALLENGES (Heavy mud obscuration, scratches, longer plates)
    103: {"plate": "B 9988 XZ", "archetype_idx": 0, "hint": "Plat DKI Jakarta (B) - Sangat Buram", "base_difficulty": "hard"},
    203: {"plate": "D 7777 WIN", "archetype_idx": 1, "hint": "Plat Bandung (D) - Terutup Lumpur Tebal", "base_difficulty": "hard"},
    502: {"plate": "DK 888 BALI", "archetype_idx": 4, "hint": "Plat Bali (DK) - Lumpur Offroad Ekstrem", "base_difficulty": "hard"},
    601: {"plate": "H 911 POL", "archetype_idx": 5, "hint": "Plat Semarang (H) - Mobil Patroli Terkena Hujan", "base_difficulty": "hard"}
}

def generate_cartoon_vehicle_image(car_id: int, difficulty: str = "normal") -> bytes:
    """
    Renders a cartoon vehicle rear view with license plate obscurations using Pillow.
    Difficulty: 'easy' (minimal dirt), 'normal' (moderate mud), 'hard' (heavy mud & scratches).
    """
    challenge = CHALLENGES_DB.get(car_id)
    if not challenge:
        car_id = 101
        challenge = CHALLENGES_DB[101]

    archetype = CAR_ARCHETYPES[challenge["archetype_idx"]]
    plate_text = challenge["plate"]

    # Image Dimensions
    width, height = 480, 320
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Draw Cartoon Car Body (Rear View)
    body_color = archetype["body_color"]
    roof_color = archetype["roof_color"]
    accent_color = archetype["accent_color"]

    # Wheels (bottom corners)
    draw.rounded_rectangle([70, 220, 140, 290], radius=15, fill="#1A1A1A", outline="#000000", width=4)
    draw.rounded_rectangle([340, 220, 410, 290], radius=15, fill="#1A1A1A", outline="#000000", width=4)
    # Wheel rims
    draw.ellipse([90, 240, 120, 270], fill="#CCCCCC", outline="#000000", width=2)
    draw.ellipse([360, 240, 390, 270], fill="#CCCCCC", outline="#000000", width=2)

    # Car Roof / Cabin
    draw.rounded_rectangle([110, 60, 370, 180], radius=30, fill=roof_color, outline="#000000", width=5)
    # Rear Window
    draw.rounded_rectangle([130, 80, 350, 150], radius=20, fill="#A0DEFF", outline="#000000", width=4)
    # Window reflection gloss lines
    draw.line([150, 90, 220, 140], fill="#FFFFFF", width=6)
    draw.line([170, 90, 240, 140], fill="#FFFFFF", width=4)

    # Main Car Body Frame
    draw.rounded_rectangle([60, 140, 420, 250], radius=25, fill=body_color, outline="#000000", width=5)
    # Bumper
    draw.rounded_rectangle([70, 230, 410, 265], radius=12, fill="#333333", outline="#000000", width=4)

    # Taillights
    draw.rounded_rectangle([80, 160, 130, 200], radius=10, fill="#FF3333", outline="#000000", width=4)
    draw.rounded_rectangle([90, 170, 120, 190], radius=5, fill="#FFCC00")
    draw.rounded_rectangle([350, 160, 400, 200], radius=10, fill="#FF3333", outline="#000000", width=4)
    draw.rounded_rectangle([360, 170, 390, 190], radius=5, fill="#FFCC00")

    # Trunk line & emblem
    draw.line([140, 160, 340, 160], fill="#000000", width=3)
    draw.ellipse([225, 145, 255, 165], fill=accent_color, outline="#000000", width=3)

    # 2. Draw License Plate Frame on Bumper Center
    plate_box = [160, 185, 320, 240]
    draw.rectangle([plate_box[0]-4, plate_box[1]-4, plate_box[2]+4, plate_box[3]+4], fill="#111111", outline="#000000", width=3)
    draw.rectangle(plate_box, fill="#1A1A1A", outline="#FFFFFF", width=2)
    # Top/Bottom plate border line
    draw.line([plate_box[0]+5, plate_box[1]+40, plate_box[2]-5, plate_box[1]+40], fill="#FFFFFF", width=1)
    draw.text((plate_box[0]+45, plate_box[1]+42), "08•28", fill="#CCCCCC")

    # License Plate Text
    try:
        font = ImageFont.truetype("arial.ttf", 26)
    except IOError:
        try:
            font = ImageFont.load_default(size=26)
        except TypeError:
            font = ImageFont.load_default()

    draw.text((plate_box[0] + 15, plate_box[1] + 10), plate_text, fill="#FFFFFF", font=font)

    # 3. Apply Dirt / Obscuration Effects according to Selected Difficulty
    if difficulty == "easy":
        # Minimal dirt - 2 small specks only, plate is crystal clear
        for _ in range(2):
            mx = random.randint(plate_box[0] + 5, plate_box[2] - 5)
            my = random.randint(plate_box[1] + 5, plate_box[3] - 5)
            draw.ellipse([mx - 2, my - 2, mx + 2, my + 2], fill="#4A3525")
    elif difficulty == "normal":
        # Moderate mud coverage, kept entirely inside the plate frame.
        for _ in range(22):
            mr = random.randint(5, 13)
            mx = random.randint(plate_box[0] + mr, plate_box[2] - mr)
            my = random.randint(plate_box[1] + mr, plate_box[3] - mr)
            draw.ellipse([mx - mr, my - mr, mx + mr, my + mr], fill="#4A3525")
    elif difficulty == "hard":
        # Heavy mud coverage + thick scratch lines across plate text.
        for _ in range(42):
            mr = random.randint(8, 22)
            mx = random.randint(plate_box[0] + mr, plate_box[2] - mr)
            my = random.randint(plate_box[1] + mr, plate_box[3] - mr)
            draw.ellipse([mx - mr, my - mr, mx + mr, my + mr], fill="#3B2616")
        
        # Heavy scratches & mud streaks across numbers
        draw.line([plate_box[0] + 8, plate_box[1] + 10, plate_box[2] - 55, plate_box[3] - 10], fill="#554433", width=6)
        draw.line([plate_box[0] + 65, plate_box[1] + 8, plate_box[2] - 8, plate_box[3] - 12], fill="#2B1A0A", width=7)

    # Convert to RGB JPEG bytes
    final_img = Image.new("RGB", (width, height), (160, 222, 255))
    final_img.paste(img, (0, 0), img)

    buf = io.BytesIO()
    final_img.save(buf, format="JPEG", quality=90)
    return buf.getvalue()

def get_challenge_info(car_id: int = None, difficulty: str = "normal") -> dict:
    """Returns challenge details based on difficulty selection."""
    filtered_keys = [k for k, v in CHALLENGES_DB.items() if v.get("base_difficulty") == difficulty]
    if not filtered_keys:
        filtered_keys = list(CHALLENGES_DB.keys())

    if car_id is None or car_id not in CHALLENGES_DB:
        car_id = random.choice(filtered_keys)

    ch = CHALLENGES_DB[car_id]
    arch = CAR_ARCHETYPES[ch["archetype_idx"]]

    # Difficulty multiplier bonuses: easy = 1.0x, normal = 1.5x, hard = 2.5x
    diff_mult = 1.0 if difficulty == "easy" else (1.5 if difficulty == "normal" else 2.5)

    return {
        "car_id": car_id,
        "vehicle_type": arch["type"],
        "vehicle_name": arch["name"],
        "vehicle_color": arch["body_color"],
        "coin_multiplier": round(arch["coin_mult"] * diff_mult, 2),
        "hint": ch["hint"],
        "difficulty": difficulty,
        "image_url": f"/api/plate-image/{car_id}?difficulty={difficulty}",
        "target_plate": ch["plate"]
    }
