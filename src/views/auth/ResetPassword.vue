<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useForgotPass } from "@/stores/forgotpassword";

const router = useRouter();
const route = useRoute();
const store = useForgotPass();

const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const showPassword = ref(false);
const showConfirm = ref(false);

const email = route.query.email || store.email;

const handleSubmit = async () => {
  if (!password.value || password.value.length < 8) {
    alert("Mật khẩu tối thiểu 8 ký tự");
    return;
  }
  if (password.value !== confirmPassword.value) {
    alert("Mật khẩu không khớp");
    return;
  }
  loading.value = true;
  await store.resetPassword({ email, password: password.value });
  loading.value = false;
  router.push("/auth/login");
};
</script>

<template>
  <div class="page">
    <main class="main">
      <div class="card">
        <!-- Icon -->
        <div class="icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="icon-svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </div>

        <h2>Đặt lại mật khẩu</h2>
        <p>Tạo mật khẩu mới cho tài khoản của bạn để đảm bảo an toàn.</p>

        <form @submit.prevent="handleSubmit">
          <!-- Mật khẩu mới -->
          <div class="field">
            <label>Mật khẩu mới</label>
            <div class="input-wrap">
              <span class="input-icon left">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </span>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Nhập mật khẩu mới"
                required
              />
              <button type="button" class="input-icon right eye-btn" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
            <span class="hint">Tối thiểu 8 ký tự, bao gồm chữ cái và số.</span>
          </div>

          <!-- Xác nhận -->
          <div class="field">
            <label>Xác nhận mật khẩu mới</label>
            <div class="input-wrap">
              <span class="input-icon left">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </span>
              <input
                v-model="confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="Nhập lại mật khẩu mới"
                required
              />
              <button type="button" class="input-icon right eye-btn" @click="showConfirm = !showConfirm">
                <svg v-if="!showConfirm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="btn-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
            <span v-if="loading">Đang xử lý...</span>
            <span v-else>Cập nhật mật khẩu</span>
          </button>
        </form>

        <router-link to="/auth/login" class="back">
          ← Quay lại trang đăng nhập
        </router-link>
      </div>
    </main>

    <!-- SSL notice -->
    <div class="ssl-notice">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      Kết nối an toàn được mã hóa SSL
    </div>

    <footer class="footer">© 2024 SportGear. Bảo lưu mọi quyền.</footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  background: #f0f2f5;
}

/* MAIN */
.main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 16px 16px;
}

/* CARD */
.card {
  background: #fff;
  padding: 40px 36px 36px;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.07);
}

/* Icon */
.icon-wrap {
  width: 56px; height: 56px;
  background: #eff6ff;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
}
.icon-svg {
  width: 26px; height: 26px;
  color: #2563eb;
}

h2 {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 28px;
}

/* FIELD */
.field {
  text-align: left;
  margin-bottom: 18px;
}
.field label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

/* INPUT WRAP */
.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.input-wrap input {
  width: 100%;
  padding: 11px 44px 11px 44px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #111827;
  background: #fff;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.input-wrap input::placeholder { color: #9ca3af; }
.input-wrap input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-icon {
  position: absolute;
  display: flex; align-items: center; justify-content: center;
  width: 44px; height: 100%;
  color: #9ca3af;
}
.input-icon svg { width: 17px; height: 17px; }
.input-icon.left  { left: 0; pointer-events: none; }
.input-icon.right { right: 0; }

.eye-btn {
  background: none; border: none; cursor: pointer;
  transition: color .2s;
}
.eye-btn:hover { color: #2563eb; }

.hint {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  margin-top: 6px;
}

/* SUBMIT */
.btn-submit {
  width: 100%;
  padding: 13px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  margin-top: 8px;
  transition: background .2s, transform .1s;
  letter-spacing: .01em;
}
.btn-submit:hover:not(:disabled) { background: #1d4ed8; }
.btn-submit:active:not(:disabled) { transform: scale(.99); }
.btn-submit:disabled { opacity: .65; cursor: not-allowed; }
.btn-icon { width: 18px; height: 18px; flex-shrink: 0; }

/* BACK */
.back {
  display: inline-block;
  margin-top: 22px;
  color: #6b7280;
  font-size: 14px;
  text-decoration: none;
  transition: color .2s;
}
.back:hover { color: #2563eb; }

/* SSL */
.ssl-notice {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  font-size: 12px; color: #9ca3af;
  padding: 12px 0 6px;
}
.ssl-notice svg { width: 14px; height: 14px; }

/* FOOTER */
.footer {
  text-align: center;
  padding: 12px;
  font-size: 13px;
  color: #9ca3af;
}
</style>