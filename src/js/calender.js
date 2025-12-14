const weeks = ['日', '月', '火', '水', '木', '金', '土'];
const date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
const config = {
    show: 1,
}
let selectedSupIds;

// カレンダーを表示
function showCalendar(year, month) {
    for ( i = 0; i < config.show; i++) {
        const calendarHtml = createCalendar(year, month);
        const sec = document.createElement('section');
        sec.innerHTML = calendarHtml;
        document.querySelector('#calendar').appendChild(sec);

        month++;
        if (month > 12) {
            year++;
            month = 1;
        }
    }
}

// カレンダーを作成
function createCalendar(year, month) {
    const startDate = new Date(year, month - 1, 1); // 例: Sat Nov 01 2025 00:00:00 GMT+0900 (日本標準時)
    const endDate = new Date(year, month,  0); // 例: Sun Nov 30 2025 00:00:00 GMT+0900 (日本標準時)
    const endDayCount = endDate.getDate(); // ...Nov「30」2025...
    const lastMonthEndDate = new Date(year, month - 1, 0); // 前月の最後の日の情報
    const lastMonthendDayCount = lastMonthEndDate.getDate(); // ...Oct「31」2025...
    const startDay = startDate.getDay(); // 例: 6（月の最初の日の曜日を取得）
    let dayCount = 1; // 日にちのカウント
    let calendarHtml = '';

    calendarHtml += `<div class="calendar_title">${year}/${month}</div>`;
    calendarHtml += '<table>';

    // 曜日の行を作成
    for (let i = 0; i < weeks.length; i++) {
        calendarHtml += `<td class="dayofweek">${weeks[i]}</td>`;
    }

    // カレンダーの最大行数分ループ
    for (let w = 0; w < 6; w++) {
        calendarHtml += '<tr>';

        // 横の列数7列（1週間）分ループ
        for (let d = 0; d < 7; d++) {
            if (w == 0 && d < startDay) {
                // 1行目で1日の曜日の前
                let num = lastMonthendDayCount - startDay + d + 1;
                calendarHtml += `<td class="is-disabled">${num}</td>`;
            } else if (dayCount > endDayCount) {
                // 末尾の日数を超えた
                let num = dayCount - endDayCount;
                calendarHtml += `<td class="is-disabled">${num}</td>`;
                dayCount++;
            } else {
                if(year==date.getFullYear()&&month==date.getMonth()+1&&dayCount==date.getDate()){
                    calendarHtml+=`<td class="today" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`
                }else{
                    if(d==0){
                        calendarHtml += `<td class="calendar_td_sun" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`;
                    }else if(d==6){
                        calendarHtml += `<td class="calendar_td_sat" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`;
                    }else{
                        calendarHtml += `<td class="calendar_td" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`;
                    }
                }
                dayCount++;
            }
        }
        calendarHtml += '</tr>';

        // 6行目の必要がなければ終了
        if (dayCount > endDayCount){
            break;
        }
    }
    calendarHtml += '</table>';

    return calendarHtml;
}

// カレンダーの月変更
function moveCalendar(e) {
    document.querySelector('#calendar').innerHTML = '';

    if (e.target.id === 'lastyear') {
        year--;
    }
    if (e.target.id === 'prev') {
        month--;

        if (month < 1) {
            year--;
            month = 12;
        }
    }
    if (e.target.id === 'current') {
        // date = new Date() 再取得する場合はdateの定義をconst→letに変更
        year = date.getFullYear();
        month = date.getMonth() + 1;
    }
    if (e.target.id === 'next') {
        month++;

        if (month > 12) {
            year++;
            month = 1;
        }
    }
    if (e.target.id === 'nextyear') {
        year++;
    }

    // 再表示
    showCalendar(year, month);
    selectcheckbox();
}

// 選択されているチェックボックスのスーパーIDを取得
function getSelectSupid() {
    const checkboxes = document.querySelectorAll('#sup_list input[type="checkbox"]');
    const selectId = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectId.push(checkbox.value);
        }
    });
    return selectId;

    /**
     * TODO:マップに自動表示+再検索機能
     * TODO:
     */
}

// チェックボックスが選択されたとき
function selectcheckbox(){
    selectedSupIds = getSelectSupid();
    
    // 選択されたスーパーIDのリストが空の場合
    if (selectedSupIds.length === 0) {
        document.querySelectorAll('#calendar td:not(.is-disabled)').forEach(cell => {
            cell.classList.remove('sale-day', 'fes-day', 'holiday');
        });
        return;
    }
    // カレンダーを再描画し、お得日データをAPIから取得して表示する処理など
    const url=`/php/get_montheventdata.php?year=${year}&month=${month}&sup_ids=${selectedSupIds}`;

    fetch(url)
        .then(response => response.json())
        .then(result => {
            if(result.status==='success'){
                eventCalendar(result.data,year,month);
            }else{
                console.log("イベント情報取得APIエラー");
            }
        })
        .catch(error => {
            console.error('スーパーリストロードエラー:', error);
        });
}
function eventCalendar(eventData, currentYear, currentMonth) {
    document.querySelectorAll('#calendar td:not(.is-disabled)').forEach(cell => {
        cell.classList.remove('sale-day', 'fes-day', 'holiday');
    });

    document.querySelectorAll('#calendar td:not(.is-disabled,.dayofweek)').forEach(cell => {
        const fullDate = cell.dataset.date;
        const [y, m, d] = fullDate.split('/').map(Number); // 年、月、日を数値で取得
        
        // 判定に必要な情報を準備
        const dateObj = new Date(y, m - 1, d); // Dateオブジェクト (月の0-11に注意)
        const dayOfWeek = dateObj.getDay(); // 曜日 (0:日〜6:土)
        
        // MM/DD形式とYYYY-MM-DD形式をゼロ埋めして準備
        const monthDayStr = `${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}`; // MM/DD
        const fullDateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`; // YYYY-MM-DD

        let isSale = false;
        let isFes = false;
        let isHoliday = false;

        // 特売日 (sale_list) の判定
        eventData.sale_list.forEach(sale => {
            if (sale.event_dayofweek == dayOfWeek && sale.event_rtype === 'weekly' ||
                sale.event_monthday == d && sale.event_rtype === 'monthly' ||
                sale.event_yearday === monthDayStr && sale.event_rtype === 'yearly' ||
                sale.event_oneday === fullDateStr && sale.event_rtype === 'one') {
                isSale = true;
            }
        });
        
        // フェス・イベント (fes_list) の判定
        eventData.fes_list.forEach(fes => {
            if (fes.event_dayofweek == dayOfWeek && fes.event_rtype === 'weekly' ||
                fes.event_monthday == d && fes.event_rtype === 'monthly' ||
                fes.event_yearday === monthDayStr && fes.event_rtype === 'yearly' ||
                fes.event_oneday === fullDateStr && fes.event_rtype === 'one') {
                isFes = true;
            }
        });

        // 定休日 (holiday_list) の判定
        eventData.holiday_list.forEach(holiday => {
            if (holiday.event_dayofweek == dayOfWeek && holiday.event_rtype === 'weekly' ||
                holiday.event_monthday == d && holiday.event_rtype === 'monthly' ||
                holiday.event_yearday === monthDayStr && holiday.event_rtype === 'yearly' ||
                holiday.event_oneday === fullDateStr && holiday.event_rtype === 'one') {
                isHoliday = true;
            }
        });

        if (isHoliday) {
            cell.classList.add('holiday'); // 定休日 (赤系)
        }else if (isFes) {
            cell.classList.add('fes-day');
        }else if(isSale){
            cell.classList.add('sale-day');
        }
    });
}

/*
function event_calender(eventdata){
    if(eventdata.sale_list){
        eventdata.sale_list.map(sale=>{
            switch(sale.event_rtype){
                case 'weekly':
                    console.log(sale.event_dayofweek,sale.sal_kind);
                    break;
                case 'monthly':
                    console.log(sale.event_monthday,sale.sal_kind);
                    break;
                case 'yearly':
                    console.log(sale.event_yearday,sale.sal_kind);
                    break;
                case 'one':
                    console.log(sale.event_oneday,sale.sal_kind);
            }
        })
    }
    if(eventdata.fes_list){
        eventdata.fes_list.map(fes=>{
            switch(fes.event_rtype){
                case 'weekly':
                    console.log(fes.event_dayofweek,fes.fes_name);
                    break;
                case 'monthly':
                    console.log(fes.event_monthday,fes.fes_name);
                    break;
                case 'yearly':
                    console.log(fes.event_yearday,fes.fes_name);
                    break;
                case 'one':
                    console.log(fes.event_oneday,fes.fes_name);
            }
        })
    }
    if(eventdata.holiday_list){
        eventdata.holiday_list.map(holiday=>{
            switch(holiday.event_rtype){
                case 'weekly':
                    console.log(holiday.event_dayofweek,holiday.hol_name);
                    break;
                case 'monthly':
                    console.log(holiday.event_monthday,holiday.hol_name);
                    break;
                case 'yearly':
                    console.log(holiday.event_yearday,holiday.hol_name);
                    break;
                case 'one':
                    console.log(holiday.event_oneday,holiday.hol_name);
            }
        })
    }
}*/
// ページ表示時にスーパーのリストをチェックボックスとして表示
function loadSuperChb() {
    const container = document.querySelector('#sup_list');
    const apiURL = '/php/get_superlist.php';

    fetch(apiURL)
        .then(response => response.json())
        .then(result => {
            container.innerHTML = '';
            if (result.status === 'success' && result.data.length > 0) {
                // DBから取得したデータでオプションを生成
                result.data.forEach(superlist => {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id=`super_${superlist.sup_id}`;
                    checkbox.value=superlist.sup_id;
                    checkbox.class='checkbox';
                    checkbox.addEventListener('change', selectcheckbox);

                    const label=document.createElement('label');
                    label.htmlFor=checkbox.id;
                    label.textContent = superlist.sup_name; // 表示名にはスーパー名を設定
                    
                    container.appendChild(checkbox);
                    container.appendChild(label);
                    container.appendChild(document.createTextNode(' '));
                });
                selectcheckbox();
            } else {
                container.innerHTML = '<p>データがありません</p>';
            }
        })
        .catch(error => {
            container.innerHTML = '<p>リストのロードに失敗</p>';
            console.error('スーパーリストロードエラー:', error);
        });
}

document.querySelector('#lastyear').addEventListener('click', moveCalendar);
document.querySelector('#prev').addEventListener('click', moveCalendar);
document.querySelector('#current').addEventListener('click', moveCalendar);
document.querySelector('#next').addEventListener('click', moveCalendar);
document.querySelector('#nextyear').addEventListener('click', moveCalendar);
document.addEventListener("click", function(e) {
    // 日付クリックでページ移動
    if(e.target.classList.contains("calendar_td")||e.target.classList.contains("calendar_td_sun")||e.target.classList.contains("calendar_td_sat")||e.target.classList.contains("today")) {
        // alert('クリックした日付は' + e.target.dataset.date + 'です');
        const encodedDay = encodeURIComponent(e.target.dataset.date);
        const encodedSelectIds = encodeURIComponent(selectedSupIds.join(','));
        this.location.href=`/html/get_daydata.html?day=${encodedDay}&selectid=${encodedSelectIds}`;
    }
});

document.addEventListener('DOMContentLoaded', loadSuperChb);
showCalendar(year,month);