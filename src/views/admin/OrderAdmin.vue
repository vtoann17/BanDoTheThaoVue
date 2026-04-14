<script setup>
import { ref, computed, onMounted } from "vue";
import { useOrder } from "@/stores/orders";
import HeaderAdmin from "../../components/HeaderAdmin.vue";
import SidebarAdmin from "../../components/SidebarAdmin.vue";

const orderStore = useOrder();

const loading = ref(false);
const updating = ref(false);
const activeTab = ref("");
const searchQuery = ref("");
const paymentStatusFilter = ref("");
const sortBy = ref("id");
const sortDir = ref("desc");
const perPage = ref(5);

const showDetailModal = ref(false);
const showUpdateModal = ref(false);
const selectedOrder = ref(null);
const updateForm = ref({ order_status: "", payment_status: "" });

const tabs = [
  { name: "Tất cả", value: "" },
  { name: "Chờ xử lý", value: "pending" },
  { name: "Đã xác nhận", value: "confirmed" },
  { name: "Đang vận chuyển", value: "shipping" },
  { name: "Đã giao", value: "completed" },
  { name: "Đã hủy", value: "cancelled" },
];

const buildParams = (page = 1) => ({
  order_status: activeTab.value || undefined,
  payment_status: paymentStatusFilter.value || undefined,
  search: searchQuery.value || undefined,
  sort_by: sortBy.value,
  sort_dir: sortDir.value,
  per_page: perPage.value,
  page: page,
  page,
});

const fetchOrders = async (page = 1) => {
  loading.value = true;
  await orderStore.loadOrders(buildParams(page));
  loading.value = false;
};

onMounted(() => fetchOrders());

const handleTabChange = (val) => {
  activeTab.value = val;
  fetchOrders(1);
};
const applySearch = () => fetchOrders(1);
const applyFilters = () => fetchOrders(1);
const goToPage = (page) => {
  if (page < 1 || page > orderStore.pagination.last_page) return;
  fetchOrders(page);
};

const fromItem = computed(() => {
  const p = orderStore.pagination;
  return (p.current_page - 1) * p.per_page + 1;
});
const toItem = computed(() => {
  const p = orderStore.pagination;
  return Math.min(p.current_page * p.per_page, p.total);
});
const visiblePages = computed(() => {
  const { current_page, last_page } = orderStore.pagination;
  const pages = [];
  for (let i = 1; i <= last_page; i++) {
    if (i === 1 || i === last_page || Math.abs(i - current_page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  return pages;
});

const openDetail = (order) => {
  selectedOrder.value = order;
  showDetailModal.value = true;
};
const openUpdate = (order) => {
  selectedOrder.value = order;
  updateForm.value = {
    order_status: order.order_status,
    payment_status: order.payment_status,
  };
  showUpdateModal.value = true;
};
const submitUpdate = async () => {
  if (!selectedOrder.value) return;
  updating.value = true;
  await orderStore.updateOrder(selectedOrder.value.id, updateForm.value);
  updating.value = false;
  showUpdateModal.value = false;
  fetchOrders(orderStore.pagination.current_page);
};

const formatCurrency = (val) =>
  val != null ? Number(val).toLocaleString("vi-VN") + "đ" : "0đ";
const formatDate = (dt) =>
  dt ? new Date(dt).toLocaleDateString("vi-VN") : "—";
const formatTime = (dt) =>
  dt
    ? new Date(dt).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
    : "";
const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();
};

const orderStatusLabel = (s) =>
({
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  shipping: "Đang vận chuyển",
  completed: "Đã giao",
  cancelled: "Đã hủy",
}[s] || s);
const orderStatusClass = (s) =>
({
  pending: "status-pending-yellow",
  confirmed: "status-confirmed-purple",
  shipping: "status-shipping-blue",
  completed: "status-delivered-green",
  cancelled: "status-cancelled-red",
}[s] || "");

const paymentStatusLabel = (s) =>
({
  pending: "Chờ TT",
  paid: "Đã TT",
  failed: "Thất bại",
  refund_pending: "Đang hoàn",
  refunded: "Đã hoàn tiền",
}[s] || s);

const paymentStatusClass = (s) =>
({
  pending: "status-pending-yellow",
  paid: "status-delivered-green",
  failed: "status-cancelled-red",
  refund_pending: "status-shipping-blue",
  refunded: "status-confirmed-purple",
}[s] || "");
</script>
<template>
  <div class="admin-layout">
    <SidebarAdmin />

    <div class="main-content">
      <HeaderAdmin />

      <div class="content-body">
        <!-- Page Header -->
        <div class="page-header">
          <h1 class="page-title">Quản lý đơn hàng</h1>
          <button class="btn-export">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Xuất file Excel
          </button>
        </div>

        <!-- Status Tabs -->
        <div class="status-tabs">
          <button v-for="tab in tabs" :key="tab.value" :class="['tab-item', { active: activeTab === tab.value }]"
            @click="handleTabChange(tab.value)">
            {{ tab.name }}
          </button>
        </div>

        <!-- Filter Bar -->
        <div class="filter-bar">
          <div class="search-box filter-search">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input v-model="searchQuery" @keyup.enter="applySearch" type="text" class="search-input"
              placeholder="Tìm theo Mã đơn..." />
          </div>
          <div class="filter-actions">
            <select v-model="paymentStatusFilter" @change="applyFilters" class="filter-select">
              <option value="">Thanh toán</option>
              <option value="pending">Chờ thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="failed">Thất bại</option>
              <option value="refund_pending">Đang hoàn tiền</option>
              <option value="refunded">Đã hoàn tiền</option>
            </select>
            <select v-model="sortBy" @change="applyFilters" class="filter-select">
              <option value="id">Sắp xếp: Mã đơn</option>
              <option value="total_amount">Sắp xếp: Tổng tiền</option>
              <option value="created_at">Sắp xếp: Ngày tạo</option>
            </select>
            <select v-model="sortDir" @change="applyFilters" class="filter-select">
              <option value="desc">Mới nhất</option>
              <option value="asc">Cũ nhất</option>
            </select>
            <select v-model="perPage" @change="applyFilters" class="filter-select">
              <option value="2">2 / trang</option>
              <option value="5">5 / trang</option>
              <option value="10">10 / trang</option>
              <option value="20">20 / trang</option>
            </select>
          </div>
        </div>

        <!-- Table -->
        <div class="table-container">
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <span>Đang tải dữ liệu...</span>
          </div>

          <div v-else-if="orderStore.orders.length === 0" class="empty-state">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="48" height="48">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z">
              </path>
            </svg>
            <p>Không có đơn hàng nào</p>
          </div>

          <table v-else class="data-table">
            <thead>
              <tr>
                <th>MÃ ĐƠN</th>
                <th>KHÁCH HÀNG</th>
                <th>NGÀY ĐẶT</th>
                <th>TỔNG TIỀN</th>
                <th>PHÍ SHIP</th>
                <th>THANH TOÁN</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orderStore.orders" :key="order.id">
                <td class="font-bold text-blue">#{{ order.id }}</td>
                <td>
                  <div class="customer-cell">
                    <div class="avatar-initial">
                      {{ getInitials(order.user?.name) }}
                    </div>
                    <div class="customer-info">
                      <span class="customer-name">{{
                        order.user?.name || "Không rõ"
                        }}</span>
                      <span class="customer-phone">{{
                        order.user?.email || "—"
                        }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="date-cell">
                    <span>{{ formatDate(order.created_at) }}</span>
                    <span class="time-text">{{
                      formatTime(order.created_at)
                      }}</span>
                  </div>
                </td>
                <!-- total_amount đã gồm ship và trừ discount, hiển thị thẳng -->
                <td class="font-bold">
                  {{ formatCurrency(order.total_amount) }}
                </td>
                <td>{{ formatCurrency(order.shipping_fee) }}</td>
                <td>
                  <span :class="[
                    'status-pill',
                    paymentStatusClass(order.payment_status),
                  ]">
                    {{ paymentStatusLabel(order.payment_status) }}
                  </span>
                </td>
                <td>
                  <span :class="[
                    'status-pill',
                    orderStatusClass(order.order_status),
                  ]">
                    {{ orderStatusLabel(order.order_status) }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn" title="Xem chi tiết" @click="openDetail(order)">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                        </path>
                      </svg>
                    </button>
                    <button class="action-btn" title="Cập nhật trạng thái" @click="openUpdate(order)">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                        </path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="pagination-footer" v-if="!loading && orderStore.orders.length > 0">
            <span class="pagination-info">
              Hiển thị {{ fromItem }} - {{ toItem }} trên tổng số
              {{ orderStore.pagination.total }} đơn hàng
            </span>
            <div class="pagination-controls">
              <button class="page-btn" :disabled="orderStore.pagination.current_page <= 1"
                @click="goToPage(orderStore.pagination.current_page - 1)">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <template v-for="page in visiblePages" :key="page">
                <span v-if="page === '...'" class="page-dots">...</span>
                <button v-else :class="[
                  'page-btn',
                  { active: page === orderStore.pagination.current_page },
                ]" @click="goToPage(page)">
                  {{ page }}
                </button>
              </template>
              <button class="page-btn" :disabled="orderStore.pagination.current_page >=
                orderStore.pagination.last_page
                " @click="goToPage(orderStore.pagination.current_page + 1)">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <footer class="admin-footer">
          © 2025 SportGear Admin Panel. Phát triển bởi Đội ngũ kỹ thuật.
        </footer>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2>Chi tiết đơn hàng #{{ selectedOrder?.id }}</h2>
          <button class="modal-close" @click="showDetailModal = false">
            ✕
          </button>
        </div>
        <div class="modal-body" v-if="selectedOrder">
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Khách hàng</span>
              <span class="detail-value">{{
                selectedOrder.user?.name || "—"
                }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Email</span>
              <span class="detail-value">{{
                selectedOrder.user?.email || "—"
                }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Ngày đặt</span>
              <span class="detail-value">{{ formatDate(selectedOrder.created_at) }}
                {{ formatTime(selectedOrder.created_at) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Phương thức TT</span>
              <span class="detail-value">{{
                selectedOrder.payment_method?.toUpperCase()
                }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Phí vận chuyển</span>
              <span class="detail-value">{{
                formatCurrency(selectedOrder.shipping_fee)
                }}</span>
            </div>
            <div class="detail-item" v-if="selectedOrder.discount > 0">
              <span class="detail-label">Giảm giá</span>
              <span class="detail-value discount-text">-{{ formatCurrency(selectedOrder.discount) }}</span>
            </div>
            <div class="detail-item">
              <!-- total_amount = subtotal + ship - discount (đã tính sẵn ở backend) -->
              <span class="detail-label">Tổng thanh toán</span>
              <span class="detail-value font-bold text-blue">{{
                formatCurrency(selectedOrder.total_amount)
                }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Trạng thái đơn</span>
              <span :class="[
                'status-pill',
                orderStatusClass(selectedOrder.order_status),
              ]">
                {{ orderStatusLabel(selectedOrder.order_status) }}
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Trạng thái thanh toán</span>
              <span :class="[
                'status-pill',
                paymentStatusClass(selectedOrder.payment_status),
              ]">
                {{ paymentStatusLabel(selectedOrder.payment_status) }}
              </span>
            </div>

            <!-- Lý do hủy -->
            <div class="detail-item detail-item-full" v-if="selectedOrder.order_status === 'cancelled'">
              <span class="detail-label">Lý do hủy</span>
              <div class="cancel-reason-box">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{
                  selectedOrder.cancel_reason || "Không có lý do"
                  }}</span>
              </div>
            </div>
          </div>

          <div v-if="selectedOrder.items?.length" class="items-section">
            <h3 class="items-title">Sản phẩm trong đơn</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>SKU</th>
                  <th>SL</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedOrder.items" :key="item.id">
                  <td>{{ item.variant?.product?.name || "—" }}</td>
                  <td>{{ item.variant?.sku || "—" }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ formatCurrency(item.price) }}</td>
                  <td class="font-bold">
                    {{ formatCurrency(item.price * item.quantity) }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="items-summary">
              <div class="items-summary-row" v-if="selectedOrder.discount > 0">
                <span>Giảm giá:</span>
                <span class="discount-text">-{{ formatCurrency(selectedOrder.discount) }}</span>
              </div>
              <div class="items-summary-row">
                <span>Phí vận chuyển:</span>
                <span>{{ formatCurrency(selectedOrder.shipping_fee) }}</span>
              </div>
              <div class="items-total">
                <span>Tổng thanh toán:</span>
                <!-- total_amount đã gồm ship và đã trừ discount, không cộng thêm -->
                <span class="total-final">{{ formatCurrency(selectedOrder.total_amount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Modal -->
    <div v-if="showUpdateModal" class="modal-overlay" @click.self="showUpdateModal = false">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h2>Cập nhật đơn #{{ selectedOrder?.id }}</h2>
          <button class="modal-close" @click="showUpdateModal = false">
            ✕
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Trạng thái đơn hàng</label>
            <select v-model="updateForm.order_status" class="form-select">
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="shipping">Đang vận chuyển</option>
              <option value="completed">Đã giao</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Trạng thái thanh toán</label>
            <select v-model="updateForm.payment_status" class="form-select">
              <option value="pending">Chờ thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="failed">Thất bại</option>
              <option value="refund_pending">Đang hoàn tiền</option>
              <option value="refunded">Đã hoàn tiền</option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" @click="showUpdateModal = false">
              Hủy
            </button>
            <button class="btn-save" @click="submitUpdate" :disabled="updating">
              {{ updating ? "Đang lưu..." : "Lưu thay đổi" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.admin-layout {
  font-family: "Inter", sans-serif;
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
  color: #111827;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-body {
  padding: 32px;
  flex: 1;
  overflow-y: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #10b981;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-export:hover {
  background-color: #059669;
}

.btn-export svg {
  width: 18px;
  height: 18px;
}

.status-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
  overflow-x: auto;
}

.tab-item {
  background: none;
  border: none;
  padding: 10px 16px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
}

.tab-item:hover {
  color: #111827;
}

.tab-item.active {
  color: #1a73e8;
  font-weight: 600;
}

.tab-item.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #1a73e8;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 360px;
}

.search-input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  background: #fff;
}

.search-input:focus {
  border-color: #1a73e8;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9ca3af;
}

.filter-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  background: #fff;
  cursor: pointer;
  outline: none;
  color: #374151;
}

.filter-select:focus {
  border-color: #1a73e8;
}

.table-container {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 900px;
}

.data-table th {
  padding: 14px 18px;
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 14px 10px;
}

.data-table td {
  padding: 16px 18px;
  font-size: 14px;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
  padding: 14px 10px;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background-color: #f9fafb;
}

.font-bold {
  font-weight: 600;
}

.text-blue {
  color: #1a73e8;
}

.discount-text {
  color: #16a34a !important;
  font-weight: 600;
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-initial {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.customer-name {
  font-weight: 600;
  font-size: 14px;
}

.customer-phone {
  font-size: 12px;
  color: #6b7280;
}

.date-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.time-text {
  font-size: 12px;
  color: #9ca3af;
}

.status-pill {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  white-space: nowrap;
}

.status-pending-yellow {
  background-color: #fef9c3;
  color: #a16207;
}

.status-confirmed-purple {
  background-color: #ede9fe;
  color: #7c3aed;
}

.status-shipping-blue {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.status-delivered-green {
  background-color: #d1fae5;
  color: #065f46;
}

.status-cancelled-red {
  background-color: #fee2e2;
  color: #b91c1c;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
}

.action-btn:hover {
  color: #1a73e8;
  background: #eff6ff;
}

.action-btn svg {
  width: 17px;
  height: 17px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px;
  color: #9ca3af;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #1a73e8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.pagination-footer {
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f3f4f6;
}

.pagination-info {
  font-size: 13px;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0 6px;
}

.page-btn:hover:not(.active):not(:disabled) {
  background-color: #f3f4f6;
}

.page-btn.active {
  background-color: #1a73e8;
  color: #fff;
  border-color: #1a73e8;
  font-weight: 600;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn svg {
  width: 14px;
  height: 14px;
}

.page-dots {
  color: #6b7280;
  padding: 0 4px;
  font-size: 13px;
}

.admin-footer {
  text-align: center;
  font-size: 13px;
  color: #9ca3af;
  margin-top: 40px;
  padding-bottom: 20px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
}

.modal {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-sm {
  max-width: 440px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
}

.modal-header h2 {
  font-size: 17px;
  font-weight: 700;
}

.modal-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #111;
}

.modal-body {
  padding: 24px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item-full {
  grid-column: 1 / -1;
}

.detail-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
}

.cancel-reason-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 14px;
  color: #dc2626;
  font-weight: 500;
  margin-top: 4px;
}

.items-section {
  margin-top: 8px;
}

.items-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #374151;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.items-table th {
  padding: 10px 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
}

.items-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f3f4f6;
}

.items-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 12px 0;
  border-top: 1px solid #e5e7eb;
  margin-top: 4px;
}

.items-summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #6b7280;
}

.items-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.total-final {
  font-size: 18px;
  font-weight: 800;
  color: #1a73e8;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.form-select:focus {
  border-color: #1a73e8;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-cancel {
  padding: 9px 18px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
}

.btn-cancel:hover {
  background: #f3f4f6;
}

.btn-save {
  padding: 9px 18px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  background: #1a73e8;
  color: #fff;
  cursor: pointer;
}

.btn-save:hover:not(:disabled) {
  background: #1558b0;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>