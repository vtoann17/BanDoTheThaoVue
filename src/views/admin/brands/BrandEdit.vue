<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { useBrands } from "@/stores/brands";
import { useNotify } from "@/composables/useNotify";

const router = useRouter();
const route = useRoute();
const notify = useNotify();
const brandStore = useBrands();
const apiBase = import.meta.env.VITE_API_BASE;

const form = reactive({ name: "", slug: "" });
const errors = reactive({ name: "", slug: "" });
const loading = ref(false);
const fetching = ref(true);
const fileInput = ref(null);
const imageFile = ref(null);
const imagePreview = ref("");
const existingImageUrl = ref("");

const brandId = Number(route.params.id);
function imageUrl(path) {
  if (!path || !apiBase) return null; 
  return `${apiBase.replace("/api", "")}/storage/${path}`;
}

onMounted(async () => {
    if (!brandStore.brands.length) await brandStore.loadBrands();

    const brand = brandStore.brands.find((b) => b.id === brandId);

    if (!brand) {
        notify.toastError("Không tìm thấy thương hiệu");
        router.push("/brandadmin");
        return;
    }

    form.name = brand.name;
    form.slug = brand.slug;
    existingImageUrl.value = imageUrl(brand.image);
    fetching.value = false;
});

function autoSlug() {
    form.slug = form.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

function onFileChange(e) {
    const file = e.target.files[0];
    if (file) setImage(file);
}

function onDrop(e) {
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) setImage(file);
}

function setImage(file) {
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => (imagePreview.value = e.target.result);
    reader.readAsDataURL(file);
    existingImageUrl.value = ""; 
}

function removeImage() {
    imageFile.value = null;
    imagePreview.value = "";
    existingImageUrl.value = "";
    if (fileInput.value) fileInput.value.value = "";
}

function validate() {
    errors.name = "";
    errors.slug = "";
    let ok = true;
    if (!form.name.trim()) {
        errors.name = "Tên thương hiệu không được để trống";
        ok = false;
    }
    if (!form.slug.trim()) {
        errors.slug = "Slug không được để trống";
        ok = false;
    }
    return ok;
}

async function submitForm() {
    if (!validate()) return;

    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("slug", form.slug.trim());
    if (imageFile.value) fd.append("image", imageFile.value);

    loading.value = true;
    const result = await brandStore.updateBrand(brandId, fd);
    loading.value = false;

    if (result) router.push("/brandadmin");
}

function resetForm() {
    const brand = brandStore.brands.find((b) => b.id === brandId);
    if (brand) {
        form.name = brand.name;
        form.slug = brand.slug;
        existingImageUrl.value = imageUrl(brand.image);
    }
    errors.name = "";
    errors.slug = "";
    imageFile.value = null;
    imagePreview.value = "";
    if (fileInput.value) fileInput.value.value = "";
}
</script>

<template>
    <AdminLayout>
        <div class="content-body">
            <div class="breadcrumb">
                <RouterLink to="/" class="crumb-link">Trang chủ</RouterLink>
                <span class="separator">›</span>
                <RouterLink to="/brandadmin" class="crumb-link">Thương hiệu</RouterLink>
                <span class="separator">›</span>
                <span class="current">Chỉnh sửa thương hiệu</span>
            </div>

            <div class="page-header">
                <h1 class="page-title">Chỉnh sửa thương hiệu</h1>
                <p class="page-subtitle">Cập nhật thông tin thương hiệu cho hệ thống Sports Store</p>
            </div>

            <div v-if="fetching" class="form-container">
                <div class="main-info-card skeleton-wrap">
                    <div class="skeleton skeleton-input"></div>
                    <div class="skeleton skeleton-input"></div>
                </div>
                <div class="side-info-card skeleton-wrap">
                    <div class="skeleton skeleton-img"></div>
                </div>
            </div>

            <div v-else class="form-container">
                <div class="main-info-card">
                    <div class="form-group">
                        <label class="form-label">Tên thương hiệu</label>
                        <input type="text" class="form-input" :class="{ 'is-error': errors.name }"
                            placeholder="VD: Nike, Adidas, Puma..." v-model="form.name" @input="autoSlug" />
                        <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Đường dẫn (Slug)</label>
                        <div class="input-with-prefix">
                            <span class="prefix-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1">
                                    </path>
                                </svg>
                            </span>
                            <input type="text" class="form-input has-prefix" :class="{ 'is-error': errors.slug }"
                                placeholder="nike-sportswear" v-model="form.slug" />
                        </div>
                        <p v-if="errors.slug" class="error-text">{{ errors.slug }}</p>
                        <p v-else class="input-help">Đường dẫn tự động tạo từ tên hoặc nhập thủ công.</p>
                    </div>
                </div>

                <div class="side-info-card">
                    <label class="form-label">Ảnh thương hiệu</label>
                    <input type="file" ref="fileInput" class="hidden-input" accept="image/*" @change="onFileChange" />

                    <div v-if="!imagePreview && !existingImageUrl" class="upload-zone" @click="fileInput.click()"
                        @dragover.prevent @drop.prevent="onDrop">
                        <div class="upload-icon-circle">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                            </svg>
                        </div>
                        <p class="upload-title">Tải ảnh lên</p>
                        <p class="upload-desc">Định dạng PNG, JPG hoặc SVG. Tối đa 2MB.</p>
                    </div>

                    <div v-else class="image-preview-wrapper">
                        <div class="preview-container">
                            <img :src="imagePreview || existingImageUrl" alt="Preview" class="preview-image" />
                            <button type="button" class="remove-btn" @click="removeImage" title="Xóa ảnh">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="file-info">
                            <span class="file-name">{{ imageFile ? imageFile.name : 'Ảnh hiện tại' }}</span>
                            <span v-if="imageFile" class="file-size">{{ (imageFile.size / 1024).toFixed(1) }} KB</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="btn-cancel" @click="resetForm" :disabled="loading">Làm mới</button>
                <button type="button" class="btn-primary" @click="submitForm" :disabled="loading">
                    <span v-if="loading" class="spinner"></span>
                    {{ loading ? 'Đang lưu...' : 'Cập nhật thương hiệu' }}
                </button>
            </div>
        </div>
    </AdminLayout>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.content-body {
    padding: 32px 40px;
    max-width: 1200px;
    font-family: 'Inter', sans-serif;
}

/* Breadcrumb & Header */
.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    margin-bottom: 24px;
}

.crumb-link {
    color: #6b7280;
    text-decoration: none;
}

.separator {
    color: #9ca3af;
}

.current {
    color: #111827;
    font-weight: 600;
}

.page-header {
    margin-bottom: 32px;
}

.page-title {
    font-size: 28px;
    font-weight: 600;
    color: #111827;
}

.page-subtitle {
    font-size: 14px;
    color: #9ca3af;
}

/* Skeleton */
.skeleton-wrap {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;
    border-radius: 8px;
}

.skeleton-input {
    height: 48px;
    width: 100%;
}

.skeleton-img {
    height: 250px;
    width: 100%;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

/* Form Layout */
.form-container {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
}

.main-info-card {
    flex: 2;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.side-info-card {
    flex: 1;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 32px;
}

/* Input & Labels */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-label {
    font-size: 14px;
    font-weight: 500;
    color: #4b5563;
}

.form-input {
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: border 0.2s;
}

.form-input:focus {
    border-color: #1a73e8;
}

.is-error {
    border-color: #ef4444 !important;
}

.error-text {
    color: #ef4444;
    font-size: 12px;
}

.input-with-prefix {
    position: relative;
}

.prefix-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
}

.has-prefix {
    padding-left: 40px !important;
}

.input-help {
    color: #9ca3af;
    font-size: 12px;
}

/* Upload Zone */
.upload-zone {
    border: 2px dashed #e5e7eb;
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    background: #fafbfc;
    cursor: pointer;
    transition: all 0.2s;
}

.upload-zone:hover {
    border-color: #1a73e8;
    background: #f0f7ff;
}

.upload-icon-circle {
    width: 48px;
    height: 48px;
    background: #eff6ff;
    color: #1a73e8;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
}

.hidden-input {
    display: none;
}

/* Image Preview */
.preview-container {
    position: relative;
    width: 100%;
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
}

.preview-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
    background: #ef4444;
    color: #fff;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.file-info {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 12px;
    color: #6b7280;
}

/* Actions */
.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    border-top: 1px solid #e5e7eb;
    padding-top: 24px;
}

.btn-cancel {
    padding: 10px 24px;
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
}

.btn-primary {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    background: #1a73e8;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>