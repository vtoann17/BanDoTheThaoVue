<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuth} from "@/stores/auth";
import AdminLayout from "../../layouts/AdminLayout.vue";

const authStore = useAuth();
const { auth } = storeToRefs(authStore);

const stats = ref([]);
const orders = ref([]);
const chartFilter = ref("week");
const currentLabels = ref([]);
const currentValues = ref([]);
const loading = ref(true);

const svgPath = ref("");
const svgFill = ref("");
const svgWidth = 800;
const svgHeight = 220;

function buildPath() {
  const data = currentValues.value;
  if (!data || data.length === 0) return;
  
  const n = data.length;
  const max = Math.max(...data) || 1;
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = (svgWidth - 40) / (n - 1 || 1);

  const points = data.map((v, i) => [
    20 + i * stepX,
    20 + (1 - (v - min) / range) * (svgHeight - 40),
  ]);

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
  svgPath.value = d;
  svgFill.value = d + ` L ${last[0]},${svgHeight} L ${first[0]},${svgHeight} Z`;
}

const fetchDashboardData = async () => {
  loading.value = true;
  const token = auth.value?.token;
  
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/admin/dashboard?period=${chartFilter.value}`, {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    if (res.ok) {
      const result = await res.json();
      stats.value = result.stats;
      orders.value = result.orders;
      currentLabels.value = result.chart.labels;
      currentValues.value = result.chart.values;
      
      buildPath();
    }
  } catch (err) {
    console.error("Dashboard Fetch Error:", err);
  } finally {
    loading.value = false;
  }
};

function changeFilter(f) {
  chartFilter.value = f;
  fetchDashboardData();
}

onMounted(fetchDashboardData);
</script>

<template>
  <AdminLayout>
    <div class="dashboard">
      
      <div v-if="loading && stats.length === 0" class="loading-overlay">
        Đang cập nhật dữ liệu...
      </div>

      <div class="stats-grid">
        <div class="stat-card" v-for="s in stats" :key="s.label">
          <div class="stat-top">
            <div class="stat-icon" :style="{ background: s.bg }">
              <svg v-if="s.icon === 'revenue'" :style="{ color: s.color }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
              <svg v-if="s.icon === 'order'" :style="{ color: s.color }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <svg v-if="s.icon === 'user'" :style="{ color: s.color }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              <svg v-if="s.icon === 'product'" :style="{ color: s.color }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <span class="stat-change" :class="s.positive ? 'up' : 'down'">{{ s.change }}</span>
          </div>
          <div class="stat-label">{{ s.label }}</div>
          <div class="stat-value">{{ s.value }}</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <div>
            <h3>Biểu đồ doanh thu</h3>
            <p>Dữ liệu tổng hợp theo {{ chartFilter === 'week' ? 'tuần' : chartFilter === 'month' ? 'tháng' : 'năm' }}</p>
          </div>
          <div class="chart-filter">
            <select :value="chartFilter" @change="e => changeFilter(e.target.value)">
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
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
          <div class="chart-x-labels">
            <span v-for="(lbl, i) in currentLabels" :key="i" style="flex: 1; text-align: center;">
              {{ lbl }}
            </span>
          </div>
        </div>
      </div>

      <div class="orders-card">
        <div class="orders-header">
          <h3>Đơn hàng gần đây</h3>
          <router-link to="/orders" class="view-all">Xem tất cả</router-link>
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
                  <router-link :to="`/order/${o.id}`" class="btn-view" title="Xem chi tiết">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </router-link>
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

.dashboard { padding: 28px 32px 40px; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; flex-direction: column; gap: 24px; position: relative; }
.loading-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; font-weight: 600; color: #2563eb; }

/* ── STAT CARDS ── */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .stats-grid { grid-template-columns: 1fr; } }
.stat-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,.04); transition: all .2s; }
.stat-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.07); transform: translateY(-2px); }
.stat-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
.stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.stat-icon svg { width: 22px; height: 22px; }
.stat-change { font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 20px; }
.stat-change.up { color: #059669; background: #ecfdf5; }
.stat-change.down { color: #dc2626; background: #fef2f2; }
.stat-label { font-size: 13px; color: #6b7280; margin-bottom: 6px; }
.stat-value { font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -.5px; }

/* ── CHART ── */
.chart-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.chart-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.chart-header h3 { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 4px; }
.chart-header p { font-size: 13px; color: #6b7280; }
.chart-filter { position: relative; display: flex; align-items: center; }
.chart-filter select { appearance: none; padding: 8px 36px 8px 14px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; color: #374151; background: #fff; cursor: pointer; outline: none; }
.chart-filter .chevron { position: absolute; right: 10px; width: 16px; height: 16px; color: #6b7280; pointer-events: none; }
.chart-wrap { width: 100%; }
.chart-svg { width: 100%; height: 200px; display: block; }
.chart-x-labels { display: flex; padding: 12px 0 0; font-size: 11px; color: #9ca3af; gap: 4px; }

/* ── ORDERS ── */
.orders-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; box-shadow: 0 1px 4px rgba(0,0,0,.04); overflow: hidden; }
.orders-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px 16px; border-bottom: 1px solid #f3f4f6; }
.orders-header h3 { font-size: 16px; font-weight: 700; color: #111827; }
.view-all { font-size: 13px; font-weight: 600; color: #2563eb; text-decoration: none; }
.view-all:hover { text-decoration: underline; }
.table-responsive { overflow-x: auto; }
.orders-table { width: 100%; border-collapse: collapse; text-align: left; }
.orders-table th { padding: 12px 20px; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; border-bottom: 1px solid #f3f4f6; white-space: nowrap; }
.orders-table td { padding: 14px 20px; font-size: 14px; border-bottom: 1px solid #f9fafb; vertical-align: middle; white-space: nowrap; }
.order-id { font-weight: 700; color: #111827; }
.text-gray { color: #6b7280; }
.amount { font-weight: 600; color: #111827; }
.text-right { text-align: right; }
.customer-cell { display: flex; align-items: center; gap: 10px; }
.avatar { width: 32px; height: 32px; border-radius: 50%; background: #dbeafe; color: #2563eb; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

.badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.badge.delivered { background: #ecfdf5; color: #059669; }
.badge.shipping { background: #eff6ff; color: #2563eb; }
.badge.pending { background: #fffbeb; color: #d97706; }
.badge.cancelled { background: #fef2f2; color: #dc2626; }

.btn-view { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; color: #9ca3af; transition: all .2s; }
.btn-view:hover { background: #eff6ff; color: #2563eb; }
.btn-view svg { width: 18px; height: 18px; display: block; }
</style>