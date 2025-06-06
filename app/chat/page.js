"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import apiClient from "@/libs/api";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    try {
      const { answer } = await apiClient.post("/chat", {
        messages: [...messages, userMessage],
      });
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b">
        <Link href="/" className="inline-flex items-center text-lg font-bold">
          ← Home
        </Link>
        <h1 className="text-xl font-semibold mt-2">ChatGPT Clone</h1>
      </header>
      <main className="flex-1 overflow-auto p-4 space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-lg p-3 max-w-[70%] ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 shadow"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </main>
      <form onSubmit={handleSubmit} className="p-4 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded px-3 py-2 mr-2"
        />
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}