"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSendMessage } from "@/hooks/user/ai-chat";
import { ChatMessage } from "@/types/chat";

const QUICK_PROMPTS = [
  "Plan my day",
  "What's overdue?",
  "What should I do first?",
];

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: sendMessage, isPending: loading } = useSendMessage();

  // Scroll to the newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");

    try {
      const data = await sendMessage({
        messages: next,
        page: pathname,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      if (data?.reply) {
        setMessages([...next, { role: "assistant", content: data.reply }]);
      }
    } catch (err: unknown) {
      const errObj = err as {
        response?: { data?: { error?: string; message?: string } };
      };
      const fallbackMessage =
        errObj?.response?.data?.error ||
        errObj?.response?.data?.message ||
        "Something went wrong. Please try again.";

      setMessages([
        ...next,
        {
          role: "assistant",
          content: fallbackMessage,
        },
      ]);
    }
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-18 right-5 z-50 flex h-135 max-h-[calc(100vh-8rem)] w-95 max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card
            shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.12),0_24px_48px_-12px_rgba(15,23,42,0.18)]
            dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_rgba(0,0,0,0.5)]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-inset ring-primary/20">
              <Sparkles className="size-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-foreground font-semibold leading-tight">
                Doable Assistant
              </p>
              <p className="text-xs text-muted-foreground">
                Ask about your tasks
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto size-8 rounded-lg cursor-pointer"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="size-4 text-foreground" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 scrollbar-thin">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <div>
                  <p className="text-sm font-medium">How can I help today?</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Pick a quick option or type your own question.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      className="cursor-pointer text-foreground rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md bg-muted text-foreground"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border/50 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              maxLength={500}
              className="h-10 flex-1 rounded-xl border border-border/60 bg-background px-3.5 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || loading}
              className="size-10 shrink-0 rounded-xl"
              aria-label="Send"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="cursor-pointer fixed bottom-3 right-3 z-50 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground
          shadow-[0_4px_14px_rgba(15,23,42,0.2),0_12px_28px_-6px_rgba(15,23,42,0.3)]
          transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        {open ? <X className="size-5" /> : <Sparkles className="size-5" />}
      </button>
    </>
  );
}
