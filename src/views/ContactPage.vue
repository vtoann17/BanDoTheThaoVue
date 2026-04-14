<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          Hỗ trợ trực tuyến
        </div>
        <h1 class="hero-title">Liên hệ với chúng tôi</h1>
        <p class="hero-subtitle">Đội ngũ hỗ trợ luôn sẵn sàng giúp bạn 24/7</p>
      </div>
    </div>

    <div class="main-container">
      <!-- Info Cards -->
      <div class="info-cards">
        <div class="info-card">
          <div class="info-icon phone-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.72a16 16 0 006.29 6.29l1.94-1.16a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
              />
            </svg>
          </div>
          <div class="info-text">
            <span class="info-label">Điện thoại</span>
            <span class="info-value">1800 123 456</span>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon email-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div class="info-text">
            <span class="info-label">Email</span>
            <span class="info-value">support@bandothao.vn</span>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon time-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div class="info-text">
            <span class="info-label">Giờ làm việc</span>
            <span class="info-value">8:00 - 22:00 hàng ngày</span>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <!-- ─── Form Liên Hệ ─── -->
        <div class="form-section">
          <div class="section-header">
            <h2>Gửi tin nhắn</h2>
            <p>Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 24h</p>
          </div>

          <div class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label>Họ và tên <span class="required">*</span></label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  :class="{ error: errors.name }"
                />
                <span v-if="errors.name" class="error-msg">{{
                  errors.name
                }}</span>
              </div>
              <div class="form-group">
                <label>Số điện thoại</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="0912 345 678"
                />
              </div>
            </div>
            <div class="form-group">
              <label>Email <span class="required">*</span></label>
              <input
                v-model="form.email"
                type="email"
                placeholder="email@example.com"
                :class="{ error: errors.email }"
              />
              <span v-if="errors.email" class="error-msg">{{
                errors.email
              }}</span>
            </div>
            <div class="form-group">
              <label>Chủ đề <span class="required">*</span></label>
              <select v-model="form.topic" :class="{ error: errors.topic }">
                <option value="">-- Chọn chủ đề --</option>
                <option value="order">Hỏi về đơn hàng</option>
                <option value="product">Thông tin sản phẩm</option>
                <option value="payment">Thanh toán & hoàn tiền</option>
                <option value="technical">Hỗ trợ kỹ thuật</option>
                <option value="other">Khác</option>
              </select>
              <span v-if="errors.topic" class="error-msg">{{
                errors.topic
              }}</span>
            </div>
            <div class="form-group">
              <label>Nội dung <span class="required">*</span></label>
              <textarea
                v-model="form.message"
                rows="5"
                placeholder="Mô tả vấn đề của bạn..."
                :class="{ error: errors.message }"
              ></textarea>
              <span v-if="errors.message" class="error-msg">{{
                errors.message
              }}</span>
            </div>

            <!-- API Error -->
            <div v-if="apiError" class="api-error-banner">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                width="16"
                height="16"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {{ apiError }}
            </div>

            <button
              class="submit-btn"
              @click="submitForm"
              :disabled="submitting"
            >
              <span v-if="!submitting">Gửi tin nhắn</span>
              <span v-else class="loading-text"
                ><span class="spinner"></span>Đang gửi...</span
              >
            </button>

            <div v-if="submitted" class="success-banner">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div>
                <strong>Gửi thành công!</strong>
                <p>{{ successMsg }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── Chat Trực Tuyến ─── -->
        <div class="chat-section">
          <div class="section-header">
            <h2>Chat trực tuyến</h2>
            <p>Nhắn tin ngay với nhân viên hỗ trợ</p>
          </div>

          <div class="chat-widget">
            <!-- Chưa bắt đầu chat -->
            <div v-if="!chatStarted" class="chat-intro">
              <div class="agents-preview">
                <div class="agent-avatars">
                  <div class="agent-avatar av1">T</div>
                  <div class="agent-avatar av2">H</div>
                  <div class="agent-avatar av3">M</div>
                </div>
                <div class="agent-info">
                  <div class="online-dot"></div>
                  <span>3 nhân viên đang trực tuyến</span>
                </div>
              </div>
              <p class="response-time">
                Thời gian phản hồi trung bình: <strong>~2 phút</strong>
              </p>
              <div class="chat-start-form">
                <input
                  v-model="chatUser.name"
                  type="text"
                  placeholder="Tên của bạn *"
                />
                <input
                  v-model="chatUser.email"
                  type="email"
                  placeholder="Email (không bắt buộc)"
                />
                <div v-if="chatError" class="chat-error">{{ chatError }}</div>
                <button
                  class="start-chat-btn"
                  @click="startChat"
                  :disabled="chatLoading"
                >
                  <svg
                    v-if="!chatLoading"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                    />
                  </svg>
                  <span
                    class="spinner"
                    v-else
                    style="
                      border-color: rgba(255, 255, 255, 0.3);
                      border-top-color: #fff;
                    "
                  ></span>
                  {{ chatLoading ? "Đang kết nối..." : "Bắt đầu chat" }}
                </button>
              </div>
            </div>

            <!-- Đang chat -->
            <div v-else class="chat-interface">
              <div class="chat-header-bar">
                <div class="agent-active">
                  <div class="agent-avatar-sm">BT</div>
                  <div>
                    <span class="agent-name">BanDoThao Support</span>
                    <span class="agent-status">Đang hoạt động</span>
                  </div>
                </div>
                <button
                  class="end-chat-btn"
                  @click="endChat"
                  title="Kết thúc chat"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    width="14"
                    height="14"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div class="messages-area" ref="messagesArea">
                <div
                  v-for="msg in messages"
                  :key="msg.id"
                  class="message"
                  :class="
                    msg.sender === 'customer' ? 'message-user' : 'message-agent'
                  "
                >
                  <div v-if="msg.sender === 'admin'" class="msg-avatar">BT</div>
                  <div class="msg-bubble">
                    <p>{{ msg.message }}</p>
                    <span class="msg-time">{{ msg.created_at }}</span>
                  </div>
                </div>
                <div v-if="agentTyping" class="message message-agent">
                  <div class="msg-avatar">BT</div>
                  <div class="msg-bubble typing-bubble">
                    <span class="dot"></span><span class="dot"></span
                    ><span class="dot"></span>
                  </div>
                </div>
              </div>

              <div class="chat-input-bar">
                <input
                  v-model="newMessage"
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  @keyup.enter="sendChatMessage"
                  :disabled="sending"
                />
                <button
                  class="send-btn"
                  @click="sendChatMessage"
                  :disabled="!newMessage.trim() || sending"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    width="16"
                    height="16"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const API = import.meta.env.VITE_API_BASE || "/api";

export default {
  name: "ContactPage",
  data() {
    return {
      // Form liên hệ
      form: { name: "", phone: "", email: "", topic: "", message: "" },
      errors: {},
      submitting: false,
      submitted: false,
      successMsg: "",
      apiError: "",

      // Chat
      chatUser: { name: "", email: "" },
      chatStarted: false,
      chatLoading: false,
      chatError: "",
      contactId: null,
      messages: [],
      newMessage: "",
      sending: false,
      agentTyping: false,
      pollInterval: null,
      lastMsgId: 0,
    };
  },
  beforeUnmount() {
    this.stopPolling();
  },
  methods: {
    // ─── FORM ────────────────────────────────────────
    validate() {
      this.errors = {};
      if (!this.form.name.trim()) this.errors.name = "Vui lòng nhập họ tên";
      if (!this.form.email.trim()) this.errors.email = "Vui lòng nhập email";
      else if (!/\S+@\S+\.\S+/.test(this.form.email))
        this.errors.email = "Email không hợp lệ";
      if (!this.form.topic) this.errors.topic = "Vui lòng chọn chủ đề";
      if (!this.form.message.trim())
        this.errors.message = "Vui lòng nhập nội dung";
      else if (this.form.message.trim().length < 10)
        this.errors.message = "Nội dung quá ngắn (tối thiểu 10 ký tự)";
      return Object.keys(this.errors).length === 0;
    },

    async submitForm() {
      if (!this.validate()) return;
      this.submitting = true;
      this.apiError = "";
      try {
        const { data } = await axios.post(`${API}/contacts`, this.form);
        this.submitted = true;
        this.successMsg = data.message;
        this.form = { name: "", phone: "", email: "", topic: "", message: "" };
        setTimeout(() => {
          this.submitted = false;
        }, 6000);
      } catch (err) {
        if (err.response?.status === 422) {
          // Laravel validation errors
          const laravelErrors = err.response.data.errors || {};
          Object.keys(laravelErrors).forEach((key) => {
            this.errors[key] = laravelErrors[key][0];
          });
        } else {
          this.apiError = "Có lỗi xảy ra. Vui lòng thử lại sau.";
        }
      } finally {
        this.submitting = false;
      }
    },

    // ─── CHAT ────────────────────────────────────────
    async startChat() {
      if (!this.chatUser.name.trim()) {
        this.chatError = "Vui lòng nhập tên của bạn.";
        return;
      }
      this.chatError = "";
      this.chatLoading = true;
      try {
        const { data } = await axios.post(`${API}/chat/start`, this.chatUser);
        this.contactId = data.contact_id;
        this.messages = [data.welcome];
        this.lastMsgId = data.welcome.id;
        this.chatStarted = true;
        this.startPolling();
      } catch {
        this.chatError = "Không thể kết nối. Vui lòng thử lại.";
      } finally {
        this.chatLoading = false;
      }
    },

    async sendChatMessage() {
      const text = this.newMessage.trim();
      if (!text || this.sending) return;
      this.sending = true;
      const optimistic = {
        id: Date.now(),
        sender: "customer",
        message: text,
        created_at: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      this.messages.push(optimistic);
      this.newMessage = "";
      this.scrollBottom();
      try {
        const { data } = await axios.post(
          `${API}/chat/${this.contactId}/messages`,
          {
            message: text,
            sender: "customer",
            sender_name: this.chatUser.name,
          }
        );
        // Cập nhật optimistic message với real ID
        const idx = this.messages.findIndex((m) => m.id === optimistic.id);
        if (idx > -1) this.messages[idx] = data.data;
        this.lastMsgId = data.data.id;
      } catch {
        // Giữ optimistic message nếu lỗi
      } finally {
        this.sending = false;
      }
    },

    // Polling lấy tin nhắn mới từ admin (mỗi 3 giây)
    startPolling() {
      this.pollInterval = setInterval(this.pollMessages, 3000);
    },
    stopPolling() {
      if (this.pollInterval) clearInterval(this.pollInterval);
    },
    async pollMessages() {
      if (!this.contactId) return;
      try {
        const { data } = await axios.get(
          `${API}/chat/${this.contactId}/messages`,
          {
            params: { after_id: this.lastMsgId },
          }
        );
        if (data.data && data.data.length > 0) {
          // Chỉ thêm tin nhắn của admin
          const adminMsgs = data.data.filter((m) => m.sender === "admin");
          if (adminMsgs.length > 0) {
            this.messages.push(...adminMsgs);
            this.lastMsgId = adminMsgs[adminMsgs.length - 1].id;
            this.scrollBottom();
          }
        }
      } catch {
        /* silent fail */
      }
    },

    endChat() {
      this.stopPolling();
      this.chatStarted = false;
      this.chatUser = { name: "", email: "" };
      this.messages = [];
      this.contactId = null;
      this.lastMsgId = 0;
    },

    scrollBottom() {
      this.$nextTick(() => {
        if (this.$refs.messagesArea) {
          this.$refs.messagesArea.scrollTop =
            this.$refs.messagesArea.scrollHeight;
        }
      });
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.contact-page {
  font-family: "Segoe UI", sans-serif;
  background: #f5f7fa;
  min-height: 100vh;
  color: #1a2332;
}

.hero-section {
  background: linear-gradient(135deg, #1a2b4a 0%, #2d4a7a 100%);
  padding: 60px 24px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.hero-section::before {
  content: "";
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  top: -100px;
  right: -100px;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #7dd3fc;
  font-size: 13px;
  padding: 6px 16px;
  border-radius: 20px;
  margin-bottom: 20px;
}
.badge-dot {
  width: 7px;
  height: 7px;
  background: #4ade80;
  border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.3);
  }
}
.hero-title {
  font-size: 42px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}
.hero-subtitle {
  color: #93c5fd;
  font-size: 17px;
}

.main-container {
  max-width: 1100px;
  margin: -40px auto 0;
  padding: 0 24px 60px;
}
.info-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}
.info-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.info-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.info-icon svg {
  width: 20px;
  height: 20px;
}
.phone-icon {
  background: #eff6ff;
  color: #2563eb;
}
.email-icon {
  background: #f0fdf4;
  color: #16a34a;
}
.time-icon {
  background: #fff7ed;
  color: #ea580c;
}
.info-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 2px;
}
.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.form-section,
.chat-section {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
}
.section-header {
  margin-bottom: 24px;
}
.section-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
}
.section-header p {
  font-size: 14px;
  color: #6b7280;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.form-group {
  margin-bottom: 18px;
}
.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}
.required {
  color: #ef4444;
}
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #2563eb;
}
.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #ef4444;
}
.error-msg {
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
  display: block;
}
.form-group textarea {
  resize: vertical;
}

.api-error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #dc2626;
}
.chat-error {
  font-size: 13px;
  color: #dc2626;
}

.submit-btn {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  font-family: inherit;
}
.submit-btn:hover {
  opacity: 0.92;
}
.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.loading-text {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}
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

.success-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  padding: 16px;
  margin-top: 16px;
  animation: slideIn 0.3s ease;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.success-banner svg {
  width: 20px;
  height: 20px;
  color: #16a34a;
  flex-shrink: 0;
  margin-top: 2px;
}
.success-banner strong {
  color: #166534;
  font-size: 14px;
  display: block;
}
.success-banner p {
  color: #15803d;
  font-size: 13px;
  margin-top: 2px;
}

/* Chat */
.chat-widget {
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}
.chat-intro {
  padding: 28px;
}
.agent-avatars {
  display: flex;
  margin-bottom: 8px;
}
.agent-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  margin-right: -8px;
}
.av1 {
  background: #dbeafe;
  color: #1d4ed8;
}
.av2 {
  background: #fce7f3;
  color: #be185d;
}
.av3 {
  background: #d1fae5;
  color: #065f46;
}
.agent-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #374151;
  margin-top: 10px;
}
.online-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
}
.response-time {
  font-size: 13px;
  color: #6b7280;
  margin: 12px 0 24px;
}
.chat-start-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.chat-start-form input {
  padding: 10px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
}
.chat-start-form input:focus {
  border-color: #2563eb;
}
.start-chat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #1d4ed8;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
}
.start-chat-btn:hover {
  background: #1e40af;
}
.start-chat-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.chat-interface {
  display: flex;
  flex-direction: column;
  height: 440px;
}
.chat-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #1a2b4a;
  color: #fff;
}
.agent-active {
  display: flex;
  align-items: center;
  gap: 10px;
}
.agent-avatar-sm {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #3b82f6;
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
  font-weight: 600;
}
.agent-status {
  font-size: 11px;
  color: #4ade80;
}
.end-chat-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
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
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.msg-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 14px;
}
.message-agent .msg-bubble {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 4px;
}
.message-user .msg-bubble {
  background: #1d4ed8;
  color: #fff;
  border-bottom-right-radius: 4px;
}
.msg-bubble p {
  font-size: 13px;
  line-height: 1.5;
}
.msg-time {
  font-size: 10px;
  color: #9ca3af;
  display: block;
  margin-top: 4px;
}
.message-user .msg-time {
  text-align: right;
  color: rgba(255, 255, 255, 0.6);
}
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 14px;
}
.dot {
  width: 6px;
  height: 6px;
  background: #9ca3af;
  border-radius: 50%;
  animation: bounce 1.2s infinite;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
.chat-input-bar {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #e5e7eb;
  background: #fff;
}
.chat-input-bar input {
  flex: 1;
  padding: 9px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 20px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
}
.chat-input-bar input:focus {
  border-color: #2563eb;
}
.send-btn {
  width: 36px;
  height: 36px;
  background: #1d4ed8;
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.send-btn:hover {
  background: #1e40af;
}
.send-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .info-cards {
    grid-template-columns: 1fr;
  }
  .content-grid {
    grid-template-columns: 1fr;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .hero-title {
    font-size: 28px;
  }
}
</style>