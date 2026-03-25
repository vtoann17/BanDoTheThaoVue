<script setup>
import MainLayout from './layouts/MainLayout.vue';
import { onMounted } from "vue";
import { useAuth } from "@/stores/auth";

const authStore = useAuth();

onMounted(() => {
  authStore.getUser();
});
</script>

 <template>
  <main-layout>
    <router-view></router-view>
  </main-layout>
 </template>
