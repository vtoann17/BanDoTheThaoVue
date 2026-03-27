<script setup>
import { ref } from "vue";
import AdminLayout from "../../layouts/AdminLayout.vue";

const products = ref([
  {
    image: "https://via.placeholder.com/48/2d4a3e/ffffff?text=Shoe",
    name: "Giày Tennis Nike Air Zoom",
    category: "Tennis",
    price: "3.500.000đ",
    stock: 24,
    status: "Đang bán",
    statusClass: "status-active",
  },
  {
    image: "https://via.placeholder.com/48/2d4a3e/ffffff?text=Racket",
    name: "Vợt Wilson Pro Staff 97",
    category: "Tennis",
    price: "5.200.000đ",
    stock: 0,
    status: "Hết hàng",
    statusClass: "status-out",
  },
  {
    image: "https://via.placeholder.com/48/d4c3a3/ffffff?text=Ball",
    name: "Bóng Adidas World Cup 2022",
    category: "Bóng đá",
    price: "1.800.000đ",
    stock: 15,
    status: "Ẩn",
    statusClass: "status-hidden",
  },
  {
    image: "https://via.placeholder.com/48/2d4a3e/ffffff?text=Shirt",
    name: "Áo đấu Manchester United",
    category: "Bóng đá",
    price: "1.250.000đ",
    stock: 120,
    status: "Đang bán",
    statusClass: "status-active",
  },
]);
</script>
<template>
  <AdminLayout>
    <div class="content-header">
      <div class="content-titles">
        <h2>Quản lý Sản phẩm</h2>
        <p>Xem và quản lý danh sách sản phẩm trong kho của bạn.</p>
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
        Thêm sản phẩm
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
            placeholder="Tìm tên sản phẩm, mã SKU..."
            class="filter-input"
          />
        </div>

        <div class="filter-select-box">
          <select class="filter-select">
            <option>Tất cả danh mục</option>
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

        <div class="filter-select-box">
          <select class="filter-select">
            <option>Trạng thái</option>
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
        <table class="product-table">
          <thead>
            <tr>
              <th style="width: 80px">HÌNH ẢNH</th>
              <th>TÊN SẢN PHẨM <span class="sort-icon">↕</span></th>
              <th>DANH MỤC <span class="sort-icon">↕</span></th>
              <th>GIÁ <span class="sort-icon">↕</span></th>
              <th>KHO <span class="sort-icon">↕</span></th>
              <th style="width: 120px">TRẠNG THÁI</th>
              <th class="text-right">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in products" :key="index">
              <td>
                <div class="img-wrapper">
                  <img :src="item.image" :alt="item.name" />
                </div>
              </td>
              <td class="font-semibold">{{ item.name }}</td>
              <td class="text-gray">{{ item.category }}</td>
              <td class="font-bold">{{ item.price }}</td>
              <td>{{ item.stock }}</td>
              <td>
                <span :class="['status-badge', item.statusClass]">{{
                  item.status
                }}</span>
              </td>
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
          >Hiển thị 1 - 4 trong tổng số 48 sản phẩm</span
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
          <span class="page-dots">...</span>
          <button class="page-btn">12</button>
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

/* --- Main Content --- */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* --- Topbar --- */
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

/* --- Table --- */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.product-table th {
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

.product-table td {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
  font-size: 14px;
  white-space: nowrap;
}

.img-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f3f4f6;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.font-semibold {
  font-weight: 600;
  color: #111827;
}
.font-bold {
  font-weight: 700;
  color: #111827;
}
.text-gray {
  color: #4b5563;
}

/* Status Badges */
.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
}

.status-active {
  background-color: #d1fae5;
  color: #047857;
}

.status-out {
  background-color: #fee2e2;
  color: #b91c1c;
}

.status-hidden {
  background-color: #f3f4f6;
  color: #4b5563;
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

.page-dots {
  color: #9ca3af;
  padding: 0 4px;
}
</style>