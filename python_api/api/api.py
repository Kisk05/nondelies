from flask import Flask, jsonify, request
from .get_coordinates import get_coordinates

app = Flask(__name__)

@app.route('/geocode_zip', methods=['GET'])
def geocode():
    address = request.args.get('address')
    lat,lon=get_coordinates(address)
    
    print(lat,lon)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)