<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "../../../layouts/AdminLayout.vue";
import { useCategories } from "../../../stores/categories";
import { useNotify } from "@/composables/useNotify";

const router = useRouter();
const notify = useNotify();
const categoryStore = useCategories();
const form = reactive({ name: "", slug: "" });
const errors = reactive({ name: "", slug: "" });
const loading = ref(false);
const fileInput = ref(null);
const imageFile = ref(null);
const imagePreview = ref("");

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

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) setImage(file);
}

function onDrop(e) {
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) setImage(file);
}

function setImage(file) {
  imageFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  imageFile.value = null;
  imagePreview.value = "";
  if (fileInput.value) fileInput.value.value = "";
}

function validate() {
  errors.name = "";
  errors.slug = "";
  let ok = true;
  if (!form.name.trim()) {
    errors.name = "Tên danh mục không được để trống";
    ok = false;
  }
  if (!form.slug.trim()) {
    errors.slug = "Slug không được để trống";
    ok = false;
  }
  return ok;
}

async function submitForm() {
  if (!validate()) return;

  const fd = new FormData();
  fd.append("name", form.name.trim());
  fd.append("slug", form.slug.trim());
  if (imageFile.value) fd.append("image", imageFile.value);

  loading.value = true;
  const result = await categoryStore.createCategory(fd);
  loading.value = false;

  if (result) {
    router.push("/categoryadmin");
  }
}

function resetForm() {
  form.name = "";
  form.slug = "";
  errors.name = "";
  errors.slug = "";
  removeImage();
}
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <nav class="breadcrumb">
        <a href="#" class="breadcrumb-link">Trang chủ</a>
        <svg class="breadcrumb-separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <RouterLink to="/categoryadmin" class="breadcrumb-link">Danh mục</RouterLink>
        <svg class="breadcrumb-separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <span class="breadcrumb-current">Thêm danh mục mới</span>
      </nav>

      <div class="content-header">
        <div class="content-titles">
          <h2>Thêm danh mục mới</h2>
          <p>Tạo danh mục sản phẩm mới cho cửa hàng SportGear</p>
        </div>
      </div>

      <div class="form-card">
        <div class="form-grid">
          <div class="form-group">
            <label>Tên danh mục</label>
            <input type="text" class="form-control" :class="{ 'is-error': errors.name }"
              placeholder="Nhập tên danh mục (vd: Giày chạy bộ)" v-model="form.name" @input="autoSlug" />
            <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
          </div>

          <!-- Slug -->
          <div class="form-group">
            <label>Đường dẫn (Slug)</label>
            <div class="input-with-icon">
              <input type="text" class="form-control" :class="{ 'is-error': errors.slug }" placeholder="giay-chay-bo"
                v-model="form.slug" />
              <svg class="input-icon right" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1">
                </path>
              </svg>
            </div>
            <p v-if="errors.slug" class="error-text">{{ errors.slug }}</p>
            <p v-else class="helper-text">
              Tự động tạo từ tên hoặc nhập thủ công
            </p>
          </div>

          <div class="form-group col-span-2">
            <label>Ảnh danh mục</label>
            <div class="upload-zone" :class="{ 'has-preview': imagePreview }" @click="$refs.fileInput.click()"
              @dragover.prevent @drop.prevent="onDrop">
              <input ref="fileInput" type="file" accept="image/jpg,image/jpeg,image/png,image/gif"
                class="file-input-hidden" @change="onFileChange" />

              <template v-if="!imagePreview">
                <div class="upload-placeholder">
                  <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="upload-text">
                    Kéo &amp; thả ảnh vào đây, hoặc
                    <span class="upload-link">chọn file</span>
                  </p>
                  <p class="upload-hint">JPG, PNG, GIF · Tối đa 2MB</p>
                </div>
              </template>

              <template v-else>
                <img :src="imagePreview" class="image-preview" alt="Preview" />
                <button class="remove-img-btn" @click.stop="removeImage" title="Xóa ảnh">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div class="preview-filename">{{ imageFile?.name }}</div>
              </template>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-secondary" @click="resetForm" :disabled="loading">
            Hủy
          </button>
          <button class="btn-primary" @click="submitForm" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? "Đang lưu..." : "Lưu danh mục" }}
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
</style>