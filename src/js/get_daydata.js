document.addEventListener('DOMContentLoaded', async () => {
    // URLからパラメータを取得
    const bartitle = document.getElementById('bartitle');
    const pagetitle = document.getElementById('pagetitle');
    const params = new URLSearchParams(window.location.search);
    const day = params.get('day'); // 例: '2025/11/25'
    const Day=new Date(day);
    const dayofweek=Day.getDay(); // 日曜(0)～土曜(6)
    const monthday=`${Day.getMonth()+1}/${Day.getDate()}`; // 例: '11/25'
    const onlyday=Day.getDate(); // 例: 25
    let selectIds = params.get('selectid'); // 例: '1,3,5'
/*    const supertitle = document.getElementById('superlist');
    supertitle.textContent='選択スーパー：'*/

    if(selectIds===""){
        try {
            const allsuper = await fetchAllsuper();
            if (allsuper && allsuper.length > 0) {
                selectIds = allsuper.map(item => item.sup_id).join(',');
            } else {
                selectIds = '';
            }
        } catch (error) {
            console.error("全スーパーIDの取得に失敗しました:", error);
            selectIds = '';
        }
    }

    if (day) {
        /*const supIdArray = selectIds.split(',');
        for (const supId of supIdArray) {
            const supname = await get_supername(supId); 
            supertitle.textContent += ` ${supname}`;
        }*/
        
        console.log(`日付: ${day}, 月日: ${monthday}, 日: ${onlyday}, 曜日ID: ${dayofweek}, 選択スーパーID: ${selectIds}`);
        bartitle.textContent=`${Day.getMonth()+1}月${Day.getDate()}日のお得日表示画面`
        pagetitle.textContent=`${day}のお得情報`
        
        // サーバーAPIを呼び出し、情報をロードする関数をここで実行
        loadDayData(day, monthday, onlyday, dayofweek, selectIds);
        
    } else if(day){
        document.body.innerHTML = '<h1>エラー: スーパーが選択されていません。</h1>';
        console.log(`日付: ${day}, 月日: ${monthday}, 日: ${onlyday}, 曜日ID: ${dayofweek}, 選択スーパーID: ${selectIds}`);
    }else{
        document.body.innerHTML = '<h1>エラー: 必要な情報が不足しています。</h1>';
        console.log(`日付: ${day}, 月日: ${monthday}, 日: ${onlyday}, 曜日ID: ${dayofweek}, 選択スーパーID: ${selectIds}`);
    }
});

async function loadDayData(day, monthday, onlyday, dayofweek, selectIds) {
    const saletitle = document.getElementById('sale_title');
    const festitle = document.getElementById('fes_title');
    const holtitle = document.getElementById('holiday_title');
    const scontainer=document.querySelector('#sale_list');
    const fcontainer=document.querySelector('#fes_list');
    const hcontainer=document.querySelector('#holiday_list');
    const apiURL = `/php/get_daydata.php?day=${day}&monthday=${monthday}&onlyday=${onlyday}&dayofweek=${dayofweek}&sup_ids=${selectIds}`;
    
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
