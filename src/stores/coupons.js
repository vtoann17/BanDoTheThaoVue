import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useCoupons = defineStore("coupons", () => {
    const getToken = () => JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null;
    const coupons = ref([]);
    const notify = useNotify();
    const apiBase = import.meta.env.VITE_API_BASE;

    const authHeaders = () => ({
        Authorization: `Bearer ${getToken()}`,
    });

    const loadCoupons = async () => {
        try {
            const res = await axios.get(`${apiBase}/coupons`, {
                headers: authHeaders(),
            });
            coupons.value = Array.isArray(res.data) ? res.data : res.data.data;
        } catch (error) {
            console.error("loadCoupons:", error);
            notify.toastError("Không tải được danh sách mã giảm giá");
        }
    };

    const createCoupon = async (formData) => {
        try {
            const res = await axios.post(`${apiBase}/coupons`, formData, {
                headers: {
                    ...authHeaders(),
                    "Content-Type": "application/json",
                },
            });
            if (res.status === 200 || res.status === 201) {
                coupons.value.push(res.data.data);
                notify.toastSuccess("Thêm mã giảm giá thành công");
                return res.data.data;
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Lỗi không thêm được mã giảm giá";
            notify.toastError(msg);
            return null;
        }
    };

    const updateCoupon = async (id, payload) => {
        try {
            const res = await axios.put(`${apiBase}/coupons/${id}`, payload, {
                headers: {
                    ...authHeaders(),
                    "Content-Type": "application/json",
                },
            });
            if (res.status === 200) {
                const idx = coupons.value.findIndex((c) => c.id === id);
                if (idx !== -1) coupons.value[idx] = res.data.data;
                notify.toastSuccess("Sửa mã giảm giá thành công");
                return res.data.data;
            }
        } catch (error) {
            console.error("updateCoupon:", error);
            const msg = error.response?.data?.message || "Lỗi không sửa được mã giảm giá";
            notify.toastError(msg);
            return null;
        }
    };

    const getCouponById = async (id) => {
        try {
            const res = await axios.get(`${apiBase}/coupons/${id}`, {
                headers: authHeaders(),
            });
            return res.data.data || res.data;
        } catch (error) {
            console.error("getCouponById:", error);
            notify.toastError("Không tìm thấy mã giảm giá");
            return null;
        }
    };

    const deleteCoupon = async (id) => {
        if (!id) return false;
        const confirmed = await notify.swalConfirm(
            "Bạn có muốn xóa không?",
            "Bạn chắc chắn chứ"
        );
        if (!confirmed) return false;

        try {
            const res = await axios.delete(`${apiBase}/coupons/${id}`, {
                headers: authHeaders(),
            });
            if (res.status === 200 || res.status === 204) {
                coupons.value = coupons.value.filter((b) => b.id !== id);
                notify.toastSuccess("Xóa mã giảm giá thành công");
                return true;
            }
            return false;
        } catch (error) {
            console.error("deleteCoupon:", error);
            notify.toastError("Lỗi không xóa được mã giảm giá");
            return false;
        }
    };

    const applyCoupon = async (code, orderTotal) => {
        try {
            const res = await axios.post(`${apiBase}/coupons/apply`, {
                code,
                order_total: orderTotal,
            });
            if (res.status === 200) {
                notify.toastSuccess("Áp dụng mã giảm giá thành công");
                return res.data; // { code, discount_type, discount, final_total }
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Mã giảm giá không hợp lệ";
            notify.toastError(msg);
            return null;
        }
    };

    return {
        coupons,
        getCouponById,
        loadCoupons,
        createCoupon,
        updateCoupon,
        deleteCoupon,
        applyCoupon, 
    };
});