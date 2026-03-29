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
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          Dashboard
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          Sản phẩm
        </a>
        <a href="#" class="nav-link">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
          Danh mục
        </a>
        <a href="#" class="nav-link active">
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
        <h1 class="page-title-top">Trang Quản Trị</h1>
        
        <div class="header-right">
          <div class="search-box-top">
            <svg class="search-icon-top" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" class="search-input-top" placeholder="Tìm kiếm dữ liệu..." />
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
        
        <div class="page-header">
          <h1 class="page-title">Quản lý đơn hàng</h1>
          <button class="btn-export">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Xuất file Excel
          </button>
        </div>

        <div class="status-tabs">
          <button v-for="(tab, index) in tabs" :key="index" :class="['tab-item', { active: tab.active }]">
            {{ tab.name }} ({{ tab.count }})
          </button>
        </div>

        <div class="filter-bar">
          <div class="search-box filter-search">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" class="search-input" placeholder="Tìm theo Mã đơn / Tên khách hàng..." />
          </div>

          <div class="filter-actions">
            <div class="date-picker">
              <svg class="date-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <input type="text" class="date-input" placeholder="Chọn khoảng ngày" />
            </div>
            <button class="btn-filter">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              Lọc khác
            </button>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>MÃ ĐƠN</th>
                <th>KHÁCH HÀNG</th>
                <th>NGÀY ĐẶT</th>
                <th>TỔNG TIỀN</th>
                <th>PHƯƠNG THỨC</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(order, index) in orders" :key="index">
                <td class="font-bold text-blue">{{ order.id }}</td>
                <td>
                  <div class="customer-cell">
                    <div class="avatar-initial">{{ order.initials }}</div>
                    <div class="customer-info">
                      <span class="customer-name">{{ order.customer }}</span>
                      <span class="customer-phone">{{ order.phone }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="date-cell">
                    <span>{{ order.date }}</span>
                    <span class="time-text">{{ order.time }}</span>
                  </div>
                </td>
                <td class="font-bold">{{ order.total }}</td>
                <td>{{ order.method }}</td>
                <td>
                  <span :class="['status-pill', order.statusClass]">{{ order.statusText }}</span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn" title="Xem chi tiết">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button class="action-btn" title="Chỉnh sửa">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="pagination-footer">
            <span class="pagination-info">Hiển thị 1 - 10 trên tổng số 128 đơn hàng</span>
            <div class="pagination-controls">
              <button class="page-btn"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
              <button class="page-btn active">1</button>
              <button class="page-btn">2</button>
              <button class="page-btn">3</button>
              <span class="page-dots">...</span>
              <button class="page-btn">13</button>
              <button class="page-btn"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
            </div>
          </div>
        </div>

        <footer class="admin-footer">
          © 2023 SportGear Admin Panel. Phát triển bởi Đội ngũ kỹ thuật.
        </footer>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const tabs = ref([
  { name: 'Tất cả', count: 128, active: true },
  { name: 'Chờ xử lý', count: 12, active: false },
  { name: 'Đang vận chuyển', count: 24, active: false },
  { name: 'Đã giao', count: 86, active: false },
  { name: 'Đã hủy', count: 6, active: false },
]);

const orders = ref([
  { 
    id: '#SG-1024', initials: 'LM', customer: 'Lê Minh', phone: '0987 *** 321', 
    date: '14/10/2023', time: '09:30', total: '1,250,000đ', method: 'COD', 
    statusText: 'Chờ xử lý', statusClass: 'status-pending-yellow' 
  },
  { 
    id: '#SG-1023', initials: 'TH', customer: 'Trần Hạnh', phone: '0345 *** 888', 
    date: '14/10/2023', time: '08:15', total: '890,000đ', method: 'Momo', 
    statusText: 'Đang vận chuyển', statusClass: 'status-shipping-blue' 
  },
  { 
    id: '#SG-1022', initials: 'PV', customer: 'Phạm Vinh', phone: '0912 *** 456', 
    date: '13/10/2023', time: '15:45', total: '2,100,000đ', method: 'Banking', 
    statusText: 'Đã giao', statusClass: 'status-delivered-green' 
  }
]);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.admin-layout {
  font-family: 'Inter', sans-serif;
  display: flex;
  min-height: 100vh;
  background-color: #ffffff; /* Ảnh này nền trắng hoàn toàn */
  color: #111827;
}

/* --- SIDEBAR --- (Giữ nguyên từ code trước) */
.sidebar { width: 260px; background-color: #ffffff; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
.brand { height: 72px; display: flex; align-items: center; gap: 12px; padding: 0 24px; border-bottom: 1px solid #f3f4f6; }
.brand-icon { width: 32px; height: 32px; background-color: #1a73e8; color: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.brand-icon svg { width: 20px; height: 20px; }
.brand-text { display: flex; flex-direction: column; }
.brand-name { font-size: 18px; font-weight: 700; color: #1a73e8; line-height: 1.2; }
.brand-desc { font-size: 11px; color: #9ca3af; }

.nav-menu { flex: 1; padding: 24px 16px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; }
.nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 16px; color: #4b5563; font-size: 14px; font-weight: 500; border-radius: 8px; text-decoration: none; transition: all 0.2s; }
.nav-link:hover { background-color: #f3f4f6; color: #111827; }
.nav-link.active { background-color: #eff6ff; color: #1a73e8; font-weight: 600; }
.nav-icon { width: 20px; height: 20px; }
.sidebar-bottom { padding: 16px; border-top: 1px solid #f3f4f6; }

/* --- MAIN CONTENT --- */
.main-content { flex: 1; margin-left: 260px; display: flex; flex-direction: column; }

/* Header Top */
.header { height: 72px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 90; }
.page-title-top { font-size: 20px; font-weight: 700; color: #111827; }
.header-right { display: flex; align-items: center; gap: 20px; }
.search-box-top { position: relative; width: 280px; }
.search-input-top { width: 100%; padding: 10px 16px 10px 40px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb; font-size: 14px; outline: none; transition: all 0.2s; }
.search-input-top:focus { background-color: #ffffff; border-color: #1a73e8; }
.search-icon-top { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #9ca3af; }
.icon-btn { background: none; border: none; color: #6b7280; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: background-color 0.2s; }
.icon-btn:hover { background-color: #f3f4f6; color: #111827; }
.icon-btn svg { width: 22px; height: 22px; }
.user-profile { display: flex; align-items: center; gap: 12px; padding-left: 20px; border-left: 1px solid #e5e7eb; cursor: pointer; }
.user-info { display: flex; flex-direction: column; text-align: right; }
.user-name { font-size: 14px; font-weight: 600; color: #111827; }
.user-role { font-size: 12px; color: #9ca3af; }
.user-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }

/* Order Body */
.content-body { padding: 32px; display: flex; flex-direction: column; max-width: 1200px; }

/* Page Header & Actions */
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 700; color: #111827; }
.btn-export { display: flex; align-items: center; gap: 8px; background-color: #10b981; color: #ffffff; border: none; padding: 10px 16px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; }
.btn-export:hover { background-color: #059669; }
.btn-export svg { width: 18px; height: 18px; }

/* Status Tabs */
.status-tabs { display: flex; gap: 24px; border-bottom: 1px solid #e5e7eb; margin-bottom: 24px; }
.tab-item { background: none; border: none; padding: 0 0 12px 0; font-size: 14px; font-weight: 500; color: #6b7280; cursor: pointer; position: relative; }
.tab-item:hover { color: #111827; }
.tab-item.active { color: #1a73e8; font-weight: 600; }
.tab-item.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background-color: #1a73e8; }

/* Filter Bar */
.filter-bar { display: flex; gap: 16px; margin-bottom: 24px; }
.search-box { position: relative; flex: 1; max-width: 400px; }
.search-input { width: 100%; padding: 10px 16px 10px 40px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px; outline: none; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #9ca3af; }

.filter-actions { display: flex; gap: 12px; }
.date-picker { position: relative; }
.date-input { padding: 10px 16px 10px 40px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px; outline: none; width: 220px; }
.date-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #9ca3af; }
.btn-filter { display: flex; align-items: center; gap: 8px; background-color: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb; padding: 10px 16px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; }
.btn-filter:hover { background-color: #e5e7eb; }
.btn-filter svg { width: 16px; height: 16px; }

/* Data Table Container */
.table-container { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background-color: #ffffff; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; }
.data-table th { padding: 16px 20px; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; }
.data-table td { padding: 20px; font-size: 14px; color: #111827; border-bottom: 1px solid #e5e7eb; vertical-align: middle; }
.data-table tbody tr:hover { background-color: #f9fafb; }

.font-bold { font-weight: 600; }
.text-blue { color: #1a73e8; }

.customer-cell { display: flex; align-items: center; gap: 12px; }
.avatar-initial { width: 36px; height: 36px; border-radius: 50%; background-color: #f3f4f6; color: #4b5563; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; }
.customer-info { display: flex; flex-direction: column; gap: 4px; }
.customer-name { font-weight: 600; color: #111827; }
.customer-phone { font-size: 13px; color: #6b7280; }

.date-cell { display: flex; flex-direction: column; gap: 4px; }
.time-text { font-size: 13px; color: #6b7280; }

.status-pill { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; }
.status-pending-yellow { background-color: #fef08a; color: #ca8a04; } /* Vàng cho chờ xử lý */
.status-shipping-blue { background-color: #dbeafe; color: #2563eb; } /* Xanh biển cho đang vận chuyển */
.status-delivered-green { background-color: #d1fae5; color: #059669; } /* Xanh lá cho đã giao */

.action-buttons { display: flex; gap: 12px; }
.action-btn { background: none; border: none; color: #9ca3af; cursor: pointer; transition: color 0.2s; display: flex; align-items: center; justify-content: center; }
.action-btn:hover { color: #1a73e8; }
.action-btn svg { width: 18px; height: 18px; }

/* Pagination */
.pagination-footer { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; background-color: #ffffff; }
.pagination-info { font-size: 13px; color: #6b7280; }
.pagination-controls { display: flex; align-items: center; gap: 8px; }
.page-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 4px; font-size: 13px; color: #4b5563; cursor: pointer; transition: all 0.2s; }
.page-btn:hover:not(.active) { background-color: #f3f4f6; }
.page-btn.active { background-color: #1a73e8; color: #ffffff; border-color: #1a73e8; font-weight: 600; }
.page-btn svg { width: 16px; height: 16px; }
.page-dots { color: #6b7280; margin: 0 4px; }

/* Admin Footer */
.admin-footer { text-align: center; font-size: 13px; color: #9ca3af; margin-top: 40px; padding-bottom: 20px; }
</style>