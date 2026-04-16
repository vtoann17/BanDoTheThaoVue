<script setup>
import { onMounted, ref } from "vue";
import { useProducts } from "@/stores/products";

const store = useProducts();
const baseUrl = import.meta.env.VITE_API_BASE.replace("/api", "");
const liked = ref(new Set());
const loading = ref(true); // ✅ thêm loading state

onMounted(async () => {
  loading.value = true;
  await store.loadProducts({ per_page: 4 });
  loading.value = false;
});

const toggleLike = (id) => {
  const s = new Set(liked.value);
  s.has(id) ? s.delete(id) : s.add(id);
  liked.value = s;
};
</script>

<template>
  <section class="section">
    <div class="section-head">
      <div>
        <h2 class="section-title">Hàng Mới Về</h2>
        <div class="title-bar"></div>
      </div>
      <a href="/product" class="see-all">Xem tất cả &nbsp;→</a>
    </div>

    <div class="products-grid">
      <!-- ✅ Dùng loading thay vì products.length === 0 -->
      <template v-if="loading">
        <div v-for="i in 4" :key="i" class="product-card skeleton">
          <div class="prod-img-wrap skel-img"></div>
          <div class="prod-body">
            <div class="skel-line short"></div>
            <div class="skel-line"></div>
            <div class="skel-line mid"></div>
          </div>
        </div>
      </template>

      <template v-else>
        <div v-for="p in store.products" :key="p.id" class="product-card">
          <router-link :to="`/productdetail/${p.slug}`" class="product-card">
            <div class="prod-img-wrap">
              <img :src="`${baseUrl}/storage/${p.image}`" :alt="p.name" loading="lazy"/>
              <button class="like-btn" :class="{ active: liked.has(p.id) }" @click.stop="toggleLike(p.id)">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                     2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                     C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                     c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    :fill="liked.has(p.id) ? '#ef4444' : 'none'"
                    :stroke="liked.has(p.id) ? '#ef4444' : '#fff'"
                    stroke-width="1.8"
                  />
                </svg>
              </button>
            </div>
            <div class="prod-body">
              <p class="prod-name">{{ p.name }}</p>
              <div class="prod-foot">
                <span class="prod-price">{{ Number(p.price).toLocaleString("vi-VN") }}₫</span>
              </div>
            </div>
          </router-link>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
/* ── Layout giữ nguyên ── */
.section {
  padding: 56px 48px;
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
  line-height: 1;
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
  white-space: nowrap;
}
.see-all:hover {
  text-decoration: underline;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* ── Card ── */
.product-card {
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: transform 0.28s cubic-bezier(0.22, 0.68, 0, 1.2),
    box-shadow 0.28s ease;
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
}

/* ── Ảnh ── */
.prod-img-wrap {
  position: relative;
  aspect-ratio: 1 / 1;
  background: #f3f4f6;
  overflow: hidden;
}
.prod-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s cubic-bezier(0.22, 0.68, 0, 1.2);
}
.product-card:hover .prod-img-wrap img {
  transform: scale(1.07);
}

/* ── Nút yêu thích ── */
.like-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;

  /* Ẩn mặc định, hiện khi hover card */
  opacity: 0;
  transform: scale(0.8) translateY(-4px);
  transition: opacity 0.22s ease,
    transform 0.22s cubic-bezier(0.22, 0.68, 0, 1.4), background 0.2s;
}
.product-card:hover .like-btn {
  opacity: 1;
  transform: scale(1) translateY(0);
}
.like-btn:hover {
  background: rgba(0, 0, 0, 0.45);
  transform: scale(1.1) !important;
}
.like-btn.active {
  background: rgba(239, 68, 68, 0.15);
  opacity: 1;
  transform: scale(1) translateY(0);
}
.like-btn.active:hover {
  background: rgba(239, 68, 68, 0.25);
}

/* ── Body ── */
.prod-body {
  padding: 14px;
}
.prod-cat {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 4px;
}
.prod-name {
  font-size: 14.5px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.prod-foot {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.prod-price {
  color: #1565c0;
  font-weight: 700;
  font-size: 14.5px;
}

/* ── Skeleton ── */
.skel-img {
  background: #e5e7eb;
}
.skel-line {
  height: 11px;
  background: linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  margin-bottom: 9px;
  animation: shimmer 1.4s infinite;
}
.skel-line.short {
  width: 45%;
}
.skel-line.mid {
  width: 65%;
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