<script setup>
import { computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import { useOrder } from "../stores/orders";
import { useShipping } from "@/stores/shipping";

const router = useRouter();
const route = useRoute();
const orderStore = useOrder();
const shippingStore = useShipping();

const order = computed(() => orderStore.currentOrder);
const orderId = computed(() => route.query.order_id || order.value?.id);

const fmt = (n) => Number(n).toLocaleString("vi-VN") + "đ";

onMounted(async () => {
  const id = route.query.order_id;
  if (id) {
    await orderStore.getOrder(id);
  }
});
</script>

<template>
  <div class="page">
    <AppHeader />

    <main class="success-main">
      <div class="success-card">
        <!-- Icon -->
        <div class="icon-wrap">
          <div class="icon-circle" :class="order?.payment_method === 'momo' ? 'icon-momo' : order?.payment_method === 'vnpay' ? 'icon-vnpay' : 'icon-cod'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 class="success-title">
          {{ order?.payment_method === 'momo' || order?.payment_method === 'vnpay' ? 'Thanh toán thành công!' : 'Đặt hàng thành công!' }}
        </h1>
        <p class="success-sub">
          {{ order?.payment_method === 'momo'
            ? 'Bạn đã thanh toán qua MoMo. Đơn hàng đang được xử lý.'
            : order?.payment_method === 'vnpay'
            ? 'Bạn đã thanh toán qua VNPay. Đơn hàng đang được xử lý.'
            : 'Cảm ơn bạn đã mua hàng. Vui lòng thanh toán khi nhận hàng.' }}
        </p>

        <!-- Mã đơn hàng -->
        <div class="order-id-badge">
          <span class="order-id-label">Mã đơn hàng</span>
          <span class="order-id-value">#{{ orderId }}</span>
        </div>

        <!-- Chi tiết đơn -->
        <div class="order-detail-card" v-if="order">
          <div class="detail-row">
            <span class="detail-label">Phương thức thanh toán</span>
            <span class="detail-value">
              {{ order.payment_method === 'cod'
                ? 'Thanh toán khi nhận hàng (COD)'
                : order.payment_method === 'momo'
                ? 'Ví MoMo'
                : 'VNPay' }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Trạng thái</span>
            <span
              class="detail-value status-badge"
              :class="order.payment_method === 'momo' || order.payment_method === 'vnpay' ? 'status-paid' : 'status-pending'"
            >
              {{ order.payment_method === 'momo' || order.payment_method === 'vnpay' ? 'Đã thanh toán' : 'Chờ thanh toán COD' }}
            </span>
          </div>
          <div class="detail-divider"></div>

          <!-- Sản phẩm -->
          <div class="product-list">
            <div class="product-row" v-for="item in order.items" :key="item.id">
              <div class="product-info">
                <span class="product-name">{{ item.variant?.product?.name ?? 'Sản phẩm' }}</span>
                <span class="product-sku">{{ item.variant?.sku }} × {{ item.quantity }}</span>
              </div>
              <span class="product-price">{{ fmt(item.price * item.quantity) }}</span>
            </div>
          </div>

          <div class="detail-divider"></div>

          <div class="total-breakdown-row">
            <span class="detail-label">Tiền hàng</span>
            <span class="detail-value">{{ fmt(order.total_amount) }}</span>
          </div>
          <div class="total-breakdown-row">
            <span class="detail-label">Phí vận chuyển</span>
            <span class="detail-value">{{ fmt(order.shipping_fee ?? 0) }}</span>
          </div>

          <div class="detail-divider"></div>

          <div class="total-row">
            <span>Tổng thanh toán</span>
            <span class="total-amount">
              {{ fmt((order.total_amount ?? 0) + (order.shipping_fee ?? 0)) }}
            </span>
          </div>
        </div>

        <!-- Không có order data -->
        <div class="order-detail-card no-data" v-else>
          <p>Đơn hàng <strong>#{{ orderId }}</strong> đã được đặt thành công.</p>
          <p>Vui lòng kiểm tra email để biết thêm chi tiết.</p>
        </div>

        <!-- Buttons -->
        <div class="action-btns">
          <button class="btn-orders" @click="router.push('/order')">
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

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

.page {
  min-height: 100vh;
  background: #f8f9fb;
  font-family: "Inter", sans-serif;
  color: #111827;
  display: flex;
  flex-direction: column;
}

.success-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
}

.success-card {
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
.icon-wrap {
  animation: pop 0.4s ease;
}
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
.icon-circle svg {
  width: 36px;
  height: 36px;
  color: #fff;
}
.icon-cod {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
}
.icon-momo {
  background: linear-gradient(135deg, #ae2070, #d4006a);
  box-shadow: 0 8px 24px rgba(174, 32, 112, 0.3);
}
.icon-vnpay {
  background: linear-gradient(135deg, #0066cc, #003d99);
  box-shadow: 0 8px 24px rgba(0, 102, 204, 0.3);
}

.success-title {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  text-align: center;
}
.success-sub {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin-top: -8px;
}

/* Order ID badge */
.order-id-badge {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
}
.order-id-label {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.order-id-value {
  font-size: 22px;
  font-weight: 800;
  color: #1a73e8;
}

/* Detail card */
.order-detail-card {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.no-data {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.8;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}
.detail-label {
  color: #6b7280;
}
.detail-value {
  font-weight: 600;
  color: #111827;
}

.status-badge {
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 12px;
}
.status-pending {
  background: #fef9c3;
  color: #ca8a04;
}
.status-paid {
  background: #fce7f3;
  color: #be185d;
}

.detail-divider {
  height: 1px;
  background: #e5e7eb;
}

/* Products */
.product-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.product-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.product-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.product-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}
.product-sku {
  font-size: 12px;
  color: #9ca3af;
}
.product-price {
  font-size: 13px;
  font-weight: 700;
  color: #1a73e8;
  white-space: nowrap;
}

/* Total */
.total-breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}
.total-amount {
  font-size: 20px;
  font-weight: 800;
  color: #1a73e8;
}

/* Buttons */
.action-btns {
  display: flex;
  gap: 12px;
  width: 100%;
}
.btn-orders,
.btn-home {
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
.btn-orders svg,
.btn-home svg {
  width: 18px;
  height: 18px;
}
.btn-orders {
  background: #1a73e8;
  color: #fff;
}
.btn-orders:hover {
  background: #1557b0;
}
.btn-home {
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
}
.btn-home:hover {
  background: #f9fafb;
}

@media (max-width: 480px) {
  .success-card {
    padding: 28px 20px;
  }
  .action-btns {
    flex-direction: column;
  }
}
</style>