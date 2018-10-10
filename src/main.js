// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueScroller from 'vue-scroller'
import FontSize from'./util/FontSize'
import './styles/common.scss';
import axios from 'axios';//引入文件
import lbdUtil from './util/util'
import 'babel-polyfill'
// import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import Mint from 'mint-ui';
Vue.use(Mint);

import { Swipe, SwipeItem } from 'mint-ui';
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);

Vue.use(VueScroller);
// Vue.use(VueScroller,VueAwesomeSwiper);
Vue.prototype.$http = axios;//将axios挂载到Vue实例中的$ajax上面,在项目中的任何位置通过this.$http使用
Vue.config.productionTip = false
Vue.prototype.lbdUtil = lbdUtil;//自定义工具类

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
// router.afterEach( ( to, from, next ) => {   //路由跳转 百度统计
  // alert('to path')
  // setTimeout(()=>{
  //     var _hmt = _hmt || [];
  //     (function() {
  //       var hm = document.createElement("script");
  //       hm.src = "https://hm.baidu.com/hm.js?59145e98f3aa769fb64caaeb06d106e5";
  //       // console.log(hm.src)
  //       var s = document.getElementsByTagName("script")[0];
  //       s.parentNode.insertBefore(hm, s);
  //     })();
  // },0);
// });
    // var _hmt = window._hmt || []
    // router.beforeEach( (to, from, next) => {
    //   // var _hmt = window._hmt || []
    //   if (to.path) {
    //       if (location.origin == 'http://www.baidu.com') {
    //           _hmt.push(['_trackPageview', '/#' + to.path])
    //       }
    //   }
    //   next()
    // })
