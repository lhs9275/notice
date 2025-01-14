function login(){
    const id = document.getElementById('id').value;
    const pw = document.getElementById('pw').value;

    fetch('/login/post',{
        method : 'POST',
        headers: {
            'Content-Type': 'application/json', // JSON 형식 명시
        },
        body: JSON.stringify({ id,pw}),
    }).then((response) => {
    if (response.redirected) {
        window.location.href = '/main'; // 리다이렉션 URL로 이동
    } else {
        alert('로그인 실패');
    }
    })};
