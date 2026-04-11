import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useOrder = defineStore("order", () => {
    const getToken = () =>
        JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null;

    const orders = ref([]);
    const currentOrder = ref(null);
    const notify = useNotify();
    const apiBase = import.meta.env.VITE_API_BASE;
    const pagination = ref({
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
    });

    const authHeaders = () => ({
        Authorization: `Bearer ${getToken()}`,
    });

    const loadOrders = async (params = {}) => {
        try {
            const res = await axios.get(`${apiBase}/orders`, {
                headers: authHeaders(),
                params: {
                    sort_by: 'created_at',
                    sort_dir: 'desc',
                    ...params,
                }

            });
            console.log('API response:', res.data);

            orders.value = res.data.data || [];
            const meta = res.data.meta ?? res.data;
            pagination.value = {
                total: meta.total ?? 0,
                per_page: meta.per_page ?? 10,
                current_page: meta.current_page ?? 1,
                last_page: meta.last_page ?? 1,
            };

            return res.data;
        } catch (error) {
            notify.toastError("Không tải được danh sách đơn hàng");
            return null;
        }
    };

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

    const createOrder = async (
        addressId,
        paymentMethod,
        shippingFee = 0,
        couponCode = null,
        discount = 0,
        finalTotal = null
    ) => {
        try {
            const res = await axios.post(
                `${apiBase}/orders`,
                {
                    address_id: addressId,
                    payment_method: paymentMethod,
                    shipping_fee: shippingFee,
                    coupon_code: couponCode,
                    discount: discount,
                    final_total: finalTotal,
                },
                { headers: authHeaders() }
            );

            if (res.status === 201) {
                currentOrder.value = res.data.data;
                return res.data.data;
            }
        } catch (error) {
            const msg =
                error.response?.data?.message || "Không tạo được đơn hàng";
            notify.toastError(msg);
            return null;
        }
    };

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

    const cancelOrder = async (id, cancelReason = null) => {
        try {
            const res = await axios.patch(
                `${apiBase}/orders/${id}/cancel`,
                { cancel_reason: cancelReason },
                { headers: authHeaders() }
            );
            if (res.status === 200) {
                const idx = orders.value.findIndex((o) => o.id === id);
                if (idx !== -1) {
                    orders.value[idx] = {
                        ...orders.value[idx],
                        order_status: 'cancelled',
                    };
                }
                if (currentOrder.value?.id === id) {
                    currentOrder.value = res.data.data;
                }
                notify.toastSuccess("Hủy đơn hàng thành công");
                return res.data.data;
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Không thể hủy đơn hàng";
            notify.toastError(msg);
            return null;
        }
    };

    return {
        orders,
        currentOrder,
        pagination,
        loadOrders,
        getOrder,
        createOrder,
        updateOrder,
        cancelOrder,
    };
});