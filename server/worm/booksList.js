let http = require('http'),
    cheerio = require('cheerio'),
    charset = require('superagent-charset'),
    agent = require('superagent'),
    mongoose = require('mongoose'),
    async = require('async'),
    bookData = require('../models/books');

charset(agent);
const Schema = mongoose.Schema;
mongoose.connect('mongodb://127.0.0.1:27017/mall');

var url = 'http://search.dangdang.com/?key=web&act=input&show=big&show_shop=0&page_index=';
var index = 1;  //获取的页码

search(url + index);
async function search(url){
    let html = '';
    var idNum = 20180001;
    agent.get(url).charset('gb2312').end(function(err, res) {
        html = res.text;
        var $ = cheerio.load(html,{decodeEntities: false});
        var list = $('.bigimg');
        // console.log(list.html());
        list.find('li').each(function(index, ele){
            var book = $(this);
            var img_href = book.find('a').children('img').attr('src');
            var name = book.find('.name').children('a').attr('title');
            var price = book.find('.price').children('.price_n').html();
            var bookId = ""+idNum++;
            console.log(bookId);

            var bookInfos = new bookData({
                bookId:bookId,
                img_href: img_href,
                name: name,
                price: price,
            });

            bookData.find({
                  img_href: img_href
                }, function (err, docs) {
              if(err){
                console.log(err)
              }else if(docs.length === 0){
                bookInfos.save(function (err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('数据插入成功！');
                  }
                })
              }else{
                console.log('商品数据已经存在，请勿重复插入！')
              }
            })
        })

    })
}

