"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Mail,
  AlertTriangle,
  UserCheck,
  Clock,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { NotificationSettings } from "@/types/notificationSettings";
import { NotificationRow } from "@/components/custom/notification-row";
import { useFormik } from "formik";
import {
  useGetUserPreferences,
  useUpdateUserPreferences,
} from "@/hooks/user/settings";

const defaultSettings: NotificationSettings = {
  inApp: true,
  email: false,
  atRiskTask: true,
  taskAssigned: true,
  taskDueSoon: true,
  commentsMentions: true,
};

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60 mb-2">
      {label}
    </p>
  );
}

export function Notifications() {
  const { data: preferences, isLoading } = useGetUserPreferences();
  const updatePreferencesMutation = useUpdateUserPreferences();

  const initialValues = useMemo<NotificationSettings>(() => {
    if (!preferences) return defaultSettings;
    return {
      inApp: preferences.in_app_notifications ?? true,
      email: preferences.email_notifications ?? false,
      atRiskTask: preferences.at_risk_alerts ?? true,
      taskAssigned: preferences.task_assigned ?? true,
      taskDueSoon: preferences.task_due_soon ?? true,
      commentsMentions: preferences.comment_mentions ?? true,
    };
  }, [preferences]);

  const formik = useFormik<NotificationSettings>({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => {
      updatePreferencesMutation.mutate({
        in_app_notifications: values.inApp,
        at_risk_alerts: values.atRiskTask,
        task_assigned: values.taskAssigned,
        task_due_soon: values.taskDueSoon,
        comment_mentions: values.commentsMentions,
      });
    },
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">
          Notification preferences
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Choose how and when Doable notifies you.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="px-6 divide-y divide-border">
          {/* Delivery */}
          <div className="py-5">
            <SectionLabel label="Delivery" />
            <div className="divide-y divide-border">
              <NotificationRow
                id="inApp"
                icon={<Bell size={15} />}
                title="In-app notifications"
                description="Alerts inside Doable when tasks are updated or need attention."
                checked={formik.values.inApp}
                disabled={isLoading || updatePreferencesMutation.isPending}
                onCheckedChange={(v) => formik.setFieldValue("inApp", v)}
              />
              <NotificationRow
                id="email"
                icon={<Mail size={15} />}
                title="Email notifications"
                description="Get important updates in your inbox when away from the app."
                checked={formik.values.email}
                disabled
                badge="Coming soon"
                onCheckedChange={(v) => formik.setFieldValue("email", v)}
              />
            </div>
          </div>

          {/* Task alerts */}
          <div className="py-5">
            <SectionLabel label="Task alerts" />
            <div className="divide-y divide-border">
              <NotificationRow
                id="atRiskTask"
                icon={<AlertTriangle size={15} className="text-destructive" />}
                title="At-risk task alerts"
                description="Notified when a task is overdue or at risk of missing its deadline."
                checked={formik.values.atRiskTask}
                disabled={isLoading || updatePreferencesMutation.isPending}
                onCheckedChange={(v) => formik.setFieldValue("atRiskTask", v)}
              />
              <NotificationRow
                id="taskAssigned"
                icon={<UserCheck size={15} />}
                title="Task assigned to me"
                description="Alert when a teammate assigns a task to you."
                checked={formik.values.taskAssigned}
                disabled={isLoading || updatePreferencesMutation.isPending}
                onCheckedChange={(v) => formik.setFieldValue("taskAssigned", v)}
              />
              <NotificationRow
                id="taskDueSoon"
                icon={<Clock size={15} />}
                title="Due date reminders"
                description="Reminders before tasks are due so nothing slips through."
                checked={formik.values.taskDueSoon}
                disabled={isLoading || updatePreferencesMutation.isPending}
                onCheckedChange={(v) => formik.setFieldValue("taskDueSoon", v)}
              />
            </div>
          </div>

          {/* Activity */}
          <div className="py-5">
            <SectionLabel label="Activity" />
            <div className="divide-y divide-border">
              <NotificationRow
                id="commentsMentions"
                icon={<MessageSquare size={15} />}
                title="Comments and mentions"
                description="Notify when someone mentions you or replies to a thread you're in."
                checked={formik.values.commentsMentions}
                disabled={isLoading || updatePreferencesMutation.isPending}
                onCheckedChange={(v) =>
                  formik.setFieldValue("commentsMentions", v)
                }
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-border bg-muted/30">
          <Button
            type="button"
            variant="outline"
            className="rounded-md cursor-pointer"
            disabled={updatePreferencesMutation.isPending}
            onClick={() => formik.resetForm()}
          >
            Reset
          </Button>
          <Button
            type="submit"
            className="rounded-md cursor-pointer"
            disabled={updatePreferencesMutation.isPending || isLoading}
          >
            {updatePreferencesMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
