import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useProducts = defineStore("products", () => {
    const getToken = () =>
        JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null;

    const products = ref([]);
    const notify = useNotify();
    const total = ref(0);
    const currentPage = ref(1);
    const lastPage = ref(1);
    const perPage = ref(5);

    const apiBase = import.meta.env.VITE_API_BASE;

    const authHeaders = () => ({
        Authorization: `Bearer ${getToken()}`,
    });

    const loadProducts = async (params = {}) => {
        try {
            const res = await axios.get(`${apiBase}/products`, {
                headers: authHeaders(),
                params,
            });

            if (res.data?.data) {
                products.value = res.data.data;
                total.value = res.data.total ?? 0;
                currentPage.value = res.data.current_page ?? 1;
                lastPage.value = res.data.last_page ?? 1;
                perPage.value = res.data.per_page ?? 5;
            } else {
                products.value = Array.isArray(res.data) ? res.data : [];
            }
        } catch (error) {
            console.error(error);
            notify.toastError("Không tải được danh sách sản phẩm");
        }
    };

    const createProduct = async (formData) => {
        try {
            const res = await axios.post(`${apiBase}/admin/products`, formData, {
                headers: {
                    ...authHeaders(),
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 200 || res.status === 201) {
                products.value.unshift(res.data);
                notify.toastSuccess("Thêm sản phẩm thành công");
                return res.data;
            }
        } catch (error) {
            console.error(error);
            const msg =
                error.response?.data?.message || "Lỗi không thêm được sản phẩm";
            notify.toastError(msg);
            return null;
        }
    };

    const getProduct = async (id) => {
        try {
            const res = await axios.get(`${apiBase}/products/${id}`, {
                headers: authHeaders(),
            });
            return res.data.data ?? res.data;
        } catch (error) {
            console.error(error);
            notify.toastError("Không tải được thông tin sản phẩm");
            return null;
        }
    };
    const getProductDetail = async (slug) => {
        try {
            const res = await axios.get(`${apiBase}/products/${slug}/detail`);
            return res.data.data ?? res.data;
        } catch (error) {
            console.error(error);
            notify.toastError("Không tải được chi tiết sản phẩm");
            return null;
        }
    };
    const updateProduct = async (id, formData) => {
        try {
            formData.append("_method", "PUT");

            const res = await axios.post(`${apiBase}/admin/products/${id}`, formData, {
                headers: {
                    ...authHeaders(),
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 200) {
                const idx = products.value.findIndex((p) => p.id === id);
                if (idx !== -1) products.value[idx] = res.data.data;

                notify.toastSuccess("Cập nhật sản phẩm thành công");
                return res.data.data;
            }
        } catch (error) {
            console.error(error);
            const msg =
                error.response?.data?.message || "Lỗi không cập nhật được sản phẩm";
            notify.toastError(msg);
            return null;
        }
    };

    const deleteProduct = async (id) => {
        const confirmed = await notify.swalConfirm(
            "Bạn có muốn xóa không?",
            "Bạn chắc chắn chứ"
        );
        if (!confirmed) return false;

        try {
            const res = await axios.delete(`${apiBase}/admin/products/${id}`, {
                headers: authHeaders(),
            });

            if (res.status === 200) {
                products.value = products.value.filter((p) => p.id !== id);
                notify.toastSuccess("Xóa sản phẩm thành công");
                return true;
            }
        } catch (error) {
            console.error(error);
            notify.toastError("Lỗi không xóa được sản phẩm");
            return false;
        }
    };

    return {
        products,
        total,
        currentPage,
        lastPage,
        perPage,
        loadProducts,
        createProduct,
        getProduct,
        getProductDetail,
        updateProduct,
        deleteProduct,
    };
});