




<script setup>
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import { ref, computed, onMounted } from "vue";
import { useCoupons } from "@/stores/coupons";

const store = useCoupons();

const categories = ["Tất cả", "Giảm phần trăm", "Giảm cố định"];
const activeCategory = ref("Tất cả");
const copiedCode = ref(null);
const searchQuery = ref("");
const loading = ref(true);

onMounted(async () => {
  await store.loadCoupons();
  loading.value = false;
});

function mapColor(type) {
  return type === "percent" ? "blue" : "orange";
}

function formatDiscount(c) {
  return c.discount_type === "percent"
    ? `${parseFloat(c.discount_value)}%`
    : formatVND(c.discount_value);
}

function formatVND(val) {
  if (!val && val !== 0) return "—";
  const n = Number(val);
  if (n >= 1000000) return (n / 1000000).toFixed(0) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toLocaleString("vi-VN") + "đ";
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
}

function progressPct(used, total) {
  if (!total) return 0;
  return Math.min(100, Math.round((used / total) * 100));
}

function isExpired(c) {
  if (!c.end_date) return false;
  return new Date(c.end_date) < new Date();
}

function isOutOfStock(c) {
  if (!c.usage_limit) return false;
  return c.used_count >= c.usage_limit;
}

function isUnavailable(c) {
  return !c.is_active || isExpired(c) || isOutOfStock(c);
}

const filtered = computed(() => {
  return store.coupons.filter((c) => {
    const matchCat =
      activeCategory.value === "Tất cả" ||
      (activeCategory.value === "Giảm phần trăm" &&
        c.discount_type === "percent") ||
      (activeCategory.value === "Giảm cố định" && c.discount_type === "fixed");
    const matchSearch = c.code
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    return matchCat && matchSearch;
  });
});

function copyCode(code) {
  navigator.clipboard.writeText(code).catch(() => {});
  copiedCode.value = code;
  setTimeout(() => {
    copiedCode.value = null;
  }, 2000);
}

const steps = [
  {
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    title: "Sao chép mã",
    desc: 'Nhấn nút "Sao chép" trên mã ưu đãi bạn muốn dùng.',
  },
  {
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    title: "Chọn sản phẩm",
    desc: "Thêm sản phẩm vào giỏ hàng, đảm bảo đạt giá trị đơn tối thiểu.",
  },
  {
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
    title: "Nhập mã",
    desc: 'Dán mã vào ô "Mã giảm giá" tại trang thanh toán.',
  },
  {
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    title: "Xác nhận & đặt hàng",
    desc: "Ưu đãi được áp dụng tự động. Hoàn tất thanh toán và tận hưởng!",
  },
];
</script>

<template>
  <AppHeader />

  <!-- ── PAGE HERO ── -->
  <section class="page-hero">
    <div class="page-hero-inner">
      <span class="hero-badge">Ưu đãi độc quyền</span>
      <h1 class="page-hero-title">
        Mã Giảm<br />
        <span class="hero-title-blue">Giá.</span>
      </h1>
      <p class="page-hero-sub">
        Săn ngay hàng chục mã ưu đãi hấp dẫn — tiết kiệm hơn<br />
        mỗi lần mua sắm trang phục và dụng cụ thể thao.
      </p>
    </div>
  </section>

  <!-- ── SEARCH + FILTER ── -->
  <section class="filter-section">
    <div class="filter-bar">
      <div class="search-wrap">
        <svg
          class="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          v-model="searchQuery"
          class="search-input"
          type="text"
          placeholder="Tìm mã giảm giá..."
        />
      </div>
      <div class="category-pills">
        <button
          v-for="cat in categories"
          :key="cat"
          class="pill"
          :class="{ active: activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>
  </section>

  <!-- ── COUPON GRID ── -->
  <section class="coupon-section">
    <!-- Loading skeleton -->
    <div v-if="loading" class="coupon-grid">
      <div v-for="n in 6" :key="n" class="skeleton-card">
        <div class="sk sk-accent"></div>
        <div class="sk-body">
          <div class="sk sk-disc"></div>
          <div class="sk-lines">
            <div class="sk sk-line w80"></div>
            <div class="sk sk-line w60"></div>
            <div class="sk sk-line w90"></div>
            <div class="sk sk-line w50"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="filtered.length === 0" class="empty-state">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#D1D5DB"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <p>Không tìm thấy mã nào phù hợp.</p>
    </div>

    <!-- Coupon cards -->
    <div v-else class="coupon-grid">
      <div
        v-for="c in filtered"
        :key="c.id"
        class="coupon-card"
        :class="[
          `color-${mapColor(c.discount_type)}`,
          { unavailable: isUnavailable(c) },
        ]"
      >
        <!-- Unavailable stamp -->
        <div v-if="isUnavailable(c)" class="unavail-overlay">
          <span class="unavail-label">
            {{
              !c.is_active
                ? "Không hoạt động"
                : isExpired(c)
                ? "Hết hạn"
                : "Hết lượt"
            }}
          </span>
        </div>

        <!-- Left accent -->
        <div class="coupon-accent"></div>

        <!-- Discount block -->
        <div class="coupon-discount-wrap">
          <span class="coupon-discount">{{ formatDiscount(c) }}</span>
          <span class="coupon-type-label">
            {{ c.discount_type === "percent" ? "Giảm %" : "Giảm cố định" }}
          </span>
          <span v-if="c.max_discount" class="coupon-cap">
            Tối đa {{ formatVND(c.max_discount) }}
          </span>
        </div>

        <!-- Dashed divider -->
        <div class="coupon-divider">
          <span class="hole hole-top"></span>
          <span class="hole hole-bottom"></span>
        </div>

        <!-- Info -->
        <div class="coupon-info">
          <div class="coupon-cat-badge">
            {{ c.discount_type === "percent" ? "Phần trăm" : "Cố định" }}
          </div>
          <h3 class="coupon-title">{{ c.code }}</h3>

          <div class="coupon-meta">
            <span class="meta-item">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
              </svg>
              Đơn tối thiểu: {{ formatVND(c.min_order_value) }}
            </span>
            <span v-if="c.start_date" class="meta-item">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Từ: {{ formatDate(c.start_date) }}
            </span>
            <span class="meta-item" :class="{ 'text-danger': isExpired(c) }">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              HSD: {{ c.end_date ? formatDate(c.end_date) : "Không giới hạn" }}
            </span>
          </div>

          <!-- Progress (chỉ hiện nếu có usage_limit) -->
          <div class="progress-wrap">
            <template v-if="c.usage_limit">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{
                    width: progressPct(c.used_count, c.usage_limit) + '%',
                  }"
                ></div>
              </div>
              <span class="progress-label"
                >Đã dùng {{ c.used_count }}/{{ c.usage_limit }}</span
              >
            </template>
            <span v-else class="progress-label"
              >Đã dùng {{ c.used_count }} lượt • Không giới hạn</span
            >
          </div>

          <!-- Code + Copy -->
          <div class="code-row">
            <span class="code-box">{{ c.code }}</span>
            <button
              class="copy-btn"
              :disabled="isUnavailable(c)"
              @click="!isUnavailable(c) && copyCode(c.code)"
            >
              <template v-if="copiedCode === c.code">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Đã sao chép
              </template>
              <template v-else>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path
                    d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                  />
                </svg>
                Sao chép
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── HOW TO USE ── -->
  <section class="howto-section section">
    <div class="section-head">
      <div>
        <h2 class="section-title">Cách sử dụng mã</h2>
        <div class="title-bar"></div>
      </div>
    </div>
    <div class="steps-grid">
      <div class="step-card" v-for="(step, i) in steps" :key="i">
        <div class="step-num">{{ i + 1 }}</div>
        <div class="step-icon" v-html="step.icon"></div>
        <h4 class="step-title">{{ step.title }}</h4>
        <p class="step-desc">{{ step.desc }}</p>
      </div>
    </div>
  </section>

  <AppFooter />
</template>

<style scoped>
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
}
img {
  display: block;
  width: 100%;
}

/* ── HERO ── */
.page-hero {
  position: relative;
  min-height: 320px;
  background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.8) 38%,
      rgba(0, 0, 0, 0.15) 72%,
      transparent 100%
    ),
    url("https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80")
      center / cover no-repeat;
  display: flex;
  align-items: center;
  padding: 60px 48px;
}
.page-hero-inner {
  max-width: 500px;
}
.hero-badge {
  display: inline-block;
  background: #ff6d00;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 14px;
}
.page-hero-title {
  font-size: 58px;
  font-weight: 900;
  line-height: 1.02;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: -1px;
}
.hero-title-blue {
  color: #42a5f5;
}
.page-hero-sub {
  color: #d1d5db;
  font-size: 14px;
  line-height: 1.7;
  margin-top: 14px;
}

/* ── FILTER ── */
.filter-section {
  padding: 24px 48px 0;
}
.filter-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.search-wrap {
  position: relative;
  flex: 0 0 260px;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9ca3af;
}
.search-input {
  width: 100%;
  padding: 9px 12px 9px 36px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13.5px;
  color: #111827;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus {
  border-color: #1565c0;
}
.category-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.pill {
  padding: 7px 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  background: #fff;
  transition: all 0.2s;
}
.pill:hover {
  border-color: #1565c0;
  color: #1565c0;
}
.pill.active {
  background: #1565c0;
  border-color: #1565c0;
  color: #fff;
}

/* ── COUPON SECTION ── */
.coupon-section {
  padding: 28px 48px 56px;
}
.empty-state {
  text-align: center;
  padding: 64px 0;
  color: #9ca3af;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.coupon-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* ── SKELETON ── */
.skeleton-card {
  display: flex;
  border-radius: 14px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  overflow: hidden;
  height: 180px;
}
.sk-body {
  display: flex;
  gap: 16px;
  padding: 20px 16px;
  flex: 1;
}
.sk {
  background: #f3f4f6;
  border-radius: 6px;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}
.sk-accent {
  width: 6px;
  flex-shrink: 0;
  border-radius: 0;
}
.sk-disc {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  border-radius: 8px;
}
.sk-lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  padding-top: 6px;
}
.sk-line {
  height: 12px;
  border-radius: 4px;
}
.w80 {
  width: 80%;
}
.w60 {
  width: 60%;
}
.w90 {
  width: 90%;
}
.w50 {
  width: 50%;
}

/* ── COUPON CARD ── */
.coupon-card {
  display: flex;
  border-radius: 14px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  overflow: hidden;
  transition: transform 0.25s, box-shadow 0.25s;
  position: relative;
}
.coupon-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.09);
}
.coupon-card.unavailable {
  opacity: 0.58;
}
.coupon-card.unavailable:hover {
  transform: none;
  box-shadow: none;
}

.unavail-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border-radius: 14px;
}
.unavail-label {
  background: #374151;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 20px;
  letter-spacing: 0.5px;
  transform: rotate(-8deg);
}

.coupon-accent {
  width: 6px;
  flex-shrink: 0;
}
.color-blue .coupon-accent {
  background: #1565c0;
}
.color-orange .coupon-accent {
  background: #ff6d00;
}

.coupon-discount-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 14px;
  min-width: 88px;
  flex-shrink: 0;
  gap: 4px;
}
.color-blue .coupon-discount-wrap {
  background: #eff6ff;
}
.color-orange .coupon-discount-wrap {
  background: #fff4ed;
}

.coupon-discount {
  font-size: 22px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.5px;
}
.color-blue .coupon-discount {
  color: #1565c0;
}
.color-orange .coupon-discount {
  color: #e65100;
}

.coupon-type-label {
  font-size: 10px;
  font-weight: 600;
  color: #9ca3af;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.coupon-cap {
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  padding: 2px 6px;
  border-radius: 4px;
}
.color-blue .coupon-cap {
  background: #dbeafe;
  color: #1e40af;
}
.color-orange .coupon-cap {
  background: #ffedd5;
  color: #c2410c;
}

.coupon-divider {
  width: 1px;
  background: repeating-linear-gradient(
    to bottom,
    #e5e7eb 0px,
    #e5e7eb 6px,
    transparent 6px,
    transparent 12px
  );
  position: relative;
  flex-shrink: 0;
}
.hole {
  position: absolute;
  width: 14px;
  height: 14px;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
}
.hole-top {
  top: -7px;
}
.hole-bottom {
  bottom: -7px;
}

.coupon-info {
  flex: 1;
  padding: 16px 16px 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.coupon-cat-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
}
.color-blue .coupon-cat-badge {
  background: #dbeafe;
  color: #1e40af;
}
.color-orange .coupon-cat-badge {
  background: #ffedd5;
  color: #c2410c;
}

.coupon-title {
  font-size: 15px;
  font-weight: 800;
  color: #111827;
  letter-spacing: 0.5px;
}

.coupon-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 2px;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: #6b7280;
}
.text-danger {
  color: #c62828 !important;
}

.progress-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}
.progress-bar {
  height: 5px;
  background: #f3f4f6;
  border-radius: 99px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.5s ease;
}
.color-blue .progress-fill {
  background: #1565c0;
}
.color-orange .progress-fill {
  background: #ff6d00;
}
.progress-label {
  font-size: 10.5px;
  color: #9ca3af;
}

.code-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.code-box {
  flex: 1;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 6px 10px;
  border: 1.5px dashed #d1d5db;
  border-radius: 6px;
  color: #374151;
  text-align: center;
  background: #f9fafb;
}
.copy-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  padding: 7px 12px;
  border-radius: 7px;
  white-space: nowrap;
  transition: opacity 0.15s;
}
.copy-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.copy-btn:not(:disabled):hover {
  opacity: 0.88;
}
.color-blue .copy-btn {
  background: #1565c0;
}
.color-orange .copy-btn {
  background: #e65100;
}

/* ── HOW TO USE ── */
.section {
  padding: 56px 48px;
}
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
}
.title-bar {
  width: 36px;
  height: 3px;
  background: #1565c0;
  border-radius: 2px;
  margin-top: 7px;
}
.howto-section {
  background: #f9fafb;
}
.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.step-card {
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  transition: transform 0.22s, box-shadow 0.22s;
}
.step-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
}
.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1565c0;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-icon {
  color: #1565c0;
}
.step-title {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}
.step-desc {
  font-size: 12.5px;
  color: #6b7280;
  line-height: 1.55;
}
</style>