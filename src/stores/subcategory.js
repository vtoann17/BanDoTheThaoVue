import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useSubcategories = defineStore("subcategories", () => {
    const getToken = () =>
        JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null;

    const subcategories = ref([]);
    const notify = useNotify();
    const total = ref(0);
    const currentPage = ref(1);
    const lastPage = ref(1);
    const perPage = ref(10);
    const apiBase = import.meta.env.VITE_API_BASE;

    const authHeaders = () => ({
        Authorization: `Bearer ${getToken()}`,
    });

    const loadSubcategories = async (params = {}) => {
        try {
            const res = await axios.get(`${apiBase}/subcategories`, {
                headers: authHeaders(),
                params,
            });

            if (res.data?.data) {
                subcategories.value = res.data.data;
                total.value = res.data.total ?? 0;
                currentPage.value = res.data.current_page ?? 1;
                lastPage.value = res.data.last_page ?? 1;
                perPage.value = res.data.per_page ?? 10;
            } else {
                subcategories.value = Array.isArray(res.data) ? res.data : [];
            }
        } catch (error) {
            console.error(error);
            notify.toastError("Không tải được danh sách danh mục con");
        }
    };


    const createSubcategory = async (data) => {
        try {
            const res = await axios.post(`${apiBase}/subcategories`, data, {
                headers: authHeaders(),
            });

            if (res.status === 200 || res.status === 201) {
                subcategories.value.push(res.data);
                notify.toastSuccess("Thêm danh mục con thành công");
                return res.data;
            }
        } catch (error) {
            console.error(error);
            const msg =
                error.response?.data?.message ||
                "Lỗi không thêm được danh mục con";
            notify.toastError(msg);
            return null;
        }
    };


    const updateSubcategory = async (id, data) => {
        try {
            const res = await axios.put(`${apiBase}/subcategories/${id}`, data, {
                headers: authHeaders(),
            });

            if (res.status === 200) {
                const idx = subcategories.value.findIndex((s) => s.id === id);
                if (idx !== -1) subcategories.value[idx] = res.data.data;

                notify.toastSuccess("Cập nhật danh mục con thành công");
                return res.data.data;
            }
        } catch (error) {
            console.error(error);
            const msg =
                error.response?.data?.message ||
                "Lỗi không cập nhật được danh mục con";
            notify.toastError(msg);
            return null;
        }
    };


    const deleteSubcategory = async (id) => {
        const confirmed = await notify.swalConfirm(
            "Bạn có muốn xóa không?",
            "Bạn chắc chắn chứ"
        );
        if (!confirmed) return false;

        try {
            const res = await axios.delete(`${apiBase}/subcategories/${id}`, {
                headers: authHeaders(),
            });

            if (res.status === 200) {
                subcategories.value = subcategories.value.filter(
                    (s) => s.id !== id
                );
                notify.toastSuccess("Xóa danh mục con thành công");
                return true;
            }
        } catch (error) {
            console.error(error);
            notify.toastError("Lỗi không xóa được danh mục con");
            return false;
        }
    };

    const loadByCategory = async (category_id) => {
        try {
            const res = await axios.get(
                `${apiBase}/subcategories/category/${category_id}`,
                {
                    headers: authHeaders(),
                }
            );

            subcategories.value = res.data;
        } catch (error) {
            console.error(error);
            notify.toastError("Không tải được danh mục con theo danh mục");
        }
    };

    return {
        subcategories,
        total,
        currentPage,
        lastPage,
        perPage,
        loadSubcategories,
        createSubcategory,
        updateSubcategory,
        deleteSubcategory,
        loadByCategory,
    };
});