/*店舗名リストを取得して表示*/
function loadStoreList() {
    const supId = document.getElementById('sup_id').value;
    const selectElement = document.getElementById('sto_id');
    const outputDiv = document.getElementById('output');
    if (supId===""){
        outputDiv.textContent='スーパー名を選択してください';
        return;
    }
    const apiURL = `/php/get_storelist.php?sup_id=${supId}`;

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

/*任意のスーパー名を取得*/
async function get_supername(sup_id){
    const apiURL = `/php/get_superlist.php?sup_id=${sup_id}`;
    
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        
        o=data.data[0];
        if (data.status === 'success' && o) {
            return o.sup_name; 
        } else {
            console.error(`スーパー名取得エラー for ID ${sup_id}:`, data.message || 'データが見つかりません');
            return '不明なスーパー'; 
        }
    }catch(error) {
        console.error('詳細データロードエラー:', error);
        return '取得失敗';
    }
}

/*任意の店舗名を取得*/
async function get_storename(sup_id,sto_id){
    const apiURL = `/php/get_storelist.php?sup_id=${sup_id}&sto_id=${sto_id}`;
    
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        
        o=data.data[0];
        if (data.status === 'success' && o) {
            return o.sto_name; 
        } else {
            console.error(`店舗名取得エラー for ID ${sto_id}:`, data.message || 'データが見つかりません');
            return '不明な店舗'; 
        }
    }catch(error) {
        console.error('詳細データロードエラー:', error);
        return '取得失敗';
    }
}

/*全スーパー名リストを取得*/
async function fetchAllsuper() {
    const apiURL='/php/get_superlist.php';
    const response = await fetch(apiURL);
    const data = await response.json();

    if (data.status === 'success') {
        return data.data;
    }
    throw new Error(data.message || "住所取得APIエラー");
}

/*全店舗名リストを取得*/
async function fetchAllstore(sup_id) {
    const apiURL=`/php/get_allstoid.php?sup_id=${sup_id}`;
    const response = await fetch(apiURL);
    const data = await response.json();

    if (data.status === 'success') {
        return data.data;
    }
    throw new Error(data.message || "ストアID取得APIエラー");
}

/*郵便番号から住所を取得*/
async function fetchsetaddress(stoPostcode) {
    const apiURL = `/php/get_address.php?postcode=${stoPostcode}`;
    const response = await fetch(apiURL);
    const data = await response.json();
    if (data.status === 'success') {
        return data.address;
    }
    throw new Error(data.message || "住所取得APIエラー");
}

/*住所から座標を取得*/
async function fetchGeocode(address) {
    const apiURL = `/php/get_zahyou.php?address=${address}`; // get_zahyou.php は住所から座標を返すPHP
    const response = await fetch(apiURL);
    const data = await response.json();
    if (data.status === 'success') {
        return { latitude: data.latitude, longitude: data.longitude };
    }
    throw new Error(data.message || "座標取得失敗");
}

/*DBから指定店舗の登録座標を取得*/
async function fetchDBCoordinates(supId, stoId) {
    const apiURL = `/php/get_coordtodb.php?sup_id=${supId}&sto_id=${stoId}`;
    const response = await fetch(apiURL);
    const data = await response.json();
    
    if (data.status === 'success' && data.data && data.data.sto_latitude !== null) { 
        const lat = parseFloat(data.data.sto_latitude);
        const lon = parseFloat(data.data.sto_longitude);

        if (!isNaN(lat) && !isNaN(lon)) {
            return { latitude: lat, longitude: lon };
        }
    }
    throw new Error("DBから店舗座標を取得できませんでした。");
}

/*2点間の距離を取得*/
async function fetchDifferenceAPI(lat1, lon1, lat2, lon2) {
    const setApiURL = `/php/get_difference.php?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}`;
    const response = await fetch(setApiURL);
    const data = await response.json();

    if (data.status === 'success') {
        return data.difference;
    }
    throw new Error("DBから店舗座標を取得できませんでした。");
}

/*選択したスーパーをお気に入り登録処理*/
function regist_favSuper(supId, stoId, supName, stoName) {
    const message = `${supName}${stoName} をお気に入りとして登録しますか？`;

    if (confirm(message)) {
        const date = new Date();
        const todayDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        const encodedDay = encodeURIComponent(todayDate);

        location.href = `/html/get_daydata.html?day=${encodedDay}&supid=${supId}&stoid=${stoId}`;
    }
}