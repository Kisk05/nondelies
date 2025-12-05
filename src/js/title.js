function todayinfo(){
    const date = new Date();
    const day=`${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
    console.log(day);
    const encodedDay = encodeURIComponent(day);

    this.location.href=`/html/get_daydata.html?day=${encodedDay}`;
}