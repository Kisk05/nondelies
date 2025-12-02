async function fetchnewsale(){
    const supId=document.getElementById('sup_id').value;
    const rType=document.getElementById('repeat_type').value;
    const rDayofweek=document.getElementById('repeat_dayofweek').value;
    const mDay=document.getElementById('repeat_monthday').value;
    const yDay_month=document.getElementById('month').value;
    const yDay_day=document.getElementById('day').value;
    const oDay=document.getElementById('repeat_oneday').value;
    const sPro=document.getElementById('sale_pro').value;
    const sDisc=document.getElementById('sale_disc').value;
    const sInfo=document.getElementById('sale_info').value;
    const outputSale = document.getElementById('s_output');
    outputSale.textContent = '処理中...';
    let yDay = '';
    if (yDay_month && yDay_day) {
        const paddedMonth = String(yDay_month).padStart(2, '0');
        const paddedDay = String(yDay_day).padStart(2, '0');
        yDay = `${paddedMonth}/${paddedDay}`; // 例: '01/05', '11/25'
    }

    if (supId===""||sPro===""){
        outputSale.textContent='必須項目が入力されていません';
        return;
    }

    const apiURL = `/php/new_events.php?event_dayofweek=${rDayofweek}&event_rtype=${rType}&event_monthday=${mDay}&event_yearday=${yDay}&event_yearday=${yDay}&event_oneday=${oDay}`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTPエラー ${response.status}`);
        }
        const data = await response.json();

        if (data.status === 'success') {
            const eventId = data.event_id;
            
            if(eventId===""){
                throw new Error(data.message || "イベントID取得エラー")
            }
            const setApiURL = `/php/new_sale.php?sup_id=${supId}&event_id=${eventId}&sal_kind=${sPro}&sal_discount=${sDisc}&sal_info=${sInfo}`;

            const dbResponse = await fetch(setApiURL);
            const dbResult = await dbResponse.json();
            
            outputSale.textContent = '実行: ' + JSON.stringify(dbResult, null, 2);
        } else {
            throw new Error(data.message || "イベント登録APIエラー");
        }
    } catch (error) {
        outputSale.textContent = `致命的なエラー: ${error.message}`;
        console.error(error);
    }
}

async function fetchnewfes(){
    const supId=document.getElementById('sup_id').value;
    const rType=document.getElementById('repeat_type').value;
    const rDayofweek=document.getElementById('repeat_dayofweek').value;
    const mDay=document.getElementById('repeat_monthday').value;
    const yDay_month=document.getElementById('month').value;
    const yDay_day=document.getElementById('day').value;
    const oDay=document.getElementById('repeat_oneday').value;
    const fName=document.getElementById('fes_name').value;
    const fInfo=document.getElementById('fes_info').value;
    const outputFes = document.getElementById('f_output');
    outputFes.textContent = '処理中...';
    let yDay = '';
    if (yDay_month && yDay_day) {
        const paddedMonth = String(yDay_month).padStart(2, '0');
        const paddedDay = String(yDay_day).padStart(2, '0');
        yDay = `${paddedMonth}/${paddedDay}`; // 例: '01/05', '11/25'
    }

    if (supId===""||fName===""){
        outputFes.textContent='必須項目が入力されていません';
        return;
    }

    const apiURL = `/php/new_events.php?event_dayofweek=${rDayofweek}&event_rtype=${rType}&event_monthday=${mDay}&event_yearday=${yDay}&event_oneday=${oDay}`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTPエラー ${response.status}`);
        }
        const data = await response.json();

        if (data.status === 'success') {
            const eventId = data.event_id;
            
            if(eventId===""){
                throw new Error(data.message || "イベントID取得エラー")
            }
            const setApiURL = `/php/new_fes.php?sup_id=${supId}&event_id=${eventId}&fes_name=${fName}&fes_info=${fInfo}`;

            const dbResponse = await fetch(setApiURL);
            const dbResult = await dbResponse.json();
            
            outputFes.textContent = '実行: ' + JSON.stringify(dbResult, null, 2);
        } else {
            throw new Error(data.message || "イベント登録APIエラー");
        }
    } catch (error) {
        outputFes.textContent = `致命的なエラー: ${error.message}`;
        console.error(error);
    }
}

async function fetchnewholiday(){
    const supId=document.getElementById('sup_id').value;
    const rType=document.getElementById('repeat_type').value;
    const rDayofweek=document.getElementById('repeat_dayofweek').value;
    const mDay=document.getElementById('repeat_monthday').value;
    const yDay_month=document.getElementById('month').value;
    const yDay_day=document.getElementById('day').value;
    const oDay=document.getElementById('repeat_oneday').value;
    const hName=document.getElementById('hol_name').value;
    const hInfo=document.getElementById('hol_info').value;
    const outputHoliday = document.getElementById('h_output');
    outputHoliday.textContent = '処理中...';
    let yDay = '';
    if (yDay_month && yDay_day) {
        const paddedMonth = String(yDay_month).padStart(2, '0');
        const paddedDay = String(yDay_day).padStart(2, '0');
        yDay = `${paddedMonth}/${paddedDay}`; // 例: '01/05', '11/25'
    }

    if (supId===""||hName===""){
        outputHoliday.textContent='必須項目が入力されていません';
        return;
    }

    const apiURL = `/php/new_events.php?event_dayofweek=${rDayofweek}&event_rtype=${rType}&event_monthday=${mDay}&event_yearday=${yDay}&event_oneday=${oDay}`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTPエラー ${response.status}`);
        }
        const data = await response.json();

        if (data.status === 'success') {
            const eventId = data.event_id;
            
            if(eventId===""){
                throw new Error(data.message || "イベントID取得エラー")
            }
            const setApiURL = `/php/new_holiday.php?sup_id=${supId}&event_id=${eventId}&hol_name=${hName}&hol_info=${hInfo}`;

            const dbResponse = await fetch(setApiURL);
            const dbResult = await dbResponse.json();
            
            outputHoliday.textContent = '実行: ' + JSON.stringify(dbResult, null, 2);
        } else {
            throw new Error(data.message || "イベント登録APIエラー");
        }
    } catch (error) {
        outputHoliday.textContent = `致命的なエラー: ${error.message}`;
        console.error(error);
    }
}


function updateRepeatFields() {
    const repeatType = document.getElementById('repeat_type').value;
    const repeatDayOfWeek = document.getElementById('repeat_dayofweek');
    const Month = document.getElementById('month');
    const Day = document.getElementById('day');
    const repeatMday = document.getElementById('repeat_monthday');
    const repeatOday = document.getElementById('repeat_oneday');

    // すべてのフィールドを初期状態で有効にする
    repeatDayOfWeek.disabled = false;
    Month.disabled = false;
    Day.disabled = false;
    repeatMday.disabled = false;
    repeatOday.disabled = false;

    // 選択された周期に応じてフィールドを無効化
    switch (repeatType) {
        case 'weekly':
            Month.disabled = true;
            Day.disabled = true;
            repeatMday.disabled = true;
            repeatOday.disabled = true;

            Month.value = '';
            Day.value = '';
            repeatMday.value = '';
            repeatOday.value = '';
            break;
        case 'monthly':
            repeatDayOfWeek.disabled = true;
            Month.disabled = true;
            Day.disabled = true;
            repeatOday.disabled = true;
            
            repeatDayOfWeek.value = '';
            Month.value = '';
            Day.value = '';
            repeatOday.value = '';
            break;
        case 'yearly':
            repeatDayOfWeek.disabled = true;
            repeatMday.disabled = true;
            repeatOday.disabled = true;
            
            repeatDayOfWeek.value = '';
            repeatMday.value = '';
            repeatOday.value = '';
            break;
        case 'one':
            repeatDayOfWeek.disabled = true; 
            Month.disabled = true;
            Day.disabled = true;
            repeatMday.disabled = true;
            
            repeatDayOfWeek.value = '';
            Month.value = '';
            Day.value = '';
            repeatMday.value = '';
            break;
    }
}

/*function updateevetFields() {
    const eventType = document.getElementById('event_type');
    const eventSale = document.getElementById('sale_group');
    const eventFes = document.getElementById('fes_group');
    const eventHoliday = document.getElementById('hol_group');

    eventSale.disabled=false;
    eventFes.disabled=false;
    eventHoliday.disabled=false;

    switch (eventType) {
        case 'sale':
            eventFes.disabled=true;
            eventHoliday.disabled=true;
            break;
        case 'fes':
            eventSale.disabled = true;
            eventHoliday.disabled=true;
            break;
        case 'holiday':
            eventSale.disabled = true;
            eventFes.disabled=true;
            break;
    }
}*/

function initializeListeners() {
    const repeatTypeSelect = document.getElementById('repeat_type');
    // const eventTypeSelect = document.getElementById('event_type');

    updateRepeatFields(); 
    // updateevetFields();
    
    repeatTypeSelect.addEventListener('change', updateRepeatFields);
    // eventTypeSelect.addEventListener('change', updateevetFields);
}
document.addEventListener('DOMContentLoaded', initializeListeners);