<template>
  <div class="profile-page">
    <HeaderUser :cart-count="3" :user="user" />

    <main class="main-wrapper">
      <SidebarUser :active-link="activeLink" @navigate="activeLink = $event" />

      <section class="content">
        <div class="page-header">
          <h1 class="page-title">Sản phẩm yêu thích</h1>
          <p class="page-subtitle">Quản lý danh sách các sản phẩm bạn đã lưu để mua sau.</p>
        </div>

        <div v-if="loading" class="loading-state">Đang tải danh sách...</div>

        <div v-else-if="favoriteProducts.length === 0" class="empty-state text-center py-10">
          <p class="text-gray-500">Danh sách yêu thích của bạn đang trống.</p>
          <router-link to="/products" class="text-blue-600 font-bold">Đi mua sắm ngay</router-link>
        </div>

        <div v-else class="favorite-grid">
          <div class="favorite-card" v-for="item in favoriteProducts" :key="item.id">

            <button class="btn-heart active" @click="removeFavorite(item.product_id)">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z">
                </path>
              </svg>
            </button>

            <div class="fav-img-wrap">
              <img :src="`${baseUrl}/storage/${item.product.image}`" :alt="item.product.name" class="fav-img" />
            </div>

            <div class="fav-info">
              <h3 class="fav-name">{{ item.product.name }}</h3>
              <div class="fav-meta">
                <span class="fav-price">{{ fmt(item.product.price) }}</span>
                <span class="fav-rating">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z">
                    </path>
                  </svg>
                  {{ item.product.rating ?? '4.8' }}
                </span>
              </div>
            </div>

            <router-link :to="`/productdetail/${item.product.slug}`" class="btn-add-cart">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Xem chi tiết
            </router-link>
          </div>

          <router-link to="/products" class="explore-card">
            <div class="explore-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                </path>
              </svg>
            </div>
            <span class="explore-text">Khám phá thêm</span>
          </router-link>
        </div>

      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import HeaderUser from '../../components/HeaderUser.vue';
import SidebarUser from '../../components/SidebarUser.vue';
import { useNotify } from "@/composables/useNotify";

// Khởi tạo thông báo
const { toastSuccess, toastError, toastInfo } = useNotify();

// State
const favoriteProducts = ref([]);
const activeLink = ref('favorites');
const user = ref({ name: 'Hoàng Anh' });
const loading = ref(true);

// Lấy Base URL (ví dụ: http://127.0.0.1:8000)
const baseUrl = import.meta.env.VITE_API_BASE.replace("/api", "");

// Hàm lấy Token từ object "auth" như bạn đã lưu
const getToken = () => {
  const authData = localStorage.getItem("auth");
  return authData ? JSON.parse(authData).token : null;
};

// 1. Load danh sách yêu thích từ Database
const fetchFavorites = async () => {
  const token = getToken();
  if (!token) {
    toastError("Vui lòng đăng nhập để xem danh sách!");
    return;
  }

  loading.value = true;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/favourites`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    if (res.ok) {
      favoriteProducts.value = await res.json();
    } else {
      toastError("Không thể lấy dữ liệu từ server");
    }
  } catch (err) {
    toastError("Lỗi kết nối API");
  } finally {
    loading.value = false;
  }
};

// 2. Xóa khỏi danh sách yêu thích (Khi bấm vào nút trái tim ở trang này)
const removeFavorite = async (productId) => {
  const token = getToken();
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/favourites/${productId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
      // Cập nhật UI ngay lập tức bằng cách lọc bỏ sản phẩm vừa xóa
      favoriteProducts.value = favoriteProducts.value.filter(item => item.product_id !== productId);
      toastInfo("Đã xóa khỏi danh sách yêu thích");
    }
  } catch (err) {
    toastError("Lỗi khi xóa sản phẩm");
  }
};

const fmt = (n) => Number(n).toLocaleString("vi-VN") + "₫";

onMounted(fetchFavorites);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* --- Global Reset & Variables --- */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.profile-page {
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb;
  color: #111827;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a {
  text-decoration: none;
}

button {
  font-family: inherit;
}

/* --- Header --- */
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1440px;
  margin: 0 auto;
  height: 72px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background-color: #1a73e8;
  color: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon svg {
  width: 22px;
  height: 22px;
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 600px;
  margin: 0 40px;
}

.search-input {
  width: 100%;
  padding: 10px 16px 10px 44px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #f3f4f6;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  color: #111827;
}

.search-input:focus {
  background-color: #ffffff;
  border-color: #1a73e8;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9ca3af;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 28px;
}

.cart-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #4b5563;
  position: relative;
  display: flex;
  align-items: center;
}

.cart-btn svg {
  width: 24px;
  height: 24px;
}

.cart-btn:hover {
  color: #111827;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background-color: #f97316;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 28px;
  border-left: 1px solid #e5e7eb;
  cursor: pointer;
}

.user-text {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.user-tier {
  font-size: 12px;
  color: #9ca3af;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

/* --- Main Layout --- */
.main-wrapper {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  gap: 40px;
  width: 100%;
  flex: 1;
}

/* --- Sidebar --- */
.sidebar {
  width: 260px;
  flex-shrink: 0;
}

.nav-section {
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-title {
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
  padding-left: 16px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: #e5e7eb;
  color: #111827;
}

.nav-link.active {
  background-color: #eff6ff;
  color: #1a73e8;
  font-weight: 600;
}

.nav-link.text-danger {
  color: #dc2626;
}

.nav-link.text-danger:hover {
  background-color: #fee2e2;
}

.nav-icon {
  width: 20px;
  height: 20px;
}

/* --- Content Area --- */
.content {
  flex: 1;
  min-width: 0;
  max-width: 900px;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 15px;
  color: #6b7280;
}

/* --- Favorites Grid --- */
.favorite-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Responseive cho màn nhỏ hơn một chút */
@media (max-width: 1024px) {
  .favorite-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.favorite-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 16px;
  position: relative;
  transition: box-shadow 0.2s, transform 0.2s;
}

.favorite-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-heart {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 10;
  transition: transform 0.2s;
}

.btn-heart:hover {
  transform: scale(1.1);
}

.btn-heart svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.fav-img-wrap {
  width: 100%;
  height: 200px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fav-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fav-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fav-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 40px;
}

.fav-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fav-price {
  font-size: 16px;
  font-weight: 700;
  color: #1a73e8;
}

.fav-rating {
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.fav-rating svg {
  width: 14px;
  height: 14px;
  color: #fbbf24;
  fill: currentColor;
}

.btn-add-cart {
  width: 100%;
  margin-top: 16px;
  background-color: #1a73e8;
  color: #ffffff;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.btn-add-cart:hover {
  background-color: #1557b0;
}

.btn-add-cart svg {
  width: 18px;
  height: 18px;
}

/* --- Explore Card --- */
.explore-card {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 350px;
}

.explore-card:hover {
  border-color: #1a73e8;
  color: #1a73e8;
  background-color: #eff6ff;
}

.explore-icon {
  width: 48px;
  height: 48px;
  background-color: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.explore-card:hover .explore-icon {
  background-color: #dbeafe;
}

.explore-icon svg {
  width: 24px;
  height: 24px;
}

.explore-text {
  font-size: 14px;
  font-weight: 600;
}

/* --- Footer --- */
.footer {
  background-color: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 24px 0;
  margin-top: auto;
}

.footer-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-logo {
  width: 24px;
  height: 24px;
  background-color: #9ca3af;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-logo svg {
  width: 14px;
  height: 14px;
}

.footer-name {
  font-size: 14px;
  font-weight: 700;
  color: #9ca3af;
}

.footer-copy {
  font-size: 13px;
  color: #9ca3af;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a {
  text-decoration: none;
  color: #4b5563;
  font-size: 13px;
  font-weight: 500;
}

.footer-links a:hover {
  color: #111827;
}
</style>