<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "../../../layouts/AdminLayout.vue";
import { useSubcategories } from "@/stores/subcategory";

const router = useRouter();
const subStore = useSubcategories();

const search = ref("");
const sortValue = ref("id|desc");
const sortKey = ref("id");
const sortDir = ref("desc");
const perPage = 10;

async function fetchData() {
  await subStore.loadSubcategories({
    search: search.value,
    sort_by: sortKey.value,
    sort_dir: sortDir.value,
    per_page: perPage,
    page: subStore.currentPage, // dùng store
  });
}

onMounted(fetchData);

watch(() => subStore.currentPage, fetchData);

function onSortChange() {
  const [key, dir] = sortValue.value.split("|");
  sortKey.value = key;
  sortDir.value = dir;
  subStore.currentPage = 1;
  fetchData();
}

let searchTimer = null;
function onSearchInput() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    subStore.currentPage = 1;
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
  subStore.currentPage = 1;
  fetchData();
}

function sortIcon(key) {
  if (sortKey.value !== key) return "↕";
  return sortDir.value === "asc" ? "↑" : "↓";
}

function goPage(p) {
  if (p < 1 || p > subStore.lastPage) return;
  subStore.currentPage = p;
}

const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= subStore.lastPage; i++) {
    pages.push(i);
  }
  return pages;
});

const rangeStart = computed(() =>
  subStore.total === 0
    ? 0
    : (subStore.currentPage - 1) * perPage + 1
);

const rangeEnd = computed(() =>
  Math.min(subStore.currentPage * perPage, subStore.total)
);

async function handleDelete(id) {
  await subStore.deleteSubcategory(id);
}

function goToAdd() {
  router.push("/subcategoryadd");
}

function goToEdit(id) {
  router.push(`/subcategoryedit/${id}`);
}
</script>

<template>
  <AdminLayout>
    <div class="page-wrapper">
      <div class="content-header">
        <div class="content-titles">
          <h2>Quản lý Danh mục con</h2>
          <p>Xem và quản lý các danh mục con sản phẩm trong cửa hàng của bạn.</p>
        </div>
        <button class="btn-add" @click="goToAdd">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Thêm danh mục con
        </button>
      </div>

      <div class="data-card">
        <div class="filter-bar">
          <div class="filter-search-box">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm danh mục con..."
              class="filter-input"
              v-model="search"
              @input="onSearchInput"
            />
          </div>

          <div class="filter-select-box">
            <select class="filter-select" v-model="sortValue" @change="onSortChange">
              <option value="id|desc">Mới nhất</option>
              <option value="id|asc">Cũ nhất</option>
              <option value="name|asc">Tên A-Z</option>
              <option value="name|desc">Tên Z-A</option>
              <option value="created_at|desc">Ngày tạo mới</option>
              <option value="created_at|asc">Ngày tạo cũ</option>
            </select>
            <svg class="select-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <button class="btn-filter-icon" title="Lọc nâng cao">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M7 10h10M11 16h2" />
            </svg>
          </button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 80px" class="sortable" @click="toggleSort('id')">
                  ID
                  <span class="sort-icon" :class="{ active: sortKey === 'id' }">{{ sortIcon("id") }}</span>
                </th>
                <th class="sortable" @click="toggleSort('name')">
                  TÊN DANH MỤC CON
                  <span class="sort-icon" :class="{ active: sortKey === 'name' }">{{ sortIcon("name") }}</span>
                </th>
                <th>DANH MỤC CHA</th>
                <th>SLUG</th>
                <th class="text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="subStore.subcategories.length === 0">
                <td colspan="5" class="empty-row">
                  <div class="empty-state">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="40" height="40">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <p>Chưa có danh mục con nào</p>
                  </div>
                </td>
              </tr>

              <tr v-for="sub in subStore.subcategories" :key="sub.id">
                <td class="font-medium text-gray">#{{ sub.id }}</td>
                <td>
                  <div class="name-cell">
                    <span class="font-bold">{{ sub.name }}</span>
                  </div>
                </td>
                <td>
                  <span class="slug-badge">{{ sub.category?.name ?? `#${sub.category_id}` }}</span>
                </td>
                <td>
                  <span class="slug-badge">{{ sub.slug }}</span>
                </td>
                <td class="col-actions">
                  <div class="actions-wrapper">
                    <button class="btn-action edit" @click="goToEdit(sub.id)" title="Sửa">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button class="btn-action delete" @click="handleDelete(sub.id)" title="Xóa">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
            Hiển thị {{ rangeStart }} - {{ rangeEnd }} trong tổng số {{ subStore.total }} danh mục con
          </span>
          <div class="pagination-controls">
            <button class="page-btn nav-btn" :disabled="subStore.currentPage === 1" @click="goPage(subStore.currentPage - 1)">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              v-for="p in pageNumbers" :key="p"
              class="page-btn" :class="{ active: p === subStore.currentPage }"
              @click="goPage(p)"
            >{{ p }}</button>
            <button class="page-btn nav-btn" :disabled="subStore.currentPage === subStore.lastPage" @click="goPage(subStore.currentPage + 1)">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<!-- giữ nguyên toàn bộ <style scoped> -->

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page-wrapper {
  padding: 24px 32px 32px;
  font-family: "Inter", sans-serif;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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
  flex-shrink: 0;
}
.btn-add:hover {
  background-color: #1d4ed8;
}
.btn-add svg {
  width: 18px;
  height: 18px;
}

.data-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.filter-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 12px 12px 0 0;
}
.filter-search-box {
  position: relative;
  flex: 1;
}
.filter-input {
  width: 100%;
  padding: 9px 16px 9px 40px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
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
  pointer-events: none;
}

.filter-select-box {
  position: relative;
  min-width: 150px;
}
.filter-select {
  width: 100%;
  appearance: none;
  padding: 9px 36px 9px 14px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}
.filter-select:focus {
  border-color: #2563eb;
}
.select-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #6b7280;
  pointer-events: none;
}

.btn-filter-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  color: #6b7280;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;
}
.btn-filter-icon:hover {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}
.btn-filter-icon svg {
  width: 18px;
  height: 18px;
}

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
.data-table th.sortable {
  cursor: pointer;
}
.data-table th.sortable:hover {
  color: #374151;
}
.sort-icon {
  margin-left: 4px;
  font-size: 12px;
  opacity: 0.4;
}
.sort-icon.active {
  opacity: 1;
  color: #2563eb;
}
.data-table td {
  padding: 12px 24px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
  font-size: 14px;
  white-space: nowrap;
}
.data-table tbody tr:last-child td {
  border-bottom: none;
}
.data-table tbody tr:hover {
  background: #f9fafb;
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

.name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.cat-thumb {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
}
.cat-thumb-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #d1d5db;
}
.cat-thumb-placeholder svg {
  width: 18px;
  height: 18px;
}

.slug-badge {
  background: #f3f4f6;
  color: #4b5563;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
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
  transition: background 0.2s, color 0.2s;
  color: #9ca3af;
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

.empty-row {
  padding: 40px 0 !important;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #9ca3af;
  padding: 32px 0;
}
.empty-state p {
  font-size: 14px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-top: 1px solid #e5e7eb;
}
.pagination-info {
  font-size: 13px;
  color: #4b5563;
}
.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}
.page-btn {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  padding: 0 6px;
}
.page-btn:hover:not(:disabled):not(.active) {
  background: #f3f4f6;
  border-color: #d1d5db;
}
.page-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}
.page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.page-btn.nav-btn {
  color: #6b7280;
}
</style>