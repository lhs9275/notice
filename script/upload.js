function upload() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('bord').value;
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0]; // 선택된 파일 가져오기

    if (file) {
         // FormData 객체 생성
    const formData = new FormData();
    formData.append('file', file);  //append(key, value) key == 이름 value == 값

    // 파일 업로드 요청
    fetch('/upload/post', {
        method: 'POST',
        body: formData // FormData 전달
    })
    .then(response => response.json()) 
    .then(data => {// json을 위에서 전달 받음
        console.log('파일 업로드 성공:', data);
        // 텍스트 데이터 전송
        const textData = {
            title: title,
            content: content,
            path:data.file
        };
        return fetch('/write/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // JSON 형식
            },
            body: JSON.stringify(textData)
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log('텍스트 데이터 등록 성공:', data);
        alert("등록 성공!");
        window.location.href = '/main'; // 성공 시 리다이렉션
    })
    .catch(error => {
        console.error('오류:', error);
        alert("오류 발생");
    });
}else{
    

        // 텍스트 데이터 전송
        const textData = {
            title: title,
            content: content,
            path:"empty"
        };
    fetch('/write/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // JSON 형식
            },
            body: JSON.stringify(textData)
        })
    .then(response => response.json())
    .then(data => {
        console.log('텍스트 데이터 등록 성공:', data);
        alert("등록 성공!");
        window.location.href = '/main'; // 성공 시 리다이렉션
    })
    .catch(error => {
        console.error('오류:', error);
        alert("오류 발생");
    });
    }
}