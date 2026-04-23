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

    // ─── Start chat ─────────────────────────────────────────────
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
                return true;
            }
        } catch (err) {
            notify.toastError("Không thể kết nối phòng chat. Vui lòng thử lại.");
            return false;
        } finally {
            chatLoading.value = false;
        }
    };

    // ─── Send message ───────────────────────────────────────────
    const sendMessage = async () => {
        const text = newMessage.value.trim();
        if (!text || sending.value) return;

        sending.value = true;

        // Optimistic UI
        const optimisticId = Date.now();
        const optimisticMsg = {
            id: optimisticId,
            sender: "customer",
            message: text,
            created_at: new Date().toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        messages.value.push(optimisticMsg);
        newMessage.value = "";

        try {
            const res = await axios.post(
                `${apiBase}/chat/${contactId.value}/messages`,
                {
                    message: text,
                    sender: "customer",
                    sender_name: chatUser.value.name,
                }
            );

            if (res.status === 201) {
                const idx = messages.value.findIndex(
                    (m) => m.id === optimisticId
                );
                if (idx !== -1) {
                    messages.value[idx] = res.data.data;
                }
            }
        } catch {
            notify.toastError("Gửi tin nhắn thất bại.");
            messages.value = messages.value.filter(
                (m) => m.id !== optimisticId
            );
        } finally {
            sending.value = false;
        }
    };

    // ─── Load messages (không realtime) ─────────────────────────
    const loadMessages = async () => {
        if (!contactId.value) return;

        try {
            const res = await axios.get(
                `${apiBase}/chat/${contactId.value}/messages`
            );
            messages.value = res.data;
        } catch {}
    };

    // ─── End chat ───────────────────────────────────────────────
    const endChat = () => {
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
        loadMessages,
        endChat,
    };
});