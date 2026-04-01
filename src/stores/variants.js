import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useVariants = defineStore("variants", () => {
  const getToken = () => JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null;

  const variants = ref([]);
  const notify = useNotify();
  const total = ref(0);
  const currentPage = ref(1);
  const lastPage = ref(1);
  const perPage = ref(10);

  const apiBase = import.meta.env.VITE_API_BASE;
  const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

  const loadVariants = async (params = {}) => {
    try {
      const res = await axios.get(`${apiBase}/variant`, {
        headers: authHeaders(),
        params,
      });
      if (res.data?.data) {
        variants.value = res.data.data;
        total.value = res.data.total ?? 0;
        currentPage.value = res.data.current_page ?? 1;
        lastPage.value = res.data.last_page ?? 1;
        perPage.value = res.data.per_page ?? 10;
      } else {
        variants.value = Array.isArray(res.data) ? res.data : [];
      }
    } catch (error) {
      notify.toastError("Không tải được danh sách biến thể");
    }
  };

  const getVariant = async (id) => {
    try {
      const res = await axios.get(`${apiBase}/variant/${id}`, {
        headers: authHeaders(),
      });
      return res.data.data ?? res.data;
    } catch (error) {
      notify.toastError("Không tải được biến thể");
      return null;
    }
  };

  const createVariant = async (data) => {
    try {
      const res = await axios.post(`${apiBase}/variant`, data, {
        headers: {
          ...authHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200 || res.status === 201) {
        variants.value.unshift(res.data.data ?? res.data);
        notify.toastSuccess("Thêm biến thể thành công");
        return res.data.data ?? res.data;
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Lỗi không thêm được biến thể";
      notify.toastError(msg);
      return null;
    }
  };

  const updateVariant = async (id, data) => {
    try {
      const res = await axios.put(`${apiBase}/variant/${id}`, data, {
        headers: authHeaders(),
      });
      if (res.status === 200) {
        const idx = variants.value.findIndex((v) => v.id === Number(id));
        if (idx !== -1) variants.value[idx] = res.data.data ?? res.data;
        notify.toastSuccess("Cập nhật biến thể thành công");
        return res.data.data ?? res.data;
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Lỗi không cập nhật được biến thể";
      notify.toastError(msg);
      return null;
    }
  };

  const deleteVariant = async (id) => {
    const confirmed = await notify.swalConfirm(
      "Bạn có muốn xóa không?",
      "Bạn chắc chắn chứ"
    );
    if (!confirmed) return false;

    try {
      const res = await axios.delete(`${apiBase}/variant/${id}`, {
        headers: authHeaders(),
      });
      if (res.status === 200) {
        variants.value = variants.value.filter((v) => v.id !== Number(id));
        notify.toastSuccess("Xóa biến thể thành công");
        return true;
      }
    } catch (error) {
      notify.toastError("Lỗi không xóa được biến thể");
      return false;
    }
  };

  return {
    variants,
    total,
    currentPage,
    lastPage,
    perPage,
    loadVariants,
    getVariant,
    createVariant,
    updateVariant,
    deleteVariant,
  };
});