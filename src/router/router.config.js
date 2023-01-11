// eslint-disable-next-line
import { UserLayout, RouteView } from '@/layouts'

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/login', // 登陆
    component: UserLayout,
    redirect: '/login',
    hidden: true,
    children: [
      {
        path: '',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      }
    ]
  },
  {
    path: '/index', // 登陆
    component: RouteView,
    redirect: '/index',
    hidden: true,
    children: [
      {
        path: '',
        name: 'index',
        component: () => import(/* webpackChunkName: "user" */ '@/views/dashboard/Workplace')
      }
    ]
  },
  {
    path: '/lorelist', // 登陆
    component: UserLayout,
    redirect: '/lorelist',
    hidden: true,
    children: [
      {
        path: '',
        name: 'lorelist',
        component: () => import(/* webpackChunkName: "user" */ '@/views/lore/Main')
      }
    ]
  },
  {
    path: '/loreview', // 登陆
    component: UserLayout,
    redirect: '/loreview',
    hidden: true,
    children: [
      {
        path: '',
        name: 'loreview',
        component: () => import(/* webpackChunkName: "user" */ '@/views/lore/View')
      }
    ]
  },
  {
    path: '/my', // 登陆
    component: UserLayout,
    redirect: '/my',
    hidden: true,
    children: [
      {
        path: '',
        name: 'my',
        component: () => import(/* webpackChunkName: "user" */ '@/views/my/Main')
      }
    ]
  },
  {
    path: '/lorelist', // 登陆
    component: UserLayout,
    redirect: '/lorelist',
    hidden: true,
    children: [
      {
        path: '',
        name: 'lorelist',
        component: () => import(/* webpackChunkName: "user" */ '@/views/lore/Main')
      }
    ]
  },
  {
    path: '/loreview', // 登陆
    component: UserLayout,
    redirect: '/loreview',
    hidden: true,
    children: [
      {
        path: '',
        name: 'loreview',
        component: () => import(/* webpackChunkName: "user" */ '@/views/lore/View')
      }
    ]
  },
  {
    path: '/lorepdfview', // 登陆
    component: UserLayout,
    redirect: '/lorepdfview',
    hidden: true,
    children: [
      {
        path: '',
        name: 'lorepdfview',
        component: () => import(/* webpackChunkName: "user" */ '@/views/lore/PdfView')
      }
    ]
  },
  {
    path: '/mark', // 登陆
    component: UserLayout,
    redirect: '/mark',
    hidden: true,
    children: [
      {
        path: '',
        name: 'mark',
        component: () => import(/* webpackChunkName: "user" */ '@/views/my/Mark')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
