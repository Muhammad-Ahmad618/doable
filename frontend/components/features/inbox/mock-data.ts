import { InboxNotification } from "@/types/inbox";

export const MOCK_NOTIFICATIONS: InboxNotification[] = [
  {
    id: "notif-1",
    title: "Cloud Infrastructure Audit is 2 days overdue",
    description:
      "Task risk score surged to 92%. Immediate attention is required to avoid deployment downtime.",
    timestamp: "10m ago",
    unread: true,
    type: "alert",
    category: "tasks",
    workspace: "DevOps Core",
    taskTitle: "Cloud Infrastructure Audit",
    priority: "high",
    sender: {
      name: "James Smith",
      avatar: "JS",
    },
  },
  {
    id: "notif-2",
    title: "New task assigned: OAuth2 Multi-Tenant Integration",
    description:
      "Sarah Chen assigned you to this task with High priority for Sprint 14.",
    timestamp: "45m ago",
    unread: true,
    type: "assignment",
    category: "tasks",
    workspace: "Engineering",
    taskTitle: "OAuth2 Multi-Tenant Integration",
    priority: "high",
    sender: {
      name: "Sarah Chen",
      avatar: "SC",
    },
  },
  {
    id: "notif-3",
    title: "Alex Rivera mentioned you in Database Migration",
    description:
      "@you Can you please verify if the PostgreSQL connection pooling limits are sufficient for staging?",
    timestamp: "2h ago",
    unread: true,
    type: "mention",
    category: "mentions",
    workspace: "Backend Squad",
    taskTitle: "Database Migration Plan",
    sender: {
      name: "Alex Rivera",
      avatar: "AR",
    },
  },
  {
    id: "notif-4",
    title: "3 tasks unlocked in Engineering",
    description:
      "Completing the Security Protocol audit has unblocked downstream tasks for your team members.",
    timestamp: "4h ago",
    unread: true,
    type: "completion",
    category: "tasks",
    workspace: "Engineering",
    sender: {
      name: "System Automation",
      avatar: "SA",
    },
  },
  {
    id: "notif-5",
    title: "Workspace invite accepted",
    description:
      "Elena Rostova accepted your invitation and joined the 'Design Systems' workspace as Editor.",
    timestamp: "Yesterday",
    unread: false,
    type: "system",
    category: "system",
    workspace: "Design Systems",
    sender: {
      name: "Elena Rostova",
      avatar: "ER",
    },
  },
  {
    id: "notif-6",
    title: "Weekly Productivity Summary ready",
    description:
      "Great progress this week! 20 tasks completed, 14 in progress, and 0 critical blockers remaining.",
    timestamp: "Yesterday",
    unread: false,
    type: "system",
    category: "system",
    workspace: "Personal Workspace",
    sender: {
      name: "Doable Digest",
      avatar: "DD",
    },
  },
  {
    id: "notif-7",
    title: "Task status changed to Completed",
    description:
      "Marcus Brody marked 'API Gateway Rate Limiting' as completed ahead of schedule.",
    timestamp: "3 days ago",
    unread: false,
    type: "completion",
    category: "tasks",
    workspace: "DevOps Core",
    taskTitle: "API Gateway Rate Limiting",
    priority: "medium",
    sender: {
      name: "Marcus Brody",
      avatar: "MB",
    },
  },
  {
    id: "notif-8",
    title: "Liam Vance commented on Mobile Responsive Audit",
    description:
      "\"Checked the responsive breakpoints on iOS safari and Android Chrome—everything scales smoothly now!\"",
    timestamp: "4 days ago",
    unread: false,
    type: "mention",
    category: "mentions",
    workspace: "Frontend Team",
    taskTitle: "Mobile Responsive Audit",
    sender: {
      name: "Liam Vance",
      avatar: "LV",
    },
  },
];

