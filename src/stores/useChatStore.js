import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

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
    const lastMsgId   = ref(0);

    let pollInterval = null;

    // ─── Actions ────────────────────────────────────────────────
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
                lastMsgId.value   = res.data.welcome.id;
                chatStarted.value = true;
                startPolling();
                return true;
            }
        } catch (err) {
            notify.toastError("Không thể kết nối. Vui lòng thử lại.");
            return false;
        } finally {
            chatLoading.value = false;
        }
    };

    const sendMessage = async () => {
        const text = newMessage.value.trim();
        if (!text || sending.value) return;

        sending.value = true;

        // Optimistic UI — hiển thị ngay trước khi API phản hồi
        const optimistic = {
            id:         Date.now(),
            sender:     "customer",
            message:    text,
            created_at: new Date().toLocaleTimeString("vi-VN", {
                hour:   "2-digit",
                minute: "2-digit",
            }),
        };
        messages.value.push(optimistic);
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
                // Thay optimistic bằng dữ liệu thật từ server
                const idx = messages.value.findIndex((m) => m.id === optimistic.id);
                if (idx !== -1) messages.value[idx] = res.data.data;
                lastMsgId.value = res.data.data.id;
            }
        } catch {
            notify.toastError("Gửi tin nhắn thất bại.");
        } finally {
            sending.value = false;
        }
    };

    // Polling lấy tin nhắn mới từ admin mỗi 3 giây
    const startPolling = () => {
        pollInterval = setInterval(pollMessages, 3000);
    };

    const stopPolling = () => {
        if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
        }
    };

    const pollMessages = async () => {
        if (!contactId.value) return;
        try {
            const res = await axios.get(
                `${apiBase}/chat/${contactId.value}/messages`,
                { params: { after_id: lastMsgId.value } }
            );
            const adminMsgs = (res.data.data || []).filter(
                (m) => m.sender === "admin"
            );
            if (adminMsgs.length > 0) {
                messages.value.push(...adminMsgs);
                lastMsgId.value = adminMsgs[adminMsgs.length - 1].id;
            }
        } catch {
            // silent fail — không hiện toast để tránh spam
        }
    };

    const endChat = () => {
        stopPolling();
        chatStarted.value = false;
        contactId.value   = null;
        lastMsgId.value   = 0;
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
        stopPolling,
    };
});