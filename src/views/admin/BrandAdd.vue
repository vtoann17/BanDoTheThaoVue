<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-text">
          <span class="brand-name">Brand Manager</span>
          <span class="brand-desc">Administrator</span>
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
      </nav>

      <div class="sidebar-bottom">
        <a href="#" class="nav-link text-danger">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Đăng xuất
        </a>
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
          
          <div class="user-profile">
            <div class="user-info">
              <span class="user-name">Nguyễn Văn A</span>
              <span class="user-role">ADMIN</span>
            </div>
            <img src="https://i.pravatar.cc/150?img=11" alt="Admin" class="user-avatar" />
          </div>
        </div>
      </header>

      <div class="content-body">
        
        <div class="breadcrumb">
          <a href="#" class="crumb-link">Trang chủ</a>
          <span class="separator">›</span>
          <a href="#" class="crumb-link">Thương hiệu</a>
          <span class="separator">›</span>
          <span class="current">Thêm thương hiệu mới</span>
        </div>

        <div class="page-header">
          <h1 class="page-title">Thêm thương hiệu mới</h1>
          <p class="page-subtitle">Tạo thương hiệu sản phẩm mới cho cửa hàng SportGear</p>
        </div>

        <div class="form-container">
          
          <div class="main-info-card">
            <div class="form-group">
              <label class="form-label">Tên thương hiệu</label>
              <input type="text" class="form-input" placeholder="VD: Nike, Adidas, Puma..." />
            </div>

            <div class="form-group">
              <label class="form-label">Đường dẫn (Slug)</label>
              <div class="input-with-prefix">
                <span class="prefix-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                </span>
                <input type="text" class="form-input has-prefix" placeholder="nike-sportswear" />
              </div>
              <p class="input-help">Đường dẫn tự động tạo từ tên hoặc nhập thủ công.</p>
            </div>

            <div class="form-group">
              <label class="form-label">Mô tả thương hiệu</label>
              <textarea class="form-textarea" placeholder="Nhập thông tin giới thiệu về thương hiệu này..."></textarea>
            </div>
          </div>

          <div class="side-info-card">
            <label class="form-label">Logo thương hiệu</label>
            
            <div class="upload-zone">
              <div class="upload-icon-circle">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              </div>
              <p class="upload-title">Tải ảnh lên</p>
              <p class="upload-desc">Định dạng PNG, JPG hoặc SVG.<br>Tối đa 2MB.</p>
            </div>

            <div class="file-preview-empty">
              <div class="preview-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <div class="preview-text">
                <span class="text-main">Chưa có tệp chọn</span>
                <span class="text-sub">Không có file</span>
              </div>
            </div>
          </div>

        </div>

        <div class="form-actions">
          <button class="btn-cancel">Hủy</button>
          <button class="btn-primary">Lưu thương hiệu</button>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.admin-layout {
  font-family: 'Inter', sans-serif;
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  color: #111827;
}

/* --- SIDEBAR --- */
.sidebar { width: 260px; background-color: #ffffff; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
.brand { height: 72px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid #f3f4f6; }
.brand-text { display: flex; flex-direction: column; }
.brand-name { font-size: 18px; font-weight: 400; color: #6b7280; letter-spacing: -0.5px; }
.brand-desc { font-size: 11px; color: #9ca3af; font-weight: 500; letter-spacing: 0.05em; }

.nav-menu { flex: 1; padding: 24px 0; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
.nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #4b5563; font-size: 14px; font-weight: 500; text-decoration: none; transition: all 0.2s; border-left: 3px solid transparent; }
.nav-link:hover { background-color: #f9fafb; color: #111827; }

/* Trạng thái Active có viền trái */
.nav-link.active-border { background-color: #eff6ff; color: #1a73e8; font-weight: 600; border-left: 3px solid #1a73e8; }
.nav-icon { width: 20px; height: 20px; }
.nav-divider { height: 1px; background-color: #e5e7eb; margin: 8px 24px; }

.sidebar-bottom { padding: 16px 24px; border-top: 1px solid #f3f4f6; }
.text-danger { display: flex; align-items: center; gap: 12px; color: #ef4444; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
.text-danger:hover { color: #dc2626; }

/* --- MAIN CONTENT --- */
.main-content { flex: 1; margin-left: 260px; display: flex; flex-direction: column; }

/* Header Top */
.header { height: 72px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 90; }
.header-left { flex: 1; }
.search-box-top { position: relative; width: 360px; }
.search-input-top { width: 100%; padding: 10px 16px 10px 40px; border: none; border-radius: 8px; background-color: #f3f4f6; font-size: 14px; outline: none; transition: all 0.2s; color: #4b5563; }
.search-input-top:focus { background-color: #e5e7eb; }
.search-icon-top { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #9ca3af; }

.header-right { display: flex; align-items: center; gap: 24px; }
.icon-btn { background: none; border: none; color: #6b7280; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: background-color 0.2s; }
.icon-btn:hover { background-color: #f3f4f6; color: #111827; }
.icon-btn svg { width: 22px; height: 22px; }

.user-profile { display: flex; align-items: center; gap: 12px; padding-left: 24px; border-left: 1px solid #e5e7eb; }
.user-info { display: flex; flex-direction: column; text-align: right; }
.user-name { font-size: 14px; font-weight: 600; color: #111827; }
.user-role { font-size: 10px; font-weight: 700; color: #6b7280; letter-spacing: 0.05em; }
.user-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }

/* Content Body */
.content-body { padding: 32px 40px; display: flex; flex-direction: column; max-width: 1200px; }

/* Breadcrumb */
.breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; margin-bottom: 24px; }
.crumb-link { color: #6b7280; text-decoration: none; transition: color 0.2s; }
.crumb-link:hover { color: #1a73e8; }
.separator { color: #9ca3af; }
.current { color: #111827; font-weight: 600; }

/* Page Header */
.page-header { margin-bottom: 32px; }
.page-title { font-size: 28px; font-weight: 300; color: #111827; margin-bottom: 8px; letter-spacing: -0.5px; }
.page-subtitle { font-size: 14px; color: #9ca3af; }

/* Form Container */
.form-container { display: flex; gap: 24px; margin-bottom: 32px; align-items: stretch; }

/* Cột trái: Thông tin chính */
.main-info-card { flex: 2; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; display: flex; flex-direction: column; gap: 24px; }

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-label { font-size: 14px; font-weight: 500; color: #4b5563; }
.form-input { width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #111827; outline: none; transition: border-color 0.2s; }
.form-input::placeholder { color: #9ca3af; font-weight: 300; }
.form-input:focus { border-color: #1a73e8; }

.input-with-prefix { position: relative; width: 100%; }
.prefix-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #9ca3af; display: flex; align-items: center; }
.prefix-icon svg { width: 18px; height: 18px; }
.form-input.has-prefix { padding-left: 40px; }
.input-help { font-size: 12px; color: #9ca3af; margin-top: 4px; }

.form-textarea { width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #111827; outline: none; transition: border-color 0.2s; resize: vertical; min-height: 120px; font-family: inherit; }
.form-textarea::placeholder { color: #9ca3af; font-weight: 300; }
.form-textarea:focus { border-color: #1a73e8; }

/* Cột phải: Logo */
.side-info-card { flex: 1; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; display: flex; flex-direction: column; gap: 16px; }

.upload-zone { border: 2px dashed #e5e7eb; border-radius: 12px; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background-color: #fafbfc; cursor: pointer; transition: border-color 0.2s, background-color 0.2s; margin-bottom: 8px; }
.upload-zone:hover { border-color: #1a73e8; background-color: #eff6ff; }
.upload-icon-circle { width: 48px; height: 48px; background-color: #eff6ff; color: #1a73e8; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.upload-icon-circle svg { width: 24px; height: 24px; }
.upload-title { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 8px; }
.upload-desc { font-size: 12px; color: #9ca3af; line-height: 1.5; }

.file-preview-empty { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px; }
.preview-icon { width: 36px; height: 36px; background-color: #e5e7eb; color: #9ca3af; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.preview-icon svg { width: 20px; height: 20px; }
.preview-text { display: flex; flex-direction: column; }
.text-main { font-size: 13px; font-weight: 500; color: #6b7280; }
.text-sub { font-size: 11px; color: #9ca3af; }

/* Form Actions */
.form-actions { display: flex; justify-content: flex-end; gap: 16px; border-top: 1px solid #e5e7eb; padding-top: 24px; }
.btn-cancel { padding: 10px 24px; background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; font-weight: 600; color: #4b5563; cursor: pointer; transition: background-color 0.2s; }
.btn-cancel:hover { background-color: #f3f4f6; }
.btn-primary { padding: 10px 24px; background-color: #1a73e8; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; color: #ffffff; cursor: pointer; transition: background-color 0.2s; }
.btn-primary:hover { background-color: #1557b0; }

/* Responsive nhỏ hơn */
@media (max-width: 1024px) {
  .form-container { flex-direction: column; }
}
</style>