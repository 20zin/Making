const express = require('express');
const app = express();
const port = 5000
const mongoose = require('mongoose')
const { User } = require('./models/User');
const bodyParser = require('body-parser');
const config = require('/config/key');
const cookieParser = require('cookie-parser');
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());
mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

app.get('/', function (req, res) {res.send('Hello World')});
//회원가입할때 필요한 정보들을 client한테 가져오면
//그것들을 db에 저장
app.post('/register', (req,res)=>{

  const user = new User(req.body);



  user.save((err,userInfo)=>{
    if(err) return res.json({success:false,err})
    return res.status(200).json
    ({
      success:true//성공
    });//mongoDB모듈
  });  
});

app.post('/login',(req,res)=>{
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({email:req.body.email},(err,user) => {
    if(!user) 
      return res.json({
        loginSuccess:false,
        message:"제공된 이메일에 해당하는 유저가없습니다."
    })
  })
  //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
  user.comparePassword(req.body.Password , (err,isMatch) => {
    if(!isMatch)
    return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다."})
  
  })
  //비밀번호까지 맞다면 토큰을 생성하기
  user.genrateToken((err,user)=>{
    if(err) return res.status(400).send(err);//에러
    //토큰을 저장한다 어디..? 쿠키 or 로컬스토리지 이번엔 쿠키에 저장

    res.cookie('x_auth', user.token) 
    .status(200)
    .json({loginSuccess:true,userId:user._id})         


  })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
