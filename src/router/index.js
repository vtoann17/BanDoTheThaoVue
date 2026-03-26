import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '@/views/auth/Register.vue'
import Login from '@/views/auth/Login.vue'
import AuthCallback from '@/views/auth/AuthCallback.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import VerifyOtp from '@/views/auth/VerifyOtp.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'
import IndexView from '../views/index.vue'
import ProductView from '@/views/ProductView.vue'
import ProductdetailView from '@/views/ProductdetailView.vue'
import Checkout from '@/components/Checkout.vue'
import ProductAdmin from '@/views/admin/ProductAdmin.vue'
import ProductAdd from '@/views/admin/ProductAdd.vue'
import CategoryAdmin from '@/views/admin/CategoryAdmin.vue'
import CategoryAdd from '@/views/admin/CategoryAdd.vue'
import Profile from '@/views/user/Profile.vue'
import ChangePassword from '@/views/user/ChangePassword.vue'
import Order from '@/views/user/Order.vue'
import Address from '@/views/user/Address.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndexView,
    },
    {
      path: "/auth/register", // đường dẫn URL
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
      path: "/productadmin", // đường dẫn URL
      name: "productadmin",
      component: ProductAdmin, // component bạn tạo
    },
    {
      path: "/productadd", // đường dẫn URL
      name: "productadd",
      component: ProductAdd, // component bạn tạo
    },
    {
      path: "/categoryadmin", // đường dẫn URL
      name: "categoryadmin",
      component: CategoryAdmin, // component bạn tạo
    },
    {
      path: "/categoryadd", // đường dẫn URL
      name: "categoryadd",
      component: CategoryAdd, // component bạn tạo
    },
    {
      path: "/profile", // đường dẫn URL
      name: "profile",
      component: Profile, // component bạn tạo
    },
    {
      path: "/changepassword", // đường dẫn URL
      name: "changepassword",
      component: ChangePassword, // component bạn tạo
    },
    {
      path: "/order", // đường dẫn URL
      name: "order",
      component: Order, // component bạn tạo
    },
    {
      path: "/address", // đường dẫn URL
      name: "address",
      component: Address, // component bạn tạo
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
