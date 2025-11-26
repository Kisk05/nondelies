document.addEventListener('DOMContentLoaded', () => {
    // URLからパラメータを取得
    const pagetitle = document.getElementById('pagetitle');
    const params = new URLSearchParams(window.location.search);
    const day = params.get('day'); // 例: '2025/11/25'
    const selectIds = params.get('selectid'); // 例: '1,3,5'
    
    if (day && selectIds) {
        console.log(`日付: ${day}, 選択スーパーID: ${selectIds}`);
        pagetitle.textContent=`${day}のお得情報`
        
        // サーバーAPIを呼び出し、情報をロードする関数をここで実行
        loadDayData(day, selectIds);
        
    } else {
        document.body.innerHTML = '<h1>エラー: 必要な情報が不足しています。</h1>';
    }
});

function loadDayData(day, selectIds) {
    const scontainer=document.querySelector('#sale_list');
    const fcontainer=document.querySelector('#fes_list');
    const hcontainer=document.querySelector('#holiday_list');
    const apiURL = `get_daydata.php?day=${day}&sup_ids=${selectIds}`;
    
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            scontainer.innerHTML = '';
            fcontainer.innerHTML='';
            hcontainer.innerHTML='';
            if (data.status === 'success') {
                if(data.data.sale_list && data.data.sale_list.length > 0){
                    data.data.sale_list.forEach(salelist => {
                        const label=document.createElement('label');
                        label.textContent = salelist.sal_kind; // 例: sal_kind を表示
                        scontainer.appendChild(label);
                        scontainer.appendChild(document.createElement('br'));
                    });
                } else {
                    scontainer.innerHTML = '<p>データがありません</p>';
                }

                if(data.data.fes_list && data.data.fes_list.length > 0){
                    data.data.fes_list.forEach(feslist => {
                        const label=document.createElement('label');
                        label.textContent = feslist.fes_name;
                        fcontainer.appendChild(label);
                        fcontainer.appendChild(document.createElement('br'));
                    });
                } else {
                    fcontainer.innerHTML = '<p>データがありません</p>';
                }

                if(data.data.holiday_list && data.data.holiday_list.length > 0){
                    data.data.holiday_list.forEach(hollist => {
                        const label=document.createElement('label');
                        label.textContent = hollist.hol_name;
                        hcontainer.appendChild(label);
                        hcontainer.appendChild(document.createElement('br'));
                    });
                } else {
                    hcontainer.innerHTML = '<p>データがありません</p>';
                }
            }
        })
        .catch(error => {
            console.error('詳細データロードエラー:', error);
        });
}

