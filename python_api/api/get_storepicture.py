import requests
import os
from dotenv import load_dotenv
load_dotenv()

def get_storepicture(photo_ref):
    API_KEY =os.environ.get("API_KEY")
    PHOTO_REFERENCE = photo_ref
    MAX_WIDTH = 400
    API_URL = "https://maps.googleapis.com/maps/api/place/photo"

    params = {
        "maxwidth": MAX_WIDTH,
        "photoreference": PHOTO_REFERENCE,
        "key": API_KEY
    }

    try:
        response = requests.get(API_URL, params=params, stream=True)
        if response.status_code == 200:
            return response
        else:
            return None

    except requests.exceptions.RequestException as e:
        print(f"🚨 リクエスト中にエラーが発生しました: {e}")
        return None