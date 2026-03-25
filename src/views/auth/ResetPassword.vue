<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useForgotPass } from "@/stores/forgotpassword";

const router = useRouter();
const route = useRoute();
const store = useForgotPass();

const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);

const email = route.query.email || store.email;

const handleSubmit = async () => {
  if (!password.value || password.value.length < 6) {
    alert("Mật khẩu tối thiểu 6 ký tự");
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("Mật khẩu không khớp");
    return;
  }

  loading.value = true;

  await store.resetPassword({
    email,
    password: password.value,
  });

  loading.value = false;

  router.push("/auth/login");
};
</script>

<template>
  <div class="page">
    <main class="main">
      <div class="card">
        <div class="icon">🔐</div>

        <h2>Đặt lại mật khẩu</h2>
        <p>
          Tạo mật khẩu mới cho tài khoản của bạn để đảm bảo an toàn.
        </p>

        <form @submit.prevent="handleSubmit">
          <!-- PASSWORD -->
          <div class="field">
            <label>Mật khẩu mới</label>
            <input
              v-model="password"
              type="password"
              placeholder="Nhập mật khẩu mới"
              required
            />
          </div>

          <!-- CONFIRM -->
          <div class="field">
            <label>Xác nhận mật khẩu</label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>

          <button type="submit" :disabled="loading">
            <span v-if="loading">Đang xử lý...</span>
            <span v-else>Cập nhật mật khẩu</span>
          </button>
        </form>

        <router-link to="/auth/login" class="back">
          ← Quay lại đăng nhập
        </router-link>
      </div>
    </main>

    <!-- FOOTER -->
    <footer class="footer">
      © 2024 SportGear. Bảo lưu mọi quyền.
    </footer>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  background: #f5f7fb;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  padding: 16px 40px;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.logo {
  display: flex;
  gap: 8px;
  align-items: center;
  font-weight: bold;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: #0d6efd;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.btn-login {
  background: #0d6efd;
  color: white;
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
}

/* MAIN */
.main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.icon {
  font-size: 36px;
  margin-bottom: 12px;
}

h2 {
  margin-bottom: 8px;
}

p {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.field {
  text-align: left;
  margin-bottom: 16px;
}

.field label {
  font-size: 14px;
  margin-bottom: 6px;
  display: block;
}

.field input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

button {
  width: 100%;
  padding: 12px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
}

.back {
  display: block;
  margin-top: 16px;
  color: #666;
  font-size: 14px;
}

/* FOOTER */
.footer {
  text-align: center;
  padding: 16px;
  font-size: 13px;
  color: #999;
}
</style>