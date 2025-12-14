let map; // グローバルで地図オブジェクトを保持
let markers=[];
let currentInfoWindow=null;

/*マップ初期設定*/
function initMap() {
    const centerLocation = { lat: 34.6945534, lng: 135.1948178};
    map = new google.maps.Map(document.getElementById('map'), {
        center: centerLocation, // 地図の中心
        zoom: 12,               // ズームレベル（1:世界全体, 20:非常に詳細）
        gestureHandling: "cooperative"
    });
}

async function findsuper() {
    console.log('処理中...');

    try {
        // マップの中心座標を取得
        const center=map.getCenter();
        const userLat = center.lat();
        const userLon = center.lng();
        
        map.setCenter({ lat: userLat, lng: userLon });
        map.setZoom(11);
        
        console.log('スーパーマーケットを検索中...');
        fetchStoresFromDB(userLat, userLon);
        
        console.log('検索が完了しました。');
    } catch (error) {
        console.log(`致命的なエラー: ${error.message}`);
    }
}

async function fetchStoresFromDB(userLat, userLon) {
    const phpScriptUrl = `/php/get_all_stores.php`;

    try {
        const response = await fetch(phpScriptUrl);
        const data = await response.json();

        if (data.status === 'success') {
            rmMarker();

            // 距離計算の Promise を格納する配列
            const distancePromises = data.stores.map(store => {
                // store: { sup_id, sto_id, sup_name, sto_name, latitude, longitude, address, ... }

                return fetchDifferenceAPI(userLat, userLon, store.latitude, store.longitude)
                    .then(distance => {
                        return {
                            ...store,
                            distance: parseFloat(distance) // 距離を数値型に変換
                        };
                    })
                    .catch(err => {
                        console.error("距離計算エラー:", err);
                        return {
                            ...store,
                            distance: Infinity
                        };
                    });
            });

            // すべての距離計算が完了するのを待つ
            const storesWithDistance = await Promise.all(distancePromises);

            // 距離でソート（クライアント側で計算）
            storesWithDistance.sort((a, b) => a.distance - b.distance);

            // マーカーを追加
            storesWithDistance.forEach(store => {
                // 距離がInfinityの場合はマーカー追加をスキップまたは警告
                if (store.distance === Infinity) {
                    console.warn(`店舗 ${store.sup_name} の距離計算に失敗しました。`);
                    return;
                }
                
                addMarkerWithStoreInfo(
                    store.sup_id,
                    store.sto_id,
                    store.sup_name,
                    store.sto_name,
                    parseFloat(store.latitude),
                    parseFloat(store.longitude),
                    store.address,
                );
            });

        } else {
            console.log(`データ取得エラー: ${data.message}`);
        }
    } catch (error) {
        console.log(`検索エラー: ${error.message}`);
    }
}

async function addMarkerWithStoreInfo(supId, stoId, supName, stoName, lat, lng, address) {
    const position = { lat: lat, lng: lng };
    const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: `${supName} - ${stoName}`,
    });
    markers.push(marker);

    const infoWindowContent = `
        <div class="info-content" onclick="regist_favSuper('${supId}', '${stoId}', '${supName}', '${stoName}')">
            <h4 class="info-name">${supName} - ${stoName}</h4>
            <p class="info-address">${address}</p>
            <div class="card_action">選択して登録する</div>
            <a class="btn_store" href="/html/get_storeinfo.html?sup_id=${supId}&sto_id=${stoId}">詳細</a>
        </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
    });

    marker.addListener('click', () => {
        if (currentInfoWindow) {
            currentInfoWindow.close();
        }
        infoWindow.open(map, marker);
        currentInfoWindow = infoWindow;
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