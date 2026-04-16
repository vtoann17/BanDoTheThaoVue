<!-- AttributeValueAdd.vue -->
<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "../../../layouts/AdminLayout.vue";
import { useAttributeValues } from "@/stores/attributevalues";
import { useAttributes } from "@/stores/attributes";

const router = useRouter();
const attributeValueStore = useAttributeValues();
const attributeStore = useAttributes();

const form = reactive({
  attribute_id: "",
  values: [{ value: "", error: "" }],
});
const errors = reactive({ attribute_id: "" });
const loading = ref(false);

onMounted(async () => {
  await attributeStore.loadAttributes({ per_page: 50 });
});

function addValueRow() {
  form.values.push({ value: "", error: "" });
}

function removeValueRow(index) {
  if (form.values.length > 1) {
    form.values.splice(index, 1);
  }
}

function validate() {
  errors.attribute_id = "";
  let ok = true;

  if (!form.attribute_id) {
    errors.attribute_id = "Vui lòng chọn thuộc tính";
    ok = false;
  }

  form.values.forEach((row) => {
    row.error = "";
    if (!row.value.trim()) {
      row.error = "Giá trị không được để trống";
      ok = false;
    }
  });

  return ok;
}

async function submitForm() {
  if (!validate()) return;
  loading.value = true;
  const uniqueValues = [...new Set(form.values.map((r) => r.value.trim()))];
  const success = await attributeValueStore.createAttributeValue({
    attribute_id: form.attribute_id,
    values: uniqueValues,
  });

  loading.value = false;
  if (success) router.push("/attributevalue");
}

function resetForm() {
  form.attribute_id = "";
  form.values = [{ value: "", error: "" }];
  errors.attribute_id = "";
}
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <nav class="breadcrumb">
        <RouterLink to="/attributevalue" class="breadcrumb-link">
          Giá trị thuộc tính
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
        <span class="breadcrumb-current">Thêm giá trị mới</span>
      </nav>

      <div class="content-header">
        <div class="content-titles">
          <h2>Thêm giá trị thuộc tính</h2>
          <p>Tạo một hoặc nhiều giá trị mới cho thuộc tính sản phẩm</p>
        </div>
        <div class="header-buttons">
          <button class="btn-secondary" @click="resetForm" :disabled="loading">
            Hủy
          </button>
          <button class="btn-primary" @click="submitForm" :disabled="loading">
            <svg
              v-if="!loading"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {{ loading ? "Đang lưu..." : `Lưu ${form.values.length} giá trị` }}
          </button>
        </div>
      </div>

      <div class="form-card">
        <h3 class="card-title">Thông tin giá trị thuộc tính</h3>

        <!-- Attribute selector -->
        <div class="form-group">
          <label>Thuộc tính *</label>
          <div class="select-wrapper">
            <select
              class="form-control"
              :class="{ 'is-error': errors.attribute_id }"
              v-model="form.attribute_id"
            >
              <option value="">-- Chọn thuộc tính --</option>
              <option
                v-for="attr in attributeStore.attributes"
                :key="attr.id"
                :value="attr.id"
              >
                {{ attr.name }}
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
          <p v-if="errors.attribute_id" class="error-text">
            {{ errors.attribute_id }}
          </p>
        </div>

        <!-- Multiple value rows -->
        <div class="values-section">
          <div class="values-header">
            <label>Giá trị *</label>
            <span class="value-count">{{ form.values.length }} giá trị</span>
          </div>

          <div class="value-list">
            <div
              v-for="(row, index) in form.values"
              :key="index"
              class="value-row"
            >
              <div class="row-index">{{ index + 1 }}</div>
              <div class="row-input-wrap">
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-error': row.error }"
                  :placeholder="`Ví dụ: Đỏ, XL, Cotton...`"
                  v-model="row.value"
                />
                <p v-if="row.error" class="error-text">{{ row.error }}</p>
              </div>
              <button
                class="btn-remove"
                @click="removeValueRow(index)"
                :disabled="form.values.length === 1 || loading"
                title="Xóa dòng này"
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
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <button class="btn-add-row" @click="addValueRow" :disabled="loading">
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
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm giá trị
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
  font-family: "Inter", sans-serif;
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
.header-buttons {
  display: flex;
  gap: 12px;
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
  gap: 6px;
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

/* Card */
.form-card {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  max-width: 680px;
}
.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
}

/* Form group */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.select-wrapper {
  position: relative;
}
.select-wrapper select {
  appearance: none;
  cursor: pointer;
}
.dropdown-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #6b7280;
  pointer-events: none;
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
.is-error {
  border-color: #ef4444 !important;
}
.error-text {
  font-size: 12px;
  color: #ef4444;
  font-weight: 500;
}

/* Values section */
.values-section {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.values-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.values-header label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}
.value-count {
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  padding: 2px 10px;
  border-radius: 20px;
}

.value-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.value-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.row-index {
  width: 28px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  flex-shrink: 0;
}

.row-input-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.btn-remove {
  width: 36px;
  height: 38px;
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
  padding: 9px 16px;
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
</style>