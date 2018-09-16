var express = require('express');
var router = express.Router();
var Users = require('../models/users')
require('./../util/util.js')
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


//登录
router.post('/login', function (req, res, next) {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  console.log(param)
  Users.findOne(param, function (err, doc) {
    if (err) {
      console.log(err.message)
      return res.json({
        status: "1",
        msg: err.message,
        result:"登录失败！"
      })
    } else {
      if (doc) {
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAgent: 1000 * 60 * 60
        });
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAgent: 1000 * 60 * 60
        });
        // req.session.user=doc;
        return res.json({
          status: "0",
          msg: "",
          result: {
            userName: doc.userName
          }
        })
      }
    }
  })
})

//注册
router.post('/reg', function(req, res, next){
  var userName = req.body.userName,
      userPwd = req.body.userPwd;

  var r1 = Math.floor(Math.random() * 10000);
  var r2 = Math.floor(Math.random() * 100);
  var userId = '102' + r1 + r2;
  var userInfo = new Users({
    userId:userId,
    userName:userName,
    userPwd:userPwd,
    orderList:[],
    cartList:[],
    addressList:[]
  });
  userInfo.save(function(err,doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:"注册失败"
      })
    }else{
      res.cookie("userId", doc.userId, {
        path: '/',
        maxAgent: 1000 * 60 * 60
      });
      res.cookie("userName", doc.userName, {
        path: '/',
        maxAgent: 1000 * 60 * 60
      });
      res.json({
        status:"0",
        msg:"",
        result: {
          userName: doc.userName
        }
      })
    }
  })

})
//登出
router.post('/logout', function (req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: "0",
    msg: "",
    result: ""
  })
})

//初始化校验是否登录
router.get('/checklogin', function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: "0",
      msg: "",
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: "1",
      msg: "未登录",
      result: ""
    })
  }
})

//获取购物车列表
router.get('/cartList', function (req, res, next) {
  let param = {
    userId: req.cookies.userId
  }
  console.log(param)
  Users.findOne(param, function (err, doc) {
    if (err) {
      console.log('err')
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      console.log('suc')
      res.json({
        status: "0",
        msg: "",
        result: doc.cartList
      })
    }
  })
})

//删除购物车商品
router.post('/cart/del', function (req, res, next) {
  var userId = req.cookies.userId,
    bookId = req.body.bookId;
  Users.update({
    "userId": userId
  }, {
    $pull: {
      "cartList": {
        "bookId": bookId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      res.json({
        status: "0",
        msg: "",
        result: "success"
      })
    }
  })
})

//修改购物车商品数量
router.post('/cartEdit', function (req, res, next) {
  var userId = req.cookies.userId,
    bookId = req.body.bookId,
    productedNum = req.body.productedNum,
    checked = req.body.checked;
  Users.update({
    "userId": userId,
    "cartList.bookId": bookId,
  }, {
    "cartList.$.productedNum": productedNum,
    "cartList.$.checked": checked
  }, function (err) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      res.json({
        status: "0",
        msg: "",
        result: "success"
      })
    }
  })
})

//更改购物车商品全选状态
router.post('/selectAll',function(req, res, next){
  var userId = req.cookies.userId,
      checkAll = req.body.checkAll ? "1" : "0";
  Users.findOne({"userId":userId},function(err, doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      if(doc){
        doc.cartList.forEach((ele)=>{
          ele.checked = checkAll;
        })
      }
      doc.save(function(err1,doc1){
        if (err) {
          res.json({
            status: "1",
            msg: err.message,
            result: ""
          })
        } else{
          res.json({
            status:"0",
            msg:"",
            result:""
          })
        }
      })
    }
  })
})

//获取地址列表
router.get('/addressList', function(req, res, next){
  var userId = req.cookies.userId;
  Users.findOne({"userId":userId},function(err, doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      res.json({
        status:"0",
        msg:"",
        result:doc.addressList
      })
    }
  })
})

//更改默认地址
router.post('/changeDefAddr', function(req, res, next){
  var userId = req.cookies.userId,
      addressId = req.body.addressId;
 if(addressId){
     Users.findOne({
       "userId": userId
     }, function (err, doc) {
       if (err) {
         res.json({
           status: "1",
           msg: err.message,
           result: ""
         })
       } else {
         let addressList = doc.addressList;
         addressList.forEach((ele) => {
           if (ele.addressId == addressId) {
             ele.isDefault = true;
           } else {
             ele.isDefault = false;
           }
         })
       }
       doc.save(function(err1, doc1){
         if (err1) {
           res.json({
             status: "1",
             msg: err.message,
             result: ""
           })
         } else{
          res.json({
            status:"0",
            msg:"",
            result:"默认地址修改成功"
          })
         }
       })
     })
 }
})

//添加地址
router.post('/addAddr', function(req, res, next){
  var userId = req.cookies.userId,
      name = req.body.name,
      tel = req.body.tel,
      streetName = req.body.streetName,
      addressId = '',
      isDefault = false;
  Users.findOne({"userId":userId},function(err1, userDoc){
    if(err1){
      res.json({
        status: "1",
        msg: err1.message,
        result:""
      })
    }else{
      if(userDoc){
        var addressId = '';
        var r1 = Math.floor(Math.random() * 1000);
        addressId = '102' + r1;
        if(userDoc.addressList.length == 0){
          isDefault = true;
        }
        var address = {
          userName:name,
          tel:tel,
          streetName:streetName,
          addressId:addressId,
          isDefault:isDefault
        }
        userDoc.addressList.push(address);
        userDoc.save(function(err2, addressDoc){
          if(err2){
            res.json({
              status:"1",
              msg:err2.message,
              result:""
            })
          }else{
            res.json({
              status:"0",
              msg:"",
              result:"地址添加成功"
            })
          }
        })
      }
    }
  })
})


//删除地址
router.post('/delAddr', function(req, res, next){
  var userId = req.cookies.userId,
      addressId = req.body.addressId;
  Users.update({"userId":userId},{
    $pull:{
      "addressList":{
        "addressId":addressId
      }
    }
  },
  function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      res.json({
        status: "0",
        msg: "",
        result: "success"
      })
    }
  })
})

//获取当前购物车商品列表
router.get('/getCartList',function(req, res, next){
  var userId = req.cookies.userId;
  Users.findOne({"userId":userId},function(err, doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      res.json({
        status:"0",
        msg:"",
        result:doc.cartList
      })
    }
  })
})

//创建订单
router.post('/payMent', function(req, res ,next){
  var userId = req.cookies.userId,
      addressId = req.body.addressId,
      orderTotal = req.body.orderTotal;

  Users.findOne({"userId":userId}, function(err, doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      var address = '',
          goodList = [];
      //获取订单地址
      doc.addressList.forEach((ele)=>{
        if(ele.addressId == addressId){
          address = ele
        }
      })

      //获取订单商品列表
      doc.cartList.forEach((ele)=>{
        if(ele.checked == "1"){
          goodList.push(ele);
        }
      })
      console.log('001')
      var platForm = '622';
      var r1 = Math.floor(Math.random() * 10);
      var r2 = Math.floor(Math.random() * 10);
      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId = platForm + r1 + sysDate + r2;
      console.log('002')
      //生成订单数据
      var order = {
        orderId: orderId,
        orderTotal:orderTotal,
        addressInfo: address,
        goodList: goodList,
        orderStatus: "1",
        createDate:createDate
      }
      console.log('003')
      doc.orderList.push(order);
      doc.save(function(err1, doc1){
        if(err1){
          res.json({
            status:"1",
            msg:err1.msg,
            result:""
          })
        }else{
          res.json({
            status: "0",
            msg: "",
            result: {
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          })
        }
      })

    }
  })
})

//查询订单信息
router.get('/getOrder', function(req, res, next){
  var userId = req.cookies.userId,
      orderId = req.query.orderId;
  console.log(orderId)
  Users.findOne({"userId":userId}, function(err, doc){
    if(err){
      res.json({
        status:"1",
        msg:err.msg,
        result:""
      })
    }else{
      var order = '';
      if(doc){
        doc.orderList.forEach((ele)=>{
          if(ele.orderId == orderId){
            order = ele
          }
        })
      }

      res.json({
        status:"0",
        msg:"",
        result:order
      })
    }
  })
})
module.exports = router;
