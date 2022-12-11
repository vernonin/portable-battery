import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/BlankView'
// import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/dashboard/analysis',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: {
            icon: 'dashboard'
          },
          component: BlankView,
          children: [
            {
              path: 'analysis',
              name: '分析页',
              component: () => import('@/pages/dashboard/analysis'),
            }
          ]
        },
        {
          path: 'workplace',
          name: '工作台',
          meta: {
            icon: 'appstore'
          },
          component: PageView,
          children: [
            {
              path: 'store',
              name: '商户管理',
              component: () => import('@/pages/workplace/Store')
            },
            {
              path: 'cabinet',
              name: '机柜管理',
              component: () => import('@/pages/workplace/Cabinet')
            },
            {
              path: 'battery',
              name: '充电宝管理',
              component: () => import('@/pages/workplace/Battery')
            },
            {
              path: 'order',
              name: '订单管理',
              component: () => import('@/pages/workplace/Order')
            }
          ]
        },
        {
          path: 'system',
          name: '系统管理',
          meta: {
            icon: 'setting'
          },
          component: PageView,
          children: [
            {
              path: 'user',
              name: '用户管理',
              component: () => import('@/pages/system/User')
            },
            {
              path: 'role',
              name: '角色管理',
              component: () => import('@/pages/system/Role')
            },
            {
              path: 'menu',
              name: '菜单管理',
              component: () => import('@/pages/system/Menu')
            },
          ]
        }
      ]
    },
  ]
}

export default options
