<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-name">SportGear</span>
          <span class="brand-desc">Hệ thống Quản trị</span>
        </div>
      </div>

      <nav class="nav-menu">
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Trang chủ
        </a>
        <a href="#" class="nav-link active">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          Tổng quan
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          Quản lý Sản phẩm
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
          Danh mục
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          Đơn hàng
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Người dùng
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
          Mã giảm giá
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          Biến thể
        </a>
      </nav>

      <div class="sidebar-bottom">
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Đăng xuất
        </a>
      </div>
    </aside>

    <main class="main-content">
      <header class="header">
        <h1 class="page-title">Trang Quản Trị</h1>
        
        <div class="header-right">
          <div class="search-box">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" class="search-input" placeholder="Tìm kiếm dữ liệu..." />
          </div>

          <button class="icon-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </button>
          <button class="icon-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </button>

          <div class="user-profile">
            <div class="user-info">
              <span class="user-name">Nguyễn Văn A</span>
              <span class="user-role">Quản trị viên</span>
            </div>
            <img src="https://i.pravatar.cc/150?img=11" alt="Admin Avatar" class="user-avatar" />
          </div>
        </div>
      </header>

      <div class="content-body">
        
        <div class="stats-grid">
          <div class="stat-card" v-for="(stat, index) in stats" :key="index">
            <div class="stat-header">
              <div :class="['stat-icon-wrap', stat.colorClass]">
                <span v-html="stat.icon" class="stat-icon"></span>
              </div>
              <span :class="['stat-trend', stat.isPositive ? 'trend-up' : 'trend-down']">
                {{ stat.trend }}
              </span>
            </div>
            <div class="stat-info">
              <p class="stat-title">{{ stat.title }}</p>
              <h3 class="stat-value">{{ stat.value }}</h3>
            </div>
          </div>
        </div>

        <div class="chart-section">
          <div class="section-header">
            <div>
              <h2 class="section-title">Doanh thu 7 ngày qua</h2>
              <p class="section-subtitle">Thống kê chi tiết doanh thu theo tuần</p>
            </div>
            <select class="chart-select">
              <option>Tuần này</option>
              <option>Tuần trước</option>
            </select>
          </div>
          
          <div class="chart-container">
            <svg class="wave-chart" viewBox="0 0 1000 250" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="rgba(26, 115, 232, 0.15)" />
                  <stop offset="100%" stop-color="rgba(26, 115, 232, 0)" />
                </linearGradient>
              </defs>
              <path d="M 0 200 C 150 180, 250 80, 500 80 C 650 80, 700 180, 850 180 C 950 180, 980 120, 1000 100 L 1000 250 L 0 250 Z" fill="url(#waveGradient)" />
              <path d="M 0 200 C 150 180, 250 80, 500 80 C 650 80, 700 180, 850 180 C 950 180, 980 120, 1000 100" fill="none" stroke="#1a73e8" stroke-width="3" />
            </svg>
            <div class="chart-x-axis">
              <span>Thứ 2</span>
              <span>Thứ 3</span>
              <span>Thứ 4</span>
              <span>Thứ 5</span>
              <span>Thứ 6</span>
              <span>Thứ 7</span>
              <span>CN</span>
            </div>
          </div>
        </div>

        <div class="table-section">
          <div class="section-header">
            <h2 class="section-title">Đơn hàng gần đây</h2>
            <a href="#" class="view-all">Xem tất cả</a>
          </div>
          
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>MÃ ĐƠN</th>
                  <th>KHÁCH HÀNG</th>
                  <th>NGÀY ĐẶT</th>
                  <th>TỔNG TIỀN</th>
                  <th>TRẠNG THÁI</th>
                  <th>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(order, index) in recentOrders" :key="index">
                  <td class="font-bold">{{ order.id }}</td>
                  <td>
                    <div class="customer-cell">
                      <div :class="['avatar-initial', order.avatarColor]">{{ order.initials }}</div>
                      <span>{{ order.customer }}</span>
                    </div>
                  </td>
                  <td>{{ order.date }}</td>
                  <td class="font-bold">{{ order.total }}</td>
                  <td>
                    <span :class="['status-pill', order.statusClass]">{{ order.statusText }}</span>
                  </td>
                  <td>
                    <button class="action-btn">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Mock Data Stats
const stats = ref([
  {
    title: 'Doanh thu', value: '125.000.000đ', trend: '+12.5%', isPositive: true, colorClass: 'icon-blue',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
  },
  {
    title: 'Đơn hàng mới', value: '156', trend: '+8.2%', isPositive: true, colorClass: 'icon-purple',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>`
  },
  {
    title: 'Thành viên mới', value: '42', trend: '+5.4%', isPositive: true, colorClass: 'icon-orange',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>`
  },
  {
    title: 'Sản phẩm tồn kho', value: '890', trend: '-2.1%', isPositive: false, colorClass: 'icon-red',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>`
  }
]);

// Mock Data Orders
const recentOrders = ref([
  { id: '#ORD-2841', initials: 'NH', avatarColor: 'bg-blue-light', customer: 'Nguyễn Hoàng', date: '14/10/2023', total: '2.450.000đ', statusText: 'Đã giao', statusClass: 'status-success' },
  { id: '#ORD-2842', initials: 'MT', avatarColor: 'bg-orange-light', customer: 'Minh Tú', date: '14/10/2023', total: '1.200.000đ', statusText: 'Đang xử lý', statusClass: 'status-processing' },
  { id: '#ORD-2843', initials: 'KL', avatarColor: 'bg-purple-light', customer: 'Khánh Linh', date: '13/10/2023', total: '5.890.000đ', statusText: 'Chờ thanh toán', statusClass: 'status-pending' }
]);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.admin-layout {
  font-family: 'Inter', sans-serif;
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc; /* Nền xám rất nhạt */
  color: #111827;
}

/* --- SIDEBAR --- */
.sidebar {
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
}

.brand {
  height: 72px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px;
  border-bottom: 1px solid #f3f4f6;
}
.brand-icon { width: 32px; height: 32px; background-color: #1a73e8; color: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.brand-icon svg { width: 20px; height: 20px; }
.brand-text { display: flex; flex-direction: column; }
.brand-name { font-size: 18px; font-weight: 700; color: #1a73e8; line-height: 1.2; }
.brand-desc { font-size: 11px; color: #9ca3af; }

.nav-menu {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}
.nav-link:hover { background-color: #f3f4f6; color: #111827; }
.nav-link.active { background-color: #eff6ff; color: #1a73e8; font-weight: 600; }
.nav-icon { width: 20px; height: 20px; }

.sidebar-bottom {
  padding: 16px;
  border-top: 1px solid #f3f4f6;
}

/* --- MAIN CONTENT --- */
.main-content {
  flex: 1;
  margin-left: 260px; /* Bằng độ rộng sidebar */
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  height: 72px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 90;
}

.page-title { font-size: 20px; font-weight: 700; color: #111827; }

.header-right { display: flex; align-items: center; gap: 20px; }

.search-box { position: relative; width: 280px; }
.search-input { width: 100%; padding: 10px 16px 10px 40px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb; font-size: 14px; outline: none; transition: all 0.2s; }
.search-input:focus { background-color: #ffffff; border-color: #1a73e8; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #9ca3af; }

.icon-btn { background: none; border: none; color: #6b7280; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: background-color 0.2s; }
.icon-btn:hover { background-color: #f3f4f6; color: #111827; }
.icon-btn svg { width: 22px; height: 22px; }

.user-profile { display: flex; align-items: center; gap: 12px; padding-left: 20px; border-left: 1px solid #e5e7eb; cursor: pointer; }
.user-info { display: flex; flex-direction: column; text-align: right; }
.user-name { font-size: 14px; font-weight: 600; color: #111827; }
.user-role { font-size: 12px; color: #9ca3af; }
.user-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }

/* Dashboard Body */
.content-body { padding: 32px; display: flex; flex-direction: column; gap: 32px; }

/* Stats Grid */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.stat-card { background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.stat-header { display: flex; justify-content: space-between; align-items: flex-start; }
.stat-icon-wrap { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.stat-icon :deep(svg) { width: 20px; height: 20px; fill: none; }

/* Icon Colors */
.icon-blue { background-color: #eff6ff; color: #3b82f6; }
.icon-purple { background-color: #f5f3ff; color: #8b5cf6; }
.icon-orange { background-color: #fff7ed; color: #f97316; }
.icon-red { background-color: #fef2f2; color: #ef4444; }

.stat-trend { font-size: 12px; font-weight: 600; padding: 4px 8px; border-radius: 20px; }
.trend-up { color: #10b981; background-color: #ecfdf5; }
.trend-down { color: #ef4444; background-color: #fef2f2; }

.stat-info { display: flex; flex-direction: column; gap: 4px; }
.stat-title { font-size: 14px; color: #6b7280; font-weight: 500; }
.stat-value { font-size: 24px; font-weight: 700; color: #111827; }

/* Chart Section */
.chart-section { background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.section-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.section-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 4px; }
.section-subtitle { font-size: 13px; color: #6b7280; }
.chart-select { padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 13px; color: #4b5563; background-color: #f9fafb; outline: none; cursor: pointer; }

.chart-container { width: 100%; display: flex; flex-direction: column; gap: 12px; }
.wave-chart { width: 100%; height: 250px; }
.chart-x-axis { display: flex; justify-content: space-between; padding: 0 10px; font-size: 12px; color: #9ca3af; font-weight: 500; }

/* Table Section */
.table-section { background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.view-all { font-size: 14px; color: #1a73e8; font-weight: 600; text-decoration: none; }

.table-responsive { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; }
.data-table th { padding: 16px 12px; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb; }
.data-table td { padding: 16px 12px; font-size: 14px; color: #111827; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
.data-table tbody tr:last-child td { border-bottom: none; }
.font-bold { font-weight: 600; }

.customer-cell { display: flex; align-items: center; gap: 12px; font-weight: 500; }
.avatar-initial { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #1a73e8; }
.bg-blue-light { background-color: #eff6ff; color: #1a73e8; }
.bg-orange-light { background-color: #fff7ed; color: #ea580c; }
.bg-purple-light { background-color: #f5f3ff; color: #9333ea; }

.status-pill { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; }
.status-success { background-color: #ecfdf5; color: #10b981; }
.status-processing { background-color: #eff6ff; color: #3b82f6; }
.status-pending { background-color: #f3f4f6; color: #6b7280; }

.action-btn { background: none; border: none; color: #9ca3af; cursor: pointer; transition: color 0.2s; display: flex; align-items: center; justify-content: center; }
.action-btn:hover { color: #1a73e8; }
.action-btn svg { width: 20px; height: 20px; }

/* Responsive cơ bản cho màn hình nhỏ */
@media (max-width: 1200px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>