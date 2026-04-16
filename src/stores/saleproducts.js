import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useSaleProducts = defineStore("saleProducts", () => {
    const apiBase = import.meta.env.VITE_API_BASE;
    const notify = useNotify();
    const flashSaleItems = ref([]);
    const flashSaleEndTime = ref(null);
    const flashSaleLoading = ref(false);
    const saleProducts = ref([]);
    const saleLoading = ref(false);

    const loadFlashSale = async () => {
        flashSaleLoading.value = true;
        try {
            const res = await axios.get(`${apiBase}/products/flash-sale`);
            flashSaleItems.value = res.data.data ?? [];
            flashSaleEndTime.value = res.data.end_time ?? null;
        } catch (error) {
            console.error("loadFlashSale:", error);
            notify.toastError("Không tải được flash sale");
        } finally {
            flashSaleLoading.value = false;
        }
    };

    const loadSaleProducts = async () => {
        saleLoading.value = true;
        try {
            const res = await axios.get(`${apiBase}/products/sale`);
            saleProducts.value = res.data.data ?? [];
        } catch (error) {
            console.error("loadSaleProducts:", error);
            notify.toastError("Không tải được sản phẩm giảm giá");
        } finally {
            saleLoading.value = false;
        }
    };

    return {
        flashSaleItems,
        flashSaleEndTime,
        flashSaleLoading,
        loadFlashSale,
        saleProducts,
        saleLoading,
        loadSaleProducts,
    };
});