import requests
import os
from dotenv import load_dotenv
from get_address import get_address
from get_difference import get_difference
load_dotenv()

def get_coordinates(address):
    if address is None:
        return
    GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json" 
    API_KEY=os.environ.get("API_KEY")
    
    if not API_KEY:
        raise ValueError("APIキーが設定されていません")
    params = {
        'address': address,
        'key': API_KEY
    }
    
    try:
        response = requests.get(GEOCODING_API_URL, params=params)
        response.raise_for_status()
        data = response.json()

        if data["status"]=="OK":
            geo=data["results"][0]["geometry"]["location"]
            lat=geo["lat"]
            lng=geo["lng"]
            return lat,lng
        else:
            return None,None
        
    except Exception as e:
        print(f"座標取得エラー: {e}")
        return None, None

address=get_address(6750061)
lat1,lng1=get_coordinates(address)
print(f"住所1:{lat1,lng1}")
address=get_address(6500003)
lat2,lng2=get_coordinates(address)
print(f"住所2:{lat2,lng2}")
print(f"距離:{get_difference(lat1,lng1,lat2,lng2)}m")