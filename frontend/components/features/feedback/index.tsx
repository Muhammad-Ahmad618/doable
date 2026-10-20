"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppTextareaField } from "@/components/shared/appTextareaField";
import {
  MessageSquarePlus,
  Bug,
  Lightbulb,
  Send,
  CheckCircle2,
} from "lucide-react";

export function Feedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [type, setType] = useState("general"); // 'general', 'bug', 'idea'

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  // Success State View
  if (isSubmitted) {
    return (
      <div className="min-h-fit flex justify-center w-full p-4">
        <div className="max-w-xl w-full my-10 bg-card shadow-lg border border-border/60 rounded-2xl p-10 text-center space-y-5 animate-in fade-in zoom-in duration-500">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Thank you!</h2>
            <p className="text-muted-foreground">
              Your feedback has been received. We appreciate your help in making
              our product better.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsSubmitted(false)}
            className="mt-4"
          >
            Send another response
          </Button>
        </div>
      </div>
    );
  }

  // Form View
  return (
    <div className="min-h-fit flex justify-center w-full">
      <div className="max-w-xl w-full my-10 bg-card shadow-lg border border-border/60 rounded-2xl overflow-hidden relative">
        {/* Decorative background accent */}
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-primary/10 to-transparent -z-10" />

        <div className="p-8 sm:p-10 space-y-5">
          {/* Header */}
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-linear-to-br from-primary via-primary/70 to-primary rounded-full mb-2">
              <MessageSquarePlus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Share your feedback
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              What&apos;s on your mind? Let us know how we can improve your
              experience.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Feedback Type Selector */}
            <div className="space-y-4">
              <label className="text-sm font-medium leading-none text-foreground">
                What kind of feedback is this?
              </label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setType("general")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                    type === "general"
                      ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                      : "border-border hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                  }`}
                >
                  <MessageSquarePlus className="w-5 h-5 mb-2" />
                  General
                </button>
                <button
                  type="button"
                  onClick={() => setType("bug")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                    type === "bug"
                      ? "border-destructive bg-destructive/5 text-destructive ring-1 ring-destructive/20"
                      : "border-border hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                  }`}
                >
                  <Bug className="w-5 h-5 mb-2" />
                  Bug
                </button>
                <button
                  type="button"
                  onClick={() => setType("idea")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                    type === "idea"
                      ? "border-orange-500 bg-orange-500/5 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/20"
                      : "border-border hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                  }`}
                >
                  <Lightbulb className="w-5 h-5 mb-2" />
                  Idea
                </button>
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-4">
              <label className="text-sm font-medium leading-none text-foreground">
                Details
              </label>
              <AppTextareaField
                name="feedback"
                placeholder={
                  type === "bug"
                    ? "What went wrong? Please include steps to reproduce."
                    : type === "idea"
                      ? "I would love it if..."
                      : "Tell us what you think..."
                }
                className="min-h-35 resize-y bg-background"
                required
              />
            </div>

            {/* Submit Area */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                size={"lg"}
                className="w-full sm:w-auto transition-all group rounded-sm cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Feedback
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
