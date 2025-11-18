"""2点間の距離を求める"""
import requests

def get_difference(lat1,lon1,lat2,lon2):
    DIFFERENCE_API_URL = "http://vldb.gsi.go.jp/sokuchi/surveycalc/surveycalc/bl2st_calc.pl?" 
    
    params = {
        "outputType": "json",
        "ellipsoid": "bessel",
        "latitude1":lat1,
        "longitude1":lon1,
        "latitude2":lat2,
        "longitude2":lon2
    }
    
    try:
        response = requests.get(DIFFERENCE_API_URL, params=params)
        response.raise_for_status()
        data = response.json()

        diff=data["OutputData"]["geoLength"]
        if diff=="":
            return 0.0
        return diff
        
    except Exception as e:
        print(f"距離取得エラー: {e}")
        return None