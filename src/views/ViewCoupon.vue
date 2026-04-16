<script setup>
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import { ref, computed, onMounted } from "vue";
import { useCoupons } from "@/stores/coupons";
import { useUserCoupons } from "@/stores/couponuser";
import { useSaleProducts } from "../stores/saleproducts";
import { useRouter } from "vue-router";

const store = useCoupons();
const userCouponStore = useUserCoupons();
const saleStore = useSaleProducts();
const router = useRouter();

const categories = ["Tất cả", "Giảm phần trăm", "Giảm cố định"];
const activeCategory = ref("Tất cả");
const copiedCode = ref(null);
const searchQuery = ref("");
const loading = ref(true);
const claimingIds = ref(new Set());
const claimedIds = ref(new Set());

const countdown = ref({ h: "00", m: "00", s: "00" });
let countdownTimer = null;

function startCountdown(endTime) {
  if (!endTime) return;
  const end = new Date(endTime).getTime();
  function tick() {
    const now = Date.now();
    const diff = Math.max(0, end - now);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    countdown.value = {
      h: String(h).padStart(2, "0"),
      m: String(m).padStart(2, "0"),
      s: String(s).padStart(2, "0"),
    };
    if (diff > 0) countdownTimer = setTimeout(tick, 1000);
  }
  tick();
}

onMounted(async () => {
  await Promise.all([
    store.loadCoupons(),
    saleStore.loadFlashSale(),
    saleStore.loadSaleProducts(),
  ]);
  loading.value = false;
  if (saleStore.flashSaleEndTime) startCountdown(saleStore.flashSaleEndTime);
});

function mapColor(type) {
  return type === "percent" ? "blue" : "orange";
}
function formatDiscount(c) {
  return c.discount_type === "percent"
    ? `${parseFloat(c.discount_value)}%`
    : formatVND(c.discount_value);
}

// FIX: dùng toFixed(1) và bỏ trailing zero để tránh làm tròn sai (vd: 2699100 → 2.7M thay vì 3M)
function formatVND(val) {
  if (!val && val !== 0) return "—";
  const n = Number(val);
  if (n >= 1000000) {
    const m = n / 1000000;
    const formatted = m % 1 === 0 ? m.toFixed(0) : parseFloat(m.toFixed(1)).toString();
    return formatted + "M";
  }
  if (n >= 1000) return Math.round(n / 1000) + "K";
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

const filtered = computed(() =>
  store.coupons.filter((c) => {
    const matchCat =
      activeCategory.value === "Tất cả" ||
      (activeCategory.value === "Giảm phần trăm" &&
        c.discount_type === "percent") ||
      (activeCategory.value === "Giảm cố định" && c.discount_type === "fixed");
    const matchSearch = c.code
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    return matchCat && matchSearch;
  })
);

function copyCode(code) {
  navigator.clipboard.writeText(code).catch(() => {});
  copiedCode.value = code;
  setTimeout(() => {
    copiedCode.value = null;
  }, 2000);
}

async function saveCoupon(coupon) {
  const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;
  if (!token) {
    alert("Vui lòng đăng nhập để lưu mã giảm giá");
    return;
  }
  claimingIds.value = new Set([...claimingIds.value, coupon.id]);
  const result = await userCouponStore.claimCoupon(coupon.id);
  claimingIds.value = new Set(
    [...claimingIds.value].filter((id) => id !== coupon.id)
  );
  if (result) claimedIds.value = new Set([...claimedIds.value, coupon.id]);
}

const steps = [
  {
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    title: "Sao chép mã",
    desc: 'Nhấn nút "Sao chép" trên mã ưu đãi bạn muốn dùng.',
  },
  {
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    title: "Chọn sản phẩm",
    desc: "Thêm sản phẩm vào giỏ hàng, đảm bảo đạt giá trị đơn tối thiểu.",
  },
  {
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
    title: "Nhập mã",
    desc: 'Dán mã vào ô "Mã giảm giá" tại trang thanh toán.',
  },
  {
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    title: "Xác nhận & đặt hàng",
    desc: "Ưu đãi được áp dụng tự động. Hoàn tất thanh toán và tận hưởng!",
  },
];
</script>

<template>
  <AppHeader />

  <!-- HERO -->
  <section class="page-hero">
    <div class="page-hero-inner">
      <span class="hero-badge">Ưu đãi độc quyền</span>
      <h1 class="page-hero-title">
        Mã Giảm<br /><span class="hero-title-blue">Giá.</span>
      </h1>
      <p class="page-hero-sub">
        Săn ngay hàng chục mã ưu đãi hấp dẫn — tiết kiệm hơn mỗi lần mua sắm.
      </p>
    </div>
  </section>

  <!-- FLASH SALE -->
  <section class="flash-section" v-if="saleStore.flashSaleItems.length > 0">
    <div class="flash-header">
      <div class="flash-title-group">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        <span class="flash-title">Flash Sale</span>
        <span class="flash-sub">Kết thúc sau</span>
        <div class="countdown">
          <span class="cd-block">{{ countdown.h }}</span>
          <span class="cd-sep">:</span>
          <span class="cd-block">{{ countdown.m }}</span>
          <span class="cd-sep">:</span>
          <span class="cd-block">{{ countdown.s }}</span>
        </div>
      </div>
      <button class="see-all-btn" @click="router.push('/shop')">
        Xem tất cả →
      </button>
    </div>
    <div class="flash-grid">
      <div
        v-for="item in saleStore.flashSaleItems"
        :key="item.variant_id"
        class="flash-card"
        @click="router.push(`/product/${item.slug}`)"
      >
        <div class="flash-badge">-{{ item.sale_percent }}%</div>
        <div class="flash-img-wrap">
          <img
            :src="item.image ? `${$apiBase}/storage/${item.image}` : '/placeholder.png'"
            :alt="item.name"
            class="flash-img"
          />
        </div>
        <div class="flash-info">
          <p class="flash-name">{{ item.name }}</p>
          <div class="flash-prices">
            <span class="flash-sale-price">{{ formatVND(item.sale_price) }}</span>
            <span class="flash-orig-price">{{ formatVND(item.original_price) }}</span>
          </div>
          <div class="flash-stock-bar">
            <div
              class="flash-stock-fill"
              :style="{ width: Math.max(10, 100 - (item.stock / 30) * 100) + '%' }"
            ></div>
          </div>
          <p class="flash-stock-label">Còn {{ item.stock }} sản phẩm</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SEARCH + FILTER (giữa flash sale và sale products) -->
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

  <!-- COUPON GRID (giữa flash sale và sale products) -->
  <section class="coupon-section">
    <div class="section-head">
      <h2 class="section-title">Mã Giảm Giá</h2>
      <div class="title-bar"></div>
    </div>

    <div v-if="loading" class="coupon-grid">
      <div v-for="n in 6" :key="n" class="skeleton-card">
        <div class="sk sk-accent"></div>
        <div class="sk-body">
          <div class="sk sk-disc"></div>
          <div class="sk-lines">
            <div class="sk sk-line w80"></div>
            <div class="sk sk-line w60"></div>
            <div class="sk sk-line w50"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="filtered.length === 0" class="empty-state">
      <svg
        width="40"
        height="40"
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

    <div v-else class="coupon-grid">
      <div
        v-for="c in filtered"
        :key="c.id"
        class="coupon-card"
        :class="[`color-${mapColor(c.discount_type)}`, { unavailable: isUnavailable(c) }]"
      >
        <div v-if="isUnavailable(c)" class="unavail-overlay">
          <span class="unavail-label">
            {{ !c.is_active ? "Không hoạt động" : isExpired(c) ? "Hết hạn" : "Hết lượt" }}
          </span>
        </div>

        <div class="coupon-accent"></div>

        <!-- Discount block -->
        <div class="coupon-discount-wrap">
          <span class="coupon-discount">{{ formatDiscount(c) }}</span>
          <span class="coupon-type-label">{{
            c.discount_type === "percent" ? "Giảm %" : "Cố định"
          }}</span>
          <span v-if="c.max_discount" class="coupon-cap">Max {{ formatVND(c.max_discount) }}</span>
        </div>

        <div class="coupon-divider">
          <span class="hole hole-top"></span>
          <span class="hole hole-bottom"></span>
        </div>

        <!-- Info -->
        <div class="coupon-info">
          <h3 class="coupon-title">{{ c.code }}</h3>
          <div class="coupon-meta">
            <span class="meta-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
              </svg>
              Từ {{ formatVND(c.min_order_value) }}
            </span>
            <span class="meta-item" :class="{ 'text-danger': isExpired(c) }">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {{ c.end_date ? formatDate(c.end_date) : "Không hạn" }}
            </span>
          </div>

          <div class="progress-wrap" v-if="c.usage_limit">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: progressPct(c.used_count, c.usage_limit) + '%' }"
              ></div>
            </div>
            <span class="progress-label">{{ c.used_count }}/{{ c.usage_limit }} lượt</span>
          </div>
          <span v-else class="progress-label">Đã dùng {{ c.used_count }} • Không giới hạn</span>

          <div class="code-row">
            <span class="code-box">{{ c.code }}</span>
            <button
              class="copy-btn"
              :disabled="isUnavailable(c)"
              @click="!isUnavailable(c) && copyCode(c.code)"
              title="Sao chép"
            >
              <svg v-if="copiedCode === c.code" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            <button
              class="save-btn"
              :class="{
                'save-btn--saved': claimedIds.has(c.id),
                'save-btn--loading': claimingIds.has(c.id),
              }"
              :disabled="isUnavailable(c) || claimedIds.has(c.id) || claimingIds.has(c.id)"
              @click="saveCoupon(c)"
            >
              <template v-if="claimedIds.has(c.id)">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                Đã lưu
              </template>
              <template v-else-if="claimingIds.has(c.id)">
                <span class="save-spinner"></span>
              </template>
              <template v-else>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                Lưu
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SALE PRODUCTS (xuống dưới coupon) -->
  <section class="sale-section" v-if="saleStore.saleProducts.length > 0">
    <div class="sale-header">
      <div>
        <h2 class="sale-title">Đang Giảm Giá</h2>
        <div class="title-bar"></div>
      </div>
      <button class="see-all-btn" @click="router.push('/shop')">
        Xem tất cả →
      </button>
    </div>
    <div class="sale-grid">
      <div
        v-for="item in saleStore.saleProducts"
        :key="item.variant_id"
        class="sale-card"
        @click="router.push(`/product/${item.slug}`)"
      >
        <div class="sale-badge">-{{ item.sale_percent }}%</div>
        <div class="sale-img-wrap">
          <img
            :src="item.image ? `${$apiBase}/storage/${item.image}` : '/placeholder.png'"
            :alt="item.name"
            class="sale-img"
          />
        </div>
        <div class="sale-info">
          <p class="sale-name">{{ item.name }}</p>
          <div class="sale-prices">
            <span class="sale-price">{{ formatVND(item.sale_price) }}</span>
            <span class="sale-orig">{{ formatVND(item.original_price) }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- HOW TO USE -->
  <section class="howto-section">
    <div class="section-head">
      <h2 class="section-title">Cách sử dụng mã</h2>
      <div class="title-bar"></div>
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

/* HERO */
.page-hero {
  position: relative;
  min-height: 280px;
  background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.8) 38%,
      rgba(0, 0, 0, 0.15) 72%,
      transparent 100%
    ),
    url("https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80")
      center/cover no-repeat;
  display: flex;
  align-items: center;
  padding: 48px;
}
.page-hero-inner {
  max-width: 460px;
}
.hero-badge {
  display: inline-block;
  background: #ff6d00;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 4px;
  margin-bottom: 12px;
}
.page-hero-title {
  font-size: 52px;
  font-weight: 900;
  line-height: 1.02;
  color: #fff;
  text-transform: uppercase;
}
.hero-title-blue {
  color: #42a5f5;
}
.page-hero-sub {
  color: #d1d5db;
  font-size: 13px;
  line-height: 1.7;
  margin-top: 12px;
}

/* FLASH SALE */
.flash-section {
  padding: 24px 48px 20px;
  background: #fffbeb;
}
.flash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.flash-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.flash-title {
  font-size: 18px;
  font-weight: 800;
  color: #92400e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.flash-sub {
  font-size: 12px;
  color: #78716c;
  font-weight: 500;
}
.countdown {
  display: flex;
  align-items: center;
  gap: 3px;
}
.cd-block {
  background: #1c1917;
  color: #fbbf24;
  font-size: 13px;
  font-weight: 800;
  padding: 3px 7px;
  border-radius: 5px;
  font-variant-numeric: tabular-nums;
  min-width: 28px;
  text-align: center;
}
.cd-sep {
  color: #92400e;
  font-weight: 800;
  font-size: 14px;
}

/* FIX: auto-fill thay vì repeat(4,1fr) — card không bị kéo dài khi ít sản phẩm */
.flash-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 200px));
  gap: 12px;
}

.flash-card {
  background: #fff;
  border-radius: 12px;
  border: 1.5px solid #fde68a;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}
.flash-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
.flash-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 4px;
}
.flash-img-wrap {
  aspect-ratio: 1;
  overflow: hidden;
  background: #f9fafb;
}
.flash-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.flash-card:hover .flash-img {
  transform: scale(1.05);
}
.flash-info {
  padding: 8px 10px 10px;
}
.flash-name {
  font-size: 11px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 5px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.flash-prices {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}
.flash-sale-price {
  font-size: 13px;
  font-weight: 800;
  color: #ef4444;
}
.flash-orig-price {
  font-size: 11px;
  color: #9ca3af;
  text-decoration: line-through;
}
.flash-stock-bar {
  height: 4px;
  background: #f3f4f6;
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 4px;
}
.flash-stock-fill {
  height: 100%;
  background: linear-gradient(to right, #f59e0b, #ef4444);
  border-radius: 99px;
}
.flash-stock-label {
  font-size: 10px;
  color: #9ca3af;
}

/* FILTER */
.filter-section {
  padding: 24px 48px 0;
}
.filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.search-wrap {
  position: relative;
  flex: 0 0 240px;
}
.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: #9ca3af;
}
.search-input {
  width: 100%;
  padding: 8px 10px 8px 32px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  color: #111827;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus {
  border-color: #1565c0;
}
.category-pills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.pill {
  padding: 6px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 20px;
  font-size: 12px;
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

/* COUPON SECTION */
.coupon-section {
  padding: 20px 48px 40px;
}
.section-head {
  margin-bottom: 16px;
}
.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
}
.title-bar {
  width: 32px;
  height: 3px;
  background: #1565c0;
  border-radius: 2px;
}

.empty-state {
  text-align: center;
  padding: 48px 0;
  color: #9ca3af;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.coupon-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
@media (max-width: 1100px) {
  .coupon-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 700px) {
  .coupon-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Skeleton */
.skeleton-card {
  display: flex;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  overflow: hidden;
  height: 130px;
}
.sk-body {
  display: flex;
  gap: 12px;
  padding: 14px;
  flex: 1;
}
.sk {
  background: #f3f4f6;
  border-radius: 5px;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.sk-accent {
  width: 5px;
  flex-shrink: 0;
  border-radius: 0;
}
.sk-disc {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 6px;
}
.sk-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  padding-top: 4px;
}
.sk-line {
  height: 10px;
  border-radius: 3px;
}
.w80 { width: 80%; }
.w60 { width: 60%; }
.w50 { width: 50%; }

/* Coupon Card */
.coupon-card {
  display: flex;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}
.coupon-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}
.coupon-card.unavailable {
  opacity: 0.55;
}
.coupon-card.unavailable:hover {
  transform: none;
  box-shadow: none;
}

.unavail-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border-radius: 10px;
}
.unavail-label {
  background: #374151;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.5px;
  transform: rotate(-8deg);
}
.coupon-accent {
  width: 5px;
  flex-shrink: 0;
}
.color-blue .coupon-accent { background: #1565c0; }
.color-orange .coupon-accent { background: #ff6d00; }

.coupon-discount-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 10px;
  min-width: 68px;
  flex-shrink: 0;
  gap: 3px;
}
.color-blue .coupon-discount-wrap { background: #eff6ff; }
.color-orange .coupon-discount-wrap { background: #fff4ed; }

.coupon-discount {
  font-size: 17px;
  font-weight: 900;
  line-height: 1;
}
.color-blue .coupon-discount { color: #1565c0; }
.color-orange .coupon-discount { color: #e65100; }

.coupon-type-label {
  font-size: 9px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
}
.coupon-cap {
  font-size: 9px;
  font-weight: 600;
  text-align: center;
  padding: 1px 5px;
  border-radius: 3px;
}
.color-blue .coupon-cap { background: #dbeafe; color: #1e40af; }
.color-orange .coupon-cap { background: #ffedd5; color: #c2410c; }

.coupon-divider {
  width: 1px;
  background: repeating-linear-gradient(
    to bottom,
    #e5e7eb 0px,
    #e5e7eb 5px,
    transparent 5px,
    transparent 10px
  );
  position: relative;
  flex-shrink: 0;
}
.hole {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
}
.hole-top { top: -6px; }
.hole-bottom { bottom: -6px; }

.coupon-info {
  flex: 1;
  padding: 10px 10px 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}
.coupon-title {
  font-size: 13px;
  font-weight: 800;
  color: #111827;
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.coupon-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  color: #6b7280;
}
.text-danger { color: #c62828 !important; }

.progress-wrap {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.progress-bar {
  height: 4px;
  background: #f3f4f6;
  border-radius: 99px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.5s ease;
}
.color-blue .progress-fill { background: #1565c0; }
.color-orange .progress-fill { background: #ff6d00; }
.progress-label {
  font-size: 9.5px;
  color: #9ca3af;
}

.code-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}
.code-box {
  flex: 1;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 4px 6px;
  border: 1.5px dashed #d1d5db;
  border-radius: 5px;
  color: #374151;
  text-align: center;
  background: #f9fafb;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 6px;
  color: #fff;
  transition: opacity 0.15s;
}
.copy-btn:disabled { cursor: not-allowed; opacity: 0.5; }
.copy-btn:not(:disabled):hover { opacity: 0.82; }
.color-blue .copy-btn { background: #1565c0; }
.color-orange .copy-btn { background: #e65100; }

.save-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  padding: 0 8px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 6px;
  background: #374151;
  transition: opacity 0.15s, background 0.2s;
  white-space: nowrap;
}
.save-btn:hover:not(:disabled) { opacity: 0.88; }
.save-btn:disabled { cursor: not-allowed; opacity: 0.55; }
.save-btn--saved { background: #059669; }
.save-btn--loading { background: #6b7280; }
.save-spinner {
  width: 10px;
  height: 10px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* SALE PRODUCTS */
.sale-section {
  padding: 32px 48px;
  background: #f9fafb;
}
.sale-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
}
.sale-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
}

/* FIX: auto-fill cho sale grid cũng gọn hơn */
.sale-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.sale-card {
  background: #fff;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}
.sale-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
.sale-badge {
  position: absolute;
  top: 7px;
  right: 7px;
  z-index: 1;
  background: #1565c0;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}
.sale-img-wrap {
  aspect-ratio: 1;
  overflow: hidden;
  background: #f9fafb;
}
.sale-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.sale-card:hover .sale-img { transform: scale(1.05); }
.sale-info {
  padding: 8px 10px 10px;
}
.sale-name {
  font-size: 11px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 5px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.sale-prices {
  display: flex;
  align-items: center;
  gap: 5px;
}
.sale-price {
  font-size: 13px;
  font-weight: 800;
  color: #1565c0;
}
.sale-orig {
  font-size: 10px;
  color: #9ca3af;
  text-decoration: line-through;
}

.see-all-btn {
  background: none;
  border: 1.5px solid #e5e7eb;
  color: #374151;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 7px;
  transition: all 0.2s;
}
.see-all-btn:hover {
  border-color: #1565c0;
  color: #1565c0;
}

/* HOW TO USE */
.howto-section {
  padding: 40px 48px;
  background: #f9fafb;
}
.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.step-card {
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.step-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.07);
}
.step-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1565c0;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-icon { color: #1565c0; }
.step-title {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
}
.step-desc {
  font-size: 11.5px;
  color: #6b7280;
  line-height: 1.5;
}
</style>