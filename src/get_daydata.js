document.addEventListener('DOMContentLoaded', async () => {
    // URLからパラメータを取得
    const pagetitle = document.getElementById('pagetitle');
    const supertitle = document.getElementById('superlist');
    const params = new URLSearchParams(window.location.search);
    const day = params.get('day'); // 例: '2025/11/25'
    const Day=new Date(day);
    const dayofweek=Day.getDay();
    const selectIds = params.get('selectid'); // 例: '1,3,5'
    supertitle.textContent='選択スーパー：'

    if (day && selectIds) {
        const supIdArray = selectIds.split(',');
        for (const supId of supIdArray) {
            const supname = await get_supername(supId); 
            supertitle.textContent += ` ${supname}`;
        }
        
        console.log(`日付: ${day}, 曜日ID: ${dayofweek}, 選択スーパーID: ${selectIds}`);
        pagetitle.textContent=`${day}のお得情報`
        
        // サーバーAPIを呼び出し、情報をロードする関数をここで実行
        loadDayData(day, dayofweek, selectIds);
        
    } else {
        document.body.innerHTML = '<h1>エラー: 必要な情報が不足しています。</h1>';
    }
});

async function loadDayData(day, dayofweek, selectIds) {
    const saletitle = document.getElementById('sale_title');
    const festitle = document.getElementById('fes_title');
    const holtitle = document.getElementById('holiday_title');
    const scontainer=document.querySelector('#sale_list');
    const fcontainer=document.querySelector('#fes_list');
    const hcontainer=document.querySelector('#holiday_list');
    const apiURL = `get_daydata.php?day=${day}&dayofweek=${dayofweek}&sup_ids=${selectIds}`;
    
    fetch(apiURL)
        .then(response => response.json())
        .then(async data => {
            scontainer.innerHTML = '';
            fcontainer.innerHTML='';
            hcontainer.innerHTML='';
            if (data.status === 'success') {
                if(data.data.sale_list && data.data.sale_list.length > 0){
                    saletitle.textContent='セール:';

                    const groupedSales = data.data.sale_list.reduce((acc, sale) => {
                        const supId = sale.sup_id;
                        if (!acc[supId]) {
                            acc[supId] = [];
                        }
                        acc[supId].push(sale);
                        return acc;
                    }, {});

                    for (const supId in groupedSales) {
                        const supname = await get_supername(supId);
                        
                        // スーパー名を表示
                        const slabel = document.createElement('h3');
                        slabel.textContent = `🛒 ${supname} のセール情報`;
                        scontainer.appendChild(slabel);
                        scontainer.appendChild(document.createElement('hr')); // 区切り線

                        // セール情報
                        groupedSales[supId].forEach(salelist => {
                            const label=document.createElement('label');
                            
                            label.textContent = `${salelist.sal_kind}`;
                            if (salelist.sal_discount){
                                label.textContent += `：${salelist.sal_discount}%OFF`;
                            }
                            if (salelist.sal_info){
                                label.textContent += `\t詳細：${salelist.sal_info}`;
                            }
                            scontainer.appendChild(label);
                            scontainer.appendChild(document.createElement('br'));
                        });
                        scontainer.appendChild(document.createElement('br')); // スーパー間の間隔
                    }
                }

                if(data.data.fes_list && data.data.fes_list.length > 0){
                    festitle.textContent='イベント:';

                    const fesgroup = data.data.fes_list.reduce((acc, fes) => {
                        const supId = fes.sup_id;
                        if (!acc[supId]) {
                            acc[supId] = [];
                        }
                        acc[supId].push(fes);
                        return acc;
                    }, {});

                    for (const supId in fesgroup) {
                        const supname = await get_supername(supId);

                        const flabel = document.createElement('h3');
                        flabel.textContent = `🛒 ${supname} の祭り情報`;
                        fcontainer.appendChild(flabel);
                        fcontainer.appendChild(document.createElement('hr'));

                        fesgroup[supId].forEach(feslist => {
                            const label=document.createElement('label');
                            
                            label.textContent = `${feslist.fes_name}`;
                            if (feslist.fes_info){
                                label.textContent += `\t詳細：${feslist.fes_info}`;
                            }
                            fcontainer.appendChild(label);
                            fcontainer.appendChild(document.createElement('br'));
                        });
                        fcontainer.appendChild(document.createElement('br'));
                    }
                }

                if(data.data.holiday_list && data.data.holiday_list.length > 0){
                    holtitle.textContent='店休日:';

                    const holgroup = data.data.holiday_list.reduce((acc, hol) => {
                        const supId = hol.sup_id;
                        if (!acc[supId]) {
                            acc[supId] = [];
                        }
                        acc[supId].push(hol);
                        return acc;
                    }, {});

                    for (const supId in holgroup) {
                        const supname = await get_supername(supId);

                        const hlabel = document.createElement('h3');
                        hlabel.textContent = `🛒 ${supname} の店休日`;
                        hcontainer.appendChild(hlabel);
                        hcontainer.appendChild(document.createElement('hr'));

                        holgroup[supId].forEach(hollist => {
                            const label=document.createElement('label');
                            
                            label.textContent = `${hollist.hol_name}`;
                            if (hollist.hol_info){
                                label.textContent += `\t詳細：${hollist.hol_info}`;
                            }
                            hcontainer.appendChild(label);
                            hcontainer.appendChild(document.createElement('br'));
                        });
                        hcontainer.appendChild(document.createElement('br'));
                    }
                }
            }
        })
        .catch(error => {
            console.error('詳細データロードエラー:', error);
        });
}

async function get_supername(sup_id){
    const apiURL = `get_supername.php?sup_id=${sup_id}`;
    
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        
        if (data.status === 'success' && data.data && data.data.sup_name) {
            return data.data.sup_name; 
        } else {
            console.error(`スーパー名取得エラー for ID ${sup_id}:`, data.message || 'データが見つかりません');
            return '不明なスーパー'; 
        }
    }catch(error) {
        console.error('詳細データロードエラー:', error);
        return '取得失敗';
    }
}