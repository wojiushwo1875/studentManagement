var express = require('express');
var routerIndex = express.Router();
let path = require('path');
routerIndex.get('/', function(req, res) {
    if (req.session.userInfo) {
        // res.sendFile(path.join(__dirname,'../static/views/index.html'));
        console.log(res);
        let userName = req.session.userInfo.userName;
        res.render('index.html', {
           userName
        });
    } else {
        // 没有值就提示用户,跳到登录页
        res.setHeader('content-type', 'text/html;charset=utf-8');
        res.send('<script>alert("没有登录,请登录");window.location.href = "/login"</script>');
    }
  });

  //----------------------接口----------------------------
// 增
routerIndex.get('/insert',(req,res)=>{
    // 接收数据
    // console.log(req.query);
    // 保存数据
    // 接口 json格式
    // 写一个js对象 json_
    myT.insert('studentList',req.query,(err,result)=>{
        if(!err) res.json({
            mess:'新增成功',
            code:200
        })
    })
    // 提示用户
})
// 删
// key id
routerIndex.get('/delete',(req,res)=>{
    // 接收数据
    let delerteId = req.query.id;
    // 删除数据
    myT.delete('studentList',{_id:objectID(delerteId)},(err,result)=>{
        if(!err)res.json({
            mess:'删除成功',
            code:200
        })
    })
    // 提示用户
    // res.send('delete');
})
// 改
// id,name,age,friend
routerIndex.get('/update',(req,res)=>{
    // 接收数据
    // req.query
    let name = req.query.name;
    let age = req.query.age;
    let friend = req.query.friend;
    // 修改数据
    myT.update('studentList',{_id:objectID(req.query.id)},{name,age,friend},(err,result)=>{
        if(!err)res.json({
            mess:'修改成功',
            code:200
        })
    })
})

// 获取所有数据
routerIndex.get('/list',(req,res)=>{
    // 来就给你所有的东西
    myT.find('studentList',{},(err,docs)=>{
        if(!err) res.json({
            mess:"数据",
            code:200,
            list:docs
        });
    })
})
// 根据名字获取数据
// 需要传递参数 userName过来
routerIndex.get('/search',(req,res)=>{
    // 用户名过来
    let name = req.query.userName;
    // console.log(name);
    // 来就给你所有的东西
    // mongoDB模糊查询 使用正则表达式
    myT.find('studentList',{name:new RegExp(name)},(err,docs)=>{
        if(!err)  res.json({
            mess:"数据",
            code:200,
            list:docs
        });
    })
})
  module.exports = routerIndex;