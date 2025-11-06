"""郵便番号から住所を求める"""
import requests

def get_address(postcode):
    base_url='https://zipcloud.ibsnet.co.jp/api/search'
    query_parameter=f'zipcode={postcode}'

    try:
        data=requests.get(base_url,query_parameter).json()
        if data["status"]==200:
            if data["message"]!=None:
                print(data["message"])
                return None
            result=data["results"] 
            if result==None:
                print(f"郵便番号{postcode}は存在しません")
                return None
            
            address=""
            for idx,value in enumerate(result[0].values()):
                if idx<3:
                   address+=value
                else:
                    break
            print(address)
            return address
    except Exception as e:
        print(f"住所取得エラー: {e}")
