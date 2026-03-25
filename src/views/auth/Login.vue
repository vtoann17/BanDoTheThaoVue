<script setup>
import { ref } from "vue";
import { useAuth } from "@/stores/auth";

const authStore = useAuth();

const email = ref("");
const password = ref("");
const rememberMe = ref(false);

const handleSubmit = async () => {
  await authStore.login({
    email: email.value,
    password: password.value,
    remember: rememberMe.value,
  });
};

const handleGoogleLogin = () => {
  window.location.href = "http://localhost:8000/api/auth/google";
};
</script>

<template>
  <div class="page">
    <main class="main">
      <div class="card">

        <!-- HEADER -->
        <header class="header">
          <div class="logo-circle">
            <svg class="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </div>
          <h1 class="title">Đăng nhập</h1>
          <p class="subtitle">Chào mừng bạn trở lại với Sports Store</p>
        </header>

        <!-- FORM -->
        <section class="form-section">
          <form class="form" @submit.prevent="handleSubmit">

            <div class="field">
              <label class="label" for="email">Email</label>
              <input
                v-model="email"
                id="email"
                class="input"
                type="email"
                placeholder="example@gmail.com"
                required
              />
            </div>

            <div class="field">
              <label class="label" for="password">Mật khẩu</label>
              <input
                v-model="password"
                id="password"
                class="input"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <!-- Remember & Forgot -->
            <div class="row-between">
              <label class="remember-label">
                <input v-model="rememberMe" type="checkbox" class="checkbox" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <router-link to="/auth/forgotpassword" class="link">Quên mật khẩu?</router-link>
            </div>

            <button type="submit" class="btn-primary">Đăng nhập</button>

            <!-- Divider -->
            <div class="divider">
              <span class="divider-text">Hoặc tiếp tục với</span>
            </div>

            <!-- Google -->
            <button type="button" class="btn-google" @click="handleGoogleLogin">
              <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Đăng nhập bằng Google
            </button>

          </form>

          <!-- Sign Up -->
          <p class="signup-text">
            Bạn chưa có tài khoản?
            <router-link to="/auth/register" class="link signup-link">Đăng ký ngay</router-link>
          </p>
        </section>

      </div>
    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.main {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* CARD */
.card {
  width: 100%;
  max-width: 450px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

/* HEADER */
.header {
  padding: 40px 32px 24px;
  text-align: center;
}

.logo-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background-color: #dbeafe;
  border-radius: 50%;
  margin-bottom: 16px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  color: #2563eb;
}

.title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 0.9rem;
  color: #6b7280;
}

/* FORM SECTION */
.form-section {
  padding: 0 32px 40px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
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

/* REMEMBER ROW */
.row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  accent-color: #3b82f6;
  cursor: pointer;
  flex-shrink: 0;
}

.link {
  font-size: 0.875rem;
  font-weight: 500;
  color: #3b82f6;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

/* PRIMARY BUTTON */
.btn-primary {
  width: 100%;
  background-color: #3b82f6;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  padding: 14px 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  letter-spacing: 0.01em;
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
  color: #9ca3af;
}

/* GOOGLE BUTTON */
.btn-google {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 12px 16px;
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

/* SIGN UP */
.signup-text {
  margin-top: 28px;
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.signup-link {
  font-weight: 700;
}
</style>