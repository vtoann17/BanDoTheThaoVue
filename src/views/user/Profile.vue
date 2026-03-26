<template>
  <div class="profile-page">
    <header class="header">
      <div class="header-container">
        <div class="brand">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M5.636 5.636a9 9 0 0112.728 0M12 2v20M2 12h20M5.636 18.364a9 9 0 0112.728 0"></path>
            </svg>
          </div>
          <span class="brand-name">SportGear</span>
        </div>

        <div class="search-box">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input type="text" class="search-input" placeholder="Tìm kiếm dụng cụ thể thao..." />
        </div>

        <div class="header-actions">
          <button class="cart-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span class="cart-badge">3</span>
          </button>
          
          <div class="user-menu">
            <div class="user-text">
              <span class="user-name">Nguyễn Minh</span>
              <span class="user-tier">Thành viên Bạc</span>
            </div>
            <img src="https://i.pravatar.cc/150?img=5" alt="Avatar" class="user-avatar" />
          </div>
        </div>
      </div>
    </header>

    <main class="main-wrapper">
      <aside class="sidebar">
        <div class="nav-section">
          <h4 class="nav-title">TÀI KHOẢN</h4>
          <a href="#" class="nav-link active">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            Thông tin cá nhân
          </a>
          <a href="#" class="nav-link">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            Đơn hàng của tôi
          </a>
          <a href="#" class="nav-link">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Sổ địa chỉ
          </a>
          <a href="#" class="nav-link">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            Sản phẩm yêu thích
          </a>
          <a href="#" class="nav-link">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
            Mã giảm giá
          </a>
        </div>

        <div class="nav-section">
          <h4 class="nav-title">CÀI ĐẶT</h4>
          <a href="#" class="nav-link">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            Đổi mật khẩu
          </a>
          <a href="#" class="nav-link">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Trang chủ
          </a>
          <a href="#" class="nav-link text-danger">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Đăng xuất
          </a>
        </div>
      </aside>

      <section class="content">
        <div class="card form-card">
          <div class="card-header">
            <h1 class="page-title">Thông tin cá nhân</h1>
            <p class="page-subtitle">Cập nhật thông tin của bạn để có trải nghiệm mua sắm tốt hơn.</p>
          </div>

          <div class="card-body">
            <div class="avatar-section">
              <div class="avatar-circle">
                <img src="https://i.pravatar.cc/150?img=5" alt="Avatar" class="avatar-img" />
                <button class="camera-btn">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.828-.414l-.828-1.242A1 1 0 0012.93 3H7.07a1 1 0 00-.828.414L5.414 4.586A1 1 0 014.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>
                </button>
              </div>
              <div class="avatar-info">
                <button class="btn-change-avatar">Thay đổi ảnh</button>
                <p class="upload-hint">Định dạng JPG, PNG hoặc GIF. Dung lượng tối đa 1MB.</p>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Họ và tên</label>
                <input type="text" class="form-input" v-model="form.fullName" />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-input disabled-input" v-model="form.email" disabled />
              </div>
              <div class="form-group">
                <label>Số điện thoại</label>
                <input type="tel" class="form-input" v-model="form.phone" />
              </div>
              <div class="form-group">
                <label>Ngày sinh</label>
                <div class="input-icon-wrapper">
                  <input type="text" class="form-input" v-model="form.dob" />
                  <svg class="icon-calendar" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
              </div>
            </div>

            <div class="form-group margin-top-24">
              <label>Giới tính</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" name="gender" value="nam" v-model="form.gender" />
                  <span class="radio-mark"></span>
                  Nam
                </label>
                <label class="radio-label">
                  <input type="radio" name="gender" value="nu" v-model="form.gender" />
                  <span class="radio-mark"></span>
                  Nữ
                </label>
                <label class="radio-label">
                  <input type="radio" name="gender" value="khac" v-model="form.gender" />
                  <span class="radio-mark"></span>
                  Khác
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button class="btn-save">Lưu thay đổi</button>
            </div>
          </div>
        </div>

        <div class="security-banner">
          <div class="shield-box">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <div class="security-text">
            <h4>Bảo mật tài khoản</h4>
            <p>Tài khoản của bạn đã được xác minh 100%.</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-container">
        <div class="footer-brand">
          <div class="footer-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M5.636 5.636a9 9 0 0112.728 0M12 2v20M2 12h20M5.636 18.364a9 9 0 0112.728 0"></path>
            </svg>
          </div>
          <span class="footer-name">SportGear</span>
        </div>
        <div class="footer-copy">
          © 2024 SportGear. Bản quyền thuộc về Công ty TNHH Thể Thao Việt.
        </div>
        <div class="footer-links">
          <a href="#">Điều khoản</a>
          <a href="#">Bảo mật</a>
          <a href="#">Hỗ trợ</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

// Khởi tạo state dữ liệu giống hệt ảnh chuẩn
const form = reactive({
  fullName: 'Nguyễn Minh',
  email: 'minh.nguyen@example.com',
  phone: '0901 234 567',
  dob: '10 / 15 / 1995',
  gender: 'nam'
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* --- Global Reset & Variables --- */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.profile-page {
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb; /* Xám nhạt nền body */
  color: #111827;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a { text-decoration: none; }
button { font-family: inherit; }

/* --- Header --- */
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1440px; /* Rộng rãi sang 2 bên */
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

.user-name { font-size: 14px; font-weight: 600; color: #111827;}
.user-tier { font-size: 12px; color: #9ca3af; }
.user-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }

/* --- Main Layout --- */
.main-wrapper {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  gap: 40px;
  width: 100%;
  flex: 1;
}

/* --- Sidebar --- */
.sidebar {
  width: 260px;
  flex-shrink: 0;
}

.nav-section {
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-title {
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
  padding-left: 16px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-link:hover { background-color: #e5e7eb; color: #111827; }
.nav-link.active { background-color: #eff6ff; color: #1a73e8; font-weight: 600; }
.nav-link.text-danger { color: #dc2626; }
.nav-link.text-danger:hover { background-color: #fee2e2; }
.nav-icon { width: 20px; height: 20px; }

/* --- Content Area --- */
.content {
  flex: 1;
  min-width: 0; /* Tránh form bị tràn ngang */
}

/* Form Card */
.form-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  margin-bottom: 24px;
}

.card-header {
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}

.page-subtitle {
  font-size: 14px;
  color: #4b5563;
}

.card-body {
  padding: 32px;
}

/* Avatar Section */
.avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.avatar-circle {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  padding: 4px;
  border: 2px solid #bfdbfe;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.camera-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #f97316;
  color: #ffffff;
  border: 2px solid #ffffff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.camera-btn svg { width: 14px; height: 14px; }

.btn-change-avatar {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  cursor: pointer;
  margin-bottom: 8px;
  transition: all 0.2s;
}
.btn-change-avatar:hover { background-color: #e5e7eb; }

.upload-hint {
  font-size: 12px;
  color: #9ca3af;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #111827;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
  color: #111827;
}
.form-input:focus { border-color: #1a73e8; }
.disabled-input { background-color: #f9fafb; color: #4b5563; cursor: not-allowed; }

.input-icon-wrapper { position: relative; }
.icon-calendar {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9ca3af;
  pointer-events: none;
}

.margin-top-24 { margin-top: 24px; }

/* Custom Radio Styling */
.radio-group {
  display: flex;
  gap: 32px;
}

.radio-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  color: #111827;
  font-weight: 500;
}

.radio-label input[type="radio"] {
  display: none;
}

.radio-mark {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  margin-right: 10px;
  position: relative;
  display: inline-block;
  transition: all 0.2s ease;
}

.radio-label input[type="radio"]:checked + .radio-mark {
  border-color: #1a73e8;
  background-color: #1a73e8;
}

.radio-label input[type="radio"]:checked + .radio-mark::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background-color: #ffffff;
  border-radius: 50%;
}

/* Actions */
.form-actions {
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
}

.btn-save {
  background-color: #1a73e8;
  color: #ffffff;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-save:hover { background-color: #1557b0; }

/* Security Banner */
.security-banner {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.shield-box {
  width: 36px;
  height: 36px;
  background-color: #dbeafe;
  color: #1a73e8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.shield-box svg { width: 20px; height: 20px; }

.security-text h4 {
  font-size: 14px;
  font-weight: 700;
  color: #1a73e8;
  margin-bottom: 2px;
}

.security-text p {
  font-size: 13px;
  color: #4b5563;
}

/* --- Footer --- */
.footer {
  background-color: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 24px 0;
  margin-top: auto;
}

.footer-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.footer-logo {
  width: 24px; height: 24px; background-color: #9ca3af; color: white;
  border-radius: 4px; display: flex; align-items: center; justify-content: center;
}
.footer-logo svg { width: 14px; height: 14px; }
.footer-name { font-size: 14px; font-weight: 700; color: #9ca3af; }

.footer-copy { font-size: 13px; color: #9ca3af; }

.footer-links {
  display: flex;
  gap: 24px;
}
.footer-links a {
  text-decoration: none; color: #4b5563; font-size: 13px; font-weight: 500;
}
.footer-links a:hover { color: #111827; }
</style>