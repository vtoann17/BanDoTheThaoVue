<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";

const router = useRouter();
const route  = useRoute();

const errorCode = computed(() => route.query.error || null);
const orderId   = computed(() => route.query.order_id || null);

const errorMessage = computed(() => {
  if (orderId.value && !errorCode.value) {
    return 'Thanh toán chưa hoàn tất. Đơn hàng của bạn vẫn được lưu lại.';
  }
  const codes = {
    'invalid_signature': 'Chữ ký không hợp lệ. Giao dịch bị từ chối.',
    'order_not_found':   'Không tìm thấy đơn hàng.',
    '24': 'Bạn đã hủy giao dịch.',
    '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking.',
    '10': 'Xác thực thông tin thẻ/tài khoản quá 3 lần.',
    '11': 'Giao dịch đã hết hạn. Vui lòng thử lại.',
    '12': 'Thẻ/Tài khoản bị khóa.',
    '51': 'Tài khoản không đủ số dư.',
    '65': 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày.',
    '75': 'Ngân hàng đang bảo trì.',
  };
  return codes[errorCode.value] ?? `Giao dịch thất bại (Mã lỗi: ${errorCode.value ?? 'unknown'}).`;
});
</script>

<template>
  <div class="page">
    <AppHeader />

    <main class="failed-main">
      <div class="failed-card">
        <!-- Icon -->
        <div class="icon-wrap">
          <div class="icon-circle icon-failed">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <h1 class="failed-title">Thanh toán thất bại!</h1>
        <p class="failed-sub">{{ errorMessage }}</p>

        <!-- Error code badge -->
        <div class="error-badge" v-if="errorCode">
          <span class="error-label">Mã lỗi</span>
          <span class="error-value">{{ errorCode.toUpperCase() }}</span>
        </div>

        <!-- Order badge (khi hủy giữa chừng) -->
        <div class="error-badge" v-else-if="orderId">
          <span class="error-label">Mã đơn hàng</span>
          <span class="error-value">#{{ orderId }}</span>
        </div>

        <!-- Hướng dẫn -->
        <div class="guide-card">
          <div class="guide-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Bạn có thể làm gì?
          </div>
          <ul class="guide-list">
            <li>Kiểm tra lại số dư tài khoản / thẻ</li>
            <li>Thử lại với phương thức thanh toán khác</li>
            <li>Liên hệ ngân hàng nếu thẻ bị khóa</li>
            <li>Đơn hàng vẫn còn lưu, bạn có thể thanh toán lại</li>
          </ul>
        </div>

        <!-- Buttons -->
        <div class="action-btns">
          <button class="btn-retry" @click="router.push('/order')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Đơn hàng của tôi
          </button>
          <button class="btn-home" @click="router.push('/')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Về trang chủ
          </button>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

* { box-sizing: border-box; margin: 0; padding: 0; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }

.page {
  min-height: 100vh;
  background: #f8f9fb;
  font-family: "Inter", sans-serif;
  color: #111827;
  display: flex;
  flex-direction: column;
}

.failed-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
}

.failed-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 40px 36px;
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

/* Icon */
.icon-wrap { animation: pop 0.4s ease; }
@keyframes pop {
  0% { transform: scale(0.5); opacity: 0; }
  80% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
.icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-circle svg { width: 36px; height: 36px; color: #fff; }
.icon-failed {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
}

.failed-title {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  text-align: center;
}
.failed-sub {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin-top: -8px;
}

/* Error badge */
.error-badge {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
}
.error-label {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.error-value {
  font-size: 20px;
  font-weight: 800;
  color: #dc2626;
}

/* Guide card */
.guide-card {
  width: 100%;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.guide-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #92400e;
}
.guide-title svg { width: 16px; height: 16px; flex-shrink: 0; }
.guide-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 4px;
}
.guide-list li {
  font-size: 13px;
  color: #78350f;
  padding-left: 14px;
  position: relative;
}
.guide-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #f59e0b;
}

/* Buttons */
.action-btns {
  display: flex;
  gap: 12px;
  width: 100%;
}
.btn-retry, .btn-home {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-retry svg, .btn-home svg { width: 18px; height: 18px; }
.btn-retry {
  background: #dc2626;
  color: #fff;
}
.btn-retry:hover { background: #b91c1c; }
.btn-home {
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
}
.btn-home:hover { background: #f9fafb; }

@media (max-width: 480px) {
  .failed-card { padding: 28px 20px; }
  .action-btns { flex-direction: column; }
}
</style>