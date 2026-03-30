<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "@/stores/auth";

const authStore = useAuth();
const showDropdown = ref(false);

onMounted(() => {
  authStore.getUser();
});

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};
</script>
<template>
  <nav class="navbar">
    <div class="nav-logo">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      </svg>
      THBA
    </div>

    <div class="nav-links">
      <a href="product">Sản phẩm</a>
      <a href="#">Môn thể thao</a>
      <a href="#">Hàng mới về</a>
      <a href="#" class="sale">Giảm giá</a>
    </div>

    <div class="nav-right">
      <div class="search-box">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9CA3AF"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span>Tìm kiếm thiết bị...</span>
      </div>
      <button class="icon-btn">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#374151"
          stroke-width="2"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <span class="badge">2</span>
      </button>
      <div class="user-menu" v-if="authStore.user">
        <div class="user-btn" @click="toggleDropdown">
          <!-- Avatar -->
          <img
            v-if="authStore.user.avatar"
            :src="authStore.user.avatar"
            class="avatar"
          />

          <!-- Fallback chữ cái -->
          <div v-else class="avatar-fallback">
            {{ authStore.user.name.charAt(0).toUpperCase() }}
          </div>

          <!-- Name -->
          <span class="username">{{ authStore.user.name }}</span>
        </div>

        <div v-if="showDropdown" class="dropdown">
          <template v-if="authStore.user.role === 'admin'">
            <a href="/dashboar">Quản lý</a>
            <a href="#" class="logout" @click="$router.push('/auth/logout')">Đăng xuất</a>
          </template>

          <template v-else>
            <a href="/profile">Thông tin</a>
            <a href="#" class="logout" @click="$router.push('/auth/logout')">Đăng xuất</a>
          </template>
        </div>
      </div>

      <!-- chưa login -->
      <div v-else>
        <a href="/auth/login">Đăng nhập</a>
      </div>
    </div>
  </nav>
</template>
<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 48px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 200;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 17px;
  color: #1565c0;
}

.nav-links {
  display: flex;
  gap: 32px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}
.nav-links a:hover {
  color: #1565c0;
}
.nav-links .sale {
  color: #ff6d00;
  font-weight: 600;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  color: #9ca3af;
  width: 210px;
}

.icon-btn {
  position: relative;
  background: none;
  border: none;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #1565c0;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 8px;
  transition: background 0.2s;
}

.user-btn:hover {
  background: #F3F4F6;
}

/* avatar ảnh */
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

/* fallback chữ */
.avatar-fallback {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1565C0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* tên */
.username {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

/* dropdown */
.dropdown {
  position: absolute;
  top: 120%;
  left: 0; /* đổi từ right -> left */
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  min-width: 180px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
  overflow: hidden;
  padding: 6px 0;
}

.dropdown a {
  display: block;
  padding: 10px 14px;
  font-size: 13px;
  color: #374151;
  transition: background 0.2s;
}

.dropdown a:hover {
  background: #F3F4F6;
}
.logout {
  color: #DC2626;
  font-weight: 500;
}

.logout:hover {
  background: #FEF2F2;
}
</style>