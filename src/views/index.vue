<script setup>
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import ProductList from "../components/ProductList.vue";
import CategoryList from "../components/CategoryList.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useNotify } from "@/composables/useNotify";
import AIChatbot from "@/components/Aichatbot.vue";

const sports = [
  {
    name: "Chạy bộ",
    desc: "Bền bỉ trên mọi cung đường.",
    img: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&q=80",
  },
  {
    name: "Bóng đá",
    desc: "Làm chủ cuộc chơi.",
    img: "https://images.unsplash.com/photo-1551958219-acbc595e3c0e?w=800&q=80",
  },
  {
    name: "Bóng rổ",
    desc: "Bứt phá mọi giới hạn cao độ.",
    img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
  },
];

const route = useRoute();
const notify = useNotify();
const pageReady = ref(false);

onMounted(() => {
  if (route.query.error === "forbidden") {
    notify.toastError("Bạn không có quyền!");
  }
  pageReady.value = true;
});
</script>

<template>
  <div class="home-wrapper">
    <AppHeader />

    <section class="hero-section">
      <img src="@/assets/thba-banner.png" class="hero-banner" />
    </section>

    <main class="home-main">
      <section class="home-section">
        <div class="section-header">
          <div class="title-wrap"></div>
        </div>
        <CategoryList />
      </section>

      <section class="home-section1 bg-soft">
        <div class="section-header">
          <div class="title-wrap"></div>
        </div>
        <ProductList />
      </section>

      <section class="home-section">
        <div class="section-header text-center-wrap">
          <h2 class="section-title center">Mua sắm theo Môn thể thao</h2>
          <p class="section-subtitle">
            Tìm kiếm trang phục và dụng cụ phù hợp nhất cho niềm đam mê của bạn.
          </p>
          <div class="blue-divider center"></div>
        </div>

        <div class="sports-container">
          <div v-for="s in sports" :key="s.name" class="sport-item">
            <div class="sport-image">
              <img :src="s.img" :alt="s.name" loading="lazy" />
            </div>
            <div class="sport-content">
              <h3 class="sport-name">{{ s.name }}</h3>
              <p class="sport-desc">{{ s.desc }}</p>
              <a href="#" class="sport-link">Khám phá ngay</a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />
    <AIChatbot />
  </div>
</template>

<style scoped>
/* ══ GLOBAL STYLE ĐỒNG BỘ PRODUCTVIEW ══ */
.home-wrapper {
  /* Ép phông chữ Inter chuẩn xác */
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif !important;
  background-color: #fff;
  color: #111827; /* Màu chữ đậm chuẩn ProductView */
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ══ HERO SECTION (NÂNG CẤP) ══ */
.hero-section {
  position: relative;
  min-height: 560px;
  display: flex;
  align-items: center;
  padding: 0 64px;
  overflow: hidden;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.85) 30%,
    rgba(0, 0, 0, 0.3) 70%,
    transparent 100%
  );
  z-index: 1;
}
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
}
.hero-badge {
  display: inline-block;
  background: #ff6d00;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 6px 16px;
  border-radius: 6px;
  letter-spacing: 1px;
  margin-bottom: 24px;
}
.hero-title {
  font-size: 76px;
  font-weight: 900;
  line-height: 0.95;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: -2.5px;
}
.text-blue {
  color: #42a5f5;
}
.hero-description {
  color: #d1d5db;
  font-size: 16px;
  line-height: 1.6;
  margin-top: 24px;
  max-width: 480px;
}
.hero-actions {
  display: flex;
  gap: 16px;
  margin-top: 40px;
}

/* ══ BUTTONS STYLE ══ */
.btn-primary-lg {
  background: #1565c0; /* Màu xanh chủ đạo */
  color: #fff;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-primary-lg:hover {
  background: #0d47a1;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(21, 101, 192, 0.3);
}

.btn-outline-lg {
  background: transparent;
  color: #fff;
  border: 2.5px solid #fff;
  padding: 12px 32px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
}
.btn-outline-lg:hover {
  background: #fff;
  color: #111827;
}

/* ══ SECTION LAYOUT ══ */
.home-main {
  padding-bottom: 80px;
}
.home-section {
  padding: 80px 64px;
}
.home-section1 {
  padding: 50px 40px;
}
.bg-soft {
  background-color: #f9fafb;
} /* Màu nền xám nhạt ProductView */

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 48px;
}
.text-center-wrap {
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.section-title {
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.8px;
}
.section-subtitle {
  font-size: 15px;
  color: #6b7280;
  margin-top: 8px;
}
.blue-divider {
  width: 48px;
  height: 5px;
  background: #1565c0;
  border-radius: 10px;
  margin-top: 12px;
}
.blue-divider.center {
  margin-left: auto;
  margin-right: auto;
}

.link-more {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #1565c0;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
}
.link-more:hover {
  text-decoration: underline;
}

/* ══ SPORTS GRID (NÂNG CẤP HOVER) ══ */
.sports-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.sport-item {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  border: 1px solid #e5e7eb;
  cursor: pointer;
}
.sport-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.2, 1, 0.3, 1);
}
.sport-item:hover .sport-image img {
  transform: scale(1.1);
}

.sport-content {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85) 15%,
    transparent 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 32px;
}
.sport-name {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 6px;
}
.sport-desc {
  color: #d1d5db;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 20px;
  opacity: 0.9;
}
.sport-link {
  background: #fff;
  color: #111827;
  font-size: 13px;
  font-weight: 800;
  padding: 10px 20px;
  border-radius: 8px;
  width: fit-content;
  text-decoration: none;
  transition: all 0.2s;
}
.sport-link:hover {
  background: #1565c0;
  color: #fff;
}

/* ══ RESPONSIVE ══ */
@media (max-width: 1200px) {
  .hero-title {
    font-size: 56px;
  }
  .hero-section,
  .home-section {
    padding-left: 32px;
    padding-right: 32px;
  }
}
@media (max-width: 768px) {
  .hero-section {
    min-height: 480px;
    text-align: center;
    justify-content: center;
  }
  .hero-content {
    max-width: 100%;
  }
  .hero-actions {
    justify-content: center;
    flex-direction: column;
  }
  .sports-container {
    grid-template-columns: 1fr;
  }
  .section-title {
    font-size: 26px;
  }
}
hero-section {
  position: relative;
  width: 100%; 
  height: 600px; /* Chiều cao bạn muốn */
  padding: 0 !important; /* Quan trọng nhất: Ép bỏ lề 64px hai bên */
  margin: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-banner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Tự động cắt cúp ảnh cho vừa khít mọi màn hình */
  object-position: center; /* Luôn giữ trọng tâm ảnh ở giữa */
  display: block;
}

.hero-overlay{
  position: absolute;
  inset: 0;
}
</style>