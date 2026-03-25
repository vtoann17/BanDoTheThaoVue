import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '@/views/Register.vue'
import Index from '@/views/index.vue'
import IndexView from '../views/index.vue'
import ProductView from '@/views/ProductView.vue'
import ProductdetailView from '@/views/ProductdetailView.vue'
import Checkout from '@/components/Checkout.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndexView,
    },
    {
      path: "/register", // đường dẫn URL
      name: "register",
      component: Register, // component bạn tạo
    },
    {
      path: "/product", // đường dẫn URL
      name: "product",
      component: ProductView, // component bạn tạo
    },
    {
      path: "/productdetail", // đường dẫn URL
      name: "productdetail",
      component: ProductdetailView, // component bạn tạo
    },
    {
      path: "/checkout", // đường dẫn URL
      name: "checkout",
      component: Checkout, // component bạn tạo
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
