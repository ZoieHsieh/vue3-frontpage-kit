import { RouteRecordRaw } from 'vue-router'

// 定義 Kit 的路由
export const kitRoutes: Array<RouteRecordRaw> = [
  {
    path: '/kit/home',
    name: 'kitHome',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首頁設定',
      auth: true,
      hide: false,
      icon: 'pi pi-fw pi-home'
    }
  },
  {
    path: '/kit/carousel',
    name: 'kitCarousel',
    component: () => import('../views/CarouselManager.vue'), // 輪播元件頁面
    meta: {
      title: '輪播管理',
      auth: true,
      hide: true,
      icon: 'pi pi-fw pi-images'
    }
  },
  {
    path: '/kit/productgroup',
    name: 'kitProductgroup',
    component: () => import('../views/ProductGroup.vue'), // 商品群組頁面
    meta: {
      title: '商品群組',
      auth: true,
      hide: true,
      icon: 'pi pi-fw pi-tags'
    }
  },
  {
    path: '/kit/settings',
    name: 'kitSettings',
    component: () => import('../views/Settings.vue'),
    meta: {
      title: 'Kit 設定',
      auth: true,
      hide: true,
      icon: 'pi pi-fw pi-cog'
    }
  }
  // 其他 Kit 的路由
]

// 這裡不創建 router 實例，只是導出路由列表
