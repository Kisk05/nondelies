const weeks = ['日', '月', '火', '水', '木', '金', '土']
const date = new Date()
let year = date.getFullYear()
let month = date.getMonth() + 1
const config = {
    show: 1,
}
let selectedSupIds

function showCalendar(year, month) {
    for ( i = 0; i < config.show; i++) {
        const calendarHtml = createCalendar(year, month)
        const sec = document.createElement('section')
        sec.innerHTML = calendarHtml
        document.querySelector('#calendar').appendChild(sec)

        month++
        if (month > 12) {
            year++
            month = 1
        }
    }
}

function createCalendar(year, month) {
    const startDate = new Date(year, month - 1, 1) // 例: Sat Nov 01 2025 00:00:00 GMT+0900 (日本標準時)
    const endDate = new Date(year, month,  0) // 例: Sun Nov 30 2025 00:00:00 GMT+0900 (日本標準時)
    const endDayCount = endDate.getDate() // ...Nov「30」2025...
    const lastMonthEndDate = new Date(year, month - 1, 0) // 前月の最後の日の情報
    const lastMonthendDayCount = lastMonthEndDate.getDate() // ...Oct「31」2025...
    const startDay = startDate.getDay() // 例: 6（月の最初の日の曜日を取得）
    let dayCount = 1 // 日にちのカウント
    let calendarHtml = '' // HTMLを組み立てる変数

    calendarHtml += '<h5>' + year  + '/' + month  + '</h5>'
    calendarHtml += '<table>'

    // 曜日の行を作成
    for (let i = 0; i < weeks.length; i++) {
        calendarHtml += '<td>' + weeks[i] + '</td>'
    }

    // カレンダーの最大行数分ループ
    for (let w = 0; w < 6; w++) {
        calendarHtml += '<tr>'

        // 横の列数7列（1週間）分ループ
        for (let d = 0; d < 7; d++) {
            if (w == 0 && d < startDay) {
                // 1行目で1日の曜日の前
                let num = lastMonthendDayCount - startDay + d + 1
                calendarHtml += '<td class="is-disabled">' + num + '</td>'
            } else if (dayCount > endDayCount) {
                // 末尾の日数を超えた
                let num = dayCount - endDayCount
                calendarHtml += '<td class="is-disabled">' + num + '</td>'
                dayCount++
            } else {
                calendarHtml += `<td class="calendar_td" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`
                dayCount++
            }
        }
        calendarHtml += '</tr>'

        // 6行目の必要がなければ終了
        if (dayCount > endDayCount){
            break;
        }
    }
    calendarHtml += '</table>'

    return calendarHtml
}

function moveCalendar(e) {
    document.querySelector('#calendar').innerHTML = ''

    if (e.target.id === 'lastyear') {
        year--
    }
    if (e.target.id === 'prev') {
        month--

        if (month < 1) {
            year--
            month = 12
        }
    }
    if (e.target.id === 'current') {
        // date = new Date() 再取得する場合はdateの定義をconst→letに変更
        year = date.getFullYear()
        month = date.getMonth() + 1
    }
    if (e.target.id === 'next') {
        month++

        if (month > 12) {
            year++
            month = 1
        }
    }
    if (e.target.id === 'nextyear') {
        year++
    }

    showCalendar(year, month)
    selectcheckbox();
}

function getSelectSupid() {
    const checkboxes = document.querySelectorAll('#sup_list input[type="checkbox"]');
    const selectId = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectId.push(checkbox.value);
        }
    });
    return selectId;
}

function selectcheckbox(){
    selectedSupIds = getSelectSupid();
    
    // 選択されたスーパーIDのリストが空の場合
    if (selectedSupIds.length === 0) {
        // カレンダーをクリアするか、全スーパーのデータを表示するなどの処理
        console.log("スーパーが選択されていません。");
        // ここでカレンダーの再描画（データなし）を行う
        document.querySelector('#calendar').innerHTML = '';
        showCalendar(year, month);
        return;
    }
    // カレンダーを再描画し、お得日データをAPIから取得して表示する
    // updateCalendarWithSpecialDays(year, month, selectedSupIds);
}

function loadSuperList() {
    const container = document.querySelector('#sup_list');
    const apiURL = 'get_superlist.php';

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
    if(e.target.classList.contains("calendar_td")) {
        // alert('クリックした日付は' + e.target.dataset.date + 'です');
        // 登録したスーパーのお得日などを表示
        const encodedDay = encodeURIComponent(e.target.dataset.date);
        const encodedSelectIds = encodeURIComponent(selectedSupIds.join(','));
        this.location.href=`get_daydata.html?day=${encodedDay}&selectid=${encodedSelectIds}`;
    }
});

document.addEventListener('DOMContentLoaded', loadSuperList);
showCalendar(year,month);