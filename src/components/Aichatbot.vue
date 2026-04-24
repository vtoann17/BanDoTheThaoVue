<script setup>
import { ref, nextTick } from 'vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

const open     = ref(false)
const loading  = ref(false)
const input    = ref('')

// Cập nhật câu chào để hướng dẫn người dùng tìm theo giá
const messages = ref([
  {
    role: 'assistant',
    content: 'Xin chào! Tôi có thể giúp bạn tìm sản phẩm theo tên, thương hiệu, hoặc mức giá. Thử hỏi "Tìm giày dưới 500k" xem sao nhé!',
    products: []
  }
])

const messagesEl = ref(null)

async function send() {
  const msg = input.value.trim()
  if (!msg || loading.value) return

  messages.value.push({ role: 'user', content: msg, products: [] })
  input.value   = ''
  loading.value = true
  await scrollDown()

  try {
    const history = messages.value
      .filter((m, i) => i > 0)
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }))

    const res = await axios.post(`${API_BASE}/chatbot`, {
      message: msg,
      history
    })

    const text     = res.data.reply || 'Xin lỗi, không có phản hồi.'
    const products = res.data.products || []

    messages.value.push({ role: 'assistant', content: text, products })
  } catch (err) {
    console.error(err)
    messages.value.push({
      role: 'assistant',
      content: 'Đã có lỗi xảy ra, vui lòng thử lại!',
      products: []
    })
  }

  loading.value = false
  await scrollDown()
}

async function scrollDown() {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

function fmtPrice(p) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
}

function imgSrc(img) {
  if (!img) return 'https://placehold.co/64x64?text=No+img'
  if (img.startsWith('http')) return img
  const storageUrl = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000'
  let cleanPath = img.replace(/^\/?storage\//, '')
  cleanPath = cleanPath.replace(/^\//, '')
  return `${storageUrl}/${cleanPath}`
}

function clickSuggestion(s) {
  input.value = s
  send()
}

// Cập nhật các gợi ý để test chức năng tìm theo giá
const suggestions = [
  'Giày chạy bộ', 
  'Giày dưới 500k', 
  'Sản phẩm từ 1 đến 2 triệu', 
  'Áo bóng đá'
]
</script>

<template>
  <button class="chat-fab" @click="open = !open">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  </button>

  <transition name="chat-slide">
    <div v-if="open" class="chat-window">

      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar">S</div>
          <div>
            <p class="chat-name">THBA ChatBot</p>
            <p class="chat-status">Trực tuyến</p>
          </div>
        </div>
        <button class="close-btn" @click="open = false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="chat-messages" ref="messagesEl">
        <div v-for="(m, i) in messages" :key="i" :class="['msg', m.role]">
          <div class="bubble">{{ m.content }}</div>

          <div v-if="m.products.length" class="products">
            <a v-for="p in m.products" :key="p.id" :href="`/productdetail/${p.slug}`" class="product">
              <img :src="imgSrc(p.image)" :alt="p.name" />
              <div class="product-info">
                <b class="product-name">{{ p.name }}</b>
                <p class="product-price">{{ fmtPrice(p.price) }}</p>
              </div>
            </a>
          </div>
        </div>

        <div v-if="loading" class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div class="suggestions">
        <button v-for="s in suggestions" :key="s" class="suggestion-chip" @click="clickSuggestion(s)">
          {{ s }}
        </button>
      </div>

      <div class="input-row">
        <input
          v-model="input"
          @keyup.enter="send"
          placeholder="Nhập tin nhắn..."
          class="chat-input"
        />
        <button @click="send" class="send-btn" :disabled="loading">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

    </div>
  </transition>
</template>

<style scoped>
.chat-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 52px;
  height: 52px;
  background: #1565C0;
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(21, 101, 192, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 999;
}

.chat-fab:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(21, 101, 192, 0.5);
}

.chat-window {
  position: fixed;
  bottom: 88px;
  right: 24px;
  width: 340px;
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  height: 540px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 998;
}

.chat-header {
  background: #1565C0;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-name {
  margin: 0;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
}

.chat-status {
  margin: 0;
  color: rgba(255, 255, 255, 0.75);
  font-size: 11px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 8px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: background 0.15s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f7f8fc;
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
}

.msg {
  display: flex;
  flex-direction: column;
  max-width: 85%;
}

.msg.user {
  align-self: flex-end;
  align-items: flex-end;
}

.msg.assistant {
  align-self: flex-start;
  align-items: flex-start;
}

.bubble {
  padding: 10px 13px;
  border-radius: 14px;
  font-size: 13.5px;
  line-height: 1.5;
  word-break: break-word;
  background: #fff;
  color: #1a1a2e;
  border: 1px solid #e8eaf0;
}

.msg.user .bubble {
  background: #1565C0;
  color: #fff;
  border-color: #1565C0;
  border-radius: 14px 14px 4px 14px;
}

.msg.assistant .bubble {
  border-radius: 14px 14px 14px 4px;
}

.products {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.product {
  display: flex;
  gap: 10px;
  align-items: center;
  border: 1px solid #e8eaf0;
  border-radius: 10px;
  padding: 8px 10px;
  background: #fff;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.product:hover {
  border-color: #1565C0;
  box-shadow: 0 2px 8px rgba(21, 101, 192, 0.12);
}

.product img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  background: #f0f2f8;
  flex-shrink: 0;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.product-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 12px;
  color: #1565C0;
  font-weight: 600;
  margin: 0;
}

.typing-indicator {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 10px 13px;
  background: #fff;
  border-radius: 14px 14px 14px 4px;
  border: 1px solid #e8eaf0;
  width: fit-content;
}

.typing-indicator span {
  width: 7px;
  height: 7px;
  background: #b0b8d0;
  border-radius: 50%;
  animation: blink 1.2s infinite;
}

.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
  40% { opacity: 1; transform: scale(1); }
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 12px 8px;
  background: #fff;
  border-top: 1px solid #f0f2f8;
  flex-shrink: 0;
}

.suggestion-chip {
  font-size: 11.5px;
  padding: 5px 11px;
  border-radius: 20px;
  border: 1px solid #d0d8f0;
  background: #f0f4ff;
  color: #1565C0;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  white-space: nowrap;
}

.suggestion-chip:hover {
  background: #dce7ff;
  border-color: #1565C0;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #fff;
  border-top: 1px solid #f0f2f8;
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
  border: 1px solid #e0e4ef;
  border-radius: 22px;
  padding: 9px 14px;
  font-size: 13.5px;
  outline: none;
  background: #f7f8fc;
  color: #1a1a2e;
  transition: border-color 0.15s, background 0.15s;
}

.chat-input:focus {
  border-color: #1565C0;
  background: #fff;
}

.chat-input::placeholder {
  color: #a0a8c0;
}

.send-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #1565C0;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s, transform 0.1s;
}

.send-btn:hover {
  background: #1251a3;
}

.send-btn:active {
  transform: scale(0.93);
}

.send-btn:disabled {
  background: #b0bcd8;
  cursor: not-allowed;
}

.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: opacity 0.2s, transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}
</style>