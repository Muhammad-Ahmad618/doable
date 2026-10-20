import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { NotificationRowProps } from "@/types/notificationSettings";

export function NotificationRow({
  id,
  icon,
  title,
  description,
  checked,
  disabled = false,
  badge,
  onCheckedChange,
}: NotificationRowProps) {
  return (
    <div className="flex items-center justify-between gap-6 py-3.5">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Label
              htmlFor={id}
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              {title}
            </Label>
            {badge && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                {badge}
              </span>
            )}
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="shrink-0"
      />
    </div>
  );
}
