
<script setup>
import { reactive, ref } from 'vue'
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";

const form = reactive({
  fullName: 'Nguyễn Văn A',
  email: 'example@gmail.com',
  phone: '090 123 4567'
})

const paymentMethod = ref('vnpay')
</script>


<template>
  <div class="checkout-page">
    <AppHeader/>

    <main class="main-content container">
      <nav class="breadcrumbs">
        <div class="step success">
          <svg class="icon-small" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
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
        <div class="form-section">
          <div class="section-header">
            <h2 class="section-title">
              <svg class="icon-large text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
              Thông tin vận chuyển
            </h2>
            <a href="#" class="action-link">
              <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Quản lý địa chỉ
            </a>
          </div>

          <div class="form-group-list">
            <div class="form-group">
              <label>Chọn từ địa chỉ đã lưu</label>
              <div class="select-wrapper">
                <select class="form-control">
                  <option>Địa chỉ mặc định (Nhà riêng) - 123 Đường ABC, Quận 1, TP. HCM</option>
                </select>
                <svg class="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            <div class="form-group">
              <label>Họ và tên</label>
              <input type="text" v-model="form.fullName" class="form-control" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="form.email" class="form-control" />
              </div>
              <div class="form-group">
                <label>Số điện thoại</label>
                <input type="tel" v-model="form.phone" class="form-control" />
              </div>
            </div>
          </div>

          <h2 class="section-title margin-top-large">
            <svg class="icon-large text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Phương thức thanh toán
          </h2>

          <div class="payment-methods">
            <label class="payment-option" :class="{ active: paymentMethod === 'cod' }">
              <input type="radio" name="payment" value="cod" v-model="paymentMethod" />
              <div class="payment-content">
                <svg class="icon-xl text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
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
          </div>
        </div>

        <div class="summary-section">
          <div class="summary-card">
            <h3 class="summary-title">Đơn hàng của bạn</h3>
            
            <div class="product-list">
              <div class="product-item">
                <div class="product-image">
                  <img src="https://via.placeholder.com/80/1a1a1a/ff3333?text=Giày" alt="Shoe" />
                </div>
                <div class="product-details">
                  <h4>Giày Elite Performance Pro</h4>
                  <div class="product-meta">Size 10 | SL: 1</div>
                  <div class="product-price">$129.99</div>
                </div>
              </div>

              <div class="product-item">
                <div class="product-image">
                  <img src="https://via.placeholder.com/80/2d3748/ffffff?text=Áo" alt="Shirt" />
                </div>
                <div class="product-details">
                  <h4>Áo nén thể thao thoáng khí</h4>
                  <div class="product-meta">Size L | SL: 2</div>
                  <div class="product-price">$45.00</div>
                </div>
              </div>
            </div>

            <div class="discount-code">
              <label>Mã giảm giá</label>
              <div class="discount-input-group">
                <input type="text" placeholder="Nhập mã" class="form-control" />
                <button class="btn-apply">Áp dụng</button>
              </div>
            </div>

            <div class="price-breakdown">
              <div class="price-row">
                <span>Tạm tính</span>
                <span class="val-regular">$249.49</span>
              </div>
              <div class="price-row">
                <span>Phí vận chuyển</span>
                <span class="val-free">MIỄN PHÍ</span>
              </div>
              <div class="price-row">
                <span>Thuế dự tính (8%)</span>
                <span class="val-regular">$20.51</span>
              </div>
            </div>

            <div class="total-row">
              <span class="total-label">Tổng cộng</span>
              <span class="total-value">$270.00</span>
            </div>

            <button class="btn-checkout">
              Đặt hàng ngay
              <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </button>

            <div class="trust-badges-wrapper">
              <div class="trust-badges">
                <div class="badge-item">
                  <svg class="icon-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                  <span>Chính hãng</span>
                </div>
                <div class="badge-item">
                  <svg class="icon-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  <span>30 Ngày đổi trả</span>
                </div>
                <div class="badge-item">
                  <svg class="icon-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
              <div class="secure-text">
                <svg class="icon-tiny" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
                Toàn bộ thông tin được mã hóa bảo mật
              </div>
            </div>
          </div>

          <div class="back-link-wrapper">
            <a href="#" class="back-link">
              <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Quay lại giỏ hàng
            </a>
          </div>
        </div>
      </div>
    </main>

    <AppFooter/>
  </div>
</template>

<style scoped>
/* Reset & Base Setup */
.checkout-page {
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #f8f9fc;
  color: #333333;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}

a {
  text-decoration: none;
  color: inherit;
}

/* Utilities */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.icon-tiny { width: 14px; height: 14px; }
.icon-small { width: 16px; height: 16px; }
.icon-medium { width: 24px; height: 24px; }
.icon-large { width: 28px; height: 28px; }
.icon-xl { width: 32px; height: 32px; }
.text-blue { color: #2563eb; }
.text-gray { color: #6b7280; }
.margin-top-large { margin-top: 32px; }

/* Header */
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #f3f4f6;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-logo {
  width: 32px;
  height: 32px;
  color: #2563eb;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.5px;
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* Main Content */
.main-content {
  padding-top: 32px;
  padding-bottom: 32px;
}

/* Breadcrumbs */
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 40px;
}

.step {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step.success { color: #00b14f; }
.step.active { color: #2563eb; }
.step.disabled { color: #9ca3af; }

.step-number, .step-number-outline {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.step-number {
  background-color: #2563eb;
  color: white;
}

.step-number-outline {
  border: 1px solid #d1d5db;
}

.separator { color: #d1d5db; }

/* Layout Grid */
.checkout-layout {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

@media (min-width: 1024px) {
  .checkout-layout {
    flex-direction: row;
  }
  .form-section { flex: 1; }
  .summary-section { width: 420px; }
}

/* Form Section */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
}

.action-link {
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}
.action-link:hover { text-decoration: underline; }

.form-group-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-control {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  outline: none;
  transition: all 0.2s;
  background-color: white;
}

.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
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
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #6b7280;
  pointer-events: none;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .form-row { grid-template-columns: 1fr 1fr; }
}

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  background-color: white;
  transition: all 0.2s;
}

.payment-option:hover { border-color: #d1d5db; }
.payment-option.active {
  border-color: #3b82f6;
  background-color: rgba(239, 246, 255, 0.5);
}

.payment-option input[type="radio"] {
  width: 20px;
  height: 20px;
  accent-color: #2563eb;
  cursor: pointer;
}

.payment-content {
  margin-left: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.vnp-badge {
  width: 32px;
  height: 32px;
  background-color: #2563eb;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
}

.payment-title {
  font-weight: 700;
  color: #111827;
}

.payment-desc {
  font-size: 14px;
  color: #6b7280;
  margin-top: 2px;
}

/* Summary Section */
.summary-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  border: 1px solid #f3f4f6;
  padding: 32px;
}

.summary-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 0;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.product-item {
  display: flex;
  gap: 16px;
}

.product-image {
  width: 64px;
  height: 64px;
  border-radius: 8px;
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
  font-weight: 700;
  color: #111827;
}

.product-meta {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.product-price {
  color: #2563eb;
  font-weight: 700;
  margin-top: 4px;
}

/* Discount Code */
.discount-code { margin-bottom: 24px; }
.discount-code label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.discount-input-group {
  display: flex;
  gap: 8px;
}

.btn-apply {
  background-color: #1e293b;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-apply:hover { background-color: #111827; }

/* Pricing */
.price-breakdown {
  border-top: 1px solid #f3f4f6;
  padding-top: 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  color: #4b5563;
}

.val-regular { color: #111827; font-weight: 500; }
.val-free { color: #00b14f; font-weight: 700; }

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f3f4f6;
  padding-top: 24px;
  margin-bottom: 32px;
}

.total-label {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.total-value {
  font-size: 30px;
  font-weight: 900;
  color: #2563eb;
}

.btn-checkout {
  width: 100%;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25);
  transition: all 0.2s;
}

.btn-checkout:hover { background-color: #1d4ed8; }

/* Trust Badges */
.trust-badges-wrapper { margin-top: 32px; }
.trust-badges {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #9ca3af;
}

.badge-item span {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.secure-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
}

.back-link-wrapper {
  margin-top: 32px;
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  transition: color 0.2s;
}
.back-link:hover { color: #111827; }

/* Footer */
.footer {
  background-color: white;
  border-top: 1px solid #f3f4f6;
  margin-top: 48px;
  padding: 32px 0;
}

.footer-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

@media (min-width: 768px) {
  .footer-inner {
    flex-direction: row;
    justify-content: space-between;
  }
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2563eb;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a:hover { color: #111827; }
</style>