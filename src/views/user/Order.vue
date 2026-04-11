<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import HeaderUser from "../../components/HeaderUser.vue";
import SidebarUser from "../../components/SidebarUser.vue";
import { useOrder } from "@/stores/orders";
import { useReviews } from "@/stores/reviews";
import { useAuth } from "@/stores/auth";

const orderStore = useOrder();
const reviewsStore = useReviews();
const authStore = useAuth();

const { user } = storeToRefs(authStore);

const activeLink = ref("orders");
const activeTab = ref("all");
const baseUrl = import.meta.env.VITE_API_BASE.replace("/api", "");

const showReviewModal = ref(false);
const reviewingItem = ref(null);
const reviewSubmitting = ref(false);
const reviewedProductIds = ref(new Set());
const reviewForm = ref({ rating: 5, comment: "" });

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

const getProductId = (item) =>
    item.variant?.product_id ?? item.variant?.product?.id ?? null;

const isReviewed = (productId) => reviewedProductIds.value.has(productId);

const selectTab = async (tab) => {
    activeTab.value = tab;
    const params = { per_page: 2 };
    if (tab !== "all") params.order_status = tab;
    await orderStore.loadOrders(params);
};

const goToPage = async (page) => {
    if (page < 1 || page > orderStore.pagination.last_page) return;
    const params = { per_page: 2, page };
    if (activeTab.value !== "all") params.order_status = activeTab.value;
    await orderStore.loadOrders(params);
};

const cancelOrder = async (id) => {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    await orderStore.cancelOrder(id);
};

const openReviewModal = (item) => {
    reviewingItem.value = item;
    reviewForm.value = { rating: 5, comment: "" };
    showReviewModal.value = true;
};

const closeReviewModal = () => {
    showReviewModal.value = false;
    reviewingItem.value = null;
};

const setRating = (star) => {
    reviewForm.value.rating = star;
};

const submitReview = async () => {
    if (!reviewingItem.value) return;

    const productId = getProductId(reviewingItem.value);
    if (!productId) return;

    reviewSubmitting.value = true;

    const result = await reviewsStore.createReview({
        product_id: productId,
        rating: reviewForm.value.rating,
        comment: reviewForm.value.comment,
    });

    reviewSubmitting.value = false;

    if (result) {
        reviewedProductIds.value.add(productId);
        closeReviewModal();
    }
};

onMounted(async () => {
    await orderStore.loadOrders({ per_page: 2 });
});
</script>

<template>
    <div class="profile-page">
        <HeaderUser :cart-count="3" :user="user" />

        <main class="main-wrapper">
            <SidebarUser :active-link="activeLink" @navigate="activeLink = $event" />

            <section class="content">
                <div class="page-header">
                    <h1 class="page-title">Đơn hàng của tôi</h1>
                    <p class="page-subtitle">Quản lý và theo dõi các đơn hàng gần đây của bạn.</p>
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
                    <div v-if="orderStore.loading" class="loading-state">
                        <div class="spinner"></div>
                        <span>Đang tải...</span>
                    </div>

                    <div v-else-if="filteredOrders.length === 0" class="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p>Không có đơn hàng nào.</p>
                    </div>

                    <div class="order-card" v-for="order in filteredOrders" :key="order.id">
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
                            <div :class="['status-badge', getStatusInfo(order.order_status).class]">
                                {{ getStatusInfo(order.order_status).text }}
                            </div>
                        </div>

                        <div class="order-body">
                            <div class="product-item" v-for="item in order.items" :key="item.id">
                                <img
                                    :src="item.variant?.img
                                        ? `${baseUrl}/storage/${item.variant.img}`
                                        : '/placeholder.png'"
                                    :alt="item.variant?.product?.name"
                                    class="product-img"
                                />
                                <div class="product-details">
                                    <h4 class="product-name">{{ item.variant?.product?.name }}</h4>
                                    <p class="product-variant">
                                        Phân loại: {{ item.variant?.sku ?? item.variant?.color ?? "—" }}
                                    </p>
                                    <p class="product-qty">Số lượng: {{ item.quantity }}</p>
                                    <p class="product-price">
                                        {{ Number(item.price).toLocaleString("vi-VN") }}đ
                                    </p>
                                </div>

                                <template v-if="order.order_status === 'completed'">
                                    <button
                                        v-if="!isReviewed(getProductId(item))"
                                        class="btn-review"
                                        @click="openReviewModal(item)"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                        </svg>
                                        Đánh giá
                                    </button>
                                    <span v-else class="reviewed-badge">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                                        </svg>
                                        Đã đánh giá
                                    </span>
                                </template>
                            </div>
                        </div>

                        <div class="order-footer">
                            <div class="order-total">
                                <div class="total-breakdown">
                                    <span class="total-text">Phí vận chuyển:</span>
                                    <span class="total-sub">
                                        {{ Number(order.shipping_fee ?? 0).toLocaleString("vi-VN") }}đ
                                    </span>
                                </div>
                                <div class="total-divider"></div>
                                <div class="total-breakdown">
                                    <span class="total-text total-label-final">Tổng thanh toán:</span>
                                    <span class="total-amount">
                                        {{ Number((order.total_amount ?? 0) + (order.shipping_fee ?? 0)).toLocaleString("vi-VN") }}đ
                                    </span>
                                </div>
                            </div>

                            <div class="order-actions">
                                <button class="btn-outline">Xem chi tiết</button>
                                <button
                                    v-if="order.order_status === 'pending' || order.order_status === 'confirmed'"
                                    class="btn-danger"
                                    @click="cancelOrder(order.id)"
                                >
                                    Hủy đơn
                                </button>
                                <button
                                    v-if="order.order_status === 'cancelled' || order.order_status === 'completed'"
                                    class="btn-primary"
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
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>

                    <button
                        v-for="page in orderStore.pagination.last_page"
                        :key="page"
                        :class="['page-btn', { active: page === orderStore.pagination.current_page }]"
                        @click="goToPage(page)"
                    >
                        {{ page }}
                    </button>

                    <button
                        class="page-btn"
                        :disabled="orderStore.pagination.current_page === orderStore.pagination.last_page"
                        @click="goToPage(orderStore.pagination.current_page + 1)"
                    >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>
            </section>
        </main>

        <Teleport to="body">
            <Transition name="modal">
                <div v-if="showReviewModal" class="modal-overlay" @click.self="closeReviewModal">
                    <div class="modal-box">
                        <div class="modal-header">
                            <h2 class="modal-title">Đánh giá sản phẩm</h2>
                            <button class="modal-close" @click="closeReviewModal" aria-label="Đóng">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        <div class="modal-product">
                            <img
                                :src="reviewingItem?.variant?.img
                                    ? `${baseUrl}/storage/${reviewingItem.variant.img}`
                                    : '/placeholder.png'"
                                class="modal-product-img"
                                alt=""
                            />
                            <div>
                                <p class="modal-product-name">
                                    {{ reviewingItem?.variant?.product?.name }}
                                </p>
                                <p class="modal-product-sku">
                                    {{ reviewingItem?.variant?.sku ?? reviewingItem?.variant?.color ?? "" }}
                                </p>
                            </div>
                        </div>

                        <div class="modal-section">
                            <label class="modal-label">Đánh giá của bạn</label>
                            <div class="star-row">
                                <button
                                    v-for="s in 5"
                                    :key="s"
                                    type="button"
                                    :class="['star-btn', { active: s <= reviewForm.rating }]"
                                    @click="setRating(s)"
                                    :aria-label="`${s} sao`"
                                >★</button>
                                <span class="star-label">
                                    {{ ["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Xuất sắc"][reviewForm.rating] }}
                                </span>
                            </div>
                        </div>

                        <div class="modal-section">
                            <label class="modal-label" for="review-comment">Nhận xét</label>
                            <textarea
                                id="review-comment"
                                v-model="reviewForm.comment"
                                class="review-textarea"
                                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                rows="4"
                                maxlength="1000"
                            />
                            <span class="char-count">{{ reviewForm.comment.length }}/1000</span>
                        </div>

                        <div class="modal-actions">
                            <button class="btn-outline" @click="closeReviewModal">Hủy</button>
                            <button
                                class="btn-primary"
                                :disabled="reviewSubmitting"
                                @click="submitReview"
                            >
                                <span v-if="reviewSubmitting" class="btn-spinner"></span>
                                {{ reviewSubmitting ? "Đang gửi..." : "Gửi đánh giá" }}
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <footer class="footer">
            <div class="footer-container">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M5.636 5.636a9 9 0 0112.728 0M12 2v20M2 12h20M5.636 18.364a9 9 0 0112.728 0"></path>
                        </svg>
                    </div>
                    <span class="footer-name">SportGear</span>
                </div>
                <div class="footer-copy">© 2024 SportGear. Bản quyền thuộc về Công ty TNHH Thể Thao Việt.</div>
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

* { box-sizing: border-box; margin: 0; padding: 0; }
a { text-decoration: none; }
button { font-family: inherit; }

.profile-page {
    font-family: "Inter", sans-serif;
    background-color: #f9fafb;
    color: #111827;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-wrapper {
    max-width: 1440px; margin: 0 auto;
    padding: 40px; display: flex; gap: 40px;
    width: 100%; flex: 1;
}
.content { flex: 1; min-width: 0; max-width: 900px; }

.page-header { margin-bottom: 32px; }
.page-title  { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px; }
.page-subtitle { font-size: 15px; color: #6b7280; }

.tabs-list {
    display: flex; list-style: none; gap: 32px;
    border-bottom: 1px solid #e5e7eb; margin-bottom: 32px;
    overflow-x: auto; padding-bottom: 0;
}
.tab-item {
    font-size: 15px; font-weight: 500; color: #6b7280;
    padding-bottom: 16px; cursor: pointer; position: relative;
    transition: color 0.2s; white-space: nowrap;
}
.tab-item:hover { color: #111827; }
.tab-item.active { color: #1a73e8; font-weight: 600; }
.tab-item.active::after {
    content: ""; position: absolute; bottom: -1px; left: 0;
    width: 100%; height: 2px; background-color: #1a73e8;
}

.loading-state {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; padding: 60px; color: #6b7280; font-size: 15px;
}
.spinner {
    width: 24px; height: 24px; border: 3px solid #e5e7eb;
    border-top-color: #1a73e8; border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 16px; padding: 80px 20px; color: #9ca3af;
}
.empty-state svg { width: 48px; height: 48px; }
.empty-state p   { font-size: 15px; }

.order-list { display: flex; flex-direction: column; gap: 12px; }

.order-card {
    background-color: #ffffff; border-radius: 12px;
    border: 1px solid #e5e7eb; overflow: hidden;
}

.order-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 16px; border-bottom: 1px solid #f3f4f6;
}
.order-meta-group { display: flex; align-items: center; gap: 20px; }
.meta-item        { display: flex; flex-direction: column; gap: 4px; }
.meta-label       { font-size: 11px; font-weight: 700; color: #9ca3af; }
.meta-value       { font-size: 15px; font-weight: 700; color: #111827; }
.meta-divider     { width: 1px; height: 36px; background-color: #e5e7eb; }

.status-badge {
    display: inline-flex; align-items: center;
    padding: 6px 12px; border-radius: 6px;
    font-size: 12px; font-weight: 700;
}
.status-pending   { background-color: #fff7ed; color: #ea580c; }
.status-confirmed { background-color: #fef9c3; color: #ca8a04; }
.status-shipping  { background-color: #eff6ff; color: #1a73e8; }
.status-done      { background-color: #ecfdf5; color: #10b981; }
.status-canceled  { background-color: #f3f4f6; color: #6b7280; }

.order-body { padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; }

.product-item {
    display: flex; align-items: center; gap: 16px;
    padding: 8px 0; border-bottom: 1px solid #f9fafb;
}
.product-item:last-child { border-bottom: none; }

.product-img {
    width: 64px; height: 64px; border-radius: 8px;
    object-fit: cover; border: 1px solid #f3f4f6; flex-shrink: 0;
}
.product-details { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.product-name    { font-size: 14px; font-weight: 600; color: #111827; }
.product-variant { font-size: 13px; color: #6b7280; }
.product-qty     { font-size: 13px; color: #6b7280; }
.product-price   { font-size: 14px; font-weight: 700; color: #1a73e8; margin-top: 2px; }

.btn-review {
    display: inline-flex; align-items: center; gap: 6px;
    background-color: #fffbeb; color: #d97706;
    border: 1px solid #fcd34d;
    padding: 8px 14px; border-radius: 8px;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
}
.btn-review svg   { width: 14px; height: 14px; }
.btn-review:hover { background-color: #fef3c7; border-color: #f59e0b; color: #b45309; }

.reviewed-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; background-color: #f0fdf4; color: #16a34a;
    border: 1px solid #bbf7d0; border-radius: 8px;
    font-size: 13px; font-weight: 600; white-space: nowrap; flex-shrink: 0;
}
.reviewed-badge svg { width: 14px; height: 14px; }

.order-footer {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 16px; border-top: 1px solid #f3f4f6;
    background-color: #fafbfc;
}
.order-total { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.total-breakdown { display: flex; align-items: center; gap: 6px; }
.total-text       { font-size: 14px; color: #6b7280; }
.total-sub        { font-size: 14px; font-weight: 600; color: #374151; }
.total-divider    { width: 1px; height: 20px; background: #e5e7eb; }
.total-label-final { font-weight: 600; color: #374151; }
.total-amount     { font-size: 15px; font-weight: 700; color: #1a73e8; }

.order-actions { display: flex; gap: 10px; flex-wrap: wrap; }

.btn-outline {
    background-color: #ffffff; color: #374151; border: 1px solid #d1d5db;
    padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
}
.btn-outline:hover { background-color: #f9fafb; }

.btn-primary {
    display: inline-flex; align-items: center; gap: 6px;
    background-color: #1a73e8; color: #ffffff; border: none;
    padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: background-color 0.2s;
}
.btn-primary:hover    { background-color: #1557b0; }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

.btn-danger {
    background-color: #ffffff; color: #dc2626; border: 1px solid #dc2626;
    padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
}
.btn-danger:hover { background-color: #fee2e2; }

.pagination {
    display: flex; justify-content: center; align-items: center;
    gap: 8px; margin-top: 40px;
}
.page-btn {
    width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
    background-color: #ffffff; border: 1px solid #e5e7eb;
    border-radius: 8px; font-size: 14px; color: #111827;
    cursor: pointer; transition: all 0.2s;
}
.page-btn:hover:not(.active):not(:disabled) { background-color: #f3f4f6; }
.page-btn.active   { background-color: #1a73e8; color: #ffffff; border-color: #1a73e8; font-weight: 600; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-btn svg      { width: 18px; height: 18px; }

.modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 16px;
}
.modal-box {
    background: #ffffff; border-radius: 16px; padding: 28px;
    width: 100%; max-width: 500px;
    display: flex; flex-direction: column; gap: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modal-enter-active,
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-active .modal-box,
.modal-leave-active .modal-box { transition: transform 0.25s ease, opacity 0.2s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }
.modal-enter-from .modal-box  { transform: translateY(20px); opacity: 0; }
.modal-leave-to .modal-box    { transform: translateY(10px); opacity: 0; }

.modal-header {
    display: flex; justify-content: space-between; align-items: center;
}
.modal-title { font-size: 18px; font-weight: 700; color: #111827; }
.modal-close {
    width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
    background: none; border: none; color: #9ca3af; cursor: pointer;
    border-radius: 6px; transition: all 0.2s;
}
.modal-close:hover { background-color: #f3f4f6; color: #374151; }
.modal-close svg   { width: 18px; height: 18px; }

.modal-product {
    display: flex; align-items: center; gap: 14px;
    padding: 12px; background-color: #f9fafb;
    border-radius: 10px; border: 1px solid #e5e7eb;
}
.modal-product-img  { width: 56px; height: 56px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.modal-product-name { font-size: 14px; font-weight: 600; color: #111827; }
.modal-product-sku  { font-size: 13px; color: #6b7280; margin-top: 2px; }

.modal-section { display: flex; flex-direction: column; gap: 8px; }
.modal-label   { font-size: 13px; font-weight: 600; color: #374151; }

.star-row {
    display: flex; align-items: center; gap: 4px;
}
.star-btn {
    font-size: 32px; color: #d1d5db; background: none; border: none;
    cursor: pointer; padding: 0 2px; line-height: 1;
    transition: color 0.15s, transform 0.1s;
}
.star-btn:hover,
.star-btn.active { color: #f59e0b; }
.star-btn:hover  { transform: scale(1.2); }
.star-label {
    font-size: 13px; font-weight: 600; color: #f59e0b;
    margin-left: 6px; min-width: 76px;
}

.review-textarea {
    width: 100%; padding: 10px 14px;
    border: 1px solid #e5e7eb; border-radius: 8px;
    font-size: 14px; font-family: inherit; resize: vertical;
    outline: none; color: #111827; transition: border-color 0.2s;
}
.review-textarea:focus      { border-color: #1a73e8; }
.review-textarea::placeholder { color: #9ca3af; }

.char-count { font-size: 12px; color: #9ca3af; text-align: right; }

.modal-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 4px; }

.btn-spinner {
    display: inline-block; width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
    border-radius: 50%; animation: spin 0.7s linear infinite;
}

.footer { background-color: #ffffff; border-top: 1px solid #e5e7eb; padding: 24px 0; margin-top: auto; }
.footer-container {
    max-width: 1440px; margin: 0 auto; padding: 0 40px;
    display: flex; align-items: center; justify-content: space-between;
}
.footer-brand  { display: flex; align-items: center; gap: 8px; }
.footer-logo   {
    width: 24px; height: 24px; background-color: #9ca3af; color: white;
    border-radius: 4px; display: flex; align-items: center; justify-content: center;
}
.footer-logo svg { width: 14px; height: 14px; }
.footer-name   { font-size: 14px; font-weight: 700; color: #9ca3af; }
.footer-copy   { font-size: 13px; color: #9ca3af; }
.footer-links  { display: flex; gap: 24px; }
.footer-links a { color: #4b5563; font-size: 13px; font-weight: 500; }
.footer-links a:hover { color: #111827; }
</style>