import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useCategories = defineStore("categories", () => {
  const getToken = () =>JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null;
  const categories = ref([]);
  const notify = useNotify();
  const apiBase = import.meta.env.VITE_API_BASE;
  const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
  });


  const loadCategories = async () => {
    try {
      const res = await axios.get(`${apiBase}/categories`, {
        headers: authHeaders(),
      });
      categories.value = Array.isArray(res.data) ? res.data : res.data.data;
    } catch (error) {
      console.error("loadCategories:", error);
      notify.toastError("Không tải được danh sách danh mục");
    }
  };

  const createCategory = async (formData) => {
  try {
    const res = await axios.post(`${apiBase}/categories`, formData, {
      headers: {
        ...authHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log("status:", res.status);
    // console.log("data:", res.data);
    if (res.status === 200 || res.status === 201) {
      categories.value.push(res.data.data);
      notify.toastSuccess("Thêm danh mục thành công");
      return res.data.data;
    }
  } catch (error) {
    const msg = error.response?.data?.message || "Lỗi không thêm được danh mục";
    notify.toastError(msg);
    return null;
  }
};


  const updateCategory = async (id, formData) => {
    try {
      formData.append("_method", "PUT");

      const res = await axios.post(`${apiBase}/categories/${id}`, formData, {
        headers: {
          ...authHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        const idx = categories.value.findIndex((c) => c.id === id);
        if (idx !== -1) categories.value[idx] = res.data.data;
        notify.toastSuccess("Sửa danh mục thành công");
        return res.data.data;
      }
    } catch (error) {
      console.error("updateCategory:", error);
      const msg =
        error.response?.data?.message || "Lỗi không sửa được danh mục";
      notify.toastError(msg);
      return null;
    }
  };

  const deleteCategory = async (id) => {
    const confirmed = await notify.swalConfirm(
      "Bạn có muốn xóa không?",
      "Bạn chắc chắn chứ"
    );
    if (!confirmed) return false;

    try {
      const res = await axios.delete(`${apiBase}/categories/${id}`, {
        headers: authHeaders(),
      });

      if (res.status === 200) {
        categories.value = categories.value.filter((c) => c.id !== id);
        notify.toastSuccess("Xóa danh mục thành công");
        return true;
      }
    } catch (error) {
      console.error("deleteCategory:", error);
      notify.toastError("Lỗi không xóa được danh mục");
      return false;
    }
  };

  return {
    categories,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
});