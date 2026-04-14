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

        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải mã giảm giá...</p>
        </div>

        <!-- Empty -->
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

        <!-- Grid -->
        <div v-else class="voucher-grid">
          <div
            class="voucher-card"
            v-for="coupon in store.userCoupons"
            :key="coupon.id"
          >
            <div class="voucher-body">
              <div class="voucher-top">
                <div class="voucher-icon-wrap">
                  <span class="voucher-icon" v-html="iconTag"></span>
                </div>
                <span :class="['voucher-badge', getBadgeClass(coupon)]">
                  {{ getBadgeText(coupon) }}
                </span>
              </div>

              <h3 class="voucher-code">{{ coupon.code }}</h3>
              <p class="voucher-desc">{{ coupon.description }}</p>

              <div
                :class="[
                  'voucher-date',
                  { 'text-danger': isExpiringSoon(coupon) },
                ]"
              >
                <svg
                  v-if="isExpiringSoon(coupon)"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <svg
                  v-else
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ formatDate(coupon.expired_at) }}
              </div>
            </div>

            <div class="voucher-footer">
              <button class="btn-copy" @click="copyCode(coupon.code)">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Sao chép mã
              </button>
              <button class="btn-primary-small">Sử dụng ngay</button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
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

const iconTag = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>`;

const tabs = [
  { label: "Tất cả", value: "" },
  { label: "Sắp hết hạn", value: "expiring" },
  { label: "Đã dùng", value: "used" },
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

const isExpiringSoon = (coupon) => {
  if (!coupon.expired_at) return false;
  const diff = new Date(coupon.expired_at) - new Date();
  return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
};

const getBadgeClass = (coupon) => {
  if (
    !coupon.is_active ||
    (coupon.expired_at && new Date(coupon.expired_at) <= new Date())
  )
    return "badge-expired";
  if (isExpiringSoon(coupon)) return "badge-warning";
  return "badge-valid";
};

const getBadgeText = (coupon) => {
  if (
    !coupon.is_active ||
    (coupon.expired_at && new Date(coupon.expired_at) <= new Date())
  )
    return "HẾT HẠN";
  if (isExpiringSoon(coupon)) return "SẮP HẾT HẠN";
  return "HỢP LỆ";
};

const formatDate = (date) => {
  if (!date) return "Không giới hạn";
  return "Hết hạn: " + new Date(date).toLocaleDateString("vi-VN");
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
  background-color: #f9fafb;
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

/* Main Layout */
.main-wrapper {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  gap: 40px;
  width: 100%;
  flex: 1;
}

/* Content */
.content {
  flex: 1;
  min-width: 0;
  max-width: 900px;
}

/* Header Row */
.page-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

/* Tabs */
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
.tab-btn:hover:not(.active) {
  background-color: #f3f4f6;
  color: #111827;
}
.tab-btn.active {
  background-color: #1a73e8;
  color: #ffffff;
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
  width: 36px;
  height: 36px;
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
  width: 56px;
  height: 56px;
}
.empty-state p {
  font-size: 15px;
}

/* Voucher Grid */
.voucher-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}
@media (max-width: 900px) {
  .voucher-grid {
    grid-template-columns: 1fr;
  }
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
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
.voucher-icon :deep(svg) {
  width: 24px;
  height: 24px;
}

.voucher-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.badge-valid {
  background-color: #ecfdf5;
  color: #10b981;
}
.badge-warning {
  background-color: #fffbeb;
  color: #f59e0b;
}
.badge-expired {
  background-color: #f3f4f6;
  color: #9ca3af;
}

.voucher-code {
  font-size: 28px;
  font-weight: 300;
  color: #93c5fd;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}
.voucher-desc {
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 24px;
  height: 44px;
}
.voucher-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #9ca3af;
  font-weight: 500;
}
.voucher-date svg {
  width: 16px;
  height: 16px;
}
.voucher-date.text-danger {
  color: #ef4444;
}

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
.btn-copy svg {
  width: 18px;
  height: 18px;
}
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
.btn-primary-small:hover {
  background-color: #1557b0;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 32px 0;
}
.page-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.page-btn svg {
  width: 16px;
  height: 16px;
}
.page-btn:hover:not(:disabled):not(.active) {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}
.page-btn.active {
  background-color: #1a73e8;
  color: #ffffff;
  border-color: #1a73e8;
  font-weight: 600;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Support Banner */
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
.support-icon svg {
  width: 28px;
  height: 28px;
}
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
.btn-outline-blue:hover {
  background-color: #dbeafe;
}
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
.btn-primary:hover {
  background-color: #1557b0;
}

/* Footer */
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
.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.footer-logo {
  width: 24px;
  height: 24px;
  background-color: #9ca3af;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer-logo svg {
  width: 14px;
  height: 14px;
}
.footer-name {
  font-size: 14px;
  font-weight: 700;
  color: #9ca3af;
}
.footer-copy {
  font-size: 13px;
  color: #9ca3af;
}
.footer-links {
  display: flex;
  gap: 24px;
}
.footer-links a {
  color: #4b5563;
  font-size: 13px;
  font-weight: 500;
}
.footer-links a:hover {
  color: #111827;
}
</style>