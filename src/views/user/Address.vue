<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import HeaderUser from "../../components/HeaderUser.vue";
import SidebarUser from "../../components/SidebarUser.vue";
import { useAddress } from "@/stores/address";
import { useShipping } from "@/stores/shipping";

const addressStore = useAddress();
const shippingStore = useShipping();

const user = ref({});
const activeLink = ref("address");

const { addresses } = storeToRefs(addressStore);
const { provinces, districts, wards } = storeToRefs(shippingStore);
onMounted(async () => {
  await addressStore.loadAddresses();
  await shippingStore.loadProvinces(); 
});

const handleDelete = async (id) => {
  await addressStore.deleteAddress(id);
};

const setDefault = async (addr) => {
  await addressStore.updateAddress(addr.id, {
    ...addr,
    is_default: true,
  });
  await addressStore.loadAddresses();
};

const showForm = ref(false);
const editingId = ref(null);

const isEditing = computed(() => editingId.value !== null);
const modalTitle = computed(() =>
  isEditing.value ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"
);

const emptyForm = () => ({
  receiver_name: "",
  phone: "",
  province_id: "",
  district_id: "",
  ward_code: "",
  address_detail: "",
  is_default: false,
});

const form = ref(emptyForm());

const openAddForm = () => {
  editingId.value = null;
  form.value = emptyForm();
  shippingStore.districts = [];
  shippingStore.wards = [];
  showForm.value = true;
};

const openEditForm = async (addr) => {
  editingId.value = addr.id;
  if (addr.province_id) {
    await shippingStore.loadDistricts(addr.province_id);
  }
  if (addr.district_id) {
    await shippingStore.loadWards(addr.district_id);
  }
  form.value = {
    receiver_name: addr.receiver_name,
    phone: addr.phone,
    province_id: addr.province_id,
    district_id: addr.district_id,
    ward_code: addr.ward_code,
    address_detail: addr.address_detail,
    is_default: addr.is_default,
  };
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  editingId.value = null;
  form.value = emptyForm();
};

const handleProvinceChange = async () => {
  form.value.district_id = "";
  form.value.ward_code = "";
  await shippingStore.loadDistricts(form.value.province_id);
};

const handleDistrictChange = async () => {
  form.value.ward_code = "";
  await shippingStore.loadWards(form.value.district_id);
};

const handleSubmit = async () => {
  const selectedProvince = provinces.value.find(
    (p) => p.ProvinceID == form.value.province_id
  );

  const selectedDistrict = districts.value.find(
    (d) => d.DistrictID == form.value.district_id
  );

  const selectedWard = wards.value.find(
    (w) => w.WardCode == form.value.ward_code
  );
  const payload = {
    ...form.value,
    province_id: Number(form.value.province_id),
    district_id: Number(form.value.district_id),

    province_name: selectedProvince?.ProvinceName || "",
    district_name: selectedDistrict?.DistrictName || "",
    ward_name: selectedWard?.WardName || "",
  };
  if (isEditing.value) {
    await addressStore.updateAddress(editingId.value, payload);
  } else {
    await addressStore.createAddress(payload);
  }

  closeForm();
};
</script>

<template>
  <div class="sportgear-profile">
    <HeaderUser :cart-count="3" :user="user" />

    <main class="main-container">
      <SidebarUser :active-link="activeLink" @navigate="activeLink = $event" />

      <section class="content-area">
        <div class="page-top-header">
          <div class="titles">
            <h1 class="main-title">Sổ địa chỉ</h1>
            <p class="sub-title">
              Quản lý các địa chỉ giao hàng của bạn để thanh toán nhanh hơn.
            </p>
          </div>
          <button class="btn-solid-blue" @click="openAddForm">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Thêm địa chỉ mới
          </button>
        </div>

        <div class="cards-wrapper">
          <div
            v-for="addr in addresses"
            :key="addr.id"
            :class="['address-box', { 'is-default': addr.is_default }]"
          >
            <div v-if="addr.is_default" class="badge-default">MẶC ĐỊNH</div>

            <div class="box-content">
              <div class="box-info">
                <div class="contact-row">
                  <span class="name">{{ addr.receiver_name }}</span>
                  <span class="divider">|</span>
                  <span class="phone">{{ addr.phone }}</span>
                </div>

                <div class="address-lines">
                  <p class="street">{{ addr.address_detail }}</p>
                  <p class="city">
                    {{ addr.ward_name }}, {{ addr.district_name }},
                    {{ addr.province_name }}
                  </p>
                </div>

                <div class="action-row">
                  <button
                    class="action-btn text-blue"
                    @click="openEditForm(addr)"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      ></path>
                    </svg>
                    Chỉnh sửa
                  </button>

                  <button
                    :class="[
                      'action-btn',
                      addr.is_default ? 'text-gray-disabled' : 'text-red',
                    ]"
                    :disabled="addr.is_default"
                    @click="handleDelete(addr.id)"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                    {{ addr.is_default ? "Xóa (Địa chỉ mặc định)" : "Xóa" }}
                  </button>

                  <button
                    v-if="!addr.is_default"
                    class="action-btn text-gray push-right"
                    @click="setDefault(addr)"
                  >
                    Đặt làm mặc định
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="app-footer">
      <div class="container footer-inner">
        <div class="footer-logo-group">
          <div class="f-logo">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path
                d="M5.636 5.636a9 9 0 0112.728 0M12 2v20M2 12h20M5.636 18.364a9 9 0 0112.728 0"
              ></path>
            </svg>
          </div>
          <span class="f-name">SportGear</span>
        </div>
        <div class="f-copy">
          © 2024 SportGear. Bản quyền thuộc về Công ty TNHH Thể Thao Việt.
        </div>
        <div class="f-links">
          <a href="#">Điều khoản</a>
          <a href="#">Bảo mật</a>
          <a href="#">Hỗ trợ</a>
        </div>
      </div>
    </footer>

    <!-- Modal thêm / chỉnh sửa địa chỉ -->
    <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
      <div class="modal-box">
        <div class="modal-header">
          <h2 class="modal-title">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            {{ modalTitle }}
          </h2>
          <button class="modal-close" @click="closeForm">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label"
                >Tên người nhận <span class="required">*</span></label
              >
              <input
                v-model="form.receiver_name"
                class="form-input"
                placeholder="Nhập tên người nhận"
              />
            </div>
            <div class="form-group">
              <label class="form-label"
                >Số điện thoại <span class="required">*</span></label
              >
              <input
                v-model="form.phone"
                class="form-input"
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label"
                >Tỉnh / Thành phố <span class="required">*</span></label
              >
              <select
                v-model="form.province_id"
                class="form-select"
                @change="handleProvinceChange"
              >
                <option value="">Chọn tỉnh/thành</option>
                <option
                  v-for="p in provinces"
                  :key="p.ProvinceID"
                  :value="p.ProvinceID"
                >
                  {{ p.ProvinceName }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label"
                >Quận / Huyện <span class="required">*</span></label
              >
              <select
                v-model="form.district_id"
                class="form-select"
                @change="handleDistrictChange"
                :disabled="!form.province_id"
              >
                <option value="">Chọn quận/huyện</option>
                <option
                  v-for="d in districts"
                  :key="d.DistrictID"
                  :value="d.DistrictID"
                >
                  {{ d.DistrictName }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label"
              >Phường / Xã <span class="required">*</span></label
            >
            <select
              v-model="form.ward_code"
              class="form-select"
              :disabled="!form.district_id"
            >
              <option value="">Chọn phường/xã</option>
              <option v-for="w in wards" :key="w.WardCode" :value="w.WardCode">
                {{ w.WardName }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label"
              >Địa chỉ chi tiết <span class="required">*</span></label
            >
            <input
              v-model="form.address_detail"
              class="form-input"
              placeholder="Số nhà, tên đường, tòa nhà..."
            />
          </div>

          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="form.is_default"
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
            <span class="checkbox-text">Đặt làm địa chỉ mặc định</span>
          </label>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="closeForm">Hủy</button>
          <button class="btn-save" @click="handleSubmit">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            {{ isEditing ? "Cập nhật" : "Lưu địa chỉ" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.sportgear-profile {
  --blue-primary: #0066ff;
  --blue-light: #e5f0ff;
  --text-dark: #111827;
  --text-gray: #4b5563;
  --text-light: #9ca3af;
  --border-line: #e5e7eb;
  --page-bg: #f9fafb;
  --danger: #ef4444;
  --orange-badge: #f97316;
  font-family: "Inter", sans-serif;
  background-color: var(--page-bg);
  color: var(--text-dark);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a {
  text-decoration: none;
}
button {
  font-family: inherit;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
}

.main-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  gap: 40px;
  width: 100%;
  flex: 1;
}

.content-area {
  flex: 1;
  min-width: 0;
  max-width: 900px;
}

.page-top-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 6px;
}
.sub-title {
  font-size: 14px;
  color: var(--text-gray);
}

.btn-solid-blue {
  background-color: var(--blue-primary);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-solid-blue:hover {
  opacity: 0.9;
}
.btn-solid-blue svg {
  width: 18px;
  height: 18px;
}

.cards-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.address-box {
  position: relative;
  background-color: #fff;
  border: 1px solid var(--border-line);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}
.address-box.is-default {
  border: 2px solid var(--blue-primary);
}

.badge-default {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: var(--blue-primary);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 6px 12px;
  border-radius: 0 12px 0 8px;
}

.box-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}
.box-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
}
.name {
  font-weight: 700;
  color: var(--text-dark);
}
.divider {
  color: var(--border-line);
  font-weight: 300;
  margin: 0 4px;
}
.phone {
  font-weight: 400;
  font-size: 14px;
  color: var(--text-dark);
}

.address-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  line-height: 1.5;
}
.street {
  color: var(--text-dark);
  font-weight: 400;
  font-size: 14px;
}
.city {
  font-weight: 700;
  color: var(--text-dark);
  font-size: 14px;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 12px;
}

.action-btn {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.action-btn:hover {
  opacity: 0.8;
}
.action-btn svg {
  width: 16px;
  height: 16px;
}

.text-blue {
  color: var(--blue-primary);
}
.text-red {
  color: var(--danger);
}
.text-gray-disabled {
  color: var(--text-light);
  cursor: not-allowed;
}
.text-gray {
  color: var(--text-gray);
}
.push-right {
  margin-left: auto;
}

.dashed-add-box {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}
.dashed-add-box:hover {
  border-color: #93c5fd;
  background-color: var(--blue-light);
}

.dashed-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}
.map-icon-box {
  position: relative;
  color: var(--text-light);
  width: 32px;
  height: 32px;
  margin-bottom: 4px;
}
.map-icon-box svg {
  width: 100%;
  height: 100%;
}
.ask-text {
  font-size: 14px;
  color: var(--text-gray);
  font-weight: 500;
}
.btn-text-blue {
  background: none;
  border: none;
  color: var(--blue-primary);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.app-footer {
  background-color: #fff;
  border-top: 1px solid var(--border-line);
  padding: 24px 0;
  margin-top: auto;
}
.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.footer-logo-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.f-logo {
  width: 24px;
  height: 24px;
  background-color: var(--text-light);
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.f-logo svg {
  width: 14px;
  height: 14px;
}
.f-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-light);
}
.f-copy {
  font-size: 13px;
  color: var(--text-light);
}
.f-links {
  display: flex;
  gap: 24px;
}
.f-links a {
  color: var(--text-gray);
  font-size: 13px;
  font-weight: 500;
}
.f-links a:hover {
  color: var(--text-dark);
}

/* ===================== MODAL ===================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 9999;
  backdrop-filter: blur(2px);
  padding: 40px 24px;
  overflow-y: auto;
}

.modal-box {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.25s ease;
  display: flex;
  flex-direction: column;
  margin: auto;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f0f7ff 0%, #fff 100%);
  border-radius: 16px 16px 0 0;
  flex-shrink: 0;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}
.modal-title svg {
  width: 20px;
  height: 20px;
  color: #0066ff;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.modal-close:hover {
  background: #e5e7eb;
  color: #111827;
}
.modal-close svg {
  width: 18px;
  height: 18px;
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
}
.required {
  color: #ef4444;
  margin-left: 2px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #111827;
  background: #fff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.form-input:focus,
.form-select:focus {
  border-color: #0066ff;
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
}
.form-select:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}
.form-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 36px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: background 0.15s;
}
.checkbox-label:hover {
  background: #e5f0ff;
  border-color: #93c5fd;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #e5e7eb;
  border-radius: 4px;
  flex-shrink: 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.checkbox-input:checked + .checkbox-custom {
  background: #0066ff;
  border-color: #0066ff;
}
.checkbox-input:checked + .checkbox-custom::after {
  content: "";
  width: 10px;
  height: 6px;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(-45deg) translateY(-1px);
  display: block;
}
.checkbox-text {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 16px 16px;
  flex-shrink: 0;
}

.btn-cancel {
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-cancel:hover {
  background: #e5e7eb;
  color: #111827;
}

.btn-save {
  background: #0066ff;
  border: none;
  color: #fff;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-save:hover {
  opacity: 0.9;
}
.btn-save svg {
  width: 16px;
  height: 16px;
}
</style>