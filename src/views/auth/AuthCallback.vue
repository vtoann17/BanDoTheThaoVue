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
  <div>Đang đăng nhập bằng Google...</div>
</template>