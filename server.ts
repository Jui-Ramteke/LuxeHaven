import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client safely (lazy-loaded inside endpoint or configured with fallback)
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Java AI Interview & Mentor Endpoint
app.post("/api/gemini/mentor", async (req, res) => {
  try {
    const { messages, context } = req.body;
    
    if (!apiKey || !aiClient) {
      return res.status(503).json({
        error: "Gemini API Key is not configured. Please add your GEMINI_API_KEY in Settings > Secrets."
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array provided." });
    }

    const systemPrompt = `You are a Senior Java Technical Interviewer, Object-Oriented Programming (OOP) Mentor, and Backend Systems Architect. 
Your student is preparing for interviews for roles like Java Developer, Backend Engineer, and Software Engineer.
They have built a "Hotel Room Booking Console App" written in Java with clean OOP principles (Encapsulation, Inheritance, Polymorphism, Abstraction), robust Exception Handling, File-based I/O persistence, date-time validation, and menu-driven command interface.

Analyze their Java implementation details and provide highly professional, helpful, encouraging, yet technically rigorous feedback or interview practice.
- When they ask for mock interview questions, ask them ONE question at a time. Rate their response from a scale of 1-10 with constructive feedback, and then ask the next question.
- Focus on topics like: Why use BigDecimal or double for prices? How to prevent concurrency issues when multiple guests book rooms? Why separation of concerns (Model, Service, Utility) matters? How do checked vs unchecked exceptions differ in the FileHandler?
- Keep your answers highly scannable, clear, professional, and directly focused on preparing them for an industry-level coding or system design interview. Keep answers concise and avoid wordy essays.`;

    const formattedContents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    const history = formattedContents.length > 1 ? formattedContents.slice(0, -1) : [];

    // Inject system instructions and run chat
    const chat = aiClient.chats.create({
      model: "gemini-3.5-flash",
      history: history,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    // Send the last message in the chat
    const lastMessage = formattedContents[formattedContents.length - 1];

    const response = await chat.sendMessage({
      message: lastMessage.parts[0].text
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    res.status(500).json({ error: error?.message || "An error occurred during communication with Gemini." });
  }
});

// Serve Vite client in development or compiled client in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
