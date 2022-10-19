import { createRouter, createWebHashHistory } from 'vue-router'
// 路由规则配置
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home/index.vue')
  },
  // {
  //   path: '/category',
  //   name: 'category',
  //   component: () => import('@/views/Category/index.vue')
  // },
  // {
  //   path: '/category-detail/:categoryId',
  //   name: 'category-detail',
  //   component: () => import('@/views/CategoryDetail/index.vue'),
  //   props: true
  // },
  {
    path: '/address',
    name: 'address',
    component: () => import('@/views/Address/index.vue'),
    props: true,
    meta: { requireAuth: true }
  }, 
  {
    path: '/order-confirm',
    name: 'order-confirm',
    component: () => import('@/views/OrderConfirm/index.vue'),
    props: true,
    meta: { requireAuth: true }
  },
  // {
  //   path: '/order',
  //   name: 'order',
  //   component: () => import('@/views/Order/index.vue'),
  //   meta: { requireAuth: true }
  // },
  // {
  //   path: '/order-detail/:orderId',
  //   name: 'order-detail',
  //   component: () => import('@/views/OrderDetail/index.vue'),
  //   props: true,
  //   meta: { requireAuth: true }
  // },
  {
    path: '/product/:productId',
    name: 'product',
    component: () => import('@/views/Product/index.vue'),
    props: true
  },
  // {
  //   path: '/pay',
  //   name: 'pay',
  //   component: () => import('@/views/Pay/index.vue'),
  //   meta: { requireAuth: true }
  // },
  {
    path: '/commment/:productId',
    name: 'comment',
    component: () => import('@/views/Comment/index.vue')
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: () => import('@/views/Recommend/index.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/Cart/index.vue'),
    meta: { requireAuth:true }
  },
  // {
  //   path: '/search',
  //   name: 'search',
  //   component: () => import('@/views/Search/index.vue')
  // },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/User/index.vue'),
    meta: { requireAuth: true }
  },
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'not-found',
  //   component: () => import('@/views/NotFound/index.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
import store from '@/store'
router.beforeEach(to => {
  // 无需登录页面的处理
  if (!to.meta.requireAuth) {
    return true
  }
  // 该用户是否登录，vuex数据获取
  if (!store.state.user.token || window.localStorage.getItem('USER_TOKEN')) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath
      }
    }
  }
})
export default router
