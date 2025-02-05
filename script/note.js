// 비동기적으로 데이터를 가져오는 함수
function getIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');  // 'id' 파라미터 값을 추출
    floating_content(id);
}

async function floating_content(id) {

    console.log("파라미터값은 = ",id)
    fetch('/note/post/detail',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    }) .then(response => response.json())
    .then(data => {
        renderPosts(data);
    })
    
}
      

// 데이터를 화면에 렌더링하는 함수
function renderPosts(posts) {
    const container = document.getElementById('posts-container');
    container.innerHTML = ''; // 기존 내용을 비움

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.style.border = '1px solid'
        postElement.className = 'post';
        postElement.innerHTML = 
            `<p>${post._id}</p>
             <p>${post.title}</p>
             <p>${post.content}</p>
             <img src="${post.path}"></img>`
        container.appendChild(postElement);
    });
}

// 페이지 로드 시 데이터 가져오기
document.addEventListener('DOMContentLoaded', getIdFromUrl);