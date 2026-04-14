<template>
  <div class="contact-page">
    <!-- Hero -->
    <div class="hero-section">
      <div class="hero-badge">
        <span class="badge-dot"></span>
        Hỗ trợ trực tuyến
      </div>
      <h1 class="hero-title">Liên hệ với chúng tôi</h1>
      <p class="hero-subtitle">Đội ngũ hỗ trợ luôn sẵn sàng giúp bạn 24/7</p>
    </div>

    <div class="main-container">
      <!-- Info Cards -->
      <div class="info-cards">
        <div class="info-card">
          <div class="info-icon phone-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.72a16 16 0 006.29 6.29l1.94-1.16a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          </div>
          <div class="info-text">
            <span class="info-label">Điện thoại</span>
            <span class="info-value">1800 123 456</span>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon email-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div class="info-text">
            <span class="info-label">Email</span>
            <span class="info-value">support@bandothao.vn</span>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon time-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
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

          <div class="form-row">
            <div class="form-group">
              <label>Họ và tên <span class="required">*</span></label>
              <input v-model="contactStore.form.name" type="text" placeholder="Nguyễn Văn A"
                :class="{ error: contactStore.errors.name }" />
              <span v-if="contactStore.errors.name" class="error-msg">{{ contactStore.errors.name }}</span>
            </div>
            <div class="form-group">
              <label>Số điện thoại</label>
              <input v-model="contactStore.form.phone" type="tel" placeholder="0912 345 678" />
            </div>
          </div>

          <div class="form-group">
            <label>Email <span class="required">*</span></label>
            <input v-model="contactStore.form.email" type="email" placeholder="email@example.com"
              :class="{ error: contactStore.errors.email }" />
            <span v-if="contactStore.errors.email" class="error-msg">{{ contactStore.errors.email }}</span>
          </div>

          <div class="form-group">
            <label>Chủ đề <span class="required">*</span></label>
            <select v-model="contactStore.form.topic" :class="{ error: contactStore.errors.topic }">
              <option value="">-- Chọn chủ đề --</option>
              <option value="order">Hỏi về đơn hàng</option>
              <option value="product">Thông tin sản phẩm</option>
              <option value="payment">Thanh toán & hoàn tiền</option>
              <option value="technical">Hỗ trợ kỹ thuật</option>
              <option value="other">Khác</option>
            </select>
            <span v-if="contactStore.errors.topic" class="error-msg">{{ contactStore.errors.topic }}</span>
          </div>

          <div class="form-group">
            <label>Nội dung <span class="required">*</span></label>
            <textarea v-model="contactStore.form.message" rows="5" placeholder="Mô tả vấn đề của bạn..."
              :class="{ error: contactStore.errors.message }"></textarea>
            <span v-if="contactStore.errors.message" class="error-msg">{{ contactStore.errors.message }}</span>
          </div>

          <div v-if="contactStore.submitted" class="success-banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <div>
              <strong>Gửi thành công!</strong>
              <p>Chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.</p>
            </div>
          </div>

          <button class="submit-btn" @click="contactStore.submitForm" :disabled="contactStore.submitting">
            <span v-if="!contactStore.submitting">Gửi tin nhắn</span>
            <span v-else class="loading-text">
              <span class="spinner"></span>Đang gửi...
            </span>
          </button>
        </div>

        <!-- ─── Chat Trực Tuyến ─── -->
        <div class="chat-section">
          <div class="section-header">
            <h2>Chat trực tuyến</h2>
            <p>Nhắn tin ngay với nhân viên hỗ trợ</p>
          </div>

          <div class="chat-widget">
            <!-- Chưa bắt đầu -->
            <div v-if="!chatStore.chatStarted" class="chat-intro">
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
              <p class="response-time">Thời gian phản hồi: <strong>~2 phút</strong></p>

              <div class="chat-start-form">
                <input v-model="chatStore.chatUser.name" type="text" placeholder="Tên của bạn *" />
                <input v-model="chatStore.chatUser.email" type="email" placeholder="Email (không bắt buộc)" />
                <button class="start-chat-btn" @click="chatStore.startChat" :disabled="chatStore.chatLoading">
                  <svg v-if="!chatStore.chatLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                  <span v-else class="spinner" style="border-color:rgba(255,255,255,.3);border-top-color:#fff;"></span>
                  {{ chatStore.chatLoading ? "Đang kết nối..." : "Bắt đầu chat" }}
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
                <button class="end-chat-btn" @click="chatStore.endChat">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div class="messages-area" ref="messagesArea">
                <div v-for="msg in chatStore.messages" :key="msg.id"
                  class="message"
                  :class="msg.sender === 'customer' ? 'message-user' : 'message-agent'"
                >
                  <div v-if="msg.sender === 'admin'" class="msg-avatar">BT</div>
                  <div class="msg-bubble">
                    <p>{{ msg.message }}</p>
                    <span class="msg-time">{{ msg.created_at }}</span>
                  </div>
                </div>
              </div>

              <div class="chat-input-bar">
                <input
                  v-model="chatStore.newMessage"
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  @keyup.enter="onSend"
                  :disabled="chatStore.sending"
                />
                <button class="send-btn" @click="onSend"
                  :disabled="!chatStore.newMessage.trim() || chatStore.sending">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
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

<script setup>
import { watch, nextTick, ref, onBeforeUnmount } from "vue";
import { useContactStore } from "@/stores/useContactStore";
import { useChatStore }    from "@/stores/useChatStore";

const contactStore = useContactStore();
const chatStore    = useChatStore();
const messagesArea = ref(null);

// Cuộn xuống cuối mỗi khi có tin nhắn mới
watch(
  () => chatStore.messages.length,
  () => nextTick(() => {
    if (messagesArea.value) {
      messagesArea.value.scrollTop = messagesArea.value.scrollHeight;
    }
  })
);

const onSend = () => chatStore.sendMessage();

onBeforeUnmount(() => chatStore.stopPolling());
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }
.contact-page { font-family: "Segoe UI", sans-serif; background: #f5f7fa; min-height: 100vh; }

.hero-section { background: linear-gradient(135deg, #1a2b4a 0%, #2d4a7a 100%); padding: 60px 24px 80px; text-align: center; }
.hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); color: #7dd3fc; font-size: 13px; padding: 6px 16px; border-radius: 20px; margin-bottom: 20px; }
.badge-dot { width: 7px; height: 7px; background: #4ade80; border-radius: 50%; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
.hero-title { font-size: 42px; font-weight: 700; color: #fff; margin-bottom: 12px; letter-spacing: -.5px; }
.hero-subtitle { color: #93c5fd; font-size: 17px; }

.main-container { max-width: 1100px; margin: -40px auto 0; padding: 0 24px 60px; }
.info-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 32px; }
.info-card { background: #fff; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 14px; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
.info-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.info-icon svg { width: 20px; height: 20px; }
.phone-icon { background: #eff6ff; color: #2563eb; }
.email-icon { background: #f0fdf4; color: #16a34a; }
.time-icon  { background: #fff7ed; color: #ea580c; }
.info-label { display: block; font-size: 12px; color: #6b7280; margin-bottom: 2px; }
.info-value { font-size: 14px; font-weight: 600; color: #111827; }

.content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.form-section, .chat-section { background: #fff; border-radius: 16px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,.07); }
.section-header { margin-bottom: 24px; }
.section-header h2 { font-size: 22px; font-weight: 700; color: #111827; margin-bottom: 6px; }
.section-header p { font-size: 14px; color: #6b7280; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { margin-bottom: 18px; }
.form-group label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
.required { color: #ef4444; }
.form-group input,
.form-group select,
.form-group textarea { width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 14px; color: #111827; background: #fff; outline: none; transition: border-color .2s; font-family: inherit; }
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus { border-color: #2563eb; }
.form-group input.error,
.form-group select.error,
.form-group textarea.error { border-color: #ef4444; }
.error-msg { font-size: 12px; color: #ef4444; margin-top: 4px; display: block; }
.form-group textarea { resize: vertical; }

.success-banner { display: flex; align-items: flex-start; gap: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
.success-banner svg { width: 20px; height: 20px; color: #16a34a; flex-shrink: 0; margin-top: 2px; }
.success-banner strong { color: #166534; font-size: 14px; display: block; }
.success-banner p { color: #15803d; font-size: 13px; margin-top: 2px; }

.submit-btn { width: 100%; padding: 13px; background: linear-gradient(135deg,#1d4ed8,#2563eb); color: #fff; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; }
.submit-btn:disabled { opacity: .7; cursor: not-allowed; }
.loading-text { display: flex; align-items: center; gap: 8px; justify-content: center; }
.spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Chat */
.chat-widget { border: 1.5px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
.chat-intro { padding: 28px; }
.agent-avatars { display: flex; margin-bottom: 8px; }
.agent-avatar { width: 36px; height: 36px; border-radius: 50%; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; margin-right: -8px; }
.av1{background:#dbeafe;color:#1d4ed8} .av2{background:#fce7f3;color:#be185d} .av3{background:#d1fae5;color:#065f46}
.agent-info { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #374151; margin-top: 10px; }
.online-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; }
.response-time { font-size: 13px; color: #6b7280; margin: 12px 0 24px; }
.chat-start-form { display: flex; flex-direction: column; gap: 10px; }
.chat-start-form input { padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; font-family: inherit; }
.chat-start-form input:focus { border-color: #2563eb; }
.start-chat-btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: #1d4ed8; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
.start-chat-btn:disabled { opacity: .7; cursor: not-allowed; }

.chat-interface { display: flex; flex-direction: column; height: 440px; }
.chat-header-bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: #1a2b4a; color: #fff; }
.agent-active { display: flex; align-items: center; gap: 10px; }
.agent-avatar-sm { width: 34px; height: 34px; border-radius: 50%; background: #3b82f6; color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.agent-name { display: block; font-size: 13px; font-weight: 600; }
.agent-status { font-size: 11px; color: #4ade80; }
.end-chat-btn { background: rgba(255,255,255,.1); border: none; color: #fff; width: 28px; height: 28px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; }

.messages-area { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; background: #f8fafc; }
.message { display: flex; align-items: flex-end; gap: 8px; }
.message-user { flex-direction: row-reverse; }
.msg-avatar { width: 28px; height: 28px; border-radius: 50%; background: #dbeafe; color: #1d4ed8; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.msg-bubble { max-width: 75%; padding: 10px 14px; border-radius: 14px; }
.message-agent .msg-bubble { background: #fff; border: 1px solid #e5e7eb; border-bottom-left-radius: 4px; }
.message-user  .msg-bubble { background: #1d4ed8; color: #fff; border-bottom-right-radius: 4px; }
.msg-bubble p { font-size: 13px; line-height: 1.5; }
.msg-time { font-size: 10px; color: #9ca3af; display: block; margin-top: 4px; }
.message-user .msg-time { color: rgba(255,255,255,.6); text-align: right; }

.chat-input-bar { display: flex; gap: 8px; padding: 12px; border-top: 1px solid #e5e7eb; background: #fff; }
.chat-input-bar input { flex: 1; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 20px; font-size: 13px; outline: none; font-family: inherit; }
.chat-input-bar input:focus { border-color: #2563eb; }
.send-btn { width: 36px; height: 36px; background: #1d4ed8; color: #fff; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.send-btn:disabled { background: #93c5fd; cursor: not-allowed; }

@media (max-width: 768px) {
  .info-cards { grid-template-columns: 1fr; }
  .content-grid { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
  .hero-title { font-size: 28px; }
}
</style>