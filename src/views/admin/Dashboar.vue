<script setup>
import { ref, onMounted } from "vue";
import AdminLayout from "../../layouts/AdminLayout.vue";

// ── Stat cards ──────────────────────────────────────────────
const stats = [
  {
    label: "Doanh thu",
    value: "125.000.000₫",
    change: "+12.5%",
    positive: true,
    icon: "revenue",
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    label: "Đơn hàng mới",
    value: "156",
    change: "+8.2%",
    positive: true,
    icon: "order",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    label: "Thành viên mới",
    value: "42",
    change: "+5.4%",
    positive: true,
    icon: "user",
    color: "#059669",
    bg: "#ecfdf5",
  },
  {
    label: "Sản phẩm tồn kho",
    value: "890",
    change: "-2.1%",
    positive: false,
    icon: "product",
    color: "#dc2626",
    bg: "#fef2f2",
  },
];

// ── Chart data ───────────────────────────────────────────────
const chartFilter = ref("Tuần này");
const chartData = {
  "Tuần này": [18, 42, 38, 52, 34, 78, 65],
  "Tháng này": [55, 62, 48, 71, 60, 85, 70, 90, 65, 78, 55, 88, 72, 95, 80, 68, 75, 82, 70, 88, 65, 90, 78, 85, 72, 68, 80, 75, 82, 70],
  "Năm nay": [320, 410, 380, 520, 480, 610, 570, 650, 590, 680, 720, 810],
};
const chartLabels = {
  "Tuần này": ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"],
  "Tháng này": Array.from({ length: 30 }, (_, i) => `${i + 1}`),
  "Năm nay": ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"],
};

// ── Orders ───────────────────────────────────────────────────
const orders = [
  { id: "ORD-2841", name: "Nguyễn Hoàng", initials: "NH", date: "14/10/2023", amount: "2.450.000₫", status: "Đã giao", statusClass: "delivered" },
  { id: "ORD-2840", name: "Trần Thị Mai",  initials: "TM", date: "14/10/2023", amount: "1.200.000₫", status: "Đang giao", statusClass: "shipping" },
  { id: "ORD-2839", name: "Lê Văn Tú",    initials: "LT", date: "13/10/2023", amount: "3.750.000₫", status: "Chờ xử lý", statusClass: "pending" },
  { id: "ORD-2838", name: "Phạm Thùy",    initials: "PT", date: "13/10/2023", amount: "890.000₫",  status: "Đã hủy",   statusClass: "cancelled" },
  { id: "ORD-2837", name: "Hoàng Nam",    initials: "HN", date: "12/10/2023", amount: "5.100.000₫", status: "Đã giao",  statusClass: "delivered" },
];

// ── SVG Sparkline ────────────────────────────────────────────
const svgPath = ref("");
const svgFill = ref("");
const svgWidth = 800;
const svgHeight = 220;
const svgPadX = 20;
const svgPadY = 20;

function buildPath(key) {
  const data = chartData[key];
  const n = data.length;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = (svgWidth - svgPadX * 2) / (n - 1);

  const points = data.map((v, i) => [
    svgPadX + i * stepX,
    svgPadY + (1 - (v - min) / range) * (svgHeight - svgPadY * 2),
  ]);

  // Smooth bezier
  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const cp1x = px + (cx - px) * 0.5;
    const cp2x = px + (cx - px) * 0.5;
    d += ` C ${cp1x},${py} ${cp2x},${cy} ${cx},${cy}`;
  }

  const last = points[points.length - 1];
  const first = points[0];
  const fill = d + ` L ${last[0]},${svgHeight} L ${first[0]},${svgHeight} Z`;

  svgPath.value = d;
  svgFill.value = fill;
}

function changeFilter(f) {
  chartFilter.value = f;
  buildPath(f);
}

onMounted(() => buildPath("Tuần này"));
</script>

<template>
  <AdminLayout>
    <div class="dashboard">

      <!-- ── Stat cards ── -->
      <div class="stats-grid">
        <div class="stat-card" v-for="s in stats" :key="s.label">
          <div class="stat-top">
            <div class="stat-icon" :style="{ background: s.bg }">
              <!-- Revenue -->
              <svg v-if="s.icon === 'revenue'" :style="{ color: s.color }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
              <!-- Order -->
              <svg v-if="s.icon === 'order'" :style="{ color: s.color }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <!-- User -->
              <svg v-if="s.icon === 'user'" :style="{ color: s.color }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              <!-- Product -->
              <svg v-if="s.icon === 'product'" :style="{ color: s.color }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <span class="stat-change" :class="s.positive ? 'up' : 'down'">{{ s.change }}</span>
          </div>
          <div class="stat-label">{{ s.label }}</div>
          <div class="stat-value">{{ s.value }}</div>
        </div>
      </div>

      <!-- ── Revenue Chart ── -->
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <h3>Doanh thu 7 ngày qua</h3>
            <p>Thống kê chi tiết doanh thu theo tuần</p>
          </div>
          <div class="chart-filter">
            <select :value="chartFilter" @change="e => changeFilter(e.target.value)">
              <option>Tuần này</option>
              <option>Tháng này</option>
              <option>Năm nay</option>
            </select>
            <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>

        <div class="chart-wrap">
          <svg :viewBox="`0 0 ${svgWidth} ${svgHeight}`" preserveAspectRatio="none" class="chart-svg">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#2563eb" stop-opacity="0.18"/>
                <stop offset="100%" stop-color="#2563eb" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <path :d="svgFill" fill="url(#chartGrad)" />
            <path :d="svgPath" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <!-- X labels -->
          <div class="chart-x-labels">
            <span
              v-for="(lbl, i) in chartLabels[chartFilter]"
              :key="i"
              :style="{ flex: 1, textAlign: i === 0 ? 'left' : i === chartLabels[chartFilter].length - 1 ? 'right' : 'center' }"
            >{{ lbl }}</span>
          </div>
        </div>
      </div>

      <!-- ── Recent Orders ── -->
      <div class="orders-card">
        <div class="orders-header">
          <h3>Đơn hàng gần đây</h3>
          <a href="#" class="view-all">Xem tất cả</a>
        </div>
        <div class="table-responsive">
          <table class="orders-table">
            <thead>
              <tr>
                <th>MÃ ĐƠN</th>
                <th>KHÁCH HÀNG</th>
                <th>NGÀY ĐẶT</th>
                <th>TỔNG TIỀN</th>
                <th>TRẠNG THÁI</th>
                <th class="text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in orders" :key="o.id">
                <td class="order-id">#{{ o.id }}</td>
                <td>
                  <div class="customer-cell">
                    <div class="avatar">{{ o.initials }}</div>
                    <span>{{ o.name }}</span>
                  </div>
                </td>
                <td class="text-gray">{{ o.date }}</td>
                <td class="amount">{{ o.amount }}</td>
                <td>
                  <span class="badge" :class="o.statusClass">{{ o.status }}</span>
                </td>
                <td class="text-right">
                  <button class="btn-view" title="Xem chi tiết">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.dashboard {
  padding: 28px 32px 40px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ── STAT CARDS ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
@media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .stats-grid { grid-template-columns: 1fr; } }

.stat-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
  transition: box-shadow .2s, transform .2s;
}
.stat-card:hover {
  box-shadow: 0 6px 20px rgba(0,0,0,.07);
  transform: translateY(-2px);
}

.stat-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}
.stat-icon {
  width: 44px; height: 44px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.stat-icon svg { width: 22px; height: 22px; }

.stat-change {
  font-size: 12px; font-weight: 700;
  padding: 3px 8px; border-radius: 20px;
}
.stat-change.up   { color: #059669; background: #ecfdf5; }
.stat-change.down { color: #dc2626; background: #fef2f2; }

.stat-label {
  font-size: 13px; color: #6b7280; margin-bottom: 6px;
}
.stat-value {
  font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -.5px;
}

/* ── CHART ── */
.chart-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}

.chart-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 20px;
}
.chart-header h3 { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 4px; }
.chart-header p  { font-size: 13px; color: #6b7280; }

.chart-filter {
  position: relative;
  display: flex; align-items: center;
}
.chart-filter select {
  appearance: none;
  padding: 8px 36px 8px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  background: #fff;
  font-family: inherit;
  cursor: pointer;
  outline: none;
}
.chart-filter .chevron {
  position: absolute; right: 10px;
  width: 16px; height: 16px;
  color: #6b7280; pointer-events: none;
}

.chart-wrap { width: 100%; }
.chart-svg {
  width: 100%;
  height: 200px;
  display: block;
}
.chart-x-labels {
  display: flex;
  padding: 8px 0 0;
  font-size: 12px;
  color: #9ca3af;
}

/* ── ORDERS ── */
.orders-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
  overflow: hidden;
}

.orders-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
}
.orders-header h3 { font-size: 16px; font-weight: 700; color: #111827; }
.view-all {
  font-size: 13px; font-weight: 600; color: #2563eb;
  text-decoration: none;
}
.view-all:hover { text-decoration: underline; }

.table-responsive { overflow-x: auto; }
.orders-table {
  width: 100%; border-collapse: collapse; text-align: left;
}
.orders-table th {
  padding: 12px 20px;
  font-size: 11px; font-weight: 700;
  color: #9ca3af; text-transform: uppercase; letter-spacing: .05em;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
}
.orders-table td {
  padding: 14px 20px;
  font-size: 14px;
  border-bottom: 1px solid #f9fafb;
  vertical-align: middle;
  white-space: nowrap;
}
.orders-table tbody tr:last-child td { border-bottom: none; }
.orders-table tbody tr:hover { background: #fafafa; }

.order-id { font-weight: 700; color: #111827; }
.text-gray { color: #6b7280; }
.amount    { font-weight: 600; color: #111827; }
.text-right { text-align: right; }

.customer-cell {
  display: flex; align-items: center; gap: 10px;
}
.avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: #dbeafe;
  color: #2563eb;
  font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* Status badges */
.badge {
  display: inline-block;
  padding: 4px 10px; border-radius: 20px;
  font-size: 12px; font-weight: 600;
}
.badge.delivered  { background: #ecfdf5; color: #059669; }
.badge.shipping   { background: #eff6ff; color: #2563eb; }
.badge.pending    { background: #fffbeb; color: #d97706; }
.badge.cancelled  { background: #fef2f2; color: #dc2626; }

.btn-view {
  background: none; border: none; cursor: pointer;
  padding: 6px; border-radius: 6px; color: #9ca3af;
  transition: background .2s, color .2s;
}
.btn-view:hover { background: #eff6ff; color: #2563eb; }
.btn-view svg { width: 18px; height: 18px; display: block; }
</style>