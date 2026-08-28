import unittest
import json
from app import app, apilogy_service, CHALLENGES_DB
from plate_generator import generate_cartoon_vehicle_image

class BackendTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_health_endpoint(self):
        response = self.app.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["status"], "online")
        self.assertTrue(data["apilogy_api_key_configured"])

    def test_get_challenge_endpoint(self):
        response = self.app.get('/api/get-challenge')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn("car_id", data)
        self.assertIn("vehicle_type", data)
        self.assertIn("hint", data)
        self.assertIn("image_url", data)

    def test_plate_image_generation(self):
        car_id = 101
        img_bytes = generate_cartoon_vehicle_image(car_id)
        self.assertTrue(len(img_bytes) > 500)
        
        response = self.app.get(f'/api/plate-image/{car_id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.mimetype, 'image/jpeg')

    def test_verify_plate_correct(self):
        car_id = 101
        target_plate = CHALLENGES_DB[car_id]["plate"]
        payload = {
            "car_id": car_id,
            "player_answer": target_plate,
            "streak": 2,
            "double_coins": False
        }
        response = self.app.post('/api/verify-plate', 
                                data=json.dumps(payload),
                                content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data["is_correct"])
        self.assertGreater(data["total_reward"], 0)
        self.assertIn("remarks", data)

    def test_verify_plate_incorrect(self):
        car_id = 101
        payload = {
            "car_id": car_id,
            "player_answer": "WRONG 999",
            "streak": 2
        }
        response = self.app.post('/api/verify-plate', 
                                data=json.dumps(payload),
                                content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertFalse(data["is_correct"])
        self.assertEqual(data["total_reward"], 0)

if __name__ == '__main__':
    unittest.main()
