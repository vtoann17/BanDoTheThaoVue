<script setup>
import { ref } from "vue";
import { useForgotPass } from "@/stores/forgotpassword";
import { useRouter } from "vue-router";

const router = useRouter();

const store = useForgotPass();
const email = ref("");

const handleSubmit = async () => {
  const success = await store.sendOtp({ email: email.value });

  if (success) {
    router.push({
      name: "verifyotp",
      query: { email: email.value }
    });
  }
};
</script>

<template>
  <div class="page">

    <!-- MAIN -->
    <main class="main">
      <div class="card">

        <!-- CARD HEADER -->
        <div class="card-header">
          <div class="icon-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 11V7a5 5 0 0 1 9.9-1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="card-title">Quên mật khẩu?</h2>
          <p class="card-desc">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu từ hệ thống SportGear.
          </p>
        </div>

        <!-- FORM -->
        <form class="form" @submit.prevent="handleSubmit">
          <div class="field">
            <label class="label" for="email">Email của bạn</label>
            <div class="input-wrap">
              <span class="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <input
                v-model="email"
                id="email"
                class="input"
                type="email"
                placeholder="example@email.com"
                required
              />
            </div>
          </div>

          <button type="submit" class="btn-primary">
            <span>Gửi yêu cầu</span>
            <svg class="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
              <line x1="22" y1="2" x2="11" y2="13" stroke-linecap="round" stroke-linejoin="round"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </form>

        <!-- BACK -->
        <div class="back-wrap">
          <router-link to="/auth/login" class="back-link">
            <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
              <line x1="19" y1="12" x2="5" y2="12" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="12 19 5 12 12 5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Quay lại Đăng nhập</span>
          </router-link>
        </div>

      </div>
    </main>

    <!-- FOOTER -->
    <footer class="footer">
      <p class="footer-copy">© 2024 SportGear. Bản quyền thuộc về SportGear.</p>
      <div class="footer-links">
        <a href="#" class="footer-link">Chính sách bảo mật</a>
        <a href="#" class="footer-link">Điều khoản sử dụng</a>
        <a href="#" class="footer-link">Liên hệ</a>
      </div>
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
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-box {
  width: 40px;
  height: 40px;
  background-color: #0d6efd;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
  flex-shrink: 0;
}

.logo-icon {
  width: 22px;
  height: 22px;
  color: #ffffff;
}

.brand-name {
  font-size: 1.375rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 48px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-link {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #475569;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #0d6efd;
}

.btn-login {
  background-color: #0d6efd;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 10px 28px;
  border-radius: 10px;
  text-decoration: none;
  transition: background-color 0.2s;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.25);
}

.btn-login:hover {
  background-color: #2563eb;
}

/* MAIN */
.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
}

/* CARD */
.card {
  width: 100%;
  max-width: 448px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  padding: 40px 40px;
}

/* CARD HEADER */
.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.icon-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background-color: rgba(13, 110, 253, 0.1);
  border-radius: 50%;
  margin-bottom: 16px;
  color: #0d6efd;
}

.icon-circle svg {
  width: 28px;
  height: 28px;
}

.card-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}

.card-desc {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
}

/* FORM */
.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
}

.input-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  pointer-events: none;
  color: #94a3b8;
  transition: color 0.2s;
}

.input-icon svg {
  width: 18px;
  height: 18px;
}

.input-wrap:focus-within .input-icon {
  color: #0d6efd;
}

.input {
  width: 100%;
  padding: 14px 16px 14px 44px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9rem;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
}

.input::placeholder {
  color: #94a3b8;
}

.input:focus {
  border-color: #0d6efd;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.12);
}

/* PRIMARY BUTTON */
.btn-primary {
  width: 100%;
  background-color: #0d6efd;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  padding: 14px 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s, transform 0.1s;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.25);
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-primary:active {
  transform: scale(0.98);
}

.send-icon {
  width: 18px;
  height: 18px;
}

/* BACK LINK */
.back-wrap {
  margin-top: 28px;
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  text-decoration: none;
  transition: color 0.2s;
}

.back-link:hover {
  color: #0d6efd;
}

.back-icon {
  width: 16px;
  height: 16px;
}

/* FOOTER */
.footer {
  padding: 28px 80px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.footer-copy {
  font-size: 0.8125rem;
  color: #64748b;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.footer-link {
  font-size: 0.75rem;
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #0d6efd;
}

@media (max-width: 768px) {
  .header {
    padding: 16px 20px;
  }

  .nav {
    display: none;
  }

  .header-right {
    gap: 16px;
  }

  .footer {
    padding: 24px 20px;
    flex-direction: column;
    text-align: center;
  }
}
</style>