import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useReviews = defineStore("reviews", () => {
  const getToken = () =>
    JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null;

  const reviews = ref([]);
  const notify = useNotify();
  const total = ref(0);
  const currentPage = ref(1);
  const lastPage = ref(1);
  const perPage = ref(5);
  const apiBase = import.meta.env.VITE_API_BASE;

  const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
  });

  // Load danh sách
  const loadReviews = async (params = {}) => {
    try {
      const res = await axios.get(`${apiBase}/reviews`, {
        headers: authHeaders(),
        params,
      });
      if (res.data?.data) {
        reviews.value = res.data.data;
        total.value = res.data.total ?? 0;
        currentPage.value = res.data.current_page ?? 1;
        lastPage.value = res.data.last_page ?? 1;
        perPage.value = res.data.per_page ?? 10;
      } else {
        reviews.value = Array.isArray(res.data) ? res.data : [];
      }
    } catch (error) {
      notify.toastError("Không tải được danh sách đánh giá");
    }
  };

  // Thêm
  const createReview = async (formData) => {
    try {
      const res = await axios.post(`${apiBase}/reviews`, formData, {
        headers: {
          ...authHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200 || res.status === 201) {
        reviews.value.unshift(res.data.data);
        notify.toastSuccess("Thêm đánh giá thành công");
        return res.data.data;
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Lỗi không thêm được đánh giá";
      notify.toastError(msg);
      return null;
    }
  };

  // Sửa
  const updateReview = async (id, formData) => {
    try {
      formData.append("_method", "PUT");

      const res = await axios.post(`${apiBase}/admin/reviews/${id}`, formData, {
        headers: {
          ...authHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        const idx = reviews.value.findIndex((r) => r.id === id);
        if (idx !== -1) reviews.value[idx] = res.data.data;
        notify.toastSuccess("Sửa đánh giá thành công");
        return res.data.data;
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Lỗi không sửa được đánh giá";
      notify.toastError(msg);
      return null;
    }
  };

  // Xoá
  const deleteReview = async (id) => {
    const confirmed = await notify.swalConfirm(
      "Bạn có muốn xóa không?",
      "Bạn chắc chắn chứ"
    );
    if (!confirmed) return false;

    try {
      const res = await axios.delete(`${apiBase}/admin/reviews/${id}`, {
        headers: authHeaders(),
      });

      if (res.status === 200) {
        reviews.value = reviews.value.filter((r) => r.id !== id);
        notify.toastSuccess("Xóa đánh giá thành công");
        return true;
      }
    } catch (error) {
      notify.toastError("Lỗi không xóa được đánh giá");
      return false;
    }
  };

  return {
    reviews,
    total,
    currentPage,
    lastPage,
    perPage,
    loadReviews,
    createReview,
    updateReview,
    deleteReview,
  };
});