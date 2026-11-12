export interface NotificationItem {
  id: number;
  type: string;
  message: string;
  read_at: Date | null;
  created_at: Date;
  task_id: number | null;
  task_title: string | null;
}

export interface notificationResponse {
  message: string;
  data: {
    Notification: NotificationItem[];
    total: number;
    unread: number;
  };
  page: number;
  limit: number;
  totalPages: number;
}

export interface notifications {
  id: number;
  user_id: number;
  type: string;
  message: string;
  task_id: number;
  read_at: Date;
  created_at: Date;
}

export interface markReadResponse {
  message: string;
  data: {
    id: number;
  };
}

export interface markAllReadResponse {
  message: string;
  data: NotificationItem[];
}

export interface deleteNotificationResponse {
  message: string;
  data?: notifications;
}

export interface clearAllNotificationsResponse {
  message: string;
}
