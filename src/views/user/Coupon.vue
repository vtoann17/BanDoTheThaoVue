<template>
  <div class="profile-page">
    <header class="header">
      <div class="header-container">
        <div class="brand">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M5.636 5.636a9 9 0 0112.728 0M12 2v20M2 12h20M5.636 18.364a9 9 0 0112.728 0"></path>
            </svg>
          </div>
          <span class="brand-name">SportGear</span>
        </div>

        <div class="search-box">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input type="text" class="search-input" placeholder="Tìm kiếm dụng cụ thể thao..." />
        </div>

        <div class="header-actions">
          <button class="cart-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span class="cart-badge">3</span>
          </button>
          
          <div class="user-menu">
            <div class="user-text">
              <span class="user-name">Nguyễn Minh</span>
              <span class="user-tier">Thành viên Bạc</span>
            </div>
            <img src="https://i.pravatar.cc/150?img=5" alt="Avatar" class="user-avatar" />
          </div>
        </div>
      </div>
    </header>

    <main class="main-wrapper">
      <aside class="sidebar">
        <div class="nav-section">
          <h4 class="nav-title">TÀI KHOẢN</h4>
          <a href="#" class="nav-link">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            Thông tin cá nhân
          </a>
          <a href="#" class="nav-link">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            Đơn hàng của tôi
          </a>
          <a href="#" class="nav-link">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Sổ địa chỉ
          </a>
          <a href="#" class="nav-link">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            Sản phẩm yêu thích
          </a>
          <a href="#" class="nav-link active">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
            Mã giảm giá
          </a>
        </div>

        <div class="nav-section">
          <h4 class="nav-title">CÀI ĐẶT</h4>
          <a href="#" class="nav-link">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            Đổi mật khẩu
          </a>
          <a href="#" class="nav-link">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Trang chủ
          </a>
          <a href="#" class="nav-link text-danger">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Đăng xuất
          </a>
        </div>
      </aside>

      <section class="content">
        <div class="page-header-row">
          <div>
            <h1 class="page-title">Mã giảm giá của tôi</h1>
            <p class="page-subtitle">Quản lý và sử dụng các ưu đãi độc quyền dành riêng cho bạn.</p>
          </div>
          <div class="tabs-group">
            <button class="tab-btn active">Tất cả</button>
            <button class="tab-btn">Sắp hết hạn</button>
            <button class="tab-btn">Đã dùng</button>
          </div>
        </div>

        <div class="voucher-grid">
          <div class="voucher-card" v-for="(voucher, index) in vouchers" :key="index">
            <div class="voucher-body">
              <div class="voucher-top">
                <div class="voucher-icon-wrap">
                  <span v-html="voucher.svgIcon" class="voucher-icon"></span>
                </div>
                <span :class="['voucher-badge', voucher.badgeClass]">{{ voucher.badgeText }}</span>
              </div>
              
              <h3 class="voucher-code">{{ voucher.code }}</h3>
              <p class="voucher-desc">{{ voucher.desc }}</p>
              
              <div :class="['voucher-date', { 'text-danger': voucher.isExpiringSoon }]">
                <svg v-if="voucher.isExpiringSoon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {{ voucher.date }}
              </div>
            </div>

            <div class="voucher-footer">
              <button class="btn-copy">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                Sao chép mã
              </button>
              <button class="btn-primary-small">Sử dụng ngay</button>
            </div>
          </div>
        </div>

        <div class="support-banner">
          <div class="support-left">
            <div class="support-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <div class="support-text">
              <h4>Bạn gặp khó khăn khi sử dụng mã?</h4>
              <p>Xem hướng dẫn sử dụng mã giảm giá hoặc liên hệ với đội ngũ hỗ trợ của chúng tôi ngay lập tức.</p>
            </div>
          </div>
          <div class="support-actions">
            <button class="btn-outline-blue">Hướng dẫn</button>
            <button class="btn-primary">Liên hệ hỗ trợ</button>
          </div>
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

// Khai báo các SVG Icon để dùng lại
const iconTag = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>`;
const iconDumbbell = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>`; // Icon tạm thay cho tạ
const iconTruck = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>`;
const iconParty = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>`;

const vouchers = ref([
  {
    code: 'SPORT20',
    desc: 'Giảm 20% cho đơn hàng từ 500k',
    date: 'Hết hạn: 31/12/2023',
    badgeText: 'HỢP LỆ',
    badgeClass: 'badge-valid',
    svgIcon: iconTag,
    isExpiringSoon: false
  },
  {
    code: 'GYMRAT',
    desc: 'Giảm 50k cho bộ sưu tập GYM',
    date: 'Hết hạn: 15/01/2024',
    badgeText: 'MỚI',
    badgeClass: 'badge-new',
    svgIcon: iconDumbbell,
    isExpiringSoon: false
  },
  {
    code: 'FREESHIP',
    desc: 'Miễn phí vận chuyển toàn quốc',
    date: 'Hết hạn: 24h tới',
    badgeText: 'SẮP HẾT HẠN',
    badgeClass: 'badge-warning',
    svgIcon: iconTruck,
    isExpiringSoon: true
  },
  {
    code: 'WELCOME100',
    desc: 'Giảm 100k cho thành viên mới',
    date: 'Hết hạn: 31/12/2023',
    badgeText: 'HỢP LỆ',
    badgeClass: 'badge-valid',
    svgIcon: iconParty,
    isExpiringSoon: false
  }
]);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* --- Global Reset & Layout Chung (Đã có từ trước) --- */
* { box-sizing: border-box; margin: 0; padding: 0; }
.profile-page { font-family: 'Inter', sans-serif; background-color: #f9fafb; color: #111827; min-height: 100vh; display: flex; flex-direction: column; }
a { text-decoration: none; }
button { font-family: inherit; cursor: pointer; }

/* --- Header --- */
.header { background-color: #ffffff; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 100; }
.header-container { max-width: 1440px; margin: 0 auto; height: 72px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; }
.brand { display: flex; align-items: center; gap: 12px; }
.brand-icon { width: 36px; height: 36px; background-color: #1a73e8; color: #ffffff; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.brand-icon svg { width: 22px; height: 22px; }
.brand-name { font-size: 20px; font-weight: 700; color: #111827; }
.search-box { position: relative; flex: 1; max-width: 600px; margin: 0 40px; }
.search-input { width: 100%; padding: 10px 16px 10px 44px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f3f4f6; font-size: 14px; outline: none; transition: all 0.2s; color: #111827; }
.search-input:focus { background-color: #ffffff; border-color: #1a73e8; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #9ca3af; }
.header-actions { display: flex; align-items: center; gap: 28px; }
.cart-btn { background: none; border: none; color: #4b5563; position: relative; display: flex; align-items: center; }
.cart-btn svg { width: 24px; height: 24px; }
.cart-btn:hover { color: #111827; }
.cart-badge { position: absolute; top: -6px; right: -8px; background-color: #f97316; color: #ffffff; font-size: 10px; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; }
.user-menu { display: flex; align-items: center; gap: 12px; padding-left: 28px; border-left: 1px solid #e5e7eb; }
.user-text { display: flex; flex-direction: column; text-align: right; }
.user-name { font-size: 14px; font-weight: 600; color: #111827;}
.user-tier { font-size: 12px; color: #9ca3af; }
.user-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }

/* --- Main Layout --- */
.main-wrapper { max-width: 1440px; margin: 0 auto; padding: 40px; display: flex; gap: 40px; width: 100%; flex: 1; }

/* --- Sidebar --- */
.sidebar { width: 260px; flex-shrink: 0; }
.nav-section { margin-bottom: 32px; display: flex; flex-direction: column; gap: 4px; }
.nav-title { font-size: 12px; font-weight: 700; color: #9ca3af; letter-spacing: 0.05em; margin-bottom: 12px; padding-left: 16px; }
.nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 16px; color: #4b5563; font-size: 14px; font-weight: 500; border-radius: 8px; transition: all 0.2s; }
.nav-link:hover { background-color: #e5e7eb; color: #111827; }
.nav-link.active { background-color: #eff6ff; color: #1a73e8; font-weight: 600; }
.nav-link.text-danger { color: #dc2626; }
.nav-link.text-danger:hover { background-color: #fee2e2; }
.nav-icon { width: 20px; height: 20px; }

/* --- Content Area --- */
.content { flex: 1; min-width: 0; max-width: 900px; }

/* Header & Tabs */
.page-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}
.page-title { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px; }
.page-subtitle { font-size: 15px; color: #6b7280; }

.tabs-group {
  display: flex;
  gap: 8px;
  background-color: #ffffff;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}
.tab-btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}
.tab-btn:hover:not(.active) { background-color: #f3f4f6; color: #111827; }
.tab-btn.active {
  background-color: #1a73e8;
  color: #ffffff;
  font-weight: 600;
}

/* --- Vouchers Grid --- */
.voucher-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}
@media (max-width: 900px) {
  .voucher-grid { grid-template-columns: 1fr; }
}

.voucher-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
}
.voucher-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.voucher-body {
  padding: 24px;
  flex: 1;
}

.voucher-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.voucher-icon-wrap {
  width: 48px;
  height: 48px;
  background-color: #eff6ff;
  color: #1a73e8;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.voucher-icon :deep(svg) { width: 24px; height: 24px; }

.voucher-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.badge-valid { background-color: #ecfdf5; color: #10b981; }
.badge-new { background-color: #eff6ff; color: #1a73e8; }
.badge-warning { background-color: #fffbeb; color: #f59e0b; }

.voucher-code {
  font-size: 28px;
  font-weight: 300;
  color: #93c5fd; /* Màu xanh nhạt mờ mờ như ảnh */
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.voucher-desc {
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 24px;
  height: 44px; /* Giữ độ cao cố định để bằng nhau */
}

.voucher-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #9ca3af;
  font-weight: 500;
}
.voucher-date svg { width: 16px; height: 16px; }
.voucher-date.text-danger { color: #ef4444; }

.voucher-footer {
  padding: 16px 24px;
  border-top: 1px dashed #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fafbfc;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

.btn-copy {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #1a73e8;
  font-size: 14px;
  font-weight: 600;
}
.btn-copy svg { width: 18px; height: 18px; }

.btn-primary-small {
  background-color: #1a73e8;
  color: #ffffff;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s;
}
.btn-primary-small:hover { background-color: #1557b0; }

/* --- Support Banner --- */
.support-banner {
  background-color: #eff6ff;
  border-radius: 16px;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.support-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.support-icon {
  width: 56px;
  height: 56px;
  background-color: #1a73e8;
  color: #ffffff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.support-icon svg { width: 28px; height: 28px; }

.support-text h4 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}
.support-text p {
  font-size: 14px;
  color: #6b7280;
  max-width: 400px;
}

.support-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.btn-outline-blue {
  background-color: transparent;
  color: #1a73e8;
  border: 1px solid #1a73e8;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-outline-blue:hover { background-color: #dbeafe; }

.btn-primary {
  background-color: #1a73e8;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s;
}
.btn-primary:hover { background-color: #1557b0; }

/* --- Footer --- */
.footer { background-color: #ffffff; border-top: 1px solid #e5e7eb; padding: 24px 0; margin-top: auto; }
.footer-container { max-width: 1440px; margin: 0 auto; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; }
.footer-brand { display: flex; align-items: center; gap: 8px; }
.footer-logo { width: 24px; height: 24px; background-color: #9ca3af; color: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
.footer-logo svg { width: 14px; height: 14px; }
.footer-name { font-size: 14px; font-weight: 700; color: #9ca3af; }
.footer-copy { font-size: 13px; color: #9ca3af; }
.footer-links { display: flex; gap: 24px; }
.footer-links a { text-decoration: none; color: #4b5563; font-size: 13px; font-weight: 500; }
.footer-links a:hover { color: #111827; }
</style>