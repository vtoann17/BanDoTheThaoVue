<template>
  <div class="profile-page">
    <HeaderUser :cart-count="3" :user="user" />

    <main class="main-wrapper">
      <SidebarUser :active-link="activeLink" @navigate="activeLink = $event" />

      <section class="content">
        <div class="page-header">
          <h1 class="page-title">Đơn hàng của tôi</h1>
          <p class="page-subtitle">Quản lý và theo dõi các đơn hàng gần đây của bạn.</p>
        </div>

        <div class="tabs-wrapper">
          <ul class="tabs-list">
            <li class="tab-item active">Tất cả</li>
            <li class="tab-item">Chờ thanh toán</li>
            <li class="tab-item">Đang vận chuyển</li>
            <li class="tab-item">Hoàn thành</li>
            <li class="tab-item">Đã hủy</li>
          </ul>
        </div>

        <div class="order-list">
          <div class="order-card" v-for="(order, index) in orders" :key="index">
            <div class="order-header">
              <div class="order-meta-group">
                <div class="meta-item">
                  <span class="meta-label">MÃ ĐƠN HÀNG</span>
                  <span class="meta-value">{{ order.id }}</span>
                </div>
                <div class="meta-divider"></div>
                <div class="meta-item">
                  <span class="meta-label">NGÀY ĐẶT</span>
                  <span class="meta-value">{{ order.date }}</span>
                </div>
              </div>
              <div :class="['status-badge', order.statusClass]">
                <span v-html="order.statusIcon" class="badge-icon"></span>
                {{ order.statusText }}
              </div>
            </div>

            <div class="order-body">
              <div class="product-item" v-for="(product, pIdx) in order.products" :key="pIdx">
                <img :src="product.image" :alt="product.name" class="product-img" />
                <div class="product-details">
                  <h4 class="product-name">{{ product.name }}</h4>
                  <p class="product-variant">Phân loại: {{ product.variant }}</p>
                  <p class="product-qty">Số lượng: {{ product.qty }}</p>
                  <p class="product-price">{{ product.price }}</p>
                </div>
              </div>
            </div>

            <div class="order-footer">
              <div class="order-total">
                <span class="total-text">Tổng thanh toán:</span>
                <span class="total-amount">{{ order.total }}</span>
              </div>
              <div class="order-actions">
                <button class="btn-outline">Xem chi tiết</button>
                <button class="btn-primary" v-if="order.statusClass !== 'status-canceled'">Mua lại</button>
                <button class="btn-primary" v-if="order.statusClass === 'status-canceled'">Mua lại</button>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination">
          <button class="page-btn"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">3</button>
          <button class="page-btn"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
        </div>

      </section>
    </main>

    <footer class="footer">
      <div class="footer-container">
        <div class="footer-brand">
          <div class="footer-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M5.636 5.636a9 9 0 0112.728 0M12 2v20M2 12h20M5.636 18.364a9 9 0 0112.728 0"></path>
            </svg>
          </div>
          <span class="footer-name">SportGear</span>
        </div>
        <div class="footer-copy">
          © 2024 SportGear. Bản quyền thuộc về Công ty TNHH Thể Thao Việt.
        </div>
        <div class="footer-links">
          <a href="#">Điều khoản</a>
          <a href="#">Bảo mật</a>
          <a href="#">Hỗ trợ</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HeaderUser from '../../components/HeaderUser.vue'
import SidebarUser from '../../components/SidebarUser.vue'

const iconShipping = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>`;
const iconDone = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
const iconCancel = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

const orders = ref([
  {
    id: '#SG12345',
    date: '20/10/2023',
    statusText: 'Đang vận chuyển',
    statusClass: 'status-shipping',
    statusIcon: iconShipping,
    total: '2.450.000đ',
    products: [
      {
        name: 'Giày Elite Performance Pro',
        variant: 'Đỏ / 42',
        qty: 1,
        price: '2.450.000đ',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80'
      }
    ]
  },
  {
    id: '#SG12098',
    date: '15/09/2023',
    statusText: 'Hoàn thành',
    statusClass: 'status-done',
    statusIcon: iconDone,
    total: '5.800.000đ',
    products: [
      {
        name: 'Vợt Tennis Pro Carbon X',
        variant: 'Midnight Black',
        qty: 1,
        price: '5.800.000đ',
        image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a631d6?w=150&q=80'
      }
    ]
  },
  {
    id: '#SG11562',
    date: '02/08/2023',
    statusText: 'Đã hủy',
    statusClass: 'status-canceled',
    statusIcon: iconCancel,
    total: '1.200.000đ',
    products: [
      {
        name: 'Balo Sport Utility 30L',
        variant: 'Grey / Standard',
        qty: 1,
        price: '1.200.000đ',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&q=80'
      }
    ]
  }
]);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* --- Global Reset & Variables --- */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.profile-page {
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb; /* Nền xám nhạt */
  color: #111827;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a { text-decoration: none; }
button { font-family: inherit; }

/* --- Header --- */
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1440px;
  margin: 0 auto;
  height: 72px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand { display: flex; align-items: center; gap: 12px; }
.brand-icon { width: 36px; height: 36px; background-color: #1a73e8; color: #ffffff; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.brand-icon svg { width: 22px; height: 22px; }
.brand-name { font-size: 20px; font-weight: 700; color: #111827; }

.search-box { position: relative; flex: 1; max-width: 600px; margin: 0 40px; }
.search-input { width: 100%; padding: 10px 16px 10px 44px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f3f4f6; font-size: 14px; outline: none; transition: all 0.2s; color: #111827; }
.search-input:focus { background-color: #ffffff; border-color: #1a73e8; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #9ca3af; }

.header-actions { display: flex; align-items: center; gap: 28px; }
.cart-btn { background: none; border: none; cursor: pointer; color: #4b5563; position: relative; display: flex; align-items: center; }
.cart-btn svg { width: 24px; height: 24px; }
.cart-btn:hover { color: #111827; }
.cart-badge { position: absolute; top: -6px; right: -8px; background-color: #f97316; color: #ffffff; font-size: 10px; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; }

.user-menu { display: flex; align-items: center; gap: 12px; padding-left: 28px; border-left: 1px solid #e5e7eb; cursor: pointer; }
.user-text { display: flex; flex-direction: column; text-align: right; }
.user-name { font-size: 14px; font-weight: 600; color: #111827;}
.user-tier { font-size: 12px; color: #9ca3af; }
.user-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }

/* --- Main Layout --- */
.main-wrapper {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  gap: 40px;
  width: 100%;
  flex: 1;
}

/* --- Sidebar --- */
.sidebar {
  width: 260px;
  flex-shrink: 0;
}

.nav-section {
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-title {
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
  padding-left: 16px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-link:hover { background-color: #e5e7eb; color: #111827; }
.nav-link.active { background-color: #eff6ff; color: #1a73e8; font-weight: 600; }
.nav-link.text-danger { color: #dc2626; }
.nav-link.text-danger:hover { background-color: #fee2e2; }
.nav-icon { width: 20px; height: 20px; }

/* --- Content Area --- */
.content {
  flex: 1;
  min-width: 0;
  max-width: 900px;
}

/* Page Header */
.page-header {
  margin-bottom: 32px;
}
.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}
.page-subtitle {
  font-size: 15px;
  color: #6b7280;
}

/* Tabs */
.tabs-wrapper {
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 32px;
}
.tabs-list {
  display: flex;
  list-style: none;
  gap: 32px;
}
.tab-item {
  font-size: 15px;
  font-weight: 500;
  color: #6b7280;
  padding-bottom: 16px;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}
.tab-item:hover { color: #111827; }
.tab-item.active {
  color: #1a73e8;
  font-weight: 600;
}
.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #1a73e8;
}

/* Order Cards */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

/* Order Header */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.order-meta-group {
  display: flex;
  align-items: center;
  gap: 20px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
}

.meta-value {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.meta-divider {
  width: 1px;
  height: 36px;
  background-color: #e5e7eb;
}

/* Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}
.badge-icon :deep(svg) { width: 14px; height: 14px; }

.status-shipping { background-color: #eff6ff; color: #1a73e8; }
.status-done { background-color: #ecfdf5; color: #10b981; }
.status-canceled { background-color: #f3f4f6; color: #6b7280; }

/* Order Body */
.order-body {
  padding: 24px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 20px;
}

.product-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #f3f4f6;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2px;
}

.product-variant {
  font-size: 13px;
  color: #6b7280;
}

.product-qty {
  font-size: 13px;
  color: #6b7280;
}

.product-price {
  font-size: 16px;
  font-weight: 700;
  color: #1a73e8;
  margin-top: 4px;
}

/* Order Footer */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #f3f4f6;
  background-color: #fafbfc;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.order-total {
  display: flex;
  align-items: center;
  gap: 8px;
}

.total-text {
  font-size: 14px;
  color: #6b7280;
}

.total-amount {
  font-size: 18px;
  font-weight: 700;
  color: #1a73e8;
}

.order-actions {
  display: flex;
  gap: 12px;
}

.btn-outline {
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover { background-color: #f9fafb; }

.btn-primary {
  background-color: #1a73e8;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-primary:hover { background-color: #1557b0; }

/* --- Pagination --- */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
}

.page-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(.active) { background-color: #f3f4f6; }
.page-btn.active { background-color: #1a73e8; color: #ffffff; border-color: #1a73e8; font-weight: 600; }
.page-btn svg { width: 18px; height: 18px; }

/* --- Footer --- */
.footer {
  background-color: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 24px 0;
  margin-top: auto;
}

.footer-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.footer-logo {
  width: 24px; height: 24px; background-color: #9ca3af; color: white;
  border-radius: 4px; display: flex; align-items: center; justify-content: center;
}
.footer-logo svg { width: 14px; height: 14px; }
.footer-name { font-size: 14px; font-weight: 700; color: #9ca3af; }

.footer-copy { font-size: 13px; color: #9ca3af; }

.footer-links {
  display: flex;
  gap: 24px;
}
.footer-links a {
  text-decoration: none; color: #4b5563; font-size: 13px; font-weight: 500;
}
.footer-links a:hover { color: #111827; }
</style>