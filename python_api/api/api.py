from flask import Flask, jsonify, request
from .get_coordinates import get_coordinates
from .get_address import get_address
from .get_difference import get_difference

app = Flask(__name__)

@app.route('/address_lookup', methods=['GET'])
def address_lookup():
    """郵便番号から住所を取得するエンドポイント"""
    postcode = request.args.get('postcode') 
    
    if not postcode:
        return jsonify({"status": "error", "message": "郵便番号（postcode）を指定してください。"}), 400

    # get_address.py の関数を使用
    address = get_address(postcode) 

    if address is not None:
        return jsonify({
            "status": "success",
            "postcode": postcode,
            "address": address
        })
    else:
        return jsonify({"status": "error", "message": "郵便番号に対応する住所が見つかりません。"}), 404
    

@app.route('/geocode_address', methods=['GET'])
def geocode():
    """住所から緯度経度を取得するエンドポイント"""
    address = request.args.get('address')
    if address is None:
        return jsonify({"status": "error", "message": "住所（address）を指定してください。"}), 400
    
    lat,lon=get_coordinates(address)
    
    if lat is not None:
        return jsonify({
            "status": "success",
            "latitude": lat,
            "longitude": lon,
            "address": address
        })
    else:
        return jsonify({
            "status": "error", 
            "message": "座標が見つからないか、APIエラーが発生しました。"
        }), 500

@app.route('/difference', methods=['GET'])
def difference():
    """二つの地点間の距離を取得するエンドポイント"""
    try:
        a_lat = request.args.get('lat1')
        a_lon = request.args.get('lon1')
        b_lat = request.args.get('lat2')
        b_lon = request.args.get('lon2')
    except Exception:
        return jsonify({"status": "error", "message": f"二点の座標を指定してください。{request.args}"}), 400
    
    try:
        lat1 = float(a_lat)
        lon1 = float(a_lon)
        lat2 = float(b_lat)
        lon2 = float(b_lon)
    except ValueError:
        return jsonify({"status": "error", "message": "座標パラメータが数値ではありません"}), 400
    
    # get_differencce.py の関数を使用
    diff = get_difference(lat1,lon1,lat2,lon2)
    #return jsonify({"status": "error", "message": f"距離{diff}m"}), 400
    if diff is not None:
        return jsonify({
            "status": "success",
            "point_ay": a_lat,
            "point_ax": a_lon,
            "point_by": b_lat,
            "point_bx": b_lon,
            "result": diff,
            "message" : "距離取得成功"
        })
    else:
        return jsonify({"status": "error","message": "距離取得失敗"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)