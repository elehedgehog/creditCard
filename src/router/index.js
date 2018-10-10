import Vue from 'vue'
import Router from 'vue-router'
import CreditCardCenter from '@/components/CreditCardCenter'
import BankListDetails from '@/components/BankListDetails'
import AllBank from '@/components/AllBank'
import ApplyComplete from '@/components/ApplyComplete'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'CreditCardCenter',
      component: CreditCardCenter,
      meta: {
          title: '信用卡中心'
        },
      },{
      path: '/BankListDetails/:id',
      name: 'BankListDetails',
      component: BankListDetails,
        meta: {
          title: ''
        },
      },{
      path: '/AllBank/:type',
      name: 'AllBank',
      component: AllBank,
      meta: {
        title: '全部银行'
          },
        },{
      path: '/ApplyComplete',
      name: 'ApplyComplete',
      component: ApplyComplete,
      meta: {
        title: '支付完成'
      },
    },
  ]
})
router.beforeEach((to, from, next) => {
  if(to.meta.title){
    document.title = to.meta.title
  }
  next()
})
export default router
