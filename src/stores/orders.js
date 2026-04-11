import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useOrder = defineStore("order", () => {
    const getToken = () =>
        JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null;

    const orders      = ref([]);
    const currentOrder = ref(null);
    const loading     = ref(false);
    const notify      = useNotify();
    const apiBase     = import.meta.env.VITE_API_BASE;

    const pagination = ref({
        total:        0,
        per_page:     10,
        current_page: 1,
        last_page:    1,
    });

    const authHeaders = () => ({
        Authorization: `Bearer ${getToken()}`,
    });

    // ── Load danh sách đơn hàng ──────────────────────────────────────
    const loadOrders = async (params = {}) => {
        loading.value = true;
        try {
            const res = await axios.get(`${apiBase}/orders`, {
                headers: authHeaders(),
                params,
            });

            orders.value = res.data.data || [];
            const meta   = res.data.meta ?? res.data;
            pagination.value = {
                total:        meta.total        ?? 0,
                per_page:     meta.per_page     ?? 10,
                current_page: meta.current_page ?? 1,
                last_page:    meta.last_page    ?? 1,
            };

            return res.data;
        } catch (error) {
            notify.toastError("Không tải được danh sách đơn hàng");
            return null;
        } finally {
            loading.value = false;
        }
    };

    // ── Lấy chi tiết 1 đơn hàng ──────────────────────────────────────
    const getOrder = async (id) => {
        try {
            const res = await axios.get(`${apiBase}/orders/${id}`, {
                headers: authHeaders(),
            });
            currentOrder.value = res.data;
            return res.data;
        } catch (error) {
            notify.toastError("Không tải được đơn hàng");
            return null;
        }
    };

    // ── Tạo đơn hàng mới ─────────────────────────────────────────────
    const createOrder = async (addressId, paymentMethod, shippingFee = 0) => {
        try {
            const res = await axios.post(
                `${apiBase}/orders`,
                {
                    address_id:     addressId,
                    payment_method: paymentMethod,
                    shipping_fee:   shippingFee,
                },
                { headers: authHeaders() }
            );
            if (res.status === 201) {
                currentOrder.value = res.data.data;
                notify.toastSuccess("Đặt hàng thành công");
                return res.data.data;
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Không tạo được đơn hàng";
            notify.toastError(msg);
            return null;
        }
    };

    // ── Cập nhật đơn hàng (admin) ────────────────────────────────────
    const updateOrder = async (id, data) => {
        try {
            const res = await axios.put(
                `${apiBase}/orders/${id}`,
                data,
                { headers: authHeaders() }
            );
            if (res.status === 200) {
                const idx = orders.value.findIndex((o) => o.id === id);
                if (idx !== -1) orders.value[idx] = { ...orders.value[idx], ...data };
                notify.toastSuccess("Cập nhật đơn hàng thành công");
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Không cập nhật được đơn hàng";
            notify.toastError(msg);
            return null;
        }
    };

    // ── Hủy đơn hàng (user — chỉ pending/confirmed) ──────────────────
    const cancelOrder = async (id) => {
        try {
            const res = await axios.patch(
                `${apiBase}/orders/${id}/cancel`,
                {},
                { headers: authHeaders() }
            );
            if (res.status === 200) {
                const idx = orders.value.findIndex((o) => o.id === id);
                if (idx !== -1) {
                    orders.value[idx] = {
                        ...orders.value[idx],
                        order_status: "cancelled",
                    };
                }
                notify.toastSuccess("Hủy đơn hàng thành công");
                return true;
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Không hủy được đơn hàng";
            notify.toastError(msg);
            return false;
        }
    };

    return {
        orders,
        currentOrder,
        pagination,
        loading,
        loadOrders,
        getOrder,
        createOrder,
        updateOrder,
        cancelOrder,
    };
});