var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productSchema = new Schema({
  "bookId":String,
  "img_href":String,
  "name":String,
  "price":String,
  "checked": String,
  "productedNum":String
});

module.exports = mongoose.model('book', productSchema);
