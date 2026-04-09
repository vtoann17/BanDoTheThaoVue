<script setup>
import { ref, onMounted, computed, watch } from "vue";
import AdminLayout from "../../../layouts/AdminLayout.vue";
import { useReviews } from "@/stores/reviews";

const reviewStore = useReviews();

const search = ref("");
const sortValue = ref("id|desc");
const sortKey = ref("id");
const sortDir = ref("desc");
const currentPage = ref(1);
const perPage = 5;

const filterRating = ref(""); // "" = all, "1"-"5"

async function fetchData() {
  await reviewStore.loadReviews({
    search: search.value,
    sort_by: sortKey.value,
    sort_dir: sortDir.value,
    per_page: perPage,
    page: currentPage.value,
    rating: filterRating.value || undefined,
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

function onRatingFilter() {
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
  if (p < 1 || p > reviewStore.lastPage) return;
  currentPage.value = p;
}

const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= reviewStore.lastPage; i++) pages.push(i);
  return pages;
});

const rangeStart = computed(() =>
  reviewStore.total === 0 ? 0 : (currentPage.value - 1) * perPage + 1
);
const rangeEnd = computed(() =>
  Math.min(currentPage.value * perPage, reviewStore.total)
);

async function handleDelete(id) {
  const ok = await reviewStore.deleteReview(id);
  if (ok) fetchData();
}

function renderStars(rating) {
  return rating;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function ratingClass(rating) {
  if (rating >= 4) return "rating-high";
  if (rating === 3) return "rating-mid";
  return "rating-low";
}

function truncate(text, len = 80) {
  if (!text) return "—";
  return text.length > len ? text.slice(0, len) + "…" : text;
}
</script>

<template>
  <AdminLayout>
    <div class="content-header">
      <div class="content-titles">
        <h2>Quản lý Đánh giá</h2>
        <p>Xem và quản lý tất cả đánh giá sản phẩm từ khách hàng.</p>
      </div>
    </div>

    <div class="data-card">
      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="filter-search-box">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm hoặc bình luận..."
            class="filter-input"
            v-model="search"
            @input="onSearchInput"
          />
        </div>

        <!-- Rating filter -->
        <div class="filter-select-box">
          <select class="filter-select" v-model="filterRating" @change="onRatingFilter">
            <option value="">Tất cả sao</option>
            <option value="5">★★★★★ 5 sao</option>
            <option value="4">★★★★☆ 4 sao</option>
            <option value="3">★★★☆☆ 3 sao</option>
            <option value="2">★★☆☆☆ 2 sao</option>
            <option value="1">★☆☆☆☆ 1 sao</option>
          </select>
          <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <!-- Sort -->
        <div class="filter-select-box">
          <select class="filter-select" v-model="sortValue" @change="onSortChange">
            <option value="id|desc">Mới nhất</option>
            <option value="id|asc">Cũ nhất</option>
            <option value="rating|desc">Sao cao - thấp</option>
            <option value="rating|asc">Sao thấp - cao</option>
          </select>
          <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Table -->
      <div class="table-responsive">
        <table class="review-table">
          <thead>
            <tr>
              <th class="sortable" @click="toggleSort('id')" style="width: 70px; cursor: pointer">
                ID
                <span class="sort-icon" :style="{ color: sortKey === 'id' ? '#2563eb' : '' }">
                  {{ sortIcon("id") }}
                </span>
              </th>
              <th style="width: 160px">NGƯỜI DÙNG</th>
              <th>SẢN PHẨM</th>
              <th class="sortable" @click="toggleSort('rating')" style="width: 120px; cursor: pointer">
                ĐÁNH GIÁ
                <span class="sort-icon" :style="{ color: sortKey === 'rating' ? '#2563eb' : '' }">
                  {{ sortIcon("rating") }}
                </span>
              </th>
              <th>BÌNH LUẬN</th>
              <th style="width: 120px">NGÀY TẠO</th>
              <th class="text-right" style="width: 90px">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="reviewStore.reviews.length === 0">
              <td colspan="7" style="text-align: center; padding: 48px 0; color: #9ca3af">
                Chưa có đánh giá nào
              </td>
            </tr>

            <tr v-for="item in reviewStore.reviews" :key="item.id">
              <td class="font-medium text-gray">#{{ item.id }}</td>

              <!-- User -->
              <td>
                <div class="user-cell">
                  <div class="user-avatar-badge">
                    {{ item.user?.name?.charAt(0)?.toUpperCase() || "?" }}
                  </div>
                  <div class="user-info-text">
                    <span class="user-name-text">{{ item.user?.name || `User #${item.user_id}` }}</span>
                  </div>
                </div>
              </td>

              <!-- Product -->
              <td class="font-semibold">
                {{ item.product?.name || `Sản phẩm #${item.product_id}` }}
              </td>

              <!-- Rating -->
              <td>
                <div class="rating-cell">
                  <span :class="['rating-badge', ratingClass(item.rating)]">
                    <span class="star-icon">★</span>
                    {{ item.rating }}/5
                  </span>
                  <div class="star-row">
                    <span
                      v-for="s in 5"
                      :key="s"
                      :class="s <= item.rating ? 'star-fill' : 'star-empty'"
                    >★</span>
                  </div>
                </div>
              </td>

              <!-- Comment -->
              <td class="comment-cell">
                <span v-if="item.comment" :title="item.comment">
                  {{ truncate(item.comment) }}
                </span>
                <span v-else class="no-comment">Không có bình luận</span>
              </td>

              <!-- Date -->
              <td class="text-gray" style="font-size: 13px">
                {{ formatDate(item.created_at) }}
              </td>

              <!-- Actions -->
              <td class="col-actions">
                <div class="actions-wrapper">
                  <button
                    class="btn-action btn-delete"
                    @click="handleDelete(item.id)"
                    title="Xóa"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <span class="pagination-info">
          Hiển thị {{ rangeStart }} - {{ rangeEnd }} trong tổng số
          {{ reviewStore.total }} đánh giá
        </span>
        <div class="pagination-pages">
          <button
            class="page-btn"
            :class="{ disabled: currentPage === 1 }"
            @click="goPage(currentPage - 1)"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
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
            :class="{ disabled: currentPage === reviewStore.lastPage }"
            @click="goPage(currentPage + 1)"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
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

/* --- Header --- */
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
  font-family: "Inter", sans-serif;
}

.content-titles p {
  font-size: 14px;
  color: #4b5563;
}

/* --- Card --- */
.data-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* --- Filter Bar --- */
.filter-bar {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  flex-wrap: wrap;
}

.filter-search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.filter-input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: "Inter", sans-serif;
}

.filter-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
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
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  min-width: 160px;
  outline: none;
  cursor: pointer;
  font-family: "Inter", sans-serif;
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

/* --- Table --- */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.review-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-family: "Inter", sans-serif;
}

.review-table th {
  padding: 14px 20px;
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

.review-table td {
  padding: 14px 20px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
  font-size: 14px;
}

.review-table tbody tr:hover {
  background-color: #f9fafb;
  transition: background-color 0.15s;
}

/* --- User Cell --- */
.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar-badge {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb 0%, #60a5fa 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-name-text {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
}

/* --- Rating --- */
.rating-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rating-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
}

.star-icon {
  font-size: 12px;
}

.rating-high {
  background-color: #d1fae5;
  color: #047857;
}

.rating-mid {
  background-color: #fef3c7;
  color: #92400e;
}

.rating-low {
  background-color: #fee2e2;
  color: #b91c1c;
}

.star-row {
  display: flex;
  gap: 1px;
}

.star-fill {
  color: #f59e0b;
  font-size: 13px;
}

.star-empty {
  color: #d1d5db;
  font-size: 13px;
}

/* --- Comment --- */
.comment-cell {
  max-width: 280px;
  color: #374151;
  font-size: 13px;
  line-height: 1.5;
}

.no-comment {
  color: #d1d5db;
  font-style: italic;
}

/* --- Misc --- */
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; color: #111827; }
.text-gray { color: #4b5563; }
.text-right { text-align: right; }

/* --- Actions --- */
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
  padding: 6px;
  border-radius: 6px;
  transition: background-color 0.2s, color 0.2s;
  color: #9ca3af;
}

.btn-action:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.btn-delete:hover {
  background-color: #fef2f2 !important;
  color: #ef4444 !important;
}

.btn-action svg {
  width: 18px;
  height: 18px;
  display: block;
}

/* --- Pagination --- */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.pagination-info {
  font-size: 13px;
  color: #4b5563;
  font-family: "Inter", sans-serif;
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
  font-family: "Inter", sans-serif;
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
</style>