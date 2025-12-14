const container = document.querySelector('.container');
function setActiveNav(activeElement) {
    // すべてのnav-btnからactiveクラスを削除
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    // クリックされたボタンにactiveクラスを追加
    activeElement.classList.add('active');
}

function showTokubi(event,flag) {
    setActiveNav(event.currentTarget);

    if (flag) {
        container.innerHTML = `
            <h3 class="section-title">本日の特売・イベント情報</h3>
            <p>今日、開催されているお特日や特売情報が表示されます。</p>
            <div style="margin-top: 20px;">
            <p style="font-size: 1.2em; color: #d60000; font-weight: bold;">✅ 本日はマルハチでポイント5倍デー！</p>
            </div>
        `;
    }else{
        container.innerHTML = `
            <h3 class="section-title">本日の特売・イベント情報</h3>
            <p>今日、開催されているお特日や特売情報が表示されます。</p>
            <div style="margin-top: 20px;">
            <span>※ <span>
            <a href="login.html">ログイン</a>
            <span>すると、お気に入り店舗のお特日を表示できます。</span>
            </div>
        `;
    }

}

function showCalendar(event) {
    event.preventDefault();
    setActiveNav(event.currentTarget);

    const weeks = ['日', '月', '火', '水', '木', '金', '土'];
    const weekdata=getWeekData();
    const date=new Date();
    const today=date.getDate();
    // コンテンツを生成・挿入
    container.innerHTML = `
        <h3 class="section-title">お特日カレンダー</h3>
        <br>
        <span>今週のカレンダーです。月ごとのカレンダーは</span>
        <a href="calender.html">こちら</a>
        <p>クリックするとその日の全スーパーのお特日がみれるよ！</p>
        
        <div class="week_calender">
            <h4 id="calender_title" style="margin: 0 0 10px;"></h4>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px;">
                ${weeks.map((week, i) => {
                    let color = 'black';
                    if (i === 0) color = 'red';
                    if (i === 6) color = 'blue';
                    return `<div style="font-weight: bold; color: ${color}; text-align: center; padding: 5px;">${week}</div>`;
                }).join('')}
                
                ${weekdata.map(item => {
                    const day=item.day;
                    const classes = (day === today) ? 'daydata today' : 'daydata';
                    return `<div class="${classes}" data-date="${item.year}/${item.month}/${day}">${day}</div>`;
                }).join('')}
            </div>
        </div>
    `;

    const cal_title = document.getElementById('calender_title');
    cal_title.textContent=`${weekdata[0].month}月${weekdata[0].day}日~${weekdata[6].month}月${weekdata[6].day}日`;
}

/*スーパーを探すボタン*/
function findSuper(event) {
    event.preventDefault();
    setActiveNav(event.currentTarget);
    container.innerHTML = `
        <h3 class="section-title">スーパー検索</h3>
        <p>郵便番号を入力して、お気に入りのスーパーを登録します。</p>
        <span>※ または</span><a href="maps.html">マップ</a><span>から</span>
        <div style="text-align: left; max-width: 400px; margin: 30px auto;">
            <label for="postcode">郵便番号:</label>
            <input class="postcode" type="text" id="postcode" placeholder="例: 1234567" maxlength="7" required>
            <br>
            <button class="btn_find" id="find-super-btn">探す</button>
            <hr style="margin-top: 30px;">
            <p id="output" style="min-height: 50px; font-size: 14px;"></p>
        </div>
    `;
    document.getElementById('find-super-btn').addEventListener('click', findsuper);
}

function CheckUser() {
    const params = new URLSearchParams(window.location.search);
    const btnLogin = document.getElementById('login-btn');
    const userID = params.get('user_id');

    if (!userID || userID === "") {
        btnLogin.textContent = 'ログイン';
        btnLogin.addEventListener('click', login);
    } else {
        btnLogin.textContent = 'ログアウト';
        btnLogin.addEventListener('click', logout);
    }
}

function todayinfo() {
    const date = new Date();
    const day = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    console.log(day);
    const encodedDay = encodeURIComponent(day);

    this.location.href = `/html/get_daydata.html?day=${encodedDay}&selectid=`;
}

function login() {
    location.href = '/html/login.html';
}

function logout() {
    location.href = '/html/title.html';
}

/*今週のカレンダーを取得*/
function getWeekData(){
    const date=new Date();

    const year=date.getFullYear();
    const month=date.getMonth();
    const day=date.getDate();

    const daynum=date.getDay();
    // const monthLastDate=new Date(year,month,0);
    // const monthMaxDate=monthLastDate.getDate();
    // const lastMonthLastDate = new Date(year, month - 1, 0); // 前月の最後の日の情報
    // const lastMonthMaxDate = lastMonthLastDate.getDate();

    const weekdata=[];
    for(let i=0; i<7; i++){
        const targetDay = day - daynum + i;
        const date = new Date(year, month, targetDay);
        
        weekdata[i] = {
            year: date.getFullYear(),
            month: date.getMonth() + 1, // 1-12の表記に直す
            day: date.getDate()
        };
    }
    return weekdata;
}

/*ロード時の処理*/
function initializeTitlePage() {
    const defaultNavBtn = document.querySelector('.nav-btn.active');
    const syntheticEvent = {
        currentTarget: defaultNavBtn,
        preventDefault: () => {}
    };
    showTokubi.call(defaultNavBtn, syntheticEvent, false); 
    getWeekData();
    CheckUser();
}

document.addEventListener("click", function(e) {
    // 日付クリックでページ移動
    if(e.target.classList.contains("daydata today")||e.target.classList.contains("daydata")) {
        const encodedDay = encodeURIComponent(e.target.dataset.date);
        this.location.href=`/html/get_daydata.html?day=${encodedDay}&selectid=`;
    }
});
document.addEventListener('DOMContentLoaded', initializeTitlePage);