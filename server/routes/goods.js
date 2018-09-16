var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('./../models/books');

mongoose.connect('mongodb://127.0.0.1:27017/mall');

mongoose.connection.on('connected', function(){
  console.log('mongoDB connected success.')
})

mongoose.connection.on('error', function () {
  console.log('mongoDB connected fail.')
})

mongoose.connection.on('disconnected', function () {
  console.log('mongoDB connected disconnected.')
})

//获取商品列表
router.get('/list', function(req, res, next){
  let page = parseInt(req.query.page);
  let pageSize = parseInt(req.query.pageSize);
  let skip = (page - 1) * pageSize;
  let params = {};
  //console.log('page:'+page+'pageSize:'+pageSize);
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.exec(function (err, doc) {
    if(err){
      res.json({
        status:1,
        msg:err.mseeage,
      })
    }else{
      res.json({
        status:0,
        msg:'',
        result:{
          count:doc.length,
          list:{
            doc
          }
        }
      })
    }
  })
})

//加入购物车
router.post('/addCart', function(req, res, next){
    var userId = req.cookies.userId,
        bookId = req.body.bookId;
    var User = require('../models/users');
    User.findOne({userId:userId}, function(err, userDoc){
      if(err){
        res.json({
          status:"1",
          msg:err.mseeage
        })
      }else{
        if(userDoc){
          let bookItem = '';
          userDoc.cartList.forEach(function(ele){
            if(bookId == ele.bookId){
              bookItem = ele;
              ele.productedNum++;
            }
          });
          if(bookItem){
            userDoc.save(function (err2, doc2) {
              if (err2) {
                return res.json({
                  status: "1",
                  msg: err.mseeage
                })
              } else {
                return res.json({
                  status: "0",
                  msg: '',
                  result: userDoc
                })
              }
            })
          }else{
            Goods.findOne({
              bookId: bookId
            }, function (err, bookDoc) {
              if (err) {
                return res.json({
                  status: "1",
                  msg: err.mseeage,
                  result:""
                })
              } else {
                if (bookDoc) {
                  bookDoc.productedNum = 1;
                  bookDoc.checked = 1;
                  userDoc.cartList.push(bookDoc);

                  userDoc.save(function (err2, doc2) {
                    if (err2) {
                      return res.json({
                        status: "1",
                        msg: err.mseeage
                      })
                    } else {
                      return res.json({
                        status: "0",
                        msg: '',
                        result: userDoc
                      })
                    }
                  })
                }
              }
            })
          }

        }
      }
    })
})


module.exports = router;
