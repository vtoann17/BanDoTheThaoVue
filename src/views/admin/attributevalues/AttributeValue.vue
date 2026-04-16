<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "../../../layouts/AdminLayout.vue";
import { useAttributeValues } from "../../../stores/attributevalues";
import { useAttributes } from "@/stores/attributes";
import { useNotify } from "@/composables/useNotify"; // Import useNotify

const router = useRouter();
const attributeValueStore = useAttributeValues();
const attributeStore = useAttributes();
const notify = useNotify(); // Khởi tạo notify

const search = ref("");
const sortValue = ref("id|desc");
const sortKey = ref("id");
const sortDir = ref("desc");
const currentPage = ref(1);
const perPage = 5;
const filterAttributeId = ref("");

async function fetchData() {
  await attributeValueStore.loadAttributeValues({
    search: search.value,
    sort_by: sortKey.value,
    sort_dir: sortDir.value,
    per_page: 999, // load nhiều để group phía client
    page: 1,
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

// Group các giá trị theo thuộc tính
const groupedByAttribute = computed(() => {
  const map = new Map();
  for (const item of attributeValueStore.attributeValues) {
    const attrId = item.attribute?.id ?? "unknown";
    if (!map.has(attrId)) {
      map.set(attrId, { attribute: item.attribute, values: [] });
    }
    map.get(attrId).values.push(item);
  }
  return [...map.values()];
});

// Pagination trên grouped rows
const totalGroups = computed(() => groupedByAttribute.value.length);
const lastPage = computed(() =>
  Math.max(1, Math.ceil(totalGroups.value / perPage))
);
const pagedGroups = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return groupedByAttribute.value.slice(start, start + perPage);
});
const rangeStart = computed(() =>
  totalGroups.value === 0 ? 0 : (currentPage.value - 1) * perPage + 1
);
const rangeEnd = computed(() =>
  Math.min(currentPage.value * perPage, totalGroups.value)
);
const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= lastPage.value; i++) pages.push(i);
  return pages;
});

function goPage(p) {
  if (p < 1 || p > lastPage.value) return;
  currentPage.value = p;
}

// Hàm XÓA LẺ từng giá trị
async function handleDelete(id) {
  const ok = await attributeValueStore.deleteAttributeValue(id);
  if (ok) {
    fetchData(); // Load lại bảng sau khi xóa thành công
  }
}

function goToAdd() {
  router.push("/attributevalueadd");
}
function goToEdit(attributeId) {
  router.push(`/attributevalueedit/${attributeId}`);
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
              <th style="width: 60px">#</th>
              <th style="width: 180px">THUỘC TÍNH</th>
              <th>GIÁ TRỊ</th>
              <th class="text-right" style="width: 60px">SL</th>
              <th class="text-right" style="width: 80px">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pagedGroups.length === 0">
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

            <tr v-for="group in pagedGroups" :key="group.attribute?.id">
              <td class="font-medium text-gray">
                {{ group.attribute?.id ?? "—" }}
              </td>
              <td>
                <span class="attr-badge">{{
                  group.attribute?.name ?? "—"
                }}</span>
              </td>
              <td>
                <div class="chips-wrap">
                  <span
                    v-for="v in group.values"
                    :key="v.id"
                    class="value-chip"
                  >
                    {{ v.value }}
                    <button
                      class="chip-btn delete"
                      @click="handleDelete(v.id)"
                      title="Xóa giá trị này"
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        width="12"
                        height="12"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                </div>
              </td>
              <td class="text-right">
                <span class="count-badge">{{ group.values.length }}</span>
              </td>
              <td class="text-right">
                <div class="action-flex">
                  <button
                    class="action-btn edit"
                    @click="goToEdit(group.attribute?.id)"
                    title="Cập nhật nhóm"
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
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
          {{ totalGroups }} thuộc tính
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
            :class="{ disabled: currentPage === lastPage }"
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
}
.product-table td {
  padding: 14px 24px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
  font-size: 14px;
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

.count-badge {
  background: #f3f4f6;
  color: #374151;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

/* Chips với nút xóa bên trong */
.chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 2px 0;
}
.value-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 4px 8px 4px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #111827;
}
.chip-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #9ca3af;
  transition: all 0.15s;
}
.chip-btn.delete:hover {
  color: #ef4444;
  background: #fef2f2;
}

/* Action Buttons ở cột cuối */
.action-flex {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}
.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #9ca3af;
  transition: all 0.2s;
}
.action-btn.edit:hover {
  color: #2563eb;
  background: #eff6ff;
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