<template>
  <div class="profile-page">
    <HeaderUser :cart-count="3" :user="user" />
    <main class="main-wrapper">
      <SidebarUser :active-link="activeLink" @navigate="activeLink = $event" />
      <section class="content">
        <div class="page-header-row">
          <div>
            <h1 class="page-title">Mã giảm giá của tôi</h1>
            <p class="page-subtitle">
              Quản lý và sử dụng các ưu đãi độc quyền dành riêng cho bạn.
            </p>
          </div>
          <div class="tabs-group">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              :class="['tab-btn', { active: filters.status === tab.value }]"
              @click="changeTab(tab.value)"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải mã giảm giá...</p>
        </div>

        <div v-else-if="store.userCoupons.length === 0" class="empty-state">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
            />
          </svg>
          <p>Bạn chưa có mã giảm giá nào</p>
        </div>

        <div v-else class="voucher-grid">
          <div
            class="voucher-card"
            v-for="coupon in store.userCoupons"
            :key="coupon.id"
            :class="{ 'card-expired': isExpired(coupon) }"
          >
            <!-- Left tear -->
            <div class="voucher-left">
              <div class="voucher-icon-wrap">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div class="voucher-value">
                {{ formatValue(coupon) }}
              </div>
              <div class="voucher-min" v-if="coupon.min_order_value">
                Đơn từ {{ formatMoney(coupon.min_order_value) }}đ
              </div>
            </div>

            <!-- Tear line -->
            <div class="tear-line">
              <div class="tear-dot top"></div>
              <div class="tear-dashes"></div>
              <div class="tear-dot bottom"></div>
            </div>

            <!-- Right content -->
            <div class="voucher-right">
              <div class="voucher-right-top">
                <span class="voucher-code">{{ coupon.code }}</span>
                <span :class="['voucher-badge', getBadgeClass(coupon)]">
                  {{ getBadgeText(coupon) }}
                </span>
              </div>

              <div class="voucher-meta">
                <div
                  class="meta-item"
                  :class="{
                    'text-danger': isExpiringSoon(coupon),
                    'text-expired': isExpired(coupon),
                  }"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{ formatDate(coupon.end_date) }}
                </div>
                <div class="meta-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  {{ formatUsage(coupon) }}
                </div>
              </div>

              <div class="voucher-actions">
                <button
                  class="btn-copy"
                  @click="copyCode(coupon.code)"
                  :disabled="isExpired(coupon)"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Sao chép
                </button>
                <button
                  class="btn-use"
                  :disabled="isExpired(coupon)"
                  @click="$router.push('/')"
                >
                  Dùng ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="store.lastPage > 1" class="pagination">
          <button
            class="page-btn"
            :disabled="store.currentPage === 1"
            @click="changePage(store.currentPage - 1)"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            v-for="page in pageNumbers"
            :key="page"
            :class="['page-btn', { active: page === store.currentPage }]"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          <button
            class="page-btn"
            :disabled="store.currentPage === store.lastPage"
            @click="changePage(store.currentPage + 1)"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-container">
        <div class="footer-brand">
          <div class="footer-logo">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path
                d="M5.636 5.636a9 9 0 0112.728 0M12 2v20M2 12h20M5.636 18.364a9 9 0 0112.728 0"
              ></path>
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
import { ref, computed, onMounted } from "vue";
import HeaderUser from "../../components/HeaderUser.vue";
import SidebarUser from "../../components/SidebarUser.vue";
import { useUserCoupons } from "../../stores/couponuser";

const store = useUserCoupons();
const activeLink = ref("coupons");
const loading = ref(false);

const tabs = [
  { label: "Tất cả", value: "" },
  { label: "Sắp hết hạn", value: "expiring" },
  { label: "Đã dùng", value: "used" },
  { label: "Đã hết hạn", value: "expired" },
];

const filters = ref({
  status: "",
  sort_by: "claimed_at",
  sort_dir: "desc",
  per_page: 10,
  page: 1,
});

const fetchCoupons = async () => {
  loading.value = true;
  await store.loadUserCoupons(filters.value);
  loading.value = false;
};

onMounted(fetchCoupons);

const changeTab = (status) => {
  filters.value.status = status;
  filters.value.page = 1;
  fetchCoupons();
};

const changePage = (page) => {
  filters.value.page = page;
  fetchCoupons();
};

const pageNumbers = computed(() => {
  const total = store.lastPage;
  const current = store.currentPage;
  const delta = 2;
  const range = [];
  for (
    let i = Math.max(1, current - delta);
    i <= Math.min(total, current + delta);
    i++
  ) {
    range.push(i);
  }
  return range;
});

// Dùng end_date (field thực tế từ API), không phải expired_at
const isExpired = (coupon) => {
  if (!coupon.end_date) return false;
  return new Date(coupon.end_date) < new Date();
};

const isExpiringSoon = (coupon) => {
  if (!coupon.end_date) return false;
  const diff = new Date(coupon.end_date) - new Date();
  return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
};

const getBadgeClass = (coupon) => {
  if (!coupon.is_active || isExpired(coupon)) return "badge-expired";
  if (isExpiringSoon(coupon)) return "badge-warning";
  return "badge-valid";
};

const getBadgeText = (coupon) => {
  if (!coupon.is_active || isExpired(coupon)) return "Hết hạn";
  if (isExpiringSoon(coupon)) return "Sắp hết hạn";
  return "Hợp lệ";
};

const formatDate = (date) => {
  if (!date) return "Không giới hạn";
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const formatMoney = (val) => Number(val).toLocaleString("vi-VN");

const formatValue = (coupon) => {
  if (coupon.discount_type === "percent") {
    return `-${Number(coupon.discount_value)}%`;
  }
  return `-${formatMoney(coupon.discount_value)}đ`;
};

const formatUsage = (coupon) => {
  const used = coupon.used_count ?? 0;
  if (!coupon.usage_limit) return `Đã dùng: ${used}`;
  return `${used} / ${coupon.usage_limit} lượt`;
};

const copyCode = (code) => {
  navigator.clipboard.writeText(code);
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.profile-page {
  font-family: "Inter", sans-serif;
  background-color: #f3f4f6;
  color: #111827;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
a {
  text-decoration: none;
}
button {
  font-family: inherit;
  cursor: pointer;
}

.main-wrapper {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  gap: 40px;
  width: 100%;
  flex: 1;
}
.content {
  flex: 1;
  min-width: 0;
}

/* Header */
.page-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
}
.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}
.page-subtitle {
  font-size: 14px;
  color: #6b7280;
}

/* Tabs */
.tabs-group {
  display: flex;
  gap: 6px;
  background: #fff;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}
.tab-btn {
  padding: 7px 16px;
  border-radius: 7px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}
.tab-btn:hover:not(.active) {
  background: #f3f4f6;
  color: #111827;
}
.tab-btn.active {
  background: #1a73e8;
  color: #fff;
  font-weight: 600;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 0;
  color: #9ca3af;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #1a73e8;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Empty */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 0;
  color: #9ca3af;
}
.empty-state svg {
  width: 48px;
  height: 48px;
}
.empty-state p {
  font-size: 14px;
}

/* Voucher Grid */
.voucher-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

/* Voucher Card — ticket style */
.voucher-card {
  background: #fff;
  border-radius: 14px;
  display: flex;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
}
.voucher-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}
.voucher-card.card-expired {
  opacity: 0.6;
  filter: grayscale(0.3);
}

/* Left panel */
.voucher-left {
  width: 96px;
  flex-shrink: 0;
  background: linear-gradient(160deg, #1a73e8 0%, #0d5cb8 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  gap: 6px;
}
.voucher-icon-wrap {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 4px;
}
.voucher-icon-wrap svg {
  width: 20px;
  height: 20px;
}
.voucher-value {
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  text-align: center;
  line-height: 1.2;
  word-break: break-all;
}
.voucher-min {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  line-height: 1.3;
}

/* Tear line */
.tear-line {
  width: 14px;
  flex-shrink: 0;
  background: #f3f4f6;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.tear-dot {
  width: 14px;
  height: 14px;
  background: #f3f4f6;
  border-radius: 50%;
  flex-shrink: 0;
  position: absolute;
}
.tear-dot.top {
  top: -7px;
}
.tear-dot.bottom {
  bottom: -7px;
}
.tear-dashes {
  flex: 1;
  width: 1px;
  background: repeating-linear-gradient(
    to bottom,
    #d1d5db 0px,
    #d1d5db 5px,
    transparent 5px,
    transparent 10px
  );
  margin: 8px 0;
}

/* Right panel */
.voucher-right {
  flex: 1;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}
.voucher-right-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.voucher-code {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  letter-spacing: 0.03em;
  font-family: ui-monospace, monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.voucher-badge {
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}
.badge-valid {
  background: #ecfdf5;
  color: #10b981;
}
.badge-warning {
  background: #fffbeb;
  color: #f59e0b;
}
.badge-expired {
  background: #f3f4f6;
  color: #9ca3af;
}

/* Meta rows */
.voucher-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}
.meta-item svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}
.meta-item.text-danger {
  color: #f59e0b;
}
.meta-item.text-expired {
  color: #ef4444;
}

/* Actions */
.voucher-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: auto;
}
.btn-copy {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: 1px solid #e5e7eb;
  color: #374151;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 7px;
  transition: all 0.2s;
}
.btn-copy:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #d1d5db;
}
.btn-copy svg {
  width: 14px;
  height: 14px;
}
.btn-copy:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-use {
  flex: 1;
  background: #1a73e8;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-use:hover:not(:disabled) {
  background: #1557b0;
}
.btn-use:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin: 24px 0;
}
.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #4b5563;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.page-btn svg {
  width: 15px;
  height: 15px;
}
.page-btn:hover:not(:disabled):not(.active) {
  background: #f3f4f6;
  border-color: #d1d5db;
}
.page-btn.active {
  background: #1a73e8;
  color: #fff;
  border-color: #1a73e8;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Footer */
.footer {
  background: #fff;
  border-top: 1px solid #e5e7eb;
  padding: 20px 0;
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
  width: 22px;
  height: 22px;
  background: #9ca3af;
  color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer-logo svg {
  width: 12px;
  height: 12px;
}
.footer-name {
  font-size: 13px;
  font-weight: 700;
  color: #9ca3af;
}
.footer-copy {
  font-size: 12px;
  color: #9ca3af;
}
.footer-links {
  display: flex;
  gap: 20px;
}
.footer-links a {
  color: #4b5563;
  font-size: 12px;
  font-weight: 500;
}
.footer-links a:hover {
  color: #111827;
}
</style>