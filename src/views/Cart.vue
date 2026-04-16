<script setup>
import { ref, computed, onMounted } from "vue";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import { useCart } from "../stores/carts";
import { useRouter } from "vue-router";

const router = useRouter();
const cartStore = useCart();

const couponCode = ref("");
const couponApplied = ref(false);
const couponDiscount = ref(0);
const couponError = ref("");
const loadingCheckout = ref(false);

onMounted(() => {
  cartStore.loadCart();
});

const subtotal = computed(() =>
  cartStore.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
const discountAmount = computed(() =>
  couponApplied.value
    ? Math.round(subtotal.value * (couponDiscount.value / 100))
    : 0
);
const total = computed(() => subtotal.value - discountAmount.value);

const fmt = (n) => Number(n).toLocaleString("vi-VN") + "₫";

function applyCoupon() {
  couponError.value = "";
  const code = couponCode.value.trim().toUpperCase();
  if (code === "SPORT20") {
    couponApplied.value = true;
    couponDiscount.value = 20;
  } else if (code === "SALE10") {
    couponApplied.value = true;
    couponDiscount.value = 10;
  } else {
    couponError.value = "Mã giảm giá không hợp lệ";
    couponApplied.value = false;
    couponDiscount.value = 0;
  }
}

function removeCoupon() {
  couponCode.value = "";
  couponApplied.value = false;
  couponDiscount.value = 0;
  couponError.value = "";
}

async function checkout() {
  loadingCheckout.value = true;
  await new Promise((r) => setTimeout(r, 800));
  router.push("/checkout");
  loadingCheckout.value = false;
}
</script>

<template>
  <div class="page">
    <AppHeader />

    <main class="cart-main">
      <div class="page-header">
        <div>
          <nav class="breadcrumb">
            <a href="/">Trang chủ</a>
            <i class="bi bi-chevron-right"></i>
            <span>Giỏ hàng</span>
          </nav>
          <h1 class="page-title">
            Giỏ hàng của bạn
            <span class="cart-count" v-if="cartStore.items.length"
              >({{ cartStore.items.length }})</span
            >
          </h1>
        </div>
        <button
          v-if="cartStore.items.length"
          class="btn-clear"
          @click="cartStore.clearCart()"
        >
          <i class="bi bi-trash3"></i>
          Xóa tất cả
        </button>
      </div>

      <div v-if="!cartStore.items.length" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-bag-x"></i>
        </div>
        <h2>Giỏ hàng trống</h2>
        <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        <a href="/product" class="btn-shop">
          <i class="bi bi-grid"></i>
          Tiếp tục mua sắm
        </a>
      </div>

      <div v-else class="cart-layout">
        <div class="cart-left">
          <div class="cart-items">
            <transition-group name="item-fade">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="cart-item"
              >
                <div class="item-img">
                  <img
                    :src="item.image || '/placeholder.png'"
                    :alt="item.name"
                  />
                  <span v-if="item.sale > 0" class="item-badge"
                    >-{{ item.sale }}%</span
                  >
                </div>

                <div class="item-body">
                  <div class="item-top">
                    <div>
                      <h3 class="item-name">{{ item.name }}</h3>
                      <div class="item-attrs">
                        <span
                          v-for="attr in item.attrs"
                          :key="attr.name"
                          class="attr-tag"
                        >
                          {{ attr.name }}: <b>{{ attr.value }}</b>
                        </span>
                      </div>
                    </div>
                    <button
                      class="btn-remove"
                      @click="cartStore.removeItem(item.id)"
                      title="Xóa"
                    >
                      <i class="bi bi-trash3"></i>
                    </button>
                  </div>

                  <div class="item-bottom">
                    <div class="item-price">
                      <span v-if="item.sale > 0" class="price-sale">
                        {{ fmt(item.price * (1 - item.sale / 100)) }}
                      </span>
                      <span v-else class="price-main">{{
                        fmt(item.price)
                      }}</span>
                      <span v-if="item.sale > 0" class="price-orig">{{
                        fmt(item.price)
                      }}</span>
                    </div>

                    <div class="qty-ctrl">
                      <button
                        @click="cartStore.updateQty(item.id, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                      >
                        <i class="bi bi-dash"></i>
                      </button>

                      <input
                        type="number"
                        class="qty-input"
                        :value="item.quantity"
                        @change="
                          cartStore.updateQty(item.id, $event.target.value)
                        "
                      />

                      <button
                        @click="cartStore.updateQty(item.id, item.quantity + 1)"
                        :disabled="item.quantity >= item.stock"
                      >
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>

                    <div class="item-total">
                      {{ fmt(item.price * item.quantity) }}
                    </div>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>

          <div class="cart-footer-left">
            <a href="/product" class="btn-continue">
              <i class="bi bi-arrow-left"></i>
              Tiếp tục mua sắm
            </a>
          </div>
        </div>

        <div class="cart-right">
          <div class="summary-card">
            <h2 class="summary-title">
              <i class="bi bi-receipt"></i>
              Tóm tắt đơn hàng
            </h2>

            <div class="summary-rows">
              <div class="summary-row">
                <span>Tạm tính</span>
                <span>{{ fmt(subtotal) }}</span>
              </div>
              <div class="summary-row discount-row" v-if="couponApplied">
                <span>
                  <i class="bi bi-tag"></i>
                  Giảm giá ({{ couponDiscount }}%)
                </span>
                <span class="discount-val">-{{ fmt(discountAmount) }}</span>
              </div>
            </div>

            <div class="summary-divider"></div>

            <div class="coupon-block">
              <div v-if="!couponApplied" class="coupon-input-wrap">
                <div class="coupon-field">
                  <i class="bi bi-ticket-perforated"></i>
                  <input
                    v-model="couponCode"
                    type="text"
                    placeholder="Mã giảm giá..."
                    @keyup.enter="applyCoupon"
                  />
                </div>
                <button class="btn-apply" @click="applyCoupon">Áp dụng</button>
              </div>
              <div v-else class="coupon-applied">
                <i class="bi bi-patch-check-fill"></i>
                <span
                  >Mã <b>{{ couponCode.toUpperCase() }}</b> đã áp dụng ({{
                    couponDiscount
                  }}%)</span
                >
                <button @click="removeCoupon" class="btn-remove-coupon">
                  <i class="bi bi-x"></i>
                </button>
              </div>
              <p v-if="couponError" class="coupon-error">
                <i class="bi bi-exclamation-circle"></i> {{ couponError }}
              </p>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-total">
              <span>Tổng cộng</span>
              <div>
                <div class="total-amount">{{ fmt(total) }}</div>
                <div class="total-note">Chưa bao gồm phí vận chuyển</div>
              </div>
            </div>

            <button
              class="btn-checkout"
              @click="checkout"
              :class="{ loading: loadingCheckout }"
            >
              <span v-if="!loadingCheckout">
                Tiến hành thanh toán
                <i class="bi bi-arrow-right"></i>
              </span>
              <span v-else>
                <i class="bi bi-arrow-repeat spin"></i>
                Đang xử lý...
              </span>
            </button>

            <div class="payment-methods">
              <i class="bi bi-credit-card"></i>
              <i class="bi bi-bank"></i>
              <i class="bi bi-wallet2"></i>
              <i class="bi bi-qr-code"></i>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
  color: inherit;
}
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}
img {
  display: block;
  max-width: 100%;
}

.page {
  min-height: 100vh;
  width: 100%;
  background: #f8f9fb;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #111827;
  /* Match header variables */
  --blue: #1565c0;
  --blue-dark: #0d47a1;
  --blue-light: #e3f2fd;
  --blue-mid: #1e88e5;
  --red: #ef4444;
  --green: #10b981;
  --orange: #f97316;
  --amber: #d97706;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-700: #374151;
  --gray-900: #111827;
  --radius: 12px;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.07);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
}

/* ── MAIN ── */
.cart-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 20px 60px;
}

/* ── PAGE HEADER ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--gray-400);
  margin-bottom: 6px;
}
.breadcrumb a:hover {
  color: var(--blue);
}
.breadcrumb i {
  font-size: 9px;
}
.breadcrumb span {
  color: var(--gray-700);
  font-weight: 500;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  gap: 8px;
}
.cart-count {
  font-size: 16px;
  font-weight: 500;
  color: var(--gray-400);
}

.btn-clear {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--gray-400);
  padding: 6px 12px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  transition: all 0.15s;
}
.btn-clear:hover {
  color: var(--red);
  border-color: #fecaca;
  background: #fef2f2;
}
.btn-clear i {
  font-size: 13px;
}

/* ── EMPTY STATE ── */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.empty-icon {
  width: 80px;
  height: 80px;
  background: var(--gray-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}
.empty-icon i {
  font-size: 36px;
  color: var(--gray-300);
}
.empty-state h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--gray-900);
}
.empty-state p {
  font-size: 14px;
  color: var(--gray-400);
}
.btn-shop {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--blue);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 22px;
  border-radius: 10px;
  margin-top: 8px;
  transition: background 0.18s;
}
.btn-shop:hover {
  background: var(--blue-dark);
}

/* ── LAYOUT ── */
.cart-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
  align-items: start;
}

/* ── CART LEFT ── */
.cart-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-items {
  background: #fff;
  border-radius: var(--radius);
  border: 1px solid var(--gray-200);
  overflow: hidden;
}

/* ── CART ITEM ── */
.cart-item {
  display: flex;
  gap: 14px;
  padding: 16px;
  border-bottom: 1px solid var(--gray-100);
  transition: background 0.15s;
}
.cart-item:last-child {
  border-bottom: none;
}
.cart-item:hover {
  background: #fafafa;
}

.item-img {
  position: relative;
  width: 88px;
  height: 88px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  background: var(--gray-100);
}
.item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.item-badge {
  position: absolute;
  top: 5px;
  left: 5px;
  background: var(--red);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 4px;
}

.item-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.item-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}
.item-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-attrs {
  display: flex;
  gap: 10px;
  margin-top: 3px;
}
.item-attrs span {
  font-size: 11px;
  color: var(--gray-400);
  display: flex;
  align-items: center;
  gap: 3px;
}
.item-attrs i {
  font-size: 10px;
}

.btn-remove {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-300);
  flex-shrink: 0;
  transition: all 0.15s;
}
.btn-remove:hover {
  background: #fef2f2;
  color: var(--red);
}
.btn-remove i {
  font-size: 13px;
}

.item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.item-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.price-main {
  font-size: 15px;
  font-weight: 700;
  color: var(--blue);
}
.price-sale {
  font-size: 15px;
  font-weight: 700;
  color: var(--red);
}
.price-orig {
  font-size: 12px;
  color: var(--gray-300);
  text-decoration: line-through;
}

.qty-ctrl {
  display: flex;
  align-items: center;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  overflow: hidden;
}
.qty-ctrl button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-500);
  background: #fff;
  transition: background 0.15s;
  font-size: 13px;
}
.qty-ctrl button:hover:not(:disabled) {
  background: var(--gray-100);
  color: var(--gray-900);
}
.qty-ctrl button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.qty-ctrl span {
  min-width: 32px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-900);
  border-left: 1px solid var(--gray-200);
  border-right: 1px solid var(--gray-200);
  line-height: 30px;
}

.item-total {
  font-size: 14px;
  font-weight: 700;
  color: var(--gray-900);
  min-width: 90px;
  text-align: right;
}

/* ── Cart footer left ── */
.cart-footer-left {
  padding: 4px 0;
}
.btn-continue {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--blue);
  padding: 7px 14px;
  border: 1px solid var(--blue-light);
  border-radius: 8px;
  background: var(--blue-light);
  transition: all 0.15s;
}
.btn-continue:hover {
  background: #bbdefb;
  border-color: #90caf9;
}
.btn-continue i {
  font-size: 13px;
}

/* ── UPSELL ── */
.upsell-section {
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  overflow: hidden;
}
.upsell-header {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 13px 16px;
  font-size: 13px;
  font-weight: 700;
  color: var(--amber);
  border-bottom: 1px solid var(--gray-100);
  background: #fffbeb;
}
.upsell-header i {
  font-size: 15px;
}

.upsell-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}
.upsell-card {
  padding: 14px;
  border-right: 1px solid var(--gray-100);
  transition: background 0.15s;
}
.upsell-card:last-child {
  border-right: none;
}
.upsell-card:hover {
  background: var(--gray-50);
}

.upsell-img {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
  background: var(--gray-100);
  margin-bottom: 10px;
}
.upsell-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.upsell-info h4 {
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.upsell-price {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 8px;
}
.btn-upsell-add {
  width: 100%;
  padding: 6px 0;
  border: 1px solid var(--blue);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--blue);
  background: #fff;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.btn-upsell-add:hover {
  background: var(--blue);
  color: #fff;
}

/* ── SUMMARY CARD ── */
.summary-card {
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 20px;
  position: sticky;
  top: 82px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.summary-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  gap: 7px;
}
.summary-title i {
  color: var(--blue);
  font-size: 16px;
}

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--gray-500);
}
.free-ship {
  color: var(--green);
  font-weight: 600;
}

.discount-row {
  color: var(--green);
}
.discount-row i {
  margin-right: 3px;
}
.discount-val {
  font-weight: 700;
}

.summary-divider {
  height: 1px;
  background: var(--gray-100);
}

/* ── COUPON ── */
.coupon-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.coupon-input-wrap {
  display: flex;
  gap: 7px;
}
.coupon-field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border: 1.5px solid var(--gray-200);
  border-radius: 8px;
  background: var(--gray-50);
  transition: border-color 0.2s;
}
.coupon-field:focus-within {
  border-color: var(--blue);
  background: #fff;
}
.coupon-field i {
  color: var(--gray-400);
  font-size: 13px;
}
.coupon-field input {
  border: none;
  background: transparent;
  font-size: 12px;
  color: var(--gray-900);
  outline: none;
  width: 100%;
}
.coupon-field input::placeholder {
  color: var(--gray-400);
}

.btn-apply {
  padding: 7px 14px;
  background: var(--gray-900);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  transition: background 0.15s;
  white-space: nowrap;
}
.btn-apply:hover {
  background: #1f2937;
}

.coupon-applied {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 10px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  font-size: 12px;
  color: #166534;
}
.coupon-applied i {
  color: #16a34a;
  font-size: 14px;
}
.coupon-applied span {
  flex: 1;
}
.btn-remove-coupon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  font-size: 14px;
  transition: background 0.15s;
}
.btn-remove-coupon:hover {
  background: #dcfce7;
}

.coupon-error {
  font-size: 12px;
  color: var(--red);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ── TOTAL ── */
.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.summary-total > span {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-900);
}
.total-amount {
  font-size: 22px;
  font-weight: 800;
  color: var(--blue);
  text-align: right;
  line-height: 1;
}
.total-note {
  font-size: 10px;
  color: var(--gray-400);
  text-align: right;
  margin-top: 3px;
}

/* ── CHECKOUT BTN ── */
.btn-checkout {
  width: 100%;
  background: var(--blue);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 13px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.18s, transform 0.1s;
  letter-spacing: 0.01em;
}
.btn-checkout:hover {
  background: var(--blue-dark);
}
.btn-checkout:active {
  transform: scale(0.98);
}
.btn-checkout.loading {
  background: var(--gray-400);
  cursor: not-allowed;
}
.btn-checkout i {
  font-size: 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spin {
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

/* ── PAYMENT ICONS ── */
.payment-methods {
  display: flex;
  justify-content: center;
  gap: 16px;
  color: var(--gray-300);
}
.payment-methods i {
  font-size: 20px;
}

/* ── TRUST BADGE ── */
.trust-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--gray-50);
  border: 1px solid var(--gray-100);
  border-radius: 9px;
}
.trust-badge > i {
  font-size: 20px;
  color: var(--blue);
  flex-shrink: 0;
}
.trust-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-900);
}
.trust-sub {
  font-size: 11px;
  color: var(--gray-400);
  margin-top: 1px;
}

/* ── HOTLINE ── */
.hotline {
  text-align: center;
  font-size: 12px;
  color: var(--gray-400);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.hotline i {
  font-size: 13px;
}
.hotline a {
  color: var(--blue);
  font-weight: 600;
}
.hotline a:hover {
  text-decoration: underline;
}

/* ── SHIP NOTICE ── */
.ship-notice {
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 12px;
  color: var(--gray-500);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.ship-notice i {
  font-size: 15px;
  color: var(--gray-400);
  flex-shrink: 0;
}
.ship-notice.success {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}
.ship-notice.success i {
  color: var(--green);
}

/* ── TRANSITIONS ── */
.item-fade-enter-active,
.item-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.item-fade-enter-from,
.item-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
  .summary-card {
    position: static;
  }
  .upsell-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 600px) {
  .cart-main {
    padding: 12px 12px 48px;
  }
  .page-title {
    font-size: 18px;
  }
  .upsell-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .item-bottom {
    flex-wrap: wrap;
  }
  .item-total {
    min-width: unset;
  }
}
.item-attrs {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
}
.attr-tag {
  font-size: 11px;
  color: var(--blue);
  background: var(--blue-light);
  border: 1px solid #bbdefb;
  border-radius: 5px;
  padding: 2px 8px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.attr-tag b {
  font-weight: 600;
  color: var(--blue-dark);
}
.qty-input {
  width: 45px;
  height: 30px;
  border: none;
  border-left: 1px solid var(--gray-200);
  border-right: 1px solid var(--gray-200);
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-900);
  outline: none;
  background: #fff;
}
.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.qty-input {
  -moz-appearance: textfield;
}
</style>