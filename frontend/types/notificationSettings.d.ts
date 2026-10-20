export type NotificationSettings = {
  inApp: boolean;
  email: boolean;
  atRiskTask: boolean;
  taskAssigned: boolean;
  taskDueSoon: boolean;
  commentsMentions: boolean;
};

export type NotificationRowProps = {
  id: keyof NotificationSettings;
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  badge?: string;
  onCheckedChange: (checked: boolean) => void;
};
