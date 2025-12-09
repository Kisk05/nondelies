function CheckUser() {
    const params = new URLSearchParams(window.location.search);
    const btnLogin = document.getElementById('login-btn');
    const userID = params.get('user_id');

    if(!userID || userID===""){
        btnLogin.textContent='ログイン';
        btnLogin.addEventListener('click', login);        
    }else{
        btnLogin.textContent='ログアウト';
        btnLogin.addEventListener('click', logout);
    }
}

function todayinfo(){
    const date = new Date();
    const day=`${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
    console.log(day);
    const encodedDay = encodeURIComponent(day);

    this.location.href=`/html/get_daydata.html?day=${encodedDay}&selectid=`;
}

function login(){
    location.href='/html/login.html';
}

function logout(){
    location.href='/html/title.html';
}

document.addEventListener('DOMContentLoaded', CheckUser);