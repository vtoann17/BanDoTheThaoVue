<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import { useProducts } from "@/stores/products";
import { useCart } from "../stores/carts";
import { useNotify } from "@/composables/useNotify";
import { useReviews } from "../stores/reviews";

const route = useRoute();
const reviewStore = useReviews();
const store = useProducts();
const cartStore = useCart();
const { toastSuccess, toastError, toastInfo } = useNotify();
const baseUrl = import.meta.env.VITE_API_BASE.replace("/api", "");

const product = ref(null);
const attributes = ref([]);
const variants = ref([]);
const selected = ref({});
const activeImage = ref(0);
const loading = ref(true);
const qty = ref(1);
const liked = ref(false);
const addedToCart = ref(false);

const loadDetail = async (slug) => {
  loading.value = true;
  product.value = null;
  const data = await store.getProductDetail(slug);

  if (data) {
    product.value = data;
    attributes.value = data.attributes ?? [];
    variants.value = data.variants ?? [];
    const sel = {};
    attributes.value.forEach((attr) => {
      sel[attr.id] = null;
    });
    selected.value = sel;
    const relatedParams = {
      per_page: 5,
      status: 1,
    };

    if (data.subcategory) {
      relatedParams.subcategory_id = data.subcategory.id;
    } else if (data.brand) {
      relatedParams.brand_id = data.brand.id;
    }

    await store.loadProducts(relatedParams);
  }

  activeImage.value = 0;
  qty.value = 1;
  loading.value = false;
};

onMounted(() => loadDetail(route.params.slug));
watch(
  () => route.params.slug,
  (slug) => {
    if (slug) loadDetail(slug);
  }
);

const imageList = computed(() => {
  if (!product.value) return [];
  let imgs = [];
  if (product.value.images?.length) {
    imgs.push(
      ...product.value.images.map((img) =>
        img.path ? `${baseUrl}/storage/${img.path}` : img
      )
    );
  } else if (product.value.image) {
    imgs.push(`${baseUrl}/storage/${product.value.image}`);
  }
  variants.value.forEach((v) => {
    if (v.img) imgs.push(`${baseUrl}/storage/${v.img}`);
  });
  return imgs;
});

const mainSrc = computed(() => {
  if (matchedVariant.value?.img)
    return `${baseUrl}/storage/${matchedVariant.value.img}`;
  return imageList.value[activeImage.value] ?? "";
});

const matchedVariant = computed(() => {
  const vals = Object.values(selected.value).filter((v) => v !== null);
  if (!vals.length) return null;
  return (
    variants.value.find((v) =>
      vals.every((id) => v.attr_values.includes(id))
    ) ?? null
  );
});

const displayPrice = computed(() => {
  const base = matchedVariant.value ?? product.value;
  if (!base) return { original: "—", discounted: null, sale: 0 };
  const price = parseFloat(base.price ?? 0);
  const sale = base.sale ?? 0;
  const now = new Date();
  const inSale =
    sale > 0 &&
    (!base.start || new Date(base.start) <= now) &&
    (!base.end || new Date(base.end) >= now);
  if (inSale)
    return {
      original: price,
      discounted: +(price * (1 - sale / 100)).toFixed(0),
      sale,
    };
  return { original: price, discounted: null, sale: 0 };
});

const fmt = (n) => Number(n).toLocaleString("vi-VN") + "₫";

const stockStatus = computed(() => {
  if (!matchedVariant.value) return null;
  const s = matchedVariant.value.stock;
  if (s === 0) return { label: "Hết hàng", cls: "out" };
  if (s <= 5) return { label: `Còn ${s} sản phẩm`, cls: "low" };
  return { label: "Còn hàng", cls: "in" };
});

const maxQty = computed(() =>
  matchedVariant.value ? matchedVariant.value.stock : 99
);

function isAvailable(attrId, valId) {
  const others = Object.entries(selected.value)
    .filter(([k]) => parseInt(k) !== attrId && selected.value[k] !== null)
    .map(([, v]) => v);
  return variants.value.some(
    (v) =>
      v.stock > 0 &&
      v.attr_values.includes(valId) &&
      others.every((sel) => v.attr_values.includes(sel))
  );
}

function selectAttr(attrId, valId) {
  selected.value[attrId] = selected.value[attrId] === valId ? null : valId;
  qty.value = 1;
}

function selectedLabel(attr) {
  if (!selected.value[attr.id]) return null;
  return (
    attr.values.find((v) => v.id === selected.value[attr.id])?.value ?? null
  );
}

const checkFavoriteStatus = async () => {
  const authData = localStorage.getItem("auth");
  const token = authData ? JSON.parse(authData).token : null;

  if (!token || !product.value) return;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/favourites`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      liked.value = data.some((item) => item.product_id === product.value.id);
    }
  } catch (err) {
    console.error("Lỗi check favorite:", err);
  }
};

const handleFavorite = async () => {
  const authData = localStorage.getItem("auth");
  const token = authData ? JSON.parse(authData).token : null;

  if (!token) {
    toastError("Vui lòng đăng nhập để yêu thích sản phẩm!");
    return;
  }

  const isAdding = !liked.value;
  const apiUrl = `${import.meta.env.VITE_API_BASE}/favourites`;
  const url = isAdding ? apiUrl : `${apiUrl}/${product.value.id}`;

  try {
    const res = await fetch(url, {
      method: isAdding ? "POST" : "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: isAdding ? JSON.stringify({ product_id: product.value.id }) : null,
    });

    if (res.ok) {
      liked.value = isAdding;
      if (isAdding) {
        toastSuccess("Đã thêm vào danh sách yêu thích!");
      } else {
        toastInfo("Đã xóa khỏi danh sách yêu thích");
      }
    } else {
      const errorData = await res.json();
      toastError(errorData.message || "Lỗi từ phía server");
    }
  } catch (err) {
    toastError("Lỗi kết nối API rồi!");
  }
};

const handleQtyChange = () => {
  if (!qty.value || qty.value < 1) {
    qty.value = 1;
    return;
  }
  if (qty.value > maxQty.value) {
    toastError(`Rất tiếc, sản phẩm này chỉ còn ${maxQty.value} trong kho!`);
    qty.value = 1;
  }
};

watch(
  () => product.value,
  (newVal) => {
    if (newVal) {
      checkFavoriteStatus();

      reviewStore.loadReviews({
        product_id: newVal.id,
        per_page: 5,
      });
    }
  }
);

async function addToCart() {
  if (!matchedVariant.value || matchedVariant.value.stock === 0) return;
  const ok = await cartStore.addItem(matchedVariant.value.id, qty.value);
  if (ok) {
    addedToCart.value = true;
    setTimeout(() => {
      addedToCart.value = false;
    }, 2000);
  }
}

const related = computed(() =>
  store.products.filter((p) => p.slug !== route.params.slug).slice(0, 4)
);

onMounted(() => {
  store.loadProducts({ per_page: 8 });
});

const avgRating = computed(() => {
  if (!reviewStore.reviews.length) return 0;
  const total = reviewStore.reviews.reduce(
    (sum, r) => sum + Number(r.rating),
    0
  );
  return (total / reviewStore.reviews.length).toFixed(1);
});

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const avatarColors = [
  { bg: "#eff6ff", color: "#2563eb" },
  { bg: "#fef3c7", color: "#b45309" },
  { bg: "#f0fdf4", color: "#16a34a" },
  { bg: "#fdf4ff", color: "#9333ea" },
  { bg: "#fff1f2", color: "#e11d48" },
  { bg: "#f0fdfa", color: "#0d9488" },
];

function getAvatarColor(name) {
  if (!name) return avatarColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return avatarColors[hash % avatarColors.length];
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr.slice(0, 10);
  return d.toLocaleDateString("vi-VN");
}
</script>

<template>
  <div class="app">
    <AppHeader />
    <main class="main-content">
      <!-- LOADING -->
      <div v-if="loading" class="state-wrap">
        <div class="skeleton-hero">
          <div class="skel-gallery">
            <div class="skel-block main-skel"></div>
            <div class="skel-thumbs">
              <div v-for="i in 4" :key="i" class="skel-block thumb-skel"></div>
            </div>
          </div>
          <div class="skel-info">
            <div class="skel-line" style="width: 40%; height: 12px"></div>
            <div class="skel-line" style="width: 75%; height: 26px; margin-top: 6px"></div>
            <div class="skel-line" style="width: 55%; height: 12px"></div>
            <div class="skel-line" style="width: 100%; height: 50px; margin-top: 12px"></div>
            <div class="skel-line" style="width: 30%; height: 32px; margin-top: 16px"></div>
          </div>
        </div>
      </div>

      <!-- NOT FOUND -->
      <div v-else-if="!product" class="state-wrap not-found">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" stroke="#E5E7EB" stroke-width="2" />
          <path d="M20 20l24 24M44 20L20 44" stroke="#D1D5DB" stroke-width="2.5" stroke-linecap="round" />
        </svg>
        <p>Không tìm thấy sản phẩm</p>
        <router-link to="/" class="btn-back">← Về trang chủ</router-link>
      </div>

      <!-- CONTENT -->
      <template v-else>
        <!-- BREADCRUMB -->
        <nav class="breadcrumb">
          <router-link to="/">Trang chủ</router-link>
          <span class="sep">/</span>
          <router-link v-if="product.subcategory" :to="`/category/${product.subcategory.id}`">
            {{ product.subcategory.name }}
          </router-link>
          <span class="sep">/</span>
          <span>{{ product.name }}</span>
        </nav>

        <!-- HERO -->
        <section class="product-hero">
          <!-- Gallery -->
          <div class="product-gallery">
            <div class="main-image-wrap">
              <span v-if="product.brand" class="badge-brand">{{ product.brand.name }}</span>
              <span v-if="displayPrice.sale > 0" class="badge-sale-img">-{{ displayPrice.sale }}%</span>
              <img :src="mainSrc" :alt="product.name" class="main-img" />
            </div>
            <div v-if="imageList.length >= 1" class="thumb-row">
              <button
                v-for="(img, i) in imageList"
                :key="i"
                class="thumb-btn"
                :class="{ active: activeImage === i }"
                @click="activeImage = i"
              >
                <img :src="img" :alt="`${product.name} ${i + 1}`" />
              </button>
            </div>
          </div>

          <!-- Info -->
          <div class="product-info">
            <div class="info-header">
              <div class="product-meta">
                <span v-if="product.brand" class="meta-brand">{{ product.brand.name }}</span>
                <span v-if="product.brand && product.subcategory" class="meta-sep">·</span>
                <span v-if="product.subcategory" class="meta-cat">{{ product.subcategory.name }}</span>
              </div>
              <button class="btn-heart" :class="{ active: liked }" @click="handleFavorite">
                <svg viewBox="0 0 24 24" width="15" height="15">
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    :fill="liked ? '#ef4444' : 'none'"
                    :stroke="liked ? '#ef4444' : 'currentColor'"
                    stroke-width="1.8"
                  />
                </svg>
              </button>
            </div>

            <h1 class="product-title">{{ product.name }}</h1>

            <div class="rating-row">
              <div class="stars">
                <svg
                  v-for="i in 5"
                  :key="i"
                  viewBox="0 0 20 20"
                  width="12"
                  height="12"
                  :fill="i <= avgRating ? '#F59E0B' : '#D1D5DB'"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="rating-num">{{ product.rating ?? "4.8" }}</span>
              </div>
              <span class="rating-count">{{ reviewStore.total }} đánh giá</span>
              <template v-if="matchedVariant">
                <span class="dot-sep">·</span>
                <span class="sku-label">SKU: {{ matchedVariant.sku }}</span>
              </template>
            </div>

            <p v-if="product.description" class="product-desc">
              {{ product.description }}
            </p>

            <!-- Price -->
            <div class="price-block">
              <template v-if="displayPrice.sale > 0">
                <span class="price-sale">{{ fmt(displayPrice.discounted) }}</span>
                <span class="price-original">{{ fmt(displayPrice.original) }}</span>
                <span class="badge-sale-inline">-{{ displayPrice.sale }}%</span>
              </template>
              <template v-else>
                <span class="price-main">{{ fmt(displayPrice.original) }}</span>
              </template>
            </div>

            <!-- Stock -->
            <div v-if="stockStatus" class="stock-row">
              <span class="stock-dot" :class="stockStatus.cls"></span>
              <span class="stock-label" :class="stockStatus.cls">{{ stockStatus.label }}</span>
            </div>

            <div class="divider"></div>

            <!-- Attributes -->
            <div v-for="attr in attributes" :key="attr.id" class="attr-section">
              <div class="attr-header">
                <span class="attr-name">{{ attr.name }}</span>
                <span v-if="selectedLabel(attr)" class="attr-selected">{{ selectedLabel(attr) }}</span>
              </div>
              <div v-if="attr.name.toLowerCase().includes('màu')" class="color-list">
                <button
                  v-for="val in attr.values"
                  :key="val.id"
                  class="color-swatch"
                  :class="{
                    active: selected[attr.id] === val.id,
                    unavail: !isAvailable(attr.id, val.id),
                  }"
                  :title="val.value"
                  @click="selectAttr(attr.id, val.id)"
                >
                  <span class="swatch-inner" :style="{ background: val.hex ?? val.color ?? val.value }"></span>
                </button>
              </div>
              <div v-else class="size-list">
                <button
                  v-for="val in attr.values"
                  :key="val.id"
                  class="size-pill"
                  :class="{
                    active: selected[attr.id] === val.id,
                    unavail: !isAvailable(attr.id, val.id),
                  }"
                  @click="selectAttr(attr.id, val.id)"
                >
                  {{ val.value }}
                </button>
              </div>
            </div>

            <div class="divider"></div>

            <!-- Qty + CTA -->
            <div class="qty-row">
              <div class="qty-ctrl">
                <button @click="qty > 1 ? qty-- : null" :disabled="qty <= 1">−</button>
                <input
                  type="number"
                  v-model.number="qty"
                  class="qty-input"
                  @change="handleQtyChange"
                />
                <button @click="qty < maxQty ? qty++ : null" :disabled="qty >= maxQty">+</button>
              </div>
              <button
                class="btn-cart"
                :class="{ success: addedToCart }"
                :disabled="!matchedVariant || matchedVariant.stock === 0 || addedToCart"
                @click="addToCart"
              >
                <svg v-if="!addedToCart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {{
                  matchedVariant && matchedVariant.stock === 0
                    ? "Hết hàng"
                    : addedToCart
                    ? "Đã thêm!"
                    : "Thêm vào giỏ"
                }}
              </button>
              <button class="btn-buy">Mua ngay</button>
            </div>

            <!-- Policies -->
            <div class="policy-row">
              <div class="policy-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Miễn phí vận chuyển
              </div>
              <div class="policy-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Đổi trả 30 ngày
              </div>
              <div class="policy-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Bảo hành 2 năm
              </div>
            </div>
          </div>
        </section>

        <!-- RELATED -->
        <section v-if="related.length" class="related-section">
          <div class="section-head">
            <div>
              <p class="section-eyebrow">Có thể bạn sẽ thích</p>
              <h2 class="section-title">Sản phẩm liên quan</h2>
            </div>
            <router-link to="/products" class="btn-see-all">
              Xem tất cả
              <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </router-link>
          </div>
          <div class="related-grid">
            <router-link
              v-for="p in related"
              :key="p.id"
              :to="`/productdetail/${p.slug}`"
              class="rel-card"
            >
              <div class="rel-img">
                <img :src="`${baseUrl}/storage/${p.image}`" :alt="p.name" loading="lazy" />
                <div v-if="p.sale > 0" class="rel-badge">-{{ p.sale }}%</div>
              </div>
              <div class="rel-info">
                <h3 class="rel-name">{{ p.name }}</h3>
                <div class="rel-pricing">
                  <template v-if="p.sale > 0">
                    <span class="rel-price-sale">{{ fmt(p.price * (1 - p.sale / 100)) }}</span>
                    <span class="rel-price-orig">{{ fmt(p.price) }}</span>
                  </template>
                  <span v-else class="rel-price-main">{{ fmt(p.price) }}</span>
                </div>
              </div>
            </router-link>
          </div>
        </section>

        <!-- REVIEWS -->
        <section class="review-section" v-if="reviewStore.reviews.length">
          <div class="review-section-header">
            <div>
              <p class="section-eyebrow">Khách hàng nói gì</p>
              <h2 class="section-title">Đánh giá sản phẩm</h2>
            </div>
            <div class="review-score-card">
              <span class="review-score-avg">{{ avgRating }}</span>
              <div class="review-score-right">
                <div class="review-score-stars">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    viewBox="0 0 20 20"
                    width="13"
                    height="13"
                    :fill="i <= Math.round(avgRating) ? '#F59E0B' : '#D1D5DB'"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="review-score-count">{{ reviewStore.total }} đánh giá</span>
              </div>
            </div>
          </div>

          <div class="review-list">
            <div v-for="r in reviewStore.reviews" :key="r.id" class="review-item">
              <div class="review-item-top">
                <div
                  class="review-avatar"
                  :style="{ background: getAvatarColor(r.user?.name).bg, color: getAvatarColor(r.user?.name).color }"
                >
                  {{ getInitials(r.user?.name) }}
                </div>
                <div class="review-meta">
                  <div class="review-meta-row">
                    <span class="review-name">{{ r.user?.name }}</span>
                    <div class="review-stars-inline">
                      <svg
                        v-for="i in 5"
                        :key="i"
                        viewBox="0 0 20 20"
                        width="11"
                        height="11"
                        :fill="i <= r.rating ? '#F59E0B' : '#E5E7EB'"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span class="review-rating-num">{{ r.rating }}/5</span>
                    </div>
                  </div>
                  <span class="review-date">{{ formatDate(r.created_at) }}</span>
                </div>
              </div>
              <p class="review-comment">{{ r.comment }}</p>
              <div v-if="r.image" class="review-img-wrap">
                <img :src="`${baseUrl}/storage/${r.image}`" :alt="`Ảnh đánh giá`" />
              </div>
            </div>
          </div>
        </section>
      </template>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.app {
  min-height: 100vh;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #111827;
  --blue: #2563eb;
  --blue-dark: #1d4ed8;
  --blue-light: #eff6ff;
  --red: #ef4444;
  --green: #10b981;
  --orange: #f97316;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-900: #111827;
  --radius: 8px;
}

/* ── LAYOUT ── */
.main-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 14px 20px 48px;
}

/* ── STATE ── */
.state-wrap {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: var(--gray-400);
}

.not-found svg {
  width: 52px;
  height: 52px;
}

.not-found p {
  font-size: 14px;
}

.btn-back {
  font-size: 12px;
  font-weight: 600;
  color: var(--blue);
  padding: 6px 14px;
  border: 1px solid var(--blue);
  border-radius: 7px;
  transition: background 0.15s;
}

.btn-back:hover {
  background: var(--blue-light);
}

/* ── SKELETON ── */
.skeleton-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 36px;
  width: 100%;
  padding: 14px 0;
}

.skel-gallery {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skel-block {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 12px;
}

.main-skel {
  aspect-ratio: 1/1;
}

.skel-thumbs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.thumb-skel {
  aspect-ratio: 1/1;
}

.skel-info {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding-top: 6px;
}

.skel-line {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 6px;
  height: 14px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── BREADCRUMB ── */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--gray-400);
  margin-bottom: 14px;
}

.breadcrumb a:hover {
  color: var(--blue);
}

.breadcrumb span:last-child {
  color: var(--gray-900);
  font-weight: 500;
}

.sep {
  color: var(--gray-300);
}

/* ── HERO ── */
.product-hero {
  display: grid;
  grid-template-columns: 44% 1fr;
  gap: 32px;
  margin-bottom: 40px;
  align-items: start;
}

/* Gallery */
.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: sticky;
  top: 80px;
}

.main-image-wrap {
  background: var(--gray-100);
  border-radius: 14px;
  position: relative;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  max-height: 380px;
}

.main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.main-image-wrap:hover .main-img {
  transform: scale(1.04);
}

.badge-brand {
  position: absolute;
  top: 9px;
  left: 9px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  color: var(--blue);
  z-index: 2;
}

.badge-sale-img {
  position: absolute;
  top: 9px;
  right: 9px;
  background: var(--red);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 20px;
  z-index: 2;
}

.thumb-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
}

.thumb-btn {
  border-radius: 8px;
  border: 2px solid transparent;
  background: var(--gray-100);
  overflow: hidden;
  padding: 4px;
  aspect-ratio: 1 / 1;
  transition: border-color 0.18s;
}

.thumb-btn img {
  object-fit: contain;
  mix-blend-mode: multiply;
}

.thumb-btn:hover {
  border-color: var(--gray-300);
}

.thumb-btn.active {
  border-color: var(--blue);
}

/* Info */
.product-info {
  display: flex;
  flex-direction: column;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
}

.meta-brand {
  font-weight: 600;
  color: var(--blue);
}

.meta-sep {
  color: var(--gray-300);
}

.meta-cat {
  color: var(--gray-400);
}

.btn-heart {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-400);
  transition: all 0.18s;
}

.btn-heart:hover,
.btn-heart.active {
  color: var(--red);
  border-color: #fecaca;
  background: #fff5f5;
}

.product-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.2px;
  margin-bottom: 7px;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 9px;
  font-size: 12px;
  color: var(--gray-500);
}

.stars {
  display: flex;
  align-items: center;
  gap: 1px;
}

.rating-num {
  font-weight: 600;
  color: var(--gray-900);
  font-size: 12px;
  margin-left: 3px;
}

.rating-count {
  color: var(--gray-400);
}

.dot-sep {
  color: var(--gray-300);
}

.sku-label {
  font-family: "Courier New", monospace;
  font-size: 11px;
  color: var(--gray-400);
}

.product-desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--gray-500);
  margin-bottom: 12px;
}

/* Price */
.price-block {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 5px;
}

.price-main {
  font-size: 20px;
  font-weight: 700;
  color: var(--gray-900);
}

.price-sale {
  font-size: 20px;
  font-weight: 700;
  color: var(--red);
}

.price-original {
  font-size: 14px;
  color: var(--gray-400);
  text-decoration: line-through;
}

.badge-sale-inline {
  font-size: 11px;
  font-weight: 600;
  color: var(--red);
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 1px 6px;
  border-radius: 5px;
}

/* Stock */
.stock-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 9px;
  font-size: 12px;
  font-weight: 500;
}

.stock-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.stock-dot.in { background: var(--green); }
.stock-dot.low { background: var(--orange); }
.stock-dot.out { background: var(--gray-400); }

.stock-label.in { color: var(--green); }
.stock-label.low { color: var(--orange); }
.stock-label.out { color: var(--gray-400); }

.divider {
  height: 1px;
  background: var(--gray-200);
  margin: 10px 0;
}

/* Attrs */
.attr-section {
  margin-bottom: 11px;
}

.attr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
}

.attr-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.attr-selected {
  font-size: 11px;
  font-weight: 500;
  color: var(--blue);
}

.size-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.size-pill {
  min-width: 38px;
  height: 31px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid var(--gray-200);
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-900);
  background: #fff;
  transition: all 0.15s;
}

.size-pill:hover:not(.unavail) {
  border-color: var(--blue);
  color: var(--blue);
}

.size-pill.active {
  background: var(--blue);
  border-color: var(--blue);
  color: #fff;
  font-weight: 600;
}

.size-pill.unavail {
  opacity: 0.3;
  cursor: not-allowed;
  text-decoration: line-through;
}

.color-list {
  display: flex;
  gap: 6px;
}

.color-swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  padding: 2px;
  transition: all 0.15s;
}

.swatch-inner {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.color-swatch:hover:not(.unavail) {
  border-color: var(--gray-400);
}

.color-swatch.active {
  border-color: var(--blue);
}

.color-swatch.unavail {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Qty + CTA */
.qty-row {
  display: flex;
  gap: 7px;
  align-items: center;
  margin-bottom: 10px;
}

.qty-ctrl {
  display: flex;
  align-items: center;
  border: 1px solid var(--gray-200);
  border-radius: 7px;
  overflow: hidden;
  flex-shrink: 0;
}

.qty-ctrl button {
  width: 30px;
  height: 34px;
  font-size: 15px;
  color: var(--gray-500);
  background: #fff;
  transition: background 0.15s;
}

.qty-ctrl button:hover:not(:disabled) {
  background: var(--gray-100);
  color: var(--gray-900);
}

.qty-ctrl button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-input {
  width: 32px;
  height: 34px;
  border: none;
  border-left: 1px solid var(--gray-200);
  border-right: 1px solid var(--gray-200);
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-900);
  outline: none;
  background: transparent;
  -moz-appearance: textfield;
}

.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.btn-cart {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--gray-900);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  padding: 9px 12px;
  border-radius: var(--radius);
  transition: background 0.18s, transform 0.1s;
}

.btn-cart:active:not(:disabled) {
  transform: scale(0.97);
}

.btn-cart:hover:not(:disabled) {
  background: #1f2937;
}

.btn-cart.success {
  background: var(--green);
}

.btn-cart:disabled {
  background: var(--gray-200);
  color: var(--gray-400);
  cursor: not-allowed;
}

.btn-buy {
  flex: 1;
  background: var(--blue);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  padding: 9px 12px;
  border-radius: var(--radius);
  transition: background 0.18s, transform 0.1s;
}

.btn-buy:hover {
  background: var(--blue-dark);
}

.btn-buy:active {
  transform: scale(0.97);
}

/* Policies */
.policy-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  padding-top: 2px;
}

.policy-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--gray-500);
}

.policy-item svg {
  color: var(--green);
  flex-shrink: 0;
}

/* ── RELATED ── */
.related-section {
  padding-top: 4px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 14px;
}

.section-eyebrow {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--blue);
  margin-bottom: 2px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--gray-900);
}

.btn-see-all {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: var(--blue);
  padding: 5px 12px;
  border: 1px solid var(--gray-200);
  border-radius: 20px;
  transition: all 0.18s;
}

.btn-see-all:hover {
  background: var(--blue-light);
  border-color: var(--blue);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.rel-card {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.rel-img {
  background: var(--gray-100);
  border-radius: 10px;
  aspect-ratio: 1 / 1.05;
  overflow: hidden;
  position: relative;
  margin-bottom: 8px;
  transition: box-shadow 0.25s;
}

.rel-card:hover .rel-img {
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.09);
}

.rel-img img {
  mix-blend-mode: multiply;
  transition: transform 0.3s ease;
  padding: 10px;
}

.rel-card:hover .rel-img img {
  transform: scale(1.05);
}

.rel-badge {
  position: absolute;
  top: 7px;
  right: 7px;
  background: var(--red);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
}

.rel-name {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 3px;
  color: var(--gray-900);
}

.rel-pricing {
  display: flex;
  align-items: center;
  gap: 5px;
}

.rel-price-main {
  font-size: 12px;
  font-weight: 700;
  color: var(--gray-900);
}

.rel-price-sale {
  font-size: 12px;
  font-weight: 700;
  color: var(--red);
}

.rel-price-orig {
  font-size: 11px;
  color: var(--gray-400);
  text-decoration: line-through;
}

/* ── REVIEWS ── */
.review-section {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--gray-200);
}

.review-section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
}

.review-score-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--gray-100);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 12px 18px;
}

.review-score-avg {
  font-size: 32px;
  font-weight: 700;
  color: var(--gray-900);
  line-height: 1;
}

.review-score-right {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.review-score-stars {
  display: flex;
  gap: 2px;
}

.review-score-count {
  font-size: 11px;
  color: var(--gray-400);
}

.review-list {
  display: flex;
  flex-direction: column;
}

.review-item {
  padding: 18px 0;
  border-bottom: 1px solid var(--gray-100);
}

.review-item:last-child {
  border-bottom: none;
}

.review-item-top {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-bottom: 10px;
}

.review-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}

.review-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.review-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.review-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-900);
}

.review-stars-inline {
  display: flex;
  align-items: center;
  gap: 2px;
}

.review-rating-num {
  font-size: 11px;
  font-weight: 600;
  color: var(--gray-500);
  margin-left: 4px;
}

.review-date {
  font-size: 11px;
  color: var(--gray-400);
}

.review-comment {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.65;
  padding-left: 47px;
}

.review-img-wrap {
  padding-left: 47px;
  margin-top: 10px;
}

.review-img-wrap img {
  width: 76px;
  height: 76px;
  object-fit: cover;
  border-radius: 9px;
  border: 1px solid var(--gray-200);
}

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .skeleton-hero {
    grid-template-columns: 1fr;
  }

  .product-hero {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .product-gallery {
    position: static;
  }

  .main-image-wrap {
    max-height: none;
  }

  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .review-section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 10px 12px 40px;
  }

  .product-title {
    font-size: 17px;
  }

  .qty-row {
    flex-wrap: wrap;
  }

  .btn-cart,
  .btn-buy {
    flex: 1 1 100px;
  }

  .related-grid {
    gap: 9px;
  }

  .review-meta-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
  }

  .review-comment {
    padding-left: 0;
  }

  .review-img-wrap {
    padding-left: 0;
  }
}
</style>