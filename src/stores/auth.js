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

  const register = async (data) => {
    try {
      const res = await axios.post(`${apiBase}/register`, data, {
        headers: { Accept: "application/json" },
      });

      if (res.status === 200 || res.status === 201) {
        notify.toastSuccess("Đăng ký thành công");
        router.push("/login");
      }
    } catch (error) {
      notify.toastError(error.response?.data?.message || "Đăng ký thất bại");
      console.log("Register error:", error);
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
      notify.toastError(
        error.response?.data?.message || "Đăng nhập thất bại"
      );
      console.log("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      const infor = localStorage.getItem("auth");

      if (infor) {
        const data = JSON.parse(infor);

        await axios.post(
          `${apiBase}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
              Accept: "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.log("Logout error:", error);
    }

    localStorage.removeItem("auth");
    auth.value = null;
    user.value = null;
    router.push("/login");
  };

  const getUser = async () => {
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

    try {
      const res = await axios.get(`${apiBase}/getUser`);

      if (res.status === 200) {
        user.value = res.data;
      } else {
        logout();
      }
    } catch (error) {
      console.log("Lỗi lấy thông tin user:", error);
      logout();
    }
  };

  return {
    auth,
    user,
    register,
    login,
    logout,
    getUser,
  };
});