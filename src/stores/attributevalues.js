import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useAttributeValues = defineStore("attributeValues", () => {
  const getToken = () => JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null;

  const attributeValues = ref([]);
  const notify = useNotify();
  const total = ref(0);
  const currentPage = ref(1);
  const lastPage = ref(1);
  const perPage = ref(10);

  const apiBase = import.meta.env.VITE_API_BASE;
  const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

  const loadAttributeValues = async (params = {}) => {
    try {
      const res = await axios.get(`${apiBase}/attribute-value`, {
        headers: authHeaders(),
        params,
      });
      if (res.data?.data) {
        attributeValues.value = res.data.data;
        total.value           = res.data.total ?? 0;
        currentPage.value     = res.data.current_page ?? 1;
        lastPage.value        = res.data.last_page ?? 1;
        perPage.value         = res.data.per_page ?? 10;
      } else {
        attributeValues.value = Array.isArray(res.data) ? res.data : [];
      }
    } catch (error) {
      notify.toastError("Không tải được danh sách giá trị thuộc tính");
    }
  };

  const getAttributeValue = async (id) => {
    try {
      const res = await axios.get(`${apiBase}/attribute-value/${id}`, {
        headers: authHeaders(),
      });
      return res.data.data ?? res.data;
    } catch (error) {
      notify.toastError("Không tải được giá trị thuộc tính");
      return null;
    }
  };

  const createAttributeValue = async (data) => {
    try {
      const res = await axios.post(`${apiBase}/admin/attribute-value`, data, {
        headers: authHeaders(),
      });
      if (res.status === 200 || res.status === 201) {
        attributeValues.value.unshift(res.data.data ?? res.data);
        notify.toastSuccess("Thêm giá trị thuộc tính thành công");
        return res.data.data ?? res.data;
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Lỗi không thêm được giá trị thuộc tính";
      notify.toastError(msg);
      return null;
    }
  };

  const updateAttributeValue = async (id, data) => {
    try {
      const res = await axios.put(`${apiBase}/admin/attribute-value/${id}`, data, {
        headers: authHeaders(),
      });
      if (res.status === 200) {
        const idx = attributeValues.value.findIndex((v) => v.id === Number(id));
        if (idx !== -1) attributeValues.value[idx] = res.data.data ?? res.data;
        notify.toastSuccess("Cập nhật giá trị thuộc tính thành công");
        return res.data.data ?? res.data;
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Lỗi không cập nhật được giá trị thuộc tính";
      notify.toastError(msg);
      return null;
    }
  };

  const deleteAttributeValue = async (id) => {
    const confirmed = await notify.swalConfirm("Bạn có muốn xóa không?", "Bạn chắc chắn chứ");
    if (!confirmed) return false;

    try {
      const res = await axios.delete(`${apiBase}/admin/attribute-value/${id}`, {
        headers: authHeaders(),
      });
      if (res.status === 200) {
        attributeValues.value = attributeValues.value.filter((v) => v.id !== Number(id));
        notify.toastSuccess("Xóa giá trị thuộc tính thành công");
        return true;
      }
    } catch (error) {
      notify.toastError("Lỗi không xóa được giá trị thuộc tính");
      return false;
    }
  };

  return {
    attributeValues,
    total,
    currentPage,
    lastPage,
    perPage,
    loadAttributeValues,
    getAttributeValue,
    createAttributeValue,
    updateAttributeValue,
    deleteAttributeValue,
  };
});