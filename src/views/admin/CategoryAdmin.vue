<script setup>
import { ref } from "vue";
import AdminLayout from "../../layouts/AdminLayout.vue";
// Các SVG Icon được chuẩn bị sẵn khớp với ảnh thiết kế
const iconShoe = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.07 4.93a10 10 0 0 0-14.14 0l-1.42 1.41a10 10 0 0 0 0 14.15h0a10 10 0 0 0 14.15 0l1.41-1.42a10 10 0 0 0 0-14.14z"></path><path d="M22 22A10 10 0 0 0 12 12M12 12A10 10 0 0 0 2 2M12 12A10 10 0 0 1 2 22M12 12A10 10 0 0 1 22 2"></path></svg>`; // Mô phỏng tạm icon giày
const iconShirt = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"></path></svg>`;
const iconSearch = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
const iconBall = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M5.636 5.636a9 9 0 0112.728 0M12 2v20M2 12h20M5.636 18.364a9 9 0 0112.728 0"></path></svg>`;

const categories = ref([
  {
    id: "#1",
    name: "Giày đá bóng",
    slug: "giay-da-bong",
    date: "01/10/2023",
    iconSvg: iconShoe,
  },
  {
    id: "#2",
    name: "Áo thi đấu",
    slug: "ao-thi-dau",
    date: "02/10/2023",
    iconSvg: iconShirt,
  },
  {
    id: "#3",
    name: "Phụ kiện",
    slug: "phu-kien",
    date: "05/10/2023",
    iconSvg: iconSearch,
  },
  {
    id: "#4",
    name: "Bóng thi đấu",
    slug: "bong-thi-dau",
    date: "10/10/2023",
    iconSvg: iconBall,
  },
]);
</script>
<template>
  <AdminLayout>
    <div class="content-header">
      <div class="content-titles">
        <h2>Quản lý Danh mục</h2>
        <p>Xem và quản lý các danh mục sản phẩm trong cửa hàng của bạn.</p>
      </div>
      <button class="btn-add">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        Thêm danh mục mới
      </button>
    </div>

    <div class="data-card">
      <div class="filter-bar">
        <div class="filter-search-box">
          <svg
            class="search-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            class="filter-input"
          />
        </div>

        <div class="filter-select-box">
          <select class="filter-select">
            <option>Trạng thái</option>
            <option>Đang hoạt động</option>
            <option>Bị ẩn</option>
          </select>
          <svg
            class="dropdown-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>

        <button class="btn-filter">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            ></path>
          </svg>
        </button>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 80px">ID <span class="sort-icon">↕</span></th>
              <th>TÊN DANH MỤC <span class="sort-icon">↕</span></th>
              <th>SLUG</th>
              <th>NGÀY TẠO <span class="sort-icon">↕</span></th>
              <th class="text-right">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, index) in categories" :key="index">
              <td class="font-medium text-gray">{{ category.id }}</td>
              <td>
                <div class="category-name-wrapper">
                  <div
                    class="category-icon-box"
                    v-html="category.iconSvg"
                  ></div>
                  <span class="font-bold">{{ category.name }}</span>
                </div>
              </td>
              <td>
                <span class="slug-badge">{{ category.slug }}</span>
              </td>
              <td class="text-gray">{{ category.date }}</td>
              <td class="col-actions">
                <div class="actions-wrapper">
                  <button class="btn-action">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      ></path>
                    </svg>
                  </button>
                  <button class="btn-action">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <span class="pagination-info"
          >Hiển thị 1 - 4 trong tổng số 12 danh mục</span
        >
        <div class="pagination-pages">
          <button class="page-btn disabled">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">3</button>
          <button class="page-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>



<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

/* --- Reset & Global --- */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.admin-layout {
  display: flex;
  height: 100vh;
  font-family: "Inter", sans-serif;
  background-color: #f8f9fa;
  color: #111827;
}

/* --- Sidebar --- */
.sidebar {
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 12px;
}
.logo-box {
  width: 32px;
  height: 32px;
  background-color: #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-icon {
  width: 20px;
  height: 20px;
  color: #ffffff;
}
.logo-text {
  display: flex;
  flex-direction: column;
}
.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
  line-height: 1.2;
}
.brand-sub {
  font-size: 12px;
  color: #9ca3af;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  text-decoration: none;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.2s, color 0.2s;
}
.nav-item:hover {
  background-color: #f3f4f6;
}
.nav-item.active {
  background-color: #eff6ff;
  color: #2563eb;
}
.nav-icon {
  width: 20px;
  height: 20px;
}
.sidebar-footer {
  padding: 20px 16px;
  border-top: 1px solid #e5e7eb;
}

/* --- Main Content & Topbar --- */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.topbar {
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  flex-shrink: 0;
}
.page-title-main {
  font-size: 18px;
  font-weight: 700;
}
.topbar-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.search-container {
  position: relative;
}
.search-input {
  width: 280px;
  padding: 10px 16px 10px 40px;
  background-color: #f3f4f6;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: background-color 0.2s;
}
.search-input:focus {
  background-color: #ffffff;
  box-shadow: 0 0 0 1px #e5e7eb;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9ca3af;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #4b5563;
  display: flex;
  align-items: center;
}
.icon-btn:hover {
  color: #111827;
}
.icon-btn svg {
  width: 20px;
  height: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 24px;
  border-left: 1px solid #e5e7eb;
}
.user-details {
  display: flex;
  flex-direction: column;
  text-align: right;
}
.user-name {
  font-size: 14px;
  font-weight: 600;
}
.user-role {
  font-size: 12px;
  color: #9ca3af;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

/* --- Page Content --- */
.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.content-titles h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}
.content-titles p {
  font-size: 14px;
  color: #4b5563;
}
.btn-add {
  background-color: #2563eb;
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
.btn-add:hover {
  background-color: #1d4ed8;
}
.btn-add svg {
  width: 18px;
  height: 18px;
}

/* --- Data Card --- */
.data-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.filter-bar {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.filter-search-box {
  position: relative;
  flex: 1;
}
.filter-input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}
.filter-search-box .search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9ca3af;
}

.filter-select-box {
  position: relative;
}
.filter-select {
  appearance: none;
  padding: 10px 36px 10px 16px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  min-width: 160px;
  outline: none;
  cursor: pointer;
}
.filter-select-box .dropdown-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #4b5563;
  pointer-events: none;
}

.btn-filter {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  color: #4b5563;
  display: flex;
  align-items: center;
}
.btn-filter svg {
  width: 20px;
  height: 20px;
}

/* --- Table (Đã fix lỗi Wrapper) --- */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
.data-table th {
  padding: 16px 24px;
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}
.sort-icon {
  display: inline-block;
  margin-left: 4px;
  font-size: 12px;
  cursor: pointer;
}
.data-table td {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
  font-size: 14px;
  white-space: nowrap;
}

/* Category Specific Styles */
.category-name-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}
.category-icon-box {
  width: 40px;
  height: 40px;
  background-color: #eff6ff; /* Màu xanh nhạt */
  color: #2563eb; /* Màu icon xanh đậm */
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* Style cho SVG truyền qua v-html */
.category-icon-box :deep(svg) {
  width: 20px;
  height: 20px;
}

.slug-badge {
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.font-medium {
  font-weight: 500;
}
.font-bold {
  font-weight: 700;
  color: #111827;
}
.text-gray {
  color: #6b7280;
}

/* Actions */
.text-right {
  text-align: right;
}
.actions-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}
.btn-action {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 6px;
  border-radius: 6px;
  transition: background-color 0.2s, color 0.2s;
}
.btn-action:hover {
  background-color: #f3f4f6;
  color: #111827;
}
.btn-action svg {
  width: 18px;
  height: 18px;
}

/* --- Pagination --- */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
}
.pagination-info {
  font-size: 13px;
  color: #4b5563;
}
.pagination-pages {
  display: flex;
  align-items: center;
  gap: 6px;
}
.page-btn {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  color: #111827;
  cursor: pointer;
  transition: background-color 0.2s;
}
.page-btn:hover:not(.disabled):not(.active) {
  background-color: #f3f4f6;
}
.page-btn.active {
  background-color: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
  font-weight: 600;
}
.page-btn.disabled {
  color: #9ca3af;
  background-color: #f9fafb;
  cursor: not-allowed;
}
.page-btn svg {
  width: 16px;
  height: 16px;
}
</style>