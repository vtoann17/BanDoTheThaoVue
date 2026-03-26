<template>
  <div class="sportgear-profile">
    <header class="app-header">
      <div class="container header-inner">
        <div class="brand">
          <div class="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M5.636 5.636a9 9 0 0112.728 0M12 2v20M2 12h20M5.636 18.364a9 9 0 0112.728 0"></path>
            </svg>
          </div>
          <span class="brand-text">SportGear</span>
        </div>

        <div class="search-bar">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input type="text" placeholder="Tìm kiếm dụng cụ thể thao..." />
        </div>

        <div class="user-actions">
          <button class="cart-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span class="cart-count">3</span>
          </button>
          
          <div class="user-profile-menu">
            <div class="user-info">
              <span class="user-name">Nguyễn Minh</span>
              <span class="user-tier">Thành viên Bạc</span>
            </div>
            <img src="https://i.pravatar.cc/150?img=5" alt="User Avatar" class="avatar-img" />
          </div>
        </div>
      </div>
    </header>

    <main class="main-container">
      <aside class="sidebar">
        <div class="menu-group">
          <h4 class="menu-heading">TÀI KHOẢN</h4>
          <a href="#" class="menu-item">
            <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            Thông tin cá nhân
          </a>
          <a href="#" class="menu-item">
            <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            Đơn hàng của tôi
          </a>
          <a href="#" class="menu-item active">
            <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Sổ địa chỉ
          </a>
          <a href="#" class="menu-item">
            <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            Sản phẩm yêu thích
          </a>
          <a href="#" class="menu-item">
            <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
            Mã giảm giá
          </a>
        </div>

        <div class="menu-group">
          <h4 class="menu-heading">CÀI ĐẶT</h4>
          <a href="#" class="menu-item">
            <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            Đổi mật khẩu
          </a>
          <a href="#" class="menu-item">
            <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Trang chủ
          </a>
          <a href="#" class="menu-item text-danger">
            <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Đăng xuất
          </a>
        </div>
      </aside>

      <section class="content-area">
        
        <div class="page-top-header">
          <div class="titles">
            <h1 class="main-title">Sổ địa chỉ</h1>
            <p class="sub-title">Quản lý các địa chỉ giao hàng của bạn để thanh toán nhanh hơn.</p>
          </div>
          <button class="btn-solid-blue">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Thêm địa chỉ mới
          </button>
        </div>

        <div class="cards-wrapper">
          
          <div 
            v-for="addr in addresses" 
            :key="addr.id"
            :class="['address-box', { 'is-default': addr.isDefault }]"
          >
            <div v-if="addr.isDefault" class="badge-default">MẶC ĐỊNH</div>

            <div class="box-content">
              <div class="box-info">
                
                <div class="contact-row">
                  <span class="name">{{ addr.name }}</span>
                  <span class="divider">|</span>
                  <span class="phone">{{ addr.phone }}</span>
                </div>
                
                <div class="address-lines">
                  <p class="street">{{ addr.street }}</p>
                  <p class="city">{{ addr.city }}</p>
                </div>

                <div class="action-row">
                  <button class="action-btn text-blue">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    Chỉnh sửa
                  </button>

                  <button 
                    :class="['action-btn', addr.isDefault ? 'text-gray-disabled' : 'text-red']"
                    :disabled="addr.isDefault"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    {{ addr.isDefault ? 'Xóa (Địa chỉ mặc định)' : 'Xóa' }}
                  </button>

                  <button v-if="!addr.isDefault" class="action-btn text-gray push-right">
                    Đặt làm mặc định
                  </button>
                </div>
              </div>

              <div class="box-image">
                <img :src="addr.image" alt="Location" />
              </div>
            </div>
          </div>

          <div class="dashed-add-box">
            <div class="dashed-content">
              <div class="map-icon-box">
                <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
                <div class="plus-circle">+</div>
              </div>
              <p class="ask-text">Bạn có địa chỉ nhận hàng khác không?</p>
              <button class="btn-text-blue">Thêm địa chỉ mới ngay</button>
            </div>
          </div>

        </div>
      </section>
    </main>

    <footer class="app-footer">
      <div class="container footer-inner">
        <div class="footer-logo-group">
          <div class="f-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M5.636 5.636a9 9 0 0112.728 0M12 2v20M2 12h20M5.636 18.364a9 9 0 0112.728 0"></path>
            </svg>
          </div>
          <span class="f-name">SportGear</span>
        </div>
        <div class="f-copy">
          © 2024 SportGear. Bản quyền thuộc về Công ty TNHH Thể Thao Việt.
        </div>
        <div class="f-links">
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

const addresses = ref([
  {
    id: 1,
    name: 'Nguyễn Minh',
    phone: '0901 234 567',
    street: '123 Đường Lê Lợi, Phường Bến Thành, Quận 1',
    city: 'Thành phố Hồ Chí Minh, Việt Nam',
    isDefault: true,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    phone: '0912 345 678',
    street: '456 Đường Nguyễn Huệ, Phường Vĩnh Ninh',
    city: 'TP. Huế, Thừa Thiên Huế, Việt Nam',
    isDefault: false,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Lê Văn C',
    phone: '0987 654 321',
    street: '789 Đường Phan Chu Trinh, Phường Mỹ Long',
    city: 'TP. Long Xuyên, An Giang, Việt Nam',
    isDefault: false,
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=300&auto=format&fit=crop'
  }
]);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* --- Global Reset & Variables --- */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --blue-primary: #0066ff; /* Đổi màu xanh rực rỡ, chính xác theo mẫu */
  --blue-light: #e5f0ff; /* Màu nền xanh nhạt cho thẻ được chọn */
  --text-dark: #111827;
  --text-gray: #4b5563;
  --text-light: #9ca3af;
  --border-line: #e5e7eb;
  --page-bg: #f9fafb;
  --danger: #ef4444; 
  --orange-badge: #f97316;
}

.sportgear-profile {
  font-family: 'Inter', sans-serif;
  background-color: var(--page-bg);
  color: var(--text-dark);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a { text-decoration: none; }
button { font-family: inherit; }

/* --- Header --- */
.app-header {
  background-color: #ffffff;
  border-bottom: 1px solid var(--border-line);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
}

.header-inner {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand { display: flex; align-items: center; gap: 12px; }
.brand-logo { width: 36px; height: 36px; background-color: var(--blue-primary); color: #ffffff; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.brand-logo svg { width: 22px; height: 22px; }
.brand-text { font-size: 22px; font-weight: 800; color: var(--text-dark); letter-spacing: -0.5px; }

.search-bar { position: relative; flex: 1; max-width: 600px; margin: 0 40px; }
.search-bar input { width: 100%; padding: 10px 16px 10px 44px; border: 1px solid var(--border-line); border-radius: 8px; background-color: #f3f4f6; font-size: 14px; outline: none; transition: all 0.2s; color: var(--text-dark); }
.search-bar input:focus { background-color: #ffffff; border-color: var(--blue-primary); }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--text-light); }

.user-actions { display: flex; align-items: center; gap: 28px; }
.cart-btn { background: none; border: none; cursor: pointer; color: var(--text-gray); position: relative; display: flex; align-items: center; }
.cart-btn svg { width: 24px; height: 24px; }
.cart-btn:hover { color: var(--text-dark); }
.cart-count { position: absolute; top: -6px; right: -8px; background-color: var(--orange-badge); color: #ffffff; font-size: 10px; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; }

.user-profile-menu { display: flex; align-items: center; gap: 12px; padding-left: 28px; border-left: 1px solid var(--border-line); cursor: pointer; }
.user-info { display: flex; flex-direction: column; text-align: right; }
.user-name { font-size: 14px; font-weight: 700; color: var(--text-dark); }
.user-tier { font-size: 12px; color: var(--text-gray); }
.avatar-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }

/* --- Main Layout --- */
.main-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  gap: 40px;
  width: 100%;
  flex: 1;
}

/* --- Sidebar --- */
.sidebar { width: 260px; flex-shrink: 0; }
.menu-group { margin-bottom: 32px; display: flex; flex-direction: column; gap: 4px; }
.menu-heading { font-size: 11px; font-weight: 700; color: var(--text-light); letter-spacing: 0.05em; margin-bottom: 12px; padding-left: 16px; text-transform: uppercase; }

.menu-item { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  padding: 12px 16px; 
  color: var(--text-gray); 
  font-size: 14px; 
  font-weight: 500; 
  border-radius: 8px; 
  transition: all 0.2s; 
}
.menu-item:hover { background-color: var(--border-line); color: var(--text-dark); }
.menu-item.active { background-color: var(--blue-light); color: var(--blue-primary); font-weight: 600; }
.menu-item.text-danger { color: var(--danger); }
.menu-item.text-danger:hover { background-color: #fee2e2; }

.menu-icon { width: 20px; height: 20px; }

/* --- Content Area --- */
.content-area {
  flex: 1;
  min-width: 0;
  max-width: 900px;
}

.page-top-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 6px;
}

.sub-title {
  font-size: 14px;
  color: var(--text-gray);
}

.btn-solid-blue {
  background-color: var(--blue-primary);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-solid-blue:hover { opacity: 0.9; }
.btn-solid-blue svg { width: 18px; height: 18px; }

/* --- Address Cards --- */
.cards-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.address-box {
  position: relative;
  background-color: #ffffff;
  border: 1px solid var(--border-line); /* Viền xám thẻ thường */
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.address-box.is-default {
  border: 2px solid var(--blue-primary); /* Viền xanh nổi bật */
}

/* Badge Mặc định chuẩn góc */
.badge-default {
  position: absolute;
  top: -2px; 
  right: -2px;
  background-color: var(--blue-primary);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 6px 12px;
  border-radius: 0 12px 0 8px; /* Om sát viền bo tròn */
}

.box-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.box-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
}
.name { font-weight: 700; color: var(--text-dark); }
.divider { color: var(--border-line); font-weight: 300; margin: 0 4px; }
.phone { font-weight: 400; font-size: 14px; color: var(--text-dark); }

.address-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  line-height: 1.5;
}
.street { color: var(--text-dark); font-weight: 400; font-size: 14px; }
.city { font-weight: 700; color: var(--text-dark); font-size: 14px;}

.action-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 12px;
}

.action-btn {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.action-btn:hover { opacity: 0.8; }
.action-btn svg { width: 16px; height: 16px; }

.text-blue { color: var(--blue-primary); }
.text-red { color: var(--danger); }
.text-gray-disabled { color: var(--text-light); cursor: not-allowed; }
.text-gray { color: var(--text-gray); }
.push-right { margin-left: auto; }

/* Box Image */
.box-image {
  width: 200px;
  height: 110px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--border-line);
}

.box-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
}

/* --- Add New Dotted Box --- */
.dashed-add-box {
  border: 2px dashed #cbd5e1; /* Viền nét đứt xám nhạt */
  border-radius: 12px;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.dashed-add-box:hover {
  border-color: #93c5fd;
  background-color: var(--blue-light);
}

.dashed-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.map-icon-box {
  position: relative;
  color: var(--text-light);
  width: 32px;
  height: 32px;
  margin-bottom: 4px;
}
.map-icon-box svg { width: 100%; height: 100%; }

.ask-text { font-size: 14px; color: var(--text-gray); font-weight: 500; }
.btn-text-blue { background: none; border: none; color: var(--blue-primary); font-size: 15px; font-weight: 700; cursor: pointer; }

/* --- Footer --- */
.app-footer {
  background-color: #ffffff;
  border-top: 1px solid var(--border-line);
  padding: 24px 0;
  margin-top: auto;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-logo-group { display: flex; align-items: center; gap: 8px; }
.f-logo { width: 24px; height: 24px; background-color: var(--text-light); color: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
.f-logo svg { width: 14px; height: 14px; }
.f-name { font-size: 14px; font-weight: 700; color: var(--text-light); }
.f-copy { font-size: 13px; color: var(--text-light); }
.f-links { display: flex; gap: 24px; }
.f-links a { text-decoration: none; color: var(--text-gray); font-size: 13px; font-weight: 500; }
.f-links a:hover { color: var(--text-dark); }
</style>