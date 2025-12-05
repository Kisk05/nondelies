async function findsuper(){
    //const supId = document.getElementById('sup_id').value;
    //const stoId = document.getElementById('sto_id').value;
    const postcode = document.getElementById('postcode').value;
    let address = document.getElementById('address').value;
    const outputDiv = document.getElementById('output');
    outputDiv.textContent = '処理中...';

    if (postcode===""){
        outputDiv.textContent='必須項目が入力されていません';
        return;
    }
    
    let userLat,userLon;
    let stoLat,stoLon;

    try {
        // 住所を計算する場合
        if (address===""){
            outputDiv.textContent = '住所を取得中...';
            address = await fetchsetaddress(postcode);
        
            if (!address) {
                throw new Error('郵便番号から住所を取得できませんでした。');
            }
        }

        // 入力した住所の緯度経度取得
        outputDiv.textContent = 'ユーザー座標を計算中...';
        const userCoords = await fetchGeocode(address);
        userLat = userCoords.latitude;
        userLon = userCoords.longitude;
        let nearsuper=[];
        outputDiv.textContent = '店舗座標をDBから取得中...';
        
        // 全スーパーのIDを取得
        const allsuper=await fetchAllsuper();
        if(allsuper){
            const supIds=allsuper.map(item=>item.sup_id);
            for (const supId of supIds) {

                // スーパーごとの全店舗のIDを取得
                const allstore=await fetchAllstore(supId);
                if(allstore){
                    const stoIds=allstore.map(item=>item.sto_id);

                    // 店舗ごとに現在地との距離を取得
                    for (const stoId of stoIds) {
                        // 店舗の緯度経度取得
                        const storeCoords = await fetchDBCoordinates(supId, stoId);
                        stoLat = storeCoords.latitude;
                        stoLon = storeCoords.longitude;
                        
                        // 距離計算・オブジェクトに追加
                        const diffResult = await fetchDifferenceAPI(userLat, userLon, stoLat, stoLon);
                        const superofject = {
                            sup_id: supId,
                            sto_id: stoId,
                            distance: diffResult.difference
                        };
                        nearsuper.push(superofject);
                    }
                }
            }
            // 取得したスーパーの距離を表示
            nearsuper.sort((a, b) => {
                // a.distance から b.distance を引くことで昇順（小さい順）になる
                return a.distance - b.distance;
            });
            outputDiv.appendChild(document.createElement('br'));
            for (const [index, nearSuper] of nearsuper.entries()) {
                const label = document.createElement('label');
                const sup_name = await get_supername(nearSuper.sup_id);
                const sto_name = await get_storename(nearSuper.sup_id, nearSuper.sto_id);
                label.textContent = `${index + 1}位 スーパー：${sup_name}、ストア：${sto_name}、距離：${nearSuper.distance}m`;
                outputDiv.appendChild(label);
                outputDiv.appendChild(document.createElement('br'));
            }
        }else{
            outputDiv.textContent='スーパーのデータが存在しません';
        }
    } catch (error) {
        outputDiv.textContent = `致命的なエラー: ${error.message}`;
        console.error(error);
    }
}