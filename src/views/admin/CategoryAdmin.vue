<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "../../layouts/AdminLayout.vue";
import { useCategories } from "@/stores/categories";
import { useNotify } from "@/composables/useNotify";

const router = useRouter();
const notify = useNotify();
const categoryStore = useCategories();

const search = ref("");
const apiBase = import.meta.env.VITE_API_BASE;

const statusFilter = ref("");
const sortKey = ref("id"); 
const sortDir = ref("asc"); 

const currentPage = ref(1);
const perPage = 4; 

onMounted(async () => {
  await categoryStore.loadCategories();
});

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortDir.value = "asc";
  }
  currentPage.value = 1;
}

function sortIcon(key) {
  if (sortKey.value !== key) return "↕";
  return sortDir.value === "asc" ? "↑" : "↓";
}

const filteredSortedCategories = computed(() => {
  let list = [...categoryStore.categories];


  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q)
    );
  }

  if (statusFilter.value === "active") {
    list = list.filter((c) => c.status === "active" || c.is_active);
  } else if (statusFilter.value === "inactive") {
    list = list.filter((c) => c.status !== "active" && !c.is_active);
  }

  list.sort((a, b) => {
    let va = a[sortKey.value] ?? "";
    let vb = b[sortKey.value] ?? "";
    if (typeof va === "string") va = va.toLowerCase();
    if (typeof vb === "string") vb = vb.toLowerCase();
    if (va < vb) return sortDir.value === "asc" ? -1 : 1;
    if (va > vb) return sortDir.value === "asc" ? 1 : -1;
    return 0;
  });

  return list;
});

const totalItems = computed(() => filteredSortedCategories.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / perPage)));

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredSortedCategories.value.slice(start, start + perPage);
});

const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) pages.push(i);
  return pages;
});

function goPage(p) {
  if (p < 1 || p > totalPages.value) return;
  currentPage.value = p;
}

function onSearchInput() { currentPage.value = 1; }
function onStatusChange() { currentPage.value = 1; }

async function handleDelete(id) {
  const confirmed = await notify.swalConfirm(
    "Bạn có muốn xóa không?",
    "Hành động này không thể hoàn tác"
  );
  if (!confirmed) return;

  const result = await categoryStore.deleteCategory(id);
  if (result) {
    notify.toastSuccess("Xóa danh mục thành công");
  } else {
    notify.toastError("Lỗi không xóa được danh mục");
  }
}

function goToAdd() { router.push("/categoryadd"); }
function goToEdit(id) { router.push(`/categoryedit/${id}`); }

function imageUrl(path) {
  if (!path) return null;
  return `${apiBase.replace("/api", "")}/storage/${path}`;
}

const rangeStart = computed(() => totalItems.value === 0 ? 0 : (currentPage.value - 1) * perPage + 1);
const rangeEnd   = computed(() => Math.min(currentPage.value * perPage, totalItems.value));
</script>

<template>
  <AdminLayout>
    <div class="content-header">
      <div class="content-titles">
        <h2>Quản lý Danh mục</h2>
        <p>Xem và quản lý các danh mục sản phẩm trong cửa hàng của bạn.</p>
      </div>
      <button class="btn-add" @click="goToAdd">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Thêm danh mục mới
      </button>
    </div>

    <div class="data-card">
      <!-- Filter bar -->
      <div class="filter-bar">
        <div class="filter-search-box">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            class="filter-input"
            v-model="search"
            @input="onSearchInput"
          />
        </div>

        <!-- Status dropdown -->
        <div class="filter-select-box">
          <select class="filter-select" v-model="statusFilter" @change="onStatusChange">
            <option value="">Trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Ẩn</option>
          </select>
          <svg class="select-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>

        <!-- Filter icon button -->
        <button class="btn-filter-icon" title="Lọc nâng cao">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 4h18M7 10h10M11 16h2"/>
          </svg>
        </button>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width:80px" class="sortable" @click="toggleSort('id')">
                ID <span class="sort-icon" :class="{ active: sortKey === 'id' }">{{ sortIcon('id') }}</span>
              </th>
              <th class="sortable" @click="toggleSort('name')">
                TÊN DANH MỤC <span class="sort-icon" :class="{ active: sortKey === 'name' }">{{ sortIcon('name') }}</span>
              </th>
              <th>SLUG</th>
              <!-- <th class="sortable" @click="toggleSort('created_at')">
                NGÀY TẠO <span class="sort-icon" :class="{ active: sortKey === 'created_at' }">{{ sortIcon('created_at') }}</span>
              </th> -->
              <th class="text-right">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            <!-- Empty: chưa có dữ liệu -->
            <tr v-if="categoryStore.categories.length === 0">
              <td colspan="5" class="empty-row">
                <div class="empty-state">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="40" height="40">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                  </svg>
                  <p>Chưa có danh mục nào</p>
                </div>
              </td>
            </tr>

            <tr v-for="cat in paginatedCategories" :key="cat.id">
              <td class="font-medium text-gray">#{{ cat.id }}</td>

              <!-- Tên + ảnh nhỏ inline -->
              <td>
                <div class="name-cell">
                  <img
                    v-if="cat.image"
                    :src="imageUrl(cat.image)"
                    :alt="cat.name"
                    class="cat-thumb"
                  />
                  <div v-else class="cat-thumb-placeholder">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"/>
                    </svg>
                  </div>
                  <span class="font-bold">{{ cat.name }}</span>
                </div>
              </td>

              <!-- Slug -->
              <td>
                <span class="slug-badge">{{ cat.slug }}</span>
              </td>

              <!-- Ngày tạo -->
              <!-- <td class="text-gray">
                {{
                  cat.created_at
                    ? new Date(cat.created_at).toLocaleDateString("vi-VN")
                    : "—"
                }}
              </td> -->

              <!-- Actions -->
              <td class="col-actions">
                <div class="actions-wrapper">
                  <button class="btn-action edit" @click="goToEdit(cat.id)" title="Sửa">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                  </button>
                  <button class="btn-action delete" @click="handleDelete(cat.id)" title="Xóa">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Không tìm thấy kết quả -->
            <tr v-if="categoryStore.categories.length > 0 && filteredSortedCategories.length === 0">
              <td colspan="5" class="empty-row">
                <p style="text-align:center;color:#9ca3af;padding:24px 0">
                  Không tìm thấy danh mục "<strong>{{ search }}</strong>"
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <span class="pagination-info">
          Hiển thị {{ rangeStart }} - {{ rangeEnd }} trong tổng số {{ totalItems }} danh mục
        </span>

        <div class="pagination-controls">
          <button
            class="page-btn nav-btn"
            :disabled="currentPage === 1"
            @click="goPage(currentPage - 1)"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
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
            :disabled="currentPage === totalPages"
            @click="goPage(currentPage + 1)"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

* { box-sizing: border-box; margin: 0; padding: 0; }

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 32px 32px 0;
}
.content-titles h2 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
.content-titles p  { font-size: 14px; color: #4b5563; }

.btn-add {
  background-color: #2563eb; color: #fff;
  border: none; padding: 10px 20px; border-radius: 8px;
  font-size: 14px; font-weight: 600;
  display: flex; align-items: center; gap: 8px;
  cursor: pointer; transition: background-color .2s;
}
.btn-add:hover { background-color: #1d4ed8; }
.btn-add svg { width: 18px; height: 18px; }

.data-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0,0,0,.05);
  margin: 24px 32px 32px;
}

/* Filter bar */
.filter-bar {
  display: flex; gap: 12px; align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 12px 12px 0 0;
}
.filter-search-box { position: relative; flex: 1; }
.filter-input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px; outline: none;
  transition: border-color .2s;
}
.filter-input:focus { border-color: #2563eb; }
.search-icon {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  width: 18px; height: 18px; color: #9ca3af; pointer-events: none;
}

/* Select filter */
.filter-select-box {
  position: relative;
  min-width: 150px;
}
.filter-select {
  width: 100%;
  appearance: none;
  padding: 10px 36px 10px 14px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  outline: none;
  cursor: pointer;
  transition: border-color .2s;
}
.filter-select:focus { border-color: #2563eb; }
.select-arrow {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  width: 16px; height: 16px; color: #6b7280; pointer-events: none;
}

/* Filter icon button */
.btn-filter-icon {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  color: #6b7280;
  transition: background .2s, color .2s;
  flex-shrink: 0;
}
.btn-filter-icon:hover { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
.btn-filter-icon svg { width: 18px; height: 18px; }

/* Table */
.table-responsive { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; }
.data-table th {
  padding: 14px 24px;
  font-size: 11px; font-weight: 700; color: #9ca3af;
  text-transform: uppercase; letter-spacing: .05em;
  border-bottom: 1px solid #e5e7eb; white-space: nowrap;
  user-select: none;
}
.data-table th.sortable {
  cursor: pointer;
}
.data-table th.sortable:hover { color: #374151; }
.sort-icon { margin-left: 4px; font-size: 12px; opacity: .4; }
.sort-icon.active { opacity: 1; color: #2563eb; }

.data-table td {
  padding: 14px 24px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
  font-size: 14px; white-space: nowrap;
}
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover { background: #f9fafb; }

.font-medium { font-weight: 500; }
.font-bold   { font-weight: 700; color: #111827; }
.text-gray   { color: #6b7280; }

/* Name cell: ảnh + tên */
.name-cell {
  display: flex; align-items: center; gap: 12px;
}
.cat-thumb {
  width: 36px; height: 36px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
}
.cat-thumb-placeholder {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  color: #d1d5db;
}
.cat-thumb-placeholder svg { width: 18px; height: 18px; }

.slug-badge {
  background: #f3f4f6; color: #4b5563;
  padding: 4px 10px; border-radius: 6px;
  font-size: 13px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* Actions */
.text-right  { text-align: right; }
.actions-wrapper {
  display: flex; justify-content: flex-end;
  align-items: center; gap: 6px;
}
.btn-action {
  background: none; border: none; cursor: pointer;
  padding: 7px; border-radius: 6px;
  transition: background .2s, color .2s;
  color: #9ca3af;
}
.btn-action.edit:hover  { background: #eff6ff; color: #2563eb; }
.btn-action.delete:hover { background: #fef2f2; color: #ef4444; }
.btn-action svg { width: 18px; height: 18px; display: block; }

/* Empty */
.empty-row { padding: 40px 0 !important; }
.empty-state {
  display: flex; flex-direction: column;
  align-items: center; gap: 12px;
  color: #9ca3af; padding: 32px 0;
}
.empty-state p { font-size: 14px; }

/* Pagination */
.pagination {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 24px;
  border-top: 1px solid #e5e7eb;
}
.pagination-info { font-size: 13px; color: #4b5563; }

.pagination-controls {
  display: flex; align-items: center; gap: 4px;
}
.page-btn {
  min-width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px; font-weight: 500; color: #374151;
  cursor: pointer;
  transition: background .15s, border-color .15s, color .15s;
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
  opacity: .35;
  cursor: not-allowed;
}
.page-btn.nav-btn { color: #6b7280; }
</style>