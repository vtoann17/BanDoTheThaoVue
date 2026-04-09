<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import { useAddress } from "@/stores/address";
import { useShipping } from "@/stores/shipping";
import { useCart } from "@/stores/carts";
import { useOrder } from "@/stores/orders";
import { usePayment } from "@/stores/payment";

const router = useRouter();
const addressStore = useAddress();
const shippingStore = useShipping();
const cartStore = useCart();
const orderStore = useOrder();
const paymentStore = usePayment();

const { addresses } = storeToRefs(addressStore);
const { shippingFee } = storeToRefs(shippingStore);
const { items } = storeToRefs(cartStore);
const { loading } = storeToRefs(paymentStore);

const paymentMethod = ref("vnpay");
const selectedAddressId = ref(null);
const form = reactive({ fullName: "", phone: "" });

const defaultAddress = computed(
  () => addresses.value.find((a) => a.is_default) ?? addresses.value[0] ?? null
);

const subtotal = computed(() =>
  items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
const total = computed(() => subtotal.value + (shippingFee.value || 0));
const fmt = (n) => Number(n).toLocaleString("vi-VN") + "₫";

onMounted(async () => {
  if (!items.value.length) await cartStore.loadCart();
  await addressStore.loadAddresses();
  if (defaultAddress.value) {
    selectedAddressId.value = defaultAddress.value.id;
    form.fullName = defaultAddress.value.receiver_name || "";
    form.phone = defaultAddress.value.phone || "";
    await shippingStore.calculateShipping(defaultAddress.value.id);
  }
});

const handleAddressChange = async (event) => {
  const id = Number(event.target.value);
  selectedAddressId.value = id;
  const selected = addresses.value.find((a) => a.id === id);
  if (selected) {
    form.fullName = selected.receiver_name || "";
    form.phone = selected.phone || "";
  }
  await shippingStore.calculateShipping(id);
};

const handleCheckout = async () => {
  if (!selectedAddressId.value) {
    alert("Vui lòng chọn địa chỉ giao hàng");
    return;
  }
  if (!items.value.length) {
    alert("Giỏ hàng trống");
    return;
  }

  const order = await orderStore.createOrder(
    selectedAddressId.value,
    paymentMethod.value,
    shippingStore.shippingFee
  );
  if (!order) return;

  if (paymentMethod.value === "vnpay") {
    await paymentStore.payWithVnpay(order.id);
  } else if (paymentMethod.value === "momo") {
    await paymentStore.payWithMomo(order.id);
  } else {
    const ok = await paymentStore.payWithCod(order.id);
    if (ok) router.push(`/ordersuccess?order_id=${order.id}`);
  }
};
</script>

<template>
  <div class="checkout-page">
    <AppHeader />

    <main class="main-content container">
      <nav class="breadcrumbs">
        <div class="step success">
          <svg class="icon-small" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Giỏ hàng
        </div>
        <span class="separator">/</span>
        <div class="step active">
          <span class="step-number">2</span>
          Vận chuyển & Thanh toán
        </div>
        <span class="separator">/</span>
        <div class="step disabled">
          <span class="step-number-outline">3</span>
          Hoàn tất
        </div>
      </nav>

      <div class="checkout-layout">
        <!-- ===== LEFT: FORM ===== -->
        <div class="form-section">
          <div class="section-header">
            <h2 class="section-title">
              <svg class="icon-large text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              Thông tin vận chuyển
            </h2>
            <a href="/address" class="action-link">
              <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Quản lý địa chỉ
            </a>
          </div>

          <div class="form-group-list">
            <!-- Chọn địa chỉ -->
            <div class="form-group">
              <label>Chọn từ địa chỉ đã lưu</label>
              <div class="select-wrapper">
                <select class="form-control" :value="selectedAddressId" @change="handleAddressChange">
                  <option v-if="!addresses.length" value="" disabled>Đang tải địa chỉ...</option>
                  <option v-for="addr in addresses" :key="addr.id" :value="addr.id">
                    {{ addr.is_default ? "★ " : "" }}{{ addr.address_detail }},
                    {{ addr.ward_name }}, {{ addr.district_name }},
                    {{ addr.province_name }}
                  </option>
                </select>
                <svg class="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div class="form-group">
              <label>Họ và tên</label>
              <input type="text" v-model="form.fullName" class="form-control" placeholder="Tên người nhận" readonly />
            </div>

            <div class="form-group">
              <label>Số điện thoại</label>
              <input type="tel" v-model="form.phone" class="form-control" placeholder="090 xxx xxxx" readonly />
            </div>
          </div>

          <!-- Phương thức thanh toán -->
          <h2 class="section-title margin-top-large">
            <svg class="icon-large text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Phương thức thanh toán
          </h2>

          <div class="payment-methods">
            <label class="payment-option" :class="{ active: paymentMethod === 'cod' }">
              <input type="radio" name="payment" value="cod" v-model="paymentMethod" />
              <div class="payment-content">
                <svg class="icon-xl text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <div class="payment-info">
                  <div class="payment-title">Thanh toán khi nhận hàng (COD)</div>
                  <div class="payment-desc">Thanh toán bằng tiền mặt khi nhận hàng</div>
                </div>
              </div>
            </label>

            <label class="payment-option" :class="{ active: paymentMethod === 'vnpay' }">
              <input type="radio" name="payment" value="vnpay" v-model="paymentMethod" />
              <div class="payment-content">
                <div class="vnp-badge">VNP</div>
                <div class="payment-info">
                  <div class="payment-title">Thanh toán qua VNPay</div>
                  <div class="payment-desc">Cổng thanh toán điện tử VNPay</div>
                </div>
              </div>
            </label>

            <!-- ✅ MoMo option -->
            <label class="payment-option" :class="{ active: paymentMethod === 'momo' }">
              <input type="radio" name="payment" value="momo" v-model="paymentMethod" />
              <div class="payment-content">
                <div class="momo-badge">M</div>
                <div class="payment-info">
                  <div class="payment-title">Thanh toán qua MoMo</div>
                  <div class="payment-desc">Ví điện tử MoMo</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- ===== RIGHT: ORDER SUMMARY ===== -->
        <div class="summary-section">
          <div class="summary-card">
            <h3 class="summary-title">Đơn hàng của bạn</h3>

            <div class="product-list">
              <div v-for="item in items" :key="item.id" class="product-item">
                <div class="product-image">
                  <img
                    :src="item.image || 'https://placehold.co/52x52/e5e7eb/9ca3af?text=SP'"
                    :alt="item.name"
                    @error="(e) => (e.target.src = 'https://placehold.co/52x52/e5e7eb/9ca3af?text=SP')"
                  />
                </div>
                <div class="product-details">
                  <h4>{{ item.name }}</h4>
                  <div class="product-meta">
                    <span v-for="attr in item.attrs" :key="attr.name">
                      {{ attr.name }}: {{ attr.value }}
                    </span>
                    <span>SL: {{ item.quantity }}</span>
                  </div>
                  <div class="product-price">{{ fmt(item.price * item.quantity) }}</div>
                </div>
              </div>
              <div v-if="!items.length" class="cart-empty-note">
                Không có sản phẩm trong giỏ hàng.
              </div>
            </div>

            <!-- Bảng giá -->
            <div class="price-breakdown">
              <div class="price-row">
                <span>Tạm tính</span>
                <span class="val-regular">{{ fmt(subtotal) }}</span>
              </div>
              <div class="price-row">
                <span>Phí vận chuyển</span>
                <span v-if="!shippingFee" class="val-free">MIỄN PHÍ</span>
                <span v-else class="val-regular">{{ fmt(shippingFee) }}</span>
              </div>
            </div>

            <div class="total-row">
              <span class="total-label">Tổng cộng</span>
              <span class="total-value">{{ fmt(total) }}</span>
            </div>

            <!-- Nút đặt hàng -->
            <button
              class="btn-checkout"
              :class="{ 'btn-momo': paymentMethod === 'momo' }"
              :disabled="loading || !items.length || !selectedAddressId"
              @click="handleCheckout"
            >
              <svg v-if="loading" class="icon-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span v-if="loading">Đang xử lý...</span>
              <span v-else>
                {{
                  paymentMethod === 'vnpay' ? 'Thanh toán VNPay' :
                  paymentMethod === 'momo'  ? 'Thanh toán MoMo'  :
                  'Đặt hàng (COD)'
                }}
              </span>
              <svg v-if="!loading" class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </button>
          </div>

          <div class="back-link-wrapper">
            <a href="/cart" class="back-link">
              <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại giỏ hàng
            </a>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.checkout-page {
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #f8f9fc;
  color: #333333;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
*,
*::before,
*::after {
  box-sizing: inherit;
}
a {
  text-decoration: none;
  color: inherit;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.icon-tiny {
  width: 12px;
  height: 12px;
}
.icon-small {
  width: 14px;
  height: 14px;
}
.icon-medium {
  width: 20px;
  height: 20px;
}
.icon-large {
  width: 20px;
  height: 20px;
}
.icon-xl {
  width: 24px;
  height: 24px;
}
.text-blue {
  color: #2563eb;
}
.text-gray {
  color: #6b7280;
}
.margin-top-large {
  margin-top: 20px;
}

.main-content {
  padding-top: 20px;
  padding-bottom: 24px;
}

/* Breadcrumbs */
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 24px;
}
.step {
  display: flex;
  align-items: center;
  gap: 6px;
}
.step.success {
  color: #00b14f;
}
.step.active {
  color: #2563eb;
}
.step.disabled {
  color: #9ca3af;
}
.step-number,
.step-number-outline {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
}
.step-number {
  background-color: #2563eb;
  color: white;
}
.step-number-outline {
  border: 1px solid #d1d5db;
}
.separator {
  color: #d1d5db;
}

/* Layout */
.checkout-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
@media (min-width: 1024px) {
  .checkout-layout {
    flex-direction: row;
  }
  .form-section {
    flex: 1;
  }
  .summary-section {
    width: 360px;
  }
}

/* Form */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.section-title {
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}
.action-link {
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}
.action-link:hover {
  text-decoration: underline;
}

.form-group-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}
.form-group label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 5px;
}
.form-control {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  padding: 8px 12px;
  font-size: 13px;
  outline: none;
  transition: all 0.2s;
  background-color: white;
}
.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}
.select-wrapper {
  position: relative;
}
.select-wrapper select {
  appearance: none;
  cursor: pointer;
  color: #1f2937;
}
.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: #6b7280;
  pointer-events: none;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 768px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
}

/* Payment */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.payment-option {
  display: flex;
  align-items: center;
  padding: 11px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  background-color: white;
  transition: all 0.2s;
}
.payment-option:hover {
  border-color: #d1d5db;
}
.payment-option.active {
  border-color: #3b82f6;
  background-color: rgba(239, 246, 255, 0.5);
}
.payment-option input[type="radio"] {
  width: 16px;
  height: 16px;
  accent-color: #2563eb;
  cursor: pointer;
  flex-shrink: 0;
}
.payment-content {
  margin-left: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.vnp-badge {
  width: 28px;
  height: 28px;
  background-color: #2563eb;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 10px;
  flex-shrink: 0;
}

/* ✅ MoMo badge */
.momo-badge {
  width: 28px;
  height: 28px;
  background-color: #ae2070;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.payment-title {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
}
.payment-desc {
  font-size: 12px;
  color: #6b7280;
  margin-top: 1px;
}

/* Summary */
.summary-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 20px;
}
.summary-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 18px;
}
.product-item {
  display: flex;
  gap: 12px;
}
.product-image {
  width: 52px;
  height: 52px;
  border-radius: 7px;
  background-color: #f3f4f6;
  overflow: hidden;
  flex-shrink: 0;
}
.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product-details h4 {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #111827;
}
.product-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}
.product-price {
  font-size: 13px;
  color: #2563eb;
  font-weight: 700;
  margin-top: 2px;
}
.cart-empty-note {
  font-size: 13px;
  color: #9ca3af;
  text-align: center;
  padding: 12px 0;
}

/* Pricing */
.price-breakdown {
  border-top: 1px solid #f3f4f6;
  padding-top: 14px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
}
.price-row {
  display: flex;
  justify-content: space-between;
  color: #4b5563;
}
.val-regular {
  color: #111827;
  font-weight: 500;
}
.val-free {
  color: #00b14f;
  font-weight: 700;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f3f4f6;
  padding-top: 14px;
  margin-bottom: 20px;
}
.total-label {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}
.total-value {
  font-size: 22px;
  font-weight: 900;
  color: #2563eb;
}

.btn-checkout {
  width: 100%;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(59, 130, 246, 0.25);
  transition: all 0.2s;
}
.btn-checkout:hover {
  background-color: #1d4ed8;
}

/* ✅ MoMo button style */
.btn-checkout.btn-momo {
  background-color: #ae2070;
  box-shadow: 0 3px 10px rgba(174, 32, 112, 0.25);
}
.btn-checkout.btn-momo:hover {
  background-color: #96195f;
}

.back-link-wrapper {
  margin-top: 20px;
  text-align: center;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  transition: color 0.2s;
}
.back-link:hover {
  color: #111827;
}
.btn-checkout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.icon-spin {
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>