function reg(){
    const id = document.getElementById('id').value;
    const pw = document.getElementById('pw').value;

    const user = {
        email : id,
        password : pw
    }

    fetch('/reg/post',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json', // JSON 형식 명시
        },
        body: JSON.stringify(user)
    }).then((response) => {
        if (response.redirected) {
            alert('회원가입 성공') ; 
            window.location.href = '/'; // 리다이렉션 URL로 이동
        } else {
            alert('회원가입 실패');
        }
})};