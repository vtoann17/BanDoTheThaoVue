import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const usePayment = defineStore("payment", () => {
    const getToken = () =>
        JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null;

    const notify = useNotify();
    const apiBase = import.meta.env.VITE_API_BASE;
    const loading = ref(false);

    const authHeaders = () => ({
        Authorization: `Bearer ${getToken()}`,
    });

    const payWithVnpay = async (orderId) => {
        loading.value = true;
        try {
            const res = await axios.post(
                `${apiBase}/orders/${orderId}/pay/vnpay`,
                {},
                { headers: authHeaders() }
            );
            console.log("VNPAY URL:", res.data.payment_url);
            if (res.data.payment_url) {
                window.location.href = res.data.payment_url;
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Không tạo được link thanh toán";
            notify.toastError(msg);
        } finally {
            loading.value = false;
        }
    };

    const payWithCod = async (orderId) => {
        loading.value = true;
        try {
            const res = await axios.post(
                `${apiBase}/orders/${orderId}/pay/cod`,
                {},
                { headers: authHeaders() }
            );
            if (res.status === 200) {
                notify.toastSuccess("Đặt hàng thành công");
                return true;
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Không xác nhận được đơn COD";
            notify.toastError(msg);
            return false;
        } finally {
            loading.value = false;
        }
    };

    const payWithMomo = async (orderId) => {
        loading.value = true;
        try {
            const res = await axios.post(
                `${apiBase}/momo/pay`,
                { order_id: orderId },
                { headers: authHeaders() }
            );
            if (res.data.payUrl) {
                window.location.href = res.data.payUrl;
            } else {
                notify.toastError("Không lấy được link thanh toán MoMo");
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Thanh toán MoMo thất bại";
            notify.toastError(msg);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        payWithVnpay,
        payWithCod,
        payWithMomo,
    };
});