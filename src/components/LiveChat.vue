<template>
  <!-- Floating Button -->
  <button
    class="livechat-fab"
    @click="isOpen = !isOpen"
    :class="{ active: isOpen }"
  >
    <i v-if="!isOpen" class="bi bi-headset"></i>
    <i v-else class="bi bi-x-lg"></i>
    <span class="fab-badge"></span>
  </button>

  <!-- Chat Panel -->
  <transition name="chat-pop">
    <div v-if="isOpen" class="chat-panel">
      <!-- Chưa bắt đầu -->
      <div v-if="!chatStore.chatStarted" class="chat-intro">
        <div class="panel-header">
          <div class="header-left">
            <div class="agent-avatars">
              <div class="agent-avatar av1">T</div>
              <div class="agent-avatar av2">H</div>
              <div class="agent-avatar av3">M</div>
            </div>
            <div class="header-text">
              <h3>Chat trực tuyến</h3>
              <div class="online-row">
                <span class="online-dot"></span>
                <span>3 nhân viên đang trực tuyến</span>
              </div>
            </div>
          </div>
          <button class="close-panel-btn" @click="isOpen = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="intro-body">
          <div class="welcome-box">
            <i class="bi bi-chat-heart-fill welcome-icon"></i>
            <p class="welcome-title">Xin chào! 👋</p>
            <p class="welcome-sub">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn.<br />Thời gian phản hồi
              <strong>~2 phút</strong>.
            </p>
          </div>

          <div class="chat-start-form">
            <div class="input-group-custom">
              <i class="bi bi-person input-icon"></i>
              <input
                v-model="chatStore.chatUser.name"
                type="text"
                placeholder="Tên của bạn *"
                @keyup.enter="chatStore.startChat"
              />
            </div>
            <div class="input-group-custom">
              <i class="bi bi-envelope input-icon"></i>
              <input
                v-model="chatStore.chatUser.email"
                type="email"
                placeholder="Email (không bắt buộc)"
                @keyup.enter="chatStore.startChat"
              />
            </div>
            <button
              class="start-chat-btn"
              @click="chatStore.startChat"
              :disabled="chatStore.chatLoading"
            >
              <span v-if="chatStore.chatLoading" class="spinner"></span>
              <i v-else class="bi bi-send-fill"></i>
              {{ chatStore.chatLoading ? "Đang kết nối..." : "Bắt đầu chat" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Đang chat -->
      <div v-else class="chat-interface">
        <div class="chat-header-bar">
          <div class="agent-active">
            <div class="agent-avatar-sm">BT</div>
            <div>
              <span class="agent-name">BanDoThao Support</span>
              <span class="agent-status">
                <span class="online-dot-sm"></span>
                Đang hoạt động
              </span>
            </div>
          </div>
          <div class="header-actions">
            <button class="icon-btn" title="Thu nhỏ" @click="isOpen = false">
              <i class="bi bi-dash-lg"></i>
            </button>
            <button
              class="icon-btn"
              title="Kết thúc"
              @click="onEndChat"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <div class="messages-area" ref="messagesArea">
          <div
            v-for="msg in chatStore.messages"
            :key="msg.id"
            class="message"
            :class="msg.sender === 'customer' ? 'message-user' : 'message-agent'"
          >
            <div v-if="msg.sender !== 'customer'" class="msg-avatar">
              <i class="bi bi-headset"></i>
            </div>
            <div class="msg-bubble" :class="{ pending: msg._pending }">
              <p>{{ msg.message }}</p>
              <span class="msg-time">
                <i class="bi bi-clock" style="font-size: 9px"></i>
                {{ msg.created_at }}
                <!-- Hiện icon loading khi tin đang gửi -->
                <i v-if="msg._pending" class="bi bi-hourglass-split" style="font-size: 9px; margin-left: 2px;"></i>
              </span>
            </div>
          </div>
        </div>

        <div class="chat-input-bar">
          <button class="attach-btn" title="Đính kèm">
            <i class="bi bi-paperclip"></i>
          </button>
          <input
            v-model="chatStore.newMessage"
            type="text"
            placeholder="Nhập tin nhắn..."
            @keyup.enter="onSend"
            :disabled="chatStore.sending"
          />
          <button
            class="send-btn"
            @click="onSend"
            :disabled="!chatStore.newMessage.trim() || chatStore.sending"
          >
            <i class="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from "vue";
import { useChatStore } from "@/stores/useChatStore";

const chatStore   = useChatStore();
const messagesArea = ref(null);
const isOpen       = ref(false);

// Auto-scroll khi có tin nhắn mới
watch(
  () => chatStore.messages.length,
  () =>
    nextTick(() => {
      if (messagesArea.value) {
        messagesArea.value.scrollTop = messagesArea.value.scrollHeight;
      }
    })
);

const onSend = () => chatStore.sendMessage();

// FIX: endChat đã xử lý leave channel + reset state
// stopPolling() không tồn tại trong store → xoá đi
const onEndChat = () => {
  chatStore.endChat();
  isOpen.value = false;
};

// Cleanup khi component bị destroy (ví dụ navigate sang trang khác)
onBeforeUnmount(() => {
  if (chatStore.chatStarted) {
    chatStore.endChat();
  }
});
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ══ FAB BUTTON ══ */
.livechat-fab {
  position: fixed;
  bottom: 88px;
  right: 24px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #1a2b4a;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 20px rgba(26, 43, 74, 0.45);
  z-index: 1001;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.livechat-fab:hover {
  background: #1d4ed8;
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(29, 78, 216, 0.45);
}
.livechat-fab.active {
  background: #374151;
}

.fab-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 11px;
  height: 11px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid #fff;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(34, 197, 94, 0);
  }
}

/* ══ PANEL ══ */
.chat-panel {
  position: fixed;
  bottom: 152px;
  right: 24px;
  width: 360px;
  z-index: 1000;
  border-radius: 18px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}

.chat-pop-enter-active {
  animation: popIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.chat-pop-leave-active {
  animation: popIn 0.18s ease-in reverse;
}
@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* ══ PANEL HEADER ══ */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  background: linear-gradient(135deg, #1a2b4a 0%, #1d4ed8 100%);
  color: #fff;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.agent-avatars {
  display: flex;
}
.agent-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.5);
  margin-right: -8px;
}
.av1 {
  background: #93c5fd;
  color: #1e3a8a;
}
.av2 {
  background: #f9a8d4;
  color: #9d174d;
}
.av3 {
  background: #6ee7b7;
  color: #064e3b;
}

.header-text h3 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 3px;
}
.online-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  opacity: 0.9;
}
.online-dot {
  width: 7px;
  height: 7px;
  background: #4ade80;
  border-radius: 50%;
  flex-shrink: 0;
}

.close-panel-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background 0.2s;
}
.close-panel-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* ══ INTRO BODY ══ */
.intro-body {
  background: #fff;
  padding: 20px;
}
.welcome-box {
  text-align: center;
  padding: 16px 0 20px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 20px;
}
.welcome-icon {
  font-size: 32px;
  color: #1d4ed8;
  margin-bottom: 10px;
  display: block;
}
.welcome-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
}
.welcome-sub {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
}

.chat-start-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.input-group-custom {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  font-size: 14px;
  pointer-events: none;
}
.input-group-custom input {
  width: 100%;
  padding: 10px 14px 10px 34px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}
.input-group-custom input:focus {
  border-color: #2563eb;
}

.start-chat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: linear-gradient(135deg, #1a2b4a, #1d4ed8);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s, transform 0.2s;
}
.start-chat-btn:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}
.start-chat-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

/* ══ CHAT INTERFACE ══ */
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 420px;
}

.chat-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: linear-gradient(135deg, #1a2b4a 0%, #1d4ed8 100%);
  color: #fff;
}
.agent-active {
  display: flex;
  align-items: center;
  gap: 10px;
}
.agent-avatar-sm {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.agent-name {
  display: block;
  font-size: 13px;
  font-weight: 700;
}
.agent-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
}
.online-dot-sm {
  width: 6px;
  height: 6px;
  background: #4ade80;
  border-radius: 50%;
}

.header-actions {
  display: flex;
  gap: 6px;
}
.icon-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: background 0.2s;
}
.icon-btn:hover {
  background: rgba(255, 255, 255, 0.28);
}

/* Messages */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f8fafc;
}
.messages-area::-webkit-scrollbar {
  width: 4px;
}
.messages-area::-webkit-scrollbar-track {
  background: transparent;
}
.messages-area::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.message {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.message-user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.msg-bubble {
  max-width: 75%;
  padding: 9px 13px;
  border-radius: 14px;
  transition: opacity 0.2s;
}

/* Tin đang chờ gửi → mờ hơn một chút */
.msg-bubble.pending {
  opacity: 0.65;
}

.message-agent .msg-bubble {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 4px;
}
.message-user .msg-bubble {
  background: linear-gradient(135deg, #1d4ed8, #3b82f6);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.msg-bubble p {
  font-size: 13px;
  line-height: 1.55;
}
.msg-time {
  font-size: 10px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 4px;
}
.message-user .msg-time {
  color: rgba(255, 255, 255, 0.65);
  justify-content: flex-end;
}

/* Input bar */
.chat-input-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid #e5e7eb;
  background: #fff;
}
.attach-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 17px;
  display: flex;
  align-items: center;
  padding: 4px;
  transition: color 0.2s;
}
.attach-btn:hover {
  color: #1d4ed8;
}

.chat-input-bar input {
  flex: 1;
  padding: 9px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 20px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
  background: #f9fafb;
  transition: border-color 0.2s, background 0.2s;
}
.chat-input-bar input:focus {
  border-color: #2563eb;
  background: #fff;
}

.send-btn {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #1a2b4a, #1d4ed8);
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  transition: opacity 0.2s, transform 0.2s;
}
.send-btn:hover {
  opacity: 0.9;
  transform: scale(1.08);
}
.send-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
  transform: none;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>