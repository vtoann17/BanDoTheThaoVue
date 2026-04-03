<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { useCoupons } from "@/stores/coupons";

const router = useRouter();
const couponStore = useCoupons();

const form = reactive({
    code: "",
    discount_type: "",
    discount_value: "",
    min_order_value: "",
});

const errors = reactive({
    code: "",
    discount_type: "",
    discount_value: "",
    min_order_value: "",
});

const loading = ref(false);

function validate() {
    errors.code = "";
    errors.discount_type = "";
    errors.discount_value = "";
    errors.min_order_value = "";
    let ok = true;

    if (!form.code.trim()) {
        errors.code = "Mã coupon không được để trống";
        ok = false;
    }
    if (!form.discount_type) {
        errors.discount_type = "Vui lòng chọn loại giảm giá";
        ok = false;
    }
    if (form.discount_value === "" || Number(form.discount_value) < 0) {
        errors.discount_value = "Giá trị giảm không được để trống";
        ok = false;
    }
    if (form.discount_type === "percent" && Number(form.discount_value) > 100) {
        errors.discount_value = "Giảm theo % không được vượt quá 100";
        ok = false;
    }
    if (form.min_order_value !== "" && Number(form.min_order_value) < 0) {
        errors.min_order_value = "Giá trị đơn tối thiểu không hợp lệ";
        ok = false;
    }
    return ok;
}

async function submitForm() {
    if (!validate()) return;

    const payload = {
        code: form.code.trim(),
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        min_order_value: form.min_order_value !== "" ? Number(form.min_order_value) : null,
    };

    loading.value = true;
    const ok = await couponStore.createCoupon(payload);
    loading.value = false;

    if (ok) {
        router.push("/couponadmin");
    } else if (couponStore.validationErrors) {
        const ve = couponStore.validationErrors;
        if (ve.code) errors.code = ve.code[0];
        if (ve.discount_type) errors.discount_type = ve.discount_type[0];
        if (ve.discount_value) errors.discount_value = ve.discount_value[0];
        if (ve.min_order_value) errors.min_order_value = ve.min_order_value[0];
    }
}

function resetForm() {
    form.code = "";
    form.discount_type = "";
    form.discount_value = "";
    form.min_order_value = "";
    errors.code = "";
    errors.discount_type = "";
    errors.discount_value = "";
    errors.min_order_value = "";
}
</script>

<template>
    <AdminLayout>
        <div class="page-content">
            <!-- Breadcrumb -->
            <nav class="breadcrumb">
                <RouterLink to="/" class="breadcrumb-link">Trang chủ</RouterLink>
                <svg class="breadcrumb-separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <RouterLink to="/couponadmin" class="breadcrumb-link">Coupon</RouterLink>
                <svg class="breadcrumb-separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <span class="breadcrumb-current">Thêm coupon mới</span>
            </nav>

            <!-- Header -->
            <div class="content-header">
                <div class="content-titles">
                    <h2>Thêm coupon mới</h2>
                    <p>Tạo mã giảm giá mới cho cửa hàng của bạn</p>
                </div>
            </div>

            <!-- Form card -->
            <div class="form-card">
                <div class="form-grid">
                    <!-- Mã coupon -->
                    <div class="form-group col-span-2">
                        <label>Mã coupon <span class="required">*</span></label>
                        <div class="input-with-icon">
                            <svg class="input-icon left" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <input
                                type="text"
                                class="form-control has-icon"
                                :class="{ 'is-error': errors.code }"
                                placeholder="VD: SUMMER2025, SALE50..."
                                v-model="form.code"
                                @input="form.code = form.code.toUpperCase()"
                            />
                        </div>
                        <p v-if="errors.code" class="error-text">{{ errors.code }}</p>
                        <p v-else class="helper-text">Mã coupon sẽ tự động được viết hoa</p>
                    </div>

                    <!-- Loại giảm giá -->
                    <div class="form-group">
                        <label>Loại giảm giá <span class="required">*</span></label>
                        <div class="select-wrap">
                            <select
                                class="form-control"
                                :class="{ 'is-error': errors.discount_type }"
                                v-model="form.discount_type"
                            >
                                <option value="">-- Chọn loại --</option>
                                <option value="percent">Phần trăm (%)</option>
                                <option value="fixed">Số tiền cố định (đ)</option>
                            </select>
                            <svg class="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        <p v-if="errors.discount_type" class="error-text">{{ errors.discount_type }}</p>
                    </div>

                    <!-- Giá trị giảm -->
                    <div class="form-group">
                        <label>Giá trị giảm <span class="required">*</span></label>
                        <div class="input-with-suffix">
                            <input
                                type="number"
                                class="form-control has-suffix"
                                :class="{ 'is-error': errors.discount_value }"
                                placeholder="0"
                                min="0"
                                :max="form.discount_type === 'percent' ? 100 : undefined"
                                v-model="form.discount_value"
                            />
                            <span class="suffix-label">
                                {{ form.discount_type === 'percent' ? '%' : 'đ' }}
                            </span>
                        </div>
                        <p v-if="errors.discount_value" class="error-text">{{ errors.discount_value }}</p>
                        <p v-else-if="form.discount_type === 'percent'" class="helper-text">Nhập giá trị từ 0 đến 100</p>
                        <p v-else-if="form.discount_type === 'fixed'" class="helper-text">Nhập số tiền giảm trực tiếp</p>
                    </div>

                    <!-- Đơn tối thiểu -->
                    <div class="form-group col-span-2">
                        <label>Giá trị đơn hàng tối thiểu</label>
                        <div class="input-with-suffix">
                            <input
                                type="number"
                                class="form-control has-suffix"
                                :class="{ 'is-error': errors.min_order_value }"
                                placeholder="Không giới hạn"
                                min="0"
                                v-model="form.min_order_value"
                            />
                            <span class="suffix-label">đ</span>
                        </div>
                        <p v-if="errors.min_order_value" class="error-text">{{ errors.min_order_value }}</p>
                        <p v-else class="helper-text">Để trống nếu không giới hạn giá trị đơn hàng</p>
                    </div>

                    <!-- Preview card -->
                    <div class="form-group col-span-2" v-if="form.code || form.discount_type">
                        <label>Xem trước coupon</label>
                        <div class="coupon-preview">
                            <div class="coupon-left">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <div>
                                    <p class="preview-code">{{ form.code || 'COUPON_CODE' }}</p>
                                    <p class="preview-min">
                                        {{ form.min_order_value
                                            ? 'Đơn tối thiểu ' + Number(form.min_order_value).toLocaleString('vi-VN') + 'đ'
                                            : 'Không giới hạn đơn tối thiểu' }}
                                    </p>
                                </div>
                            </div>
                            <div class="coupon-right">
                                <span class="preview-value" v-if="form.discount_value">
                                    {{ form.discount_type === 'percent'
                                        ? 'Giảm ' + form.discount_value + '%'
                                        : 'Giảm ' + Number(form.discount_value).toLocaleString('vi-VN') + 'đ' }}
                                </span>
                                <span class="preview-value" v-else>—</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="form-actions">
                    <button class="btn-secondary" @click="resetForm" :disabled="loading">Hủy</button>
                    <button class="btn-primary" @click="submitForm" :disabled="loading">
                        <span v-if="loading" class="spinner"></span>
                        {{ loading ? "Đang lưu..." : "Lưu coupon" }}
                    </button>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

* { box-sizing: border-box; margin: 0; padding: 0; }

.page-content {
    padding: 32px;
    max-width: 1200px;
    font-family: "Inter", sans-serif;
}

/* Breadcrumb */
.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    margin-bottom: 24px;
}

.breadcrumb-link {
    color: #6b7280;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
}

.breadcrumb-link:hover { color: #111827; }
.breadcrumb-separator { width: 14px; height: 14px; color: #9ca3af; }
.breadcrumb-current { color: #111827; font-weight: 600; }

/* Header */
.content-header { margin-bottom: 24px; }
.content-titles h2 { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
.content-titles p { font-size: 14px; color: #6b7280; }

/* Form card */
.form-card {
    background: #fff;
    border-radius: 12px;
    padding: 32px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px 32px;
}

.col-span-2 { grid-column: span 2; }

.form-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 10px;
}

.required { color: #ef4444; }

/* Inputs */
.form-control {
    width: 100%;
    border: 1px solid transparent;
    background: #f9fafb;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 14px;
    font-family: inherit;
    color: #111827;
    outline: none;
    transition: all 0.2s;
    appearance: none;
}

.form-control::placeholder { color: #9ca3af; }

.form-control:focus {
    background: #fff;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-control.is-error { border-color: #ef4444; background: #fff; }

/* Input with left icon */
.input-with-icon { position: relative; }

.input-icon.left {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 17px;
    height: 17px;
    color: #9ca3af;
    pointer-events: none;
}

.form-control.has-icon { padding-left: 42px; }

/* Select */
.select-wrap { position: relative; }
.select-wrap .form-control { padding-right: 38px; cursor: pointer; }

.select-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: #6b7280;
    pointer-events: none;
}

/* Input with suffix */
.input-with-suffix { position: relative; }
.form-control.has-suffix { padding-right: 44px; }

.suffix-label {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    font-weight: 700;
    color: #6b7280;
    pointer-events: none;
    user-select: none;
}

.helper-text { font-size: 12px; color: #9ca3af; margin-top: 8px; }
.error-text { font-size: 12px; color: #ef4444; margin-top: 6px; font-weight: 500; }

/* Coupon preview */
.coupon-preview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
    border: 1.5px dashed #93c5fd;
    border-radius: 12px;
    padding: 18px 24px;
    gap: 16px;
}

.coupon-left {
    display: flex;
    align-items: center;
    gap: 14px;
    color: #2563eb;
}

.preview-code {
    font-size: 16px;
    font-weight: 800;
    color: #1e40af;
    letter-spacing: 1.5px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.preview-min {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
    font-weight: 500;
}

.coupon-right .preview-value {
    font-size: 18px;
    font-weight: 800;
    color: #16a34a;
    white-space: nowrap;
}

/* Actions */
.form-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
}

.btn-secondary {
    background: #fff;
    color: #374151;
    border: 1px solid #d1d5db;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
}

.btn-secondary:hover:not(:disabled) { background: #f9fafb; border-color: #9ca3af; }

.btn-primary {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #2563eb;
    color: #fff;
    border: none;
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    font-family: inherit;
}

.btn-primary:hover:not(:disabled) { background: #1d4ed8; }

.btn-primary:disabled,
.btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
    width: 15px;
    height: 15px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 640px) {
    .form-grid { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: span 1; }
    .page-content { padding: 16px; }
    .form-card { padding: 20px; }
}
</style>