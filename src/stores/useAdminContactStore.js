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
    });

    // ─── State ──────────────────────────────────────────────────
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

    // Filters
    const activeTab    = ref("all");
    const filterStatus = ref("");
    const filterTopic  = ref("");
    const searchQuery  = ref("");

    // Reply
    const replyText    = ref("");
    const sendEmail    = ref(true);
    const markResolved = ref(false);
    const replying     = ref(false);

    // ─── Computed ───────────────────────────────────────────────
    const pendingCount = computed(() => stats.value.pending);

    // ─── Actions ────────────────────────────────────────────────
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

            // đánh dấu đã đọc
            const idx = contacts.value.findIndex(c => c.id === contact.id);
            if (idx !== -1) contacts.value[idx].is_read = true;

        } catch {
            selectedContact.value = contact;
            notify.toastError("Không tải được chi tiết liên hệ.");
        } finally {
            detailLoading.value = false;
        }
    };

    const updateStatus = async (newStatus) => {
        if (!selectedContact.value) return;

        try {
            const res = await axios.patch(
                `${apiBase}/admin/contacts/${selectedContact.value.id}/status`,
                { status: newStatus },
                { headers: authHeaders() }
            );

            if (res.status === 200) {
                selectedContact.value.status = newStatus;

                const idx = contacts.value.findIndex(
                    c => c.id === selectedContact.value.id
                );

                if (idx !== -1) {
                    contacts.value[idx].status = newStatus;
                }

                notify.toastSuccess("Đã cập nhật trạng thái.");
                await loadStats();
            }

        } catch {
            notify.toastError("Không thể cập nhật trạng thái.");
        }
    };

    const deleteContact = async () => {
        if (!selectedContact.value) return;

        const confirmed = await notify.swalConfirm(
            "Xóa liên hệ?",
            `Bạn chắc chắn muốn xóa liên hệ của "${selectedContact.value.name}"?`
        );

        if (!confirmed) return;

        try {
            const idToRemove = selectedContact.value.id;

            await axios.delete(
                `${apiBase}/admin/contacts/${idToRemove}`,
                { headers: authHeaders() }
            );

            contacts.value = contacts.value.filter(
                c => c.id !== idToRemove
            );

            selectedContact.value = null;

            notify.toastSuccess("Đã xóa liên hệ.");
            await loadStats();

        } catch {
            notify.toastError("Không thể xóa liên hệ.");
        }
    };

    const sendReply = async () => {
        if (!replyText.value.trim() || !selectedContact.value) return false;

        replying.value = true;

        const currentContactId = selectedContact.value.id;
        const messageContent   = replyText.value;

        try {
            const res = await axios.post(
                `${apiBase}/admin/contacts/${currentContactId}/reply`,
                {
                    message:       messageContent,
                    send_email:    sendEmail.value,
                    mark_resolved: markResolved.value,
                    admin_name:    "Admin BanDoThao",
                },
                { headers: authHeaders() }
            );

            if (res.status === 200) {

                if (!selectedContact.value.chat_messages) {
                    selectedContact.value.chat_messages = [];
                }

                selectedContact.value.chat_messages.push(
                    res.data.data.chat_message || {
                        id: Date.now(),
                        sender: "admin",
                        sender_name: "Admin BanDoThao",
                        message: messageContent,
                        time_ago: "vừa xong",
                    }
                );

                if (markResolved.value) {
                    selectedContact.value.status = "resolved";

                    const idx = contacts.value.findIndex(
                        c => c.id === currentContactId
                    );

                    if (idx !== -1) {
                        contacts.value[idx].status = "resolved";
                    }
                }

                const emailNote = res.data.data?.email_sent
                    ? " Email đã được gửi."
                    : "";

                notify.toastSuccess("Đã gửi phản hồi." + emailNote);

                replyText.value = "";
                await loadStats();

                return true;
            }

        } catch (err) {
            const msg =
                err.response?.data?.message ||
                "Có lỗi khi gửi phản hồi.";

            notify.toastError(msg);
            return false;

        } finally {
            replying.value = false;
        }
    };

    // ─── Helpers ────────────────────────────────────────────────
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