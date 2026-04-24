import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useChatStore = defineStore("chat", () => {
    const notify = useNotify();
    const apiBase = import.meta.env.VITE_API_BASE;

    const chatUser = ref({ name: "", email: "" });
    const chatStarted = ref(false);
    const chatLoading = ref(false);
    const contactId = ref(null);
    const messages = ref([]);
    const newMessage = ref("");
    const sending = ref(false);

    let echoChannel = null;

    const startChat = async () => {
        if (!chatUser.value.name.trim()) {
            notify.toastError("Vui lòng nhập tên của bạn.");
            return false;
        }

        chatLoading.value = true;

        try {
            const res = await axios.post(`${apiBase}/chat/start`, chatUser.value);

            if (res.status === 201) {
                contactId.value = res.data.contact_id;
                messages.value = [res.data.welcome];
                chatStarted.value = true;

                echoChannel = window.Echo
                    .channel(`chat.${contactId.value}`)
                    .listen(".new.message", (e) => {
                        console.log("=== Echo event nhận được ===", e); 
                        console.log("sender:", e.sender);   
                        console.log("messages hiện tại:", messages.value); 

                        if (e.sender !== "admin") {
                            console.log("Bị filter vì sender không phải admin"); 
                            return;
                        }

                        messages.value.push({
                            id: e.id,
                            sender: e.sender,
                            sender_name: e.sender_name,
                            message: e.message,
                            created_at: e.created_at,
                            time_ago: "vừa xong",
                        });
                    });

                return true;
            }
        } catch {
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

        const optimisticId = `pending_${Date.now()}`;

        // Push optimistic ngay để UI phản hồi nhanh
        const optimisticMsg = {
            id: optimisticId,
            sender: "customer",
            message: text,
            created_at: new Date().toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
            }),
            _pending: true,
        };

        messages.value.push(optimisticMsg);
        newMessage.value = "";

        try {
            // FIX: Thêm X-Socket-ID để backend biết socket nào gửi request
            // → toOthers() ở sendMessage() hoạt động đúng
            // → customer sẽ không nhận lại chính tin mình vừa gửi qua Echo
            const res = await axios.post(
                `${apiBase}/chat/${contactId.value}/messages`,
                {
                    message: text,
                    sender: "customer",
                    sender_name: chatUser.value.name,
                },
                {
                    headers: {
                        "X-Socket-ID": window.Echo?.socketId() ?? "",
                    },
                }
            );

            if (res.status === 201) {
                // Thay optimistic bằng data thật từ server
                const idx = messages.value.findIndex(m => m.id === optimisticId);
                if (idx !== -1) {
                    messages.value[idx] = res.data.data;
                }
            }
        } catch {
            // Rollback nếu lỗi
            notify.toastError("Gửi tin nhắn thất bại.");
            messages.value = messages.value.filter(m => m.id !== optimisticId);
            newMessage.value = text; // trả lại text để user gửi lại
        } finally {
            sending.value = false;
        }
    };

    const loadMessages = async () => {
        if (!contactId.value) return;

        try {
            const res = await axios.get(
                `${apiBase}/chat/${contactId.value}/messages`
            );

            messages.value = res.data.data;
        } catch { }
    };

    const endChat = () => {
        if (contactId.value) {
            window.Echo.leave(`chat.${contactId.value}`);
        }

        chatStarted.value = false;
        contactId.value = null;
        messages.value = [];
        chatUser.value = { name: "", email: "" };
        echoChannel = null;
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