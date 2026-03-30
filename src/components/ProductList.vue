<script setup>
const products = [
  { id: 1, cat: 'CHẠY BỘ CHUYÊN NGHIỆP', name: 'SpeedMax Elite 5',  price: '4.500.000₫', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
  { id: 2, cat: 'ĐỒ TẬP LUYỆN',          name: 'Aero-Cool Tee',     price: '1.100.000₫', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
  { id: 3, cat: 'BÓNG RỔ',               name: 'Hoops Pro VII',     price: '3.250.000₫', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80' },
  { id: 4, cat: 'TRANG THIẾT BỊ',        name: 'Pro Match Ball',    price: '1.500.000₫', img: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&q=80' },
]
</script>
<template>
    <section class="section">
    <div class="section-head">
      <div>
        <h2 class="section-title">Hàng Mới Về</h2>
        <div class="title-bar"></div>
      </div>
      <a href="#" class="see-all">Xem tất cả &nbsp;→</a>
    </div>

    <div class="products-grid">
      <div v-for="p in products" :key="p.id" class="product-card">
        <div class="prod-img-wrap">
          <img :src="p.img" :alt="p.name" loading="lazy"/>
        </div>
        <div class="prod-body">
          <p class="prod-cat">{{ p.cat }}</p>
          <p class="prod-name">{{ p.name }}</p>
          <div class="prod-foot">
            <span class="prod-price">{{ p.price }}</span>
            <button class="cart-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
.section { padding: 56px 48px; }

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
  background: #1565C0;
  border-radius: 2px;
  margin-top: 7px;
}

.see-all {
  color: #1565C0;
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
}
.see-all:hover { text-decoration: underline; }
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  transition: transform .25s, box-shadow .25s;
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0,0,0,.09);
}

.prod-img-wrap {
  aspect-ratio: 1 / 1;
  background: #F3F4F6;
  overflow: hidden;
}
.prod-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .35s;
}
.product-card:hover .prod-img-wrap img { transform: scale(1.05); }

.prod-body { padding: 14px 14px 14px; }

.prod-cat {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #9CA3AF;
  margin-bottom: 4px;
}

.prod-name {
  font-size: 14.5px;
  font-weight: 600;
  color: #111827;
}

.prod-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.prod-price {
  color: #1565C0;
  font-weight: 700;
  font-size: 14.5px;
}

</style>