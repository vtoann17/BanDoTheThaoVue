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
        per_page: 2,
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
                params: { per_page: 2, ...params },
            });
            orders.value = res.data.data || [];
            pagination.value = {
                total: res.data.total,
                per_page: res.data.per_page,
                current_page: res.data.current_page,
                last_page: res.data.last_page,
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
            console.log('getOrder response:', res.data);
            currentOrder.value = res.data;
            return res.data;
        } catch (error) {
            notify.toastError("Không tải được đơn hàng");
            return null;
        }
    };

    const createOrder = async (addressId, paymentMethod, shippingFee = 0) => {
        try {
            const res = await axios.post(
                `${apiBase}/orders`,
                { address_id: addressId, payment_method: paymentMethod, shipping_fee: shippingFee, },
                { headers: authHeaders() }

            );
            if (res.status === 201) {
                currentOrder.value = res.data.data;
                return res.data.data;
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Không tạo được đơn hàng";
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
                if (idx !== -1) orders.value[idx] = { ...orders.value[idx], ...data }; // merge luôn để chắc
                notify.toastSuccess("Cập nhật đơn hàng thành công");
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Không cập nhật được đơn hàng";
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
    };
});