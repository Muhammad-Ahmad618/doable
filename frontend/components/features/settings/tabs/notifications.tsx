"use client";

import { Button } from "@/components/ui/button";
import {
  Bell,
  Mail,
  AlertTriangle,
  UserCheck,
  Clock,
  MessageSquare,
} from "lucide-react";
import { NotificationSettings } from "@/types/notificationSettings";
import { NotificationRow } from "@/components/custom/notification-row";
import { useFormik } from "formik";
import { toast } from "sonner";

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
  const formik = useFormik<NotificationSettings>({
    initialValues: defaultSettings,
    onSubmit: (values) => {
      console.log(values);
      toast.success("Settings saved successfully");
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
                onCheckedChange={(v) => formik.setFieldValue("atRiskTask", v)}
              />
              <NotificationRow
                id="taskAssigned"
                icon={<UserCheck size={15} />}
                title="Task assigned to me"
                description="Alert when a teammate assigns a task to you."
                checked={formik.values.taskAssigned}
                onCheckedChange={(v) => formik.setFieldValue("taskAssigned", v)}
              />
              <NotificationRow
                id="taskDueSoon"
                icon={<Clock size={15} />}
                title="Due date reminders"
                description="Reminders before tasks are due so nothing slips through."
                checked={formik.values.taskDueSoon}
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
            onClick={() => formik.resetForm()}
          >
            Reset
          </Button>
          <Button type="submit" className="rounded-md cursor-pointer">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
