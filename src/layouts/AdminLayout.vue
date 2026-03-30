<script setup>
import HeaderAdmin from "../components/HeaderAdmin.vue";
import SidebarAdmin from "../components/SidebarAdmin.vue";
</script>
<template>
  <div class="admin-layout">
    <SidebarAdmin />

    <main class="main-content">
      <HeaderAdmin />

      <div class="page-content">
        <slot />
      </div>
    </main>
  </div>
</template>
<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  font-family: "Inter", sans-serif;
  background-color: #f8f9fa;
  color: #111827;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}
</style>