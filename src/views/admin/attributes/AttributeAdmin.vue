<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "../../../layouts/AdminLayout.vue";
import { useAttributes } from "@/stores/attributes";

const router = useRouter();
const attributeStore = useAttributes();

const search = ref("");
const sortValue = ref("id|desc");
const sortKey = ref("id");
const sortDir = ref("desc");
const currentPage = ref(1);
const perPage = 10;

async function fetchData() {
  await attributeStore.loadAttributes({
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
  if (p < 1 || p > attributeStore.lastPage) return;
  currentPage.value = p;
}

const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= attributeStore.lastPage; i++) pages.push(i);
  return pages;
});

const rangeStart = computed(() =>
  attributeStore.total === 0 ? 0 : (currentPage.value - 1) * perPage + 1
);
const rangeEnd = computed(() =>
  Math.min(currentPage.value * perPage, attributeStore.total)
);

async function handleDelete(id) {
  const ok = await attributeStore.deleteAttribute(id);
  if (ok) fetchData();
}

function goToAdd() {
  router.push("/attributeadd");
}
function goToEdit(id) {
  router.push(`/attributeedit/${id}`);
}
</script>

<template>
  <AdminLayout>
    <div class="content-header">
      <div class="content-titles">
        <h2>Quản lý Thuộc tính</h2>
        <p>Xem và quản lý các thuộc tính sản phẩm trong hệ thống.</p>
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
        Thêm thuộc tính
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
            placeholder="Tìm tên thuộc tính..."
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
              <th
                class="sortable"
                @click="toggleSort('name')"
                style="cursor: pointer"
              >
                TÊN THUỘC TÍNH
                <span
                  class="sort-icon"
                  :style="{ color: sortKey === 'name' ? '#2563eb' : '' }"
                >
                  {{ sortIcon("name") }}
                </span>
              </th>
              <th class="text-right">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="attributeStore.attributes.length === 0">
              <td
                colspan="4"
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p>Chưa có thuộc tính nào</p>
                </div>
              </td>
            </tr>

            <tr v-for="item in attributeStore.attributes" :key="item.id">
              <td class="font-medium text-gray">#{{ item.id }}</td>
              <td class="font-semibold">{{ item.name }}</td>
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
          {{ attributeStore.total }} thuộc tính
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
            :class="{ disabled: currentPage === attributeStore.lastPage }"
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
  min-width: 150px;
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
.product-table th.sortable {
  cursor: pointer;
}
.product-table th.sortable:hover {
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

.font-medium {
  font-weight: 500;
}
.font-semibold {
  font-weight: 600;
  color: #111827;
}
.text-gray {
  color: #6b7280;
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