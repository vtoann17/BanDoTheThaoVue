<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import HeaderUser from '../../components/HeaderUser.vue';
import SidebarUser from '../../components/SidebarUser.vue';
import { useUsers } from '@/stores/users'; // Đảm bảo đúng đường dẫn đến file users.js của bạn

const userStore = useUsers();
const activeLink = ref('Thông tin cá nhân');

// Thông tin người dùng hiện tại (để truyền vào Header)
const currentUser = ref({
  name: '',
  avatar: '',
  role: ''
});

// Form chứa dữ liệu để chỉnh sửa
const form = reactive({
  name: '',
  email: '',
  role: '',
  avatarFile: null
});

// Preview ảnh trước khi lưu
const avatarPreview = ref('');

// Lấy ID và thông tin ban đầu từ localStorage
const getAuthData = () => {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : null;
};

// Hàm xử lý hiển thị URL ảnh từ server
const getAvatarUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/150';
  if (path.startsWith('http')) return path;
  // Giả định backend của bạn chạy ở cổng 8000 và ảnh lưu trong storage public
  return `${import.meta.env.VITE_API_BASE.replace('/api', '')}/storage/${path}`;
};

onMounted(async () => {
  const authData = getAuthData();
  if (authData && authData.user) {
    const userData = await userStore.getUserById(authData.user.id); // Gọi API lấy data mới nhất
    if (userData) {
      currentUser.value = userData;
      form.name = userData.name;
      form.email = userData.email;
      form.role = userData.role;
      avatarPreview.value = getAvatarUrl(userData.avatar);
    }
  }
});

// Xử lý khi chọn file ảnh mới
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.avatarFile = file;
    avatarPreview.value = URL.createObjectURL(file); // Hiển thị ảnh tạm thời
  }
};

// Gọi API cập nhật thông tin
const handleSave = async () => {
  const authData = getAuthData();
  if (!authData) return;

  const formData = new FormData();
  formData.append('name', form.name);
  formData.append('email', form.email);
  formData.append('role', form.role);
  if (form.avatarFile) {
    formData.append('avatar', form.avatarFile); //
  }

  const result = await userStore.updateUser(authData.user.id, formData); //
  if (result) {
    // Cập nhật lại giao diện sau khi thành công
    currentUser.value = result;
  }
};
</script>
<template>
  <div class="profile-page">
    <HeaderUser :cart-count="3" :user="currentUser" />

    <main class="main-wrapper">
      <SidebarUser :active-link="activeLink" @navigate="activeLink = $event" />

      <section class="content">
        <div class="card form-card">
          <div class="card-header">
            <h1 class="page-title">Thông tin cá nhân</h1>
            <p class="page-subtitle">Cập nhật thông tin của bạn để quản lý tài khoản tốt hơn.</p>
          </div>

          <div class="card-body">
            <div class="avatar-section">
              <div class="avatar-circle">
                <img :src="avatarPreview" alt="Avatar" class="avatar-img" />
                <label for="file-upload" class="camera-btn">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.828-.414l-.828-1.242A1 1 0 0012.93 3H7.07a1 1 0 00-.828.414L5.414 4.586A1 1 0 014.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>
                  </svg>
                </label>
                <input id="file-upload" type="file" @change="handleFileChange" hidden accept="image/*" />
              </div>
              <div class="avatar-info">
                <label for="file-upload" class="btn-change-avatar" style="cursor: pointer; display: inline-block;">
                  Thay đổi ảnh
                </label>
                <p class="upload-hint">Định dạng JPG, PNG hoặc GIF. Dung lượng tối đa 2MB.</p>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Họ và tên</label>
                <input type="text" class="form-input" v-model="form.name" placeholder="Nhập họ tên" />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-input disabled-input" v-model="form.email" disabled />
              </div>
            </div>

            <div class="form-group margin-top-24">
              <label>Vai trò hệ thống</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" value="user" v-model="form.role" disabled />
                  <span class="radio-mark"></span> Người dùng
                </label>
                <label class="radio-label">
                  <input type="radio" value="staff" v-model="form.role" disabled />
                  <span class="radio-mark"></span> Nhân viên
                </label>
                <label class="radio-label">
                  <input type="radio" value="admin" v-model="form.role" disabled />
                  <span class="radio-mark"></span> Quản trị viên
                </label>
              </div>
              <p class="upload-hint" style="margin-top: 8px;">(Vai trò do hệ thống chỉ định, không thể thay đổi)</p>
            </div>

            <div class="form-actions">
              <button class="btn-save" @click="handleSave">Lưu thay đổi</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.profile-page {
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb;
  color: #111827;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
a { text-decoration: none; }
button { font-family: inherit; }

.main-wrapper {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  gap: 40px;
  width: 100%;
  flex: 1;
}

.content { flex: 1; min-width: 0; }

/* Form Card */
.form-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  margin-bottom: 24px;
}

.card-header {
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
}

.page-title { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
.page-subtitle { font-size: 14px; color: #4b5563; }
.card-body { padding: 32px; }

/* Avatar */
.avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.avatar-circle {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  padding: 4px;
  border: 2px solid #bfdbfe;
}

.avatar-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }

.camera-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #f97316;
  color: #ffffff;
  border: 2px solid #ffffff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.camera-btn svg { width: 14px; height: 14px; }

.btn-change-avatar {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  cursor: pointer;
  margin-bottom: 8px;
  transition: all 0.2s;
  display: block;
}
.btn-change-avatar:hover { background-color: #e5e7eb; }
.upload-hint { font-size: 12px; color: #9ca3af; }

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #111827;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
  color: #111827;
}
.form-input:focus { border-color: #1a73e8; }
.disabled-input { background-color: #f9fafb; color: #4b5563; cursor: not-allowed; }

.input-icon-wrapper { position: relative; }
.icon-calendar {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9ca3af;
  pointer-events: none;
}

.margin-top-24 { margin-top: 24px; }

/* Radio */
.radio-group { display: flex; gap: 32px; }

.radio-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  color: #111827;
  font-weight: 500;
}

.radio-label input[type="radio"] { display: none; }

.radio-mark {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  margin-right: 10px;
  position: relative;
  display: inline-block;
  transition: all 0.2s ease;
}

.radio-label input[type="radio"]:checked + .radio-mark {
border-color: #1a73e8;
  background-color: #1a73e8;
}

.radio-label input[type="radio"]:checked + .radio-mark::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background-color: #ffffff;
  border-radius: 50%;
}

.form-actions {
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
}

.btn-save {
  background-color: #1a73e8;
  color: #ffffff;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-save:hover { background-color: #1557b0; }

/* Security Banner */
.security-banner {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.shield-box {
  width: 36px;
  height: 36px;
  background-color: #dbeafe;
  color: #1a73e8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.shield-box svg { width: 20px; height: 20px; }

.security-text h4 { font-size: 14px; font-weight: 700; color: #1a73e8; margin-bottom: 2px; }
.security-text p { font-size: 13px; color: #4b5563; }

/* Footer */
.footer {
  background-color: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 24px 0;
  margin-top: auto;
}

.footer-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-brand { display: flex; align-items: center; gap: 8px; }

.footer-logo {
  width: 24px; height: 24px; background-color: #9ca3af; color: white;
  border-radius: 4px; display: flex; align-items: center; justify-content: center;
}
.footer-logo svg { width: 14px; height: 14px; }
.footer-name { font-size: 14px; font-weight: 700; color: #9ca3af; }
.footer-copy { font-size: 13px; color: #9ca3af; }

.footer-links { display: flex; gap: 24px; }
.footer-links a { color: #4b5563; font-size: 13px; font-weight: 500; }
.footer-links a:hover { color: #111827; }
</style>
