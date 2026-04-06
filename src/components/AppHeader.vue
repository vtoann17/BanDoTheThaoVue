<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useAuth } from "@/stores/auth";
import { useCart } from "@/stores/carts";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuth();
const cartStore = useCart();
const showDropdown = ref(false);
const dropdownRef = ref(null);

onMounted(() => {
  authStore.getUser();
  if (authStore.user) cartStore.loadCart();
  document.addEventListener("click", closeOnOutside);
});
watch(() => authStore.user, (user) => {
  if (user) cartStore.loadCart();
}, { immediate: true });

onBeforeUnmount(() => {
  document.removeEventListener("click", closeOnOutside);
});

const closeOnOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    showDropdown.value = false;
  }
};
</script>

<template>
  <nav class="navbar">
    <!-- Logo -->
    <a href="/" class="nav-logo"> THBA </a>

    <!-- Links -->
    <div class="nav-links">
      <a href="/" class="nav-link">
        <i class="bi bi-house"></i>
        Trang chủ
      </a>
      <a href="/product" class="nav-link">
        <i class="bi bi-grid"></i>
        Sản phẩm
      </a>
      <a href="/contact" class="nav-link">
        <i class="bi bi-envelope"></i>
        Liên hệ
      </a>
      <a href="/promotions" class="nav-link promo">
        <i class="bi bi-stars"></i>
        Khuyến mãi
      </a>
    </div>

    <!-- Right -->
    <div class="nav-right">
      <!-- Search -->
      <div class="search-box">
        <i class="bi bi-search search-icon"></i>
        <input type="text" placeholder="Tìm kiếm..." class="search-input" />
      </div>

      <!-- Giỏ hàng -->
      <!-- Giỏ hàng -->
      <button class="icon-btn" title="Giỏ hàng" @click="router.push('/cart')">
        <i class="bi bi-bag"></i>
        <span class="badge" v-if="cartStore.totalItems > 0">
          {{ cartStore.totalItems > 99 ? "99+" : cartStore.totalItems }}
        </span>
      </button>

      <!-- User đã login -->
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

            <template v-if="authStore.user.role === 'admin'">
              <a href="/dashboar" class="dropdown-item">
                <i class="bi bi-speedometer2"></i>
                Quản lý
              </a>
            </template>
            <template v-else>
              <a href="/profile" class="dropdown-item">
                <i class="bi bi-person"></i>
                Thông tin cá nhân
              </a>
              <a href="/order" class="dropdown-item">
                <i class="bi bi-receipt"></i>
                Đơn hàng của tôi
              </a>
              <a href="/wishlist" class="dropdown-item">
                <i class="bi bi-heart"></i>
                Danh sách yêu thích
              </a>
            </template>

            <div class="dropdown-divider" />

            <a
              href="#"
              class="dropdown-item logout"
              @click="$router.push('/auth/logout')"
            >
              <i class="bi bi-box-arrow-right"></i>
              Đăng xuất
            </a>
          </div>
        </transition>
      </div>

      <!-- Chưa login -->
      <div v-else class="auth-links">
        <a href="/auth/login" class="btn-login">
          <i class="bi bi-person"></i>
          Đăng nhập
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");

* {
  box-sizing: border-box;
}

/* ── Navbar ── */
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

/* ── Logo ── */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 18px;
  color: #111827;
  text-decoration: none;
  letter-spacing: 1px;
  flex-shrink: 0;
}

.logo-icon {
  position: relative;
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, #1565c0, #1e88e5);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 17px;
  overflow: visible;
}

/* Vòng glow xoay */
.glow-ring {
  position: absolute;
  inset: -4px;
  border-radius: 13px;
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    rgba(30, 136, 229, 0.9) 20%,
    rgba(255, 255, 255, 0.6) 30%,
    transparent 40%,
    transparent 100%
  );
  animation: spin-glow 2.4s linear infinite;
  z-index: -1;
}

/* Lớp mask để glow chỉ hiện viền */
.glow-ring::after {
  content: "";
  position: absolute;
  inset: 4px;
  border-radius: 9px;
  background: #1565c0;
}

@keyframes spin-glow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ── Nav links ── */
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
  transition: background 0.18s, color 0.18s;
}
.nav-link i {
  font-size: 14px;
  color: #6b7280;
  transition: color 0.18s;
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
.nav-link.promo:hover {
  background: #fffbeb;
  color: #b45309;
}
.nav-link.promo:hover i {
  color: #b45309;
}

/* ── Right ── */
.nav-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

/* Search */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 13px;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  width: 200px;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.search-box:focus-within {
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
.search-input::placeholder {
  color: #9ca3af;
}

/* Icon btns */
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
  transition: background 0.18s, color 0.18s;
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

/* ── User menu ── */
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
  transition: background 0.18s, border-color 0.18s;
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

/* ── Dropdown ── */
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
  transition: background 0.15s, color 0.15s;
}
.dropdown-item i {
  font-size: 15px;
  color: #6b7280;
  width: 16px;
  text-align: center;
  transition: color 0.15s;
}
.dropdown-item:hover {
  background: #f9fafb;
  color: #111827;
}
.dropdown-item:hover i {
  color: #1565c0;
}

.logout {
  color: #dc2626 !important;
}
.logout i {
  color: #dc2626 !important;
}
.logout:hover {
  background: #fef2f2 !important;
}
.logout:hover i {
  color: #dc2626 !important;
}

/* ── Login btn ── */
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
  transition: background 0.18s, transform 0.18s;
}
.btn-login:hover {
  background: #0d47a1;
  transform: translateY(-1px);
}
.btn-login i {
  font-size: 15px;
}

/* ── Dropdown transition ── */
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