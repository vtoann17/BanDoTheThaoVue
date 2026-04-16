<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { useCoupons } from "@/stores/coupons";

const router = useRouter();
const couponStore = useCoupons();

const search = ref("");
const sortValue = ref("id|desc");
const sortKey = ref("id");
const sortDir = ref("desc");
const currentPage = ref(1);
const perPage = 5;

onMounted(async () => {
  await couponStore.loadCoupons();
});

function goToCreate() {
  router.push("/couponadd");
}
function goToEdit(id) {
  router.push(`/couponedit/${id}`);
}

const filteredCoupons = computed(() => {
  let list = [...couponStore.coupons];
  if (search.value.trim()) {
    list = list.filter((c) =>
      c.code.toLowerCase().includes(search.value.toLowerCase())
    );
  }
  list.sort((a, b) => {
    let valA = a[sortKey.value],
      valB = b[sortKey.value];
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();
    if (valA < valB) return sortDir.value === "asc" ? -1 : 1;
    if (valA > valB) return sortDir.value === "asc" ? 1 : -1;
    return 0;
  });
  return list;
});

const total = computed(() => filteredCoupons.value.length);
const lastPage = computed(() => Math.max(1, Math.ceil(total.value / perPage)));
const pagedCoupons = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredCoupons.value.slice(start, start + perPage);
});
const pageNumbers = computed(() =>
  Array.from({ length: lastPage.value }, (_, i) => i + 1)
);
const rangeStart = computed(() =>
  total.value === 0 ? 0 : (currentPage.value - 1) * perPage + 1
);
const rangeEnd = computed(() =>
  Math.min(currentPage.value * perPage, total.value)
);

function onSortChange() {
  const [key, dir] = sortValue.value.split("|");
  sortKey.value = key;
  sortDir.value = dir;
  currentPage.value = 1;
}

let searchTimer = null;
function onSearchInput() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    currentPage.value = 1;
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
}

function sortIcon(key) {
  if (sortKey.value !== key) return "↕";
  return sortDir.value === "asc" ? "↑" : "↓";
}

function goPage(p) {
  if (p < 1 || p > lastPage.value) return;
  currentPage.value = p;
}

async function handleDelete(id) {
  await couponStore.deleteCoupon(id);
}

function formatMoney(val) {
  return Number(val).toLocaleString("vi-VN");
}

function formatDate(val) {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("vi-VN");
}

function isExpired(coupon) {
  if (!coupon.end_date) return false;
  return new Date(coupon.end_date) < new Date();
}
</script>

<template>
  <AdminLayout>
    <div class="page-wrapper">
      <div class="content-header">
        <div class="content-titles">
          <h2>Quản lý Mã Giảm Giá</h2>
          <p>Xem và quản lý các mã giảm giá trong cửa hàng của bạn.</p>
        </div>
        <button class="btn-add" @click="goToCreate">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm mã giảm giá mới
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
              placeholder="Tìm kiếm mã giảm giá..."
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
              <option value="code|asc">Mã A-Z</option>
              <option value="code|desc">Mã Z-A</option>
              <option value="discount_value|desc">Giá trị cao nhất</option>
              <option value="discount_value|asc">Giá trị thấp nhất</option>
            </select>
            <svg
              class="select-arrow"
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
          <table class="data-table">
            <thead>
              <tr>
                <th
                  style="width: 80px"
                  class="sortable"
                  @click="toggleSort('id')"
                >
                  ID
                  <span
                    class="sort-icon"
                    :class="{ active: sortKey === 'id' }"
                    >{{ sortIcon("id") }}</span
                  >
                </th>
                <th class="sortable" @click="toggleSort('code')">
                  MÃ COUPON
                  <span
                    class="sort-icon"
                    :class="{ active: sortKey === 'code' }"
                    >{{ sortIcon("code") }}</span
                  >
                </th>
                <th>LOẠI</th>
                <th class="sortable" @click="toggleSort('discount_value')">
                  GIÁ TRỊ
                  <span
                    class="sort-icon"
                    :class="{ active: sortKey === 'discount_value' }"
                    >{{ sortIcon("discount_value") }}</span
                  >
                </th>
                <th>ĐƠN TỐI THIỂU</th>
                <th>HẠN DÙNG</th>
                <th>SỐ LẦN DÙNG</th>
                <th>TRẠNG THÁI</th>
                <th class="text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="pagedCoupons.length === 0">
                <td colspan="9" class="empty-row">
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
                        d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                      />
                    </svg>
                    <p>Chưa có coupon nào</p>
                  </div>
                </td>
              </tr>
              <tr v-for="coupon in pagedCoupons" :key="coupon.id">
                <td class="font-medium text-gray">#{{ coupon.id }}</td>
                <td>
                  <span class="code-badge">{{ coupon.code }}</span>
                </td>
                <td>
                  <span
                    class="type-badge"
                    :class="
                      coupon.discount_type === 'percent'
                        ? 'type-percent'
                        : 'type-fixed'
                    "
                  >
                    {{
                      coupon.discount_type === "percent"
                        ? "Phần trăm"
                        : "Cố định"
                    }}
                  </span>
                </td>
                <td class="font-bold">
                  {{
                    coupon.discount_type === "percent"
                      ? Number(coupon.discount_value) + "%"
                      : formatMoney(coupon.discount_value) + "đ"
                  }}
                  <span
                    class="text-gray"
                    style="font-size: 12px; font-weight: 400"
                    v-if="
                      coupon.discount_type === 'percent' && coupon.max_discount
                    "
                  >
                    (tối đa {{ formatMoney(coupon.max_discount) }}đ)</span
                  >
                </td>
                <td class="text-gray">
                  {{
                    coupon.min_order_value
                      ? formatMoney(coupon.min_order_value) + "đ"
                      : "—"
                  }}
                </td>
                <td
                  class="text-gray"
                  :class="{ 'text-red': isExpired(coupon) }"
                >
                  {{ coupon.end_date ? formatDate(coupon.end_date) : "—" }}
                  <span v-if="isExpired(coupon)" class="expired-badge"
                    >Hết hạn</span
                  >
                </td>
                <td class="text-gray">
                  {{
                    coupon.usage_limit
                      ? (coupon.used_count ?? 0) + " / " + coupon.usage_limit
                      : (coupon.used_count ?? 0) + " / ∞"
                  }}
                </td>
                <td>
                  <span
                    class="status-badge"
                    :class="
                      coupon.is_active && !isExpired(coupon)
                        ? 'status-active'
                        : 'status-inactive'
                    "
                  >
                    {{
                      coupon.is_active && !isExpired(coupon)
                        ? "Hoạt động"
                        : "Tạm dừng"
                    }}
                  </span>
                </td>
                <td class="col-actions">
                  <div class="actions-wrapper">
                    <button
                      class="btn-action edit"
                      @click="goToEdit(coupon.id)"
                      title="Sửa"
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                      @click="handleDelete(coupon.id)"
                      title="Xóa"
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
          <span class="pagination-info"
            >Hiển thị {{ rangeStart }} - {{ rangeEnd }} /
            {{ total }} coupon</span
          >
          <div class="pagination-controls">
            <button
              class="page-btn nav-btn"
              :disabled="currentPage === 1"
              @click="goPage(currentPage - 1)"
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
              class="page-btn nav-btn"
              :disabled="currentPage === lastPage"
              @click="goPage(currentPage + 1)"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
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
  font-family: "Inter", sans-serif;
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
  font-family: "Inter", sans-serif;
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
  min-width: 180px;
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
  font-family: "Inter", sans-serif;
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
.text-red {
  color: #ef4444 !important;
}
.text-right {
  text-align: right;
}
.code-badge {
  background: #f3f4f6;
  color: #1f2937;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-family: ui-monospace, monospace;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.type-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.type-percent {
  background: #fef3c7;
  color: #b45309;
}
.type-fixed {
  background: #dbeafe;
  color: #1d4ed8;
}
.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.status-active {
  background: #dcfce7;
  color: #15803d;
}
.status-inactive {
  background: #f3f4f6;
  color: #6b7280;
}
.expired-badge {
  background: #fef2f2;
  color: #dc2626;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 4px;
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
  font-family: "Inter", sans-serif;
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