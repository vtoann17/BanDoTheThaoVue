import { defineStore } from "pinia";
import axios from "axios";
import { ref, computed } from "vue";
import { useNotify } from "@/composables/useNotify";

const baseUrl = import.meta.env.VITE_API_BASE.replace('/api', '');

export const useCart = defineStore("cart", () => {
    const getToken = () =>
        JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null;

    const items = ref([]);
    const notify = useNotify();
    const apiBase = import.meta.env.VITE_API_BASE;

    const authHeaders = () => ({
        Authorization: `Bearer ${getToken()}`,
    });

    const totalItems = computed(() =>
        items.value.reduce((sum, item) => sum + item.quantity, 0)
    );

    const loadCart = async () => {
        try {
            const res = await axios.get(`${apiBase}/cart`, {
                headers: authHeaders(),
            });
            const data = Array.isArray(res.data) ? res.data : [];
            items.value = data.map(item => ({
                ...item,
                image: item.image
                ? item.image.replace('http://localhost', baseUrl)
                : null,
            }));
        } catch (error) {
            notify.toastError("Không tải được giỏ hàng");
        }
    };

    const addItem = async (variantId, quantity = 1) => {
        try {
            const res = await axios.post(
                `${apiBase}/cart`,
                { variant_id: variantId, quantity },
                { headers: authHeaders() }
            );
            if (res.status === 200 || res.status === 201) {
                await loadCart();
                notify.toastSuccess("Đã thêm vào giỏ hàng");
                return true;
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Không thêm được vào giỏ hàng";
            notify.toastError(msg);
            return false;
        }
    };

    const updateQty = async (cartId, quantity) => {
        if (quantity < 1) return;
        try {
            const res = await axios.put(
                `${apiBase}/cart/${cartId}`,
                { quantity },
                { headers: authHeaders() }
            );
            if (res.status === 200) {
                const idx = items.value.findIndex((i) => i.id === cartId);
                if (idx !== -1) {
                    items.value[idx] = {
                        ...items.value[idx],
                        quantity,
                    };
                    notify.toastSuccess("Đã cập nhật số lượng");
                }
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Không cập nhật được số lượng";
            notify.toastError(msg);
        }
    };

    const removeItem = async (cartId) => {
        try {
            const res = await axios.delete(`${apiBase}/cart/${cartId}`, {
                headers: authHeaders(),
            });
            if (res.status === 200) {
                items.value = items.value.filter((i) => i.id !== cartId);
                notify.toastSuccess("Đã xóa khỏi giỏ hàng");
            }
        } catch (error) {
            notify.toastError("Không xóa được sản phẩm");
        }
    };

    const clearCart = async () => {
        const confirmed = await notify.swalConfirm(
            "Xóa tất cả?",
            "Bạn chắc chắn muốn xóa toàn bộ giỏ hàng?"
        );
        if (!confirmed) return;
        try {
            await Promise.all(
                items.value.map((item) =>
                    axios.delete(`${apiBase}/cart/${item.id}`, {
                        headers: authHeaders(),
                    })
                )
            );
            items.value = [];
            notify.toastSuccess("Đã xóa tất cả");
        } catch (error) {
            notify.toastError("Xóa không thành công");
        }
    };

    return {
        items,
        totalItems,
        loadCart,
        addItem,
        updateQty,
        removeItem,
        clearCart,
    };
});