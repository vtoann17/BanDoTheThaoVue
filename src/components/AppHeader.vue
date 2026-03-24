<script setup>
// có thể import auth sau nếu cần login/logout
</script>

<template>
  <header class="w-full py-6 px-4 border-b border-gray-100">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </div>
        <span class="text-xl font-bold tracking-tight">Sports Store</span>
      </div>

      <nav>
        <router-link to="/login" class="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
          Đăng nhập
        </router-link>
      </nav>
    </div>
  </header>
</template>