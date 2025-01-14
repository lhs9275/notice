require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.KEYURL;
const client = new MongoClient(uri);

async function main() {
    try {
        // MongoDB 연결
        await client.connect();
        console.log("MongoDB에 성공적으로 연결되었습니다!");

        // 데이터베이스와 컬렉션 선택
        const database = client.db("Notice"); // 사용할 데이터베이스 이름
        const collection = database.collection("login"); // 사용할 컬렉션 이름
    } catch (err) {
        console.error("MongoDB 연결 또는 작업 중 오류 발생:", err);
    } 
}

main();


let db = client.db('Notice').collection('login'); //로그인 관련 
let db_2 = client.db('Notice').collection('post'); //게시판 관련

//  node.js 부분 
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const express = require('express');
const multer = require('multer');
const path =require('path');
const app = express();
const port = 3000;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'img'); // 업로드된 파일 저장 경로
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // 고유 파일명 생성
    }
});

const upload = multer({ storage: storage });

var now_login_ID = "x";

app.set('view engine','ejs');
app.set('views','./ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/script',express.static('script'));
app.use('/img',express.static('img'));
app.use(session({
    secret: '코트', 
    resave: true, 
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req,res) =>{
    res.render('login')
})

app.get('/main', (req, res) => {
    console.log('GET /main 호출됨'); // 디버깅 로그
    res.render('main');
});


app.get('/detail', (req,res) =>{
    res.render('user_detail');
})

app.get('/write', (req,res) =>{
    console.log('GET /write 호출됨'); // 디버깅 로그
    res.render('write');
})

app.get('/posting',async(req,res)=>{
    try{
        const posts = await db_2.find({}).sort({ createdAt: -1 }).toArray();  //db_2.find({}): MongoDB에서 모든 글 데이터를 가져옵니다.
        res.status(200).json(posts);                                          //sort({ createdAt: -1 }):   글을 최신순으로 정렬합니다.
    } catch (error) {
        console.error("글 불러오기 실패:", error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/write/post',(req,res)=>{
    const {title,content} = req.body;
    const bord = req.body;
    console.log("Writing",{title,content});
    db_2.insertOne(bord);
    return res.status(200).json({ message: '굿' });
})


app.get('/reg',(req,res)=>{
    res.render('regisiter');
})


app.listen(port,(req,res)=>{
    console.log(`Example app listening on port ${port}`);
})


app.post('/login/post', passport.authenticate('local', {
    failureMessage : true , // 실패 시
}), function (req, res){
    res.redirect('main');
})


app.post('/reg/post',(req,res)=>{
    const { email, password } = req.body;
    const user = req.body;
    console.log('Received Data:', { email, password });
    db.insertOne(user);
    res.redirect('/');
})

app.post('/change/post', async (req, res) => {
    const { pw, new_pw, re_new_pw } = req.body; // 클라이언트에서 받은 데이터
    console.log('Received Data:', { pw, new_pw, re_new_pw });
    console.log('Now logged in ID:', now_login_ID);

    try {
        // 데이터베이스에서 사용자 찾기
        const user = await db.findOne({ email: now_login_ID });
        if (!user) {
            console.log("오류: 사용자 없음");
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        console.log("사용자 있음");

        // 기존 비밀번호 확인
        const isPasswordMatch = user.password === pw; // 여기서는 단순 비교, 보통 해시 비교 사용
        if (!isPasswordMatch) {
            console.log("오류: 비밀번호 불일치");
            return res.status(400).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
        }

        console.log("비밀번호 일치");

        // 새 비밀번호 확인
        if (new_pw !== re_new_pw) {
            console.log("오류: 새 비밀번호 불일치");
            return res.status(400).json({ message: '새 비밀번호가 일치하지 않습니다.' });
        }

        console.log("새 비밀번호 일치");

        // 비밀번호 변경
        user.password = new_pw; // 보통 여기서 new_pw는 해시된 비밀번호로 변환해야 함
        await db.updateOne(
            { email: now_login_ID },
            { $set: { password: new_pw } }
        );
        
        
        return res.redirect("/");
    } catch (error) {
        console.error("서버 오류 발생:", error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/change',(req,res)=>{
    res.render('change');
})

app.get('/bye',(req,res)=>{
    res.render('byebye');
})

app.post('/bye/post',async(req,res)=>{
    const {id,pw} = req.body;
    try{
        const result = await db.deleteOne({email:now_login_ID ,password:pw});
        if (result.deletedCount === 0) { //eletedCount === 0 → 삭제 실패. •deletedCount > 0 → 삭제 성공.
            console.log("사용자를 찾을 수 없거나 비밀번호가 일치하지 않습니다.");
            return res.status(404).json({ message: '사용자를 찾을 수 없거나 비밀번호가 일치하지 않습니다.' });
    }
    req.session.destroy(err => {
        if (err) {
            console.error("세션 종료 오류:", err);
            return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
        res.clearCookie('connect.sid'); // 세션 쿠키 삭제
        return res.status(200).json({ message: '회원 탈퇴가 성공적으로 처리되었습니다.' });
    });
}
    catch (error) {
        console.error("서버 오류 발생:", error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }

})

passport.use(
    new LocalStrategy(
        {
            usernameField: 'id',
            passwordField: 'pw',
            session: true,
            passReqToCallback: false,
        },
        async (inputId, inputPw, done) => {
            console.log("LocalStrategy 호출됨");
            console.log("입력 데이터:", { inputId, inputPw });

            try {
                // DB에서 사용자 검색
                const user = await db.findOne({ email: inputId });
                console.log("DB 검색 결과:", user);

                if (!user) {
                    console.log("사용자 없음");
                    return done(null, false, { message: '존재하지 않는 아이디입니다.' });
                }

                if (user.password === inputPw) {
                    console.log("비밀번호 일치");
                    return done(null, user); // 성공 시 사용자 정보 반환
                } else {
                    console.log("비밀번호 불일치");
                    return done(null, false, { message: '비밀번호가 다릅니다.' });
                }
            } catch (err) {
                console.error("DB 쿼리 중 오류 발생:", err);
                return done(err); // 에러 반환
            }
        }
    )
);

passport.serializeUser((user, done) => {
    console.log("serializeUser 호출:", user);
    done(null, user.email); // 세션에 사용자 email 저장
});

passport.deserializeUser(async (id, done) => {
    console.log("deserializeUser 호출됨:", id); // 디버깅 로그
    now_login_ID = id;
    try {
        // 데이터베이스에서 사용자 조회
        const user = await db.findOne({ email: id }); // 세션에 저장된 ID(email)로 사용자 검색
        if (!user) {
            return done(new Error("사용자를 찾을 수 없습니다."));
        }
        console.log("deserializeUser 성공:", user);
        done(null, user); // 조회된 사용자 객체를 req.user에 저장
    } catch (err) {
        console.error("deserializeUser 중 오류 발생:", err);
        done(err); // 에러 반환
    }
});

app.post('/upload/post', upload.single('file'), function (req, res) {
    console.log("업로드는?",req.file); // 업로드된 파일 정보
    res.json({
        file: req.file.path
    });
  })

app.get('/note', (req,res) => {
    res.render('note')
})

app.post('/note/post',(req,res)=>{
    console.log("제벌",req.post);
    res.json({
        title: req.post.title,
        content: req.post.content,
        path:req.post.file
    });
})