
<script setup>
import { onMounted, ref } from "vue";
import { useCategories } from "@/stores/categories";
import { storeToRefs } from "pinia";

const store = useCategories();
const { categories } = storeToRefs(store);
const baseUrl = import.meta.env.VITE_API_BASE.replace("/api", "");
const loading = ref(true); // ✅ thêm loading

onMounted(async () => {
  loading.value = true;
  await store.loadCategories();
  loading.value = false;
});
</script>

<template>
  <section class="section categories-section">
    <div class="section-head">
      <div>
        <h2 class="section-title">Danh Mục Sản Phẩm</h2>
        <div class="title-bar"></div>
      </div>
      <a href="#" class="see-all">Xem tất cả &nbsp;→</a>
    </div>

    <div class="categories-grid">
      <!-- ✅ Skeleton categories -->
      <template v-if="loading">
        <div v-for="i in 6" :key="i" class="cat-card skeleton">
          <div class="skel-circle"></div>
          <div class="skel-line"></div>
        </div>
      </template>

      <template v-else>
        <a
          v-for="cat in categories"
          :key="cat.id"
          :href="`/product?category=${cat.slug}`"
          class="cat-card"
        >
          <div class="cat-icon-wrap">
            <img
              v-if="cat.image"
              :src="`${baseUrl}/storage/${cat.image}`"
              :alt="cat.name"
              class="cat-img"
            />
            <i v-else class="bi bi-tag cat-icon"></i>
          </div>
          <div class="cat-info">
            <p class="cat-name">{{ cat.name }}</p>
          </div>
          <span class="cat-arrow">→</span>
        </a>
      </template>
    </div>
  </section>
</template>

<style scoped>
/* giữ nguyên style cũ, thêm skeleton */
.categories-section {
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}
.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}
.title-bar {
  width: 36px;
  height: 3px;
  background: #1565c0;
  border-radius: 2px;
  margin-top: 7px;
}
.see-all {
  color: #1565c0;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
}
.see-all:hover {
  text-decoration: underline;
}
.categories-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
}
.cat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 14px 16px;
  background: #f9fafb;
  border: 1.5px solid transparent;
  border-radius: 14px;
  text-align: center;
  text-decoration: none;
  transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  cursor: pointer;
}
.cat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
  border-color: #1565c0;
}
.cat-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.22s;
}
.cat-card:hover .cat-icon-wrap {
  transform: scale(1.08);
}
.cat-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cat-icon {
  font-size: 28px;
  color: #1565c0;
}
.cat-info {
  flex: 1;
}
.cat-name {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
}
.cat-arrow {
  font-size: 13px;
  color: #1565c0;
  font-weight: 700;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.2s, transform 0.2s;
}
.cat-card:hover .cat-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* ✅ Skeleton styles */
.skeleton {
  pointer-events: none;
}
.skel-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.skel-line {
  width: 70%;
  height: 11px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>