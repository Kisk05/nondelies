import requests

def get_difference(lat1,lng1,lat2,lng2):
    DIFFERENCE_API_URL = "http://vldb.gsi.go.jp/sokuchi/surveycalc/surveycalc/bl2st_calc.pl?" 
    
    params = {
        "outputType": "json",
        "ellipsoid": "bessel",
        "latitude1":lat1,   # 地点1の緯度
        "longitude1":lng1,  # 地点1の経度
        "latitude2":lat2,   # 地点2の緯度
        "longitude2":lng2   # 地点2の経度
    }
    
    try:
        response = requests.get(DIFFERENCE_API_URL, params=params)
        response.raise_for_status()
        data = response.json()

        diff=data["OutputData"]["geoLength"]
        if diff=="":
            return 0
        return diff
        
    except Exception as e:
        print(f"距離取得エラー: {e}")
        return None