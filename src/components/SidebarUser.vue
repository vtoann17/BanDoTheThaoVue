<template>
  <aside class="sidebar">
    <div class="nav-section">
      <h4 class="nav-title">TÀI KHOẢN</h4>
      <RouterLink
        v-for="item in accountLinks"
        :key="item.label"
        :to="item.href"
        class="nav-link"
        active-class="active"
      >
        <span class="nav-icon" v-html="item.icon"></span>
        {{ item.label }}
      </RouterLink>
    </div>

    <div class="nav-section">
      <h4 class="nav-title">CÀI ĐẶT</h4>

      <RouterLink
        v-for="item in settingLinks"
        :key="item.label"
        :to="item.href"
        class="nav-link"
        active-class="active"
      >
        <span class="nav-icon" v-html="item.icon"></span>
        {{ item.label }}
      </RouterLink>

      <!-- Đăng xuất tách riêng vì cần gọi hàm logout() trước khi redirect -->
      <router-link class="nav-link text-danger" to="/auth/logout">
        <span class="nav-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </span>
        Đăng xuất
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { useAuth } from "@/stores/auth";
import { useRouter } from "vue-router";

const { logout } = useAuth();
const router = useRouter();

const handleLogout = async () => {
  await logout();
  router.push("/auth/login");
};

const accountLinks = [
  {
    label: "Thông tin cá nhân",
    href: "/profile",
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`,
  },
  {
    label: "Đơn hàng của tôi",
    href: "/order",
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>`,
  },
  {
    label: "Sổ địa chỉ",
    href: "/address",
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`,
  },
  {
    label: "Sản phẩm yêu thích",
    href: "/favorite",
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>`,
  },
  {
    label: "Mã giảm giá",
    href: "/coupon",
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>`,
  },
];

const settingLinks = [
  {
    label: "Đổi mật khẩu",
    href: "/changepassword",
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>`,
  },
  {
    label: "Trang chủ",
    href: "/",
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>`,
  },
];
</script>

<style scoped>
.sidebar {
  width: 260px;
  flex-shrink: 0;
  /* Card style */
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  /* Sticky khi scroll */
  position: sticky;
  top: 88px; /* header 72px + gap 16px */
  align-self: flex-start;
  height: fit-content;
}

.nav-section {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Bỏ margin-bottom ở section cuối */
.nav-section:last-child {
  margin-bottom: 0;
}

/* Đường kẻ phân tách giữa 2 section */
.nav-section + .nav-section {
  padding-top: 20px;
  border-top: 1px solid #f3f4f6;
}

.nav-title {
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 8px;
  padding-left: 12px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s;
  text-decoration: none;
  cursor: pointer;
  /* reset button styles */
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-family: inherit;
}

.nav-link:hover {
  background-color: #f3f4f6;
  color: #111827;
}
.nav-link.active {
  background-color: #eff6ff;
  color: #1a73e8;
  font-weight: 600;
  width: 200px;
}
.nav-link.text-danger {
  color: #dc2626;
}
.nav-link.text-danger:hover {
  background-color: #fee2e2;
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.nav-icon :deep(svg) {
  width: 20px;
  height: 20px;
}
</style>