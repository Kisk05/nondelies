let map; // グローバルで地図オブジェクトを保持
let markers=[];
let currentInfoWindow=null;

function initMap() {
    const centerLocation = { lat: 35.6585805, lng: 139.7454329 };
    map = new google.maps.Map(document.getElementById('map'), {
        center: centerLocation, // 地図の中心
        zoom: 15,               // ズームレベル（1:世界全体, 20:非常に詳細）
        gestureHandling: "cooperative"
    });
}

async function findsuper() {
    const postcode = document.getElementById('postcode').value;
    let address = document.getElementById('address').value;
    const outputDiv = document.getElementById('output');
    if (outputDiv) outputDiv.textContent = '処理中...';

    if (postcode === "" && address === "") {
        if (outputDiv) outputDiv.textContent = '郵便番号か住所のいずれかを入力してください';
        return;
    }

    let userLat, userLon;

    try {
        if (address === "") {
            if (outputDiv) outputDiv.textContent = '郵便番号から住所を取得中...';
            address = await fetchsetaddress(postcode);
            if (!address) {
                throw new Error('郵便番号から住所を取得できませんでした。');
            }
        }

        outputDiv.textContent = 'ユーザー座標を計算中...';
        const userCoords = await fetchGeocode(address);
        userLat = userCoords.latitude;
        userLon = userCoords.longitude;

        map.setCenter({ lat: userLat, lng: userLon });
        map.setZoom(15); // ズームレベルを調整

        outputDiv.textContent = 'スーパーマーケットを検索中...';
        fetchSupermarketData(userLat, userLon);

        outputDiv.textContent = '検索が完了しました。';

    } catch (error) {
        outputDiv.textContent = `致命的なエラー: ${error.message}`;
        console.error(error);
    }
}

function fetchSupermarketData(lat, lng) {
    const outputDiv = document.getElementById('output');
    const phpScriptUrl = `/php/find_super.php?lat=${lat}&lng=${lng}`;

    fetch(phpScriptUrl)
        .then(response => {
            if (!response.ok) {
                // PHP側でHTTPステータスコードが200以外だった場合
                return response.text().then(text => {
                    throw new Error(`PHPスクリプトからの応答が失敗しました: ${response.status} - ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                rmMarker();
                data.result.results.forEach(place => {
                    addMarker(
                        place.name,
                        place.geometry.location.lat,
                        place.geometry.location.lng,
                        place.vicinity,
                        place.rating,
                        place.opening_hours.open_now,
                    );
                });
            }else{
                outputDiv.textContent = `検索エラー: ${data.message}`;
            }
        })
        .catch(error => {
            console.error("データ取得エラー:", error);
            outputDiv.textContent = `検索エラー: ${error.message}`;
        });
}

function addMarker(name, lat, lng, address, rating, open) {
    const position = { lat: lat, lng: lng };
    const marker = new google.maps.Marker({
        position: position,
        map: map, // グローバル変数 map を使用
        title: name,
    });
    markers.push(marker);

    let infoWindowContent='';
    /*const KEY = document.getElementById('google_api_key');
    let photoHtml = '';

    if (photo) {
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=250&photoreference=${photo}&key=${KEY}`;
        photoHtml = `<img src="${photoUrl}" alt="${name}" style="width: 100%; height: auto; display: block; margin-bottom: 5px;">`;
    }*/
    if (open) {
        let open_status='営業中';
        infoWindowContent = `
        <div style="font-family: sans-serif; padding: 5px;">
            <h4 style="margin: 0 0 5px; font-size: 16px; color: #333;">${name}</h4>
            <p style="margin: 0; font-size: 12px; color: #313131ff;">住所: ${address}</p>
            <p style="margin: 0; font-size: 12px; color: #00ff04ff;">${open_status}</p>
            <p style="margin: 0; font-size: 12px; color: #ffcc00ff;">★ 評価: ${rating}</p>
        </div>
        `;
    } else {
        let open_status='営業終了';
        infoWindowContent = `
        <div style="font-family: sans-serif; padding: 5px;">
            <h4 style="margin: 0 0 5px; font-size: 16px; color: #333;">${name}</h4>
            <p style="margin: 0; font-size: 12px; color: #313131ff;">住所: ${address}</p>
            <p style="margin: 0; font-size: 12px; color: #ff2323ff;">${open_status}</p>
            <p style="margin: 0; font-size: 12px; color: #ffcc00ff;">★ 評価: ${rating}</p>
        </div>
        `;
    }

    const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
    });

    marker.addListener('click', () => {
        if(currentInfoWindow){
            currentInfoWindow.close();
        }
        infoWindow.open(map, marker);
        currentInfoWindow=infoWindow;
    });
}

function rmMarker(){
    // 最初にもとあるピンは削除
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers=[];
    if(currentInfoWindow){
        currentInfoWindow.close();
        currentInfoWindow=null;
    }
}