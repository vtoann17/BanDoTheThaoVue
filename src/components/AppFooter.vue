<template>
     <footer class="footer">
    <div class="footer-grid">
      <!-- brand -->
      <div class="footer-brand">
        <div class="footer-logo">
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#1565C0"/>
            <path d="M7 21L14 7l7 14" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 17h10" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          </svg>
          ProSports
        </div>
        <p class="footer-desc">
          Trang thiết bị và trang phục thể thao cao cấp
          dành cho những người dẫn đầu. Chúng tôi tiếp
          sức cho các vận động viên trên toàn cầu bằng
          công nghệ tiên tiến nhất.
        </p>
        <div class="footer-socials">
          <button class="social-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </button>
          <button class="social-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </button>
          <button class="social-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Cửa hàng -->
      <div class="footer-col">
        <h4>CỬA HÀNG</h4>
        <ul>
          <li v-for="item in footerStore" :key="item"><a href="#">{{ item }}</a></li>
        </ul>
      </div>

      <!-- Hỗ trợ -->
      <div class="footer-col">
        <h4>HỖ TRỢ</h4>
        <ul>
          <li v-for="item in footerSupport" :key="item"><a href="#">{{ item }}</a></li>
        </ul>
      </div>

      <!-- Chính sách -->
      <div class="footer-col">
        <h4>CHÍNH SÁCH</h4>
        <ul>
          <li v-for="item in footerPolicy" :key="item"><a href="#">{{ item }}</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© 2024 PROSPORTS GLOBAL INC. BẢO LƯU MỌI QUYỀN.</span>
      <div class="footer-langs">
        <a href="#" class="lang-active">VIỆT NAM</a>
        <a href="#">ENGLISH</a>
      </div>
    </div>
  </footer>
</template>
<style scoped>
.footer {
  background: #1a1f2e;
  color: #9CA3AF;
  padding: 56px 48px 28px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-weight: 700;
  font-size: 17px;
  margin-bottom: 16px;
}

.footer-desc {
  font-size: 13px;
  line-height: 1.75;
  max-width: 260px;
}

.footer-socials {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.social-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #2d3748;
  color: #9CA3AF;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .2s, color .2s;
}
.social-btn:hover { background: #1565C0; color: #fff; }

.footer-col h4 {
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .5px;
  margin-bottom: 16px;
}

.footer-col ul li {
  margin-bottom: 10px;
  font-size: 13px;
}
.footer-col ul li a:hover { color: #fff; }

.footer-bottom {
  border-top: 1px solid #2d3748;
  padding-top: 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #6B7280;
}

.footer-langs {
  display: flex;
  gap: 16px;
}
.footer-langs a { font-weight: 600; color: #6B7280; }
.footer-langs a:hover,
.lang-active { color: #fff !important; }
</style>