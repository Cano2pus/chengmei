import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import login from '@/components/login'
import goods from '@/components/goods'
import promotColumn from '@/components/promotColumn'
import goods_list from '@/components/goods_list'
import promotlist from '@/components/promotlist'
import account from '@/components/account'
import about from '@/components/about'
import adv from '@/components/adv'
import banner from '@/components/banner'
import users from '@/components/users'
import detail from '@/components/detail'
import order from '@/components/order'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      meta: {
        requireLogin: true
      },
      children: [
        {
          path: '/index/goods',
          name: 'goods',
          component: goods,
          meta: {
            requireLogin: true
          }
        },
        {
          path: '/index/promotColumn',
          name: 'promotColumn',
          component: promotColumn,
          meta: {
            requireLogin: true
          }
        },
        {
          path: '/index/goods_list',
          name: 'goods_list',
          component: goods_list,
          meta: {
            requireLogin: true
          }
        },
        {
          path: '/index/promotlist',
          name: 'promotlist',
          component: promotlist,
          meta: {
            requireLogin: true
          }
        },
        {
          path: '/index/account',
          name: 'account',
          component: account,
          meta: {
            requireLogin: true
          }
        },
        {
          path: '/index/about',
          name: 'about',
          component: about,
          meta: {
            requireLogin: true
          }
        },
        {
          path: '/index/adv',
          name: 'adv',
          component: adv,
          meta: {
            requireLogin: true
          }
        },
        {
          path: '/index/banner',
          name: 'banner',
          component: banner,
          meta: {
            requireLogin: true
          }
        },
        {
          path: '/index/users',
          name: 'users',
          component: users,
          meta: {
            requireLogin: true
          }
        },
        {
          path: '/index/detail',
          name: 'detail',
          component: detail,
          meta: {
            requireLogin: true
          }
        },
        {
          path: '/index/order',
          name: 'order',
          component: order,
          meta: {
            requireLogin: true
          }
        }
      ]
    }
  ]
})
