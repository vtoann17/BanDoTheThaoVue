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
          <a href="#" class="nav-link active">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            Sản phẩm yêu thích
          </a>
          <a href="#" class="nav-link">
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
        <div class="page-header">
          <h1 class="page-title">Sản phẩm yêu thích</h1>
          <p class="page-subtitle">Quản lý danh sách các sản phẩm bạn đã lưu để mua sau.</p>
        </div>

        <div class="favorite-grid">
          <div class="favorite-card" v-for="(product, index) in favoriteProducts" :key="index">
            <button class="btn-heart">
              <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
            </button>

            <div class="fav-img-wrap">
              <img :src="product.image" :alt="product.name" class="fav-img" />
            </div>

            <div class="fav-info">
              <h3 class="fav-name">{{ product.name }}</h3>
              <div class="fav-meta">
                <span class="fav-price">{{ product.price }}</span>
                <span class="fav-rating">
                  <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                  {{ product.rating }}
                </span>
              </div>
            </div>

            <button class="btn-add-cart">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              Thêm vào giỏ
            </button>
          </div>

          <div class="explore-card">
            <div class="explore-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <span class="explore-text">Khám phá thêm</span>
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

const favoriteProducts = ref([
  {
    name: 'Giày Chạy Bộ Nike Air Zoom Pegasus 40',
    price: '3.250.000 VNĐ',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'
  },
  {
    name: 'Vợt Cầu Lông Yonex Astrox 99 Pro Chính Hãng',
    price: '4.100.000 VNĐ',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80'
  },
  {
    name: 'Thảm Tập Yoga Adidas 8mm Chống Trượt',
    price: '850.000 VNĐ',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80'
  },
  {
    name: 'Quả Bóng Đá Molten Vantaggio FIFA Quality',
    price: '1.250.000 VNĐ',
    rating: '4.5',
    image: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400&q=80'
  },
  {
    name: 'Găng Tay Tập Gym Harbinger Pro WristWrap',
    price: '450.000 VNĐ',
    rating: '4.6',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80'
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
  background-color: #f9fafb;
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

/* --- Favorites Grid --- */
.favorite-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Responseive cho màn nhỏ hơn một chút */
@media (max-width: 1024px) {
  .favorite-grid { grid-template-columns: repeat(2, 1fr); }
}

.favorite-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 16px;
  position: relative;
  transition: box-shadow 0.2s, transform 0.2s;
}

.favorite-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-heart {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  z-index: 10;
  transition: transform 0.2s;
}
.btn-heart:hover { transform: scale(1.1); }
.btn-heart svg { width: 16px; height: 16px; fill: currentColor; }

.fav-img-wrap {
  width: 100%;
  height: 200px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fav-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fav-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fav-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 40px;
}

.fav-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fav-price {
  font-size: 16px;
  font-weight: 700;
  color: #1a73e8;
}

.fav-rating {
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}
.fav-rating svg { width: 14px; height: 14px; color: #fbbf24; fill: currentColor; }

.btn-add-cart {
  width: 100%;
  margin-top: 16px;
  background-color: #1a73e8;
  color: #ffffff;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;
}
.btn-add-cart:hover { background-color: #1557b0; }
.btn-add-cart svg { width: 18px; height: 18px; }

/* --- Explore Card --- */
.explore-card {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 350px;
}
.explore-card:hover {
  border-color: #1a73e8;
  color: #1a73e8;
  background-color: #eff6ff;
}
.explore-icon {
  width: 48px;
  height: 48px;
  background-color: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}
.explore-card:hover .explore-icon {
  background-color: #dbeafe;
}
.explore-icon svg { width: 24px; height: 24px; }
.explore-text { font-size: 14px; font-weight: 600; }

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

.footer-brand { display: flex; align-items: center; gap: 8px; }
.footer-logo { width: 24px; height: 24px; background-color: #9ca3af; color: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
.footer-logo svg { width: 14px; height: 14px; }
.footer-name { font-size: 14px; font-weight: 700; color: #9ca3af; }
.footer-copy { font-size: 13px; color: #9ca3af; }
.footer-links { display: flex; gap: 24px; }
.footer-links a { text-decoration: none; color: #4b5563; font-size: 13px; font-weight: 500; }
.footer-links a:hover { color: #111827; }
</style>