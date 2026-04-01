<template>
  <header class="header">
    <div class="header-container">
      <div class="brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M5.636 5.636a9 9 0 0112.728 0M12 2v20M2 12h20M5.636 18.364a9 9 0 0112.728 0"></path>
          </svg>
        </div>
        <span class="brand-name">THBA</span>
      </div>

      <div class="search-box">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input type="text" class="search-input" placeholder="Tìm kiếm dụng cụ thể thao..." />
      </div>

      <div class="header-actions">
        <button class="cart-btn">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span class="cart-badge">{{ cartCount }}</span>
        </button>

        <div class="user-menu">
          <div class="user-text">
            <span class="user-name">{{ user.name }}</span>
            <span class="user-tier">{{ user.tier }}</span>
          </div>
          <img :src="user.avatar" :alt="user.name" class="user-avatar" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuth } from '@/stores/auth';

defineProps({
  cartCount: {
    type: Number,
    default: 0,
  },
});

const { user } = useAuth();
</script>

<style scoped>
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
.brand-icon svg { width: 22px; height: 22px; }

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
  font-family: inherit;
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
.cart-btn svg { width: 24px; height: 24px; }
.cart-btn:hover { color: #111827; }

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

.user-name { font-size: 14px; font-weight: 600; color: #111827; }
.user-tier { font-size: 12px; color: #9ca3af; }
.user-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
</style>