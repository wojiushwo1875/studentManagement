let express = require('express');
let svgCaptcha = require('svg-captcha');
let path = require('path');
let session = require('express-session')
let app = express();

// 静态资源托管
app.use(express.static('static'));
// 加密
app.use(session({
    secret: 'keyboard cat',
  }))
// 路由1
app.get('/login',(req,res)=>{
    console.log(req.session);
    res.sendFile(path.join(__dirname,'/static/views/login.html'));
})
// 路由2
// 把地址设置给登录页的图片的src
app.get('/login/captcha', function (req, res) {
	var captcha = svgCaptcha.create();
	// req.session.captcha = captcha.text;
	console.log(captcha.text);
	res.type('svg'); // 使用ejs等模板时如果报错 res.type('html')
	res.status(200).send(captcha.data);
});
app.listen(8888,'127.0.0.1',()=>{
    console.log('success');
});