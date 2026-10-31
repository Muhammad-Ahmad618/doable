export interface registerPayload {
  name: string;
  email: string;
  password: string;
  redirect: string | null;
}

export interface loginPayload {
  email: string;
  password: string;
  redirect?: string | null;
}

export interface forgotPasswordPayload {
  email: string;
}

export interface forgotPasswordResponse {
  message: string;
}

export interface resetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface authUser {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
}

export interface authStore {
  user: authUser | null;
  setUser: (user: authUser) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
}
