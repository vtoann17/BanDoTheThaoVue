<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import AdminLayout from "../../../layouts/AdminLayout.vue";
import { useVariants } from "../../../stores/variants";
import { useProducts } from "../../../stores/products";
import { useAttributeValues } from "../../../stores/attributeValues";

const router = useRouter();
const route = useRoute();
const variantStore = useVariants();
const productStore = useProducts();
const attributeValueStore = useAttributeValues();
const apiBase = import.meta.env.VITE_API_BASE;

const variantId = route.params.id;

const form = reactive({
  product_id: "",
  sku: "",
  stock: "",
  price: "",
  sale: "0",
  start: "",
  end: "",
  attribute_values: [],
});

const errors = reactive({
  product_id: "",
  sku: "",
  stock: "",
  price: "",
  attribute_values: "",
});

const loading = ref(false);
const pageLoading = ref(true);
const fileInput = ref(null);
const imageFile = ref(null);
const imagePreview = ref("");
const existingImage = ref("");

function toDatetimeLocal(value) {
  if (!value) return "";
  return value.slice(0, 16);
}

onMounted(async () => {
  await Promise.all([
    productStore.loadProducts({ per_page: 999 }),
    attributeValueStore.loadAttributeValues({ per_page: 999 }),
  ]);

  const variant = await variantStore.getVariant(variantId);
  if (variant) {
    form.product_id = variant.product_id ?? "";
    form.sku = variant.sku ?? "";
    form.stock = variant.stock ?? "";
    form.price = variant.price ?? "";
    form.sale = variant.sale ?? "0";
    form.start = toDatetimeLocal(variant.start);
    form.end = toDatetimeLocal(variant.end);
    form.attribute_values = Array.isArray(variant.attribute_values)
      ? variant.attribute_values.map((av) =>
          typeof av === "object" ? av.id : av
        )
      : [];
    existingImage.value = variant.img ?? "";
    if (variant.img) {
      imagePreview.value = imageUrl(variant.img);
    }
  }

  pageLoading.value = false;
});
function imageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${apiBase.replace("/api", "")}/storage/${path}`;
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
  existingImage.value = "";
  if (fileInput.value) fileInput.value.value = "";
}

function toggleAttributeValue(id) {
  const idx = form.attribute_values.indexOf(id);
  if (idx === -1) form.attribute_values.push(id);
  else form.attribute_values.splice(idx, 1);
}

function validate() {
  errors.product_id = "";
  errors.sku = "";
  errors.stock = "";
  errors.price = "";
  errors.attribute_values = "";
  let ok = true;

  if (!form.product_id) {
    errors.product_id = "Vui lòng chọn sản phẩm";
    ok = false;
  }
  if (!form.sku.trim()) {
    errors.sku = "SKU không được để trống";
    ok = false;
  }
  if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) {
    errors.stock = "Số lượng tồn kho không hợp lệ";
    ok = false;
  }
  if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
    errors.price = "Giá không hợp lệ";
    ok = false;
  }
  if (form.attribute_values.length === 0) {
    errors.attribute_values = "Vui lòng chọn ít nhất một giá trị thuộc tính";
    ok = false;
  }

  return ok;
}

async function submitForm() {
  if (!validate()) return;
  const payload = {
    product_id: form.product_id,
    sku: form.sku.trim(),
    stock: form.stock,
    price: form.price,
    sale: form.sale || 0,
    start: form.start || null,
    end: form.end || null,
    attribute_values: form.attribute_values,
  };

  if (imageFile.value) {
    const fd = new FormData();
    Object.entries(payload).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        val.forEach((v) => fd.append(`${key}[]`, v));
      } else if (val !== null && val !== undefined) {
        fd.append(key, val);
      }
    });
    fd.append("img", imageFile.value);
    fd.append("_method", "PUT");

    loading.value = true;
    const result = await variantStore.updateVariant(variantId, fd);
    loading.value = false;
    if (result) goBack();
    return;
  }

  loading.value = true;
  const result = await variantStore.updateVariant(variantId, payload);
  loading.value = false;
  if (result) goBack();
}

function goBack() {
  router.push(`/variantadmin/${form.product_id}`);
}

const groupedValues = computed(() => {
  const groups = {};
  for (const val of attributeValueStore.attributeValues || []) {
    const attrName = val.attribute?.name || "Khác";
    if (!groups[attrName]) groups[attrName] = [];
    groups[attrName].push(val);
  }
  return groups;
});
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <RouterLink
          v-if="form.product_id"
          :to="`/variantadmin/${form.product_id}`"
          class="breadcrumb-link"
        >
          Quản lý Biến thể
        </RouterLink>
        <svg
          class="breadcrumb-separator"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span class="breadcrumb-current">Chỉnh sửa biến thể</span>
      </nav>

      <!-- Page loading skeleton -->
      <div v-if="pageLoading" class="skeleton-wrapper">
        <div class="skeleton skeleton-header"></div>
        <div class="form-grid">
          <div>
            <div class="skeleton skeleton-card"></div>
            <div class="skeleton skeleton-card-sm"></div>
          </div>
          <div class="skeleton skeleton-card-right"></div>
        </div>
      </div>

      <template v-else>
        <div class="content-header">
          <div class="content-titles">
            <h2>Chỉnh sửa biến thể</h2>
            <p>Cập nhật thông tin cho biến thể sản phẩm</p>
          </div>
          <div class="header-buttons">
            <button class="btn-secondary" @click="goBack" :disabled="loading">
              Hủy
            </button>
            <button class="btn-primary" @click="submitForm" :disabled="loading">
              <svg
                v-if="loading"
                class="spin-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {{ loading ? "Đang lưu..." : "Lưu thay đổi" }}
            </button>
          </div>
        </div>

        <div class="form-grid">
          <!-- Cột trái -->
          <div class="form-col-left">
            <div class="card">
              <h3 class="card-title">Thông tin biến thể</h3>

              <!-- Sản phẩm -->
              <div class="form-group">
                <label>Sản phẩm *</label>
                <div class="select-wrapper">
                  <select
                    class="form-control"
                    :class="{ 'is-error': errors.product_id }"
                    v-model="form.product_id"
                  >
                    <option value="">-- Chọn sản phẩm --</option>
                    <option
                      v-for="p in productStore.products"
                      :key="p.id"
                      :value="p.id"
                    >
                      {{ p.name }}
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
                <p v-if="errors.product_id" class="error-text">
                  {{ errors.product_id }}
                </p>
              </div>

              <!-- SKU -->
              <div class="form-group">
                <label>SKU *</label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-error': errors.sku }"
                  placeholder="Ví dụ: NIKE-AIR-RED-42"
                  v-model="form.sku"
                />
                <p v-if="errors.sku" class="error-text">{{ errors.sku }}</p>
              </div>

              <!-- Giá & Tồn kho -->
              <div class="form-row-2">
                <div class="form-group">
                  <label>Giá bán (VNĐ) *</label>
                  <div class="input-with-suffix">
                    <input
                      type="number"
                      class="form-control"
                      :class="{ 'is-error': errors.price }"
                      placeholder="0"
                      v-model="form.price"
                    />
                    <span class="suffix">đ</span>
                  </div>
                  <p v-if="errors.price" class="error-text">
                    {{ errors.price }}
                  </p>
                </div>

                <div class="form-group">
                  <label>Tồn kho *</label>
                  <div class="input-with-suffix">
                    <input
                      type="number"
                      class="form-control"
                      :class="{ 'is-error': errors.stock }"
                      placeholder="0"
                      v-model="form.stock"
                    />
                    <span class="suffix">sp</span>
                  </div>
                  <p v-if="errors.stock" class="error-text">
                    {{ errors.stock }}
                  </p>
                </div>
              </div>

              <!-- Giảm giá & thời gian -->
              <div class="form-row-2">
                <div class="form-group">
                  <label>Giảm giá (%)</label>
                  <div class="input-with-suffix">
                    <input
                      type="number"
                      class="form-control"
                      placeholder="0"
                      v-model="form.sale"
                      min="0"
                      max="100"
                    />
                    <span class="suffix">%</span>
                  </div>
                </div>
                <div class="form-group">
                  <!-- placeholder col -->
                </div>
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label>Ngày bắt đầu giảm giá</label>
                  <input
                    type="datetime-local"
                    class="form-control"
                    v-model="form.start"
                  />
                </div>
                <div class="form-group">
                  <label>Ngày kết thúc giảm giá</label>
                  <input
                    type="datetime-local"
                    class="form-control"
                    v-model="form.end"
                  />
                </div>
              </div>
            </div>

            <!-- Giá trị thuộc tính -->
            <div class="card">
              <h3 class="card-title">Giá trị thuộc tính *</h3>
              <p
                v-if="errors.attribute_values"
                class="error-text"
                style="margin-bottom: 12px"
              >
                {{ errors.attribute_values }}
              </p>

              <div
                v-for="(values, attrName) in groupedValues"
                :key="attrName"
                class="attr-group"
              >
                <p class="attr-group-label">{{ attrName }}</p>
                <div class="attr-values">
                  <button
                    v-for="val in values"
                    :key="val.id"
                    type="button"
                    class="attr-chip"
                    :class="{
                      selected: form.attribute_values.includes(val.id),
                    }"
                    @click="toggleAttributeValue(val.id)"
                  >
                    {{ val.value }}
                  </button>
                </div>
              </div>

              <div
                v-if="Object.keys(groupedValues).length === 0"
                class="empty-attr"
              >
                <p>Chưa có giá trị thuộc tính nào</p>
              </div>
            </div>
          </div>

          <!-- Cột phải -->
          <div class="form-col-right">
            <div class="card">
              <h3 class="card-title">Hình ảnh biến thể</h3>

              <input
                type="file"
                ref="fileInput"
                class="hidden-input"
                accept="image/*"
                @change="onFileChange"
              />

              <div
                v-if="!imagePreview"
                class="upload-zone"
                @click="fileInput.click()"
                @dragover.prevent
                @drop.prevent="onDrop"
              >
                <div class="upload-icon-wrapper">
                  <svg
                    class="upload-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </div>
                <div class="upload-text">
                  Click để tải lên hoặc<br />kéo thả
                </div>
                <div class="upload-hint">PNG, JPG (Tối đa 5MB)</div>
              </div>

              <div v-else class="preview-wrapper">
                <div class="preview-container">
                  <img
                    :src="imagePreview"
                    alt="Preview"
                    class="preview-image"
                  />
                  <button
                    type="button"
                    class="remove-btn"
                    @click="removeImage"
                    title="Xóa ảnh"
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
                        stroke-width="2.5"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <!-- Badge: existing vs new -->
                <div class="image-meta">
                  <span v-if="imageFile" class="badge badge-new">
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Ảnh mới
                  </span>
                  <span v-else class="badge badge-existing">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Ảnh hiện tại
                  </span>
                  <p class="file-name-text">
                    {{ imageFile?.name || existingImage }}
                  </p>
                </div>
                <button
                  type="button"
                  class="btn-change-image"
                  @click="fileInput.click()"
                >
                  Đổi ảnh khác
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
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
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 8px;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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
.header-buttons {
  display: flex;
  gap: 12px;
}

.btn-secondary {
  background-color: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}
.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-primary:hover {
  background-color: #1d4ed8;
}
.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Spin icon for loading state */
.spin-icon {
  width: 16px;
  height: 16px;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Layout */
.form-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 24px;
}
@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

/* Card */
.card {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}
.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 20px;
}

/* Form */
.form-group {
  margin-bottom: 20px;
}
.form-group:last-child {
  margin-bottom: 0;
}
.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.form-control {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  color: #111827;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-control::placeholder {
  color: #9ca3af;
}
.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.form-control:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  color: #6b7280;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.select-wrapper {
  position: relative;
}
.select-wrapper select {
  appearance: none;
  cursor: pointer;
}
.select-wrapper .dropdown-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #6b7280;
  pointer-events: none;
}

.input-with-suffix {
  position: relative;
}
.input-with-suffix .suffix {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 14px;
  font-weight: 500;
  pointer-events: none;
}

/* Attribute chips */
.attr-group {
  margin-bottom: 16px;
}
.attr-group:last-child {
  margin-bottom: 0;
}
.attr-group-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}
.attr-values {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.attr-chip {
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  border: 1.5px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  cursor: pointer;
  transition: all 0.18s;
}
.attr-chip:hover {
  border-color: #93c5fd;
  background: #eff6ff;
  color: #2563eb;
}
.attr-chip.selected {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.empty-attr {
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
  padding: 16px 0;
}

/* Upload */
.hidden-input {
  display: none;
}
.upload-zone {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #fafbfc;
  cursor: pointer;
  transition: all 0.2s;
}
.upload-zone:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}
.upload-icon-wrapper {
  width: 40px;
  height: 40px;
  background-color: #eff6ff;
  color: #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.upload-icon {
  width: 24px;
  height: 24px;
}
.upload-text {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  margin-bottom: 4px;
}
.upload-hint {
  font-size: 12px;
  color: #9ca3af;
}

.preview-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.preview-container {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
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
.remove-btn:hover {
  background: #ef4444;
}

/* Image meta row */
.image-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}
.badge-new {
  background: #dcfce7;
  color: #16a34a;
}
.badge-existing {
  background: #eff6ff;
  color: #2563eb;
}
.file-name-text {
  font-size: 12px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-change-image {
  width: 100%;
  padding: 8px 16px;
  border: 1.5px dashed #d1d5db;
  border-radius: 8px;
  background: #fafbfc;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-change-image:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #2563eb;
}

/* Validation */
.is-error {
  border-color: #ef4444 !important;
}
.error-text {
  font-size: 12px;
  color: #ef4444;
  margin-top: 6px;
  font-weight: 500;
}

/* Skeleton loader */
.skeleton-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 12px;
}
.skeleton-header {
  height: 60px;
}
.skeleton-card {
  height: 340px;
  margin-bottom: 24px;
}
.skeleton-card-sm {
  height: 160px;
}
.skeleton-card-right {
  height: 260px;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>