<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-text">
          <span class="brand-name">Sports Store</span>
          <span class="brand-desc">ADMIN PANEL</span>
        </div>
      </div>

      <nav class="nav-menu">
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          Dashboard
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          Sản phẩm
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
          Danh mục
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          Đơn hàng
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Người dùng
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
          Mã giảm giá
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          Biến thể
        </a>
        <a href="#" class="nav-link active-border">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
          Thương hiệu
        </a>
        <div class="nav-divider"></div>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Trang chủ
        </a>
        <a href="#" class="nav-link text-danger">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Đăng xuất
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile-sidebar">
          <img src="https://i.pravatar.cc/150?img=11" alt="Admin" class="user-avatar-small" />
          <div class="user-info-sidebar">
            <span class="user-name-sidebar">Nguyễn Văn A</span>
            <span class="user-role-sidebar">Administrator</span>
          </div>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <header class="header">
        <div class="header-left">
          <div class="search-box-top">
            <svg class="search-icon-top" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" class="search-input-top" placeholder="Tìm kiếm hệ thống..." />
          </div>
        </div>
        
        <div class="header-right">
          <button class="icon-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </button>
          <button class="icon-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </button>

          <div class="user-profile">
            <span class="user-name">Nguyễn Văn A</span>
            <img src="https://i.pravatar.cc/150?img=11" alt="Admin" class="user-avatar" />
          </div>
        </div>
      </header>

      <div class="content-body">
        
        <div class="page-header">
          <div>
            <h1 class="page-title">Quản lý Thương hiệu</h1>
            <p class="page-subtitle">Quản lý danh sách các thương hiệu sản phẩm trong hệ thống Sports Store.</p>
          </div>
          <button class="btn-primary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Thêm thương hiệu mới
          </button>
        </div>

        <div class="filter-bar">
          <div class="search-box">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" class="search-input" placeholder="Tìm kiếm thương hiệu..." />
          </div>

          <div class="filter-actions">
            <select class="status-select">
              <option>Trạng thái</option>
              <option>Hoạt động</option>
              <option>Ngừng bán</option>
            </select>
            <button class="btn-filter">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              Lọc dữ liệu
            </button>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>LOGO</th>
                <th>TÊN THƯƠNG HIỆU</th>
                <th>SLUG</th>
                <th>NGÀY TẠO</th>
                <th>TRẠNG THÁI</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(brand, index) in brands" :key="index">
                <td class="text-gray-500 font-medium">{{ brand.id }}</td>
                <td>
                  <div class="brand-logo-box">
                    <span class="logo-text">{{ brand.logoText }}</span>
                  </div>
                </td>
                <td>
                  <div class="brand-info">
                    <span class="brand-title">{{ brand.name }}</span>
                    <span class="brand-sub">{{ brand.desc }}</span>
                  </div>
                </td>
                <td class="text-gray-600">{{ brand.slug }}</td>
                <td class="text-gray-600">{{ brand.date }}</td>
                <td>
                  <span :class="['status-pill', brand.statusClass]">{{ brand.status }}</span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn edit-btn" title="Chỉnh sửa">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button class="action-btn delete-btn" title="Xóa">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="pagination-footer">
            <span class="pagination-info">Hiển thị <strong>1 đến 5</strong> của <strong>12</strong> thương hiệu</span>
            <div class="pagination-controls">
              <button class="page-btn"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
              <button class="page-btn active">1</button>
              <button class="page-btn">2</button>
              <button class="page-btn">3</button>
              <button class="page-btn"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Mock data cho Bảng thương hiệu
const brands = ref([
  { 
    id: '#BR-8821', logoText: 'N', name: 'Nike', desc: 'Global Sports Brand', 
    slug: 'nike-global', date: '20/05/2023', 
    status: 'Hoạt động', statusClass: 'status-active' 
  },
  { 
    id: '#BR-8822', logoText: 'A', name: 'Adidas', desc: 'Three Stripes', 
    slug: 'adidas-original', date: '15/06/2023', 
    status: 'Hoạt động', statusClass: 'status-active' 
  },
  { 
    id: '#BR-8823', logoText: 'P', name: 'Puma', desc: 'Fast Sports', 
    slug: 'puma-racing', date: '02/08/2023', 
    status: 'Ngừng bán', statusClass: 'status-inactive' 
  },
  { 
    id: '#BR-8824', logoText: 'UA', name: 'Under Armour', desc: 'Performance Wear', 
    slug: 'under-armour', date: '12/10/2023', 
    status: 'Hoạt động', statusClass: 'status-active' 
  },
  { 
    id: '#BR-8825', logoText: 'NB', name: 'New Balance', desc: 'Lifestyle & Running', 
    slug: 'new-balance-nb', date: '05/01/2024', 
    status: 'Hoạt động', statusClass: 'status-active' 
  }
]);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.admin-layout {
  font-family: 'Inter', sans-serif;
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc; /* Nền xám rất nhạt */
  color: #111827;
}

/* --- SIDEBAR --- */
.sidebar { width: 260px; background-color: #ffffff; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
.brand { height: 72px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid #f3f4f6; }
.brand-text { display: flex; flex-direction: column; }
.brand-name { font-size: 20px; font-weight: 800; color: #1a73e8; letter-spacing: -0.5px; }
.brand-desc { font-size: 10px; color: #6b7280; font-weight: 600; letter-spacing: 0.1em; margin-top: -2px; }

.nav-menu { flex: 1; padding: 24px 0; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
.nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #4b5563; font-size: 14px; font-weight: 500; text-decoration: none; transition: all 0.2s; border-left: 3px solid transparent; }
.nav-link:hover { background-color: #f9fafb; color: #111827; }

/* Trạng thái Active mới có viền trái */
.nav-link.active-border { background-color: #eff6ff; color: #1a73e8; font-weight: 600; border-left: 3px solid #1a73e8; }
.nav-icon { width: 20px; height: 20px; }

.nav-divider { height: 1px; background-color: #e5e7eb; margin: 8px 24px; }
.text-danger { color: #ef4444; }
.text-danger:hover { background-color: #fef2f2; color: #dc2626; }

.sidebar-footer { padding: 16px 24px; border-top: 1px solid #f3f4f6; }
.user-profile-sidebar { display: flex; align-items: center; gap: 12px; }
.user-avatar-small { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
.user-info-sidebar { display: flex; flex-direction: column; }
.user-name-sidebar { font-size: 14px; font-weight: 600; color: #111827; }
.user-role-sidebar { font-size: 12px; color: #6b7280; }

/* --- MAIN CONTENT --- */
.main-content { flex: 1; margin-left: 260px; display: flex; flex-direction: column; }

/* Header Top */
.header { height: 72px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 90; }
.header-left { flex: 1; }
.search-box-top { position: relative; width: 320px; }
.search-input-top { width: 100%; padding: 10px 16px 10px 40px; border: none; border-radius: 8px; background-color: #f3f4f6; font-size: 14px; outline: none; transition: all 0.2s; color: #4b5563; }
.search-input-top:focus { background-color: #e5e7eb; }
.search-icon-top { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #9ca3af; }

.header-right { display: flex; align-items: center; gap: 20px; }
.icon-btn { background: none; border: none; color: #6b7280; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: background-color 0.2s; }
.icon-btn:hover { background-color: #f3f4f6; color: #111827; }
.icon-btn svg { width: 22px; height: 22px; }
.user-profile { display: flex; align-items: center; gap: 12px; padding-left: 20px; border-left: 1px solid #e5e7eb; }
.user-name { font-size: 14px; font-weight: 600; color: #111827; }
.user-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }

/* Content Body */
.content-body { padding: 32px; display: flex; flex-direction: column; gap: 24px; max-width: 1200px; }

/* Page Header */
.page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 8px; }
.page-title { font-size: 26px; font-weight: 800; color: #111827; margin-bottom: 8px; letter-spacing: -0.5px; }
.page-subtitle { font-size: 14px; color: #6b7280; }

.btn-primary { display: flex; align-items: center; gap: 8px; background-color: #1a73e8; color: #ffffff; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; box-shadow: 0 4px 6px -1px rgba(26, 115, 232, 0.2); }
.btn-primary:hover { background-color: #1557b0; }
.btn-primary svg { width: 18px; height: 18px; }

/* Filter Bar */
.filter-bar { display: flex; gap: 16px; align-items: center; padding: 20px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; }
.search-box { position: relative; flex: 1; max-width: 450px; }
.search-input { width: 100%; padding: 10px 16px 10px 40px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; background-color: #f9fafb; transition: all 0.2s; }
.search-input:focus { border-color: #1a73e8; background-color: #ffffff; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #9ca3af; }

.filter-actions { display: flex; gap: 12px; margin-left: auto; }
.status-select { padding: 10px 36px 10px 16px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; color: #4b5563; background-color: #f9fafb; outline: none; cursor: pointer; appearance: none; background-image: url('data:image/svg+xml;utf8,<svg fill="none" stroke="%239ca3af" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>'); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px; }
.btn-filter { display: flex; align-items: center; gap: 8px; background-color: #e2e8f0; color: #475569; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; }
.btn-filter:hover { background-color: #cbd5e1; }
.btn-filter svg { width: 18px; height: 18px; }

/* Data Table */
.table-container { background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; }
.data-table th { padding: 16px 24px; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb; background-color: #ffffff; }
.data-table td { padding: 16px 24px; font-size: 14px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
.data-table tbody tr:hover { background-color: #f9fafb; }

.text-gray-500 { color: #6b7280; }
.text-gray-600 { color: #4b5563; }
.font-medium { font-weight: 500; }

.brand-logo-box { width: 44px; height: 44px; background-color: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid #e5e7eb; }
.logo-text { font-size: 18px; font-weight: 800; color: #9ca3af; letter-spacing: -1px; }

.brand-info { display: flex; flex-direction: column; gap: 2px; }
.brand-title { font-weight: 700; color: #111827; font-size: 15px; }
.brand-sub { font-size: 12px; color: #6b7280; }

/* Status Pills */
.status-pill { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; }
.status-active { background-color: #dcfce7; color: #166534; }
.status-inactive { background-color: #f1f5f9; color: #475569; }

/* Actions */
.action-buttons { display: flex; gap: 12px; }
.action-btn { background: none; border: none; cursor: pointer; transition: color 0.2s; display: flex; align-items: center; justify-content: center; }
.edit-btn { color: #3b82f6; }
.edit-btn:hover { color: #2563eb; }
.delete-btn { color: #ef4444; }
.delete-btn:hover { color: #dc2626; }
.action-btn svg { width: 18px; height: 18px; }

/* Pagination */
.pagination-footer { padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; background-color: #ffffff; }
.pagination-info { font-size: 14px; color: #6b7280; }
.pagination-info strong { color: #111827; }
.pagination-controls { display: flex; align-items: center; gap: 6px; }
.page-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 13px; font-weight: 600; color: #4b5563; cursor: pointer; transition: all 0.2s; }
.page-btn:hover:not(.active) { background-color: #f3f4f6; }
.page-btn.active { background-color: #1a73e8; color: #ffffff; border-color: #1a73e8; }
.page-btn svg { width: 16px; height: 16px; }

</style>