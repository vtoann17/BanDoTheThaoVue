import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useBrands = defineStore("brands", () => {
    const getToken = () => JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null;
    const brands = ref([]);
    const notify = useNotify();
    const apiBase = import.meta.env.VITE_API_BASE;
    const authHeaders = () => ({
        Authorization: `Bearer ${getToken()}`,
    });
    const loadBrands = async () => {
        try {
            const res = await axios.get(`${apiBase}/brands`, {
                headers: authHeaders(),
            });
            brands.value = Array.isArray(res.data) ? res.data : res.data.data;
        } catch (error) {
            console.error("loadBrands:", error);
            notify.toastError("Không tải được danh sách thương hiệu");
        }
    };
    const createBrand = async (formData) => {
        try {
            const res = await axios.post(`${apiBase}/brands`, formData, {
                headers: {
                    ...authHeaders(),
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res.status === 200 || res.status === 201) {
                brands.value.push(res.data.data);
                notify.toastSuccess("Thêm thương hiệu thành công");
                return res.data.data;
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Lỗi không thêm được thương hiệu";
            notify.toastError(msg);
            return null;
        }
    };
    const updateBrand = async (id, formData) => {
        try {
            formData.append("_method", "PUT");

            const res = await axios.post(`${apiBase}/brands/${id}`, formData, {
                headers: {
                    ...authHeaders(),
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res.status === 200) {
                const idx = brands.value.findIndex((c) => c.id === id);
                if (idx !== -1) brands.value[idx] = res.data.data;
                notify.toastSuccess("Sửa thương hiệu thành công");
                return res.data.data;
            }
        } catch (error) {
            console.error("updateBrand:", error);
            const msg =
                error.response?.data?.message || "Lỗi không sửa được thương hiệu";
            notify.toastError(msg);
            return null;
        }
    };
    const deleteBrand = async (id) => {
        const confirmed = await notify.swalConfirm(
            "Bạn có muốn xóa không?",
            "Bạn chắc chắn chứ"
        );
        if (!confirmed) return false;

        try {
            const res = await axios.delete(`${apiBase}/brands/${id}`, {
                headers: authHeaders(),
            });

            if (res.status === 200 || res.status === 204) {
                brands.value = brands.value.filter((b) => b.id !== id);
                notify.toastSuccess("Xóa thương hiệu thành công");
                return true;
            }
        } catch (error) {
            console.error("deleteBrand:", error);
            notify.toastError("Lỗi không xóa được thương hiệu");
            return false;
        }
    };

    return {
        brands,
        loadBrands,
        createBrand,
        updateBrand,
        deleteBrand,
    };
});