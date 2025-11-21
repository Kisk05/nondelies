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
                result.data.forEach(supermarket => {
                    const option = document.createElement('option');
                    option.value = supermarket.sup_id;
                    option.textContent = supermarket.sup_name; // 表示名にはスーパー名を設定
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

function loadStoreInfo() {
    const supId = document.getElementById('sup_id').value;
    const stoId = document.getElementById('sto_id').value;
    const stonameElement = document.getElementById('store_name');
    const stopostElement = document.getElementById('store_postcode');
    const stoaddElement = document.getElementById('store_address');
    const outputDiv = document.getElementById('output');
    outputDiv.textContent='取得中...';

    const apiURL = `get_storeinfo.php?sup_id=${supId}&sto_id=${stoId}`;

    fetch(apiURL)
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                // JSONデータを整形して表示
                stonameElement.value = result.data.sto_name || '';
                stopostElement.value = result.data.sto_postcode || '';
                stoaddElement.value = result.data.sto_address || '';

                outputDiv.textContent='店舗情報を取得完了';
            }
        })
        .catch(error => {
            // ネットワークエラーやJSON解析エラー、HTTPエラーを捕捉
            outputDiv.textContent = `エラー: ${error.message}\n` + 'PHPファイルまたはDB接続を確認してください。';
            console.error(error);
        });
}

async function fetchnewstore() {
    const supId = document.getElementById('sup_id').value;
    const stoName = document.getElementById('store_name').value;
    const stoPostcode = document.getElementById('store_postcode').value;
    let stoAddress = document.getElementById('store_address').value;
    const outputDiv = document.getElementById('output');
    outputDiv.textContent = '取得中...';

    if (supId===""||stoName===""||stoPostcode===""){
        outputDiv.textContent='必須項目が入力されていません';
        return;
    }
    if (stoAddress === "") {
        outputDiv.textContent = '住所を郵便番号から取得中...';
        try {
            stoAddress = await fetchsetaddress(stoPostcode); 
            
            if (!stoAddress) {
                 outputDiv.textContent = 'エラー: 郵便番号から住所を取得できませんでした。';
                 return;
            }
            outputDiv.textContent = '座標を計算中...';
        } catch (error) {
            outputDiv.textContent = `住所取得エラー: ${error.message}`;
            return;
        }
    }

    const apiURL = `get_zahyou.php?address=${stoAddress}`;

    try {
        const response = await fetch(apiURL);
        if(response.status===409)
        {
            throw new Error("重複エラー: この名前は使用できません。");
        }
        if (!response.ok) 
        {
            throw new Error(`HTTPエラー ${response.status}`);
        }
        const data = await response.json();

        if (data.status === 'success') 
        {
            const stoLat = data.latitude;
            const stoLon = data.longitude;

            const setApiURL = `new_store.php?sup_id=${supId}&sto_name=${stoName}&sto_postcode=${stoPostcode}&sto_address=${stoAddress}&sto_latitude=${stoLat}&sto_longitude=${stoLon}`;

            const dbResponse = await fetch(setApiURL);
            const dbResult = await dbResponse.json();
            
            outputDiv.textContent = '実行: ' + JSON.stringify(dbResult, null, 2);
        } 
        else 
        {
            throw new Error(data.message || "座標取得APIエラー");
        }
    } catch (error) {
        outputDiv.textContent = `致命的なエラー: ${error.message}`;
        console.error(error);
    }
}

async function changestore() {
    const stoId=document.getElementById('sto_id').value;
    const supId=document.getElementById('sup_id').value;
    const stoName = document.getElementById('store_name').value;
    const stoPostcode = document.getElementById('store_postcode').value;
    let stoAddress = document.getElementById('store_address').value;
    const outputDiv = document.getElementById('output');
    outputDiv.textContent = '処理中...';

    if (stoId===""){
        outputDiv.textContent='店舗が選択されていません';
        return;
    }
    if (supId===""||stoName===""||stoPostcode===""){
        outputDiv.textContent='必須項目が入力されていません';
        return;
    }
    if (stoAddress === "") {
        outputDiv.textContent = '住所を郵便番号から取得中...';
        try {
            stoAddress = await fetchsetaddress(stoPostcode); 
            
            if (!stoAddress) {
                 outputDiv.textContent = 'エラー: 郵便番号から住所を取得できませんでした。';
                 return;
            }
            outputDiv.textContent = '座標を計算中...';
        } catch (error) {
            outputDiv.textContent = `住所取得エラー: ${error.message}`;
            return;
        }
    }

    const apiURL = `get_zahyou.php?address=${stoAddress}`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) 
        {
            throw new Error(`HTTPエラー ${response.status}`);
        }
        const data = await response.json();

        if (data.status === 'success') 
        {
            const stoLat = data.latitude;
            const stoLon = data.longitude;

            const setApiURL = `change_store.php?sto_id=${stoId}&sup_id=${supId}&sto_name=${stoName}&sto_postcode=${stoPostcode}&sto_address=${stoAddress}&sto_latitude=${stoLat}&sto_longitude=${stoLon}`;

            const dbResponse = await fetch(setApiURL);
            const dbResult = await dbResponse.json();
            
            outputDiv.textContent = '実行: ' + JSON.stringify(dbResult, null, 2);
        } 
        else 
        {
            throw new Error(data.message || "座標取得APIエラー");
        }
    } catch (error) {
        outputDiv.textContent = `致命的なエラー: ${error.message}`;
        console.error(error);
    }
}

function fetchsetaddress(stoPostcode) {
    const apiURL = `get_address.php?postcode=${stoPostcode}`;

    return fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                return data.address;
            } else {
                throw new Error(data.message || "住所取得APIエラー");
            }
        })
}


document.addEventListener('DOMContentLoaded', loadSuperList);