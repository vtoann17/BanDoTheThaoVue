<script setup>
import { ref } from "vue";
import { useAuth } from "@/stores/auth";

const authStore = useAuth();

const fullname = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const terms = ref(false);

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.");
    return;
  }

  if (!terms.value) {
    alert("Bạn phải đồng ý điều khoản");
    return;
  }

  await authStore.register({
    name: fullname.value,
    email: email.value,
    password: password.value,
  });
};

const handleGoogleRegister = () => {
  window.location.href = "http://localhost:8000/api/auth/google";
};
</script>

<template>
  <div class="page">

    <main class="main">
      <div class="card">

        <!-- TITLE -->
        <div class="title-block">
          <h1 class="title">Đăng ký tài khoản</h1>
          <p class="subtitle">Gia nhập cộng đồng yêu thể thao ngay hôm nay</p>
        </div>

        <!-- FORM -->
        <form class="form" @submit.prevent="handleSubmit">

          <div class="field">
            <label class="label">Họ và tên</label>
            <input v-model="fullname" class="input" placeholder="Nguyễn Văn A" required type="text" />
          </div>

          <div class="field">
            <label class="label">Email</label>
            <input v-model="email" class="input" placeholder="vi-du@email.com" required type="email" />
          </div>

          <div class="field">
            <label class="label">Mật khẩu</label>
            <input v-model="password" class="input" placeholder="••••••••" required type="password" />
          </div>

          <div class="field">
            <label class="label">Xác nhận mật khẩu</label>
            <input v-model="confirmPassword" class="input" placeholder="••••••••" required type="password" />
          </div>

          <!-- TERMS -->
          <div class="terms-row">
            <input v-model="terms" id="terms" type="checkbox" class="checkbox" />
            <label for="terms" class="terms-label">
              Tôi đồng ý với
              <a href="#" class="link">Điều khoản dịch vụ</a>
              và
              <a href="#" class="link">Chính sách bảo mật</a>.
            </label>
          </div>

          <button type="submit" class="btn-primary">Đăng ký ngay</button>

        </form>

        <!-- DIVIDER -->
        <div class="divider">
          <span class="divider-text">Hoặc đăng ký bằng</span>
        </div>

        <!-- GOOGLE -->
        <button type="button" class="btn-google" @click="handleGoogleRegister">
          <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Đăng ký với Google
        </button>

        <!-- LOGIN LINK -->
        <p class="login-text">
          Bạn đã có tài khoản?
          <router-link to="/auth/login" class="link login-link">Đăng nhập ngay</router-link>
        </p>

      </div>
    </main>

    <footer class="footer">
      © 2024 Sports Store. Tất cả quyền được bảo lưu.
    </footer>

  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page {
  
  color: #0f172a;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* MAIN */
.main {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
}

.card {
  width: 100%;
  max-width: 448px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  padding: 40px 32px;
  overflow: hidden;
}

/* TITLE */
.title-block {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 0.95rem;
  color: #6b7280;
}

/* FORM */
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #111827;
  background-color: #fff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input::placeholder {
  color: #9ca3af;
}

.input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* TERMS */
.terms-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 4px 0;
}

.checkbox {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  flex-shrink: 0;
  cursor: pointer;
  accent-color: #3b82f6;
}

.terms-label {
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
  line-height: 1.5;
}

.link {
  color: #3b82f6;
  font-weight: 500;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

/* BUTTONS */
.btn-primary {
  width: 100%;
  background-color: #3b82f6;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  padding: 14px 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-primary:active {
  transform: scale(0.98);
}

/* DIVIDER */
.divider {
  position: relative;
  text-align: center;
  margin: 24px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e5e7eb;
  transform: translateY(-50%);
}

.divider-text {
  position: relative;
  background-color: #ffffff;
  padding: 0 16px;
  font-size: 0.875rem;
  color: #6b7280;
}

/* GOOGLE BUTTON */
.btn-google {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 16px;
  background-color: #ffffff;
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.btn-google:hover {
  background-color: #f9fafb;
}

.google-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* LOGIN LINK */
.login-text {
  margin-top: 28px;
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.login-link {
  font-weight: 600;
}

/* FOOTER */
.footer {
  padding: 24px;
  text-align: center;
  font-size: 0.75rem;
  color: #9ca3af;
  border-top: 1px solid #e5e7eb;
}
</style>