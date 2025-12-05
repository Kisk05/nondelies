import googlemaps
import requests
import os
from dotenv import load_dotenv
load_dotenv()

API_KEY=os.environ.get("API_KEY")
gmaps = googlemaps.Client(key=API_KEY)

radius = 5000          # 検索半径（メートル）
place_type = 'supermarket'

def find_nearsuper(lat,lng):
    try:
        places_result = gmaps.places_nearby(
            # query=f'スーパーマルハチ near {lat},{lng}',
            location=(lat, lng),
            radius=radius,
            type=place_type,
            language='ja'
        )
        return places_result

    except Exception as e:
        print(f"エラーが発生しました: {e}")