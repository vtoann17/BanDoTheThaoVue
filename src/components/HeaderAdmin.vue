<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/auth";
import { useAdminContactStore } from "@/stores/useAdminContactStore";

const authStore    = useAuth();
const contactStore = useAdminContactStore();
const router       = useRouter();

const showDropdown = ref(false);
const AVATAR_COLORS = [
    { bg: "#dbeafe", color: "#1d4ed8" },
    { bg: "#fce7f3", color: "#be185d" },
    { bg: "#d1fae5", color: "#065f46" },
    { bg: "#fef3c7", color: "#92400e" },
    { bg: "#ede9fe", color: "#5b21b6" },
    { bg: "#fee2e2", color: "#991b1b" },
];

const avatarStyle = (name) => {
    const idx = (name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
};

const initials = (name) => {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
};

const notifications = computed(() =>
    contactStore.contacts
        .filter(c => (c.unread_count || 0) > 0)
        .slice(0, 10)
);

const totalUnread = computed(() =>
    notifications.value.reduce((sum, c) => sum + (c.unread_count || 0), 0)
);

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
};

const closeDropdown = (e) => {
    if (!e.target.closest(".notif-wrapper")) {
        showDropdown.value = false;
    }
};

const goToContact = (contact) => {
    showDropdown.value = false;

    const currentRoute = router.currentRoute.value.path;

    if (currentRoute === "/admin/contacts") {
        contactStore.selectContact(contact);
    } else {
        router.push("/admin/contacts").then(() => {
            contactStore.selectContact(contact);
        });
    }
};

onMounted(() => {
    document.addEventListener("click", closeDropdown);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", closeDropdown);
});
</script>

<template>
  <header class="topbar">
    <h1 class="page-title-main">Trang Quản Trị</h1>
    <div class="topbar-actions">

      <div class="notif-wrapper">
        <button
          class="notif-btn"
          @click.stop="toggleDropdown"
          :class="{ active: showDropdown }"
          :title="`${totalUnread} tin nhắn chưa đọc`"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>

          <!-- Badge số lượng -->
          <transition name="badge-pop">
            <span v-if="totalUnread > 0" class="notif-badge">
              {{ totalUnread > 99 ? "99+" : totalUnread }}
            </span>
          </transition>

          <!-- Pulse ring khi có tin mới -->
          <span v-if="totalUnread > 0" class="notif-pulse"></span>
        </button>

        <!-- ── Dropdown ── -->
        <transition name="dropdown-slide">
          <div v-if="showDropdown" class="notif-dropdown">
            <div class="notif-header">
              <span class="notif-title">Tin nhắn cần xử lý</span>
              <span v-if="totalUnread > 0" class="notif-count-label">
                {{ totalUnread }} chưa đọc
              </span>
              <span v-else class="notif-count-label all-read">Đã xử lý hết</span>
            </div>

            <div class="notif-list" v-if="notifications.length > 0">
              <div
                v-for="c in notifications"
                :key="c.id"
                class="notif-item"
                @click="goToContact(c)"
              >
                <div class="notif-avatar" :style="avatarStyle(c.name)">
                  {{ initials(c.name) }}
                </div>
                <div class="notif-body">
                  <div class="notif-name-row">
                    <span class="notif-name">{{ c.name }}</span>
                    <span class="notif-time">{{ c.last_time || c.time_ago }}</span>
                  </div>
                  <p class="notif-msg">{{ c.last_message || c.message }}</p>
                </div>
                <span class="notif-unread-dot">{{ c.unread_count }}</span>
              </div>
            </div>

            <div v-else class="notif-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <p>Không có tin nhắn mới</p>
            </div>
          </div>
        </transition>
      </div>

      <!-- ══ USER INFO ══ -->
      <div class="user-info">
        <div class="user-details">
          <span class="user-name">{{ authStore.user?.name }}</span>
          <span class="user-role">{{ authStore.user?.role }}</span>
        </div>
        <img
          v-if="authStore.user?.avatar"
          :src="authStore.user.avatar"
          class="user-avatar"
          alt="avatar"
        />
        <div v-else class="user-avatar-fallback">
          {{ (authStore.user?.name || "A").charAt(0).toUpperCase() }}
        </div>
      </div>

    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  flex-shrink: 0;
  position: relative;
  z-index: 100;
}
.page-title-main {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}
.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* ══ CHUÔNG ══ */
.notif-wrapper {
  position: relative;
}
.notif-btn {
  position: relative;
  width: 38px;
  height: 38px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.notif-btn:hover,
.notif-btn.active {
  background: #eff6ff;
  color: #1d4ed8;
  border-color: #bfdbfe;
}

/* Badge số */
.notif-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 20px;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  z-index: 1;
}

/* Pulse ring */
.notif-pulse {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ef4444;
  animation: notif-pulse 2s infinite;
  pointer-events: none;
}
@keyframes notif-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
  70%  { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

/* Badge pop animation */
.badge-pop-enter-active { animation: badge-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.badge-pop-leave-active { animation: badge-pop 0.15s ease-in reverse; }
@keyframes badge-pop {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

/* ══ DROPDOWN ══ */
.notif-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 340px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 200;
}

.dropdown-slide-enter-active {
  animation: dropdown-slide 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.dropdown-slide-leave-active {
  animation: dropdown-slide 0.15s ease-in reverse;
}
@keyframes dropdown-slide {
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
  border-bottom: 1px solid #f3f4f6;
}
.notif-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
.notif-count-label {
  font-size: 11px;
  font-weight: 600;
  color: #ef4444;
  background: #fef2f2;
  padding: 2px 8px;
  border-radius: 20px;
}
.notif-count-label.all-read {
  color: #16a34a;
  background: #f0fdf4;
}

.notif-list {
  max-height: 360px;
  overflow-y: auto;
}
.notif-list::-webkit-scrollbar { width: 4px; }
.notif-list::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}

.notif-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f8fafc;
  transition: background 0.15s;
}
.notif-item:hover { background: #f8fafc; }
.notif-item:last-child { border-bottom: none; }

.notif-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notif-body {
  flex: 1;
  min-width: 0;
}
.notif-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3px;
}
.notif-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}
.notif-time {
  font-size: 11px;
  color: #94a3b8;
  white-space: nowrap;
}
.notif-msg {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notif-unread-dot {
  min-width: 20px;
  height: 20px;
  background: #1d4ed8;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  flex-shrink: 0;
}

.notif-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 20px;
  color: #94a3b8;
  font-size: 13px;
}

/* ══ USER INFO ══ */
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 16px;
  border-left: 1px solid #e5e7eb;
}
.user-details {
  display: flex;
  flex-direction: column;
  text-align: right;
}
.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}
.user-role {
  font-size: 12px;
  color: #9ca3af;
  text-transform: capitalize;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
.user-avatar-fallback {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1e3a8a;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>