<template>
  <header class="header">
      <div class="navbar">
        <div class="navbar-left-container">
          <a href="/">
            <img class="navbar-brand-logo" src="static/dd-logo.png"></a>
        </div>
        <div class="navbar-right-container" style="display: flex;">
          <div class="navbar-menu-container">
            <span class="navbar-link" v-text="nickName" v-if="nickName"></span>
            <a href="javascript:void(0)" class="navbar-link" @click="loginModelFlag=true" v-if="!nickName">登录</a>
            <a href="javascript:void(0)" class="navbar-link" @click="logout" v-if="nickName">注销</a>
            <div class="navbar-cart-container">
              <a href="javascript:;" style="display:inline-block; width:100%; height:100%;" @click="cart()"></a>
            </div>
          </div>
        </div>
      </div>
      <!-- 登录 -->
      <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':loginModelFlag}">
        <div class="md-modal-inner">
          <div class="md-top">
            <div class="md-title">登录</div>
            <button class="md-close" @click="loginModelFlag=false;errorTip=false">关闭</button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <div class="error-wrap">
                <span class="error error-show" v-show="errorTip">用户名或者密码错误</span>
              </div>
              <ul>
                <li class="regi_form_input">
                  <i class="icon IconPeople"></i>
                  <input type="text" tabindex="1" name="loginname" v-model="userName" class="regi_login_input regi_login_input_left" placeholder="User Name" data-type="loginname">
                </li>
                <li class="regi_form_input noMargin">
                  <i class="icon IconPwd"></i>
                  <input type="password" tabindex="2"  name="password" v-model="userPwd" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="Password" @keyup.enter="login">
                </li>
              </ul>
            </div>
            <div class="login-wrap">
              <a href="javascript:;" class="btn-login" @click="login()">登  录</a>
            </div>
            <div class="reg">
              <span @click="loginModelFlag = false;regModelFlag = true;">没有账号？注册</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 注册 -->
      <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':regModelFlag}">
        <div class="md-modal-inner">
          <div class="md-top">
            <div class="md-title">注册</div>
            <button class="md-close" @click="loginModelFlag=false;regModelFlag=false;errorTip=false">关闭</button>
          </div>
          <div class="md-content">
            <div class="error-wrap">
                <span class="error error-show" v-show="errorTip">不输入账号密码，难道刷脸吗？</span>
              </div>
              <ul>
                <li class="regi_form_input">
                  <i class="icon IconPeople"></i>
                  <input type="text" tabindex="1" name="loginname" v-model="userName" class="regi_login_input regi_login_input_left" placeholder="User Name" data-type="loginname">
                </li>
                <li class="regi_form_input noMargin">
                  <i class="icon IconPwd"></i>
                  <input type="password" tabindex="2"  name="password" v-model="userPwd" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="Password" @keyup.enter="login">
                </li>
              </ul>
            </div>
            <div class="login-wrap">
              <a href="javascript:;" class="btn-reg" @click="reg()">注册</a>
            </div>
          </div>
        </div>

        <div class="md-overlay" v-if="loginModelFlag||regModelFlag" @click="loginModelFlag=false;regModelFlag=false;errorTip = false;"></div>
    </header>
</template>

<script>
  import './../assets/css/login.css';
  import axios from 'axios';
  export default {
    data(){
      return{
        userName:'',
        userPwd:'',
        errorTip:false,
        loginModelFlag:false,
        regModelFlag:false,
        nickName:''
      }
    },
    methods:{
      login(){
        if(this.userName == '' || this.userPwd == ''){
          this.errorTip = true;
          return;
        }
        axios.post('/users/login',{
          userName:this.userName,
          userPwd:this.userPwd
        }).then((response)=>{
          console.log(response)
          let res = response.data;
          if(res.status == "0"){
            this.loginModelFlag = false;
            this.errorTip = false;
            this.nickName = res.result.userName;
          }else{
            this.errorTip = true;
          }
        })
      },
      reg(){
        if(this.userName == '' || this.userPwd == ''){
          this.errorTip = true;
          return;
        }
        axios.post('/users/reg',{
          userName:this.userName,
          userPwd:this.userPwd
        }).then((response)=>{
          console.log(response)
          let res = response.data;
          if(res.status == "0"){
            this.regModelFlag = false;
            this.errorTip = false;
            this.nickName = res.result.userName;
          }
        })
      },
      logout(){
        axios.post('/users/logout').then((response)=>{
          let res = response.data;
          if(res.status == "0"){
            this.nickName = '';
          }else{
            this.errorTip = true;
          }
        })
        this.$router.push({
          path:'/'
        })
      },
      checkLogin(){
        axios.get('/users/checklogin').then((response)=>{
          let res = response.data;
          if(res.status == "0"){
            // console.log(res);
            this.nickName = res.result;
          }else{
            this.nickName = '';
          }
        })
      },
      cart(){
        if(this.nickName){
          this.$router.push({
            path:"/cart"
          })
        }else{
          this.loginModelFlag = true;
          this.errorTip = false;
        }
      }
    },
    mounted(){
      this.checkLogin();
    },

  }
</script>

<style scoped>
  .reg{
    width: 100%;
    height: 20px;
    margin-top: 10px;
  }
  .reg span{
    float: right;
    cursor: pointer;
  }
  .reg span:hover{
    color: coral;
    text-decoration: underline;
  }
  .btn-reg{
    display: block;
    width: 100%;
    height: 38px;
    padding: 0 10px;
    background-color: #61b1ef;
    color: #fff;
    font-size: 18px;
    line-height: 38px;
    text-align: center;
  }
</style>
