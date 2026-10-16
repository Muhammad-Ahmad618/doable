export interface Workspace {
  id: string | number;
  name: string;
  description: string;
  logo_url: string;
  member_count: number;
  active_tasks: number;
  role: string | null;
  member_preview?: string[];
}

export interface WorkspaceCreatePayload {
  workspace_name: string;
  workspace_description: string;
  logo_url: File | null;
}
