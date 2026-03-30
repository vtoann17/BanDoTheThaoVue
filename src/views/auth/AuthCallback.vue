<script setup>
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import { useAuth } from "@/stores/auth";

const route = useRoute();
const authStore = useAuth();

onMounted(() => {
  const token = route.query.token;

  if (token) {
    authStore.loginGoogle(token);
  }
});
</script>

<template>
  <div class="auth-loading">
    <div class="card">
      <div class="spinner"></div>
      <h2>Đang đăng nhập bằng Google...</h2>
      <p>Vui lòng chờ trong giây lát</p>
    </div>
  </div>
</template>

<style scoped>
.auth-loading {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #F3F4F6;
}

.card {
  background: white;
  padding: 40px 50px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

/* spinner */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #E5E7EB;
  border-top: 4px solid #1565C0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

h2 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
}

p {
  font-size: 13px;
  color: #6B7280;
}
</style>