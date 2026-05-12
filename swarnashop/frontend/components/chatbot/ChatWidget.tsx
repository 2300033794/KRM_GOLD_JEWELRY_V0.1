"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useId, useState } from "react";

const quickReplies = ["Today's Rate", "Track My Order", "Book Consultation", "Talk to Support"];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "assistant" | "user"; content: string }>>([
    {
      role: "assistant",
      content: "Welcome to KMR Jewellery. Ask about gold rates, orders, or appointments.",
    },
  ]);

  const sessionId = `guest-${useId()}`;

  const ask = async (content: string) => {
    if (!content.trim()) return;
    setMessages((current) => [...current, { role: "user", content }]);
    setDraft("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/chat/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, content }),
        },
      );
      const data = (await res.json()) as { content?: string };
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.content ?? "I can help with rates and products." },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "I’m temporarily unavailable. Please try again shortly." },
      ]);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void ask(draft);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open ? (
        <div className="mb-3 w-80 rounded-2xl border border-amber-300 bg-[var(--background)] p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">KMR Assistant</p>
              <p className="text-xs text-[var(--muted)]">Gold rates & order help</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={16} />
            </button>
          </div>
          <div className="mb-3 h-48 space-y-2 overflow-y-auto rounded-xl bg-[var(--surface)] p-3 text-xs">
            {messages.map((msg, i) => (
              <div
                key={`${msg.role}-${i}`}
                className={msg.role === "assistant" ? "text-[var(--foreground)]" : "text-[var(--deep-gold)]"}
              >
                <strong>{msg.role === "assistant" ? "AI" : "You"}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            {quickReplies.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => void ask(item)}
                className="rounded-full border border-amber-300 px-3 py-1 text-[11px]"
              >
                {item}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type your question…"
              className="flex-1 rounded-full border border-amber-200 bg-transparent px-3 py-2 text-xs"
            />
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-gold)] text-black"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-gold)] text-black shadow-lg"
        aria-label="Open chat"
      >
        <MessageCircle size={20} />
      </button>
    </div>
  );
}
