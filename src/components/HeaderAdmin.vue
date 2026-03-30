<script setup>
import { useAuth } from "@/stores/auth";

const authStore = useAuth();
</script>
<template>
  <header class="topbar">
    <h1 class="page-title-main">Trang Quản Trị</h1>
    <div class="topbar-actions">
      <div class="user-info">
        <div class="user-details">
          <span class="user-name">
            {{ authStore.user?.name }}
          </span>

          <span class="user-role">
            {{ authStore.user?.role }}
          </span>
        </div>
        <img
            v-if="authStore.user.avatar"
            :src="authStore.user.avatar"
            class="user-avatar"
          />
      </div>
    </div>
  </header>
</template>
<style scoped>
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.topbar {
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  flex-shrink: 0;
}
.page-title-main {
  font-size: 18px;
  font-weight: 700;
}
.topbar-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.search-container {
  position: relative;
}
.search-input {
  width: 280px;
  padding: 10px 16px 10px 40px;
  background-color: #f3f4f6;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: background-color 0.2s;
}
.search-input:focus {
  background-color: #ffffff;
  box-shadow: 0 0 0 1px #e5e7eb;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9ca3af;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #4b5563;
  display: flex;
  align-items: center;
}
.icon-btn:hover {
  color: #111827;
}
.icon-btn svg {
  width: 20px;
  height: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 24px;
  border-left: 1px solid #e5e7eb;
}
.user-details {
  display: flex;
  flex-direction: column;
  text-align: right;
}
.user-name {
  font-size: 14px;
  font-weight: 600;
}
.user-role {
  font-size: 12px;
  color: #9ca3af;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
</style>