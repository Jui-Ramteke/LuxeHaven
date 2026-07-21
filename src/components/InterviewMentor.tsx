import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, User, GraduationCap, Loader2, RefreshCw } from "lucide-react";
import { MentorMessage } from "../types";

export default function InterviewMentor() {
  const [messages, setMessages] = useState<MentorMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am your AI Java Technical Interview Coach & OOP Mentor.\n\nI have analyzed your **Luxe Haven Hotel Booking Console App** codebase. In a real technical interview, hiring managers will ask you about the design decisions behind this code—including Object-Oriented design, Exception Safety, Concurrency, and File I/O persistence.\n\nHow can I help you today? You can choose one of the quick suggestions below, or type your own question!",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessageToMentor = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: MentorMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      // Map state messages to API expected format
      const payloadMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/gemini/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages })
      });

      const data = await res.json();
      if (res.ok && data.text) {
        const assistantMsg: MentorMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.text,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || "Failed to communicate with AI Mentor");
      }
    } catch (err: any) {
      console.error("Mentor communication failed:", err);
      const errorMsg: MentorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `⚠️ **API Error:** ${err?.message || "Could not retrieve mentor advice. Please check that you have configured your GEMINI_API_KEY inside the Secrets panel of AI Studio Settings."}`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageToMentor(inputValue);
  };

  const handleSuggestClick = (promptText: string) => {
    sendMessageToMentor(promptText);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I am your AI Java Technical Interview Coach & OOP Mentor.\n\nI have analyzed your **Luxe Haven Hotel Booking Console App** codebase. In a real technical interview, hiring managers will ask you about the design decisions behind this code—including Object-Oriented design, Exception Safety, Concurrency, and File I/O persistence.\n\nHow can I help you today? You can choose one of the quick suggestions below, or type your own question!",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const suggestions = [
    { label: "🎙️ Start Mock Interview", text: "Ask me a mock interview question about the BookingService design of this project." },
    { label: "🔒 Concurrency Safety", text: "How do we handle thread safety if multiple guests try to book the same room concurrently? What keywords or patterns would we use in Java?" },
    { label: "🛠️ BigDecimal vs double", text: "Why is BigDecimal generally preferred over double for price and financial computations in professional banking/hotel applications? What are the floating-point concerns?" },
    { label: "📂 Checked Exceptions", text: "Explain the difference between Checked and Unchecked Exceptions in Java, and why we made BookingException a checked exception." }
  ];

  // Quick helper to render basic markdown patterns like Bold, Lists, Codeblocks cleanly
  const renderMessageContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // 1. Bullet lists
      if (line.trim().startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 my-1">
            {formatInlineStyling(line.trim().slice(2))}
          </li>
        );
      }
      if (line.trim().startsWith("* ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 my-1">
            {formatInlineStyling(line.trim().slice(2))}
          </li>
        );
      }
      // 2. Numeric lists
      const numMatch = line.trim().match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-slate-700 my-1">
            {formatInlineStyling(numMatch[2])}
          </li>
        );
      }
      // 3. Header lines
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="text-slate-900 font-bold text-xs mt-3 mb-1 font-mono uppercase tracking-wider">{formatInlineStyling(line.slice(4))}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-slate-950 font-bold text-sm mt-4 mb-2 font-mono border-b border-slate-100 pb-0.5">{formatInlineStyling(line.slice(3))}</h3>;
      }
      // 4. Code Blocks (simple inline rendering)
      if (line.trim().startsWith("```")) {
        return null; // Ignore line, but style next content
      }
      if (line.startsWith("    ") || (line.startsWith("\t") && line.trim().length > 0)) {
        return (
          <pre key={idx} className="bg-slate-900 text-slate-200 px-3 py-1 my-1 rounded font-mono text-[10px] overflow-x-auto">
            <code>{line}</code>
          </pre>
        );
      }

      return (
        <p key={idx} className="text-xs text-slate-700 leading-relaxed min-h-[1.2em]">
          {formatInlineStyling(line)}
        </p>
      );
    });
  };

  // Helper to highlight bold (**text**) and code (`code`) within lines
  const formatInlineStyling = (text: string) => {
    if (!text) return "";
    const parts: React.ReactNode[] = [];
    let currentText = text;
    let index = 0;

    // Matches **text** or `code`
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    const matches = text.match(regex);

    if (!matches) {
      return text;
    }

    const segments = text.split(regex);
    return segments.map((seg, sIdx) => {
      if (seg.startsWith("**") && seg.endsWith("**")) {
        return <strong key={sIdx} className="font-bold text-slate-900">{seg.slice(2, -2)}</strong>;
      }
      if (seg.startsWith("`") && seg.endsWith("`")) {
        return <code key={sIdx} className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px] text-pink-600 border border-slate-200">{seg.slice(1, -1)}</code>;
      }
      return seg;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden flex flex-col h-[650px]" id="interview-mentor-root">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-4 py-3 flex items-center justify-between border-b border-indigo-900 shrink-0">
        <div className="flex items-center space-x-2">
          <GraduationCap className="text-indigo-400 w-5 h-5" />
          <div>
            <h3 className="text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center space-x-1">
              <span>Java Portfolio & OOP Mentor</span>
              <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
            </h3>
            <span className="text-[10px] text-slate-400 leading-none">Mock Technical Interviewer</span>
          </div>
        </div>
        <button
          onClick={handleResetChat}
          title="Reset Conversation"
          className="p-1.5 hover:bg-indigo-900/40 text-slate-400 hover:text-white rounded-lg transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Chat Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex space-x-3 max-w-[85%] ${
              m.role === "user" ? "ml-auto flex-row-reverse space-x-reverse" : ""
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === "user"
                  ? "bg-slate-200 text-slate-700"
                  : "bg-indigo-100 text-indigo-700 border border-indigo-200"
              }`}
            >
              {m.role === "user" ? <User className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`p-3.5 rounded-2xl shadow-sm space-y-1.5 ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none"
                  : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
              }`}
            >
              <div className="space-y-1">{m.role === "user" ? m.content : renderMessageContent(m.content)}</div>
              <span
                className={`text-[9px] block text-right mt-1 font-mono ${
                  m.role === "user" ? "text-indigo-200" : "text-slate-400"
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex space-x-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-100 p-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              <span className="text-xs italic font-mono">Analyzing codebase & formulating answer...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion list */}
      <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 shrink-0">
        <p className="text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider font-mono">Practice Interview Topics:</p>
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestClick(s.text)}
              disabled={loading}
              className="text-[10px] font-semibold bg-white hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 border border-indigo-100 hover:border-indigo-200 px-2 py-1 rounded-lg transition text-left cursor-pointer disabled:opacity-50"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="bg-white p-3 border-t border-slate-100 flex space-x-2 shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={loading ? "Waiting for response..." : "Ask about thread-safety, BigDecimal, or ask for a quiz..."}
          disabled={loading}
          className="flex-1 bg-slate-50 text-xs text-slate-800 outline-none border border-slate-100 focus:border-indigo-400 rounded-xl px-4 py-2 transition"
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 text-white disabled:text-slate-400 p-2 rounded-xl shadow transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
