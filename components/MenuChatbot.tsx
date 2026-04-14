"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isTextUIPart } from "ai";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";

interface Props {
  cafeId: string;
  primaryColor: string;
}

const MAX_USER_MESSAGES = 15;

export default function MenuChatbot({ cafeId, primaryColor }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { cafeId },
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const limitReached = userMessageCount >= MAX_USER_MESSAGES;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading || limitReached) return;
    sendMessage({ text: input.trim() });
    setInput("");
  }

  return (
    <>
      {/* Floating buton */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: primaryColor }}
          aria-label="Menü asistanını aç"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat penceresi */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden bg-white"
          style={{ width: 340, maxWidth: "calc(100vw - 2rem)", height: 480 }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 text-white shrink-0"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <span className="font-semibold text-sm">Menü Asistanı</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="opacity-80 hover:opacity-100 transition-opacity"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mesajlar */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-8 space-y-2">
                <Bot className="w-8 h-8 mx-auto opacity-20" />
                <p>Menü hakkında bir şeyler sormak ister misiniz?</p>
              </div>
            )}

            {messages.map((m) => {
              const text = m.parts
                .filter(isTextUIPart)
                .map((p) => p.text)
                .join("");
              if (!text) return null;

              return (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                    style={
                      m.role === "user"
                        ? { backgroundColor: primaryColor }
                        : undefined
                    }
                  >
                    {text}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-start">
                <div className="bg-red-50 text-red-500 rounded-2xl rounded-bl-sm px-3 py-2 text-xs">
                  {error.message || "Bir hata oluştu, tekrar deneyin."}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 shrink-0">
            {limitReached ? (
              <p className="text-center text-xs text-gray-400 py-1.5">
                Oturum limiti doldu. Sayfayı yenileyin.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Bir şeyler sorun..."
                  disabled={isLoading}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-white disabled:opacity-50 shrink-0 transition-opacity"
                  style={{ backgroundColor: primaryColor }}
                  aria-label="Gönder"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
