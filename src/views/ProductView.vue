<script setup>
import AppFooter from "@/components/AppFooter.vue";
import AppHeader from "@/components/AppHeader.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProducts } from "@/stores/products";
import { useCategories } from "@/stores/categories";
import { useSubcategories } from "@/stores/subcategory";
import { storeToRefs } from "pinia";

const route = useRoute();
const router = useRouter();

const productStore = useProducts();
const categoryStore = useCategories();
const subcategoryStore = useSubcategories();

const { categories } = storeToRefs(categoryStore);
const { subcategories } = storeToRefs(subcategoryStore);

const baseUrl = import.meta.env.VITE_API_BASE.replace("/api", "");

const selectedCategoryId = ref(
  route.query.category_id ? Number(route.query.category_id) : null
);
const selectedSubcategoryId = ref(
  route.query.subcategory_id ? Number(route.query.subcategory_id) : null
);
const selectedBrandId = ref(
  route.query.brand_id ? Number(route.query.brand_id) : null
);
const priceMin = ref(Number(route.query.min_price) || 0);
const priceMax = ref(Number(route.query.max_price) || 50000000);
const sortBy = ref(route.query.sort_by ?? "id");
const sortDir = ref(route.query.sort_dir ?? "desc");
const showSort = ref(false);
const currentPage = ref(Number(route.query.page) || 1);

const expandedCats = ref(new Set());
const liked = ref(new Set());
const loading = ref(false);

const brandList = computed(() => {
  const map = new Map();
  productStore.products.forEach((p) => {
    if (p.brand) map.set(p.brand.id, p.brand);
  });
  return [...map.values()];
});

const subsByCategory = computed(() => {
  const map = {};
  subcategories.value.forEach((s) => {
    if (!map[s.category_id]) map[s.category_id] = [];
    map[s.category_id].push(s);
  });
  return map;
});

const sortOptions = [
  { label: "Mới nhất", sort_by: "id", sort_dir: "desc" },
  { label: "Cũ nhất", sort_by: "id", sort_dir: "asc" },
  { label: "Giá tăng dần", sort_by: "price", sort_dir: "asc" },
  { label: "Giá giảm dần", sort_by: "price", sort_dir: "desc" },
  { label: "Tên A–Z", sort_by: "name", sort_dir: "asc" },
  { label: "Tên Z–A", sort_by: "name", sort_dir: "desc" },
];

const sortLabel = computed(
  () =>
    sortOptions.find(
      (o) => o.sort_by === sortBy.value && o.sort_dir === sortDir.value
    )?.label ?? "Mới nhất"
);

const fetchProducts = async () => {
  loading.value = true;

  const params = {
    per_page: 8,
    page: currentPage.value,
    sort_by: sortBy.value,
    sort_dir: sortDir.value,
    status: 1,
  };

  // Thêm các tham số lọc
  if (selectedCategoryId.value) params.category_id = selectedCategoryId.value;
  if (selectedSubcategoryId.value)
    params.subcategory_id = selectedSubcategoryId.value;
  if (selectedBrandId.value) params.brand_id = selectedBrandId.value;
  if (priceMin.value > 0) params.min_price = priceMin.value;
  if (priceMax.value < 50000000) params.max_price = priceMax.value;
  if (route.query.search) params.search = route.query.search; // Hỗ trợ tìm kiếm từ Header

  await productStore.loadProducts(params);
  loading.value = false;
};

onMounted(async () => {
  await Promise.all([
    categoryStore.loadCategories(),
    subcategoryStore.loadSubcategories({ per_page: 999 }),
    fetchProducts(),
  ]);
  if (selectedCategoryId.value)
    expandedCats.value.add(selectedCategoryId.value);
});

watch(
  () => route.query,
  (q) => {
    selectedCategoryId.value = q.category_id ? Number(q.category_id) : null;
    selectedSubcategoryId.value = q.subcategory_id
      ? Number(q.subcategory_id)
      : null;
    selectedBrandId.value = q.brand_id ? Number(q.brand_id) : null;
    priceMin.value = Number(q.min_price) || 0;
    priceMax.value = Number(q.max_price) || 50000000;
    sortBy.value = q.sort_by ?? "id";
    sortDir.value = q.sort_dir ?? "desc";
    currentPage.value = Number(q.page) || 1;
    fetchProducts();
  },
  { deep: true }
);

const buildQuery = () => {
  const q = { page: 1 };
  if (selectedCategoryId.value) q.category_id = selectedCategoryId.value;
  if (selectedSubcategoryId.value)
    q.subcategory_id = selectedSubcategoryId.value;
  if (selectedBrandId.value) q.brand_id = selectedBrandId.value;
  if (priceMin.value > 0) q.min_price = priceMin.value;
  if (priceMax.value < 50000000) q.max_price = priceMax.value;
  if (sortBy.value !== "id" || sortDir.value !== "desc") {
    q.sort_by = sortBy.value;
    q.sort_dir = sortDir.value;
  }
  if (route.query.search) q.search = route.query.search;
  return q;
};

const applyFilter = () => {
  currentPage.value = 1;
  router.push({ query: buildQuery() });
};

const toggleCategory = (catId) => {
  const s = new Set(expandedCats.value);
  s.has(catId) ? s.delete(catId) : s.add(catId);
  expandedCats.value = s;
};

const selectCategory = (catId) => {
  if (selectedCategoryId.value === catId) {
    selectedCategoryId.value = null;
    selectedSubcategoryId.value = null;
  } else {
    selectedCategoryId.value = catId;
    selectedSubcategoryId.value = null;
    expandedCats.value = new Set([catId]);
  }
  applyFilter();
};

const selectSubcategory = (subId) => {
  selectedSubcategoryId.value =
    selectedSubcategoryId.value === subId ? null : subId;
  applyFilter();
};

const selectBrand = (brandId) => {
  selectedBrandId.value = selectedBrandId.value === brandId ? null : brandId;
  applyFilter();
};

const setSort = (opt) => {
  sortBy.value = opt.sort_by;
  sortDir.value = opt.sort_dir;
  showSort.value = false;
  applyFilter();
};

const setPage = (p) => {
  if (typeof p !== "number") return;
  currentPage.value = p;
  router.push({ query: { ...buildQuery(), page: p } });
};

const clearAll = () => {
  selectedCategoryId.value = null;
  selectedSubcategoryId.value = null;
  selectedBrandId.value = null;
  priceMin.value = 0;
  priceMax.value = 50000000;
  sortBy.value = "id";
  sortDir.value = "desc";
  expandedCats.value = new Set();
  router.push({ query: {} });
};

const toggleLike = (id) => {
  const s = new Set(liked.value);
  s.has(id) ? s.delete(id) : s.add(id);
  liked.value = s;
};

const fmt = (n) => Number(n).toLocaleString("vi-VN") + "₫";
const imgUrl = (path) => (path ? `${baseUrl}/storage/${path}` : "");

const displayPrice = (p) => {
  const price = parseFloat(p.price ?? 0);
  const sale = p.sale ?? 0;
  const now = new Date();
  const inSale =
    sale > 0 &&
    (!p.start || new Date(p.start) <= now) &&
    (!p.end || new Date(p.end) >= now);
  return inSale
    ? {
        sale,
        discounted: +(price * (1 - sale / 100)).toFixed(0),
        original: price,
      }
    : { sale: 0, discounted: null, original: price };
};

const activeFilterTags = computed(() => {
  const tags = [];
  if (selectedCategoryId.value) {
    const cat = categories.value.find((c) => c.id === selectedCategoryId.value);
    if (cat)
      tags.push({
        label: cat.name,
        clear: () => {
          selectedCategoryId.value = null;
          selectedSubcategoryId.value = null;
          applyFilter();
        },
      });
  }
  if (selectedSubcategoryId.value) {
    const sub = subcategories.value.find(
      (s) => s.id === selectedSubcategoryId.value
    );
    if (sub)
      tags.push({
        label: sub.name,
        clear: () => {
          selectedSubcategoryId.value = null;
          applyFilter();
        },
      });
  }
  if (selectedBrandId.value) {
    const brand = brandList.value.find((b) => b.id === selectedBrandId.value);
    if (brand)
      tags.push({
        label: brand.name,
        clear: () => {
          selectedBrandId.value = null;
          applyFilter();
        },
      });
  }
  if (priceMin.value > 0 || priceMax.value < 50000000) {
    tags.push({
      label: `${fmt(priceMin.value)} – ${fmt(priceMax.value)}`,
      clear: () => {
        priceMin.value = 0;
        priceMax.value = 50000000;
        applyFilter();
      },
    });
  }
  return tags;
});

const pages = computed(() => {
  const last = productStore.lastPage;
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
  const cur = currentPage.value;
  const arr = [1];
  if (cur > 3) arr.push("...");
  for (let i = Math.max(2, cur - 1); i <= Math.min(last - 1, cur + 1); i++)
    arr.push(i);
  if (cur < last - 2) arr.push("...");
  arr.push(last);
  return arr;
});
</script>

<template>
  <div class="app">
    <AppHeader />

    <div class="breadcrumb">
      <router-link to="/">Trang chủ</router-link>
      <span class="sep">/</span>
      <span class="bc-current">Sản phẩm</span>
    </div>

    <div class="page-header">
      <div>
        <h1 class="">Giày Thể Thao &amp; Đồ Tập</h1>
        <p class="page-sub">
          {{ loading ? "Đang tải..." : `${productStore.total} sản phẩm` }}
        </p>
      </div>
      <div class="sort-wrap">
        <span class="sort-label">Sắp xếp:</span>
        <div class="sort-select" @click="showSort = !showSort">
          <span>{{ sortLabel }}</span>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <div class="sort-dropdown" v-if="showSort">
            <div
              v-for="o in sortOptions"
              :key="o.label"
              class="sort-opt"
              :class="{
                active: o.sort_by === sortBy && o.sort_dir === sortDir,
              }"
              @click.stop="setSort(o)"
            >
              {{ o.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="body-wrap">
      <aside class="sidebar">
        <div class="filter-block">
          <p class="filter-title">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1565C0"
              stroke-width="2.2"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Danh mục
          </p>
          <div v-for="cat in categories" :key="cat.id" class="cat-tree-item">
            <div
              class="cat-row"
              :class="{ 'cat-active': selectedCategoryId === cat.id }"
            >
              <div class="cat-row-left" @click="selectCategory(cat.id)">
                <div
                  class="cat-dot"
                  :class="{ active: selectedCategoryId === cat.id }"
                ></div>
                <img
                  v-if="cat.image"
                  :src="imgUrl(cat.image)"
                  :alt="cat.name"
                  class="cat-thumb"
                />
                <span class="cat-row-name">{{ cat.name }}</span>
              </div>
              <button
                v-if="subsByCategory[cat.id]?.length"
                class="cat-toggle"
                @click.stop="toggleCategory(cat.id)"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  :style="{
                    transform: expandedCats.has(cat.id)
                      ? 'rotate(180deg)'
                      : 'rotate(0)',
                    transition: 'transform .2s',
                  }"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
            <div
              v-if="expandedCats.has(cat.id) && subsByCategory[cat.id]?.length"
              class="sub-list"
            >
              <div
                v-for="sub in subsByCategory[cat.id]"
                :key="sub.id"
                class="sub-row"
                :class="{ 'sub-active': selectedSubcategoryId === sub.id }"
                @click="selectSubcategory(sub.id)"
              >
                <span class="sub-dash">—</span>
                <span class="sub-name">{{ sub.name }}</span>
                <span v-if="selectedSubcategoryId === sub.id" class="sub-check"
                  >✓</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="divider" />

        <div class="filter-block" v-if="brandList.length">
          <p class="filter-title">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1565C0"
              stroke-width="2.2"
            >
              <path
                d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
              />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            Thương hiệu
          </p>
          <div
            v-for="brand in brandList"
            :key="brand.id"
            class="check-row"
            @click="selectBrand(brand.id)"
          >
            <div
              class="custom-check"
              :class="{ checked: selectedBrandId === brand.id }"
            >
              <svg
                v-if="selectedBrandId === brand.id"
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
              >
                <polyline
                  points="2,6 5,9 10,3"
                  stroke="#fff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span>{{ brand.name }}</span>
          </div>
        </div>

        <div class="divider" v-if="brandList.length" />

        <div class="filter-block">
          <p class="filter-title">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1565C0"
              stroke-width="2.2"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
            </svg>
            Khoảng giá
          </p>
          <div class="price-inputs">
            <div class="price-input-wrap">
              <span class="price-currency">₫</span>
              <input
                type="number"
                placeholder="Từ"
                :value="priceMin"
                @input="priceMin = Math.max(0, Number($event.target.value))"
                class="price-input"
                min="0"
              />
            </div>
            <span class="price-dash">—</span>
            <div class="price-input-wrap">
              <span class="price-currency">₫</span>
              <input
                type="number"
                placeholder="Đến"
                :value="priceMax"
                @input="
                  priceMax = Math.max(
                    priceMin + 1000,
                    Number($event.target.value)
                  )
                "
                class="price-input"
              />
            </div>
          </div>

          <div class="range-wrap">
            <div class="range-track">
              <div
                class="range-fill"
                :style="{
                  left: (priceMin / 50000000) * 100 + '%',
                  width: ((priceMax - priceMin) / 50000000) * 100 + '%',
                }"
              ></div>
            </div>
            <input
              type="range"
              min="0"
              max="50000000"
              step="100000"
              :value="priceMin"
              @input="
                priceMin = Math.min(
                  Number($event.target.value),
                  priceMax - 100000
                )
              "
              class="range-slider"
            />
            <input
              type="range"
              min="0"
              max="50000000"
              step="100000"
              :value="priceMax"
              @input="
                priceMax = Math.max(
                  Number($event.target.value),
                  priceMin + 100000
                )
              "
              class="range-slider"
            />
          </div>

          <div class="price-labels">
            <span class="price-val">{{ fmt(priceMin) }}</span>
            <span class="price-val blue">{{ fmt(priceMax) }}</span>
          </div>

          <div class="price-quick">
            <button
              v-for="q in [
                { label: 'Dưới 500k', min: 0, max: 500000 },
                { label: '500k–2tr', min: 500000, max: 2000000 },
                { label: '2tr–5tr', min: 2000000, max: 5000000 },
                { label: 'Trên 5tr', min: 5000000, max: 50000000 },
              ]"
              :key="q.label"
              class="price-q-btn"
              :class="{ active: priceMin === q.min && priceMax === q.max }"
              @click="
                priceMin = q.min;
                priceMax = q.max;
              "
            >
              {{ q.label }}
            </button>
          </div>
        </div>

        <button class="btn-apply" @click="applyFilter">Áp dụng bộ lọc</button>
        <button
          v-if="activeFilterTags.length"
          class="btn-reset"
          @click="clearAll"
        >
          Xóa tất cả bộ lọc
        </button>
      </aside>

      <main class="main-area">
        <div class="active-filters" v-if="activeFilterTags.length">
          <span
            v-for="(tag, i) in activeFilterTags"
            :key="i"
            class="filter-tag"
          >
            {{ tag.label }}
            <button @click="tag.clear()">
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                <line
                  x1="1"
                  y1="1"
                  x2="11"
                  y2="11"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
                <line
                  x1="11"
                  y1="1"
                  x2="1"
                  y2="11"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </span>
          <button class="clear-all" @click="clearAll">Xóa tất cả</button>
        </div>

        <div v-if="loading" class="products-grid">
          <div v-for="i in 8" :key="i" class="product-card skeleton">
            <div class="prod-img-wrap skel-img"></div>
            <div class="prod-body">
              <div class="skel-line short"></div>
              <div class="skel-line"></div>
              <div class="skel-line mid"></div>
            </div>
          </div>
        </div>

        <div v-else-if="productStore.products.length === 0" class="empty-state">
          <svg viewBox="0 0 64 64" fill="none" width="52" height="52">
            <circle cx="32" cy="32" r="30" stroke="#E5E7EB" stroke-width="2" />
            <path
              d="M20 20l24 24M44 20L20 44"
              stroke="#D1D5DB"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </svg>
          <p>Không tìm thấy sản phẩm nào</p>
          <button class="btn-reset inline" @click="clearAll">Xóa bộ lọc</button>
        </div>

        <div v-else class="products-grid">
          <router-link
            v-for="p in productStore.products"
            :key="p.id"
            :to="`/productdetail/${p.slug}`"
            class="product-card"
          >
            <div class="prod-img-wrap">
              <img :src="imgUrl(p.image)" :alt="p.name" loading="lazy" />
              <span v-if="(p.sale ?? 0) > 0" class="card-badge"
                >-{{ p.sale }}%</span
              >
              <button
                class="like-btn"
                :class="{ active: liked.has(p.id) }"
                @click.prevent="toggleLike(p.id)"
              >
                <svg viewBox="0 0 24 24" width="15" height="15">
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    :fill="liked.has(p.id) ? '#ef4444' : 'none'"
                    :stroke="liked.has(p.id) ? '#ef4444' : '#fff'"
                    stroke-width="1.8"
                  />
                </svg>
              </button>
            </div>
            <div class="prod-body">
              <p class="prod-cat">{{ p.subcategory?.name ?? "" }}</p>
              <p class="prod-name">{{ p.name }}</p>
              <div class="prod-foot">
                <div>
                  <template v-if="displayPrice(p).sale > 0">
                    <p class="prod-price sale">
                      {{ fmt(displayPrice(p).discounted) }}
                    </p>
                    <p class="old-price">{{ fmt(displayPrice(p).original) }}</p>
                  </template>
                  <p v-else class="prod-price">
                    {{ fmt(displayPrice(p).original) }}
                  </p>
                </div>
                <div class="cart-btn">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
                    />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
              </div>
            </div>
          </router-link>
        </div>

        <div class="pagination" v-if="productStore.lastPage > 1">
          <button
            class="pg-btn"
            :disabled="currentPage === 1"
            @click="setPage(currentPage - 1)"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <template v-for="p in pages" :key="p">
            <button
              class="pg-btn"
              :class="{ active: p === currentPage, dots: p === '...' }"
              @click="setPage(p)"
            >
              {{ p }}
            </button>
          </template>
          <button
            class="pg-btn"
            :disabled="currentPage === productStore.lastPage"
            @click="setPage(currentPage + 1)"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<style scoped>
/* 6. SỬA: ÉP PHÔNG CHỮ SANS-SERIF TOÀN BỘ TRANG */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif !important;
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
  color: #111827;
}

/* 7. GIỮ NGUYÊN TOÀN BỘ CSS CŨ CỦA BẠN DƯỚI ĐÂY */
.breadcrumb {
  padding: 14px 48px;
  font-size: 12.5px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 6px;
}
.breadcrumb a {
  color: #9ca3af;
}
.breadcrumb a:hover {
  color: #1565c0;
}
.sep {
  color: #d1d5db;
}
.bc-current {
  color: #111827;
  font-weight: 600;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 48px 20px;
}
.page-title {
  font-size: 26px;
  font-weight: 800;
}
.page-sub {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.sort-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sort-label {
  font-size: 13px;
  color: #6b7280;
}
.sort-select {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  min-width: 150px;
  background: #fff;
}
.sort-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.09);
  width: 170px;
  z-index: 200;
  overflow: hidden;
}
.sort-opt {
  padding: 10px 14px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.12s;
}
.sort-opt:hover {
  background: #f3f4f6;
}
.sort-opt.active {
  color: #1565c0;
  font-weight: 700;
  background: #eff6ff;
}

.body-wrap {
  display: flex;
  padding: 0 48px 56px;
  gap: 22px;
  align-items: flex-start;
}

.sidebar {
  width: 220px;
  min-width: 220px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px;
  position: sticky;
  top: 72px;
  max-height: calc(100vh - 90px);
  overflow-y: auto;
}
.sidebar::-webkit-scrollbar {
  width: 3px;
}
.sidebar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}

.filter-block {
  margin-bottom: 0;
}
.filter-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #374151;
  margin-bottom: 12px;
}

.cat-tree-item {
  margin-bottom: 1px;
}
.cat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  padding: 5px 6px;
  transition: background 0.13s;
  cursor: pointer;
}
.cat-row:hover {
  background: #f3f4f6;
}
.cat-row.cat-active {
  background: #eff6ff;
}
.cat-row-left {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 1;
  min-width: 0;
}
.cat-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  flex-shrink: 0;
  transition: all 0.15s;
}
.cat-dot.active {
  background: #1565c0;
  border-color: #1565c0;
}
.cat-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid #e5e7eb;
}
.cat-row-name {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cat-row.cat-active .cat-row-name {
  color: #1565c0;
}
.cat-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  color: #9ca3af;
  flex-shrink: 0;
  transition: background 0.13s;
}
.cat-toggle:hover {
  background: #e5e7eb;
  color: #374151;
}

.sub-list {
  margin: 2px 0 4px 20px;
  border-left: 2px solid #e5e7eb;
  padding-left: 10px;
}
.sub-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 7px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.13s;
}
.sub-row:hover {
  background: #f3f4f6;
}
.sub-row.sub-active {
  background: #eff6ff;
}
.sub-dash {
  font-size: 10px;
  color: #d1d5db;
  flex-shrink: 0;
}
.sub-name {
  font-size: 12.5px;
  color: #6b7280;
  flex: 1;
}
.sub-row.sub-active .sub-name {
  color: #1565c0;
  font-weight: 600;
}
.sub-check {
  font-size: 10px;
  color: #1565c0;
  font-weight: 700;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  padding: 4px 2px;
  border-radius: 6px;
  user-select: none;
  transition: background 0.12s;
  margin-bottom: 2px;
}
.check-row:hover {
  background: #f9fafb;
}
.custom-check {
  width: 17px;
  height: 17px;
  min-width: 17px;
  border-radius: 5px;
  border: 1.5px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.custom-check.checked {
  background: #1565c0;
  border-color: #1565c0;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}
.price-input-wrap {
  flex: 1;
  position: relative;
}
.price-currency {
  position: absolute;
  left: 7px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  color: #9ca3af;
  pointer-events: none;
}
.price-input {
  width: 100%;
  padding: 6px 4px 6px 17px;
  font-size: 11.5px;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  color: #111827;
  outline: none;
  -moz-appearance: textfield;
}
.price-input::-webkit-inner-spin-button,
.price-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
.price-input:focus {
  border-color: #1565c0;
}
.price-dash {
  font-size: 12px;
  color: #d1d5db;
  flex-shrink: 0;
}

.range-wrap {
  position: relative;
  height: 22px;
  margin: 6px 0;
}
.range-track {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  background: #e5e7eb;
  border-radius: 4px;
  pointer-events: none;
}
.range-fill {
  position: absolute;
  top: 0;
  height: 100%;
  background: #1565c0;
  border-radius: 4px;
}
.range-slider {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  pointer-events: none;
  height: 22px;
  margin: 0;
}
.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #1565c0;
  border: 2.5px solid #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  pointer-events: all;
  cursor: pointer;
}
.range-slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #1565c0;
  border: 2.5px solid #fff;
  pointer-events: all;
  cursor: pointer;
}

.price-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: #6b7280;
  margin-bottom: 10px;
}
.price-val.blue {
  color: #1565c0;
  font-weight: 700;
}

.price-quick {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.price-q-btn {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 9px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  color: #6b7280;
  transition: all 0.15s;
  background: #fff;
  cursor: pointer;
}
.price-q-btn:hover {
  border-color: #1565c0;
  color: #1565c0;
}
.price-q-btn.active {
  background: #1565c0;
  border-color: #1565c0;
  color: #fff;
}

.divider {
  height: 1px;
  background: #f3f4f6;
  margin: 14px 0;
}
.btn-apply {
  display: block;
  width: 100%;
  margin-top: 16px;
  background: #1565c0;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 11px;
  border-radius: 10px;
  transition: background 0.2s;
  cursor: pointer;
}
.btn-apply:hover {
  background: #1251a3;
}
.btn-reset {
  display: block;
  width: 100%;
  margin-top: 7px;
  color: #ef4444;
  font-size: 12px;
  font-weight: 600;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #fecaca;
  transition: background 0.2s;
  text-align: center;
  cursor: pointer;
}
.btn-reset:hover {
  background: #fef2f2;
}
.btn-reset.inline {
  width: auto;
  padding: 8px 20px;
}

.main-area {
  flex: 1;
  min-width: 0;
}
.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  align-items: center;
  margin-bottom: 16px;
}
.filter-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #eff6ff;
  color: #1565c0;
  border: 1px solid #bfdbfe;
  border-radius: 20px;
  font-size: 12.5px;
  font-weight: 600;
  padding: 4px 11px;
}
.filter-tag button {
  display: flex;
  align-items: center;
  color: #93c5fd;
  transition: color 0.15s;
}
.filter-tag button:hover {
  color: #1565c0;
}
.clear-all {
  font-size: 12px;
  font-weight: 700;
  color: #ef4444;
  cursor: pointer;
}
.clear-all:hover {
  text-decoration: underline;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px 0;
  color: #9ca3af;
  font-size: 14px;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.product-card {
  border: 0.5px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  transition: transform 0.2s;
  cursor: pointer;
  display: block;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: none;
}
.prod-img-wrap {
  position: relative;
  aspect-ratio: 1/1;
  background: #f3f4f6;
  overflow: hidden;
}
.prod-img-wrap img {
  transition: transform 0.3s;
}
.product-card:hover .prod-img-wrap img {
  transform: scale(1.05);
}
.card-badge {
  position: absolute;
  top: 7px;
  left: 7px;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  font-weight: 500;
  padding: 2px 7px;
  border-radius: 4px;
}
.like-btn {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}
.product-card:hover .like-btn {
  opacity: 1;
}
.like-btn.active {
  opacity: 1;
}
.prod-body {
  padding: 9px 11px 11px;
}
.prod-cat {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 3px;
}
.prod-name {
  font-size: 12.5px;
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 7px;
}
.prod-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.prod-price {
  font-size: 13px;
  font-weight: 500;
  color: #1565c0;
}
.prod-price.sale {
  color: #ef4444;
}
.old-price {
  font-size: 10px;
  color: #9ca3af;
  text-decoration: line-through;
  margin-top: 1px;
}
.cart-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  transition: background 0.15s;
  flex-shrink: 0;
}
.product-card:hover .cart-btn {
  background: #1565c0;
  color: #fff;
}

.skeleton {
  pointer-events: none;
}
.skel-img {
  background: #e5e7eb;
  aspect-ratio: 1/1;
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

.pagination {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  padding: 36px 0 8px;
}
.pg-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  background: #fff;
  cursor: pointer;
}
.pg-btn:hover:not(.dots):not(:disabled) {
  border-color: #1565c0;
  color: #1565c0;
}
.pg-btn.active {
  background: #1565c0;
  border-color: #1565c0;
  color: #fff;
}
.pg-btn.dots {
  border: none;
  cursor: default;
}
.pg-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>