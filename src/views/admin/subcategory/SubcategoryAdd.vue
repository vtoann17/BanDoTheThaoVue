<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "../../../layouts/AdminLayout.vue";
import { useCategories } from "../../../stores/categories";
import { useSubcategories } from "../../../stores/subcategory";

const router = useRouter();
const categoryStore = useCategories();
const subStore = useSubcategories();

const form = reactive({ name: "", slug: "", category_id: "" });
const errors = reactive({ name: "", slug: "", category_id: "" });
const loading = ref(false);
const categories = ref([]);

onMounted(async () => {
  await categoryStore.loadCategories();
  categories.value = categoryStore.categories;
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
  const result = await subStore.createSubcategory({
    name: form.name.trim(),
    slug: form.slug.trim(),
    category_id: form.category_id,
  });
  loading.value = false;
  if (result) router.push("/subcategoryadmin");
}

function resetForm() {
  Object.assign(form, { name: "", slug: "", category_id: "" });
  Object.assign(errors, { name: "", slug: "", category_id: "" });
}
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <nav class="breadcrumb">
        <a href="#" class="breadcrumb-link">Trang chủ</a>
        <span class="breadcrumb-sep">›</span>
        <a href="/subcategoryadmin" class="breadcrumb-link">Danh mục con</a>
        <span class="breadcrumb-sep">›</span>
        <span class="breadcrumb-current">Thêm mới</span>
      </nav>

      <div class="content-header">
        <h2>Thêm danh mục con</h2>
        <p>Tạo danh mục con liên kết với danh mục cha</p>
      </div>

      <div class="form-card">
        <div class="form-grid">

          <!-- Danh mục cha -->
          <div class="form-group">
            <label>Danh mục cha <span class="required">*</span></label>
            <div class="select-wrap">
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
            </div>
            <p v-if="errors.category_id" class="error-text">{{ errors.category_id }}</p>
          </div>

          <!-- Tên danh mục con -->
          <div class="form-group">
            <label>Tên danh mục con <span class="required">*</span></label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-error': errors.name }"
              v-model="form.name"
              @input="autoSlug"
              placeholder="Ví dụ: Điện thoại Samsung"
            />
            <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
          </div>

          <!-- Slug -->
          <div class="form-group col-span-2">
            <label>Slug <span class="required">*</span></label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-error': errors.slug }"
              v-model="form.slug"
              placeholder="dien-thoai-samsung"
            />
            <p v-if="errors.slug" class="error-text">{{ errors.slug }}</p>
            <p v-else class="hint-text">Tự động tạo từ tên — có thể chỉnh sửa thủ công</p>
          </div>

        </div>

        <div class="form-actions">
          <button class="btn-secondary" @click="resetForm">Hủy</button>
          <button class="btn-primary" :disabled="loading" @click="submitForm">
            <span v-if="loading" class="spinner" />
            {{ loading ? "Đang lưu..." : "Lưu danh mục con" }}
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

.page-content {
  padding: 32px;
  max-width: 1200px;
  font-family: "Inter", sans-serif;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 24px;
}
.breadcrumb-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.breadcrumb-link:hover {
  color: #111827;
}
.breadcrumb-separator {
  width: 14px;
  height: 14px;
  color: #9ca3af;
}
.breadcrumb-current {
  color: #111827;
  font-weight: 600;
}

/* Header */
.content-header {
  margin-bottom: 24px;
}
.content-titles h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 6px;
}
.content-titles p {
  font-size: 14px;
  color: #6b7280;
}

/* Form Card */
.form-card {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 32px;
}

.col-span-2 {
  grid-column: span 2;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 10px;
}

.form-control {
  width: 100%;
  border: 1px solid transparent;
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  font-family: inherit;
  color: #111827;
  outline: none;
  transition: all 0.2s;
}
.form-control::placeholder {
  color: #9ca3af;
}
.form-control:focus {
  background: #fff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.form-control.is-error {
  border-color: #ef4444;
  background: #fff;
}

.input-with-icon {
  position: relative;
}
.input-icon.right {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9ca3af;
  pointer-events: none;
}

.helper-text {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 8px;
}
.error-text {
  font-size: 12px;
  color: #ef4444;
  margin-top: 6px;
  font-weight: 500;
}

/* Upload Zone */
.upload-zone {
  position: relative;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: #f9fafb;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  overflow: hidden;
}
.upload-zone:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}
.upload-zone.has-preview {
  border-style: solid;
  border-color: #e5e7eb;
  background: #000;
  min-height: 220px;
}

.file-input-hidden {
  display: none;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 24px;
  text-align: center;
}
.upload-icon {
  width: 48px;
  height: 48px;
  color: #9ca3af;
}
.upload-text {
  font-size: 14px;
  color: #4b5563;
  font-weight: 500;
}
.upload-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: underline;
}
.upload-hint {
  font-size: 12px;
  color: #9ca3af;
}

.image-preview {
  width: 100%;
  height: 220px;
  object-fit: contain;
  display: block;
}

.remove-img-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  background: rgba(17, 24, 39, 0.75);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  transition: background 0.2s;
}
.remove-img-btn:hover {
  background: #ef4444;
}

.preview-filename {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(17, 24, 39, 0.6);
  color: #fff;
  font-size: 12px;
  padding: 6px 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.btn-secondary {
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}
.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading spinner */
.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.required { color: #ef4444; }
.hint-text { font-size: 12px; color: #94a3b8; margin-top: 6px; }
.select-wrap { position: relative; }
.select-wrap::after {
  content: "▾";
  position: absolute; right: 13px; top: 50%;
  transform: translateY(-50%);
  color: #94a3b8; pointer-events: none;
}
</style>