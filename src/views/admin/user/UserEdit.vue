<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useUsers } from '@/stores/users';
import { useNotify } from '@/composables/useNotify';

const router = useRouter();
const route = useRoute();
const notify = useNotify();
const userStore = useUsers();

const userId = route.params.id;

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'user',
});

const errors = reactive({
  name: '',
  email: '',
  password: '',
  role: '',
});

const loading = ref(false);
const fetching = ref(true); 
const fileInput = ref(null);
const imageFile = ref(null);
const imagePreview = ref('');
const showPassword = ref(false);

onMounted(async () => {
  fetching.value = true;
  const userData = await userStore.getUserById(userId);
  if (userData) {
    form.name = userData.name;
    form.email = userData.email;
    form.role = userData.role;
    if (userData.avatar) {
      imagePreview.value = getAvatarUrl(userData.avatar);
    }
  } else {
    notify.toastError("Không tìm thấy người dùng");
    router.push('/useradmin');
  }
  fetching.value = false;
});

function getAvatarUrl(path) {
  if (path.startsWith('http')) return path;
  const apiBase = import.meta.env.VITE_API_BASE.split('/api')[0];
  return `${apiBase}/storage/${path.replace(/^public\//, "")}`;
}

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) setImage(file);
}

function onDrop(e) {
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) setImage(file);
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
  imagePreview.value = '';
  if (fileInput.value) fileInput.value.value = '';
}

function validate() {
  errors.name = '';
  errors.email = '';
  errors.password = '';
  errors.role = '';
  let ok = true;

  if (!form.name.trim()) {
    errors.name = 'Tên người dùng không được để trống';
    ok = false;
  }
  if (!form.email.trim()) {
    errors.email = 'Email không được để trống';
    ok = false;
  }
  if (form.password && form.password.length < 6) {
    errors.password = 'Mật khẩu mới phải ít nhất 6 ký tự';
    ok = false;
  }
  if (!form.role) {
    errors.role = 'Vui lòng chọn vai trò';
    ok = false;
  }
  return ok;
}

async function submitForm() {
  if (!validate()) return;

  const fd = new FormData();
  fd.append('name', form.name.trim());
  fd.append('email', form.email.trim());
  fd.append('role', form.role);
  if (form.password) {
    fd.append('password', form.password);
  }

  if (imageFile.value) {
    fd.append('avatar', imageFile.value);
  }

  loading.value = true;
  const result = await userStore.updateUser(userId, fd);
  loading.value = false;

  if (result) {
    router.push('/useradmin');
  }
}
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <nav class="breadcrumb">
        <RouterLink to="/" class="breadcrumb-link">Trang chủ</RouterLink>
        <svg class="breadcrumb-separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <RouterLink to="/useradmin" class="breadcrumb-link">Người dùng</RouterLink>
        <svg class="breadcrumb-separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span class="breadcrumb-current">Chỉnh sửa người dùng</span>
      </nav>

      <div class="content-header">
        <div class="content-titles">
          <h2>Chỉnh sửa người dùng</h2>
          <p>Cập nhật thông tin tài khoản ID: #{{ userId }}</p>
        </div>
      </div>

      <div v-if="fetching" class="loading-state">
        <div class="spinner-large"></div>
        <p>Đang tải dữ liệu người dùng...</p>
      </div>

      <div v-else class="form-card">
        <div class="form-grid">

          <div class="form-group col-span-2">
            <label>Ảnh đại diện</label>
            <div class="upload-zone" :class="{ 'has-preview': imagePreview }" @click="$refs.fileInput.click()"
              @dragover.prevent @drop.prevent="onDrop">
              <input ref="fileInput" type="file" accept="image/jpg,image/jpeg,image/png,image/gif"
                class="file-input-hidden" @change="onFileChange" />

              <template v-if="!imagePreview">
                <div class="upload-placeholder">
                  <div class="upload-avatar-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p class="upload-text">Kéo &amp; thả ảnh vào đây, hoặc <span class="upload-link">chọn file</span></p>
                </div>
              </template>

              <template v-else>
                <img :src="imagePreview" class="image-preview" alt="Avatar Preview" />
                <button class="remove-img-btn" @click.stop="removeImage" title="Xóa ảnh">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </template>
            </div>
          </div>

          <div class="form-group">
            <label>Tên người dùng <span class="required">*</span></label>
            <input type="text" class="form-control" :class="{ 'is-error': errors.name }" placeholder="Nhập họ và tên"
              v-model="form.name" />
            <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
          </div>

          <div class="form-group">
            <label>Email <span class="required">*</span></label>
            <input type="email" class="form-control" :class="{ 'is-error': errors.email }"
              placeholder="example@sportgear.com" v-model="form.email" />
            <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
          </div>

          <div class="form-group">
            <label>Mật khẩu mới (Để trống nếu không đổi)</label>
            <div class="input-with-icon">
              <input :type="showPassword ? 'text' : 'password'" class="form-control"
                :class="{ 'is-error': errors.password }" placeholder="Nhập mật khẩu mới nếu muốn thay đổi"
                v-model="form.password" />
              <button class="btn-eye" @click.prevent="showPassword = !showPassword" tabindex="-1">
                <svg v-if="!showPassword" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
          </div>

          <div class="form-group">
            <label>Vai trò <span class="required">*</span></label>
            <div class="select-wrapper">
              <select class="form-control form-select" :class="{ 'is-error': errors.role }" v-model="form.role">
                <option value="user">Khách hàng</option>
                <option value="staff">Nhân viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
              <svg class="select-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <p v-if="errors.role" class="error-text">{{ errors.role }}</p>
          </div>

        </div>

        <div class="form-actions">
          <button class="btn-secondary" @click="router.push('/useradmin')" :disabled="loading">Quay lại</button>
          <button class="btn-primary" @click="submitForm" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? 'Đang cập nhật...' : 'Cập nhật người dùng' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
/* Giữ nguyên toàn bộ CSS của trang Add */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Thêm một số style cho trạng thái Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: #6b7280;
}

.spinner-large {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

/* Các CSS cũ bạn copy lại toàn bộ từ trang Add vào đây */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page-content {
  padding: 32px;
  max-width: 1200px;
  font-family: 'Inter', sans-serif;
}

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

.content-header {
  margin-bottom: 24px;
}

.content-titles h2 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
}

.content-titles p {
  font-size: 14px;
  color: #6b7280;
}

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

.required {
  color: #ef4444;
  margin-left: 2px;
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

.btn-eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
}

.btn-eye svg {
  width: 18px;
  height: 18px;
}

.select-wrapper {
  position: relative;
}

.form-select {
  appearance: none;
  padding-right: 40px;
  cursor: pointer;
}

.select-arrow {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9ca3af;
  pointer-events: none;
}

.error-text {
  font-size: 12px;
  color: #ef4444;
  margin-top: 6px;
  font-weight: 500;
}

.upload-zone {
  position: relative;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: #f9fafb;
  min-height: 140px;
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
  min-height: 180px;
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

.upload-avatar-icon {
  width: 56px;
  height: 56px;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.upload-avatar-icon svg {
  width: 28px;
  height: 28px;
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

.image-preview {
  width: 100%;
  height: 180px;
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
  font-family: inherit;
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
  font-family: inherit;
}

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

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .col-span-2 {
    grid-column: span 1;
  }

  .page-content {
    padding: 20px;
  }
}
</style>