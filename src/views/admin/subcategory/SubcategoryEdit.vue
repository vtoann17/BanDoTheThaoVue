<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AdminLayout from "../../../layouts/AdminLayout.vue";
import { useCategories } from "../../../stores/categories";
import { useSubcategories } from "../../../stores/subcategory";
import { useNotify } from "@/composables/useNotify";

const router = useRouter();
const route = useRoute();
const notify = useNotify();
const categoryStore = useCategories();
const subStore = useSubcategories();

const form = reactive({ name: "", slug: "", category_id: "" });
const errors = reactive({ name: "", slug: "", category_id: "" });
const loading = ref(false);
const fetching = ref(true);
const categories = ref([]);

const subId = Number(route.params.id);

onMounted(async () => {
  await categoryStore.loadCategories();
  categories.value = categoryStore.categories;
  if (!subStore.subcategories.length) await subStore.loadSubcategories();
  const sub = subStore.subcategories.find((s) => s.id === subId);

  if (!sub) {
    notify.toastError("Không tìm thấy danh mục con");
    router.push("/subcategoryadmin");
    return;
  }

  form.name = sub.name;
  form.slug = sub.slug;
  form.category_id = sub.category_id;
  fetching.value = false;
});

function autoSlug() {
  form.slug = form.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function validate() {
  errors.name = form.name.trim() ? "" : "Tên danh mục không được để trống";
  errors.slug = form.slug.trim() ? "" : "Slug không được để trống";
  errors.category_id = form.category_id ? "" : "Vui lòng chọn danh mục cha";
  return !errors.name && !errors.slug && !errors.category_id;
}

async function submitForm() {
  if (!validate()) return;
  loading.value = true;
  const result = await subStore.updateSubcategory(subId, {
    name: form.name.trim(),
    slug: form.slug.trim(),
    category_id: form.category_id,
  });
  loading.value = false;
  if (result) router.push("/subcategoryadmin");
}

function resetForm() {
  const sub = subStore.subcategories.find((s) => s.id === subId);
  if (sub) {
    form.name = sub.name;
    form.slug = sub.slug;
    form.category_id = sub.category_id;
  }
  errors.name = "";
  errors.slug = "";
  errors.category_id = "";
}
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <nav class="breadcrumb">
        <a href="#" class="breadcrumb-link">Trang chủ</a>
        <svg class="breadcrumb-separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <RouterLink to="/subcategoryadmin" class="breadcrumb-link">Danh mục con</RouterLink>
        <svg class="breadcrumb-separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span class="breadcrumb-current">Chỉnh sửa danh mục con</span>
      </nav>

      <div class="content-header">
        <div class="content-titles">
          <h2>Chỉnh sửa danh mục con</h2>
          <p>Cập nhật thông tin danh mục con sản phẩm</p>
        </div>
      </div>

      <!-- Skeleton -->
      <div v-if="fetching" class="form-card skeleton-wrap">
        <div class="skeleton skeleton-input"></div>
        <div class="skeleton skeleton-input"></div>
        <div class="skeleton skeleton-input"></div>
      </div>

      <div v-else class="form-card">
        <div class="form-grid">

          <!-- Danh mục cha -->
          <div class="form-group">
            <label>Danh mục cha <span style="color:#ef4444">*</span></label>
            <select
              class="form-control"
              v-model="form.category_id"
              :class="{ 'is-error': errors.category_id }"
            >
              <option value="">-- Chọn danh mục --</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
            <p v-if="errors.category_id" class="error-text">{{ errors.category_id }}</p>
          </div>

          <!-- Tên danh mục con -->
          <div class="form-group">
            <label>Tên danh mục con <span style="color:#ef4444">*</span></label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-error': errors.name }"
              placeholder="Ví dụ: Điện thoại Samsung"
              v-model="form.name"
              @input="autoSlug"
            />
            <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
          </div>

          <!-- Slug -->
          <div class="form-group col-span-2">
            <label>Slug <span style="color:#ef4444">*</span></label>
            <div class="input-with-icon">
              <input
                type="text"
                class="form-control"
                :class="{ 'is-error': errors.slug }"
                placeholder="dien-thoai-samsung"
                v-model="form.slug"
              />
              <svg class="input-icon right" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <p v-if="errors.slug" class="error-text">{{ errors.slug }}</p>
            <p v-else class="helper-text">Tự động tạo từ tên — có thể chỉnh sửa thủ công</p>
          </div>

        </div>

        <div class="form-actions">
          <button class="btn-secondary" @click="resetForm" :disabled="loading">Hủy</button>
          <button class="btn-primary" @click="submitForm" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? "Đang lưu..." : "Cập nhật danh mục con" }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
/* Giữ nguyên toàn bộ style từ form Add, thêm skeleton */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

* { box-sizing: border-box; margin: 0; padding: 0; }

.page-content { padding: 32px; max-width: 1200px; font-family: "Inter", sans-serif; }

.breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 24px; }
.breadcrumb-link { color: #6b7280; text-decoration: none; font-weight: 500; transition: color 0.2s; }
.breadcrumb-link:hover { color: #111827; }
.breadcrumb-separator { width: 14px; height: 14px; color: #9ca3af; }
.breadcrumb-current { color: #111827; font-weight: 600; }

.content-header { margin-bottom: 24px; }
.content-titles h2 { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
.content-titles p { font-size: 14px; color: #6b7280; }

.form-card { background: #fff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb; box-shadow: 0 1px 2px rgba(0,0,0,.02); }

.skeleton-wrap { display: flex; flex-direction: column; gap: 20px; }
.skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; border-radius: 8px; }
.skeleton-input { height: 44px; }
.skeleton-img { height: 180px; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 32px; }
.col-span-2 { grid-column: span 2; }

.form-group label { display: block; font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 10px; }
.form-control { width: 100%; border: 1px solid transparent; background: #f9fafb; border-radius: 8px; padding: 12px 16px; font-size: 14px; font-family: inherit; color: #111827; outline: none; transition: all 0.2s; }
.form-control::placeholder { color: #9ca3af; }
.form-control:focus { background: #fff; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
.form-control.is-error { border-color: #ef4444; background: #fff; }

.input-with-icon { position: relative; }
.input-icon.right { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #9ca3af; pointer-events: none; }

.helper-text { font-size: 12px; color: #9ca3af; margin-top: 8px; }
.error-text { font-size: 12px; color: #ef4444; margin-top: 6px; font-weight: 500; }

.upload-zone { position: relative; border: 2px dashed #d1d5db; border-radius: 12px; background: #f9fafb; min-height: 180px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; overflow: hidden; }
.upload-zone:hover { border-color: #3b82f6; background: #eff6ff; }
.upload-zone.has-preview { border-style: solid; border-color: #e5e7eb; background: #000; min-height: 220px; }
.file-input-hidden { display: none; }

.upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 24px; text-align: center; }
.upload-icon { width: 48px; height: 48px; color: #9ca3af; }
.upload-text { font-size: 14px; color: #4b5563; font-weight: 500; }
.upload-link { color: #2563eb; font-weight: 600; text-decoration: underline; }
.upload-hint { font-size: 12px; color: #9ca3af; }

.image-preview { width: 100%; height: 220px; object-fit: contain; display: block; }
.remove-img-btn { position: absolute; top: 10px; right: 10px; width: 28px; height: 28px; background: rgba(17,24,39,.75); border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; transition: background 0.2s; }
.remove-img-btn:hover { background: #ef4444; }
.preview-filename { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(17,24,39,.6); color: #fff; font-size: 12px; padding: 6px 12px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; }

.form-actions { display: flex; justify-content: flex-end; align-items: center; gap: 12px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
.btn-secondary { background: #fff; color: #374151; border: 1px solid #d1d5db; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-secondary:hover:not(:disabled) { background: #f9fafb; border-color: #9ca3af; }
.btn-primary { display: flex; align-items: center; gap: 8px; background: #2563eb; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover:not(:disabled) { background: #1d4ed8; }
.btn-primary:disabled, .btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; flex-shrink: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>