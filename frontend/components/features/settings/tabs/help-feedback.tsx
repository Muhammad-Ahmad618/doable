"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppTextareaField } from "@/components/shared/appTextareaField";
import { cn } from "@/lib/utils";
import {
  MessageSquarePlus,
  Bug,
  Lightbulb,
  Send,
  CheckCircle2,
  Loader2,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { FeedbackType } from "@/types/feedback";
import { useSendFeedback } from "@/hooks/user/feedback";

const MAX_LENGTH = 1000;

type TypeOption = {
  value: FeedbackType;
  label: string;
  hint: string;
  icon: LucideIcon;
  placeholder: string;
  active: string;
  iconWrap: string;
};

const TYPE_OPTIONS: TypeOption[] = [
  {
    value: "general",
    label: "General",
    hint: "Thoughts or comments",
    icon: MessageSquarePlus,
    placeholder: "Tell us what you think...",
    active: "border-primary bg-primary/5 ring-2 ring-primary/20",
    iconWrap: "bg-primary/10 text-primary",
  },
  {
    value: "bug",
    label: "Bug",
    hint: "Something is broken",
    icon: Bug,
    placeholder:
      "What went wrong? What did you expect to happen? Please include steps to reproduce.",
    active: "border-destructive bg-destructive/5 ring-2 ring-destructive/20",
    iconWrap: "bg-destructive/10 text-destructive",
  },
  {
    value: "idea",
    label: "Idea",
    hint: "Suggest an improvement",
    icon: Lightbulb,
    placeholder: "I would love it if...",
    active: "border-orange-500 bg-orange-500/5 ring-2 ring-orange-500/20",
    iconWrap: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
];

export function Feedback() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [type, setType] = useState<FeedbackType>("general");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: sendFeedback, isPending } = useSendFeedback();

  const selected =
    TYPE_OPTIONS.find((o) => o.value === type) ?? TYPE_OPTIONS[0];
  const trimmed = message.trim();
  const canSubmit = !!trimmed && !isPending;

  const submit = async () => {
    if (!canSubmit) return;
    setError(null);
    try {
      await sendFeedback({ type, message: trimmed });
      setIsSubmitted(true);
      setMessage("");
    } catch (err) {
      console.error("Failed to send feedback:", err);
      setError("We couldn't send your feedback. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // Ctrl/Cmd + Enter sends
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit();
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setMessage("");
    setType("general");
    setError(null);
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="flex w-full justify-center p-4">
        <div className="relative my-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border/60 bg-card p-10 text-center shadow-lg animate-in fade-in zoom-in duration-500">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-green-500/10 to-transparent" />
          <div className="relative space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 ring-8 ring-green-100/50 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-900/10">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Thank you!</h2>
              <p className="text-muted-foreground">
                Your feedback has been received. We read every message and use
                it to make the product better.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleReset}
              className="cursor-pointer"
            >
              Send more feedback
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className=" w-full px-4">
      <div className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-primary/10 to-transparent" />

        <div className="relative space-y-6 p-6 sm:p-10">
          {/* Header */}
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
              <MessageSquarePlus className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Share your feedback
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Found a bug, have an idea, or just want to say something?
              We&apos;d love to hear it.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className="space-y-6"
          >
            {/* Type selector */}
            <fieldset className="space-y-3" disabled={isPending}>
              <legend className="text-sm font-medium text-foreground">
                What kind of feedback is this?
              </legend>
              <div
                role="radiogroup"
                aria-label="Feedback type"
                className="grid grid-cols-1 gap-3 sm:grid-cols-3"
              >
                {TYPE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isActive = type === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => setType(option.value)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        "disabled:cursor-not-allowed disabled:opacity-60",
                        "sm:flex-col sm:gap-2 sm:p-4 sm:text-center",
                        isActive
                          ? option.active
                          : "border-border text-muted-foreground hover:border-foreground/20 hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                          isActive ? option.iconWrap : "bg-muted",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="space-y-0.5">
                        <span
                          className={cn(
                            "block text-sm font-semibold",
                            isActive && "text-foreground",
                          )}
                        >
                          {option.label}
                        </span>
                        <span className="block text-xs font-normal text-muted-foreground">
                          {option.hint}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <label
                  htmlFor="feedback"
                  className="text-sm font-medium text-foreground"
                >
                  Details
                </label>
                <span
                  className={cn(
                    "text-xs tabular-nums text-muted-foreground",
                    message.length >= MAX_LENGTH * 0.9 && "text-destructive",
                  )}
                >
                  {message.length}/{MAX_LENGTH}
                </span>
              </div>
              <AppTextareaField
                name="feedback"
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value.slice(0, MAX_LENGTH))
                }
                disabled={isPending}
                placeholder={selected.placeholder}
                className="min-h-35 resize-y bg-background"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive animate-in fade-in slide-in-from-top-1"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="hidden text-xs text-muted-foreground sm:block">
                Tip: press{" "}
                <kbd className="rounded border bg-muted px-1.5 py-0.5 font-sans text-[10px]">
                  Ctrl
                </kbd>{" "}
                +{" "}
                <kbd className="rounded border bg-muted px-1.5 py-0.5 font-sans text-[10px]">
                  Enter
                </kbd>{" "}
                to send
              </p>
              <Button
                type="submit"
                size="lg"
                disabled={!canSubmit}
                className="group cursor-pointer rounded-lg transition-all sm:w-auto"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Feedback
                    <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
