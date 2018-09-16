var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  "userId": String,
  "userName": String,
  "userPwd": String,
  "orderList": Array,
  "cartList":[{
    "bookId":String,
    "name": String,
    "price":String,
    "img_href":String,
    "checked":String,
    "productedNum":String
  }],
  "addressList":[{
    "addressId":String,
    "userName":String,
    "streetName":String,
    "tel":String,
    "isDefault":Boolean
  }]
})

module.exports = mongoose.model('User',userSchema);
