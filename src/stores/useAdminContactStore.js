import { defineStore } from "pinia";
import axios from "axios";
import { ref, computed } from "vue";
import { useNotify } from "@/composables/useNotify";

export const useAdminContactStore = defineStore("adminContact", () => {
    const notify  = useNotify();
    const apiBase = import.meta.env.VITE_API_BASE;

    const getToken = () =>
        JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null;
    const authHeaders = () => ({
        Authorization: `Bearer ${getToken()}`,
        "X-Socket-ID": window.Echo?.socketId() ?? "",
    });

    const contacts        = ref([]);
    const selectedContact = ref(null);
    const loading         = ref(false);
    const detailLoading   = ref(false);

    const stats = ref({
        total:       0,
        pending:     0,
        in_progress: 0,
        resolved:    0,
        unread:      0,
        chat_active: 0,
        today:       0,
    });

    const meta = ref({
        total:        0,
        per_page:     20,
        current_page: 1,
        last_page:    1,
    });

    const activeTab    = ref("all");
    const filterStatus = ref("");
    const filterTopic  = ref("");
    const searchQuery  = ref("");
    const replyText    = ref("");
    const sendEmail    = ref(true);
    const markResolved = ref(false);
    const replying     = ref(false);
    const pendingCount = computed(() => stats.value.pending);

    const listenAdminChannel = () => {
        if (!window.Echo) {
            setTimeout(listenAdminChannel, 300);
            return;
        }

        window.Echo.channel("admin.chat")
            .listen(".new.message", (e) => {
                const idx = contacts.value.findIndex(c => c.id === e.contact_id);
                if (idx !== -1) {
                    contacts.value[idx].last_message = e.message;
                    contacts.value[idx].last_time    = "vừa xong";
                    if (e.sender === "customer") {
                        contacts.value[idx].unread_count =
                            (contacts.value[idx].unread_count || 0) + 1;
                    }
                } else {
                    loadContacts();
                }
            });
    };

    const listenContactChannel = (contactId) => {
        if (!window.Echo) return;

        window.Echo.leave(`chat.${contactId}`);

        window.Echo.channel(`chat.${contactId}`)
            .listen(".new.message", (e) => {
                if (!selectedContact.value) return;
                if (selectedContact.value.id !== contactId) return;
                if (e.sender === "admin") return;

                if (!selectedContact.value.chat_messages) {
                    selectedContact.value.chat_messages = [];
                }

                selectedContact.value.chat_messages.push(e);
            });
    };

    const loadContacts = async () => {
        loading.value = true;

        try {
            const params = {
                page:     meta.value.current_page,
                per_page: meta.value.per_page,
            };

            if (activeTab.value !== "all") params.type   = activeTab.value;
            if (filterStatus.value)        params.status = filterStatus.value;
            if (filterTopic.value)         params.topic  = filterTopic.value;
            if (searchQuery.value)         params.search = searchQuery.value;

            const res = await axios.get(`${apiBase}/admin/contacts`, {
                headers: authHeaders(),
                params,
            });

            contacts.value = res.data.data;
            meta.value     = res.data.meta;
            stats.value    = res.data.stats;

        } catch {
            notify.toastError("Không tải được danh sách liên hệ.");
        } finally {
            loading.value = false;
        }
    };

    const loadStats = async () => {
        try {
            const res = await axios.get(`${apiBase}/admin/contacts/stats`, {
                headers: authHeaders(),
            });

            stats.value = res.data.data;
        } catch {}
    };

    const selectContact = async (contact) => {
        selectedContact.value = null;
        detailLoading.value   = true;
        replyText.value       = "";

        try {
            const res = await axios.get(
                `${apiBase}/admin/contacts/${contact.id}`,
                { headers: authHeaders() }
            );

            selectedContact.value = res.data.data;

            listenContactChannel(contact.id);

            const idx = contacts.value.findIndex(c => c.id === contact.id);
            if (idx !== -1) {
                contacts.value[idx].is_read      = true;
                contacts.value[idx].unread_count = 0;
            }

        } catch {
            selectedContact.value = contact;
            notify.toastError("Không tải được chi tiết liên hệ.");
        } finally {
            detailLoading.value = false;
        }
    };

    const updateStatus = async (newStatus) => {
        if (!selectedContact.value) return;

        const contactId = selectedContact.value.id;
        const oldStatus = selectedContact.value.status;

        selectedContact.value.status = newStatus;

        const idx = contacts.value.findIndex(c => c.id === contactId);
        if (idx !== -1) {
            contacts.value[idx].status = newStatus;

            const labelMap = {
                pending:     "Chờ xử lý",
                in_progress: "Đang xử lý",
                resolved:    "Đã giải quyết",
            };
            contacts.value[idx].status_label = labelMap[newStatus] ?? newStatus;
        }

        try {
            await axios.patch(
                `${apiBase}/admin/contacts/${contactId}/status`,
                { status: newStatus },
                { headers: authHeaders() }
            );

            notify.toastSuccess("Đã cập nhật trạng thái.");
            loadStats();

        } catch {
            selectedContact.value.status = oldStatus;
            if (idx !== -1) contacts.value[idx].status = oldStatus;
            notify.toastError("Không cập nhật được trạng thái.");
        }
    };

    const deleteContact = async () => {
        if (!selectedContact.value) return;

        if (!confirm("Bạn có chắc muốn xoá liên hệ này không?")) return;

        const contactId = selectedContact.value.id;

        try {
            await axios.delete(
                `${apiBase}/admin/contacts/${contactId}`,
                { headers: authHeaders() }
            );

            contacts.value    = contacts.value.filter(c => c.id !== contactId);
            selectedContact.value = null;

            notify.toastSuccess("Đã xoá liên hệ.");
            loadStats();

        } catch {
            notify.toastError("Không xoá được liên hệ.");
        }
    };

    const sendReply = async () => {
        if (!replyText.value.trim() || !selectedContact.value) return false;

        replying.value = true;

        const contactId = selectedContact.value.id;
        const message   = replyText.value;
        if (!selectedContact.value.chat_messages) {
            selectedContact.value.chat_messages = [];
        }

        const optimisticId = `pending_${Date.now()}`;

        selectedContact.value.chat_messages.push({
            id:          optimisticId,
            contact_id:  contactId,
            sender:      "admin",
            sender_name: "Admin BanDoThao",
            message:     message,
            created_at:  new Date().toLocaleTimeString("vi-VN", {
                hour: "2-digit", minute: "2-digit",
            }),
            _pending: true,
        });

        replyText.value = "";

        try {
            const res = await axios.post(
                `${apiBase}/admin/contacts/${contactId}/reply`,
                {
                    message,
                    send_email:    sendEmail.value,
                    mark_resolved: markResolved.value,
                    admin_name:    "Admin BanDoThao",
                },
                { headers: authHeaders() }
            );

            const idx = selectedContact.value.chat_messages.findIndex(
                m => m.id === optimisticId
            );

            if (idx !== -1) {
                selectedContact.value.chat_messages[idx] = {
                    id:          res.data.data.message_id,
                    contact_id:  contactId,
                    sender:      "admin",
                    sender_name: "Admin BanDoThao",
                    message:     message,
                    created_at:  new Date().toLocaleTimeString("vi-VN", {
                        hour: "2-digit", minute: "2-digit",
                    }),
                };
            }

            if (markResolved.value) {
                selectedContact.value.status = "resolved";
                const cidx = contacts.value.findIndex(c => c.id === contactId);
                if (cidx !== -1) {
                    contacts.value[cidx].status       = "resolved";
                    contacts.value[cidx].status_label = "Đã giải quyết";
                }
                loadStats();
            }

            return true;

        } catch (err) {
            selectedContact.value.chat_messages =
                selectedContact.value.chat_messages.filter(
                    m => m.id !== optimisticId
                );

            notify.toastError(
                err.response?.data?.message || "Có lỗi khi gửi phản hồi."
            );
            return false;

        } finally {
            replying.value = false;
        }
    };

    const setTab = (key) => {
        activeTab.value         = key;
        meta.value.current_page = 1;
        loadContacts();
    };

    const changePage = (page) => {
        meta.value.current_page = page;
        loadContacts();
    };

    const resetReply = () => {
        replyText.value    = "";
        markResolved.value = false;
        sendEmail.value    = true;
    };

    listenAdminChannel();

    return {
        contacts,
        selectedContact,
        loading,
        detailLoading,
        stats,
        meta,
        activeTab,
        filterStatus,
        filterTopic,
        searchQuery,
        replyText,
        sendEmail,
        markResolved,
        replying,
        pendingCount,
        loadContacts,
        loadStats,
        selectContact,
        updateStatus,
        deleteContact,
        sendReply,
        setTab,
        changePage,
        resetReply,
    };
});