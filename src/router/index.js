import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '@/views/auth/Register.vue'
import Login from '@/views/auth/Login.vue'
import Logout from '@/views/auth/Logout.vue'
import AuthCallback from '@/views/auth/AuthCallback.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import VerifyOtp from '@/views/auth/VerifyOtp.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'
import IndexView from '../views/index.vue'
import ProductView from '@/views/ProductView.vue'
import ProductdetailView from '@/views/ProductdetailView.vue'
import Checkout from '@/components/Checkout.vue'
import ProductAdmin from '@/views/admin/ProductAdmin.vue'
import Dashboar from '@/views/admin/Dashboar.vue'
import ProductAdd from '@/views/admin/ProductAdd.vue'
import CategoryAdmin from '@/views/admin/CategoryAdmin.vue'
import CategoryAdd from '@/views/admin/CategoryAdd.vue'
import Profile from '@/views/user/Profile.vue'
import ChangePassword from '@/views/user/ChangePassword.vue'
import Order from '@/views/user/Order.vue'
import Address from '@/views/user/Address.vue'
import Favorite from '@/views/user/Favorite.vue'
import Coupon from '@/views/user/Coupon.vue'
import Dashboard from '@/views/admin/Dashboard.vue'
import OrderAdmin from '@/views/admin/OrderAdmin.vue'
import UserAdmin from '@/views/admin/UserAdmin.vue'
import UserAdd from '@/views/admin/UserAdd.vue'
import BrandAdmin from '@/views/admin/BrandAdmin.vue'
import BrandAdd from '@/views/admin/BrandAdd.vue'
import Forbidden from '@/views/errors/Forbidden.vue'
import { useAuth } from "@/stores/auth";
import { useNotify } from "@/composables/useNotify";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndexView,
    },
    {
      path: '/403',
      name: 'forbidden',
      component: Forbidden,
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
      path: "/productadmin",
      name: "productadmin",
      component: ProductAdmin,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/dashboar",
      name: "dashboar",
      component: Dashboar,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/productadd",
      name: "productadd",
      component: ProductAdd,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/categoryadmin",
      name: "categoryadmin",
      component: CategoryAdmin,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/categoryadd",
      name: "categoryadd",
      component: CategoryAdd,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: "/changepassword",
      name: "changepassword",
      component: ChangePassword,
      meta: { requiresAuth: true }
    },
    {
      path: "/order",
      name: "order",
      component: Order,
      meta: { requiresAuth: true }
    },
    {
      path: "/address",
      name: "address",
      component: Address,
      meta: { requiresAuth: true }
    },
    {
      path: "/checkout",
      name: "checkout",
      component: Checkout,
      meta: { requiresAuth: true }
    },
     {
      path: "/favorite", // đường dẫn URL
      name: "favorite",
      component: Favorite, // component bạn tạo
    },
    {
      path: "/coupon", // đường dẫn URL
      name: "coupon",
      component: Coupon, // component bạn tạo
    },
    {
      path: "/dashboard", // đường dẫn URL
      name: "dashboard",
      component: Dashboard, // component bạn tạo
    },
     {
      path: "/orderAdmin", // đường dẫn URL
      name: "orderAdmin",
      component: OrderAdmin, // component bạn tạo
    },
     {
      path: "/userAdd", // đường dẫn URL
      name: "userAdd",
      component: UserAdd, // component bạn tạo
    },
    {
      path: "/userAdmin", // đường dẫn URL
      name: "userAdmin",
      component: UserAdmin, // component bạn tạo
    },
    {
      path: "/brandAdmin", // đường dẫn URL
      name: "brandAdmin",
      component: BrandAdmin, // component bạn tạo
    },
     {
      path: "/brandAdd", // đường dẫn URL
      name: "brandAdd",
      component: BrandAdd, // component bạn tạo
    },
    {
      path: "/auth/login", // đường dẫn URL
      name: "login",
      component: Login, // component bạn tạo
    },
    {
      path: "/auth/logout", // đường dẫn URL
      name: "logout",
      component: Logout, // component bạn tạo
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


router.beforeEach(async (to, from) => {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  const authStore = useAuth();
  const notify = useNotify();

  if (auth && !authStore.user) {
    await authStore.getUser();
  }

  if (to.meta.requiresAuth && !auth) {
    notify.toastError("Bạn cần đăng nhập!");
    return "/auth/login";
  }

  if (to.meta.requiresAdmin && authStore.user?.role !== "admin") {
    notify.toastError("Bạn không có quyền!");
    return "/403";
  }

  return true;
});

export default router
