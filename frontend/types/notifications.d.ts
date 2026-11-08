export interface notificationResponse {
  id: number;
  type: string;
  message: string;
  read_at: Date;
  created_at: Date;
  task_title: string;
}
