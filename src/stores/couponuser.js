import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useUserCoupons = defineStore("userCoupons", () => {
    const getToken = () => JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null;
    const notify = useNotify();
    const apiBase = import.meta.env.VITE_API_BASE;

    const userCoupons = ref([]);
    const total = ref(0);
    const currentPage = ref(1);
    const lastPage = ref(1);
    const perPage = ref(10);

    const authHeaders = () => ({
        Authorization: `Bearer ${getToken()}`,
    });
    const loadUserCoupons = async (params = {}) => {
        try {
            const res = await axios.get(`${apiBase}/user-coupons`, {
                headers: authHeaders(),
                params: {
                    search: params.search || undefined,
                    status: params.status || undefined,
                    sort_by: params.sort_by || "claimed_at",
                    sort_dir: params.sort_dir || "desc",
                    per_page: params.per_page || 10,
                    page: params.page || 1,
                },
            });

            const data = res.data;
            userCoupons.value = Array.isArray(data) ? data : data.data;
            total.value = data.total ?? userCoupons.value.length;
            currentPage.value = data.current_page ?? 1;
            lastPage.value = data.last_page ?? 1;
            perPage.value = data.per_page ?? 10;
        } catch (error) {
            console.error("loadUserCoupons:", error);
            notify.toastError("Không tải được danh sách mã giảm giá của bạn");
        }
    };

    const claimCoupon = async (couponId) => {
        try {
            const res = await axios.post(
                `${apiBase}/user-coupons/claim`,
                { coupon_id: couponId },
                {
                    headers: {
                        ...authHeaders(),
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.status === 201) {
                notify.toastSuccess("Nhận mã thành công");
                return res.data.data;
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Không nhận được mã giảm giá";
            notify.toastError(msg);
            return null;
        }
    };

    return {
        userCoupons,
        total,
        currentPage,
        lastPage,
        perPage,
        loadUserCoupons,
        claimCoupon,
    };
});