from flask import Flask, jsonify, request
from .get_coordinates import get_coordinates
from .get_address import get_address

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)