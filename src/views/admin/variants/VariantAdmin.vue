<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import AdminLayout from "../../../layouts/AdminLayout.vue";
import { useVariants } from "@/stores/variants";

const router = useRouter();
const route = useRoute();
const variantStore = useVariants();

const apiBase = import.meta.env.VITE_API_BASE;
const search = ref("");
const sortValue = ref("id|desc");
const sortKey = ref("id");
const sortDir = ref("desc");
const currentPage = ref(1);
const perPage = 10;

// Lấy product_id từ route nếu có
const productId = computed(() => route.params.id || null);

async function fetchData() {
  await variantStore.loadVariants({
    search: search.value,
    sort_by: sortKey.value,
    sort_dir: sortDir.value,
    per_page: perPage,
    page: currentPage.value,
    product_id: productId.value,
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
  if (p < 1 || p > variantStore.lastPage) return;
  currentPage.value = p;
}

const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= variantStore.lastPage; i++) pages.push(i);
  return pages;
});

const rangeStart = computed(() =>
  variantStore.total === 0 ? 0 : (currentPage.value - 1) * perPage + 1
);
const rangeEnd = computed(() =>
  Math.min(currentPage.value * perPage, variantStore.total)
);

async function handleDelete(id) {
  const ok = await variantStore.deleteVariant(id);
  if (ok) fetchData();
}

function goToAdd() {
  const path = productId.value
    ? `/variantadd/${productId.value}`
    : "/variantadd";
  router.push(path);
}
function goToEdit(id) {
  router.push(`/variantedit/${id}`);
}

function imageUrl(path) {
  if (!path) return null;
  return `${apiBase.replace("/api", "")}/storage/${path}`;
}

function formatPrice(price) {
  if (!price) return "—";
  return Number(price).toLocaleString("vi-VN") + "đ";
}

function saleLabel(item) {
  if (!item.sale || item.sale === 0) return null;
  return `-${item.sale}%`;
}

function salePriceLabel(item) {
  if (!item.sale || item.sale === 0) return null;
  const discounted = item.price * (1 - item.sale / 100);
  return Number(discounted).toLocaleString("vi-VN") + "đ";
}
</script>

<template>
  <AdminLayout>
    <div class="content-header">
      <div class="content-titles">
        <h2>Quản lý Biến thể</h2>
        <p>Xem và quản lý các biến thể sản phẩm trong hệ thống.</p>
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
        Thêm biến thể
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
            placeholder="Tìm SKU hoặc tên sản phẩm..."
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
            <option value="sku|asc">SKU A-Z</option>
            <option value="sku|desc">SKU Z-A</option>
            <option value="price|asc">Giá thấp - cao</option>
            <option value="price|desc">Giá cao - thấp</option>
            <option value="stock|asc">Tồn kho tăng dần</option>
            <option value="stock|desc">Tồn kho giảm dần</option>
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
                @click="toggleSort('id')"
                style="width: 70px; cursor: pointer"
              >
                ID
                <span
                  class="sort-icon"
                  :style="{ color: sortKey === 'id' ? '#2563eb' : '' }"
                >
                  {{ sortIcon("id") }}
                </span>
              </th>
              <th style="width: 64px">ẢNH</th>
              <th @click="toggleSort('sku')" style="cursor: pointer">
                SKU
                <span
                  class="sort-icon"
                  :style="{ color: sortKey === 'sku' ? '#2563eb' : '' }"
                >
                  {{ sortIcon("sku") }}
                </span>
              </th>
              <th>GIÁ TRỊ THUỘC TÍNH</th>
              <th @click="toggleSort('price')" style="cursor: pointer">
                GIÁ
                <span
                  class="sort-icon"
                  :style="{ color: sortKey === 'price' ? '#2563eb' : '' }"
                >
                  {{ sortIcon("price") }}
                </span>
              </th>
              <th @click="toggleSort('stock')" style="cursor: pointer">
                TỒN KHO
                <span
                  class="sort-icon"
                  :style="{ color: sortKey === 'stock' ? '#2563eb' : '' }"
                >
                  {{ sortIcon("stock") }}
                </span>
              </th>
              <th>GIẢM GIÁ</th>
              <th class="text-right">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="variantStore.variants.length === 0">
              <td
                colspan="8"
                style="text-align: center; padding: 48px 0; color: #9ca3af"
              >
                <div class="empty-state">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    width="40"
                    height="40"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M4 6h16M4 10h16M4 14h10M4 18h6"
                    />
                  </svg>
                  <p>Chưa có biến thể nào</p>
                </div>
              </td>
            </tr>

            <tr v-for="item in variantStore.variants" :key="item.id">
              <td class="font-medium text-gray">#{{ item.id }}</td>
              <td>
                <div class="img-wrapper">
                  <img
                    v-if="item.img"
                    :src="imageUrl(item.img)"
                    :alt="item.sku"
                  />
                  <svg
                    v-else
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style="
                      width: 22px;
                      height: 22px;
                      color: #d1d5db;
                      margin: 11px auto;
                      display: block;
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
              <td class="font-semibold">{{ item.sku }}</td>
              <td>
                <div class="values-list">
                  <span
                    v-for="val in item.values"
                    :key="val.id"
                    class="value-tag"
                  >
                    {{ val.value }}
                  </span>
                  <span
                    v-if="!item.values || item.values.length === 0"
                    class="text-gray"
                    >—</span
                  >
                </div>
              </td>
              <td class="font-bold">{{ formatPrice(item.price) }}</td>
              <td>
                <span
                  :class="[
                    'stock-badge',
                    item.stock > 0 ? 'in-stock' : 'out-stock',
                  ]"
                >
                  {{ item.stock }}
                </span>
              </td>
              <td>
                <span v-if="saleLabel(item)" class="sale-badge">
                  {{ saleLabel(item) }}
                </span>
                <span v-else class="text-gray">—</span>
              </td>
              <td class="col-actions">
                <div class="actions-wrapper">
                  <button
                    class="btn-action edit"
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
                    class="btn-action delete"
                    @click="handleDelete(item.id)"
                    title="Xóa"
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
          {{ variantStore.total }} biến thể
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
            :class="{ disabled: currentPage === variantStore.lastPage }"
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

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px 32px 0;
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
  color: #fff;
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

.data-card {
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin: 16px 32px 32px;
}

.filter-bar {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  border-radius: 12px 12px 0 0;
}
.filter-search-box {
  position: relative;
  flex: 1;
}
.filter-input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}
.filter-input:focus {
  border-color: #2563eb;
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
.filter-select-box {
  position: relative;
}
.filter-select {
  appearance: none;
  padding: 10px 36px 10px 16px;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  min-width: 170px;
  outline: none;
  cursor: pointer;
}
.filter-select:focus {
  border-color: #2563eb;
}
.dropdown-icon {
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
  background-color: #fff;
  border: 1px solid #e5e7eb;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  color: #4b5563;
  display: flex;
  align-items: center;
  transition: background 0.2s, color 0.2s;
}
.btn-filter:hover {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}
.btn-filter svg {
  width: 20px;
  height: 20px;
}

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
  padding: 12px 24px;
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
  user-select: none;
}
.product-table th:hover {
  color: #374151;
}
.sort-icon {
  display: inline-block;
  margin-left: 4px;
  font-size: 12px;
}
.product-table td {
  padding: 14px 24px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
  font-size: 14px;
  white-space: nowrap;
}
.product-table tbody tr:last-child td {
  border-bottom: none;
}
.product-table tbody tr:hover {
  background: #f9fafb;
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

.font-medium {
  font-weight: 500;
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
  color: #6b7280;
}

/* Giá trị thuộc tính tags */
.values-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.value-tag {
  display: inline-block;
  padding: 3px 8px;
  background-color: #f3f4f6;
  color: #374151;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

/* Stock badge */
.stock-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
}
.in-stock {
  background-color: #d1fae5;
  color: #047857;
}
.out-stock {
  background-color: #fee2e2;
  color: #b91c1c;
}

/* Sale badge */
.sale-badge {
  display: inline-block;
  padding: 4px 10px;
  background-color: #fef3c7;
  color: #b45309;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
}

.text-right {
  text-align: right;
}
.actions-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
}
.btn-action {
  background: none;
  border: none;
  cursor: pointer;
  padding: 7px;
  border-radius: 6px;
  color: #9ca3af;
  transition: background 0.2s, color 0.2s;
}
.btn-action.edit:hover {
  background: #eff6ff;
  color: #2563eb;
}
.btn-action.delete:hover {
  background: #fef2f2;
  color: #ef4444;
}
.btn-action svg {
  width: 18px;
  height: 18px;
  display: block;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #9ca3af;
  padding: 16px 0;
}
.empty-state p {
  font-size: 14px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-top: 1px solid #e5e7eb;
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
  background-color: #fff;
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
  color: #fff;
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