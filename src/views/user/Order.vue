<script setup>
import { ref, onMounted, computed } from "vue";
import HeaderUser from "../../components/HeaderUser.vue";
import SidebarUser from "../../components/SidebarUser.vue";
import { useOrder } from "@/stores/orders";
import { useShipping } from "@/stores/shipping";
import { useCart } from "@/stores/carts";
import { useRouter } from "vue-router";

const shippingStore = useShipping();
const orderStore = useOrder();
const activeLink = ref("orders");
const activeTab = ref("all");
const cartStore = useCart();
const router = useRouter();
const baseUrl = import.meta.env.VITE_API_BASE.replace("/api", "");

const showCancelModal = ref(false);
const cancelOrderId = ref(null);
const cancelReason = ref("");
const cancelReasons = [
  "Đặt nhầm sản phẩm",
  "Muốn thay đổi địa chỉ giao hàng",
  "Tìm được giá tốt hơn",
  "Không còn nhu cầu",
  "Khác",
];

const showDetailModal = ref(false);
const selectedOrder = ref(null);

const openDetail = (order) => {
  selectedOrder.value = order;
  showDetailModal.value = true;
};

const tabs = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ xác nhận", value: "pending" },
  { label: "Đã xác nhận", value: "confirmed" },
  { label: "Đang giao", value: "shipping" },
  { label: "Hoàn thành", value: "completed" },
  { label: "Đã hủy", value: "cancelled" },
];
const statusMap = {
  pending: { class: "status-pending", text: "Chờ xác nhận" },
  confirmed: { class: "status-confirmed", text: "Đã xác nhận" },
  shipping: { class: "status-shipping", text: "Đang vận chuyển" },
  completed: { class: "status-done", text: "Đã giao" },
  cancelled: { class: "status-canceled", text: "Đã hủy" },
};

const getStatusInfo = (status) =>
  statusMap[status] ?? { class: "status-pending", text: status };

const filteredOrders = computed(() => {
  if (activeTab.value === "all") return orderStore.orders;
  return orderStore.orders.filter((o) => o.order_status === activeTab.value);
});

// Tính subtotal từ items cho một đơn hàng
const getSubtotal = (order) => {
  if (!order?.items) return 0;
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const selectTab = async (tab) => {
  activeTab.value = tab;
  if (tab === "all") {
    await orderStore.loadOrders({ per_page: 2, sort_by: 'created_at', sort_dir: 'desc' });
  } else {
    await orderStore.loadOrders({ per_page: 2, order_status: tab, sort_by: 'created_at', sort_dir: 'desc' });
  }
};

onMounted(async () => {
  await orderStore.loadOrders({ per_page: 2, sort_by: 'created_at', sort_dir: 'desc' });
});

const goToPage = async (page) => {
  if (page < 1 || page > orderStore.pagination.last_page) return;
  const params = { per_page: 2, page, sort_by: 'created_at', sort_dir: 'desc' };
  if (activeTab.value !== "all") params.order_status = activeTab.value;
  await orderStore.loadOrders(params);
};

const openCancelModal = (id) => {
  cancelOrderId.value = id;
  cancelReason.value = "";
  showCancelModal.value = true;
};

const confirmCancel = async () => {
  const result = await orderStore.cancelOrder(cancelOrderId.value, cancelReason.value || null);
  showCancelModal.value = false;
  if (result) {
    const params = { per_page: 2, page: orderStore.pagination.current_page, sort_by: 'created_at', sort_dir: 'desc' };
    if (activeTab.value !== "all") params.order_status = activeTab.value;
    await orderStore.loadOrders(params);
  }
};
const reorder = async (orderId) => {
  const result = await cartStore.reOrder(orderId);
  if (result) {
    router.push("/cart");
  }
};
</script>

<template>
  <div class="profile-page">
    <HeaderUser :cart-count="3" :user="user" />

    <main class="main-wrapper">
      <SidebarUser :active-link="activeLink" @navigate="activeLink = $event" />

      <section class="content">
        <div class="page-header">
          <h1 class="page-title">Đơn hàng của tôi</h1>
          <p class="page-subtitle">
            Quản lý và theo dõi các đơn hàng gần đây của bạn.
          </p>
        </div>

        <ul class="tabs-list">
          <li
            v-for="tab in tabs"
            :key="tab.value"
            :class="['tab-item', { active: activeTab === tab.value }]"
            @click="selectTab(tab.value)"
          >
            {{ tab.label }}
          </li>
        </ul>

        <div class="order-list">
          <div v-if="orderStore.$state.loading" class="loading-state">
            Đang tải...
          </div>

          <div v-else-if="filteredOrders.length === 0" class="empty-state">
            Không có đơn hàng nào.
          </div>

          <div
            class="order-card"
            v-for="order in filteredOrders"
            :key="order.id"
          >
            <div class="order-header">
              <div class="order-meta-group">
                <div class="meta-item">
                  <span class="meta-label">MÃ ĐƠN HÀNG</span>
                  <span class="meta-value">#{{ order.id }}</span>
                </div>
                <div class="meta-divider"></div>
                <div class="meta-item">
                  <span class="meta-label">NGÀY ĐẶT</span>
                  <span class="meta-value">
                    {{ new Date(order.created_at).toLocaleDateString("vi-VN") }}
                  </span>
                </div>
              </div>
              <div
                :class="[
                  'status-badge',
                  getStatusInfo(order.order_status).class,
                ]"
              >
                {{ getStatusInfo(order.order_status).text }}
              </div>
            </div>

            <div class="order-body">
              <div
                class="product-item"
                v-for="item in order.items"
                :key="item.id"
              >
                <img
                  :src="
                    item.variant?.img
                      ? `${baseUrl}/storage/${item.variant.img}`
                      : '/placeholder.png'
                  "
                  :alt="item.variant?.product?.name"
                  class="product-img"
                />
                <div class="product-details">
                  <h4 class="product-name">
                    {{ item.variant?.product?.name }}
                  </h4>
                  <p class="product-variant">
                    Phân loại:
                    {{ item.variant?.sku ?? item.variant?.color ?? "—" }}
                  </p>
                  <p class="product-qty">Số lượng: {{ item.quantity }}</p>
                  <p class="product-price">
                    {{ Number(item.price).toLocaleString("vi-VN") }}đ
                  </p>
                </div>
              </div>

              <div
                v-if="order.order_status === 'cancelled' && order.cancel_reason"
                class="cancel-reason"
              >
                <span class="cancel-reason-label">Lý do hủy:</span>
                <span class="cancel-reason-text">{{
                  order.cancel_reason
                }}</span>
              </div>
            </div>

            <div class="order-footer">
              <div class="order-total">
                <div class="total-breakdown">
                  <span class="total-text">Phí vận chuyển:</span>
                  <span class="total-sub"
                    >{{
                      Number(order.shipping_fee ?? 0).toLocaleString("vi-VN")
                    }}đ</span
                  >
                </div>
                <div v-if="order.discount > 0" class="total-breakdown">
                  <span class="total-text">Giảm giá:</span>
                  <span class="total-sub discount-text"
                    >-{{ Number(order.discount).toLocaleString("vi-VN") }}đ</span
                  >
                </div>
                <div class="total-divider"></div>
                <div class="total-breakdown">
                  <span class="total-text total-label-final">Tổng thanh toán:</span>
                  <!-- total_amount đã gồm ship và đã trừ discount -->
                  <span class="total-amount">
                    {{ Number(order.total_amount ?? 0).toLocaleString("vi-VN") }}đ
                  </span>
                </div>
              </div>
              <div class="order-actions">
                <button class="btn-outline" @click="openDetail(order)">
                  Xem chi tiết
                </button>
                <button
                  v-if="
                    order.order_status === 'pending' ||
                    order.order_status === 'confirmed'
                  "
                  class="btn-danger"
                  @click="openCancelModal(order.id)"
                >
                  Hủy đơn
                </button>
                <button
                  v-if="
                    order.order_status === 'cancelled' ||
                    order.order_status === 'completed'
                  "
                  class="btn-primary"
                  @click="reorder(order.id)"
                >
                  Mua lại
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination" v-if="orderStore.pagination.last_page > 1">
          <button
            class="page-btn"
            :disabled="orderStore.pagination.current_page === 1"
            @click="goToPage(orderStore.pagination.current_page - 1)"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            v-for="page in orderStore.pagination.last_page"
            :key="page"
            :class="[
              'page-btn',
              { active: page === orderStore.pagination.current_page },
            ]"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            class="page-btn"
            :disabled="
              orderStore.pagination.current_page ===
              orderStore.pagination.last_page
            "
            @click="goToPage(orderStore.pagination.current_page + 1)"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </section>
    </main>

    <!-- Modal xem chi tiết -->
    <div
      v-if="showDetailModal"
      class="modal-overlay"
      @click.self="showDetailModal = false"
    >
      <div class="detail-modal">
        <div class="detail-modal-header">
          <div>
            <h3 class="detail-modal-title">
              Chi tiết đơn hàng #{{ selectedOrder?.id }}
            </h3>
            <p class="detail-modal-date">
              Đặt ngày
              {{
                new Date(selectedOrder?.created_at).toLocaleDateString("vi-VN")
              }}
            </p>
          </div>
          <button class="detail-modal-close" @click="showDetailModal = false">
            ✕
          </button>
        </div>

        <div class="detail-modal-body" v-if="selectedOrder">
          <!-- Trạng thái -->
          <div class="detail-section">
            <div class="detail-status-row">
              <div class="detail-status-item">
                <span class="detail-status-label">Trạng thái đơn</span>
                <span
                  :class="[
                    'status-badge',
                    getStatusInfo(selectedOrder.order_status).class,
                  ]"
                >
                  {{ getStatusInfo(selectedOrder.order_status).text }}
                </span>
              </div>
              <div class="detail-status-item">
                <span class="detail-status-label">Phương thức TT</span>
                <span class="detail-status-value">{{
                  selectedOrder.payment_method?.toUpperCase()
                }}</span>
              </div>
              <div class="detail-status-item">
                <span class="detail-status-label">Trạng thái TT</span>
                <span class="detail-status-value">{{
                  {
                    pending: "Chờ TT",
                    paid: "Đã TT",
                    failed: "Thất bại",
                    refund_pending: "Đang hoàn",
                    refunded: "Đã hoàn tiền",
                  }[selectedOrder.payment_status] ||
                  selectedOrder.payment_status
                }}</span>
              </div>
            </div>
          </div>

          <!-- Lý do hủy -->
          <div
            v-if="
              selectedOrder.order_status === 'cancelled' &&
              selectedOrder.cancel_reason
            "
            class="detail-cancel-reason"
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span
              ><strong>Lý do hủy:</strong>
              {{ selectedOrder.cancel_reason }}</span
            >
          </div>

          <!-- Sản phẩm -->
          <div class="detail-section">
            <h4 class="detail-section-title">Sản phẩm</h4>
            <div class="detail-product-list">
              <div
                class="detail-product-item"
                v-for="item in selectedOrder.items"
                :key="item.id"
              >
                <img
                  :src="
                    item.variant?.img
                      ? `${baseUrl}/storage/${item.variant.img}`
                      : '/placeholder.png'
                  "
                  :alt="item.variant?.product?.name"
                  class="detail-product-img"
                />
                <div class="detail-product-info">
                  <p class="detail-product-name">
                    {{ item.variant?.product?.name || "—" }}
                  </p>
                  <p class="detail-product-sku">
                    SKU: {{ item.variant?.sku || "—" }}
                  </p>
                  <p class="detail-product-qty">
                    Số lượng: {{ item.quantity }}
                  </p>
                </div>
                <div class="detail-product-price">
                  {{
                    Number(item.price * item.quantity).toLocaleString("vi-VN")
                  }}đ
                </div>
              </div>
            </div>
          </div>

          <!-- Tổng tiền -->
          <div class="detail-section detail-summary">
            <div class="detail-summary-row">
              <span>Tiền hàng</span>
              <span>{{ Number(getSubtotal(selectedOrder)).toLocaleString("vi-VN") }}đ</span>
            </div>
            <div class="detail-summary-row">
              <span>Phí vận chuyển</span>
              <span>{{ Number(selectedOrder.shipping_fee ?? 0).toLocaleString("vi-VN") }}đ</span>
            </div>
            <div class="detail-summary-row" v-if="selectedOrder.discount > 0">
              <span>Giảm giá</span>
              <span class="discount-text">-{{ Number(selectedOrder.discount).toLocaleString("vi-VN") }}đ</span>
            </div>
            <!-- total_amount = subtotal + shipping - discount, không cộng thêm -->
            <div class="detail-summary-row detail-summary-total">
              <span>Tổng thanh toán</span>
              <span>{{ Number(selectedOrder.total_amount ?? 0).toLocaleString("vi-VN") }}đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal hủy đơn -->
    <div
      v-if="showCancelModal"
      class="modal-overlay"
      @click.self="showCancelModal = false"
    >
      <div class="modal">
        <h3 class="modal-title">Hủy đơn hàng</h3>
        <p class="modal-desc">Vui lòng chọn lý do hủy đơn</p>
        <div class="reason-list">
          <label v-for="r in cancelReasons" :key="r" class="reason-item">
            <input type="radio" :value="r" v-model="cancelReason" />
            {{ r }}
          </label>
        </div>
        <div class="modal-actions">
          <button class="btn-outline" @click="showCancelModal = false">
            Quay lại
          </button>
          <button class="btn-danger" @click="confirmCancel">
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-container">
        <div class="footer-brand">
          <div class="footer-logo">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path
                d="M5.636 5.636a9 9 0 0112.728 0M12 2v20M2 12h20M5.636 18.364a9 9 0 0112.728 0"
              ></path>
            </svg>
          </div>
          <span class="footer-name">SportGear</span>
        </div>
        <div class="footer-copy">
          © 2024 SportGear. Bản quyền thuộc về Công ty TNHH Thể Thao Việt.
        </div>
        <div class="footer-links">
          <a href="#">Điều khoản</a>
          <a href="#">Bảo mật</a>
          <a href="#">Hỗ trợ</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.profile-page {
  font-family: "Inter", sans-serif;
  background-color: #f9fafb;
  color: #111827;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
a {
  text-decoration: none;
}
button {
  font-family: inherit;
}

.main-wrapper {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  gap: 40px;
  width: 100%;
  flex: 1;
}
.content {
  flex: 1;
  min-width: 0;
  max-width: 900px;
}

.page-header {
  margin-bottom: 32px;
}
.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}
.page-subtitle {
  font-size: 15px;
  color: #6b7280;
}

.tabs-list {
  display: flex;
  list-style: none;
  gap: 32px;
  margin-bottom: 24px;
}
.tab-item {
  font-size: 15px;
  font-weight: 500;
  color: #6b7280;
  padding-bottom: 16px;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
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

.order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.order-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
}
.order-meta-group {
  display: flex;
  align-items: center;
  gap: 20px;
}
.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.meta-label {
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
}
.meta-value {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}
.meta-divider {
  width: 1px;
  height: 36px;
  background-color: #e5e7eb;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}
.status-pending {
  background-color: #fff7ed;
  color: #ea580c;
}
.status-confirmed {
  background-color: #fef9c3;
  color: #ca8a04;
}
.status-shipping {
  background-color: #eff6ff;
  color: #1a73e8;
}
.status-done {
  background-color: #ecfdf5;
  color: #10b981;
}
.status-canceled {
  background-color: #f3f4f6;
  color: #6b7280;
}

.order-body {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.product-item {
  display: flex;
  align-items: center;
  gap: 20px;
}
.product-img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #f3f4f6;
}
.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2px;
}
.product-variant {
  font-size: 13px;
  color: #6b7280;
}
.product-qty {
  font-size: 13px;
  color: #6b7280;
}
.product-price {
  font-size: 14px;
  font-weight: 700;
  color: #1a73e8;
  margin-top: 4px;
}

.cancel-reason {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #fef2f2;
  border-radius: 6px;
  border: 1px solid #fecaca;
}
.cancel-reason-label {
  font-size: 13px;
  font-weight: 600;
  color: #dc2626;
}
.cancel-reason-text {
  font-size: 13px;
  color: #6b7280;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-top: 1px solid #f3f4f6;
  background-color: #fafbfc;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
.order-total {
  display: flex;
  align-items: center;
  gap: 8px;
}
.total-breakdown {
  display: flex;
  align-items: center;
  gap: 6px;
}
.total-text {
  font-size: 14px;
  color: #6b7280;
}
.total-sub {
  font-size: 14px;
  color: #111827;
}
.discount-text {
  color: #16a34a;
  font-weight: 600;
}
.total-divider {
  width: 1px;
  height: 20px;
  background-color: #e5e7eb;
  margin: 0 4px;
}
.total-amount {
  font-size: 15px;
  font-weight: 700;
  color: #1a73e8;
}
.order-actions {
  display: flex;
  gap: 12px;
}

.btn-outline {
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover {
  background-color: #f9fafb;
}
.btn-primary {
  background-color: #1a73e8;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-primary:hover {
  background-color: #1557b0;
}
.btn-danger {
  background-color: #ffffff;
  color: #dc2626;
  border: 1px solid #dc2626;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-danger:hover {
  background-color: #fee2e2;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
}
.page-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  cursor: pointer;
  transition: all 0.2s;
}
.page-btn:hover:not(.active) {
  background-color: #f3f4f6;
}
.page-btn.active {
  background-color: #1a73e8;
  color: #ffffff;
  border-color: #1a73e8;
  font-weight: 600;
}
.page-btn svg {
  width: 18px;
  height: 18px;
}

/* Modal overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

/* Detail Modal */
.detail-modal {
  background: #fff;
  border-radius: 16px;
  width: 560px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}
.detail-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
}
.detail-modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}
.detail-modal-date {
  font-size: 13px;
  color: #9ca3af;
  margin-top: 4px;
}
.detail-modal-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}
.detail-modal-close:hover {
  background: #f3f4f6;
  color: #111;
}
.detail-modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.detail-section {
  background: #f9fafb;
  border-radius: 10px;
  padding: 16px;
}
.detail-section-title {
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 14px;
}
.detail-status-row {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}
.detail-status-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.detail-status-label {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
}
.detail-status-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}
.detail-cancel-reason {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 14px;
  color: #dc2626;
}
.detail-product-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.detail-product-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}
.detail-product-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.detail-product-img {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
}
.detail-product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.detail-product-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}
.detail-product-sku {
  font-size: 12px;
  color: #9ca3af;
}
.detail-product-qty {
  font-size: 13px;
  color: #6b7280;
}
.detail-product-price {
  font-size: 14px;
  font-weight: 700;
  color: #1a73e8;
  white-space: nowrap;
}
.detail-summary {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.detail-summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7280;
}
.detail-summary-total {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
}
.detail-summary-total span:last-child {
  color: #1a73e8;
}

/* Cancel Modal */
.modal {
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}
.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}
.modal-desc {
  font-size: 14px;
  color: #6b7280;
}
.reason-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.reason-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}
.reason-item:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}
.reason-item input {
  accent-color: #1a73e8;
  width: 16px;
  height: 16px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

/* Footer */
.footer {
  background-color: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 24px 0;
  margin-top: auto;
}
.footer-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.footer-logo {
  width: 24px;
  height: 24px;
  background-color: #9ca3af;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer-logo svg {
  width: 14px;
  height: 14px;
}
.footer-name {
  font-size: 14px;
  font-weight: 700;
  color: #9ca3af;
}
.footer-copy {
  font-size: 13px;
  color: #9ca3af;
}
.footer-links {
  display: flex;
  gap: 24px;
}
.footer-links a {
  text-decoration: none;
  color: #4b5563;
  font-size: 13px;
  font-weight: 500;
}
.footer-links a:hover {
  color: #111827;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #9ca3af;
  font-size: 14px;
}
</style>