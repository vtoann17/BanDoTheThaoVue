<script setup>
import { ref, computed } from 'vue'

const brands = ref([
  { id: 1, name: 'Nike',          checked: true },
  { id: 2, name: 'Adidas',        checked: true },
  { id: 3, name: 'Puma',          checked: false },
  { id: 4, name: 'Under Armour',  checked: false },
])

const sizes = ['US 7','US 8','US 9','US 10','US 11','US 12']
const selectedSize = ref('US 8')

const colors = [
  { id:'black',  hex:'#111827' },
  { id:'gray',   hex:'#9CA3AF' },
  { id:'red',    hex:'#EF4444' },
  { id:'blue',   hex:'#3B82F6' },
  { id:'green',  hex:'#22C55E' },
  { id:'yellow', hex:'#F59E0B' },
]
const selectedColor = ref('black')

const priceMax = ref(10000000)

const activeFilters = ref(['Nike','Chạy bộ','Tập luyện'])
function removeFilter(f){ activeFilters.value = activeFilters.value.filter(x=>x!==f) }
function clearAll(){ activeFilters.value = [] }

const sortOptions = ['Mới nhất','Giá tăng dần','Giá giảm dần','Phổ biến nhất']
const sortSelected = ref('Mới nhất')
const showSort = ref(false)

const products = [
  { id:1,  badge:'Mới',      badgeColor:'#3B82F6', cat:'CHẠY BỘ',    name:'Nike Air Max Pro',            desc:'Đệm lót hiệu suất cao, êm ái từng bước chạy',           price:'3.250.000đ', oldPrice:null,        img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', liked:false },
  { id:2,  badge:null,       badgeColor:null,       cat:'PHỤ KIỆN',   name:'Elite Fitness Tracker',       desc:'Theo dõi nhịp tim và giấc ngủ chính xác',               price:'4.975.000đ', oldPrice:'6.225.000đ', img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', liked:false },
  { id:3,  badge:'Giảm 10%', badgeColor:'#3B82F6', cat:'TẬP LUYỆN',  name:'Adidas Speedflow',            desc:'Độ bám cực tốt cho các bài tập cường độ cao',            price:'2.250.000đ', oldPrice:null,        img:'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80', liked:false },
  { id:4,  badge:null,       badgeColor:null,       cat:'TRANG PHỤC', name:'Bộ đồ tập Zenith',            desc:'Chất liệu cao cấp, co giãn 4 chiều',                    price:'1.875.000đ', oldPrice:null,        img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80', liked:false },
  { id:5,  badge:null,       badgeColor:null,       cat:'BÓNG RỔ',   name:'Court King IV',               desc:'Hỗ trợ cổ chân tối đa, đệm bám đột phá',               price:'3.875.000đ', oldPrice:null,        img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', liked:false },
  { id:6,  badge:null,       badgeColor:null,       cat:'TRANG PHỤC', name:'Áo vest chạy bộ AeroShift',  desc:'Thoáng khí, nhẹ như không mặc',                         price:'1.125.000đ', oldPrice:null,        img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', liked:false },
]

const likedMap = ref({})
function toggleLike(id){ likedMap.value[id] = !likedMap.value[id] }

const currentPage = ref(1)
const pages = [1,2,3,'...',12]
</script>

<template>
  <div class="app">

    <!-- ══ NAVBAR ══ -->
    <nav class="navbar">
      <div class="nav-left">
        <div class="brand">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#1D4ED8"/>
            <path d="M6 24L14 8l4 8 4-8 8 16" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>EliteSport</span>
        </div>
        <a href="#" class="nav-link">Cửa hàng</a>
        <a href="#" class="nav-link">Đội ngũ</a>
        <a href="#" class="nav-link sale-link">Giảm giá</a>
      </div>
      <div class="nav-right">
        <div class="search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Tìm kiếm sản phẩm..."/>
        </div>
        <button class="icon-btn pos-rel">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span class="nav-badge">2</span>
        </button>
        <button class="icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
      </div>
    </nav>

    <!-- ══ BREADCRUMB ══ -->
    <div class="breadcrumb">
      <a href="#">Trang chủ</a>
      <span class="sep">/</span>
      <a href="#">Trang phục</a>
      <span class="sep">/</span>
      <span class="bc-current">Giày thể thao</span>
    </div>

    <!-- ══ PAGE HEADER ══ -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Giày Thể Thao &amp; Đồ Tập</h1>
        <p class="page-sub">Khám phá 1.240 sản phẩm hiệu suất đỉnh cao cho hành trình của bạn</p>
      </div>
      <div class="sort-wrap">
        <span class="sort-label">Sắp xếp:</span>
        <div class="sort-select" @click="showSort=!showSort">
          <span>{{ sortSelected }}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          <div class="sort-dropdown" v-if="showSort">
            <div v-for="o in sortOptions" :key="o" class="sort-opt" :class="{active:o===sortSelected}" @click.stop="sortSelected=o;showSort=false">{{ o }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ BODY ══ -->
    <div class="body-wrap">

      <!-- ── SIDEBAR ── -->
      <aside class="sidebar">

        <!-- Brand -->
        <div class="filter-block">
          <div class="filter-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            THƯƠNG HIỆU
          </div>
          <div v-for="b in brands" :key="b.id" class="check-row" @click="b.checked=!b.checked">
            <div class="custom-check" :class="{checked:b.checked}">
              <svg v-if="b.checked" width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <span>{{ b.name }}</span>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Size -->
        <div class="filter-block">
          <div class="filter-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            KÍCH CỠ
          </div>
          <div class="size-grid">
            <button
              v-for="s in sizes" :key="s"
              class="size-btn"
              :class="{selected: selectedSize===s}"
              @click="selectedSize=s"
            >{{ s }}</button>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Color -->
        <div class="filter-block">
          <div class="filter-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 10 10 0 0 0 0-20"/></svg>
            MÀU SẮC
          </div>
          <div class="color-row">
            <button
              v-for="c in colors" :key="c.id"
              class="color-dot"
              :class="{selected: selectedColor===c.id}"
              :style="{background: c.hex}"
              @click="selectedColor=c.id"
            ></button>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Price -->
        <div class="filter-block">
          <div class="filter-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            KHOẢNG GIÁ
          </div>
          <div class="price-range">
            <input type="range" min="0" max="10000000" v-model="priceMax" class="range-slider"/>
            <div class="price-labels">
              <span>0đ</span>
              <span class="price-max">{{ Number(priceMax).toLocaleString('vi-VN') }}đ</span>
            </div>
          </div>
        </div>

        <button class="btn-apply">ÁP DỤNG BỘ LỌC</button>
      </aside>

      <!-- ── MAIN ── -->
      <main class="main-area">

        <!-- Active filters -->
        <div class="active-filters" v-if="activeFilters.length">
          <span v-for="f in activeFilters" :key="f" class="filter-tag">
            {{ f }}
            <button @click="removeFilter(f)">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            </button>
          </span>
          <button class="clear-all" @click="clearAll">XÓA TẤT CẢ</button>
        </div>

        <!-- Products grid -->
        <div class="products-grid">
          <div v-for="p in products" :key="p.id" class="product-card">
            <div class="card-img-wrap">
              <img :src="p.img" :alt="p.name" loading="lazy"/>
              <span v-if="p.badge" class="card-badge" :style="{background: p.badgeColor}">{{ p.badge }}</span>
              <button class="like-btn" @click="toggleLike(p.id)" :class="{liked: likedMap[p.id]}">
                <svg width="16" height="16" viewBox="0 0 24 24" :fill="likedMap[p.id]?'#EF4444':'none'" stroke="#374151" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>
            <div class="card-body">
              <p class="card-cat">{{ p.cat }}</p>
              <p class="card-name">{{ p.name }}</p>
              <p class="card-desc">{{ p.desc }}</p>
              <div class="card-foot">
                <div class="price-block">
                  <span class="card-price">{{ p.price }}</span>
                  <span v-if="p.oldPrice" class="old-price">{{ p.oldPrice }}</span>
                </div>
                <button class="add-cart-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button class="pg-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <template v-for="p in pages" :key="p">
            <button
              class="pg-btn"
              :class="{active: p===currentPage, dots: p==='...'}"
              @click="typeof p==='number' && (currentPage=p)"
            >{{ p }}</button>
          </template>
          <button class="pg-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </main>
    </div>

    <!-- ══ FOOTER TOP ══ -->
    <div class="footer-top">
      <div class="ft-col">
        <h4>MUA SẮM</h4>
        <a href="#">Giày thể thao</a>
        <a href="#">Quần áo tập</a>
        <a href="#">Phụ kiện gym</a>
        <a href="#">Hàng mới về</a>
      </div>
      <div class="ft-col">
        <h4>HỖ TRỢ</h4>
        <a href="#">Giao hàng tận nơi</a>
        <a href="#">Chính sách đổi trả</a>
        <a href="#">Tra cứu đơn hàng</a>
        <a href="#">Liên hệ chúng tôi</a>
      </div>
      <div class="ft-col">
        <h4>CÔNG TY</h4>
        <a href="#">Về EliteSport</a>
        <a href="#">Cơ hội nghề nghiệp</a>
        <a href="#">Chính sách bảo mật</a>
        <a href="#">Điều khoản sử dụng</a>
      </div>
      <div class="ft-col newsletter-col">
        <h4>BẢN TIN</h4>
        <p>Nhận ưu đãi sớm nhất và tin tức về sản phẩm mới hàng tuần.</p>
        <div class="newsletter-row">
          <input type="email" placeholder="Email của bạn"/>
          <button class="btn-subscribe">ĐĂNG KÝ</button>
        </div>
      </div>
    </div>

    <!-- ══ FOOTER BOTTOM ══ -->
    <div class="footer-bottom">
      <div class="footer-brand-sm">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#1D4ED8"/><path d="M6 24L14 8l4 8 4-8 8 16" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>EliteSport</span>
      </div>
      <span class="copyright">© 2024 ELITESPORT. BẢN QUYỀN ĐƯỢC BẢO LƯU.</span>
      <div class="footer-icons">
        <button class="fi-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </button>
        <button class="fi-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
        <button class="fi-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ── RESET ── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
a{text-decoration:none;color:inherit}
button{font-family:inherit;cursor:pointer;border:none;background:none}
input{font-family:inherit}
img{display:block;width:100%;height:100%;object-fit:cover}

.app{
  min-height:100vh;
  background:#fff;
  font-family:'Be Vietnam Pro',sans-serif;
  color:#111827;
}

/* ══ NAVBAR ══ */
.navbar{
  display:flex;align-items:center;justify-content:space-between;
  height:60px;padding:0 32px;
  background:#fff;border-bottom:1px solid #E5E7EB;
  position:sticky;top:0;z-index:200;
}
.nav-left{display:flex;align-items:center;gap:28px}
.brand{display:flex;align-items:center;gap:8px;font-weight:800;font-size:17px;color:#1D4ED8}
.nav-link{font-size:14px;font-weight:500;color:#374151}
.nav-link:hover{color:#1D4ED8}
.sale-link{color:#EF4444;font-weight:600}
.nav-right{display:flex;align-items:center;gap:12px}
.search-box{
  display:flex;align-items:center;gap:8px;
  background:#F9FAFB;border:1px solid #E5E7EB;border-radius:24px;
  padding:7px 16px;width:220px;
}
.search-box input{border:none;background:transparent;font-size:13px;color:#374151;width:100%;outline:none}
.search-box input::placeholder{color:#9CA3AF}
.icon-btn{display:flex;align-items:center;justify-content:center;padding:4px}
.pos-rel{position:relative}
.nav-badge{
  position:absolute;top:-4px;right:-4px;
  background:#1D4ED8;color:#fff;font-size:9px;font-weight:700;
  width:15px;height:15px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
}

/* ══ BREADCRUMB ══ */
.breadcrumb{
  padding:14px 32px;font-size:12.5px;color:#9CA3AF;
  display:flex;align-items:center;gap:6px;
}
.breadcrumb a:hover{color:#1D4ED8}
.sep{color:#D1D5DB}
.bc-current{color:#111827;font-weight:600}

/* ══ PAGE HEADER ══ */
.page-header{
  display:flex;justify-content:space-between;align-items:flex-end;
  padding:0 32px 24px;
}
.page-title{font-size:28px;font-weight:800;color:#111827;line-height:1.1}
.page-sub{font-size:13.5px;color:#6B7280;margin-top:6px}
.sort-wrap{display:flex;align-items:center;gap:8px;font-size:13.5px}
.sort-label{color:#6B7280}
.sort-select{
  position:relative;display:flex;align-items:center;gap:6px;
  border:1px solid #E5E7EB;border-radius:8px;padding:7px 12px;
  font-size:13.5px;font-weight:600;cursor:pointer;background:#fff;
  min-width:140px;
}
.sort-dropdown{
  position:absolute;top:calc(100%+4px);right:0;
  background:#fff;border:1px solid #E5E7EB;border-radius:8px;
  box-shadow:0 8px 24px rgba(0,0,0,.08);
  width:160px;z-index:100;overflow:hidden;
}
.sort-opt{padding:10px 14px;font-size:13px;cursor:pointer}
.sort-opt:hover{background:#F3F4F6}
.sort-opt.active{color:#1D4ED8;font-weight:600}

/* ══ BODY LAYOUT ══ */
.body-wrap{display:flex;gap:0;padding:0 32px;align-items:flex-start}

/* ══ SIDEBAR ══ */
.sidebar{
  width:210px;min-width:210px;
  background:#fff;border:1px solid #E5E7EB;border-radius:14px;
  padding:20px;margin-right:24px;
  position:sticky;top:76px;
}
.filter-block{margin-bottom:0}
.filter-title{
  display:flex;align-items:center;gap:7px;
  font-size:11.5px;font-weight:800;letter-spacing:.6px;color:#111827;
  margin-bottom:14px;
}
.check-row{
  display:flex;align-items:center;gap:10px;
  font-size:13.5px;color:#374151;cursor:pointer;
  margin-bottom:10px;user-select:none;
}
.check-row:last-child{margin-bottom:0}
.custom-check{
  width:18px;height:18px;border-radius:5px;
  border:1.5px solid #D1D5DB;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;transition:all .15s;
}
.custom-check.checked{background:#1D4ED8;border-color:#1D4ED8}
.divider{height:1px;background:#F3F4F6;margin:16px 0}

.size-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
.size-btn{
  padding:7px 4px;font-size:12px;font-weight:600;color:#374151;
  border:1.5px solid #E5E7EB;border-radius:7px;
  background:#fff;transition:all .15s;
}
.size-btn:hover{border-color:#1D4ED8;color:#1D4ED8}
.size-btn.selected{background:#1D4ED8;border-color:#1D4ED8;color:#fff}

.color-row{display:flex;gap:9px;flex-wrap:wrap}
.color-dot{
  width:28px;height:28px;border-radius:50%;border:2px solid transparent;
  transition:transform .15s,box-shadow .15s;cursor:pointer;
}
.color-dot:hover{transform:scale(1.12)}
.color-dot.selected{box-shadow:0 0 0 2px #fff,0 0 0 4px #1D4ED8}

.price-range{margin-top:4px}
.range-slider{
  width:100%;accent-color:#1D4ED8;cursor:pointer;
  height:4px;
}
.price-labels{display:flex;justify-content:space-between;font-size:12px;color:#6B7280;margin-top:8px}
.price-max{color:#1D4ED8;font-weight:700}

.btn-apply{
  display:block;width:100%;margin-top:20px;
  background:#1D4ED8;color:#fff;
  font-size:13px;font-weight:700;letter-spacing:.5px;
  padding:12px;border-radius:10px;
  transition:background .2s;
}
.btn-apply:hover{background:#1E40AF}

/* ══ MAIN ══ */
.main-area{flex:1;min-width:0}

.active-filters{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:20px}
.filter-tag{
  display:flex;align-items:center;gap:6px;
  background:#EFF6FF;color:#1D4ED8;
  border:1px solid #BFDBFE;border-radius:20px;
  font-size:13px;font-weight:600;padding:5px 12px;
}
.filter-tag button{display:flex;align-items:center;color:#1D4ED8;padding:0}
.filter-tag button:hover{color:#1E3A8A}
.clear-all{font-size:12.5px;font-weight:700;color:#EF4444;letter-spacing:.4px}
.clear-all:hover{text-decoration:underline}

/* ══ PRODUCT GRID ══ */
.products-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}

.product-card{
  border:1px solid #E5E7EB;border-radius:14px;overflow:hidden;
  background:#fff;cursor:pointer;
  transition:transform .25s,box-shadow .25s;
}
.product-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.09)}

.card-img-wrap{
  position:relative;aspect-ratio:1/1;
  background:#F3F4F6;overflow:hidden;
}
.card-img-wrap img{transition:transform .35s}
.product-card:hover .card-img-wrap img{transform:scale(1.05)}

.card-badge{
  position:absolute;top:10px;left:10px;
  color:#fff;font-size:11px;font-weight:700;
  padding:3px 10px;border-radius:20px;letter-spacing:.3px;
}
.like-btn{
  position:absolute;top:10px;right:10px;
  width:32px;height:32px;border-radius:50%;
  background:rgba(255,255,255,.92);
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 1px 4px rgba(0,0,0,.12);
  transition:background .2s;
}
.like-btn:hover{background:#fff}
.like-btn.liked svg{stroke:#EF4444}

.card-body{padding:14px}
.card-cat{font-size:10.5px;font-weight:700;letter-spacing:1px;color:#6B7280;text-transform:uppercase;margin-bottom:4px}
.card-name{font-size:15px;font-weight:700;color:#111827;margin-bottom:4px}
.card-desc{font-size:12.5px;color:#9CA3AF;line-height:1.5;margin-bottom:12px}

.card-foot{display:flex;justify-content:space-between;align-items:center}
.price-block{display:flex;flex-direction:column;gap:2px}
.card-price{font-size:16px;font-weight:800;color:#111827}
.old-price{font-size:12px;color:#9CA3AF;text-decoration:line-through}

.add-cart-btn{
  width:36px;height:36px;border-radius:50%;
  background:#111827;color:#fff;
  display:flex;align-items:center;justify-content:center;
  transition:background .2s;
  flex-shrink:0;
}
.add-cart-btn:hover{background:#1D4ED8}

/* ══ PAGINATION ══ */
.pagination{display:flex;align-items:center;gap:6px;justify-content:center;padding:40px 0 48px}
.pg-btn{
  width:38px;height:38px;border-radius:50%;border:1px solid #E5E7EB;
  font-size:14px;font-weight:600;color:#374151;
  display:flex;align-items:center;justify-content:center;
  transition:all .15s;cursor:pointer;background:#fff;
}
.pg-btn:hover:not(.dots){border-color:#1D4ED8;color:#1D4ED8}
.pg-btn.active{background:#1D4ED8;border-color:#1D4ED8;color:#fff}
.pg-btn.dots{border:none;cursor:default;font-size:16px}

/* ══ FOOTER TOP ══ */
.footer-top{
  background:#F9FAFB;border-top:1px solid #E5E7EB;
  padding:52px 32px;
  display:grid;grid-template-columns:1fr 1fr 1fr 1.5fr;gap:40px;
}
.ft-col{display:flex;flex-direction:column;gap:10px}
.ft-col h4{font-size:12px;font-weight:800;letter-spacing:.7px;color:#111827;margin-bottom:4px}
.ft-col a{font-size:13px;color:#6B7280}
.ft-col a:hover{color:#1D4ED8}
.newsletter-col p{font-size:13px;color:#6B7280;line-height:1.6;margin-bottom:4px}
.newsletter-row{display:flex;gap:0;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;margin-top:2px}
.newsletter-row input{flex:1;border:none;padding:9px 12px;font-size:13px;outline:none;background:#fff}
.btn-subscribe{
  background:#1D4ED8;color:#fff;
  font-size:11.5px;font-weight:700;letter-spacing:.4px;
  padding:9px 14px;white-space:nowrap;transition:background .2s;
}
.btn-subscribe:hover{background:#1E40AF}

/* ══ FOOTER BOTTOM ══ */
.footer-bottom{
  background:#fff;border-top:1px solid #E5E7EB;
  padding:16px 32px;
  display:flex;justify-content:space-between;align-items:center;
}
.footer-brand-sm{display:flex;align-items:center;gap:8px;font-weight:800;font-size:15px;color:#1D4ED8}
.copyright{font-size:12px;color:#9CA3AF}
.footer-icons{display:flex;gap:10px}
.fi-btn{
  width:30px;height:30px;border-radius:7px;
  border:1px solid #E5E7EB;
  display:flex;align-items:center;justify-content:center;
  color:#6B7280;transition:all .15s;
}
.fi-btn:hover{border-color:#1D4ED8;color:#1D4ED8}
</style>