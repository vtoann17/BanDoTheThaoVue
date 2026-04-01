<script setup>
import HeaderUser from "../components/HeaderUser.vue";
import SidebarUser from "../components/SidebarUser.vue";
</script>
<template>
  <div class="admin-layout">
    <SidebarUser />

    <main class="main-content">
      <HeaderAdmin />

      <div class="profile-page">
        <slot />
      </div>
    </main>
  </div>
</template>