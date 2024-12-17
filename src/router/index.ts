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
    component: () => import('../views/CarouselManager.vue'), 
    meta: {
      title: '輪播管理',
      auth: true,
      hide: true,
      icon: 'pi pi-fw pi-images'
    }
  },
  {
    path: '/kit/category',
    name: 'kitCategory',
    component: () => import('../views/CategoryManager.vue'), 
    meta: {
      title: '商品分類管理',
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
    path: '/kit/singleimage',
    name: 'kitSingleImage',
    component: () => import('../views/SingleImage.vue'),
    meta: {
      title: '圖片元件',
      auth: true,
      hide: true,
      icon: 'pi pi-fw pi-cog'
    }
  }
  // 其他 Kit 的路由
]
