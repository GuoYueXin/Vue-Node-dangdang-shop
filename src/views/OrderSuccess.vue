<template>
<div>
  <nav-header></nav-header>
  <nav-bread>
    <span>订单提交成功</span>
  </nav-bread>
  <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>订单 详情</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>选择</span> 地址</li>
            <li class="cur"><span>确认</span> 订单</li>
            <li class="cur"><span>支付</span> 订单</li>
            <li class="cur"><span>支付</span> 成功</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>恭喜! <br>您的订单已经提交成功!</h3>
            <p>
              <span>订单号：{{orderId}}</span>
              <span>订单总价：￥{{orderTotal}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <!-- <a class="btn btn--m">Cart List</a> -->
                <router-link to="/cart" class="btn btn--m">购物车</router-link>
              </div>
              <div class="btn-r-wrap">
                <!-- <a class="btn btn--m">Goods List</a> -->
                <router-link to="/" class="btn btn--m">返回首页</router-link>
              </div>
            </div>
          </div>
        </div>
        <nav-footer></nav-footer>
      </div>
</div>

</template>
<script>
import NavHeader from './../components/Header';
import NavFooter from './../components/Footer';
import NavBread from './../components/Bread';
import Model from './../components/Model';
import axios from 'axios';
export default {
  data(){
    return{
      orderId:'',
      orderTotal:0
    }
  },
  components:{
    NavHeader,
    NavFooter,
    NavBread
  },
  mounted(){
    this.init()
  },
  methods:{
    init(){
      this.orderId = this.$route.query.orderId;
      if(!this.orderId){
        return;
      }
      console.log(this.orderId)
      axios.get('/users/getOrder',{
       params:{ orderId:this.orderId}
      }).then((response)=>{
        let res = response.data;
        if(res.status == "0"){
          this.orderTotal = res.result.orderTotal
        }

      })
    }
  }
}
</script>

<style>

</style>
