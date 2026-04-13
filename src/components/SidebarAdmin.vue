<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo-box">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="logo-icon"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path
            d="M5.636 5.636a9 9 0 0112.728 0M12 2v20M2 12h20M5.636 18.364a9 9 0 0112.728 0"
          ></path>
        </svg>
      </div>
      <div class="logo-text">
        <span class="brand-name">THBA</span>
        <span class="brand-sub">Hệ thống Quản trị</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/" class="nav-item">
        <i class="bi bi-house"></i> Trang chủ
      </router-link>

      <router-link to="/dashboard" class="nav-item">
        <i class="bi bi-speedometer2"></i> Tổng quan
      </router-link>

      <!-- Sản phẩm dropdown -->
      <div class="nav-group">
        <button
          class="nav-item nav-toggle"
          @click="toggleMenu('product')"
          :class="{ active: openMenu === 'product' }"
        >
          <i class="bi bi-box-seam"></i>
          <span>Sản phẩm</span>
          <i
            class="bi bi-chevron-down chevron"
            :class="{ rotated: openMenu === 'product' }"
          ></i>
        </button>
        <div class="nav-submenu" :class="{ open: openMenu === 'product' }">
          <router-link to="/productadmin" class="nav-subitem">
            <i class="bi bi-grid"></i> Danh sách
          </router-link>
          <router-link to="/attributeadmin" class="nav-subitem">
            <i class="bi bi-sliders"></i> Thuộc tính
          </router-link>
          <router-link to="/attributevalue" class="nav-subitem">
            <i class="bi bi-layers"></i> Giá trị thuộc tính
          </router-link>
        </div>
      </div>

      <!-- Danh mục dropdown -->
      <div class="nav-group">
        <button
          class="nav-item nav-toggle"
          @click="toggleMenu('category')"
          :class="{ active: openMenu === 'category' }"
        >
          <i class="bi bi-tags"></i>
          <span>Danh mục</span>
          <i
            class="bi bi-chevron-down chevron"
            :class="{ rotated: openMenu === 'category' }"
          ></i>
        </button>
        <div class="nav-submenu" :class="{ open: openMenu === 'category' }">
          <router-link to="/categoryadmin" class="nav-subitem">
            <i class="bi bi-grid"></i> Danh mục chính
          </router-link>
          <router-link to="/subcategoryadmin" class="nav-subitem">
            <i class="bi bi-diagram-2"></i> Danh mục con
          </router-link>
        </div>
      </div>
      <router-link to="/brandadmin" class="nav-item">
        <i class="bi bi-bookmark-star"></i> Thương hiệu
      </router-link>
      

      <router-link to="/orderadmin" class="nav-item">
        <i class="bi bi-cart"></i> Đơn hàng
      </router-link>

      <router-link to="/useradmin" class="nav-item">
        <i class="bi bi-people"></i>
        Người dùng
      </router-link>

      <router-link to="/couponadmin" class="nav-item">
        <i class="bi bi-ticket-perforated"></i>
        Mã giảm giá
      </router-link>

      <router-link to="/reviewadmin" class="nav-item">
        <i class="bi bi-star-fill"></i>
        Đánh giá
      </router-link>
      <router-link to="/admin/contacts" class="nav-item">
  Liên hệ
</router-link>
    </nav>

    <div class="sidebar-footer">
      <router-link to="/auth/logout" class="nav-item logout">
        <i class="bi bi-box-arrow-right"></i> Đăng xuất
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const openMenu = ref(null);

// Tự động mở đúng menu khi vào trang
watch(
  () => route.path,
  (path) => {
    if (
      ["/productadmin", "/productadd", "/variantadmin", "/attributeadmin"].some(
        (p) => path.startsWith(p)
      )
    ) {
      openMenu.value = "product";
    } else if (
      [
        "/categoryadmin",
        "/categoryadd",
        "/categoryedit",
        "/subcategoryadmin",
      ].some((p) => path.startsWith(p))
    ) {
      openMenu.value = "category";
    }
  },
  { immediate: true }
);

function toggleMenu(name) {
  openMenu.value = openMenu.value === name ? null : name;
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 12px;
}
.logo-box {
  width: 32px;
  height: 32px;
  background-color: #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-icon {
  width: 20px;
  height: 20px;
  color: #fff;
}
.logo-text {
  display: flex;
  flex-direction: column;
}
.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
  line-height: 1.2;
}
.brand-sub {
  font-size: 12px;
  color: #9ca3af;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

/* Item thường */
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  text-decoration: none;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.2s, color 0.2s;
  width: 100%;
}
.nav-item i {
  font-size: 17px;
  flex-shrink: 0;
}
.nav-item:hover {
  background-color: #f3f4f6;
}
.nav-item.router-link-active,
.nav-item.active {
  background-color: #eff6ff;
  color: #2563eb;
}

/* Toggle button (dropdown trigger) */
.nav-toggle {
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}
.nav-toggle span {
  flex: 1;
}

/* Chevron xoay */
.chevron {
  font-size: 12px !important;
  margin-left: auto;
  transition: transform 0.25s;
  color: #9ca3af;
}
.chevron.rotated {
  transform: rotate(180deg);
}

/* Submenu */
.nav-group {
  display: flex;
  flex-direction: column;
}
.nav-submenu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding-left: 16px;
}
.nav-submenu.open {
  max-height: 300px;
}

.nav-subitem {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  text-decoration: none;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  border-left: 2px solid #e5e7eb;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}
.nav-subitem i {
  font-size: 14px;
  flex-shrink: 0;
}
.nav-subitem:hover {
  background-color: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}
.nav-subitem.router-link-active {
  color: #2563eb;
  background-color: #eff6ff;
  border-color: #2563eb;
}

.sidebar-footer {
  padding: 20px 16px;
  border-top: 1px solid #e5e7eb;
}
.logout {
  color: #ef4444;
}
.logout:hover {
  background-color: #fef2f2;
  color: #dc2626;
}
.sidebar-nav {
  overflow-x: hidden;
}
</style>