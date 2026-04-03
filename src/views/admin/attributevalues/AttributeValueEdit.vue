<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AdminLayout from "../../../layouts/AdminLayout.vue";
import { useAttributeValues } from "@/stores/attributeValues";
import { useAttributes } from "@/stores/attributes";

const router = useRouter();
const route = useRoute();
const attributeValueStore = useAttributeValues();
const attributeStore = useAttributes();
const id = route.params.id;

const form = reactive({ attribute_id: "", value: "" });
const errors = reactive({ attribute_id: "", value: "" });
const loading = ref(false);

onMounted(async () => {
  await attributeStore.loadAttributes({ per_page: 50 });
  const item = await attributeValueStore.getAttributeValue(id);
  if (item) {
    form.attribute_id = Number(item.attribute_id);
    form.value = item.value ?? "";
  }
});

function validate() {
  errors.attribute_id = "";
  errors.value = "";
  let ok = true;
  if (!form.attribute_id) {
    errors.attribute_id = "Vui lòng chọn thuộc tính";
    ok = false;
  }
  if (!form.value.trim()) {
    errors.value = "Giá trị không được để trống";
    ok = false;
  }
  return ok;
}

async function submitForm() {
  if (!validate()) return;
  loading.value = true;
  const result = await attributeValueStore.updateAttributeValue(id, {
    attribute_id: form.attribute_id,
    value: form.value.trim(),
  });
  loading.value = false;
  if (result) router.push("/attributevalue");
}
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <nav class="breadcrumb">
        <RouterLink to="/attributevalue" class="breadcrumb-link"
          >Giá trị thuộc tính</RouterLink
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
          />
        </svg>
        <span class="breadcrumb-current">Chỉnh sửa giá trị</span>
      </nav>

      <div class="content-header">
        <div class="content-titles">
          <h2>Chỉnh sửa giá trị thuộc tính</h2>
          <p>Cập nhật giá trị thuộc tính sản phẩm</p>
        </div>
        <div class="header-buttons">
          <button
            class="btn-secondary"
            @click="router.push('/attributevalueadmin')"
            :disabled="loading"
          >
            Hủy
          </button>
          <button class="btn-primary" @click="submitForm" :disabled="loading">
            {{ loading ? "Đang lưu..." : "Cập nhật" }}
          </button>
        </div>
      </div>

      <div class="form-card">
        <h3 class="card-title">Thông tin giá trị thuộc tính</h3>

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

        <div class="form-group" style="margin-top: 20px">
          <label>Giá trị *</label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-error': errors.value }"
            placeholder="Ví dụ: Đỏ, XL, Cotton..."
            v-model="form.value"
          />
          <p v-if="errors.value" class="error-text">{{ errors.value }}</p>
          <p v-else class="helper-text">
            Nhập giá trị tương ứng với thuộc tính đã chọn.
          </p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
<style scoped>
/* Giữ nguyên style từ AttributeAdd.vue, thêm: */
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
.btn-secondary:hover:not(:disabled) {
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
.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}
.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 32px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  max-width: 600px;
}
.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
}

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
.helper-text {
  font-size: 12px;
  color: #9ca3af;
}
</style>