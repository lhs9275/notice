// 비동기적으로 데이터를 가져오는 함수
async function floating_content() {
    try {
        // 서버에 GET 요청
        const response = await fetch('/posting');
        if (!response.ok) {
            throw new Error('데이터 요청 실패');
        }

        // JSON 데이터를 파싱
        const posts = await response.json();
        console.log('받은 데이터:', posts);

        // 데이터를 렌더링
        renderPosts(posts);
    } catch (error) {
        console.error('오류 발생:', error);
    }
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
document.addEventListener('DOMContentLoaded', floating_content);