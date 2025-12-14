async function findsuper(){
    //const supId = document.getElementById('sup_id').value;
    //const stoId = document.getElementById('sto_id').value;
    const postcode = document.getElementById('postcode').value;
    //let address = document.getElementById('address').value;
    const outputDiv = document.getElementById('output');
    outputDiv.textContent = '検索中...';

    if (postcode===""){
        outputDiv.textContent='必須項目が入力されていません';
        return;
    }
    
    let userLat,userLon;
    let stoLat,stoLon;

    try {
        console.log('住所を取得中...');
        const address = await fetchsetaddress(postcode);
        
        if (!address) {
            throw new Error('郵便番号から住所を取得できませんでした。');
        }

        // 入力した住所の緯度経度取得
        console.log('ユーザー座標を計算中...');
        const userCoords = await fetchGeocode(address);
        userLat = userCoords.latitude;
        userLon = userCoords.longitude;
        let nearsuper=[];
        console.log('店舗座標をDBから取得中...');
        
        // 全スーパーのIDを取得
        const allsuper=await fetchAllsuper();
        if(allsuper){
            const supIds = allsuper.map(item => item.sup_id);
            
            // すべての店舗の距離計算を並列で行うためのPromiseリスト
            const distancePromises = [];

            for (const supId of supIds) {
                const allstore = await fetchAllstore(supId);
                if(allstore){
                    for (const store of allstore) {
                        const stoId = store.sto_id;

                        // 店舗の緯度経度取得
                        const storeCoords = await fetchDBCoordinates(supId, stoId);
                        const stoLat = storeCoords.latitude;
                        const stoLon = storeCoords.longitude;
                        
                        const promise = fetchDifferenceAPI(userLat, userLon, stoLat, stoLon)
                            .then(diffResult => {
                                return {
                                    sup_id: supId,
                                    sto_id: stoId,
                                    distance: parseFloat(diffResult) // メートル単位を想定
                                };
                            });
                        distancePromises.push(promise);
                    }
                }
            }

            const allDistances = await Promise.all(distancePromises);
            nearsuper.push(...allDistances);
            nearsuper.sort((a, b) => a.distance - b.distance);
            
            const resultHtmlPromises = nearsuper.map(async (item) => {
                const sup_name = await get_supername(item.sup_id);
                const sto_name = await get_storename(item.sup_id, item.sto_id);
                const distance = (item.distance / 1000).toFixed(2);
                
                return `
                    <div class="nearsuper_card" onclick="regist_favSuper('${item.sup_id}', '${item.sto_id}', '${sup_name}', '${sto_name}')">
                        <div class="card_name">${sup_name} - ${sto_name}</div>
                        <div class="card_distance">${distance} km</div>
                        <div class="card_action">選択して登録する</div>
                    </div>
                `;
            });
            
            // すべての名前取得とHTML生成が完了するのを待つ
            const resultHtmlArray = await Promise.all(resultHtmlPromises);
            
            outputDiv.innerHTML = `<div class="result">${resultHtmlArray.join('')}</div>`;
        }else{
            outputDiv.textContent='スーパーのデータが存在しません';
        }
    } catch (error) {
        outputDiv.textContent = `致命的なエラー: ${error.message}`;
        console.error(error);
    }
}