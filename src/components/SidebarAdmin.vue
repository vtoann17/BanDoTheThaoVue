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
        <span class="brand-name">SportGear</span>
        <span class="brand-sub">Hệ thống Quản trị</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/" class="nav-item">
        <i class="bi bi-house"></i>
        Trang chủ
      </router-link>

      <router-link to="/" class="nav-item">
        <i class="bi bi-speedometer2"></i>
        Tổng quan
      </router-link>

      <router-link to="/productadmin" class="nav-item">
        <i class="bi bi-box-seam"></i>
        Quản lý Sản phẩm
      </router-link>

      <router-link to="/categoryadmin" class="nav-item">
        <i class="bi bi-tags"></i>
        Danh mục
      </router-link>

      <router-link to="/order" class="nav-item">
        <i class="bi bi-cart"></i>
        Đơn hàng
      </router-link>

      <router-link to="/profile" class="nav-item">
        <i class="bi bi-people"></i>
        Người dùng
      </router-link>

      <router-link to="/" class="nav-item">
        <i class="bi bi-ticket-perforated"></i>
        Mã giảm giá
      </router-link>

      <router-link to="/" class="nav-item">
        <i class="bi bi-layers"></i>
        Biến thể
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <router-link to="/auth/logout" class="nav-item logout">
        <i class="bi bi-box-arrow-right"></i>
        Đăng xuất
      </router-link>
    </div>
  </aside>
</template>
<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-item i {
  font-size: 18px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-item i {
  font-size: 18px;
}
.logout {
  color: #ef4444;
}

.logout:hover {
  background-color: #fef2f2;
  color: #dc2626;
}
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
  color: #ffffff;
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
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  text-decoration: none;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.2s, color 0.2s;
}
.nav-item:hover {
  background-color: #f3f4f6;
}
.nav-item.active {
  background-color: #eff6ff;
  color: #2563eb;
}
.nav-icon {
  width: 20px;
  height: 20px;
}
.sidebar-footer {
  padding: 20px 16px;
  border-top: 1px solid #e5e7eb;
}
</style>