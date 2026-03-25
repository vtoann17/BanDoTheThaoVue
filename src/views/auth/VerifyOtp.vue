<template>
  <div class="page">

    <!-- Main -->
    <main class="main">
      <div class="card">
        <div class="card-icon">✉️</div>
        <h2 class="card-title">Xác thực mã OTP</h2>
        <p class="card-desc">
          Vui lòng nhập mã OTP 6 số đã được gửi đến email
          <strong>{{ forgotStore.email }}</strong>
        </p>

        <form @submit.prevent="handleSubmit" class="form">
          <div class="otp-inputs">
            <input
              v-for="(digit, index) in otp"
              :key="index"
              :ref="el => inputRefs[index] = el"
              v-model="otp[index]"
              class="otp-input"
              :class="{ filled: digit !== '' }"
              type="text"
              inputmode="numeric"
              maxlength="1"
              @input="onInput(index, $event)"
              @keydown="onKeydown(index, $event)"
              @paste="onPaste($event)"
            />
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Xác nhận</span>
          </button>
        </form>

        <div class="resend">
          <span>Bạn không nhận được mã?</span>
          <a
            href="#"
            @click.prevent="resend"
            :class="{ disabled: countdown > 0 || resending }"
          >
            <span v-if="resending" class="spinner-sm"></span>
            <span v-else-if="countdown > 0">Gửi lại sau {{ countdown }}s</span>
            <span v-else>Gửi lại mã</span>
          </a>
        </div>

        <div class="back-link">
          <router-link to="/auth/forgotpassword">← Quay lại</router-link>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2024 SportGear. Bản quyền thuộc về SportGear.</p>
      <div class="footer-links">
        <a href="#">Chính sách bảo mật</a>
        <a href="#">Điều khoản sử dụng</a>
        <a href="#">Liên hệ</a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForgotPass } from '@/stores/forgotpassword'

const router = useRouter()
const forgotStore = useForgotPass()

const otp = reactive(['', '', '', '', '', ''])
const inputRefs = ref([])
const loading = ref(false)
const resending = ref(false)
const countdown = ref(0)
let countdownTimer = null

onMounted(() => {
  if (!forgotStore.email) {
    router.push('/auth/forgotpassword')
    return
  }
  inputRefs.value[0]?.focus()
})
function onInput(index, event) {
  const val = event.target.value.replace(/\D/g, '')
  otp[index] = val ? val[val.length - 1] : ''
  if (otp[index] && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
}

function onKeydown(index, event) {
  if (event.key === 'Backspace' && !otp[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

function onPaste(event) {
  event.preventDefault()
  const text = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
  text.split('').forEach((char, i) => {
    if (i < 6) otp[i] = char
  })
  const nextEmpty = otp.findIndex(d => d === '')
  inputRefs.value[nextEmpty === -1 ? 5 : nextEmpty]?.focus()
}
async function handleSubmit() {
  const code = otp.join('')
  if (code.length < 6) return

  loading.value = true

  const success = await forgotStore.verifyOtp({
    email: forgotStore.email,
    otp: code
  })

  loading.value = false

  if (success) {
    router.push('/auth/resetpassword')
  } else {
    otp.fill('')
    inputRefs.value[0]?.focus()
  }
}

async function resend() {
  if (countdown.value > 0 || resending.value) return

  resending.value = true
  await forgotStore.sendOtp({ email: forgotStore.email })
  resending.value = false

  otp.fill('')
  inputRefs.value[0]?.focus()

  // Bắt đầu đếm ngược 60s
  countdown.value = 60
  clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(countdownTimer)
  }, 1000)
}
</script>

<style scoped>
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', sans-serif;
}


.logo { display: flex; align-items: center; gap: 8px; }

.logo-icon {
  width: 40px;
  height: 40px;
  background: #0d6efd;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.logo-text { font-size: 18px; font-weight: 700; color: #1e293b; }

.nav { display: flex; gap: 32px; }

.nav a {
  text-decoration: none;
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  transition: color 0.2s;
}

.nav a:hover { color: #0d6efd; }

.btn-login {
  background: #0d6efd;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-login:hover { background: #0b5ed7; }

/* ── Main ── */
.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
}

.card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(13, 110, 253, 0.08);
  padding: 40px 36px;
  width: 100%;
  max-width: 440px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.card-icon {
  font-size: 40px;
  width: 72px;
  height: 72px;
  background: #eff6ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.card-title { font-size: 26px; font-weight: 700; color: #1e293b; margin-bottom: 10px; }

.card-desc { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 32px; }

.card-desc strong { color: #1e293b; }

/* ── OTP Inputs ── */
.otp-inputs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
}

.otp-input {
  width: 52px;
  height: 60px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.1s;
}

.otp-input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
  transform: translateY(-2px);
}

.otp-input.filled { border-color: #0d6efd; background: #eff6ff; }

/* ── Submit Button ── */
.btn-submit {
  width: 100%;
  background: #0d6efd;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-submit:hover:not(:disabled) { background: #0b5ed7; }
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

.spinner-sm {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(13,110,253,0.3);
  border-top-color: #0d6efd;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Resend ── */
.resend {
  margin-top: 28px;
  font-size: 14px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.resend a {
  color: #0d6efd;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: opacity 0.2s;
}

.resend a:hover:not(.disabled) { text-decoration: underline; }
.resend a.disabled { color: #94a3b8; cursor: not-allowed; }

/* ── Back ── */
.back-link { margin-top: 20px; }

.back-link a {
  font-size: 14px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.back-link a:hover { color: #0d6efd; }

/* ── Footer ── */
.footer {
  padding: 24px 40px;
  border-top: 1px solid #e2e8f0;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.footer p { font-size: 13px; color: #94a3b8; }

.footer-links { display: flex; gap: 24px; }

.footer-links a {
  font-size: 12px;
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover { color: #0d6efd; }

/* ── Responsive ── */
@media (max-width: 640px) {
  .header { padding: 14px 20px; }
  .nav { display: none; }
  .card { padding: 28px 20px; }
  .otp-input { width: 42px; height: 52px; font-size: 18px; }
  .footer { flex-direction: column; text-align: center; padding: 20px; }
}
</style>