<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useAuth } from "@/stores/auth";
import { useCart } from "@/stores/carts";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const authStore = useAuth();
const cartStore = useCart();
const showDropdown = ref(false);
const dropdownRef = ref(null);

const apiBase = import.meta.env.VITE_API_BASE;

const keyword = ref("");
const suggestions = ref([]);
const isShowingSuggest = ref(false);
const loadingSuggest = ref(false);
let searchTimer = null;

onMounted(async () => {
  if (!authStore.user) {
    await authStore.getUser();
  }
  document.addEventListener("click", closeOnOutside);
});

watch(
  () => authStore.user,
  (user, oldUser) => {
    if (user && !oldUser) cartStore.loadCart();
  }
);

onBeforeUnmount(() => {
  document.removeEventListener("click", closeOnOutside);
});

const closeOnOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    showDropdown.value = false;
  }
  // Đóng bảng gợi ý khi bấm ra ngoài vùng search-container
  if (!e.target.closest(".search-container")) {
    isShowingSuggest.value = false;
  }
};

function onSearchInput() {
  clearTimeout(searchTimer);
  if (!keyword.value.trim()) {
    suggestions.value = [];
    isShowingSuggest.value = false;
    return;
  }
  isShowingSuggest.value = true;
  loadingSuggest.value = true;
  searchTimer = setTimeout(async () => {
    try {
      const res = await axios.get(`${apiBase}/products/suggest`, {
        params: { keyword: keyword.value, limit: 5 },
      });
      suggestions.value = res.data;
    } catch (error) {
      console.error("Lỗi tìm kiếm gợi ý:", error);
    } finally {
      loadingSuggest.value = false;
    }
  }, 300);
}

function handleSearchSubmit() {
  if (!keyword.value.trim()) return;
  isShowingSuggest.value = false;
  router.push({ path: "/product", query: { search: keyword.value.trim() } });
}

function goToProduct(item) {
  isShowingSuggest.value = false;
  keyword.value = "";
  const productSlug = item.slug || item.id;
  router.push({ name: "productdetail", params: { slug: productSlug } });
}

function formatPrice(price) {
  return Number(price).toLocaleString("vi-VN") + "đ";
}

function getImageUrl(path) {
  if (!path) return "/placeholder-img.png";
  if (path.startsWith("http")) return path;
  return `${apiBase.replace("/api", "")}/storage/${path}`;
}
</script>

<template>
  <nav class="navbar">
    <a href="/" class="nav-logo"> THBA </a>

    <div class="nav-links">
      <a href="/" class="nav-link"><i class="bi bi-house"></i> Trang chủ</a>
      <a href="/product" class="nav-link"
        ><i class="bi bi-grid"></i> Sản phẩm</a
      >
      <a href="/contact" class="nav-link"
        ><i class="bi bi-envelope"></i> Liên hệ</a
      >
      <a href="/couponview" class="nav-link promo"
        ><i class="bi bi-stars"></i> Khuyến mãi</a
      >
    </div>

    <div class="nav-right">
      <div class="search-container">
        <div class="search-input-wrap">
          <i class="bi bi-search search-icon"></i>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            class="search-input"
            v-model="keyword"
            @input="onSearchInput"
            @focus="onSearchInput"
            @keyup.enter="handleSearchSubmit"
          />
        </div>

        <div v-if="isShowingSuggest" class="suggest-panel">
          <div v-if="loadingSuggest" class="suggest-state">
            Đang tìm kiếm...
          </div>
          <div v-else-if="suggestions.length === 0" class="suggest-state">
            Không thấy kết quả cho "{{ keyword }}"
          </div>
          <div v-else class="suggest-list">
            <div
              v-for="item in suggestions"
              :key="item.id"
              class="suggest-item"
              @click="goToProduct(item)"
            >
              <img :src="getImageUrl(item.image)" class="si-img" />
              <div class="si-info">
                <p class="si-name">{{ item.name }}</p>
                <p class="si-price">{{ formatPrice(item.price) }}</p>
              </div>
            </div>
            <div class="suggest-footer" @click="handleSearchSubmit">
              Xem tất cả kết quả cho "{{ keyword }}"
            </div>
          </div>
        </div>
      </div>

      <button class="icon-btn" title="Giỏ hàng" @click="router.push('/cart')">
        <i class="bi bi-bag"></i>
        <span class="badge" v-if="cartStore.totalItems > 0">
          {{ cartStore.totalItems > 99 ? "99+" : cartStore.totalItems }}
        </span>
      </button>

      <div class="user-menu" v-if="authStore.user" ref="dropdownRef">
        <div class="user-btn" @click="showDropdown = !showDropdown">
          <img
            v-if="authStore.user.avatar"
            :src="authStore.user.avatar"
            class="avatar"
          />
          <div v-else class="avatar-fallback">
            {{ authStore.user.name.charAt(0).toUpperCase() }}
          </div>
          <span class="username">{{ authStore.user.name }}</span>
          <i
            class="bi bi-chevron-down chevron"
            :class="{ rotated: showDropdown }"
          ></i>
        </div>

        <transition name="dropdown">
          <div v-if="showDropdown" class="dropdown">
            <div class="dropdown-header">
              <div class="dh-avatar">
                <img
                  v-if="authStore.user.avatar"
                  :src="authStore.user.avatar"
                  class="avatar"
                />
                <div v-else class="avatar-fallback">
                  {{ authStore.user.name.charAt(0).toUpperCase() }}
                </div>
              </div>
              <div>
                <div class="dh-name">{{ authStore.user.name }}</div>
                <div class="dh-role">
                  {{
                    authStore.user.role === "admin"
                      ? "Quản trị viên"
                      : "Khách hàng"
                  }}
                </div>
              </div>
            </div>
            <div class="dropdown-divider" />
            <a
              v-if="authStore.user.role === 'admin'"
              href="/dashboard"
              class="dropdown-item"
              ><i class="bi bi-speedometer2"></i> Quản lý</a
            >
            <a href="/order" class="dropdown-item"
              ><i class="bi bi-receipt"></i> Đơn hàng của tôi</a
            >
            <a
              v-if="authStore.user.role !== 'admin'"
              href="/profile"
              class="dropdown-item"
              ><i class="bi bi-person"></i> Cá nhân</a
            >
            <div class="dropdown-divider" />
            <a
              href="#"
              class="dropdown-item logout"
              @click="$router.push('/auth/logout')"
              ><i class="bi bi-box-arrow-right"></i> Đăng xuất</a
            >
          </div>
        </transition>
      </div>

      <div v-else class="auth-links">
        <a href="/auth/login" class="btn-login"
          ><i class="bi bi-person"></i> Đăng nhập</a
        >
      </div>
    </div>
  </nav>
</template>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");

* {
  box-sizing: border-box;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 66px;
  padding: 0 48px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 200;
  gap: 24px;
}

.nav-logo {
  font-weight: 800;
  font-size: 18px;
  color: #111827;
  text-decoration: none;
  flex-shrink: 0;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  justify-content: center;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  font-size: 13.5px;
  font-weight: 500;
  color: #111827;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.18s;
}
.nav-link i {
  font-size: 14px;
  color: #6b7280;
}
.nav-link:hover {
  background: #f3f4f6;
  color: #1565c0;
}
.nav-link:hover i {
  color: #1565c0;
}
.nav-link.promo {
  color: #d97706;
  font-weight: 600;
}
.nav-link.promo i {
  color: #d97706;
}

/* ── SEARCH CONTAINER (ĐÃ FIX TRÙNG) ── */
.search-container {
  position: relative;
  width: 240px;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 13px;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  transition: all 0.2s;
}

.search-container:focus-within .search-input-wrap {
  border-color: #1565c0;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.08);
}

.search-icon {
  color: #9ca3af;
  font-size: 13px;
}
.search-input {
  border: none;
  background: transparent;
  font-size: 13px;
  color: #111827;
  outline: none;
  width: 100%;
}

/* Suggest Panel */
.suggest-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0; /* Căn phải để không bị tràn màn hình */
  width: 320px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 999;
  overflow: hidden;
}

.suggest-state {
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: #6b7280;
}
.suggest-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f3f4f6;
}
.suggest-item:hover {
  background: #f9fafb;
}
.si-img {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 6px;
  background: #f3f4f6;
}
.si-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.si-price {
  font-size: 12px;
  color: #1565c0;
  font-weight: 700;
  margin: 2px 0 0;
}
.suggest-footer {
  padding: 10px;
  text-align: center;
  background: #f9fafb;
  font-size: 12px;
  font-weight: 600;
  color: #1565c0;
  cursor: pointer;
}
.suggest-footer:hover {
  text-decoration: underline;
}

/* ── RIGHT AREA ── */
.nav-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.icon-btn {
  position: relative;
  background: none;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #374151;
  font-size: 18px;
  transition: all 0.18s;
}
.icon-btn:hover {
  background: #f3f4f6;
  color: #111827;
}
.badge {
  position: absolute;
  top: 3px;
  right: 3px;
  background: #1565c0;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  padding: 0 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #fff;
}

/* ── USER MENU & DROPDOWN ── */
.user-menu {
  position: relative;
}
.user-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 10px 5px 6px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.18s;
  border: 1.5px solid transparent;
}
.user-btn:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}
.avatar-fallback {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1565c0, #1e88e5);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.username {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}
.chevron {
  font-size: 11px;
  color: #9ca3af;
  transition: transform 0.2s;
}
.chevron.rotated {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  min-width: 210px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.dropdown-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
}
.dh-name {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
}
.dh-role {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 1px;
}
.dropdown-divider {
  height: 1px;
  background: #f3f4f6;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  font-size: 13px;
  color: #374151;
  text-decoration: none;
  transition: all 0.15s;
}
.dropdown-item i {
  font-size: 15px;
  color: #6b7280;
  width: 16px;
  text-align: center;
}
.dropdown-item:hover {
  background: #f9fafb;
  color: #111827;
}
.logout {
  color: #dc2626 !important;
}
.btn-login {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  background: #1565c0;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 9px;
  text-decoration: none;
  transition: all 0.18s;
}
.btn-login:hover {
  background: #0d47a1;
  transform: translateY(-1px);
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>