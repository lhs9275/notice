function change_my_password(){
    const pw = document.getElementById('pw').value;
    const new_pw = document.getElementById('new_pw').value;
    const re_new_pw = document.getElementById('re_new_pw').value;

    const passwords ={
        pw : pw ,                   
        new_pw : new_pw,
        re_new_pw : re_new_pw
    }

    fetch('/change/post',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json', // JSON 형식 명시
        },
        body: JSON.stringify(passwords)
    }).then((response) => {
        if (response.redirected) {
            alert('변경 성공') ; 
            window.location.href = '/'; // 리다이렉션 URL로 이동
        } else {
            alert('오류');
        }})
}