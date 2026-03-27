<script setup>
import { onMounted } from "vue";
import { useAuth } from "@/stores/auth";
import { useRouter } from "vue-router";
const router = useRouter();

const authStore = useAuth();

onMounted(async () => {
  await authStore.logout();
  router.push("/auth/login");
});
</script>

<template>
  <div class="logout-page">
    <h2>Đang đăng xuất...</h2>
    <p>Vui lòng chờ trong giây lát</p>
  </div>
</template>

<style scoped>
.logout-page {
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #374151;
}
</style>