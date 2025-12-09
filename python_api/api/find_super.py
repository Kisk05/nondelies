import googlemaps
import requests
import os
from dotenv import load_dotenv
load_dotenv()

API_KEY=os.environ.get("API_KEY")
gmaps = googlemaps.Client(key=API_KEY)

radius = 5000          # 検索半径（メートル）
place_type = 'supermarket'
TARGET_SUPERMARKETS = ['マルハチ', 'マルアイ', 'コープ','マックスバリュ','関西スーパー','業務スーパー']

def find_nearsuper(lat,lng):
    try:
        places_result = gmaps.places_nearby(
            # query=f'スーパーマルハチ near {lat},{lng}',
            location=(lat, lng),
            radius=radius,
            type=place_type,
            language='ja'
        )

        results=[]
        if 'results' in places_result:
            for place in places_result['results']:
                name=place.get('name','')
                if any(supermarkets in name for supermarkets in TARGET_SUPERMARKETS):
                    results.append(place)
        
        places_result['results']=results
        return places_result

    except Exception as e:
        print(f"エラーが発生しました: {e}")