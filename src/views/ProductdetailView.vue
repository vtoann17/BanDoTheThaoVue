<template>
    <div class="app">
        <header class="navbar">
            <div class="nav-container">
                <div class="brand">
                    <svg class="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                    </svg>
                    <span><span class="text-blue">ELITE</span>RUN</span>
                </div>

                <nav class="nav-center">
                    <a href="#" class="nav-link active">Cửa hàng</a>
                    <a href="#" class="nav-link">Bài tập</a>
                    <a href="#" class="nav-link">Chỉ số</a>
                    <a href="#" class="nav-link">Cộng đồng</a>
                </nav>

                <div class="nav-right">
                    <button class="icon-btn pos-rel">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span class="nav-badge">2</span>
                    </button>
                    <button class="icon-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>

        <main class="main-content">
            <section class="product-hero">
                <div class="product-gallery">
                    <div class="main-image">
                        <img src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=1000"
                            alt="Apex Pro Carbon" />
                    </div>
                    <div class="thumbnail-list">
                        <button v-for="(img, index) in thumbnails" :key="index" class="thumb-btn"
                            :class="{ active: activeImage === index }" @click="activeImage = index">
                            <img :src="img" alt="Thumbnail" />
                        </button>
                    </div>
                </div>

                <div class="product-info">
                    <div class="breadcrumb">
                        <a href="#">Giày</a>
                        <span class="sep">›</span>
                        <a href="#">Hiệu suất</a>
                        <span class="sep">›</span>
                        <span class="bc-current">Apex Pro Carbon</span>
                    </div>

                    <h1 class="product-title">Apex Pro Carbon</h1>

                    <div class="price-rating-row">
                        <div class="price">225.00 $</div>
                        <div class="rating-badge">
                            <div class="stars">
                                <svg v-for="i in 5" :key="i" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <span class="rating-score">4.8</span>
                            <span class="rating-count">(128)</span>
                        </div>
                    </div>

                    <p class="product-desc">
                        Thiết kế phá vỡ mọi giới hạn. Apex Pro Carbon kết hợp công nghệ bọt <span
                            class="text-blue fw-700">Apex-Cloud</span> độc quyền với tấm sợi carbon thế hệ mới cho cảm
                        giác bùng nổ, giúp bạn chinh phục mọi cung đường.
                    </p>

                    <div class="size-section">
                        <div class="size-header">
                            <span class="size-title">CHỌN KÍCH THƯỚC (US)</span>
                            <a href="#" class="size-guide">Hướng dẫn size</a>
                        </div>
                        <div class="size-grid">
                            <button v-for="size in sizes" :key="size" class="size-circle"
                                :class="{ active: activeSize === size }" @click="activeSize = size">
                                {{ size }}
                            </button>
                        </div>
                    </div>

                    <div class="action-row">
                        <button class="btn-add-cart">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            THÊM VÀO GIỎ HÀNG
                        </button>
                        <button class="btn-wishlist">
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <div class="features-row">
                        <div class="feature-box">
                            <svg class="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span class="feat-label">ĐỆM LÓT</span>
                            <span class="feat-value">Phản hồi</span>
                        </div>
                        <div class="feature-box">
                            <svg class="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                            <span class="feat-label">TRỌNG LƯỢNG</span>
                            <span class="feat-value">195g (S9)</span>
                        </div>
                        <div class="feature-box">
                            <svg class="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            <span class="feat-label">CHẤT LIỆU</span>
                            <span class="feat-value">Mesh 2.0</span>
                        </div>
                    </div>
                </div>
            </section>

            <section class="tech-specs">
                <div class="specs-header">
                    <h2>Thông số kỹ thuật</h2>
                    <div class="divider-line"></div>
                </div>
                <div class="specs-grid">
                    <div class="spec-item" v-for="(spec, idx) in specs" :key="idx">
                        <span class="spec-name">{{ spec.name }}</span>
                        <span class="spec-val">{{ spec.value }}</span>
                    </div>
                </div>
            </section>

            <section class="related-products">
                <div class="related-header">
                    <div>
                        <h2>Sản phẩm liên quan</h2>
                        <p>Lựa chọn hàng đầu cho các Runner</p>
                    </div>
                    <button class="btn-outline">
                        Xem tất cả
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
                <div class="related-grid">
                    <div class="rel-card" v-for="prod in relatedProducts" :key="prod.id">
                        <div class="rel-img">
                            <img :src="prod.image" :alt="prod.name" />
                        </div>
                        <h3 class="rel-name">{{ prod.name }}</h3>
                        <p class="rel-price">{{ prod.price }} $</p>
                    </div>
                </div>
            </section>
        </main>

        <footer class="footer">
            <div class="footer-container">
                <div class="brand">
                    <svg class="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                    </svg>
                    <span><span class="text-blue">ELITE</span>RUN</span>
                </div>
                <div class="footer-links">
                    <a href="#">Chính sách bảo mật</a>
                    <a href="#">Điều khoản dịch vụ</a>
                    <a href="#">Liên hệ</a>
                </div>
                <div class="copyright">
                    © 2024 EliteRun Technologies. Bảo lưu mọi quyền.
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const activeSize = ref(10)
const activeImage = ref(0)
const sizes = [7, 8, 9, 10, 11, 12]

const thumbnails = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614c3a?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=200'
]

const specs = [
    { name: 'Bề mặt', value: 'Đường trường / Chạy đua' },
    { name: 'Độ dốc gót-mũi', value: '8 mm' },
    { name: 'Hỗ trợ', value: 'Trung tính' },
    { name: 'Đế giữa', value: 'Carbon Apex-Cloud' },
    { name: 'Đế ngoài', value: 'Cao su GripPro™' },
    { name: 'Vòm bàn chân', value: 'Trung bình / Cao' }
]

const relatedProducts = [
    { id: 1, name: 'Swift Flow 4', price: '165.00', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614c3a?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Nova Stability', price: '180.00', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'TerraX Trail', price: '145.00', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: 'Zen Recovery', price: '110.00', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=400' }
]
</script>

<style scoped>
/* ── RESET & UTILS ── */
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
    width: 100%;
    height: 100%;
    object-fit: cover;
}

ul,
ol {
    list-style: none;
}

.app {
    min-height: 100vh;
    background: #fff;
    font-family: 'Be Vietnam Pro', sans-serif;
    color: #111827;
}

.text-blue {
    color: #1D4ED8;
}

.fw-700 {
    font-weight: 700;
}

/* ══ NAVBAR ══ */
.navbar {
    border-bottom: 1px solid #E5E7EB;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 200;
}

.nav-container {
    max-width: 1440px;
    /* Tăng từ 1280px lên 1440px */
    margin: 0 auto;
    height: 80px;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 900;
    font-size: 20px;
    letter-spacing: -0.5px;
}

.brand-icon {
    width: 32px;
    height: 32px;
    color: #1D4ED8;
}

.nav-center {
    display: flex;
    gap: 32px;
}

.nav-link {
    font-size: 14px;
    font-weight: 600;
    color: #6B7280;
    transition: color 0.2s;
}

.nav-link:hover,
.nav-link.active {
    color: #1D4ED8;
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 24px;
}

.icon-btn {
    width: 24px;
    height: 24px;
    color: #4B5563;
}

.icon-btn:hover {
    color: #111827;
}

.pos-rel {
    position: relative;
}

.nav-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #1D4ED8;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ══ MAIN LAYOUT ══ */
.main-content {
    max-width: 1440px;
    /* Tăng từ 1280px lên 1440px */
    margin: 0 auto;
    padding: 40px 32px;
}

/* ══ PRODUCT HERO ══ */
.product-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    /* Tăng gap từ 48px lên 80px để thoáng hơn */
    margin-bottom: 80px;
}

/* Gallery */
.main-image {
    background: #1C1C1E;
    border-radius: 24px;
    aspect-ratio: 4/3;
    overflow: hidden;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.main-image img {
    opacity: 0.9;
}

.thumbnail-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.thumb-btn {
    background: #F9FAFB;
    border-radius: 16px;
    aspect-ratio: 4/3;
    border: 2px solid transparent;
    padding: 8px;
    transition: all 0.2s;
}

.thumb-btn img {
    mix-blend-mode: multiply;
}

.thumb-btn.active {
    border-color: #1D4ED8;
}

/* Info Section */
.product-info {
    display: flex;
    flex-direction: column;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #6B7280;
    margin-bottom: 16px;
}

.breadcrumb .sep {
    color: #D1D5DB;
}

.bc-current {
    color: #111827;
}

.product-title {
    font-size: 44px;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 16px;
}

.price-rating-row {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;
}

.price {
    font-size: 32px;
    font-weight: 900;
    color: #1D4ED8;
}

.rating-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #F9FAFB;
    padding: 6px 12px;
    border-radius: 20px;
}

.stars {
    display: flex;
    color: #F97316;
    gap: 2px;
}

.stars svg {
    width: 16px;
    height: 16px;
}

.rating-score {
    font-size: 14px;
    font-weight: 700;
}

.rating-count {
    font-size: 14px;
    color: #6B7280;
}

.product-desc {
    font-size: 15px;
    color: #4B5563;
    line-height: 1.6;
    margin-bottom: 32px;
}

/* Size Selection */
.size-section {
    margin-bottom: 32px;
}

.size-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
}

.size-title {
    font-size: 13px;
    font-weight: 700;
    color: #6B7280;
    text-transform: uppercase;
}

.size-guide {
    font-size: 13px;
    font-weight: 700;
    color: #1D4ED8;
}

.size-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.size-circle {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1px solid #E5E7EB;
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    transition: all 0.2s;
}

.size-circle:hover {
    border-color: #9CA3AF;
}

.size-circle.active {
    background: #1D4ED8;
    border-color: #1D4ED8;
    color: #fff;
}

/* Action Buttons */
.action-row {
    display: flex;
    gap: 16px;
    margin-bottom: 40px;
}

.btn-add-cart {
    flex: 1;
    background: #1D4ED8;
    color: #fff;
    font-size: 16px;
    font-weight: 800;
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px;
    transition: background 0.2s;
    box-shadow: 0 8px 20px rgba(29, 78, 216, 0.2);
}

.btn-add-cart:hover {
    background: #1E40AF;
}

.btn-add-cart svg {
    width: 24px;
    height: 24px;
}

.btn-wishlist {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1px solid #E5E7EB;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9CA3AF;
    transition: all 0.2s;
    flex-shrink: 0;
}

.btn-wishlist:hover {
    color: #EF4444;
    border-color: #EF4444;
}

.btn-wishlist svg {
    width: 28px;
    height: 28px;
}

/* Features */
.features-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: auto;
}

.feature-box {
    background: #F9FAFB;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.feat-icon {
    width: 24px;
    height: 24px;
    color: #1D4ED8;
    margin-bottom: 8px;
}

.feat-label {
    font-size: 10px;
    font-weight: 800;
    color: #9CA3AF;
    margin-bottom: 4px;
}

.feat-value {
    font-size: 14px;
    font-weight: 700;
    color: #111827;
}

/* ══ TECH SPECS ══ */
.tech-specs {
    border: 1px solid #F3F4F6;
    border-radius: 32px;
    padding: 56px;
    margin-bottom: 80px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.specs-header {
    text-align: center;
    margin-bottom: 40px;
}

.specs-header h2 {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 12px;
}

.divider-line {
    width: 64px;
    height: 4px;
    background: #1D4ED8;
    margin: 0 auto;
    border-radius: 2px;
}

.specs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 80px;
    row-gap: 32px;
}

.spec-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.spec-name {
    font-size: 15px;
    font-weight: 500;
    color: #6B7280;
}

.spec-val {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
}

/* ══ RELATED PRODUCTS ══ */
.related-products {
    margin-bottom: 80px;
}

.related-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 32px;
}

.related-header h2 {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 8px;
}

.related-header p {
    color: #6B7280;
    font-size: 15px;
}

.btn-outline {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: 1px solid #E5E7EB;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 700;
    color: #1D4ED8;
    transition: background 0.2s;
}

.btn-outline:hover {
    background: #F9FAFB;
}

.btn-outline svg {
    width: 16px;
    height: 16px;
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
}

.rel-card {
    cursor: pointer;
}

.rel-img {
    background: #F3F4F6;
    border-radius: 20px;
    aspect-ratio: 4/5;
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    overflow: hidden;
}

.rel-img img {
    mix-blend-mode: multiply;
    transition: transform 0.3s ease;
}

.rel-card:hover .rel-img img {
    transform: scale(1.08);
}

.rel-name {
    font-size: 16px;
    font-weight: 800;
    margin-bottom: 4px;
}

.rel-price {
    font-size: 15px;
    font-weight: 800;
    color: #1D4ED8;
}

/* ══ FOOTER ══ */
.footer {
    border-top: 1px solid #E5E7EB;
    margin-top: 40px;
}

.footer-container {
    max-width: 1440px;
    /* Tăng từ 1280px lên 1440px */
    margin: 0 auto;
    padding: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.footer-links {
    display: flex;
    gap: 24px;
    font-size: 14px;
    font-weight: 600;
    color: #6B7280;
}

.footer-links a:hover {
    color: #111827;
}

.copyright {
    font-size: 13px;
    color: #9CA3AF;
}
</style>