<script setup>
import { ref } from "vue";
import { useAuth } from "@/stores/auth";
import AppHeader from "@/components/AppHeader.vue";

const authStore = useAuth();

const fullname = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const terms = ref(false);

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.");
    return;
  }

  if (!terms.value) {
    alert("Bạn phải đồng ý điều khoản");
    return;
  }

  await authStore.register({
    name: fullname.value,
    email: email.value,
    password: password.value,
  });
};
</script>

<template>
  <div class="bg-white text-slate-900 antialiased min-h-screen flex flex-col">

    <!-- HEADER -->
    

    <!-- MAIN -->
    <main class="flex-grow flex items-center justify-center p-4 py-12 lg:py-20">
      <div class="w-full max-w-md">

        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Đăng ký tài khoản
          </h1>
          <p class="text-gray-500">
            Gia nhập cộng đồng yêu thể thao ngay hôm nay
          </p>
        </div>

        <!-- FORM -->
        <form class="space-y-5" @submit.prevent="handleSubmit">

          <!-- NAME -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              v-model="fullname"
              class="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
              placeholder="Nguyễn Văn A"
              required
              type="text"
            />
          </div>

          <!-- EMAIL -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              v-model="email"
              class="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
              placeholder="vi-du@email.com"
              required
              type="email"
            />
          </div>

          <!-- PASSWORD -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              v-model="password"
              class="w-full px-4 py-3 rounded-xl border-gray-200"
              placeholder="••••••••"
              required
              type="password"
            />
          </div>

          <!-- CONFIRM -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu
            </label>
            <input
              v-model="confirmPassword"
              class="w-full px-4 py-3 rounded-xl border-gray-200"
              placeholder="••••••••"
              required
              type="password"
            />
          </div>

          <!-- TERMS -->
          <div class="flex items-start gap-3 py-2">
            <input v-model="terms" type="checkbox" class="h-5 w-5"/>
            <label class="text-sm text-gray-600">
              Tôi đồng ý với
              <a class="text-primary font-medium hover:underline">Điều khoản</a>
            </label>
          </div>

          <!-- BUTTON -->
          <button
            type="submit"
            class="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 px-4 rounded-xl"
          >
            Đăng ký ngay
          </button>
        </form>

        <!-- FOOTER -->
        <p class="mt-8 text-center text-sm text-gray-500">
          Bạn đã có tài khoản?
          <router-link to="/login" class="text-primary font-semibold hover:underline">
            Đăng nhập ngay
          </router-link>
        </p>

      </div>
    </main>

    <!-- FOOTER -->
    <footer class="py-8 text-center text-xs text-gray-400 border-t border-gray-100">
      © 2024 Sports Store
    </footer>

  </div>
</template>