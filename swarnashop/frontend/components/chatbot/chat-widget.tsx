"use client";

import { MessageCircle, X } from "lucide-react";
import { useId, useState } from "react";

const quickReplies = ["Today's Rate", "Track My Order", "Book Consultation"];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "assistant" | "user"; content: string }>>([
    { role: "assistant", content: "Welcome to KMR Jewellery. Ask about gold rates, products, or orders." },
  ]);

  const sessionId = `guest-${useId()}`;

  const ask = async (content: string) => {
    setMessages((m) => [...m, { role: "user", content }]);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, content }),
      });
      const data = (await res.json()) as { content?: string };
      setMessages((m) => [...m, { role: "assistant", content: data.content ?? "I can help with rates and products." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "I’m temporarily unavailable. Please try again." }]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-30">
      {open ? (
        <div className="w-80 rounded-2xl border border-amber-300 bg-[var(--background)] p-3 shadow-xl [@starting-style]:opacity-0 [@starting-style]:scale-95">
          <div className="mb-2 flex items-center justify-between">
            <strong className="text-sm">KMR Assistant</strong>
            <button type="button" onClick={() => setOpen(false)}><X size={16} /></button>
          </div>
          <div className="mb-2 h-44 overflow-y-auto rounded bg-[var(--surface)] p-2 text-sm">
            {messages.map((msg, i) => (
              <p key={`${msg.role}-${i}`} className="mb-1"><b>{msg.role === "assistant" ? "AI" : "You"}:</b> {msg.content}</p>
            ))}
          </div>
          <div className="mb-2 flex flex-wrap gap-1">
            {quickReplies.map((item) => (
              <button type="button" key={item} onClick={() => void ask(item)} className="rounded-full border border-amber-300 px-2 py-1 text-xs">{item}</button>
            ))}
          </div>
        </div>
      ) : null}
      <button type="button" onClick={() => setOpen((v) => !v)} className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-gold)] text-black shadow-lg">
        <MessageCircle size={20} />
      </button>
    </div>
  );
}
