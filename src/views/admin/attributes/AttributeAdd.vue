<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "../../../layouts/AdminLayout.vue";
import { useAttributes } from "@/stores/attributes";

const router = useRouter();
const attributeStore = useAttributes();

const form = reactive({ name: "" });
const errors = reactive({ name: "" });
const loading = ref(false);

function validate() {
  errors.name = "";
  if (!form.name.trim()) {
    errors.name = "Tên thuộc tính không được để trống";
    return false;
  }
  return true;
}

async function submitForm() {
  if (!validate()) return;
  loading.value = true;
  const result = await attributeStore.createAttribute({ name: form.name.trim() });
  loading.value = false;
  if (result) router.push("/attributeadmin");
}

function resetForm() {
  form.name = "";
  errors.name = "";
}
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <nav class="breadcrumb">
        <RouterLink to="/attributeadmin" class="breadcrumb-link">Quản lý Thuộc tính</RouterLink>
        <svg class="breadcrumb-separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span class="breadcrumb-current">Thêm thuộc tính mới</span>
      </nav>

      <div class="content-header">
        <div class="content-titles">
          <h2>Thêm thuộc tính mới</h2>
          <p>Tạo thuộc tính sản phẩm mới cho hệ thống</p>
        </div>
        <div class="header-buttons">
          <button class="btn-secondary" @click="resetForm" :disabled="loading">Hủy</button>
          <button class="btn-primary" @click="submitForm" :disabled="loading">
            {{ loading ? "Đang lưu..." : "Lưu thuộc tính" }}
          </button>
        </div>
      </div>

      <div class="form-card">
        <h3 class="card-title">Thông tin thuộc tính</h3>
        <div class="form-group">
          <label>Tên thuộc tính *</label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-error': errors.name }"
            placeholder="Ví dụ: Màu sắc, Kích thước, Chất liệu..."
            v-model="form.name"
          />
          <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
          <p v-else class="helper-text">Tên thuộc tính sẽ hiển thị khi tạo biến thể sản phẩm.</p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
* { box-sizing: border-box; margin: 0; padding: 0; }

.page-content { padding: 32px; font-family: "Inter", sans-serif; }

.breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 8px; }
.breadcrumb-link { color: #6b7280; text-decoration: none; font-weight: 500; transition: color 0.2s; }
.breadcrumb-link:hover { color: #111827; }
.breadcrumb-separator { width: 14px; height: 14px; color: #9ca3af; }
.breadcrumb-current { color: #111827; font-weight: 600; }

.content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.content-titles h2 { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
.content-titles p { font-size: 14px; color: #6b7280; }

.header-buttons { display: flex; gap: 12px; }
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
.btn-secondary:hover:not(:disabled) { background-color: #f9fafb; border-color: #9ca3af; }
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
.btn-primary:hover:not(:disabled) { background-color: #1d4ed8; }
.btn-primary:disabled, .btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }

.form-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 32px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  max-width: 600px;
}
.card-title { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 24px; }

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 13px; font-weight: 600; color: #374151; }
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
.form-control::placeholder { color: #9ca3af; }
.form-control:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
.is-error { border-color: #ef4444 !important; }
.error-text { font-size: 12px; color: #ef4444; font-weight: 500; }
.helper-text { font-size: 12px; color: #9ca3af; }
</style>