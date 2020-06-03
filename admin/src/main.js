// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import * as fl from '@/filter/index.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/font/iconfont.css'

Vue.config.productionTip = false

Vue.use(mavonEditor)
Vue.use(ElementUI)

Object.keys(fl).forEach(key => {
  Vue.filter(key, fl[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  beforeMount(){
    if(sessionStorage.getItem("token")){
      store.commit("setToken", sessionStorage.getItem("token"))
    }
  }
})


router.beforeEach((to, from, next)=>{
  if(to.meta.requireLogin){
    if(sessionStorage.getItem('logined')){
      next()
    }else{
      next({name: 'login'})
    }
  }else{
    next()
  }
});