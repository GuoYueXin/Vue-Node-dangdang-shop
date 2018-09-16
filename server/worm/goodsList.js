var agent = require('superagent');
var mongoose = require('mongoose');
var cheerio = require('cheerio');

var Schema = mongoose.Schema;
const url = 'http://s.taobao.com/search?q=%E6%89%8B%E6%9C%BA';

mongoose.connect('mongodb://127.0.0.1:27017/mall');
mongoose.connection.on('connected',()=>console.log('mongodb connected success'));
mongoose.connection.on('error', () => console.log('mongodb connected error'));

var Phone = new Schema({
  name:String,
  price:Number,
  img_href:String,
  detail:String
})

var phoneData = mongoose.model('phonesData',Phone);
search(url);
function search(url) {
  var html = '';
  agent.get(url).end(function(err, res){
    html = res.text;
    let $ = cheerio.load(html, {decodeEntities: false});
    console.log($.html())
    var list = $('.grid');
    list.find('.items').find('.item').each(function(index, ele){
      var phone = $(this);
      var name = phone.find('.p-name').find('a').find('em').html();
      // if(name !== null){
        console.log(phone.html());
      // }
    })
  })
}
