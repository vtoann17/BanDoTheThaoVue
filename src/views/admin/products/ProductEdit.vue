<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AdminLayout from "../../../layouts/AdminLayout.vue";
import { useProducts } from "../../../stores/products";
import { useSubcategories } from "../../../stores/subcategory";
import { useBrands } from "../../../stores/brands";

const router = useRouter();
const route = useRoute();
const productStore = useProducts();
const subcategoryStore = useSubcategories();
const brandStore = useBrands();

const apiBase = import.meta.env.VITE_API_BASE;
const productId = route.params.id;

const form = reactive({
  name: "",
  slug: "",
  subcategory_id: "",
  brand_id: "",
  description: "",
  price: "",
  status: "1",
});

const errors = reactive({
  name: "",
  slug: "",
  subcategory_id: "",
  brand_id: "",
  price: "",
});

const loading = ref(false);
const fileInput = ref(null);
const imageFile = ref(null);
const imagePreview = ref("");
const existingImage = ref("");

onMounted(async () => {
  await Promise.all([
    subcategoryStore.loadSubcategories(),
    brandStore.loadBrands(),
  ]);

  const product = await productStore.getProduct(productId);
  if (product) {
    form.name = product.name ?? "";
    form.slug = product.slug ?? "";
    form.subcategory_id = product.subcategory_id
      ? Number(product.subcategory_id)
      : "";
    form.brand_id = product.brand_id ? Number(product.brand_id) : "";
    form.description = product.description ?? "";
    form.price = product.price ?? "";
    form.status = String(product.status ?? "1");
    if (product.image) {
      existingImage.value = product.image;
      imagePreview.value = imageUrl(product.image);
    }
  }
});

function imageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${apiBase.replace("/api", "")}/storage/${path}`;
}

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
  existingImage.value = "";
}

function removeImage() {
  imageFile.value = null;
  imagePreview.value = "";
  existingImage.value = "";
  if (fileInput.value) fileInput.value.value = "";
}

function validate() {
  errors.name = "";
  errors.slug = "";
  errors.subcategory_id = "";
  errors.brand_id = "";
  errors.price = "";
  let ok = true;

  if (!form.name.trim()) {
    errors.name = "Tên sản phẩm không được để trống";
    ok = false;
  }
  if (!form.slug.trim()) {
    errors.slug = "Slug không được để trống";
    ok = false;
  }
  if (!form.subcategory_id) {
    errors.subcategory_id = "Vui lòng chọn danh mục";
    ok = false;
  }
  if (!form.brand_id) {
    errors.brand_id = "Vui lòng chọn thương hiệu";
    ok = false;
  }
  if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
    errors.price = "Giá sản phẩm không hợp lệ";
    ok = false;
  }

  return ok;
}

async function submitForm() {
  if (!validate()) return;

  const fd = new FormData();
  fd.append("_method", "PUT");
  fd.append("name", form.name.trim());
  fd.append("slug", form.slug.trim());
  fd.append("subcategory_id", form.subcategory_id);
  fd.append("brand_id", form.brand_id);
  fd.append("description", form.description.trim());
  fd.append("price", form.price);
  fd.append("status", form.status);
  if (imageFile.value) fd.append("image", imageFile.value);

  loading.value = true;
  const result = await productStore.updateProduct(productId, fd);
  loading.value = false;

  if (result) {
    router.push("/productadmin");
  }
}
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <nav class="breadcrumb">
        <RouterLink to="/productadmin" class="breadcrumb-link"
          >Quản lý Sản phẩm</RouterLink
        >
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
          ></path>
        </svg>
        <span class="breadcrumb-current">Chỉnh sửa sản phẩm</span>
      </nav>

      <div class="content-header">
        <div class="content-titles">
          <h2>Chỉnh sửa sản phẩm</h2>
          <p>Cập nhật thông tin chi tiết cho sản phẩm</p>
        </div>
        <div class="header-buttons">
          <button
            class="btn-secondary"
            @click="router.push('/productadmin')"
            :disabled="loading"
          >
            Hủy
          </button>
          <button class="btn-primary" @click="submitForm" :disabled="loading">
            {{ loading ? "Đang lưu..." : "Cập nhật sản phẩm" }}
          </button>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-col-left">
          <div class="card">
            <h3 class="card-title">Thông tin chung</h3>

            <div class="form-group">
              <label>Tên sản phẩm *</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-error': errors.name }"
                placeholder="Ví dụ: Giày đá bóng Nike Mercurial Elite"
                v-model="form.name"
                @input="autoSlug"
              />
              <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
            </div>

            <div class="form-group">
              <label>Đường dẫn (Slug) *</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-error': errors.slug }"
                placeholder="giay-da-bong-nike-mercurial-elite"
                v-model="form.slug"
              />
              <p v-if="errors.slug" class="error-text">{{ errors.slug }}</p>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label>Danh mục *</label>
                <div class="select-wrapper">
                  <select
                    class="form-control"
                    :class="{ 'is-error': errors.subcategory_id }"
                    v-model="form.subcategory_id"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    <option
                      v-for="sub in subcategoryStore.subcategories"
                      :key="sub.id"
                      :value="sub.id"
                    >
                      {{ sub.name }}
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
                    ></path>
                  </svg>
                </div>
                <p v-if="errors.subcategory_id" class="error-text">
                  {{ errors.subcategory_id }}
                </p>
              </div>

              <div class="form-group">
                <label>Thương hiệu *</label>
                <div class="select-wrapper">
                  <select
                    class="form-control"
                    :class="{ 'is-error': errors.brand_id }"
                    v-model="form.brand_id"
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    <option
                      v-for="brand in brandStore.brands"
                      :key="brand.id"
                      :value="brand.id"
                    >
                      {{ brand.name }}
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
                    ></path>
                  </svg>
                </div>
                <p v-if="errors.brand_id" class="error-text">
                  {{ errors.brand_id }}
                </p>
              </div>
            </div>

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
                <p v-if="errors.price" class="error-text">{{ errors.price }}</p>
              </div>
            </div>
            <div class="form-group">
              <label>Mô tả sản phẩm</label>
              <textarea
                class="form-control textarea"
                rows="5"
                placeholder="Mô tả chi tiết về chất liệu, công nghệ, ưu điểm..."
                v-model="form.description"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="form-col-right">
          <div class="card">
            <h3 class="card-title">Hình ảnh sản phẩm</h3>

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
                  ></path>
                </svg>
              </div>
              <div class="upload-text">Click để tải lên hoặc<br />kéo thả</div>
              <div class="upload-hint">PNG, JPG (Tối đa 5MB)</div>
            </div>

            <div v-else class="preview-wrapper">
              <div class="preview-container">
                <img :src="imagePreview" alt="Preview" class="preview-image" />
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
              <p class="file-name-text">
                {{ imageFile ? imageFile.name : "Ảnh hiện tại" }}
              </p>
            </div>
          </div>

          <div class="card">
            <h3 class="card-title">Trạng thái</h3>
            <div class="radio-group">
              <label class="radio-label">
                <input
                  type="radio"
                  name="status"
                  value="1"
                  v-model="form.status"
                  class="radio-input"
                />
                <span class="radio-custom"></span>
                Đang kinh doanh
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  name="status"
                  value="0"
                  v-model="form.status"
                  class="radio-input"
                />
                <span class="radio-custom"></span>
                Tạm ngưng
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

/* --- Reset & Global --- */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.admin-layout {
  display: flex;
  height: 100vh;
  font-family: "Inter", sans-serif;
  background-color: #f8f9fa;
  color: #111827;
}

/* --- Sidebar (Tái sử dụng) --- */
.sidebar {
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 12px;
}

.logo-box {
  width: 32px;
  height: 32px;
  background-color: #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  width: 20px;
  height: 20px;
  color: #ffffff;
}

.logo-text {
  display: flex;
  flex-direction: column;
}
.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
  line-height: 1.2;
}
.brand-sub {
  font-size: 12px;
  color: #9ca3af;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  text-decoration: none;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.2s, color 0.2s;
}

.nav-item:hover {
  background-color: #f3f4f6;
}
.nav-item.active {
  background-color: #eff6ff;
  color: #2563eb;
}
.nav-icon {
  width: 20px;
  height: 20px;
}

.sidebar-footer {
  padding: 20px 16px;
  border-top: 1px solid #e5e7eb;
}

/* --- Main Content --- */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* --- Topbar --- */
.topbar {
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  flex-shrink: 0;
}

.page-title-main {
  font-size: 18px;
  font-weight: 700;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.search-container {
  position: relative;
}
.search-input {
  width: 280px;
  padding: 10px 16px 10px 40px;
  background-color: #f3f4f6;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: background-color 0.2s;
}
.search-input:focus {
  background-color: #ffffff;
  box-shadow: 0 0 0 1px #e5e7eb;
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

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #4b5563;
  display: flex;
  align-items: center;
}
.icon-btn:hover {
  color: #111827;
}
.icon-btn svg {
  width: 20px;
  height: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 24px;
  border-left: 1px solid #e5e7eb;
}
.user-details {
  display: flex;
  flex-direction: column;
  text-align: right;
}
.user-name {
  font-size: 14px;
  font-weight: 600;
}
.user-role {
  font-size: 12px;
  color: #9ca3af;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

/* --- Page Content (Thêm sản phẩm) --- */
.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

/* Breadcrumbs */
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

/* Header & Buttons */
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
  background-color: #ffffff;
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
  background-color: #2563eb;
  color: #ffffff;
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

/* --- Layout Grid --- */
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

/* --- Cards --- */
.card {
  background-color: #ffffff;
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

/* --- Form Controls --- */
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

.textarea {
  resize: vertical;
  min-height: 120px;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Select Box */
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

/* Input with Suffix (e.g., VNĐ) */
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

/* --- Upload Zone --- */
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
  margin-bottom: 20px;
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

/* Thumbnails */
.thumbnail-list {
  display: flex;
  gap: 12px;
}
.thumbnail-item {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.thumbnail-item.has-image {
  border: 1px solid #e5e7eb;
}
.thumbnail-item.has-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #f9fafb;
}
.thumbnail-item.placeholder {
  background-color: #f9fafb;
  border: 1px dashed #d1d5db;
  color: #9ca3af;
  cursor: pointer;
  transition: border-color 0.2s;
}
.thumbnail-item.placeholder:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}
.thumbnail-item.placeholder svg {
  width: 20px;
  height: 20px;
}

/* --- Radio Custom --- */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.radio-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}

/* Ẩn input radio gốc */
.radio-input {
  display: none;
}

/* Tạo nút radio giả mạo */
.radio-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  margin-right: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  position: relative;
}

/* Trạng thái được chọn */
.radio-input:checked + .radio-custom {
  border-color: #2563eb;
  background-color: #2563eb;
}

/* Dấu chấm trắng bên trong khi được chọn */
.radio-input:checked + .radio-custom::after {
  content: "";
  width: 6px;
  height: 6px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
}
.is-error {
  border-color: #ef4444 !important;
}
.error-text {
  font-size: 12px;
  color: #ef4444;
  margin-top: 6px;
  font-weight: 500;
}
.hidden-input {
  display: none;
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
.file-name-text {
  font-size: 12px;
  color: #6b7280;
}
</style>