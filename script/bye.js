function re_Q(){
    const id = document.getElementById('id').value;
    const pw = document.getElementById('pw').value;

    const user = { 
        id :id,
        pw: pw
    };
    fetch("/bye/post",{
        method:'POST',
        headers:{
             'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
    }).then((response) => {
        if (response.status===200) {
            window.location.href = '/'; // 리다이렉션 URL로 이동
        }else {
            alert('다시 시도하세요');
}})}