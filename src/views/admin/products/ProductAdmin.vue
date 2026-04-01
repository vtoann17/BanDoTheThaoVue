<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "../../../layouts/AdminLayout.vue";
import { useProducts } from "@/stores/products";

const router = useRouter();
const productStore = useProducts();

const apiBase = import.meta.env.VITE_API_BASE;
const search = ref("");
const sortValue = ref("id|desc");
const sortKey = ref("id");
const sortDir = ref("desc");
const currentPage = ref(1);
const perPage = 10;

async function fetchData() {
  await productStore.loadProducts({
    search: search.value,
    sort_by: sortKey.value,
    sort_dir: sortDir.value,
    per_page: perPage,
    page: currentPage.value,
  });
}

onMounted(fetchData);
watch(currentPage, fetchData);

function onSortChange() {
  const [key, dir] = sortValue.value.split("|");
  sortKey.value = key;
  sortDir.value = dir;
  currentPage.value = 1;
  fetchData();
}

let searchTimer = null;
function onSearchInput() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    currentPage.value = 1;
    fetchData();
  }, 400);
}

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortDir.value = "asc";
  }
  sortValue.value = `${sortKey.value}|${sortDir.value}`;
  currentPage.value = 1;
  fetchData();
}

function sortIcon(key) {
  if (sortKey.value !== key) return "↕";
  return sortDir.value === "asc" ? "↑" : "↓";
}

function goPage(p) {
  if (p < 1 || p > productStore.lastPage) return;
  currentPage.value = p;
}

const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= productStore.lastPage; i++) pages.push(i);
  return pages;
});

const rangeStart = computed(() =>
  productStore.total === 0 ? 0 : (currentPage.value - 1) * perPage + 1
);
const rangeEnd = computed(() =>
  Math.min(currentPage.value * perPage, productStore.total)
);

async function handleDelete(id) {
  const ok = await productStore.deleteProduct(id);
  if (ok) fetchData();
}

function goToAdd() {
  router.push("/productadd");
}
function goToEdit(id) {
  router.push(`/productedit/${id}`);
}

function imageUrl(path) {
  if (!path) return null;
  return `${apiBase.replace("/api", "")}/storage/${path}`;
}

function statusLabel(status) {
  if (status === 1 || status === "active")
    return { text: "Đang bán", cls: "status-active" };
  if (status === 0 || status === "hidden")
    return { text: "Ẩn", cls: "status-hidden" };
  return { text: "Hết hàng", cls: "status-out" };
}

function formatPrice(price) {
  if (!price) return "—";
  return Number(price).toLocaleString("vi-VN") + "đ";
}
</script>

<template>
  <AdminLayout>
    <div class="content-header">
      <div class="content-titles">
        <h2>Quản lý Sản phẩm</h2>
        <p>Xem và quản lý danh sách sản phẩm trong kho của bạn.</p>
      </div>
      <button class="btn-add" @click="goToAdd">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
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
            />
          </svg>
          <input
            type="text"
            placeholder="Tìm tên sản phẩm..."
            class="filter-input"
            v-model="search"
            @input="onSearchInput"
          />
        </div>

        <div class="filter-select-box">
          <select
            class="filter-select"
            v-model="sortValue"
            @change="onSortChange"
          >
            <option value="id|desc">Mới nhất</option>
            <option value="id|asc">Cũ nhất</option>
            <option value="name|asc">Tên A-Z</option>
            <option value="name|desc">Tên Z-A</option>
            <option value="price|asc">Giá thấp - cao</option>
            <option value="price|desc">Giá cao - thấp</option>
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
            />
          </svg>
        </div>

        <button class="btn-filter">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </button>
      </div>

      <div class="table-responsive">
        <table class="product-table">
          <thead>
            <tr>
              <th
                class="sortable"
                @click="toggleSort('id')"
                style="width: 80px; cursor: pointer"
              >
                ID
                <span
                  class="sort-icon"
                  :style="{ color: sortKey === 'id' ? '#2563eb' : '' }"
                >
                  {{ sortIcon("id") }}
                </span>
              </th>
              <th style="width: 80px">HÌNH ẢNH</th>
              <th
                class="sortable"
                @click="toggleSort('name')"
                style="cursor: pointer"
              >
                TÊN SẢN PHẨM
                <span
                  class="sort-icon"
                  :style="{ color: sortKey === 'name' ? '#2563eb' : '' }"
                >
                  {{ sortIcon("name") }}
                </span>
              </th>
              <th
                class="sortable"
                @click="toggleSort('price')"
                style="cursor: pointer"
              >
                GIÁ
                <span
                  class="sort-icon"
                  :style="{ color: sortKey === 'price' ? '#2563eb' : '' }"
                >
                  {{ sortIcon("price") }}
                </span>
              </th>
              <th style="width: 130px">TRẠNG THÁI</th>
              <th class="text-right">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            <!-- Empty -->
            <tr v-if="productStore.products.length === 0">
              <td
                colspan="5"
                style="text-align: center; padding: 48px 0; color: #9ca3af"
              >
                Chưa có sản phẩm nào
              </td>
            </tr>

            <tr v-for="item in productStore.products" :key="item.id">
              <td class="font-medium text-gray">#{{ item.id }}</td>
              <td>
                <div class="img-wrapper">
                  <img
                    v-if="item.image"
                    :src="imageUrl(item.image)"
                    :alt="item.name"
                  />
                  <svg
                    v-else
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style="
                      width: 24px;
                      height: 24px;
                      color: #d1d5db;
                      margin: auto;
                      display: block;
                      margin-top: 10px;
                    "
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                    />
                  </svg>
                </div>
              </td>
              <td class="font-semibold">{{ item.name }}</td>
              <td class="font-bold">{{ formatPrice(item.price) }}</td>
              <td>
                <span :class="['status-badge', statusLabel(item.status).cls]">
                  {{ statusLabel(item.status).text }}
                </span>
              </td>
              <td class="col-actions">
                <div class="actions-wrapper">
                  <button
                    class="btn-action btn-variant"
                    @click="router.push(`/variantadmin/${item.id}`)"
                    title="Biến thể"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 10h16M4 14h10M4 18h6"
                      />
                    </svg>
                  </button>
                  <button
                    class="btn-action"
                    @click="goToEdit(item.id)"
                    title="Sửa"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    class="btn-action"
                    @click="handleDelete(item.id)"
                    title="Xóa"
                    style="color: #9ca3af"
                    onmouseover="this.style.color='#ef4444';this.style.background='#fef2f2'"
                    onmouseout="this.style.color='#9ca3af';this.style.background='none'"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <span class="pagination-info">
          Hiển thị {{ rangeStart }} - {{ rangeEnd }} trong tổng số
          {{ productStore.total }} sản phẩm
        </span>
        <div class="pagination-pages">
          <button
            class="page-btn"
            :class="{ disabled: currentPage === 1 }"
            @click="goPage(currentPage - 1)"
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
            v-for="p in pageNumbers"
            :key="p"
            class="page-btn"
            :class="{ active: p === currentPage }"
            @click="goPage(p)"
          >
            {{ p }}
          </button>
          <button
            class="page-btn"
            :class="{ disabled: currentPage === productStore.lastPage }"
            @click="goPage(currentPage + 1)"
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