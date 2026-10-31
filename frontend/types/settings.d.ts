export interface UserProfile {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  role: "admin" | "user";
  created_at?: string;
}

export interface UpdateProfilePayload {
  username: string;
  bio?: string;
  avatar?: File | null;
}

export interface UpdatePasswordPayload {
  current: string;
  newPassword: string;
}

export interface UserPreferences {
  user_id?: number;
  in_app_notifications: boolean;
  at_risk_alerts: boolean;
  task_assigned: boolean;
  task_due_soon: boolean;
  comment_mentions: boolean;
  email_notifications?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UpdatePreferencesPayload {
  in_app_notifications?: boolean;
  at_risk_alerts?: boolean;
  task_assigned?: boolean;
  task_due_soon?: boolean;
  comment_mentions?: boolean;
}

export interface UserProfileResponse {
  message: string;
  data: UserProfile;
}

export interface UserPreferencesResponse {
  message: string;
  data: UserPreferences;
}

export interface SettingsApiResponse<T = unknown> {
  message: string;
  data?: T;
}

