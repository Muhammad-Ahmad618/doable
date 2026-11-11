"use client";

import { useMemo, useState } from "react";
import { InboxHeader } from "./header";
import { InboxFilters } from "./filters";
import { NotificationCard } from "./notification-card";
import { DeleteInboxDialog } from "./delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { MOCK_NOTIFICATIONS } from "./mock-data";
import { InboxNotification, NotificationCategory } from "@/types/inbox";
import { BellOff, CheckCheck, Inbox } from "lucide-react";
import { toast } from "sonner";

export function InboxFeature() {
  const [notifications, setNotifications] =
    useState<InboxNotification[]>(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<NotificationCategory>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Delete Dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    single?: InboxNotification;
    bulk?: string[];
    isAll?: boolean;
  }>({});

  // Dynamic counts for each category tab
  const counts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter((n) => n.unread).length,
      tasks: notifications.filter((n) => n.category === "tasks").length,
      mentions: notifications.filter((n) => n.category === "mentions").length,
      system: notifications.filter((n) => n.category === "system").length,
    };
  }, [notifications]);

  // Filtered notifications based on activeTab and searchQuery
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Category filter
      if (activeTab === "unread" && !item.unread) return false;
      if (activeTab === "tasks" && item.category !== "tasks") return false;
      if (activeTab === "mentions" && item.category !== "mentions")
        return false;
      if (activeTab === "system" && item.category !== "system") return false;

      // Search filter
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.workspace?.toLowerCase().includes(query) ||
        item.sender?.name.toLowerCase().includes(query) ||
        item.taskTitle?.toLowerCase().includes(query)
      );
    });
  }, [notifications, activeTab, searchQuery]);

  // Bulk selection logic
  const allFilteredSelected =
    filteredNotifications.length > 0 &&
    filteredNotifications.every((n) => selectedIds.includes(n.id));

  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAllToggle = () => {
    if (allFilteredSelected) {
      // Deselect current filtered
      const currentFilteredIds = new Set(
        filteredNotifications.map((n) => n.id),
      );
      setSelectedIds((prev) =>
        prev.filter((id) => !currentFilteredIds.has(id)),
      );
    } else {
      // Select all in current filtered view
      const combined = Array.from(
        new Set([...selectedIds, ...filteredNotifications.map((n) => n.id)]),
      );
      setSelectedIds(combined);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  // Bulk mark as read
  const handleBulkMarkAsRead = () => {
    if (selectedIds.length === 0) return;
    setNotifications((prev) =>
      prev.map((n) =>
        selectedIds.includes(n.id) ? { ...n, unread: false } : n,
      ),
    );
    toast.success(`${selectedIds.length} notifications marked as read`);
    setSelectedIds([]);
  };

  // Toggle single read/unread status
  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const newStatus = !n.unread;
          if (newStatus) {
            toast.info("Marked as unread");
          } else {
            toast.success("Marked as read");
          }
          return { ...n, unread: newStatus };
        }
        return n;
      }),
    );
  };

  // Delete handlers
  const handleRequestSingleDelete = (notification: InboxNotification) => {
    setDeleteTarget({ single: notification });
    setOpenDeleteDialog(true);
  };

  const handleRequestBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteTarget({ bulk: selectedIds });
    setOpenDeleteDialog(true);
  };

  const handleRequestClearAll = () => {
    if (notifications.length === 0) return;
    setDeleteTarget({ isAll: true });
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget.isAll) {
      setNotifications([]);
      setSelectedIds([]);
      toast.success("All notifications cleared");
    } else if (deleteTarget.bulk && deleteTarget.bulk.length > 0) {
      const idsToDelete = new Set(deleteTarget.bulk);
      setNotifications((prev) => prev.filter((n) => !idsToDelete.has(n.id)));
      setSelectedIds((prev) => prev.filter((id) => !idsToDelete.has(id)));
      toast.success(`${deleteTarget.bulk.length} notifications deleted`);
    } else if (deleteTarget.single) {
      const targetId = deleteTarget.single.id;
      setNotifications((prev) => prev.filter((n) => n.id !== targetId));
      setSelectedIds((prev) => prev.filter((id) => id !== targetId));
      toast.success("Notification deleted");
    }

    setOpenDeleteDialog(false);
    setDeleteTarget({});
  };

  // Empty state title and message helper
  const getEmptyStateDetails = () => {
    if (searchQuery.trim()) {
      return {
        title: "No notifications found",
        description: `We couldn't find anything matching "${searchQuery}". Try a different keyword.`,
        icon: Inbox,
      };
    }
    if (activeTab === "unread") {
      return {
        title: "All caught up!",
        description:
          "You have no unread notifications. Check the 'All' tab to review previous updates.",
        icon: CheckCheck,
      };
    }
    if (notifications.length === 0) {
      return {
        title: "Inbox is clear",
        description:
          "You don't have any notifications right now. New activity will appear here.",
        icon: BellOff,
      };
    }
    return {
      title: "No notifications here",
      description: `There are currently no ${activeTab} notifications in your inbox.`,
      icon: Inbox,
    };
  };

  const emptyState = getEmptyStateDetails();

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <InboxHeader
        totalCount={counts.all}
        unreadCount={counts.unread}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleRequestClearAll}
        hasUnread={counts.unread > 0}
        hasNotifications={notifications.length > 0}
      />

      {/* Filter Tabs & Bulk Actions */}
      <InboxFilters
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedIds([]);
        }}
        counts={counts}
        selectedCount={selectedIds.length}
        allSelected={allFilteredSelected}
        onSelectAllToggle={handleSelectAllToggle}
        onBulkMarkAsRead={handleBulkMarkAsRead}
        onBulkDelete={handleRequestBulkDelete}
        hasItems={filteredNotifications.length > 0}
      />

      {/* Notifications List or Empty State */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          title={emptyState.title}
          description={emptyState.description}
          icon={emptyState.icon}
          actionLabel={
            searchQuery
              ? "Clear Search"
              : activeTab !== "all"
                ? "View All Notifications"
                : undefined
          }
          onAction={
            searchQuery
              ? () => setSearchQuery("")
              : activeTab !== "all"
                ? () => setActiveTab("all")
                : undefined
          }
        />
      ) : (
        <div className="space-y-2.5">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              selected={selectedIds.includes(notification.id)}
              onSelectToggle={handleSelectToggle}
              onToggleRead={handleToggleRead}
              onDeleteRequest={handleRequestSingleDelete}
            />
          ))}
        </div>
      )}

      {/* Confirmation Delete Dialog */}
      <DeleteInboxDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        title={deleteTarget.single?.title}
        count={deleteTarget.bulk?.length || 1}
        isAll={deleteTarget.isAll}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default InboxFeature;
