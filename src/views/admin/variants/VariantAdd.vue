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

const form = reactive({
  product_id: route.params.id || "",
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
const fileInput = ref(null);
const imageFile = ref(null);
const imagePreview = ref("");

onMounted(async () => {
  await Promise.all([
    productStore.loadProducts({ per_page: 999 }),
    attributeValueStore.loadAttributeValues({ per_page: 999 }),
  ]);
});

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

  const fd = new FormData();
  fd.append("product_id", form.product_id);
  fd.append("sku", form.sku.trim());
  fd.append("stock", form.stock);
  fd.append("price", form.price);
  fd.append("sale", form.sale || 0);
  if (form.start) fd.append("start", form.start);
  if (form.end) fd.append("end", form.end);
  form.attribute_values.forEach((id) => fd.append("attribute_values[]", id));
  if (imageFile.value) fd.append("img", imageFile.value);

  loading.value = true;
  const result = await variantStore.createVariant(fd);
  loading.value = false;

  if (result) {
    router.push(
      route.params.id ? `/variantadmin/${route.params.id}` : "/variantadmin"
    );
  }
}

function resetForm() {
  form.product_id = route.params.id || "";
  form.sku = "";
  form.stock = "";
  form.price = "";
  form.sale = "0";
  form.start = "";
  form.end = "";
  form.attribute_values = [];
  errors.product_id = "";
  errors.sku = "";
  errors.stock = "";
  errors.price = "";
  errors.attribute_values = "";
  removeImage();
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
      <nav class="breadcrumb">
        <RouterLink
          :to="
            route.params.id
              ? `/variantadmin/${route.params.id}`
              : '/variantadmin'
          "
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
        <span class="breadcrumb-current">Thêm biến thể mới</span>
      </nav>

      <div class="content-header">
        <div class="content-titles">
          <h2>Thêm biến thể mới</h2>
          <p>Vui lòng nhập đầy đủ thông tin cho biến thể sản phẩm</p>
        </div>
        <div class="header-buttons">
          <button class="btn-secondary" @click="resetForm" :disabled="loading">
            Hủy
          </button>
          <button class="btn-primary" @click="submitForm" :disabled="loading">
            {{ loading ? "Đang lưu..." : "Lưu biến thể" }}
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
                  :disabled="!!route.params.id"
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
                <p v-if="errors.price" class="error-text">{{ errors.price }}</p>
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
                <p v-if="errors.stock" class="error-text">{{ errors.stock }}</p>
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
                  :class="{ selected: form.attribute_values.includes(val.id) }"
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
              <p class="file-name-text">{{ imageFile?.name }}</p>
            </div>
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

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

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
.file-name-text {
  font-size: 12px;
  color: #6b7280;
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
</style>