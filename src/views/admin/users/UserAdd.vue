<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-name">SportGear</span>
        </div>
      </div>

      <nav class="nav-menu">
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          Bảng điều khiển
        </a>
        <a href="#" class="nav-link active">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Quản lý người dùng
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          Quản lý sản phẩm
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          Đơn hàng
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Cài đặt
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile-sidebar">
          <img src="https://i.pravatar.cc/150?img=11" alt="Admin" class="user-avatar-small" />
          <div class="user-info-sidebar">
            <span class="user-name-sidebar">Nguyễn Văn A</span>
            <span class="user-role-sidebar">Quản trị viên</span>
          </div>
        </div>
        <a href="#" class="nav-link text-danger logout-link">
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
          <button class="icon-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </button>

          <div class="header-user-text">
            <span class="user-name">Nguyễn Văn A</span>
          </div>
        </div>
      </header>

      <div class="content-body">
        
        <div class="breadcrumb">
          <span>Trang chủ</span>
          <span class="separator">›</span>
          <span>Quản lý người dùng</span>
          <span class="separator">›</span>
          <span class="current">Thêm người dùng mới</span>
        </div>

        <div class="page-header">
          <h1 class="page-title">Thêm người dùng mới</h1>
          <p class="page-subtitle">Tạo tài khoản mới cho nhân viên hoặc khách hàng trong hệ thống.</p>
        </div>

        <div class="form-card">
          
          <div class="avatar-section">
            <div class="avatar-upload-box">
              <div class="avatar-placeholder">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span>CHƯA CÓ ẢNH</span>
              </div>
              <button class="btn-camera">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </button>
            </div>
            <h4 class="avatar-title">Ảnh đại diện</h4>
            <p class="avatar-desc">ĐỊNH DẠNG JPG, PNG. TỐI ĐA 2MB.</p>
          </div>

          <div class="form-section">
            <div class="form-grid">
              
              <div class="form-group">
                <label class="form-label">Tên người dùng <span class="required">*</span></label>
                <input type="text" class="form-input" placeholder="Nhập họ và tên" />
              </div>

              <div class="form-group">
                <label class="form-label">Email <span class="required">*</span></label>
                <input type="email" class="form-input" placeholder="example@sportgear.com" />
              </div>

              <div class="form-group">
                <label class="form-label">Mật khẩu <span class="required">*</span></label>
                <div class="input-with-icon">
                  <input type="password" class="form-input" placeholder="••••••••" />
                  <button class="btn-eye">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Số điện thoại</label>
                <input type="text" class="form-input" placeholder="0901 234 567" />
              </div>

              <div class="form-group span-2">
                <label class="form-label">Vai trò <span class="required">*</span></label>
                <select class="form-select">
                  <option>Khách hàng</option>
                  <option>Nhân viên</option>
                  <option>Quản trị viên</option>
                </select>
              </div>

              <div class="form-group span-2 flex-address-row">
                <div class="address-input-wrapper">
                  <label class="form-label">Địa chỉ</label>
                  <input type="text" class="form-input" placeholder="Nhập địa chỉ chi tiết..." />
                </div>
                
                <div class="form-actions">
                  <button class="btn-cancel">Hủy</button>
                  <button class="btn-save">Lưu người dùng</button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.admin-layout {
  font-family: 'Inter', sans-serif;
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb; /* Nền xám nhạt */
  color: #111827;
}

/* --- SIDEBAR --- */
.sidebar { width: 260px; background-color: #ffffff; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
.brand { height: 72px; display: flex; align-items: center; gap: 12px; padding: 0 24px; border-bottom: 1px solid #f3f4f6; }
.brand-icon { width: 28px; height: 28px; background-color: #1a73e8; color: #fff; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.brand-icon svg { width: 18px; height: 18px; }
.brand-name { font-size: 18px; font-weight: 700; color: #111827; }

.nav-menu { flex: 1; padding: 24px 16px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; }
.nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 16px; color: #4b5563; font-size: 14px; font-weight: 500; border-radius: 8px; text-decoration: none; transition: all 0.2s; }
.nav-link:hover { background-color: #f3f4f6; color: #111827; }
.nav-link.active { background-color: #eff6ff; color: #1a73e8; font-weight: 600; }
.nav-icon { width: 20px; height: 20px; }

.sidebar-footer { padding: 16px; border-top: 1px solid #f3f4f6; display: flex; flex-direction: column; gap: 16px; }
.user-profile-sidebar { display: flex; align-items: center; gap: 12px; }
.user-avatar-small { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
.user-info-sidebar { display: flex; flex-direction: column; }
.user-name-sidebar { font-size: 14px; font-weight: 600; color: #111827; }
.user-role-sidebar { font-size: 12px; color: #6b7280; }
.logout-link { padding: 8px 0; }
.text-danger { color: #ef4444; }
.text-danger:hover { background-color: transparent; color: #dc2626; }

/* --- MAIN CONTENT --- */
.main-content { flex: 1; margin-left: 260px; display: flex; flex-direction: column; }

/* Header Top */
.header { height: 72px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 90; }
.header-left { flex: 1; }
.search-box-top { position: relative; width: 360px; }
.search-input-top { width: 100%; padding: 10px 16px 10px 40px; border: none; border-radius: 8px; background-color: #f3f4f6; font-size: 14px; outline: none; transition: all 0.2s; color: #4b5563; }
.search-input-top:focus { background-color: #e5e7eb; }
.search-icon-top { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #9ca3af; }

.header-right { display: flex; align-items: center; gap: 20px; }
.icon-btn { background: none; border: none; color: #6b7280; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: background-color 0.2s; }
.icon-btn:hover { background-color: #f3f4f6; color: #111827; }
.icon-btn svg { width: 22px; height: 22px; }
.header-user-text { padding-left: 20px; border-left: 1px solid #e5e7eb; }
.user-name { font-size: 14px; font-weight: 600; color: #111827; }

/* Content Body */
.content-body { padding: 32px 40px; display: flex; flex-direction: column; max-width: 1200px; }

/* Breadcrumb */
.breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #6b7280; font-weight: 500; margin-bottom: 24px; }
.separator { color: #9ca3af; }
.current { color: #111827; font-weight: 600; }

/* Page Header */
.page-header { margin-bottom: 32px; }
.page-title { font-size: 28px; font-weight: 700; color: #111827; margin-bottom: 8px; }
.page-subtitle { font-size: 15px; color: #6b7280; }

/* Form Card */
.form-card { background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 40px; display: flex; gap: 60px; }

/* Avatar Section (Left) */
.avatar-section { width: 200px; display: flex; flex-direction: column; align-items: center; flex-shrink: 0; margin-top: 10px; }
.avatar-upload-box { position: relative; margin-bottom: 20px; }
.avatar-placeholder { width: 140px; height: 140px; border: 2px dashed #d1d5db; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9ca3af; background-color: #f9fafb; gap: 8px; }
.avatar-placeholder svg { width: 32px; height: 32px; }
.avatar-placeholder span { font-size: 11px; font-weight: 700; letter-spacing: 0.05em; }

.btn-camera { position: absolute; bottom: 0; right: 0; width: 36px; height: 36px; border-radius: 50%; background-color: #1a73e8; color: #ffffff; border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.2s; }
.btn-camera:hover { background-color: #1557b0; }
.btn-camera svg { width: 16px; height: 16px; }

.avatar-title { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 4px; }
.avatar-desc { font-size: 10px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; text-align: center; }

/* Form Section (Right) */
.form-section { flex: 1; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.span-2 { grid-column: span 2; }

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-label { font-size: 14px; font-weight: 600; color: #111827; }
.required { color: #ef4444; margin-left: 2px; }

.form-input { width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #111827; outline: none; transition: border-color 0.2s; }
.form-input::placeholder { color: #9ca3af; }
.form-input:focus { border-color: #1a73e8; }

.input-with-icon { position: relative; }
.btn-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #9ca3af; cursor: pointer; display: flex; align-items: center; }
.btn-eye svg { width: 18px; height: 18px; }

.form-select { width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #111827; outline: none; cursor: pointer; appearance: none; background: url('data:image/svg+xml;utf8,<svg fill="none" stroke="%239ca3af" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>') no-repeat right 16px center; background-size: 16px; }

/* Hàng cuối: Input Địa chỉ + Nút bấm */
.flex-address-row { display: flex; flex-direction: row; align-items: flex-end; gap: 24px; }
.address-input-wrapper { flex: 1; display: flex; flex-direction: column; gap: 8px; }

.form-actions { display: flex; gap: 12px; }
.btn-cancel { padding: 12px 24px; background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; font-weight: 600; color: #4b5563; cursor: pointer; transition: background-color 0.2s; }
.btn-cancel:hover { background-color: #f3f4f6; }
.btn-save { padding: 12px 24px; background-color: #1a73e8; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; color: #ffffff; cursor: pointer; transition: background-color 0.2s; }
.btn-save:hover { background-color: #1557b0; }

/* Responsive nhỏ hơn */
@media (max-width: 1024px) {
  .form-card { flex-direction: column; gap: 40px; }
  .avatar-section { align-items: flex-start; }
  .flex-address-row { flex-direction: column; align-items: flex-start; }
  .address-input-wrapper { width: 100%; }
  .form-actions { width: 100%; justify-content: flex-end; margin-top: 8px; }
}
</style>