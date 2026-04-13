<script setup>
import { reactive, ref } from 'vue';
import { useUsers } from "@/stores/users"; 
import HeaderUser from "../../components/HeaderUser.vue";
import SidebarUser from "../../components/SidebarUser.vue";

const userStore = useUsers();
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
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const toggleVisibility = (field) => {
  showPassword[field] = !showPassword[field];
};

const validateForm = () => {
  errorMessage.value = '';
  successMessage.value = '';
  if (!passwords.current || !passwords.new || !passwords.confirm) {
    errorMessage.value = 'Vui lòng điền đầy đủ thông tin vào các trường.';
    return false;
  }
  if (passwords.new.length < 6) {
    errorMessage.value = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
    return false;
  }
  if (passwords.new === passwords.current) {
    errorMessage.value = 'Mật khẩu mới không được giống mật khẩu hiện tại.';
    return false;
  }
  if (passwords.new !== passwords.confirm) {
    errorMessage.value = 'Xác nhận mật khẩu mới không khớp.';
    return false;
  }
  return true;
};

const submitForm = async () => {
  if (!validateForm()) return;
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  const payload = {
    current_password: passwords.current,
    new_password: passwords.new,
    new_password_confirmation: passwords.confirm
  };

  try {
    const result = await userStore.changePassword(payload);
    if (result) {
      successMessage.value = 'Mật khẩu của bạn đã được cập nhật thành công!';
      // Reset form
      passwords.current = '';
      passwords.new = '';
      passwords.confirm = '';
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Mật khẩu hiện tại không chính xác hoặc đã có lỗi xảy ra.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="profile-page">
    <HeaderUser/>

    <main class="main-wrapper">
      <SidebarUser/>

      <section class="content">
        <div class="card form-card">
          <div class="card-header">
            <h1 class="page-title">Đổi mật khẩu</h1>
            <p class="page-subtitle">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
          </div>

          <div class="card-body">
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

            <form @submit.prevent="submitForm">
              <div class="form-group">
                <label>Mật khẩu hiện tại</label>
                <div class="input-with-icon">
                  <input :type="showPassword.current ? 'text' : 'password'" class="form-input"
                    placeholder="Nhập mật khẩu hiện tại" v-model="passwords.current" />
                  <button type="button" class="icon-btn-toggle" @click="toggleVisibility('current')">
                    <svg v-if="!showPassword.current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                      </path>
                    </svg>
                    <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21">
                      </path>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Mật khẩu mới</label>
                <div class="input-with-icon">
                  <input :type="showPassword.new ? 'text' : 'password'" class="form-input"
                    placeholder="Nhập mật khẩu mới" v-model="passwords.new" />
                  <button type="button" class="icon-btn-toggle" @click="toggleVisibility('new')">
                    <svg v-if="!showPassword.new" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                      </path>
                    </svg>
                    <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21">
                      </path>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Xác nhận mật khẩu mới</label>
                <div class="input-with-icon">
                  <input :type="showPassword.confirm ? 'text' : 'password'" class="form-input"
                    placeholder="Xác nhận lại mật khẩu mới" v-model="passwords.confirm" />
                  <button type="button" class="icon-btn-toggle" @click="toggleVisibility('confirm')">
                    <svg v-if="!showPassword.confirm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                      </path>
                    </svg>
                    <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21">
                      </path>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="info-banner">
                <div class="info-icon">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"></path>
                  </svg>
                </div>
                <p>Mật khẩu phải có ít nhất 6 ký tự để đảm bảo tính bảo mật cho tài khoản của bạn.
                </p>
              </div>

              <div class="form-divider"></div>
              <div class="form-actions">
                <button type="submit" class="btn-save" :disabled="isLoading">
                  <span v-if="isLoading">Đang cập nhật...</span>
                  <span v-else>Cập nhật mật khẩu</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="action-cards-container">
          <div class="action-card">
            <div class="icon-box icon-blue">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                </path>
              </svg>
            </div>
            <div class="action-text">
              <h4>Xác thực 2 yếu tố</h4>
              <p>Tăng cường bảo mật tài khoản</p>
            </div>
          </div>

          <div class="action-card">
            <div class="icon-box icon-green">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                </path>
              </svg>
            </div>
            <div class="action-text">
              <h4>Thiết bị đăng nhập</h4>
              <p>Quản lý phiên đăng nhập</p>
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
        <div class="footer-copy">© 2024 SportGear. Bản quyền thuộc về Công ty TNHH Thể Thao Việt.</div>
        <div class="footer-links">
          <a href="#">Điều khoản</a>
          <a href="#">Bảo mật</a>
          <a href="#">Hỗ trợ</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Toàn bộ phần CSS giữ nguyên 100% của bạn */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.profile-page {
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb;
  color: #111827;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 500;
}

.alert-danger {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fee2e2;
}

.alert-success {
  background-color: #ecfdf5;
  color: #059669;
  border: 1px solid #d1fae5;
}

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

.brand-icon svg {
  width: 22px;
  height: 22px;
}

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

.cart-btn svg {
  width: 24px;
  height: 24px;
}

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

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.user-tier {
  font-size: 12px;
  color: #9ca3af;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.main-wrapper {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  gap: 40px;
  width: 100%;
  flex: 1;
}

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

.nav-link:hover {
  background-color: #e5e7eb;
  color: #111827;
}

.nav-link.active {
  background-color: #eff6ff;
  color: #1a73e8;
  font-weight: 600;
}

.nav-link.text-danger {
  color: #dc2626;
}

.nav-link.text-danger:hover {
  background-color: #fee2e2;
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.content {
  flex: 1;
  min-width: 0;
  max-width: 900px;
}

.form-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
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
  padding: 12px 48px 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
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
  padding: 4px;
  display: flex;
}

.icon-btn-toggle:hover {
  color: #4b5563;
}

.icon-btn-toggle svg {
  width: 20px;
  height: 20px;
}

.info-banner {
  background-color: #eff6ff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
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
  color: #4b5563;
  line-height: 1.5;
}

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
  transition: background 0.2s;
}

.btn-save:hover {
  background-color: #1557b0;
}

.btn-save:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

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
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  margin-bottom: 4px;
}

.action-text p {
  font-size: 13px;
  color: #6b7280;
}

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
  justify-content: space-between;
  align-items: center;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-logo {
  width: 24px;
  height: 24px;
  background-color: #9ca3af;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-logo svg {
  width: 14px;
  height: 14px;
}

.footer-name {
  font-size: 14px;
  font-weight: 700;
  color: #9ca3af;
}

.footer-copy {
  font-size: 13px;
  color: #9ca3af;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a {
  color: #4b5563;
  font-size: 13px;
  font-weight: 500;
}
</style>