<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="logo-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M5.636 5.636a9 9 0 0112.728 0M12 2v20M2 12h20M5.636 18.364a9 9 0 0112.728 0"></path>
          </svg>
        </div>
        <div class="logo-text">
          <span class="brand-name">SportGear</span>
          <span class="brand-sub">Hệ thống Quản trị</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a href="#" class="nav-item">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Trang chủ
        </a>
        <a href="#" class="nav-item">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          Tổng quan
        </a>
        <a href="#" class="nav-item active">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          Quản lý Sản phẩm
        </a>
        <a href="#" class="nav-item">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
          Danh mục
        </a>
        <a href="#" class="nav-item">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          Đơn hàng
        </a>
        <a href="#" class="nav-item">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Người dùng
        </a>
        <a href="#" class="nav-item">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
          Mã giảm giá
        </a>
        <a href="#" class="nav-item">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          Biến thể
        </a>
      </nav>

      <div class="sidebar-footer">
        <a href="#" class="nav-item">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Đăng xuất
        </a>
      </div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <h1 class="page-title-main">Thêm Sản Phẩm</h1>
        <div class="topbar-actions">
          <div class="search-container">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Tìm kiếm dữ liệu..." class="search-input" />
          </div>
          <button class="icon-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </button>
          <button class="icon-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </button>
          <div class="user-info">
            <div class="user-details">
              <span class="user-name">Nguyễn Văn A</span>
              <span class="user-role">Quản trị viên</span>
            </div>
            <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" class="user-avatar" />
          </div>
        </div>
      </header>

      <div class="page-content">
        
        <nav class="breadcrumb">
          <a href="#" class="breadcrumb-link">Quản lý Sản phẩm</a>
          <svg class="breadcrumb-separator" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          <span class="breadcrumb-current">Thêm sản phẩm mới</span>
        </nav>

        <div class="content-header">
          <div class="content-titles">
            <h2>Thêm sản phẩm mới</h2>
            <p>Vui lòng nhập đầy đủ thông tin chi tiết cho sản phẩm mới vào kho</p>
          </div>
          <div class="header-buttons">
            <button class="btn-secondary">Hủy</button>
            <button class="btn-primary">Lưu sản phẩm</button>
          </div>
        </div>

        <div class="form-grid">
          
          <div class="form-col-left">
            <div class="card">
              <h3 class="card-title">Thông tin chung</h3>
              
              <div class="form-group">
                <label>Tên sản phẩm *</label>
                <input type="text" class="form-control" placeholder="Ví dụ: Giày đá bóng Nike Mercurial Elite" v-model="form.name" />
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label>Danh mục</label>
                  <div class="select-wrapper">
                    <select class="form-control" v-model="form.category">
                      <option value="giay_the_thao">Giày Thể Thao</option>
                      <option value="quan_ao">Quần Áo</option>
                      <option value="phu_kien">Phụ Kiện</option>
                    </select>
                    <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                <div class="form-group">
                  <label>Thương hiệu</label>
                  <input type="text" class="form-control" placeholder="Nike, Adidas..." v-model="form.brand" />
                </div>
              </div>

              <div class="form-group">
                <label>Mô tả sản phẩm</label>
                <textarea class="form-control textarea" rows="5" placeholder="Mô tả chi tiết về chất liệu, công nghệ, ưu điểm..." v-model="form.description"></textarea>
              </div>
            </div>

            <div class="card">
              <h3 class="card-title">Giá & Kho hàng</h3>
              
              <div class="form-row-2">
                <div class="form-group">
                  <label>Giá bán (VNĐ) *</label>
                  <div class="input-with-suffix">
                    <input type="number" class="form-control" placeholder="0" v-model="form.price" />
                    <span class="suffix">đ</span>
                  </div>
                </div>
                <div class="form-group">
                  <label>Số lượng trong kho *</label>
                  <input type="number" class="form-control" placeholder="100" v-model="form.stock" />
                </div>
              </div>
            </div>
          </div>

          <div class="form-col-right">
            <div class="card">
              <h3 class="card-title">Hình ảnh sản phẩm</h3>
              
              <div class="upload-zone">
                <div class="upload-icon-wrapper">
                  <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </div>
                <div class="upload-text">Click để tải lên hoặc<br>kéo thả</div>
                <div class="upload-hint">PNG, JPG (Tối đa 5MB)</div>
              </div>

              <div class="thumbnail-list">
                <div class="thumbnail-item has-image">
                  <img src="https://via.placeholder.com/64/ff3333/ffffff?text=Giày" alt="Product Image 1" />
                </div>
                <div class="thumbnail-item placeholder">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <div class="thumbnail-item placeholder">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
              </div>
            </div>

            <div class="card">
              <h3 class="card-title">Trạng thái</h3>
              
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" name="status" value="active" v-model="form.status" class="radio-input" />
                  <span class="radio-custom"></span>
                  Đang kinh doanh
                </label>
                
                <label class="radio-label">
                  <input type="radio" name="status" value="paused" v-model="form.status" class="radio-input" />
                  <span class="radio-custom"></span>
                  Tạm ngưng
                </label>
                
                <label class="radio-label">
                  <input type="radio" name="status" value="incoming" v-model="form.status" class="radio-input" />
                  <span class="radio-custom"></span>
                  Sắp về
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

// Khởi tạo state cho form
const form = reactive({
  name: '',
  category: 'giay_the_thao',
  brand: '',
  description: '',
  price: null,
  stock: null,
  status: 'active' // Mặc định chọn "Đang kinh doanh" giống ảnh
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* --- Reset & Global --- */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.admin-layout {
  display: flex;
  height: 100vh;
  font-family: 'Inter', sans-serif;
  background-color: #f8f9fa;
  color: #111827;
}

/* --- Sidebar (Tái sử dụng) --- */
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

.logo-icon { width: 20px; height: 20px; color: #ffffff; }

.logo-text { display: flex; flex-direction: column; }
.brand-name { font-size: 18px; font-weight: 700; color: #2563eb; line-height: 1.2; }
.brand-sub { font-size: 12px; color: #9ca3af; }

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

.nav-item:hover { background-color: #f3f4f6; }
.nav-item.active { background-color: #eff6ff; color: #2563eb; }
.nav-icon { width: 20px; height: 20px; }

.sidebar-footer {
  padding: 20px 16px;
  border-top: 1px solid #e5e7eb;
}

/* --- Main Content --- */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* --- Topbar --- */
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

.page-title-main { font-size: 18px; font-weight: 700; }

.topbar-actions { display: flex; align-items: center; gap: 24px; }

.search-container { position: relative; }
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
.search-input:focus { background-color: #ffffff; box-shadow: 0 0 0 1px #e5e7eb; }

.search-icon {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  width: 18px; height: 18px; color: #9ca3af;
}

.icon-btn {
  background: none; border: none; cursor: pointer; color: #4b5563;
  display: flex; align-items: center;
}
.icon-btn:hover { color: #111827; }
.icon-btn svg { width: 20px; height: 20px; }

.user-info { display: flex; align-items: center; gap: 12px; padding-left: 24px; border-left: 1px solid #e5e7eb; }
.user-details { display: flex; flex-direction: column; text-align: right; }
.user-name { font-size: 14px; font-weight: 600; }
.user-role { font-size: 12px; color: #9ca3af; }
.user-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }

/* --- Page Content (Thêm sản phẩm) --- */
.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

/* Breadcrumbs */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 24px;
}
.breadcrumb-link { color: #6b7280; text-decoration: none; font-weight: 500; transition: color 0.2s; }
.breadcrumb-link:hover { color: #111827; }
.breadcrumb-separator { width: 14px; height: 14px; color: #9ca3af; }
.breadcrumb-current { color: #111827; font-weight: 600; }

/* Header & Buttons */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}
.content-titles h2 { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
.content-titles p { font-size: 14px; color: #6b7280; }

.header-buttons {
  display: flex;
  gap: 12px;
}
.btn-secondary {
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary:hover { background-color: #f9fafb; border-color: #9ca3af; }

.btn-primary {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-primary:hover { background-color: #1d4ed8; }

/* --- Layout Grid --- */
.form-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .form-grid { grid-template-columns: 1fr; }
}

/* --- Cards --- */
.card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}
.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 20px;
}

/* --- Form Controls --- */
.form-group {
  margin-bottom: 20px;
}
.form-group:last-child {
  margin-bottom: 0;
}
.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.form-control {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  color: #111827;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-control::placeholder { color: #9ca3af; }
.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.textarea { resize: vertical; min-height: 120px; }

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Select Box */
.select-wrapper { position: relative; }
.select-wrapper select {
  appearance: none;
  cursor: pointer;
}
.select-wrapper .dropdown-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #6b7280;
  pointer-events: none;
}

/* Input with Suffix (e.g., VNĐ) */
.input-with-suffix { position: relative; }
.input-with-suffix .suffix {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 14px;
  font-weight: 500;
  pointer-events: none;
}

/* --- Upload Zone --- */
.upload-zone {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #fafbfc;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.2s;
}
.upload-zone:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.upload-icon-wrapper {
  width: 40px;
  height: 40px;
  background-color: #eff6ff;
  color: #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.upload-icon { width: 24px; height: 24px; }
.upload-text {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  margin-bottom: 4px;
}
.upload-hint {
  font-size: 12px;
  color: #9ca3af;
}

/* Thumbnails */
.thumbnail-list {
  display: flex;
  gap: 12px;
}
.thumbnail-item {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.thumbnail-item.has-image {
  border: 1px solid #e5e7eb;
}
.thumbnail-item.has-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #f9fafb;
}
.thumbnail-item.placeholder {
  background-color: #f9fafb;
  border: 1px dashed #d1d5db;
  color: #9ca3af;
  cursor: pointer;
  transition: border-color 0.2s;
}
.thumbnail-item.placeholder:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}
.thumbnail-item.placeholder svg {
  width: 20px;
  height: 20px;
}

/* --- Radio Custom --- */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.radio-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}

/* Ẩn input radio gốc */
.radio-input {
  display: none;
}

/* Tạo nút radio giả mạo */
.radio-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  margin-right: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  position: relative;
}

/* Trạng thái được chọn */
.radio-input:checked + .radio-custom {
  border-color: #2563eb;
  background-color: #2563eb;
}

/* Dấu chấm trắng bên trong khi được chọn */
.radio-input:checked + .radio-custom::after {
  content: '';
  width: 6px;
  height: 6px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
}
</style>