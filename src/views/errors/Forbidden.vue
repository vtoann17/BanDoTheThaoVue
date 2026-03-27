<template>
  <div class="forbidden">
    <h1>403</h1>
    <p>Bạn không có quyền truy cập</p>
    <router-link to="/">Về trang chủ</router-link>
  </div>
</template>

<style scoped>
.forbidden {
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h1 {
  font-size: 80px;
  color: red;
}
</style>