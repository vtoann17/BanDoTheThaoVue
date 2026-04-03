import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useUsers = defineStore("users", () => {
    const apiBase = import.meta.env.VITE_API_BASE;
    const notify = useNotify();

    const users = ref([]);
    const total = ref(0);
    const lastPage = ref(1);

    const getToken = () => {
        const auth = localStorage.getItem("auth");
        return auth ? JSON.parse(auth).token : null;
    };
    const authHeaders = () => ({
        Authorization: `Bearer ${getToken()}`,
        Accept: "application/json",
    });
    const loadUsers = async (params = {}) => {
        try {
            const res = await axios.get(`${apiBase}/users`, {
                headers: authHeaders(),
                params: params,
            });
            const responseData = res.data;

            if (responseData.data && Array.isArray(responseData.data)) {
                users.value = responseData.data;
                total.value = responseData.total || 0;
                lastPage.value = responseData.last_page || 1;
            } else {
                users.value = Array.isArray(responseData) ? responseData : [];
                total.value = users.value.length;
            }
        } catch (error) {
            console.error("loadUsers Error:", error);
            if (error.response?.status !== 404) {
                notify.toastError("Không tải được danh sách người dùng");
            }
        }
    };
    const getUserById = async (id) => {
        try {
            const res = await axios.get(`${apiBase}/users/${id}`, {
                headers: authHeaders(),
            });
            return res.data.data || res.data;
        } catch (error) {
            console.error("getUserById Error:", error);
            notify.toastError("Không tìm thấy thông tin người dùng");
            return null;
        }
    };
    const createUser = async (formData) => {
        try {
            const res = await axios.post(`${apiBase}/users`, formData, {
                headers: {
                    ...authHeaders(),
                    "Content-Type": "multipart/form-data",
                },
            });
            notify.toastSuccess("Thêm người dùng thành công");
            return res.data.data || res.data;
        } catch (error) {
            const msg = error.response?.data?.message || "Lỗi không thêm được người dùng";
            notify.toastError(msg);
            return null;
        }
    };
    const updateUser = async (id, formData) => {
        try {
            if (formData instanceof FormData && !formData.has("_method")) {
                formData.append("_method", "PUT");
            }
            const res = await axios.post(`${apiBase}/users/${id}`, formData, {
                headers: {
                    ...authHeaders(),
                    "Content-Type": "multipart/form-data",
                },
            });
            notify.toastSuccess("Cập nhật thông tin thành công");
            return res.data.data || res.data;
        } catch (error) {
            console.error("updateUser Error:", error);
            const msg = error.response?.data?.message || "Lỗi không sửa được người dùng";
            notify.toastError(msg);
            return null;
        }
    };
    const deleteUser = async (id) => {
        const confirmed = await notify.swalConfirm(
            "Bạn có muốn xóa người dùng này?",
            "Thao tác này không thể hoàn tác!"
        );
        if (!confirmed) return false;
        try {
            await axios.delete(`${apiBase}/users/${id}`, {
                headers: authHeaders(),
            });
            notify.toastSuccess("Xóa người dùng thành công");
            return true;
        } catch (error) {
            console.error("deleteUser Error:", error);
            notify.toastError("Lỗi không xóa được người dùng");
            return false;
        }
    };
    const changePassword = async (data) => {
        try {
            const res = await axios.post(`${apiBase}/change-password`, data, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    Accept: "application/json",
                },
            });
            notify.toastSuccess(res.data.message);
            return true;
        } catch (error) {
            const msg = error.response?.data?.message || "Đã có lỗi xảy ra";
            notify.toastError(msg);
            return false;
        }
    };

    return {
        users,
        total,
        lastPage,
        changePassword,
        loadUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
    };
});