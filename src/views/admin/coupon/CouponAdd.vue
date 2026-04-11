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
  max_discount: "",
  min_order_value: "",
  usage_limit: "",
  start_date: "",
  end_date: "",
  is_active: true,
});

const errors = reactive({
  code: "",
  discount_type: "",
  discount_value: "",
  max_discount: "",
  min_order_value: "",
  usage_limit: "",
  start_date: "",
  end_date: "",
});

const loading = ref(false);

function validate() {
  Object.keys(errors).forEach((k) => (errors[k] = ""));
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
  if (form.max_discount !== "" && Number(form.max_discount) < 0) {
    errors.max_discount = "Giảm tối đa không hợp lệ";
    ok = false;
  }
  if (form.min_order_value !== "" && Number(form.min_order_value) < 0) {
    errors.min_order_value = "Giá trị đơn tối thiểu không hợp lệ";
    ok = false;
  }
  if (form.usage_limit !== "" && Number(form.usage_limit) < 1) {
    errors.usage_limit = "Số lần dùng tối thiểu là 1";
    ok = false;
  }
  if (form.end_date && form.start_date && form.end_date < form.start_date) {
    errors.end_date = "Ngày kết thúc phải sau ngày bắt đầu";
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
    max_discount: form.max_discount !== "" ? Number(form.max_discount) : null,
    min_order_value:
      form.min_order_value !== "" ? Number(form.min_order_value) : null,
    usage_limit: form.usage_limit !== "" ? Number(form.usage_limit) : null,
    start_date: form.start_date || null,
    end_date: form.end_date || null,
    is_active: form.is_active,
  };
  loading.value = true;
  const ok = await couponStore.createCoupon(payload);
  loading.value = false;
  if (ok) router.push("/couponadmin");
}

function resetForm() {
  Object.assign(form, {
    code: "",
    discount_type: "",
    discount_value: "",
    max_discount: "",
    min_order_value: "",
    usage_limit: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });
  Object.keys(errors).forEach((k) => (errors[k] = ""));
}
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <nav class="breadcrumb">
        <RouterLink to="/" class="breadcrumb-link">Trang chủ</RouterLink>
        <svg
          class="breadcrumb-separator"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
        <RouterLink to="/couponadmin" class="breadcrumb-link"
          >Mã giảm giá</RouterLink
        >
        <svg
          class="breadcrumb-separator"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span class="breadcrumb-current">Thêm mã giảm giá mới</span>
      </nav>

      <div class="content-header">
        <div class="content-titles">
          <h2>Thêm mã giảm giá mới</h2>
          <p>Tạo mã giảm giá mới cho cửa hàng của bạn</p>
        </div>
      </div>

      <div class="form-card">
        <div class="form-grid">
          <!-- Mã coupon -->
          <div class="form-group col-span-2">
            <label>Mã coupon <span class="required">*</span></label>
            <div class="input-with-icon">
              <svg
                class="input-icon left"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
                />
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
              <svg
                class="select-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <p v-if="errors.discount_type" class="error-text">
              {{ errors.discount_type }}
            </p>
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
              <span class="suffix-label">{{
                form.discount_type === "percent" ? "%" : "đ"
              }}</span>
            </div>
            <p v-if="errors.discount_value" class="error-text">
              {{ errors.discount_value }}
            </p>
            <p v-else-if="form.discount_type === 'percent'" class="helper-text">
              Nhập giá trị từ 0 đến 100
            </p>
          </div>

          <!-- Giảm tối đa (chỉ hiện khi percent) -->
          <div class="form-group" v-if="form.discount_type === 'percent'">
            <label>Giảm tối đa</label>
            <div class="input-with-suffix">
              <input
                type="number"
                class="form-control has-suffix"
                :class="{ 'is-error': errors.max_discount }"
                placeholder="Không giới hạn"
                min="0"
                v-model="form.max_discount"
              />
              <span class="suffix-label">đ</span>
            </div>
            <p v-if="errors.max_discount" class="error-text">
              {{ errors.max_discount }}
            </p>
            <p v-else class="helper-text">VD: Giảm 50% nhưng tối đa 100.000đ</p>
          </div>

          <!-- Đơn tối thiểu -->
          <div
            class="form-group"
            :class="form.discount_type === 'percent' ? '' : 'col-span-2'"
          >
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
            <p v-if="errors.min_order_value" class="error-text">
              {{ errors.min_order_value }}
            </p>
            <p v-else class="helper-text">Để trống nếu không giới hạn</p>
          </div>

          <!-- Số lần dùng -->
          <div class="form-group">
            <label>Số lần dùng tối đa</label>
            <input
              type="number"
              class="form-control"
              :class="{ 'is-error': errors.usage_limit }"
              placeholder="Không giới hạn"
              min="1"
              v-model="form.usage_limit"
            />
            <p v-if="errors.usage_limit" class="error-text">
              {{ errors.usage_limit }}
            </p>
            <p v-else class="helper-text">Để trống nếu không giới hạn</p>
          </div>

          <!-- Ngày bắt đầu -->
          <div class="form-group">
            <label>Ngày bắt đầu</label>
            <input
              type="datetime-local"
              class="form-control"
              :class="{ 'is-error': errors.start_date }"
              v-model="form.start_date"
            />
            <p v-if="errors.start_date" class="error-text">
              {{ errors.start_date }}
            </p>
          </div>

          <!-- Ngày kết thúc -->
          <div class="form-group">
            <label>Ngày kết thúc</label>
            <input
              type="datetime-local"
              class="form-control"
              :class="{ 'is-error': errors.end_date }"
              v-model="form.end_date"
            />
            <p v-if="errors.end_date" class="error-text">
              {{ errors.end_date }}
            </p>
          </div>

          <!-- Trạng thái -->
          <div class="form-group">
            <label>Trạng thái</label>
            <div class="toggle-wrap">
              <label class="toggle">
                <input type="checkbox" v-model="form.is_active" />
                <span class="toggle-slider"></span>
              </label>
              <span class="toggle-label">{{
                form.is_active ? "Đang hoạt động" : "Tạm dừng"
              }}</span>
            </div>
          </div>

          <!-- Preview -->
          <div
            class="form-group col-span-2"
            v-if="form.code || form.discount_type"
          >
            <label>Xem trước coupon</label>
            <div class="coupon-preview">
              <div class="coupon-left">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  width="28"
                  height="28"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <div>
                  <p class="preview-code">{{ form.code || "COUPON_CODE" }}</p>
                  <p class="preview-min">
                    {{
                      form.min_order_value
                        ? "Đơn tối thiểu " +
                          Number(form.min_order_value).toLocaleString("vi-VN") +
                          "đ"
                        : "Không giới hạn đơn tối thiểu"
                    }}
                  </p>
                  <p class="preview-min" v-if="form.end_date">
                    Hết hạn:
                    {{ new Date(form.end_date).toLocaleDateString("vi-VN") }}
                  </p>
                </div>
              </div>
              <div class="coupon-right">
                <span class="preview-value" v-if="form.discount_value">
                  {{
                    form.discount_type === "percent"
                      ? "Giảm " + form.discount_value + "%"
                      : "Giảm " +
                        Number(form.discount_value).toLocaleString("vi-VN") +
                        "đ"
                  }}
                </span>
                <span class="preview-value" v-else>—</span>
                <span
                  class="preview-max"
                  v-if="form.discount_type === 'percent' && form.max_discount"
                  >Tối đa
                  {{ Number(form.max_discount).toLocaleString("vi-VN") }}đ</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-secondary" @click="resetForm" :disabled="loading">
            Hủy
          </button>
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
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.page-content {
  padding: 32px;
  max-width: 1200px;
  font-family: "Inter", sans-serif;
}
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
.breadcrumb-link:hover {
  color: #111827;
}
.breadcrumb-separator {
  width: 14px;
  height: 14px;
  color: #9ca3af;
}
.breadcrumb-current {
  color: #111827;
  font-weight: 600;
}
.content-header {
  margin-bottom: 24px;
}
.content-titles h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 6px;
}
.content-titles p {
  font-size: 14px;
  color: #6b7280;
}
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
.col-span-2 {
  grid-column: span 2;
}
.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 10px;
}
.required {
  color: #ef4444;
}
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
.form-control::placeholder {
  color: #9ca3af;
}
.form-control:focus {
  background: #fff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.form-control.is-error {
  border-color: #ef4444;
  background: #fff;
}
.input-with-icon {
  position: relative;
}
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
.form-control.has-icon {
  padding-left: 42px;
}
.select-wrap {
  position: relative;
}
.select-wrap .form-control {
  padding-right: 38px;
  cursor: pointer;
}
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
.input-with-suffix {
  position: relative;
}
.form-control.has-suffix {
  padding-right: 44px;
}
.suffix-label {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  pointer-events: none;
}
.helper-text {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 8px;
}
.error-text {
  font-size: 12px;
  color: #ef4444;
  margin-top: 6px;
  font-weight: 500;
}
.toggle-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}
.toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #d1d5db;
  border-radius: 24px;
  transition: 0.2s;
}
.toggle-slider::before {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.2s;
}
.toggle input:checked + .toggle-slider {
  background: #2563eb;
}
.toggle input:checked + .toggle-slider::before {
  transform: translateX(20px);
}
.toggle-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}
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
  font-family: ui-monospace, monospace;
}
.preview-min {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
  font-weight: 500;
}
.coupon-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}
.preview-value {
  font-size: 18px;
  font-weight: 800;
  color: #16a34a;
  white-space: nowrap;
}
.preview-max {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}
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
.btn-secondary:hover:not(:disabled) {
  background: #f9fafb;
}
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
.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}
.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .col-span-2 {
    grid-column: span 1;
  }
  .page-content {
    padding: 16px;
  }
  .form-card {
    padding: 20px;
  }
}
</style>