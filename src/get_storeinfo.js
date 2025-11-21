function loadSuperList() {
    const selectElement = document.getElementById('sup_id');
    const apiURL = 'get_superlist.php';

    fetch(apiURL)
        .then(response => response.json())
        .then(result => {
            selectElement.innerHTML = '';
            if (result.status === 'success' && result.data.length > 0) {
                // デフォルトの選択肢を追加
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = `${result.count}件のデータがあります`;
                selectElement.appendChild(defaultOption);

                // DBから取得したデータでオプションを生成
                result.data.forEach(storelist => {
                    const option = document.createElement('option');
                    option.value = storelist.sup_id;
                    option.textContent = storelist.sup_name; // 表示名にはスーパー名を設定
                    selectElement.appendChild(option);
                });
            } else {
                selectElement.innerHTML = '<option value="">データがありません</option>';
            }
        })
        .catch(error => {
            selectElement.innerHTML = '<option value="">リストのロードに失敗</option>';
            console.error('スーパーリストロードエラー:', error);
        });
}

function loadStoreList() {
    const supId = document.getElementById('sup_id').value;
    const selectElement = document.getElementById('sto_id');
    const outputDiv = document.getElementById('output');
    if (supId===""){
        outputDiv.textContent='スーパー名を選択してください';
        return;
    }
    const apiURL = `get_storelist.php?sup_id=${supId}`;

    fetch(apiURL)
        .then(response => response.json())
        .then(result => {
            selectElement.innerHTML = '';
            if (result.status === 'success' && result.data.length > 0) {
                // デフォルトの選択肢を追加
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = `${result.count}件のデータがあります`;
                selectElement.appendChild(defaultOption);

                // DBから取得したデータでオプションを生成
                result.data.forEach(storelist => {
                    const option = document.createElement('option');
                    option.value = storelist.sto_id;
                    option.textContent = storelist.sto_name; // 表示名には店舗名を設定
                    selectElement.appendChild(option);
                });
            } else {
                selectElement.innerHTML = '<option value="">データがありません</option>';
            }
        })
        .catch(error => {
            selectElement.innerHTML = '<option value="">リストのロードに失敗</option>';
            console.error('ストアリストロードエラー:', error);
        });
}



function fetchCoordinates() {
    const supId = document.getElementById('sup_id').value;
    const stoId = document.getElementById('sto_id').value;
    const outputDiv = document.getElementById('output');
    outputDiv.textContent = '取得中...';

    if (supId===""||stoId===""){
        outputDiv.textContent='必須項目が入力されていません';
        return;
    }
    const apiURL = `get_coordtodb.php?sup_id=${supId}&sto_id=${stoId}`;

    fetch(apiURL)
        .then(response => {
            // HTTPエラー（400, 500など）のチェック
            if (!response.ok) {
                throw new Error(`HTTPエラー ${response.status}: サーバー側でエラーが発生しました。`);
            }
            // 応答をJSONとして解析
            return response.json();
        })
        .then(data => {
            // JSONデータを整形して表示
            outputDiv.textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            // ネットワークエラーやJSON解析エラー、HTTPエラーを捕捉
            return `エラー: ${error.message}\n` + 'PHPファイルまたはDB接続を確認してください。';
        });
}

function fetchsaleday() {
    const supId = document.getElementById('sup_id').value;
    const outputDiv = document.getElementById('output');
    outputDiv.textContent = '取得中...';

    const apiURL = `get_saleday.php?sup_id=${supId}`;

    fetch(apiURL)
        .then(response => {
            // HTTPエラー（400, 500など）のチェック
            if (!response.ok) {
                throw new Error(`HTTPエラー ${response.status}: サーバー側でエラーが発生しました。`);
            }
            // 応答をJSONとして解析
            return response.json();
        })
        .then(data => {
            // JSONデータを整形して表示
            outputDiv.textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            // ネットワークエラーやJSON解析エラー、HTTPエラーを捕捉
            outputDiv.textContent = `エラー: ${error.message}\n` + 'PHPファイルまたはDB接続を確認してください。';
            console.error(error);
        });
}

async function fetchdifference() {
    const supId = document.getElementById('sup_id').value;
    const stoId = document.getElementById('sto_id').value;
    const postcode = document.getElementById('postcode').value;
    let address = document.getElementById('address').value;
    const outputDiv = document.getElementById('output2');
    outputDiv.textContent = '処理中...';

    if (supId===""||stoId===""||postcode===""){
        outputDiv.textContent='必須項目が入力されていません';
        return;
    }
    
    let userLat,userLon;
    let stoLat,stoLon;

    try {
        // 店舗の緯度経度取得
        outputDiv.textContent = '店舗座標をDBから取得中...';
        const storeCoords = await fetchDBCoordinates(supId, stoId);
        stoLat = storeCoords.latitude;
        stoLon = storeCoords.longitude;
        
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

        // 距離計算
        outputDiv.textContent = '距離を計算中...';
        const diffResult = await fetchDifferenceAPI(userLat, userLon, stoLat, stoLon);
        
        outputDiv.textContent = '実行: ' + JSON.stringify(diffResult, null, 2);

    } catch (error) {
        outputDiv.textContent = `致命的なエラー: ${error.message}`;
        console.error(error);
    }
}

async function fetchsetaddress(stoPostcode) {
    const apiURL = `get_address.php?postcode=${stoPostcode}`;
    const response = await fetch(apiURL);
    const data = await response.json();
    if (data.status === 'success') {
        return data.address;
    }
    throw new Error(data.message || "住所取得APIエラー");
}

async function fetchGeocode(address) {
    const apiURL = `get_zahyou.php?address=${address}`; // get_zahyou.php は住所から座標を返すPHP
    const response = await fetch(apiURL);
    const data = await response.json();
    if (data.status === 'success') {
        return { latitude: data.latitude, longitude: data.longitude };
    }
    throw new Error(data.message || "座標取得失敗");
}

async function fetchDBCoordinates(supId, stoId) {
    const apiURL = `get_coordtodb.php?sup_id=${supId}&sto_id=${stoId}`;
    const response = await fetch(apiURL);
    const data = await response.json();
    
    if (data.sto_latitude) { 
        return { latitude: data.sto_latitude, longitude: data.sto_longitude };
    }
    throw new Error("DBから店舗座標を取得できませんでした。");
}

async function fetchDifferenceAPI(lat1, lon1, lat2, lon2) {
    const setApiURL = `get_difference.php?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}`;
    const Response = await fetch(setApiURL);
    return await Response.json();
}

document.addEventListener('DOMContentLoaded', loadSuperList);