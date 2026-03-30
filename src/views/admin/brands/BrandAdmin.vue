<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { useBrands } from "@/stores/brands";
import { useNotify } from "@/composables/useNotify";

const router = useRouter();
const notify = useNotify();
const brandStore = useBrands();

const search = ref("");
const apiBase = import.meta.env.VITE_API_BASE;

const statusFilter = ref("");
const sortKey = ref("id");
const sortDir = ref("asc");

const currentPage = ref(1);
const perPage = 4;

onMounted(async () => {
    await brandStore.loadBrands();
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

const filteredSortedBrands = computed(() => {
    let list = [...brandStore.brands];

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

const totalItems = computed(() => filteredSortedBrands.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / perPage)));

const paginatedBrands = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return filteredSortedBrands.value.slice(start, start + perPage);
});

const pageNumbers = computed(() => {
    const pages = [];
    for (let i = 1; i <= totalPages.value; i++) pages.push(i);
    return pages;
});

function onSearchInput() { currentPage.value = 1; }
function onStatusChange() { currentPage.value = 1; }

function goPage(p) {
    if (p >= 1 && p <= totalPages.value) {
        currentPage.value = p;
    }
}

async function handleDelete(id) {
    const confirmed = await notify.swalConfirm(
        "Bạn có muốn xóa không?",
        "Hành động này không thể hoàn tác"
    );
    if (!confirmed) return;

    const result = await brandStore.deleteBrand(id);
    if (result) {
        notify.toastSuccess("Xóa thương hiệu thành công");
    } else {
        notify.toastError("Lỗi không xóa được thương hiệu");
    }
}

function goToAdd() { router.push("/brandadd"); }
function goToEdit(id) { router.push(`/brandedit/${id}`); }

function imageUrl(path) {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const base = apiBase.split('/api')[0];
    const cleanPath = path.replace(/^public\//, "");
    return `${base}/storage/${cleanPath}`;
}

const rangeStart = computed(() => totalItems.value === 0 ? 0 : (currentPage.value - 1) * perPage + 1);
const rangeEnd = computed(() => Math.min(currentPage.value * perPage, totalItems.value));
</script>

<template>
    <AdminLayout>
        <div class="content-body">
            <div class="page-header">
                <div>
                    <h1 class="page-title">Quản lý Thương hiệu</h1>
                    <p class="page-subtitle">Quản lý danh sách các thương hiệu sản phẩm trong hệ thống Sports Store.</p>
                </div>
                <button class="btn-primary" @click="goToAdd">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Thêm thương hiệu mới
                </button>
            </div>

            <div class="filter-bar">
                <div class="search-box">
                    <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18"
                        height="18">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input type="text" class="search-input" placeholder="Tìm kiếm thương hiệu..." v-model="search"
                        @input="onSearchInput" />
                </div>

                <div class="filter-actions">
                    <select class="status-select" v-model="statusFilter" @change="onStatusChange">
                        <option value="">Trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Ẩn</option>
                    </select>
                    <button class="btn-filter" title="Lọc nâng cao">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z">
                            </path>
                        </svg>
                        Lọc dữ liệu
                    </button>
                </div>
            </div>

            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 80px" class="sortable" @click="toggleSort('id')">
                                ID <span class="sort-icon" :class="{ active: sortKey === 'id' }">{{ sortIcon('id')
                                    }}</span>
                            </th>
                            <th style="width: 100px">HÌNH ẢNH</th>
                            <th class="sortable" @click="toggleSort('name')">
                                TÊN THƯƠNG HIỆU <span class="sort-icon" :class="{ active: sortKey === 'name' }">{{
                                    sortIcon('name') }}</span>
                            </th>
                            <th>SLUG</th>
                            <th class="text-right">THAO TÁC</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="filteredSortedBrands.length === 0">
                            <td colspan="5" class="empty-row">
                                <div class="empty-state">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="40" height="40">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <p>Chưa có thương hiệu nào</p>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="bran in paginatedBrands" :key="bran.id">
                            <td class="text-gray-500 font-medium">#{{ bran.id }}</td>
                            <td>
                                <div class="brand-logo-box">
                                    <img v-if="bran.image" :src="imageUrl(bran.image)" :alt="bran.name"
                                        class="cat-thumb"
                                        @error="(e) => e.target.src = 'https://placehold.co/100x100?text=No+Image'" />
                                    <div v-else class="cat-thumb-placeholder">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20"
                                            height="20">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                                        </svg>
                                    </div>
                                </div>
                            </td>
                            <td><span class="font-bold">{{ bran.name }}</span></td>
                            <td><span class="slug-badge">{{ bran.slug }}</span></td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn edit-btn" @click="goToEdit(bran.id)" title="Chỉnh sửa">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18"
                                            height="18">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                                            </path>
                                        </svg>
                                    </button>
                                    <button class="action-btn delete-btn" @click="handleDelete(bran.id)" title="Xóa">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18"
                                            height="18">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                            </path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="pagination-footer">
                    <span class="pagination-info">Hiển thị {{ rangeStart }} - {{ rangeEnd }} trong tổng số {{ totalItems
                        }} thương hiệu</span>
                    <div class="pagination-controls">
                        <button class="page-btn" :disabled="currentPage === 1" @click="goPage(currentPage - 1)">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>
                        <button v-for="p in pageNumbers" :key="p" class="page-btn"
                            :class="{ active: p === currentPage }" @click="goPage(p)">{{ p }}</button>
                        <button class="page-btn" :disabled="currentPage === totalPages"
                            @click="goPage(currentPage + 1)">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7">
                                </path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<style scoped>
/* CSS giữ nguyên như cũ của bạn, không có thay đổi */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.admin-layout {
    font-family: 'Inter', sans-serif;
    display: flex;
    min-height: 100vh;
    background-color: #f8fafc;
    color: #111827;
}

.content-body {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 1200px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 8px;
}

.page-title {
    font-size: 26px;
    font-weight: 800;
    color: #111827;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
}

.page-subtitle {
    font-size: 14px;
    color: #6b7280;
}

.btn-primary {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #1a73e8;
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    box-shadow: 0 4px 6px -1px rgba(26, 115, 232, 0.2);
}

.btn-primary:hover {
    background-color: #1557b0;
}

.filter-bar {
    display: flex;
    gap: 16px;
    align-items: center;
    padding: 20px;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
}

.search-box {
    position: relative;
    flex: 1;
    max-width: 450px;
}

.search-input {
    width: 100%;
    padding: 10px 16px 10px 40px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    background-color: #f9fafb;
    transition: all 0.2s;
}

.search-input:focus {
    border-color: #1a73e8;
    background-color: #ffffff;
}

.search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
}

.filter-actions {
    display: flex;
    gap: 12px;
    margin-left: auto;
}

.status-select {
    padding: 10px 36px 10px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    color: #4b5563;
    background-color: #f9fafb;
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url('data:image/svg+xml;utf8,<svg fill="none" stroke="%239ca3af" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>');
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
}

.btn-filter {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #e2e8f0;
    color: #475569;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-filter:hover {
    background-color: #cbd5e1;
}

.table-container {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
}

.data-table th {
    padding: 16px 24px;
    font-size: 12px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e5e7eb;
    background-color: #ffffff;
}

.data-table td {
    padding: 16px 24px;
    font-size: 14px;
    border-bottom: 1px solid #f3f4f6;
    vertical-align: middle;
}

.data-table tbody tr:hover {
    background-color: #f9fafb;
}

.brand-logo-box {
    width: 48px;
    height: 48px;
    background-color: #ffffff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb;
    overflow: hidden;
}

.cat-thumb {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
}

.slug-badge {
    background-color: #f1f5f9;
    color: #475569;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
}

.action-buttons {
    display: flex;
    gap: 12px;
}

.action-btn {
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.edit-btn {
    color: #3b82f6;
}

.delete-btn {
    color: #ef4444;
}

.pagination-footer {
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
}

.pagination-info {
    font-size: 14px;
    color: #6b7280;
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 6px;
}

.page-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s;
}

.page-btn:hover:not(.active) {
    background-color: #f3f4f6;
}

.page-btn.active {
    background-color: #1a73e8;
    color: #ffffff;
    border-color: #1a73e8;
}

.sortable {
    cursor: pointer;
}

.sort-icon {
    color: #d1d5db;
    margin-left: 4px;
}

.sort-icon.active {
    color: #1a73e8;
}
</style>