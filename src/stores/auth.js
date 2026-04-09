import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import router from "@/router";
import { useNotify } from "@/composables/useNotify";

export const useAuth = defineStore("auth", () => {
  const notify = useNotify();
  const apiBase = import.meta.env.VITE_API_BASE;

  const auth = ref(null);
  const user = ref(null);
  let _fetchingUser = null;

  const register = async (data) => {
    try {
      const res = await axios.post(`${apiBase}/register`, data, {
        headers: { Accept: "application/json" },
      });
      if (res.status === 200 || res.status === 201) {
        notify.toastSuccess("Đăng ký thành công");
        setTimeout(() => router.push("/auth/login"), 1000);
      }
    } catch (error) {
      notify.toastError(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  const login = async (data) => {
    try {
      const res = await axios.post(`${apiBase}/login`, data, {
        headers: { Accept: "application/json" },
      });
      if (res.status === 200) {
        const token = res.data.token;
        auth.value = { token };
        localStorage.setItem("auth", JSON.stringify({ token }));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        axios.defaults.headers.common["Accept"] = "application/json";
        notify.toastSuccess("Đăng nhập thành công");
        await getUser();
        router.push("/");
      }
    } catch (error) {
      notify.toastError(error.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  const loginGoogle = async (token) => {
    auth.value = { token };
    localStorage.setItem("auth", JSON.stringify({ token }));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.defaults.headers.common["Accept"] = "application/json";
    notify.toastSuccess("Đăng nhập Google thành công");
    await getUser();
    router.push("/");
  };

  const logout = async () => {
    try {
      const infor = localStorage.getItem("auth");
      if (infor) {
        const data = JSON.parse(infor);
        await axios.post(`${apiBase}/logout`, {}, {
          headers: {
            Authorization: `Bearer ${data.token}`,
            Accept: "application/json",
          },
        });
      }
    } catch (error) {
      console.log("Logout error:", error);
    }
    localStorage.removeItem("auth");
    auth.value = null;
    user.value = null;
  };

  const getUser = async () => {
    if (user.value) return;           // đã có data rồi
    if (_fetchingUser) return _fetchingUser; // đang fetch → chờ promise cũ

    const infor = localStorage.getItem("auth");
    if (!infor) {
      auth.value = null;
      user.value = null;
      return;
    }

    const data = JSON.parse(infor);
    auth.value = data;
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    axios.defaults.headers.common["Accept"] = "application/json";

    _fetchingUser = axios.get(`${apiBase}/getUser`)
      .then(res => {
        if (res.status === 200) user.value = res.data;
        else logout();
      })
      .catch(() => logout())
      .finally(() => { _fetchingUser = null; }); // ← reset sau khi xong

    return _fetchingUser;
  };

  return { auth, user, register, login, logout, getUser, loginGoogle };
});