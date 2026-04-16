<script setup>
import { ref, reactive, onMounted } from "vue";
import HeaderUser from "../../components/HeaderUser.vue";
import SidebarUser from "../../components/SidebarUser.vue";
import { useUsers } from "@/stores/users";

const userStore = useUsers();
const activeLink = ref("Thông tin cá nhân");
const isLoading = ref(true);

const currentUser = ref({
  name: "",
  avatar: "",
  role: "",
});

const form = reactive({
  name: "",
  email: "",
  role: "",
  avatarFile: null,
});

const avatarPreview = ref("");

const getAuthData = () => {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : null;
};

const getAvatarUrl = (path) => {
  if (!path) return "https://via.placeholder.com/150";
  // Nếu đã là URL đầy đủ (Google, http...) thì dùng luôn
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Nếu là path local thì ghép với storage
  return `${import.meta.env.VITE_API_BASE.replace("/api", "")}/storage/${path}`;
};

const roleLabel = (role) => {
  if (role === "admin") return "Quản trị viên";
  return "Người dùng";
};

onMounted(async () => {
  const authData = getAuthData();
  if (authData && authData.user) {
    try {
      const userData = await userStore.getUserById(authData.user.id);
      if (userData) {
        currentUser.value = userData;
        form.name = userData.name || "";
        form.email = userData.email || "";
        form.role = userData.role || "user";
        avatarPreview.value = getAvatarUrl(userData.avatar);
      }
    } catch (e) {
      console.error("Lỗi load thông tin người dùng:", e);
    }
  }
  isLoading.value = false;
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.avatarFile = file;
    avatarPreview.value = URL.createObjectURL(file);
  }
};

const handleSave = async () => {
  const authData = getAuthData();
  if (!authData) return;

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("email", form.email);
  formData.append("role", form.role);
  if (form.avatarFile) {
    formData.append("avatar", form.avatarFile);
  }

  const result = await userStore.updateUser(authData.user.id, formData);
  if (result) {
    currentUser.value = result;
    form.name = result.name;
    form.email = result.email;
    form.role = result.role;
    avatarPreview.value = getAvatarUrl(result.avatar);
  }
};
</script>

<template>
  <div class="profile-page">
    <HeaderUser :cart-count="3" :user="currentUser" />

    <main class="main-wrapper">
      <SidebarUser :active-link="activeLink" @navigate="activeLink = $event" />

      <section class="content">
        <!-- Loading skeleton -->
        <div v-if="isLoading" class="card form-card">
          <div class="card-header">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-sub"></div>
          </div>
          <div class="card-body">
            <div class="avatar-section">
              <div class="skeleton skeleton-avatar"></div>
              <div>
                <div class="skeleton skeleton-btn"></div>
                <div class="skeleton skeleton-hint"></div>
              </div>
            </div>
            <div class="form-grid">
              <div class="skeleton skeleton-input"></div>
              <div class="skeleton skeleton-input"></div>
            </div>
          </div>
        </div>

        <!-- Nội dung thực -->
        <div v-else class="card form-card">
          <div class="card-header">
            <h1 class="page-title">Thông tin cá nhân</h1>
            <p class="page-subtitle">
              Cập nhật thông tin của bạn để quản lý tài khoản tốt hơn.
            </p>
          </div>

          <div class="card-body">
            <!-- Avatar -->
            <div class="avatar-section">
              <div class="avatar-circle">
                <img :src="avatarPreview" alt="Avatar" class="avatar-img" />
                <label for="file-upload" class="camera-btn">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.828-.414l-.828-1.242A1 1 0 0012.93 3H7.07a1 1 0 00-.828.414L5.414 4.586A1 1 0 014.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  @change="handleFileChange"
                  hidden
                  accept="image/*"
                />
              </div>
              <div class="avatar-info">
                <label for="file-upload" class="btn-change-avatar">
                  Thay đổi ảnh
                </label>
                <p class="upload-hint">
                  Định dạng JPG, PNG hoặc GIF. Dung lượng tối đa 2MB.
                </p>
              </div>
            </div>

            <!-- Họ tên + Email -->
            <div class="form-grid">
              <div class="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="form.name"
                  placeholder="Nhập họ tên"
                />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input
                  type="email"
                  class="form-input disabled-input"
                  v-model="form.email"
                  disabled
                />
              </div>
            </div>
            <!-- Badge vai trò hiển thị rõ -->
            <div class="role-badge-row">
              <span
                class="role-badge"
                :class="form.role === 'admin' ? 'badge-admin' : 'badge-user'"
              >
                <svg
                  v-if="form.role === 'admin'"
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ roleLabel(form.role) }}
              </span>
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
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.profile-page {
  font-family: "Inter", sans-serif;
  background-color: #f9fafb;
  color: #111827;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
a {
  text-decoration: none;
}
button {
  font-family: inherit;
}

.main-wrapper {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  gap: 40px;
  width: 100%;
  flex: 1;
}

.content {
  flex: 1;
  min-width: 0;
}

/* Skeleton */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 8px;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
.skeleton-title {
  height: 24px;
  width: 200px;
  margin-bottom: 10px;
}
.skeleton-sub {
  height: 14px;
  width: 320px;
}
.skeleton-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  flex-shrink: 0;
}
.skeleton-btn {
  height: 34px;
  width: 120px;
  margin-bottom: 8px;
}
.skeleton-hint {
  height: 12px;
  width: 200px;
}
.skeleton-input {
  height: 46px;
}

/* Form Card */
.form-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  margin-bottom: 24px;
}

.card-header {
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}
.page-subtitle {
  font-size: 14px;
  color: #4b5563;
}
.card-body {
  padding: 32px;
}

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
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

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
.camera-btn svg {
  width: 14px;
  height: 14px;
}

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
  display: inline-block;
}
.btn-change-avatar:hover {
  background-color: #e5e7eb;
}
.upload-hint {
  font-size: 12px;
  color: #9ca3af;
}

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
.form-input:focus {
  border-color: #1a73e8;
}
.disabled-input {
  background-color: #f9fafb;
  color: #4b5563;
  cursor: not-allowed;
}

.margin-top-24 {
  margin-top: 24px;
}

/* Radio */
.radio-group {
  display: flex;
  gap: 32px;
}

.radio-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: not-allowed;
  color: #111827;
  font-weight: 500;
}

.radio-label input[type="radio"] {
  display: none;
}

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
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background-color: #ffffff;
  border-radius: 50%;
}

/* Role badge */
.role-badge-row {
  margin-top: 16px;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.badge-user {
  background-color: #eff6ff;
  color: #1a73e8;
  border: 1px solid #bfdbfe;
}

.badge-admin {
  background-color: #fef3c7;
  color: #d97706;
  border: 1px solid #fde68a;
}

/* Actions */
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
.btn-save:hover {
  background-color: #1557b0;
}
</style>