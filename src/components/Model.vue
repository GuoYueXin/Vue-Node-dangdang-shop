<template>
  <header class="header">
    <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':mdShow}">
      <div class="md-modal-inner">
        <div class="md-top">
          <div class="md-title">消息</div>
          <button class="md-close" @click="closeModel">关闭</button>
        </div>
        <div class="md-content">
          <slot name="message"></slot>
        </div>
        <div class="btn-wrap">
          <slot name="btnGroup"></slot>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-if="mdShow" @click="closeModel"></div>
  </header>
</template>

<script>
  import './../assets/css/login.css';
  import axios from 'axios';
  export default {
    data(){
      return{

      }
    },
    props:["mdShow"],
    methods:{
      closeModel(){
        this.$emit('close');
      }
    }

  }
</script>

<style scoped>

</style>
