<template>
  <div>
    <nav-header></nav-header>
   <nav-bread>
     <span>商品</span>
   </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <!-- <div class="filter-nav">
          <span class="sortby">排序:</span>
          <a href="javascript:void(0)" class="default cur">默认</a>
          <a href="javascript:void(0)" class="price">价格 <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
        </div> -->
        <div class="accessory-result">
          <!-- filter -->
          <!-- <div class="filter stopPop" id="filter">
            <dl class="filter-price">
              <dt>价格:</dt>
              <dd @click="priceCheck = 'all'"><a href="javascript:void(0)"  :class="{'cur':priceCheck == 'all'}">All</a></dd>
              <dd v-for="(price,index) in priceFilter" :key="index" @click="priceCheck = index">
                <a href="javascript:void(0)" :class="{'cur': priceCheck === index}">{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div> -->

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList" :key="index">
                  <div class="pic">
                    <a href="#"><img v-lazy="item.img_href" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.name}}</div>
                    <div class="price">{{item.price}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.bookId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                ...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Model :mdShow="mdShow" v-on:close="closeModel">
      <p slot="message">请先登录，否则无法加入到购物车</p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="mdShow=false">关闭</a>
      </div>
    </Model>
    <Model :mdShow="mdShowSuccess" v-on:close="closeModel">
      <p slot="message">加入购物车成功！</p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="mdShowSuccess=false">关闭</a>
        <router-link href="javascript:;" class="btn btn--m" to="cart">查看购物车</router-link>
      </div>
    </Model>
    <nav-footer></nav-footer>
    <!-- <div class="search">
      <input type="text" class="search-inp" placeholder="搜索图书" v-model="searchStr">
      <span class="search-btn" @click="search">搜索</span>
    </div> -->
  </div>
</template>
<script>
 import './../assets/css/base.css';
 import './../assets/css/product.css';
 import NavHeader from './../components/Header';
 import NavFooter from './../components/Footer';
 import NavBread from './../components/Bread';
 import Model from './../components/Model';
 import axios from 'axios';
export default {
  data() {
    return {
      goodsList:[],
      priceFilter:[{
        startPrice:0,
        endPrice:100
      },
      {
        startPrice:100,
        endPrice:500
      },
      {
        startPrice:500,
        endPrice:1000
      },{
        startPrice:1000,
        endPrice:2000
      }],
      priceCheck:'all',
      page:1,
      pageSize:8,
      flag:false,
      busy:false,
      mdShow:false,
      mdShowSuccess:false,
      searchStr:''
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Model
  },
  mounted:function(){
    this.getGoodList();
  },
  methods: {
    getGoodList(flag) {
      var param = {
        page:this.page,
        pageSize:this.pageSize
      };
      axios.get('/goods/list',{
        params:param
      }).then((result)=>{
        var res = result.data.result.list.doc;
        if(flag){
          this.goodsList = this.goodsList.concat(res);
          if(result.data.result.count == 0){
            this.busy = true
          }else{
            this.busy = false
          }
        }else{
          this.goodsList = res;
        }
        // console.log(result.data.result.list.doc);
      })
    },
    loadMore(){
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodList(true);
      }, 500);
    },
    addCart(bookId){
      axios.post('/goods/addCart',{
        bookId:bookId
      }).then((res)=>{
        if(res.data.status === "0"){
          this.mdShowSuccess = true;
        }else{
          this.mdShow = true;
        }
      })
    },
    closeModel(){
      this.mdShow = false;
      this.mdShowSuccess = false;
    },
    search(){

      window.location.href = 'http://search.dangdang.com/?key='+ this.searchStr +'&act=input'
    }
  },
}
</script>
<style scoped>
  .search{
    position: absolute;
    top: 75px;
    right: 50px;
    width: 405px;
    height: 35px;
    /* border: 1px solid #000; */
    border-radius: 15px;
    background-color: #fff;
    padding-left: 10px
  }
  .search-inp{
    width: 340px;
    height: 35px;
    border: none;
  }
  .search-btn{
    display: inline-block;
    width: 50px;
    height: 35px;
    background-color: #f40;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    line-height: 35px;
    border-radius: 15px;
    text-align: center;
    cursor: pointer;
  }
  .search-btn:hover{
    background-color: rgba(255,40,0,0.7)
  }
</style>

