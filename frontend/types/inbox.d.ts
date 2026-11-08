export type NotificationCategory =
  | "all"
  | "unread"
  | "tasks"
  | "mentions"
  | "system";

export type NotificationType =
  | "alert"
  | "assignment"
  | "mention"
  | "system"
  | "completion";

export interface InboxNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  type: NotificationType;
  category: "tasks" | "mentions" | "system";
  sender?: {
    name: string;
    avatar?: string;
  };
  workspace?: string;
  taskTitle?: string;
  priority?: "high" | "medium" | "low";
}

export interface InboxHeaderProps {
  totalCount: number;
  unreadCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  hasUnread: boolean;
  hasNotifications: boolean;
}

export interface InboxFiltersProps {
  activeTab: NotificationCategory;
  onTabChange: (tab: NotificationCategory) => void;
  counts: Record<NotificationCategory, number>;
  selectedCount: number;
  allSelected: boolean;
  onSelectAllToggle: () => void;
  onBulkMarkAsRead: () => void;
  onBulkDelete: () => void;
  hasItems: boolean;
}

