<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "../../../layouts/AdminLayout.vue";
import { useAttributeValues } from "@/stores/attributeValues";
import { useAttributes } from "@/stores/attributes";

const router = useRouter();
const attributeValueStore = useAttributeValues();
const attributeStore = useAttributes();

const search = ref("");
const sortValue = ref("id|desc");
const sortKey = ref("id");
const sortDir = ref("desc");
const currentPage = ref(1);
const perPage = 10;
const filterAttributeId = ref("");

async function fetchData() {
  await attributeValueStore.loadAttributeValues({
    search: search.value,
    sort_by: sortKey.value,
    sort_dir: sortDir.value,
    per_page: perPage,
    page: currentPage.value,
    attribute_id: filterAttributeId.value || undefined,
  });
}

onMounted(async () => {
  await attributeStore.loadAttributes({ per_page: 50 });
  fetchData();
});

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

function onFilterChange() {
  currentPage.value = 1;
  fetchData();
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
  if (p < 1 || p > attributeValueStore.lastPage) return;
  currentPage.value = p;
}

const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= attributeValueStore.lastPage; i++) pages.push(i);
  return pages;
});

const rangeStart = computed(() =>
  attributeValueStore.total === 0 ? 0 : (currentPage.value - 1) * perPage + 1
);
const rangeEnd = computed(() =>
  Math.min(currentPage.value * perPage, attributeValueStore.total)
);

async function handleDelete(id) {
  const ok = await attributeValueStore.deleteAttributeValue(id);
  if (ok) fetchData();
}

function goToAdd() {
  router.push("/attributevalueadd");
}
function goToEdit(id) {
  router.push(`/attributevalueedit/${id}`);
}
</script>

<template>
  <AdminLayout>
    <div class="content-header">
      <div class="content-titles">
        <h2>Quản lý Giá trị thuộc tính</h2>
        <p>Xem và quản lý các giá trị thuộc tính sản phẩm.</p>
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
        Thêm giá trị
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
            placeholder="Tìm giá trị hoặc thuộc tính..."
            class="filter-input"
            v-model="search"
            @input="onSearchInput"
          />
        </div>

        <!-- Filter theo thuộc tính -->
        <div class="filter-select-box">
          <select
            class="filter-select"
            v-model="filterAttributeId"
            @change="onFilterChange"
          >
            <option value="">Tất cả thuộc tính</option>
            <option
              v-for="attr in attributeStore.attributes"
              :key="attr.id"
              :value="attr.id"
            >
              {{ attr.name }}
            </option>
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

        <!-- Sort -->
        <div class="filter-select-box">
          <select
            class="filter-select"
            v-model="sortValue"
            @change="onSortChange"
          >
            <option value="id|desc">Mới nhất</option>
            <option value="id|asc">Cũ nhất</option>
            <option value="value|asc">Giá trị A-Z</option>
            <option value="value|desc">Giá trị Z-A</option>
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
      </div>

      <div class="table-responsive">
        <table class="product-table">
          <thead>
            <tr>
              <th
                class="sortable"
                @click="toggleSort('id')"
                style="width: 80px"
              >
                ID
                <span
                  class="sort-icon"
                  :style="{ color: sortKey === 'id' ? '#2563eb' : '' }"
                  >{{ sortIcon("id") }}</span
                >
              </th>
              <th>THUỘC TÍNH</th>
              <th class="sortable" @click="toggleSort('value')">
                GIÁ TRỊ
                <span
                  class="sort-icon"
                  :style="{ color: sortKey === 'value' ? '#2563eb' : '' }"
                  >{{ sortIcon("value") }}</span
                >
              </th>
              <th class="text-right">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="attributeValueStore.attributeValues.length === 0">
              <td
                colspan="5"
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
                  <p>Chưa có giá trị thuộc tính nào</p>
                </div>
              </td>
            </tr>

            <tr
              v-for="item in attributeValueStore.attributeValues"
              :key="item.id"
            >
              <td class="font-medium text-gray">#{{ item.id }}</td>
              <td>
                <span class="attr-badge">{{
                  item.attribute?.name ?? "—"
                }}</span>
              </td>
              <td class="font-semibold">{{ item.value }}</td>
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
          {{ attributeValueStore.total }} giá trị
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
            :class="{ disabled: currentPage === attributeValueStore.lastPage }"
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
  margin-bottom: 16px;
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
  margin: 0 32px 32px;
}

.filter-bar {
  display: flex;
  gap: 12px;
  padding: 14px 20px;
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
  padding: 9px 16px 9px 40px;
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
  min-width: 160px;
}
.filter-select {
  width: 100%;
  appearance: none;
  padding: 9px 36px 9px 14px;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  outline: none;
  cursor: pointer;
}
.filter-select:focus {
  border-color: #2563eb;
}
.dropdown-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #6b7280;
  pointer-events: none;
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
  cursor: default;
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

.attr-badge {
  background: #eff6ff;
  color: #2563eb;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
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