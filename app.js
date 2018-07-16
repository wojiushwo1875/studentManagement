// 导入模块 ------------------------------
let express = require('express');
let svgCaptcha = require('svg-captcha');
let path = require('path');
let session = require('express-session')
let bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'SZHM19';

let app = express();

// 静态资源托管
app.use(express.static('static'));
// 使用 bodyParser 中间件
app.use(bodyParser.urlencoded({
    extended: false
}))
// 加密
app.use(session({
    secret: 'keyboard cat',
}))

// 路由------------------------------------------------
// 路由1
// 使用get方法 访问登陆页面时 直接读取登录页面 并返回
app.get('/login', (req, res) => {
    // console.log(req.session);
    // 直接读取文件
    res.sendFile(path.join(__dirname, '/static/views/login.html'));
})

// 路由2 验证用户登录(接收post方法提交的数据时需要使用bodyParser 中间件,帮我们解析里面的数据)
app.post('/login', (req, res) => {
    // console.log(req.body);
    // 接收数据
    let userName = req.body.userName;
    let userPass = req.body.userPass;
    // 将输入的验证码转为小写
    let code = req.body.code.toLowerCase();
    // 验证验证码输入是否正确
    if (code == req.session.captcha) {
        // 验证码输入正确,用session 将用户信息存起来
        req.session.userInfo = {
            userName,
            userPass
        }
        // 跳到首页
        res.redirect('/index');
        // console.log('验证成功');
    } else {
        // 验证码错误
        // console.log('验证失败');
        // 提示用户,打回登录页
        res.setHeader('content-type', 'text/html;charset=utf-8');
        res.send('<script>alert("验证失败");window.location.href ="/login" </script>');
    }

})

// 路由3
// 验证码是服务器动态生成的
// 把地址设置给登录页的图片的src
app.get('/login/captcha', (req, res) => {
    let captcha = svgCaptcha.create();
    // 将验证码存起来,并将值转为小写
    req.session.captcha = captcha.text.toLowerCase();
    // console.log(captcha.text);
    res.type('svg'); // 使用ejs等模板时如果报错 res.type('html')
    res.status(200).send(captcha.data);
});


// 路由4
// 去首页
app.get('/index', (req, res) => {
    // 如果登录了就显示首页,如果没有登录就打回到登录页
    // 如果session有值,就显示首页
    if (req.session.userInfo) {
        res.sendFile(path.join(__dirname,'static/views/index.html'));
    } else {
        // 没有值就提示用户,跳到登录页
        res.setHeader('content-type', 'text/html;charset=utf-8');
        res.send('<script>alert("没有登录,请登录");window.location.href = "/login"</script>');
    }
})
// 路由5 
// 退出
app.get('/logout', (req, res) => {
    // 删除session
    delete req.session.userInfo;
    // 跳到登录页
    res.redirect(path.join(__dirname, 'static/views/login.html'));
})

// 路由6
// 展示注册页
app.get('/register', (req, res) => {
    res.sendfile(path.join(__dirname, 'static/views/register.html'));
})

// 路由7
// 实现注册功能
app.post('/register', (req, res) => {
    // 接收数据
    let userName = req.body.userName;
    let userPass = req.body.userPass;
    // console.log(userName);
    // console.log(userPass);
    // 连接数据库,判断用户名是否存在
    MongoClient.connect(url, function (err, client) {
        const db = client.db(dbName);
        const collection = db.collection('userList');
        collection.find({
            userName
        }).toArray(function (err, docs) {
            // console.log(docs);
            if (docs.length == 0) {
                // 未注册,就将数据保存到数据库
                collection.insertOne({
                    userName,
                    userPass
                }, function(err, result) {
                    if(err) console.log(err);
                    // console.log(result);
                    res.setHeader('content-type', 'text/html;charset=utf-8');
                    res.send('<script>alert("恭喜你注册成功!");window.location.href="/login"</script>');
                    // 关闭数据库
                    client.close();
                  });
            } else {
                // 已注册
                res.setHeader('content-type', 'text/html;charset=utf-8');
                res.send('<script>alert("该用户名已经被注册,请重新注册");window.location.href="/register"</script>');
            }

        });
        
    });
})

app.listen(8888, '127.0.0.1', () => {
    console.log('success');
});