<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AdminLayout from "../../../layouts/AdminLayout.vue";
import { useVariants } from "../../../stores/variants";
import { useProducts } from "../../../stores/products";
import { useAttributeValues } from "../../../stores/attributevalues";
import { useAttributes } from "@/stores/attributes";
import { useNotify } from "@/composables/useNotify"; // Thêm import Notify

const router = useRouter();
const route = useRoute();
const variantStore = useVariants();
const productStore = useProducts();
const attributeValueStore = useAttributeValues();
const attributeStore = useAttributes();
const notify = useNotify(); // Khởi tạo Notify

const form = reactive({
  product_id: route.params.id || "",
  sku: "",
  stock: "",
  price: "",
  sale: "0",
  start: "",
  end: "",
  selected_attributes: [{ attribute_id: "", value_ids: [], error: "" }],
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
    attributeStore.loadAttributes({ per_page: 999 }),
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

function addAttrRow() {
  form.selected_attributes.push({ attribute_id: "", value_ids: [], error: "" });
}

function removeAttrRow(index) {
  if (form.selected_attributes.length > 1) {
    form.selected_attributes.splice(index, 1);
  }
}

function getValuesForAttribute(attrId) {
  if (!attrId) return [];
  return attributeValueStore.attributeValues.filter(
    (v) => v.attribute_id === Number(attrId)
  );
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

  const selectedAttrIds = [];
  form.selected_attributes.forEach((row) => {
    row.error = "";
    if (!row.attribute_id || row.value_ids.length === 0) {
      row.error = "Vui lòng chọn thuộc tính và ít nhất MỘT giá trị";
      ok = false;
    } else {
      if (selectedAttrIds.includes(row.attribute_id)) {
        row.error = "Thuộc tính này bị trùng, vui lòng gộp lại chung 1 dòng";
        ok = false;
      }
      selectedAttrIds.push(row.attribute_id);
    }
  });

  if (form.selected_attributes.length === 0) {
    errors.attribute_values = "Vui lòng chọn ít nhất một giá trị thuộc tính";
    ok = false;
  }

  return ok;
}

async function submitForm() {
  if (!validate()) return;
  loading.value = true;

  const valueArrays = form.selected_attributes.map(row => row.value_ids);
  const combinations = valueArrays.reduce((a, b) => a.flatMap(d => b.map(e => [...d, e])), [[]]);

  let successCount = 0;

  for (let i = 0; i < combinations.length; i++) {
    const combo = combinations[i];
    const fd = new FormData();
    
    fd.append("product_id", form.product_id);
    const finalSku = combinations.length > 1 ? `${form.sku.trim()}-${i + 1}` : form.sku.trim();
    fd.append("sku", finalSku);
    
    fd.append("stock", form.stock);
    fd.append("price", form.price);
    fd.append("sale", form.sale || 0);
    if (form.start) fd.append("start", form.start);
    if (form.end) fd.append("end", form.end);
    
    combo.forEach(valId => {
      fd.append("attribute_values[]", valId);
    });

    if (imageFile.value) fd.append("img", imageFile.value);

    // TRUYỀN THÊM { silent: true } ĐỂ TẮT THÔNG BÁO TỪNG CÁI
    const result = await variantStore.createVariant(fd, { silent: true });
    if (result) successCount++;
  }

  loading.value = false;

  if (successCount > 0) {
    // HIỂN THỊ 1 THÔNG BÁO TỔNG DUY NHẤT Ở ĐÂY
    notify.toastSuccess(`Đã tạo thành công ${successCount} tổ hợp biến thể!`);
    router.push(route.params.id ? `/variantadmin/${route.params.id}` : "/variantadmin");
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
  form.selected_attributes = [{ attribute_id: "", value_ids: [], error: "" }];
  
  errors.product_id = "";
  errors.sku = "";
  errors.stock = "";
  errors.price = "";
  errors.attribute_values = "";
  removeImage();
}
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <nav class="breadcrumb">
        <RouterLink
          :to="route.params.id ? `/variantadmin/${route.params.id}` : '/variantadmin'"
          class="breadcrumb-link"
        >
          Quản lý Biến thể
        </RouterLink>
        <svg class="breadcrumb-separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span class="breadcrumb-current">Thêm biến thể mới</span>
      </nav>

      <div class="content-header">
        <div class="content-titles">
          <h2>Tạo nhanh biến thể</h2>
          <p>Tự động sinh ra tổ hợp biến thể bằng cách chọn nhiều giá trị cùng lúc</p>
        </div>
        <div class="header-buttons">
          <button class="btn-secondary" @click="resetForm" :disabled="loading">
            Hủy
          </button>
          <button class="btn-primary" @click="submitForm" :disabled="loading">
            {{ loading ? "Đang xử lý..." : "Lưu biến thể" }}
          </button>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-col-left">
          <div class="card">
            <h3 class="card-title">Thông tin cơ bản (Dùng chung cho tất cả)</h3>

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
                  <option v-for="p in productStore.products" :key="p.id" :value="p.id">
                    {{ p.name }}
                  </option>
                </select>
                <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p v-if="errors.product_id" class="error-text">{{ errors.product_id }}</p>
            </div>

            <div class="form-group">
              <label>SKU Gốc *</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-error': errors.sku }"
                placeholder="Ví dụ: NIKE-AIR (Hệ thống sẽ tự thêm -1, -2 nếu chọn nhiều)"
                v-model="form.sku"
              />
              <p v-if="errors.sku" class="error-text">{{ errors.sku }}</p>
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

              <div class="form-group">
                <label>Tồn kho (Cho mỗi loại) *</label>
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

            <div class="form-row-2">
              <div class="form-group">
                <label>Giảm giá (%)</label>
                <div class="input-with-suffix">
                  <input type="number" class="form-control" placeholder="0" v-model="form.sale" min="0" max="100" />
                  <span class="suffix">%</span>
                </div>
              </div>
              <div class="form-group"></div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label>Ngày bắt đầu</label>
                <input type="datetime-local" class="form-control" v-model="form.start" />
              </div>
              <div class="form-group">
                <label>Ngày kết thúc</label>
                <input type="datetime-local" class="form-control" v-model="form.end" />
              </div>
            </div>
          </div>

          <div class="card">
            <h3 class="card-title">Thiết lập Tổ hợp Thuộc tính *</h3>
            <p v-if="errors.attribute_values" class="error-text" style="margin-bottom: 12px">
              {{ errors.attribute_values }}
            </p>

            <div class="value-list">
              <div v-for="(row, index) in form.selected_attributes" :key="index" class="value-row">
                <div class="row-index">{{ index + 1 }}</div>
                
                <div class="row-input-wrap" style="flex-direction: row; gap: 10px; flex-wrap: wrap;">
                  <div class="select-wrapper" style="flex: 1; min-width: 140px; max-width: 200px;">
                    <select 
                      class="form-control" 
                      :class="{ 'is-error': row.error }" 
                      v-model="row.attribute_id" 
                      @change="row.value_ids = []" 
                    >
                      <option value="">-- Thuộc tính --</option>
                      <option v-for="attr in attributeStore.attributes" :key="attr.id" :value="attr.id">
                        {{ attr.name }}
                      </option>
                    </select>
                    <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <div class="checkbox-container" style="flex: 2; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px 12px; min-height: 42px;">
                    <div v-if="!row.attribute_id" style="color: #9ca3af; font-size: 13px; line-height: 24px;">
                      Vui lòng chọn thuộc tính trước...
                    </div>
                    <div v-else class="checkbox-group">
                      <label v-for="val in getValuesForAttribute(row.attribute_id)" :key="val.id" class="checkbox-label">
                        <input type="checkbox" :value="val.id" v-model="row.value_ids" />
                        {{ val.value }}
                      </label>
                    </div>
                  </div>
                  
                  <p v-if="row.error" class="error-text" style="width: 100%; margin-top: -4px;">{{ row.error }}</p>
                </div>

                <button 
                  class="btn-remove" 
                  type="button" 
                  @click="removeAttrRow(index)" 
                  :disabled="form.selected_attributes.length === 1" 
                  title="Xóa dòng này"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <button type="button" class="btn-add-row" @click="addAttrRow" :disabled="loading">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Trộn thêm thuộc tính khác (VD: Size)
            </button>
          </div>
        </div>

        <div class="form-col-right">
          <div class="card">
            <h3 class="card-title">Hình ảnh (Dùng chung)</h3>

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
                <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div class="upload-text">Click để tải lên hoặc<br />kéo thả</div>
              <div class="upload-hint">PNG, JPG (Tối đa 5MB)</div>
            </div>

            <div v-else class="preview-wrapper">
              <div class="preview-container">
                <img :src="imagePreview" alt="Preview" class="preview-image" />
                <button type="button" class="remove-btn" @click="removeImage" title="Xóa ảnh">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
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
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

/* UI CHECKBOX */
.checkbox-container {
  background: #fff;
}
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  cursor: pointer;
  color: #374151;
  user-select: none;
}
.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #2563eb;
}

.value-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}
.value-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.row-index {
  width: 32px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #9ca3af;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  flex-shrink: 0;
}
.row-input-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.btn-remove {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-remove:hover:not(:disabled) {
  background: #fef2f2;
  border-color: #fca5a5;
  color: #ef4444;
}
.btn-remove:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.btn-add-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0f9ff;
  color: #0284c7;
  border: 1px dashed #7dd3fc;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
}
.btn-add-row:hover:not(:disabled) {
  background: #e0f2fe;
  border-color: #38bdf8;
}
.btn-add-row:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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