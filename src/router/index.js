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
import Cart from "@/views/Cart.vue"
import Checkout from '@/views/Checkout.vue'
import ProductAdmin from '@/views/admin/products/ProductAdmin.vue'
import ProductAdd from '@/views/admin/products/ProductAdd.vue'
import ProductEdit from '@/views/admin/products/ProductEdit.vue'
import AttributeAdmin from '@/views/admin/attributes/AttributeAdmin.vue'
import AttributeAdd from '@/views/admin/attributes/AttributeAdd.vue'
import AttributeEdit from '@/views/admin/attributes/AttributeEdit.vue'
import AttributeValue from '@/views/admin/attributevalues/AttributeValue.vue'
import AttributeValueAdd from '@/views/admin/attributevalues/AttributeValueAdd.vue'
import AttributeValueEdit from '@/views/admin/attributevalues/AttributeValueEdit.vue'
import VariantAdmin from '@/views/admin/variants/VariantAdmin.vue'
import VariantAdd from '@/views/admin/variants/VariantAdd.vue'
import VariantEdit from '@/views/admin/variants/VariantEdit.vue'
import Dashboar from '@/views/admin/Dashboar.vue'
import CategoryAdmin from '@/views/admin/categories/CategoryAdmin.vue'
import CategoryAdd from '@/views/admin/categories/CategoryAdd.vue'
import CategoryEdit from "@/views/admin/categories/CategoryEdit.vue"
import SubcategoryAdd from "@/views/admin/subcategory/SubcategoryAdd.vue"
import SubcategoryAdmin from "@/views/admin/subcategory/SubcategoryAdmin.vue"
import SubcategoryEdit from "@/views/admin/subcategory/SubcategoryEdit.vue"
import Profile from '@/views/user/Profile.vue'
import ChangePassword from '@/views/user/ChangePassword.vue'
import Order from '@/views/user/Order.vue'
import OrderSuccess from "@/views/OrderSuccess.vue"
import OrderFailed from "@/views/OrderFailed.vue"
import Address from '@/views/user/Address.vue'
import Favorite from '@/views/user/Favorite.vue'
import Coupon from '@/views/user/Coupon.vue'
import OrderAdmin from '@/views/admin/OrderAdmin.vue'
import UserAdmin from '@/views/admin/user/UserAdmin.vue'
import UserAdd from '@/views/admin/user/UserAdd.vue'
import UserEdit from '@/views/admin/user/UserEdit.vue'
import BrandAdmin from '@/views/admin/brands/BrandAdmin.vue'
import BrandAdd from '@/views/admin/brands/BrandAdd.vue'
import BrandEdit from '@/views/admin/brands/BrandEdit.vue'
import Forbidden from '@/views/errors/Forbidden.vue'
import { useAuth } from "@/stores/auth";
import { useNotify } from "@/composables/useNotify";
import CouponAdmin from '@/views/admin/coupon/CouponAdmin.vue'
import CouponAdd from '@/views/admin/coupon/CouponAdd.vue'
import CouponEdit from '@/views/admin/coupon/CouponEdit.vue'
import ReviewAdmin from '@/views/admin/reviews/ReviewAdmin.vue'
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
      path: "/productdetail/:slug", // đường dẫn URL
      name: "productdetail",
      component: ProductdetailView, // component bạn tạo
    },
    {
      path: "/cart", // đường dẫn URL
      name: "cart",
      component: Cart, // component bạn tạo
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
      path: "/productadd",
      name: "productadd",
      component: ProductAdd,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/productedit/:id",
      name: "productedit",
      component: ProductEdit,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/reviewadmin",
      name: "reviewadmin",
      component: ReviewAdmin,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/attributeadmin",
      name: "attributeadmin",
      component: AttributeAdmin,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/attributeadd",
      name: "attributeadd",
      component: AttributeAdd,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/attributeedit/:id",
      name: "attributeedit",
      component: AttributeEdit,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/attributevalue",
      name: "attributevalue",
      component: AttributeValue,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/attributevalueadd",
      name: "attributevalueadd",
      component: AttributeValueAdd,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/attributevalueedit/:id",
      name: "attributevalueedit",
      component: AttributeValueEdit,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/variantadmin/:id",
      name: "variantadmin",
      component: VariantAdmin,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/variantadd/:id",
      name: "variantadd",
      component: VariantAdd,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/variantedit/:id",
      name: "variantedit",
      component: VariantEdit,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/dashboar",
      name: "dashboar",
      component: Dashboar,
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
      path: "/categoryedit/:id",
      name: "categoryedit",
      component: CategoryEdit,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/subcategoryadmin",
      name: "subcategoryadmin",
      component: SubcategoryAdmin,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/subcategoryadd",
      name: "subcategoryadd",
      component: SubcategoryAdd,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/subcategoryedit/:id",
      name: "subcategoryedit",
      component: SubcategoryEdit,
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
      path: "/ordersuccess",
      name: "ordersuccess",
      component: OrderSuccess,
      meta: { requiresAuth: true }
    },
    {
      path: "/orderfailed",
      name: "orderfailed",
      component: OrderFailed,
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
      path: "/brandedit/:id", // Thêm :id để nhận tham số từ URL
      name: "brandedit",
      component: BrandEdit,
      meta: { requiresAuth: true, requiresAdmin: true } // Nên thêm bảo mật nếu là trang admin
    },
     {
      path: "/orderadmin", // đường dẫn URL
      name: "orderadmin",
      component: OrderAdmin, // component bạn tạo
      meta: { requiresAuth: true, requiresAdmin: true }
    },
     {
      path: "/useradd", // đường dẫn URL
      name: "useradd",
      component: UserAdd, // component bạn tạo
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/useradmin", // đường dẫn URL
      name: "useradmin",
      component: UserAdmin, // component bạn tạo
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/useredit/:id", // đường dẫn URL
      name: "useredit",
      component: UserEdit, // component bạn tạo
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/brandadmin", // đường dẫn URL
      name: "brandadmin",
      component: BrandAdmin, // component bạn tạo
    },
     {
      path: "/brandadd", // đường dẫn URL
      name: "brandadd",
      component: BrandAdd, // component bạn tạo
    },
     {
      path: "/brandedit/:id", // đường dẫn URL
      name: "brandedit",
      component: BrandEdit, // component bạn tạo
    },
    {
      path: "/brandadmin", // đường dẫn URL
      name: "brandadmin",
      component: BrandAdmin, // component bạn tạo
    },
     {
      path: "/brandAdd", // đường dẫn URL
      name: "brandAdd",
      component: BrandAdd, // component bạn tạo
    },
    {
      path: "/couponadmin", // đường dẫn URL
      name: "couponadmin",
      component: CouponAdmin, // component bạn tạo
    },
    {
      path: "/couponadd", // đường dẫn URL
      name: "couponadd",
      component: CouponAdd, // component bạn tạo
    },
    {
      path: "/couponedit/:id", // đường dẫn URL
      name: "couponedit",
      component: CouponEdit, // component bạn tạo
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


let isInitialized = false;  

router.beforeEach(async (to, from) => {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  const authStore = useAuth();
  const notify = useNotify();
  if (auth && !authStore.user && !isInitialized) {
    isInitialized = true;
    try {
      await Promise.race([
        authStore.getUser(),
        new Promise((_, reject) => setTimeout(() => reject("timeout"), 3000)),
      ]);
    } catch {
      localStorage.removeItem("auth");
    }
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