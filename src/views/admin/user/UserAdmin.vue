<script setup>
// Giữ nguyên phần script của bạn
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { useUsers } from "@/stores/users"; 
import { useNotify } from "@/composables/useNotify";

const router = useRouter();
const notify = useNotify();
const userStore = useUsers();

const apiBase = import.meta.env.VITE_API_BASE;
const search = ref("");
const roleFilter = ref("");
const sortValue = ref("id|desc");
const sortKey = ref("id");
const sortDir = ref("desc");
const currentPage = ref(1);
const perPage = 5;

async function fetchData() {
    await userStore.loadUsers({
        search: search.value,
        role: roleFilter.value,
        sort_by: sortKey.value,
        sort_dir: sortDir.value,
        per_page: perPage,
        page: currentPage.value,
    });
}

onMounted(fetchData);
watch(currentPage, fetchData);

let searchTimer = null;
function onSearchInput() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        currentPage.value = 1;
        fetchData();
    }, 400);
}

function onFilterChange() {
    const [key, dir] = sortValue.value.split("|");
    sortKey.value = key;
    sortDir.value = dir;
    currentPage.value = 1;
    fetchData();
}

function goPage(p) {
    if (p < 1 || (userStore.lastPage && p > userStore.lastPage)) return;
    currentPage.value = p;
}

const pageNumbers = computed(() => {
    const pages = [];
    const last = userStore.lastPage || 1;
    for (let i = 1; i <= last; i++) pages.push(i);
    return pages;
});

const rangeStart = computed(() =>
    userStore.total === 0 ? 0 : (currentPage.value - 1) * perPage + 1
);
const rangeEnd = computed(() =>
    Math.min(currentPage.value * perPage, userStore.total || 0)
);

async function handleDelete(id) {
    const ok = await userStore.deleteUser(id);
    if (ok) fetchData();
}

function goToAdd() { router.push("/useradd"); }
function goToEdit(id) { router.push(`/useredit/${id}`); }

function getAvatar(path) {
    if (!path) return "https://ui-avatars.com/api/?name=User&background=random";
    if (path.startsWith("http")) return path; 
    const base = apiBase.split("/api")[0];
    return `${base}/storage/${path.replace(/^public\//, "")}`;
}
</script>

<template>
  <AdminLayout>
    <div class="user-admin-container">
      <div class="header-section">
        <div class="title-area">
          <h1>Người dùng</h1>
          <p>Quản lý thành viên hệ thống (Tổng: <span>{{ userStore.total }}</span>)</p>
        </div>
        <button class="btn-primary-custom" @click="goToAdd">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg>
          Thêm thành viên
        </button>
      </div>

      <div class="filter-card">
        <div class="filter-flex-container">
          <div class="filter-item-search">
            <label class="filter-label">Tìm kiếm</label>
            <div class="search-input-wrapper">
              <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" placeholder="Tên hoặc email..." v-model="search" @input="onSearchInput" />
            </div>
          </div>

          <div class="filter-item-select">
            <label class="filter-label">Vai trò</label>
            <select v-model="roleFilter" @change="onFilterChange">
              <option value="">Tất cả</option>
              <option value="admin">Quản trị viên</option>
              <option value="user">Người dùng</option>
            </select>
          </div>

          <div class="filter-item-select">
            <label class="filter-label">Sắp xếp</label>
            <select v-model="sortValue" @change="onFilterChange">
              <option value="id|desc">Mới nhất</option>
              <option value="name|asc">Tên A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-card">
        <table class="main-table">
          <thead>
            <tr>
              <th width="60">ID</th>
              <th>NGƯỜI DÙNG</th>
              <th width="140">VAI TRÒ</th>
              <th width="120">NGUỒN</th>
              <th width="100" class="text-right">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="userStore.users.length === 0">
              <td colspan="5" class="empty-msg">Không tìm thấy thành viên</td>
            </tr>
            <tr v-for="user in userStore.users" :key="user.id">
              <td class="id-col">#{{ user.id }}</td>
              <td>
                <div class="user-info-group">
                  <div class="avatar-squircle">
                    <img :src="getAvatar(user.avatar)" alt="Avatar" />
                  </div>
                  <div class="user-text">
                    <div class="name">{{ user.name }}</div>
                    <div class="email">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span :class="['pill-role', user.role]">
                  {{ user.role === 'admin' ? 'Quản trị' : 'Thành viên' }}
                </span>
              </td>
              <td>
                <div class="source-info">
                  <span :class="['dot', user.provider === 'google' ? 'google' : 'system']"></span>
                  {{ user.provider || 'Hệ thống' }}
                </div>
              </td>
              <td class="text-right">
                <div class="btn-actions">
                  <button class="action-btn edit" @click="goToEdit(user.id)" title="Sửa">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </button>
                  <button class="action-btn delete" @click="handleDelete(user.id)" title="Xóa">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="table-footer">
          <div class="pagination-info">
            Hiển thị <b>{{ rangeStart }}-{{ rangeEnd }}</b> / <b>{{ userStore.total }}</b>
          </div>
          <div class="pagination-controls">
            <button class="p-nav" :disabled="currentPage === 1" @click="goPage(currentPage - 1)">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button v-for="p in pageNumbers" :key="p" class="p-btn" :class="{ active: p === currentPage }" @click="goPage(p)">
              {{ p }}
            </button>
            <button class="p-nav" :disabled="currentPage === userStore.lastPage" @click="goPage(currentPage + 1)">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.user-admin-container { padding: 24px; font-family: 'Inter', sans-serif; color: #1a202c; max-width: 100%; margin: 0 auto; box-sizing: border-box; }

/* Header */
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.title-area h1 { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0; }
.title-area p { font-size: 13px; color: #64748b; margin-top: 4px; }
.btn-primary-custom {
  background: #2563eb; color: #fff; border: none; padding: 10px 16px; border-radius: 8px;
  font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s;
}

/* Filter Bar - FIX DỨT ĐIỂM */
.filter-card {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
  padding: 16px 20px; margin-bottom: 24px; width: 100%; box-sizing: border-box;
}
.filter-flex-container { display: flex; align-items: flex-end; gap: 16px; width: 100%; }
.filter-label { display: block; font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px; }

.filter-item-search { flex: 1; min-width: 0; } /* Ép không đẩy khung */
.filter-item-select { width: 160px; flex-shrink: 0; } /* Độ rộng cố định vừa phải */

.search-input-wrapper { position: relative; width: 100%; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; color: #94a3b8; }

.filter-item-search input, .filter-item-select select {
  width: 100%; height: 40px; background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 8px; font-size: 13px; outline: none; box-sizing: border-box;
}
.filter-item-search input { padding-left: 36px; }
.filter-item-select select { padding: 0 10px; cursor: pointer; }

/* Table Section - BỎ THANH TRƯỢT */
.table-card {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); width: 100%; overflow: hidden;
}
.main-table {
  width: 100%; border-collapse: collapse;
  table-layout: fixed; /* BẮT BUỘC: Ép các cột theo đúng % width */
}

.main-table th {
  background: #f8fafc; padding: 12px 16px; text-align: left;
  font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
}
.main-table td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }

/* Cell Content */
.id-col { color: #94a3b8; font-family: monospace; font-size: 12px; }
.user-info-group { display: flex; align-items: center; gap: 10px; overflow: hidden; }
.avatar-squircle {
  width: 38px; height: 38px; border-radius: 10px; overflow: hidden;
  border: 1px solid #e2e8f0; flex-shrink: 0;
}
.avatar-squircle img { width: 100%; height: 100%; object-fit: cover; }
.user-text { overflow: hidden; }
.user-text .name { font-weight: 700; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-text .email { font-size: 11px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Badges */
.pill-role { padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
.pill-role.admin { background: #dcfce7; color: #15803d; }
.pill-role.user { background: #f1f5f9; color: #475569; }

.source-info { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #475569; }
.dot { width: 6px; height: 6px; border-radius: 50%; }
.dot.google { background: #ea4335; }
.dot.system { background: #3b82f6; }

/* Actions */
.btn-actions { display: flex; gap: 6px; justify-content: flex-end; }
.action-btn {
  width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e2e8f0;
  background: #fff; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.action-btn.edit:hover { color: #2563eb; border-color: #2563eb; background: #eff6ff; }
.action-btn.delete:hover { color: #ef4444; border-color: #ef4444; background: #fef2f2; }

/* Footer */
.table-footer { padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; }
.pagination-info { font-size: 12px; color: #64748b; }
.pagination-controls { display: flex; gap: 4px; }
.p-btn, .p-nav {
  min-width: 30px; height: 30px; border: 1px solid #e2e8f0; background: #fff;
  border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer;
}
.p-btn.active { background: #2563eb; color: #fff; border-color: #2563eb; }
.text-right { text-align: right; }
</style>