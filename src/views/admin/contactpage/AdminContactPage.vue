<template>
  <div class="admin-page">
    <SidebarAdmin />
    <main class="main-content">
       <HeaderAdmin />
      <!-- Topbar -->
      <div class="topbar">
        <div>
          <h1 class="page-title">Quản lý liên hệ</h1>
          <p class="page-subtitle">
            Xem và phản hồi tất cả tin nhắn từ khách hàng
          </p>
        </div>
        <div class="topbar-right">
          <div class="search-bar">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              width="16"
              height="16"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              v-model="store.searchQuery"
              type="text"
              placeholder="Tìm kiếm..."
              @input="debouncedSearch"
            />
          </div>
          <button
            class="refresh-btn"
            @click="store.loadContacts"
            :disabled="store.loading"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              width="14"
              height="14"
              :class="{ spinning: store.loading }"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path
                d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
              />
            </svg>
          </button>
          <div class="admin-avatar">AD</div>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-label">Tổng liên hệ</span>
          <span class="stat-num">{{ store.stats.total }}</span>
          <span class="stat-sub">+{{ store.stats.today }} hôm nay</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Chờ xử lý</span>
          <span class="stat-num pending">{{ store.stats.pending }}</span>
          <span class="stat-sub">Cần phản hồi</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Đã xử lý</span>
          <span class="stat-num done">{{ store.stats.resolved }}</span>
          <span class="stat-sub">Hoàn thành</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Chat đang mở</span>
          <span class="stat-num chat">{{ store.stats.chat_active }}</span>
          <span class="stat-sub">Đang diễn ra</span>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls-bar">
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="tab-btn"
            :class="{ active: store.activeTab === tab.key }"
            @click="store.setTab(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="filters">
          <select
            v-model="store.filterStatus"
            class="filter-select"
            @change="store.loadContacts"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="in_progress">Đang xử lý</option>
            <option value="resolved">Đã giải quyết</option>
          </select>
          <select
            v-model="store.filterTopic"
            class="filter-select"
            @change="store.loadContacts"
          >
            <option value="">Tất cả chủ đề</option>
            <option value="order">Đơn hàng</option>
            <option value="product">Sản phẩm</option>
            <option value="payment">Thanh toán</option>
            <option value="technical">Kỹ thuật</option>
            <option value="other">Khác</option>
          </select>
        </div>
      </div>

      <!-- Panel -->
      <div class="panel-layout">
        <!-- Danh sách -->
        <div class="contact-list">
          <div
            v-if="store.loading && store.contacts.length === 0"
            class="loading-state"
          >
            <div class="spinner-lg"></div>
            <p>Đang tải...</p>
          </div>

          <div
            v-for="c in store.contacts"
            :key="c.id"
            class="contact-item"
            :class="{
              selected: store.selectedContact?.id === c.id,
              unread: !c.is_read,
            }"
            @click="store.selectContact(c)"
          >
            <div class="contact-avatar" :style="avatarStyle(c.name)">
              {{ c.initials }}
            </div>
            <div class="contact-preview">
              <div class="contact-meta">
                <span class="contact-name">{{ c.name }}</span>
                <span class="contact-time">{{ c.time_ago }}</span>
              </div>
              <div class="contact-sub">
                <span class="contact-topic-badge">{{ c.topic_label }}</span>
                <span class="contact-status-badge" :class="c.status">{{
                  c.status_label
                }}</span>
              </div>
              <p class="contact-excerpt">{{ c.message }}</p>
            </div>
          </div>

          <div
            v-if="!store.loading && store.contacts.length === 0"
            class="empty-state"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              width="40"
              height="40"
            >
              <path
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              />
            </svg>
            <p>Không có liên hệ nào</p>
          </div>

          <div v-if="store.meta.last_page > 1" class="pagination">
            <button
              :disabled="store.meta.current_page === 1"
              @click="store.changePage(store.meta.current_page - 1)"
            >
              ←
            </button>
            <span
              >{{ store.meta.current_page }} / {{ store.meta.last_page }}</span
            >
            <button
              :disabled="store.meta.current_page === store.meta.last_page"
              @click="store.changePage(store.meta.current_page + 1)"
            >
              →
            </button>
          </div>
        </div>

        <!-- Chi tiết -->
        <div class="contact-detail">
          <div v-if="!store.selectedContact" class="detail-empty">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              width="48"
              height="48"
            >
              <path
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              />
            </svg>
            <p>Chọn một liên hệ để xem chi tiết</p>
          </div>

          <div v-else-if="store.detailLoading" class="detail-loading">
            <div class="spinner-lg"></div>
          </div>
          <template v-else>
            <!-- Header -->
            <div class="detail-header">
              <div class="detail-user">
                <div
                  class="detail-avatar"
                  :style="avatarStyle(store.selectedContact.name)"
                >
                  {{ store.selectedContact.initials }}
                </div>
                <div>
                  <h3>{{ store.selectedContact.name }}</h3>
                  <span class="detail-email">{{
                    store.selectedContact.email
                  }}</span>
                </div>
              </div>
              <div class="detail-actions">
                <select
                  :value="store.selectedContact.status"
                  class="status-select"
                  :class="store.selectedContact.status"
                  @change="store.updateStatus($event.target.value)"
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="in_progress">Đang xử lý</option>
                  <option value="resolved">Đã giải quyết</option>
                </select>
                <button
                  class="action-btn danger-btn"
                  @click="store.deleteContact"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    width="14"
                    height="14"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Info grid -->
            <div class="info-grid">
              <div class="info-item">
                <span class="info-key">Điện thoại</span
                ><span class="info-val">{{
                  store.selectedContact.phone || "—"
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-key">Chủ đề</span
                ><span class="info-val">{{
                  store.selectedContact.topic_label
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-key">Ngày gửi</span
                ><span class="info-val">{{
                  store.selectedContact.created_at
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-key">Loại</span
                ><span class="info-val">{{
                  store.selectedContact.type === "form"
                    ? "Form liên hệ"
                    : "Chat trực tuyến"
                }}</span>
              </div>
            </div>

            <!-- Nội dung gốc -->
            <div class="original-msg">
              <h4>Nội dung gốc</h4>
              <p>{{ store.selectedContact.message }}</p>
            </div>

            <!-- Thread -->
            <div class="chat-thread">
              <h4>
                Lịch sử hội thoại
                <span class="msg-count"
                  >({{ store.selectedContact.chat_messages?.length || 0 }} tin
                  nhắn)</span
                >
              </h4>
              <div class="thread-messages" ref="threadRef">
                <div
                  v-if="!store.selectedContact.chat_messages?.length"
                  class="no-thread"
                >
                  Chưa có tin nhắn nào.
                </div>
                <div
                  v-for="msg in store.selectedContact.chat_messages"
                  :key="msg.id"
                  class="thread-msg"
                  :class="
                    msg.sender === 'admin' ? 'from-admin' : 'from-customer'
                  "
                >
                  <div class="thread-avatar" :class="msg.sender">
                    {{
                      msg.sender === "admin"
                        ? "AD"
                        : store.selectedContact.initials
                    }}
                  </div>
                  <div class="thread-bubble">
                    <div class="thread-meta">
                      <span class="thread-sender">{{ msg.sender_name }}</span>
                      <span class="thread-time">{{ msg.time_ago }}</span>
                    </div>
                    <p>{{ msg.message }}</p>
                  </div>
                </div>
              </div>

              <!-- Reply -->
              <div class="reply-box">
                <div class="reply-header">
                  <span>Trả lời khách hàng</span>
                  <div class="quick-replies">
                    <button
                      v-for="qr in quickReplies"
                      :key="qr"
                      class="quick-reply-btn"
                      @click="store.replyText = qr"
                    >
                      {{ qr }}
                    </button>
                  </div>
                </div>
                <textarea
                  v-model="store.replyText"
                  rows="3"
                  placeholder="Nhập nội dung trả lời..."
                ></textarea>
                <div class="reply-footer">
                  <div class="reply-options">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="store.sendEmail" /> Gửi
                      email thông báo
                    </label>
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="store.markResolved" />
                      Đánh dấu đã giải quyết
                    </label>
                  </div>
                  <button
                    class="reply-btn"
                    @click="onSendReply"
                    :disabled="!store.replyText.trim() || store.replying"
                  >
                    <span
                      v-if="store.replying"
                      class="spinner"
                      style="
                        border-color: rgba(255, 255, 255, 0.3);
                        border-top-color: #fff;
                        width: 12px;
                        height: 12px;
                        border-width: 2px;
                      "
                    ></span>
                    <svg
                      v-else
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      width="14"
                      height="14"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    {{ store.replying ? "Đang gửi..." : "Gửi phản hồi" }}
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useAdminContactStore } from "@/stores/useAdminContactStore";
import HeaderAdmin from '../../../components/HeaderAdmin.vue'
import SidebarAdmin from '../../../components/SidebarAdmin.vue'

const store = useAdminContactStore();
const threadRef = ref(null);
let searchTimer = null;
let statsInterval = null;

const tabs = [
  { key: "all", label: "Tất cả" },
  { key: "form", label: "Form liên hệ" },
  { key: "chat", label: "Chat trực tuyến" },
];

const quickReplies = [
  "Xin chào! Tôi có thể giúp gì cho bạn?",
  "Chúng tôi đã nhận được yêu cầu của bạn.",
  "Cảm ơn bạn đã liên hệ!",
];

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

const debouncedSearch = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    store.meta.current_page = 1;
    store.loadContacts();
  }, 400);
};

const onSendReply = async () => {
  const ok = await store.sendReply();
  if (ok) nextTick(scrollThread);
};

const scrollThread = () => {
  if (threadRef.value) threadRef.value.scrollTop = threadRef.value.scrollHeight;
};

// Cuộn xuống cuối mỗi khi thread thêm tin mới
watch(
  () => store.selectedContact?.chat_messages?.length,
  () => nextTick(scrollThread)
);

onMounted(() => {
  store.loadContacts();
  statsInterval = setInterval(store.loadStats, 30000);
});

onBeforeUnmount(() => {
  clearInterval(statsInterval);
  clearTimeout(searchTimer);
});
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.admin-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: "Segoe UI", sans-serif;
  background: #f1f5f9;
  color: #1e293b;
}

.badge {
  margin-left: auto;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.topbar {
  background: #fff;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}
.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}
.page-subtitle {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 12px;
  color: #94a3b8;
}
.search-bar input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #1e293b;
  width: 180px;
  font-family: inherit;
}
.refresh-btn {
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}
.spinning {
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.admin-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #1e3a8a;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 16px 24px;
  flex-shrink: 0;
}
.stat-card {
  background: #fff;
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
}
.stat-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}
.stat-num {
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  margin: 4px 0 2px;
}
.stat-num.pending {
  color: #f59e0b;
}
.stat-num.done {
  color: #22c55e;
}
.stat-num.chat {
  color: #3b82f6;
}
.stat-sub {
  font-size: 11px;
  color: #94a3b8;
}

.controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px 12px;
  flex-shrink: 0;
}
.tabs {
  display: flex;
  gap: 4px;
}
.tab-btn {
  padding: 7px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  background: #fff;
  color: #64748b;
  cursor: pointer;
  font-family: inherit;
}
.tab-btn.active {
  background: #0f172a;
  color: #fff;
  border-color: #0f172a;
}
.filters {
  display: flex;
  gap: 8px;
}
.filter-select {
  padding: 7px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  background: #fff;
  outline: none;
  font-family: inherit;
}

.panel-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  flex: 1;
  overflow: hidden;
  margin: 0 24px 24px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.contact-list {
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
}
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 20px;
  color: #94a3b8;
  font-size: 14px;
}
.spinner-lg {
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
.contact-item {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
}
.contact-item:hover {
  background: #f8fafc;
}
.contact-item.selected {
  background: #eff6ff;
}
.contact-item.unread::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #2563eb;
  border-radius: 0 2px 2px 0;
}
.contact-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}
.contact-preview {
  flex: 1;
  min-width: 0;
}
.contact-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
.contact-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}
.contact-time {
  font-size: 11px;
  color: #94a3b8;
}
.contact-sub {
  display: flex;
  gap: 6px;
  margin-bottom: 5px;
  flex-wrap: wrap;
}
.contact-topic-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #475569;
}
.contact-status-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
}
.contact-status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}
.contact-status-badge.in_progress {
  background: #dbeafe;
  color: #1d4ed8;
}
.contact-status-badge.resolved {
  background: #dcfce7;
  color: #166534;
}
.contact-excerpt {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  border-top: 1px solid #f1f5f9;
}
.pagination button {
  width: 28px;
  height: 28px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}
.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.pagination span {
  font-size: 12px;
  color: #64748b;
}

.contact-detail {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.detail-empty,
.detail-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #94a3b8;
  font-size: 14px;
}
.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}
.detail-user {
  display: flex;
  align-items: center;
  gap: 12px;
}
.detail-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}
.detail-user h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}
.detail-email {
  font-size: 12px;
  color: #64748b;
}
.detail-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.status-select {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid;
  outline: none;
  cursor: pointer;
  font-family: inherit;
}
.status-select.pending {
  background: #fef3c7;
  color: #92400e;
  border-color: #fcd34d;
}
.status-select.in_progress {
  background: #dbeafe;
  color: #1d4ed8;
  border-color: #93c5fd;
}
.status-select.resolved {
  background: #dcfce7;
  color: #166534;
  border-color: #86efac;
}
.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.danger-btn {
  background: #fff;
  border-color: #fecaca;
  color: #dc2626;
}
.danger-btn:hover {
  background: #fef2f2;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}
.info-item {
  padding: 10px 16px;
  border-right: 1px solid #f1f5f9;
}
.info-item:last-child {
  border-right: none;
}
.info-key {
  display: block;
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
  margin-bottom: 3px;
}
.info-val {
  font-size: 13px;
  color: #1e293b;
  font-weight: 500;
}

.original-msg {
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}
.original-msg h4 {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.original-msg p {
  font-size: 13px;
  color: #374151;
  line-height: 1.6;
  background: #f8fafc;
  padding: 10px 12px;
  border-radius: 8px;
  border-left: 3px solid #2563eb;
}

.chat-thread {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.chat-thread h4 {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  padding: 10px 20px 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}
.msg-count {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
}
.thread-messages {
  flex: 1;
  overflow-y: auto;
  padding: 8px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.no-thread {
  font-size: 13px;
  color: #94a3b8;
  text-align: center;
  padding: 20px;
}
.thread-msg {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.from-admin {
  flex-direction: row-reverse;
}
.thread-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.thread-avatar.admin {
  background: #1e3a8a;
  color: #fff;
}
.thread-avatar.customer {
  background: #f1f5f9;
  color: #475569;
}
.thread-bubble {
  max-width: 72%;
}
.thread-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.from-admin .thread-meta {
  flex-direction: row-reverse;
}
.thread-sender {
  font-size: 11px;
  font-weight: 600;
  color: #374151;
}
.thread-time {
  font-size: 10px;
  color: #94a3b8;
}
.thread-bubble p {
  font-size: 13px;
  padding: 9px 13px;
  border-radius: 10px;
  line-height: 1.5;
}
.from-customer .thread-bubble p {
  background: #f1f5f9;
  color: #1e293b;
  border-bottom-left-radius: 3px;
}
.from-admin .thread-bubble p {
  background: #1e3a8a;
  color: #fff;
  border-bottom-right-radius: 3px;
  text-align: left;
}

.reply-box {
  border-top: 1px solid #e2e8f0;
  padding: 14px 20px;
  flex-shrink: 0;
}
.reply-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.reply-header > span {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}
.quick-replies {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.quick-reply-btn {
  font-size: 11px;
  padding: 3px 9px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  cursor: pointer;
  color: #475569;
  font-family: inherit;
}
.quick-reply-btn:hover {
  background: #e2e8f0;
}
.reply-box textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  resize: none;
  outline: none;
  font-family: inherit;
  color: #1e293b;
  margin-bottom: 10px;
}
.reply-box textarea:focus {
  border-color: #2563eb;
}
.reply-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.reply-options {
  display: flex;
  gap: 16px;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
}
.reply-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
  background: #1e3a8a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}
.reply-btn:hover {
  background: #1e40af;
}
.reply-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}
.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
</style>
