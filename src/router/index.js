import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '@/views/auth/Register.vue'
import Login from '@/views/auth/Login.vue'
import AuthCallback from '@/views/auth/AuthCallback.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import VerifyOtp from '@/views/auth/VerifyOtp.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: "/auth/register", // đường dẫn URL
      name: "register",
      component: Register, // component bạn tạo
    },
    {
      path: "/auth/login", // đường dẫn URL
      name: "login",
      component: Login, // component bạn tạo
    },
    {
      path: "/auth/callback", // đường dẫn URL
      name: "callback",
      component: AuthCallback, // component bạn tạo
    },
    {
      path: "/auth/forgotpassword", // đường dẫn URL
      name: "forgotpassword",
      component: ForgotPassword, // component bạn tạo
    },
    {
      path: "/auth/verifyotp", // đường dẫn URL
      name: "verifyotp",
      component: VerifyOtp, // component bạn tạo
    },
    {
      path: "/auth/resetpassword", // đường dẫn URL
      name: "resetpassword",
      component: ResetPassword, // component bạn tạo
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
