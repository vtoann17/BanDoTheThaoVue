<template>
  <div class="profile-page">
    <HeaderUser :cart-count="3" :user="user" />

    <main class="main-wrapper">
      <SidebarUser :active-link="activeLink" @navigate="activeLink = $event" />

      <section class="content">
        <div class="card form-card">
          <div class="card-header">
            <h1 class="page-title">Thông tin cá nhân</h1>
            <p class="page-subtitle">Cập nhật thông tin của bạn để có trải nghiệm mua sắm tốt hơn.</p>
          </div>

          <div class="card-body">
            <div class="avatar-section">
              <div class="avatar-circle">
                <img :src="user.avatar" alt="Avatar" class="avatar-img" />
                <button class="camera-btn">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.828-.414l-.828-1.242A1 1 0 0012.93 3H7.07a1 1 0 00-.828.414L5.414 4.586A1 1 0 014.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>
                  </svg>
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
                  <svg class="icon-calendar" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
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
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
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
import { ref, reactive } from 'vue';
import HeaderUser from '../../components/HeaderUser.vue'
import SidebarUser from '../../components/SidebarUser.vue'

const activeLink = ref('Thông tin cá nhân');

const user = {
  name: 'Nguyễn Minh',
  tier: 'Thành viên Bạc',
  avatar: 'https://i.pravatar.cc/150?img=5',
};

const form = reactive({
  fullName: 'Nguyễn Minh',
  email: 'minh.nguyen@example.com',
  phone: '0901 234 567',
  dob: '10 / 15 / 1995',
  gender: 'nam',
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.profile-page {
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb;
  color: #111827;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a { text-decoration: none; }
button { font-family: inherit; }

.main-wrapper {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  gap: 40px;
  width: 100%;
  flex: 1;
}

.content { flex: 1; min-width: 0; }

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

.page-title { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
.page-subtitle { font-size: 14px; color: #4b5563; }
.card-body { padding: 32px; }

/* Avatar */
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

.avatar-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }

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
  display: block;
}
.btn-change-avatar:hover { background-color: #e5e7eb; }
.upload-hint { font-size: 12px; color: #9ca3af; }

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

/* Radio */
.radio-group { display: flex; gap: 32px; }

.radio-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  color: #111827;
  font-weight: 500;
}

.radio-label input[type="radio"] { display: none; }

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

.security-text h4 { font-size: 14px; font-weight: 700; color: #1a73e8; margin-bottom: 2px; }
.security-text p { font-size: 13px; color: #4b5563; }

/* Footer */
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

.footer-brand { display: flex; align-items: center; gap: 8px; }

.footer-logo {
  width: 24px; height: 24px; background-color: #9ca3af; color: white;
  border-radius: 4px; display: flex; align-items: center; justify-content: center;
}
.footer-logo svg { width: 14px; height: 14px; }
.footer-name { font-size: 14px; font-weight: 700; color: #9ca3af; }
.footer-copy { font-size: 13px; color: #9ca3af; }

.footer-links { display: flex; gap: 24px; }
.footer-links a { color: #4b5563; font-size: 13px; font-weight: 500; }
.footer-links a:hover { color: #111827; }
</style>