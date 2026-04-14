import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useAttributes = defineStore("attributes", () => {
  const getToken = () => JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null;

  const attributes = ref([]);
  const notify = useNotify();
  const total = ref(0);
  const currentPage = ref(1);
  const lastPage = ref(1);
  const perPage = ref(10);

  const apiBase = import.meta.env.VITE_API_BASE;
  const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

  const loadAttributes = async (params = {}) => {
    try {
      const res = await axios.get(`${apiBase}/attributes`, {
        headers: authHeaders(),
        params,
      });
      if (res.data?.data) {
        attributes.value = res.data.data;
        total.value       = res.data.total ?? 0;
        currentPage.value = res.data.current_page ?? 1;
        lastPage.value    = res.data.last_page ?? 1;
        perPage.value     = res.data.per_page ?? 10;
      } else {
        attributes.value = Array.isArray(res.data) ? res.data : [];
      }
    } catch (error) {
      notify.toastError("Không tải được danh sách thuộc tính");
    }
  };

  const getAttribute = async (id) => {
    try {
      const res = await axios.get(`${apiBase}/attributes/${id}`, {
        headers: authHeaders(),
      });
      return res.data.data ?? res.data;
    } catch (error) {
      notify.toastError("Không tải được thuộc tính");
      return null;
    }
  };

  const createAttribute = async (data) => {
    try {
      const res = await axios.post(`${apiBase}/admin/attributes`, data, {
        headers: authHeaders(),
      });
      if (res.status === 200 || res.status === 201) {
        attributes.value.unshift(res.data.data ?? res.data);
        notify.toastSuccess("Thêm thuộc tính thành công");
        return res.data.data ?? res.data;
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Lỗi không thêm được thuộc tính";
      notify.toastError(msg);
      return null;
    }
  };

  const updateAttribute = async (id, data) => {
    try {
      const res = await axios.put(`${apiBase}/admin/attributes/${id}`, data, {
        headers: authHeaders(),
      });
      if (res.status === 200) {
        const idx = attributes.value.findIndex((a) => a.id === Number(id));
        if (idx !== -1) attributes.value[idx] = res.data.data ?? res.data;
        notify.toastSuccess("Cập nhật thuộc tính thành công");
        return res.data.data ?? res.data;
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Lỗi không cập nhật được thuộc tính";
      notify.toastError(msg);
      return null;
    }
  };

  const deleteAttribute = async (id) => {
    const confirmed = await notify.swalConfirm(
      "Bạn có muốn xóa không?",
      "Bạn chắc chắn chứ"
    );
    if (!confirmed) return false;

    try {
      const res = await axios.delete(`${apiBase}/admin/attributes/${id}`, {
        headers: authHeaders(),
      });
      if (res.status === 200) {
        attributes.value = attributes.value.filter((a) => a.id !== Number(id));
        notify.toastSuccess("Xóa thuộc tính thành công");
        return true;
      }
    } catch (error) {
      notify.toastError("Lỗi không xóa được thuộc tính");
      return false;
    }
  };

  return {
    attributes,
    total,
    currentPage,
    lastPage,
    perPage,
    loadAttributes,
    getAttribute,
    createAttribute,
    updateAttribute,
    deleteAttribute,
  };
});