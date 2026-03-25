import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useForgotPass = defineStore("forgotpass", () => {
  const notify = useNotify();
  const apiBase = import.meta.env.VITE_API_BASE;

  const email = ref("");
  const sendOtp = async (data) => {
  try {
    const res = await axios.post(`${apiBase}/forgot-password`, data);
    email.value = data.email;
    notify.toastSuccess(res.data.message);
    return true;
  } catch (error) {
    notify.toastError(error.response?.data?.message || "Lỗi gửi OTP");
    return false;
  }
};

  const verifyOtp = async (data) => {
    try {
      const res = await axios.post(`${apiBase}/verify-otp`, data);

      notify.toastSuccess(res.data.message);
      return true;
    } catch (error) {
      notify.toastError(error.response?.data?.message || "OTP sai");
      return false;
    }
  };

  const resetPassword = async (data) => {
    try {
      const res = await axios.post(`${apiBase}/reset-password`, data);

      notify.toastSuccess(res.data.message);
    } catch (error) {
      notify.toastError(error.response?.data?.message || "Lỗi reset");
    }
  };

  return {
    email,
    sendOtp,
    verifyOtp,
    resetPassword,
  };
});