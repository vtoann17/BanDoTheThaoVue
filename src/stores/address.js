import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useAddress = defineStore("address", () => {
  const getToken = () =>
    JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null;
  const addresses = ref([]);
  const notify = useNotify();
  const apiBase = import.meta.env.VITE_API_BASE;

  const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
  });
  const loadAddresses = async () => {
    try {
      const res = await axios.get(`${apiBase}/addresses`, {
        headers: authHeaders(),
      });

      addresses.value = Array.isArray(res.data)
        ? res.data
        : res.data.data;
    } catch (error) {
      console.error("loadAddresses:", error);
      notify.toastError("Không tải được địa chỉ");
    }
  };

  const createAddress = async (data) => {
    try {
      const res = await axios.post(`${apiBase}/addresses`, data, {
        headers: authHeaders(),
      });

      if (res.status === 200 || res.status === 201) {
        addresses.value.unshift(res.data.data);
        notify.toastSuccess("Thêm địa chỉ thành công");
        return res.data.data;
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Lỗi không thêm được địa chỉ";
      notify.toastError(msg);
      return null;
    }
  };

  const updateAddress = async (id, data) => {
    try {
      const res = await axios.put(`${apiBase}/addresses/${id}`, data, {
        headers: authHeaders(),
      });

      if (res.status === 200) {
        const idx = addresses.value.findIndex((a) => a.id === id);
        if (idx !== -1) addresses.value[idx] = res.data.data;

        notify.toastSuccess("Cập nhật địa chỉ thành công");
        return res.data.data;
      }
    } catch (error) {
      console.error("updateAddress:", error);
      const msg =
        error.response?.data?.message || "Lỗi không cập nhật địa chỉ";
      notify.toastError(msg);
      return null;
    }
  };

  const deleteAddress = async (id) => {
    const confirmed = await notify.swalConfirm(
      "Bạn có muốn xóa không?",
      "Bạn chắc chắn chứ"
    );
    if (!confirmed) return false;

    try {
      const res = await axios.delete(`${apiBase}/addresses/${id}`, {
        headers: authHeaders(),
      });

      if (res.status === 200 || res.status === 204) {
        addresses.value = addresses.value.filter((a) => a.id !== id);
        notify.toastSuccess("Xóa địa chỉ thành công");
        return true;
      }
    } catch (error) {
      console.error("deleteAddress:", error);
      notify.toastError("Lỗi không xóa được địa chỉ");
      return false;
    }
  };

  return {
    addresses,
    loadAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  };
});