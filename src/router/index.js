import Vue from 'vue'
import Router from 'vue-router'
import GoodList from './../views/GoodList'
import Cart from './../views/Cart'
import Address from './../views/Address'
import OrderConfrim from './../views/OrderConfrim'
import OrderSuccess from './../views/OrderSuccess'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodList',
      component: GoodList
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/orderConfrim',
      name: 'OrderConfrim',
      component: OrderConfrim
    },
     {
      path: '/orderSuccess',
      name: 'OrderSuccess',
      component: OrderSuccess
    }
  ]
})
