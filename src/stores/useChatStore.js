import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";
import { echo } from "@/utils/echo"; // Đảm bảo bạn đã tạo file này như hướng dẫn trước

export const useChatStore = defineStore("chat", () => {
    const notify  = useNotify();
    const apiBase = import.meta.env.VITE_API_BASE;

    // ─── State ──────────────────────────────────────────────────
    const chatUser    = ref({ name: "", email: "" });
    const chatStarted = ref(false);
    const chatLoading = ref(false);
    const contactId   = ref(null);
    const messages    = ref([]);
    const newMessage  = ref("");
    const sending     = ref(false);

    // ─── Actions ────────────────────────────────────────────────
    
    /**
     * Lắng nghe kênh Socket realtime
     */
    const listenRealtime = () => {
        if (!contactId.value) return;

        // Rời kênh cũ nếu có để tránh trùng lặp listener
        echo.leaveChannel(`chat.${contactId.value}`);

        echo.channel(`chat.${contactId.value}`)
            .listen('.message.sent', (e) => {
                // Kiểm tra nếu tin nhắn đến từ Admin thì mới push vào list 
                // (Tin nhắn của Customer đã được xử lý bởi Optimistic UI)
                const isExisting = messages.value.some(m => m.id === e.message.id);
                if (!isExisting && e.message.sender === 'admin') {
                    messages.value.push(e.message);
                }
            });
    };

    const startChat = async () => {
        if (!chatUser.value.name.trim()) {
            notify.toastError("Vui lòng nhập tên của bạn.");
            return false;
        }

        chatLoading.value = true;
        try {
            const res = await axios.post(`${apiBase}/chat/start`, chatUser.value);
            if (res.status === 201) {
                contactId.value   = res.data.contact_id;
                messages.value    = [res.data.welcome];
                chatStarted.value = true;
                
                // Kích hoạt lắng nghe Realtime ngay khi bắt đầu
                listenRealtime();
                return true;
            }
        } catch (err) {
            notify.toastError("Không thể kết nối phòng chat. Vui lòng thử lại.");
            return false;
        } finally {
            chatLoading.value = false;
        }
    };

    const sendMessage = async () => {
        const text = newMessage.value.trim();
        if (!text || sending.value) return;

        sending.value = true;

        // Optimistic UI — Hiển thị tin nhắn ngay lập tức để tạo cảm giác mượt mà
        const optimisticId = Date.now();
        const optimisticMsg = {
            id:         optimisticId,
            sender:     "customer",
            message:    text,
            created_at: new Date().toLocaleTimeString("vi-VN", {
                hour:   "2-digit",
                minute: "2-digit",
            }),
        };
        
        messages.value.push(optimisticMsg);
        newMessage.value = "";

        try {
            const res = await axios.post(
                `${apiBase}/chat/${contactId.value}/messages`,
                {
                    message:     text,
                    sender:      "customer",
                    sender_name: chatUser.value.name,
                }
            );
            
            if (res.status === 201) {
                // Thay thế tin nhắn "tạm" bằng dữ liệu chính thức từ Server (có ID thật)
                const idx = messages.value.findIndex((m) => m.id === optimisticId);
                if (idx !== -1) {
                    messages.value[idx] = res.data.data;
                }
            }
        } catch {
            notify.toastError("Gửi tin nhắn thất bại.");
            // Xóa tin nhắn khỏi danh sách nếu gửi lỗi
            messages.value = messages.value.filter(m => m.id !== optimisticId);
        } finally {
            sending.value = false;
        }
    };

    const endChat = () => {
        // Rời kênh Socket
        if (contactId.value) {
            echo.leaveChannel(`chat.${contactId.value}`);
        }

        chatStarted.value = false;
        contactId.value   = null;
        messages.value    = [];
        chatUser.value    = { name: "", email: "" };
    };

    return {
        chatUser,
        chatStarted,
        chatLoading,
        messages,
        newMessage,
        sending,
        startChat,
        sendMessage,
        endChat,
    };
});