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
          <a href="#" class="nav-link">
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
          <a href="#" class="nav-link active">
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
            <h1 class="page-title">Đổi mật khẩu</h1>
            <p class="page-subtitle">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
          </div>

          <div class="card-body">
            <form @submit.prevent="submitForm">
              
              <div class="form-group">
                <label>Mật khẩu hiện tại</label>
                <div class="input-with-icon">
                  <input :type="showPassword.current ? 'text' : 'password'" class="form-input" placeholder="Nhập mật khẩu hiện tại" v-model="passwords.current" />
                  <button type="button" class="icon-btn-toggle" @click="toggleVisibility('current')">
                    <svg v-if="!showPassword.current" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Mật khẩu mới</label>
                <div class="input-with-icon">
                  <input :type="showPassword.new ? 'text' : 'password'" class="form-input" placeholder="Nhập mật khẩu mới" v-model="passwords.new" />
                  <button type="button" class="icon-btn-toggle" @click="toggleVisibility('new')">
                    <svg v-if="!showPassword.new" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Xác nhận mật khẩu mới</label>
                <div class="input-with-icon">
                  <input :type="showPassword.confirm ? 'text' : 'password'" class="form-input" placeholder="Xác nhận lại mật khẩu mới" v-model="passwords.confirm" />
                  <button type="button" class="icon-btn-toggle" @click="toggleVisibility('confirm')">
                    <svg v-if="!showPassword.confirm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                  </button>
                </div>
              </div>

              <div class="info-banner">
                <div class="info-icon">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                </div>
                <p>Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ và số để đảm bảo tính bảo mật cho tài khoản của bạn.</p>
              </div>

              <div class="form-divider"></div>
              <div class="form-actions">
                <button type="submit" class="btn-save">Cập nhật mật khẩu</button>
              </div>
            </form>
          </div>
        </div>

        <div class="action-cards-container">
          <div class="action-card">
            <div class="icon-box icon-blue">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <div class="action-text">
              <h4>Xác thực 2 yếu tố</h4>
              <p>Tăng cường bảo mật tài khoản của bạn</p>
            </div>
          </div>

          <div class="action-card">
            <div class="icon-box icon-green">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <div class="action-text">
              <h4>Thiết bị đăng nhập</h4>
              <p>Quản lý các thiết bị đang đăng nhập</p>
            </div>
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

const passwords = reactive({
  current: '',
  new: '',
  confirm: ''
});

const showPassword = reactive({
  current: false,
  new: false,
  confirm: false
});

const toggleVisibility = (field) => {
  showPassword[field] = !showPassword[field];
};

const submitForm = () => {
  // Logic xử lý cập nhật mật khẩu ở đây
  console.log('Submit password change', passwords);
};
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
  min-width: 0;
  max-width: 900px; /* Giới hạn chiều rộng nội dung để form cân đối */
}

/* --- Form Card --- */
.form-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
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

/* Form Inputs */
.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #111827;
}

.input-with-icon {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 12px 48px 12px 16px; /* Padding right để nhường chỗ cho icon */
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
  color: #111827;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:focus {
  border-color: #1a73e8;
}

.icon-btn-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
}

.icon-btn-toggle:hover {
  color: #4b5563;
}

.icon-btn-toggle svg {
  width: 20px;
  height: 20px;
}

/* Info Banner */
.info-banner {
  background-color: #eff6ff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 32px;
}

.info-icon {
  color: #1a73e8;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-icon svg {
  width: 20px;
  height: 20px;
}

.info-banner p {
  font-size: 13px;
  line-height: 1.5;
  color: #4b5563;
}

/* Divider & Actions */
.form-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin-bottom: 24px;
}

.form-actions {
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

.btn-save:hover {
  background-color: #1557b0;
}

/* --- Action Cards --- */
.action-cards-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 24px;
}

.action-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-box svg {
  width: 24px;
  height: 24px;
}

.icon-blue {
  background-color: #eff6ff;
  color: #1a73e8;
}

.icon-green {
  background-color: #ecfdf5;
  color: #10b981;
}

.action-text h4 {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.action-text p {
  font-size: 13px;
  color: #6b7280;
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