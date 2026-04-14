import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useContactStore = defineStore("contact", () => {
    const notify  = useNotify();
    const apiBase = import.meta.env.VITE_API_BASE;

    // ─── State ──────────────────────────────────────────────────
    const form = ref({
        name:    "",
        phone:   "",
        email:   "",
        topic:   "",
        message: "",
    });

    const errors     = ref({});
    const submitting = ref(false);
    const submitted  = ref(false);

    // ─── Validate (client-side) ──────────────────────────────────
    const validate = () => {
        errors.value = {};

        if (!form.value.name.trim())
            errors.value.name = "Vui lòng nhập họ tên";

        if (!form.value.email.trim())
            errors.value.email = "Vui lòng nhập email";
        else if (!/\S+@\S+\.\S+/.test(form.value.email))
            errors.value.email = "Email không hợp lệ";

        if (!form.value.topic)
            errors.value.topic = "Vui lòng chọn chủ đề";

        if (!form.value.message.trim())
            errors.value.message = "Vui lòng nhập nội dung";
        else if (form.value.message.trim().length < 10)
            errors.value.message = "Nội dung quá ngắn (tối thiểu 10 ký tự)";

        return Object.keys(errors.value).length === 0;
    };

    // ─── Actions ────────────────────────────────────────────────
    const submitForm = async () => {
        if (!validate()) return false;

        submitting.value = true;
        try {
            const res = await axios.post(`${apiBase}/contacts`, form.value);
            if (res.status === 201) {
                submitted.value = true;
                notify.toastSuccess(res.data.message || "Gửi liên hệ thành công!");
                resetForm();
                setTimeout(() => { submitted.value = false; }, 6000);
                return true;
            }
        } catch (err) {
            if (err.response?.status === 422) {
                // Map Laravel validation errors → local errors
                const laravelErrors = err.response.data.errors || {};
                Object.keys(laravelErrors).forEach((key) => {
                    errors.value[key] = laravelErrors[key][0];
                });
            } else {
                notify.toastError("Có lỗi xảy ra. Vui lòng thử lại sau.");
            }
            return false;
        } finally {
            submitting.value = false;
        }
    };

    const resetForm = () => {
        form.value   = { name: "", phone: "", email: "", topic: "", message: "" };
        errors.value = {};
    };

    return {
        form,
        errors,
        submitting,
        submitted,
        submitForm,
        resetForm,
    };
});