<script setup>
import AppHeader from "../components/AppHeader.vue"
import AppFooter from '../components/AppFooter.vue';
import ProductList from "../components/ProductList.vue";
import CategoryList from '../components/CategoryList.vue'
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useNotify } from "@/composables/useNotify";

const sports = [
  { name: 'Chạy bộ', desc: 'Bền bỉ trên mọi cung đường.',    img: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&q=80' },
  { name: 'Bóng đá', desc: 'Làm chủ cuộc chơi.',              img: 'https://images.unsplash.com/photo-1551958219-acbc595e3c0e?w=800&q=80' },
  { name: 'Bóng rổ', desc: 'Bứt phá mọi giới hạn cao độ.',   img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80' },
]

const footerStore   = ['Đồ Nam', 'Đồ Nữ', 'Trẻ em', 'Phụ kiện']
const footerSupport = ['Trạng thái đơn hàng', 'Trả hàng', 'Vận chuyển', 'Liên hệ']
const footerPolicy  = ['Bảo mật', 'Điều khoản', 'Cookies']
const route = useRoute();
const notify = useNotify();

onMounted(() => {
  if (route.query.error === "forbidden") {
    notify.toastError("Bạn không có quyền!");
  }
});
</script>

<template>
  <AppHeader />

  <!-- ── HERO ── -->
  <section class="hero">
    <div class="hero-inner">
      <span class="hero-badge">Khai mạc mùa giải</span>
      <h1 class="hero-title">
        Thổi Bùng<br>
        <span class="hero-title-blue">Đam Mê.</span>
      </h1>
      <p class="hero-sub">
        Trang thiết bị đẳng cấp cho vận động viên hiện đại.<br>
        Vượt qua mọi giới hạn với bộ sưu tập tối ưu hiệu<br>
        suất mới nhất.
      </p>
      <div class="hero-btns">
        <button class="btn-primary">Mua ngay Hàng mới</button>
        <button class="btn-ghost">Xem Lookbook</button>
      </div>
    </div>
  </section>

  <!-- ── DANH MỤC SẢN PHẨM ── -->
  <CategoryList/>

  <ProductList/>

  <!-- ── MUA SẮM THEO MÔN THỂ THAO ── -->
  <section class="section sports-section">
    <div class="sports-head">
      <h2 class="sports-main-title">Mua sắm theo Môn thể thao</h2>
      <p class="sports-sub">Tìm kiếm trang phục và dụng cụ phù hợp nhất cho niềm đam mê của bạn.</p>
    </div>

    <div class="sports-grid">
      <div v-for="s in sports" :key="s.name" class="sport-card">
        <img :src="s.img" :alt="s.name" loading="lazy"/>
        <div class="sport-overlay">
          <p class="sport-name">{{ s.name }}</p>
          <p class="sport-desc">{{ s.desc }}</p>
          <a href="#" class="btn-explore">Khám phá ngay</a>
        </div>
      </div>
    </div>
  </section>
  <AppFooter/>
</template>

<style scoped>
/* ── RESET ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
a { text-decoration: none; color: inherit; }
button { font-family: inherit; cursor: pointer; border: none; }
ul { list-style: none; }
img { display: block; width: 100%; }

/* ──────────────────────────────────────────────────── */
/*  HERO                                               */
/* ──────────────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 480px;
  background:
    linear-gradient(to right, rgba(0,0,0,.78) 38%, rgba(0,0,0,.1) 72%, transparent 100%),
    url('https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=1600&q=80') center / cover no-repeat;
  display: flex;
  align-items: center;
  padding: 72px 48px;
}

.hero-inner { max-width: 520px; }

.hero-badge {
  display: inline-block;
  background: #FF6D00;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 68px;
  font-weight: 900;
  line-height: 1.02;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: -1px;
}
.hero-title-blue { color: #42A5F5; }

.hero-sub {
  color: #D1D5DB;
  font-size: 14.5px;
  line-height: 1.7;
  margin-top: 16px;
}

.hero-btns {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}

.btn-primary {
  background: #1565C0;
  color: #fff;
  padding: 11px 22px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: background .2s;
}
.btn-primary:hover { background: #1251a3; }

.btn-ghost {
  background: transparent;
  color: #fff;
  border: 2px solid #fff;
  padding: 9px 22px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all .2s;
}
.btn-ghost:hover { background: #fff; color: #111827; }

/* ──────────────────────────────────────────────────── */
/*  SECTION BASE                                        */
/* ──────────────────────────────────────────────────── */
.section { padding: 56px 48px; }

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}
.title-bar {
  width: 36px;
  height: 3px;
  background: #1565C0;
  border-radius: 2px;
  margin-top: 7px;
}

.see-all {
  color: #1565C0;
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
}
.see-all:hover { text-decoration: underline; }

/* ──────────────────────────────────────────────────── */
/*  CATEGORIES                                          */
/* ──────────────────────────────────────────────────── */
.categories-section {
  border-top: 1px solid #E5E7EB;
  border-bottom: 1px solid #E5E7EB;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
}

.cat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 14px 16px;
  background: var(--cat-bg);
  border: 1.5px solid transparent;
  border-radius: 14px;
  text-align: center;
  transition: transform .22s, box-shadow .22s, border-color .22s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.cat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(0,0,0,.08);
  border-color: var(--cat-accent);
}

.cat-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  transition: transform .22s;
}
.cat-card:hover .cat-icon-wrap { transform: scale(1.1); }

.cat-icon {
  font-size: 28px;
  line-height: 1;
  color: var(--cat-accent);
}

.cat-info { flex: 1; }

.cat-name {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
  margin-bottom: 3px;
}

.cat-count {
  font-size: 11px;
  color: #6B7280;
  font-weight: 500;
}

.cat-arrow {
  font-size: 13px;
  color: var(--cat-accent);
  font-weight: 700;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity .2s, transform .2s;
}
.cat-card:hover .cat-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* ──────────────────────────────────────────────────── */
/*  PRODUCTS                                            */
/* ──────────────────────────────────────────────────── */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  transition: transform .25s, box-shadow .25s;
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0,0,0,.09);
}

.prod-img-wrap {
  aspect-ratio: 1 / 1;
  background: #F3F4F6;
  overflow: hidden;
}
.prod-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .35s;
}
.product-card:hover .prod-img-wrap img { transform: scale(1.05); }

.prod-body { padding: 14px 14px 14px; }

.prod-cat {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #9CA3AF;
  margin-bottom: 4px;
}

.prod-name {
  font-size: 14.5px;
  font-weight: 600;
  color: #111827;
}

.prod-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.prod-price {
  color: #1565C0;
  font-weight: 700;
  font-size: 14.5px;
}

.cart-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  transition: background .2s, color .2s;
}
.cart-btn:hover { background: #1565C0; color: #fff; }

/* ──────────────────────────────────────────────────── */
/*  SPORTS                                              */
/* ──────────────────────────────────────────────────── */
.sports-section { padding-top: 8px; }

.sports-head {
  text-align: center;
  margin-bottom: 28px;
}

.sports-main-title {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.sports-sub {
  font-size: 14px;
  color: #6B7280;
}

.sports-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.sport-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  cursor: pointer;
}
.sport-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .4s;
}
.sport-card:hover img { transform: scale(1.06); }

.sport-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.72) 44%, transparent 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 22px;
}

.sport-name {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  text-transform: capitalize;
  line-height: 1;
}

.sport-desc {
  color: #D1D5DB;
  font-size: 13px;
  margin: 5px 0 12px;
}

.btn-explore {
  display: inline-block;
  background: #fff;
  color: #111827;
  font-size: 12px;
  font-weight: 700;
  padding: 7px 16px;
  border-radius: 6px;
  width: fit-content;
  transition: background .2s, color .2s;
}
.btn-explore:hover { background: #1565C0; color: #fff; }

/* ──────────────────────────────────────────────────── */
/*  PROMO BANNER                                        */
/* ──────────────────────────────────────────────────── */
.promo-wrap { padding: 0 48px 64px; }

.promo-banner {
  position: relative;
  background: #FF6D00;
  border-radius: 20px;
  padding: 52px 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
}

.deco {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,.09);
  pointer-events: none;
}
.deco1 { width: 300px; height: 300px; top: -80px; right: -60px; }
.deco2 { width: 200px; height: 200px; bottom: -90px; right: 160px; }

.promo-title {
  font-size: 52px;
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: -1px;
}

.promo-sub {
  color: rgba(255,255,255,.88);
  font-size: 14px;
  margin-top: 10px;
  line-height: 1.65;
}

.promo-pct {
  color: #fff;
  font-size: 18px;
  font-weight: 900;
}

.btn-promo {
  position: relative;
  z-index: 1;
  background: #fff;
  color: #FF6D00;
  font-weight: 700;
  font-size: 15px;
  padding: 14px 32px;
  border-radius: 10px;
  white-space: nowrap;
  transition: transform .2s, box-shadow .2s;
}
.btn-promo:hover { transform: scale(1.03); box-shadow: 0 8px 24px rgba(0,0,0,.15); }
</style>