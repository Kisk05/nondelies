from flask import Flask, jsonify, request
from .get_coordinates import get_coordinates

app = Flask(__name__)

@app.route('/geocode_zip', methods=['GET'])
def geocode():
    address = request.args.get('address')
    if address is None:
        return jsonify({"status": "error", "message": "住所（address）を指定してください。"}), 400
    
    lat,lon=get_coordinates(address)
    
    print(f"座標取得 {address}: {lat}, {lon}") 
    
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