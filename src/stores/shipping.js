import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useShipping = defineStore("shipping", () => {
  const notify = useNotify();
  const apiBase = import.meta.env.VITE_API_BASE;
  const provinces = ref([]);
  const districts = ref([]);
  const wards = ref([]);
  const shippingFee = ref(0);

  const loadProvinces = async () => {
    try {
      const res = await axios.get(`${apiBase}/provinces`);
      provinces.value = res.data.data || [];
    } catch (error) {
      console.error("loadProvinces:", error);
      notify.toastError("Không tải được tỉnh/thành");
    }
  };


  const loadDistricts = async (province_id) => {
    try {
      const res = await axios.get(`${apiBase}/districts/${province_id}`);
      districts.value = res.data.data || [];
      wards.value = []; 
    } catch (error) {
      console.error("loadDistricts:", error);
      notify.toastError("Không tải được quận/huyện");
    }
  };

  const loadWards = async (district_id) => {
    try {
      const res = await axios.get(`${apiBase}/wards/${district_id}`);
      wards.value = res.data.data || [];
    } catch (error) {
      console.error("loadWards:", error);
      notify.toastError("Không tải được phường/xã");
    }
  };

  const calculateShipping = async (address_id) => {
    try {
      const res = await axios.post(`${apiBase}/shipping-fee`, {
        address_id,
      });

      shippingFee.value = res.data?.data?.total || 0;
      return shippingFee.value;
    } catch (error) {
      console.error("calculateShipping:", error);
      notify.toastError("Không tính được phí ship");
      return 0;
    }
  };

  return {
    provinces,
    districts,
    wards,
    shippingFee,
    loadProvinces,
    loadDistricts,
    loadWards,
    calculateShipping,
  };
});