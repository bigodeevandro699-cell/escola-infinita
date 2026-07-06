import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { generateEducationalContent, chatMentor } from "./services/aiContentEngine";
import { getCachedContent, saveToCache } from "./services/storage";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.post("/api/mentor", async (req, res) => {
  try {
    const { contexto, pergunta } = req.body;
    if (!contexto || !pergunta) {
      return res.status(400).json({ error: "Contexto e pergunta são obrigatórios" });
    }
    const resposta = await chatMentor(contexto, pergunta);
    res.json({ resposta });
  } catch (error: any) {
    console.error("Erro no chat mentor:", error);
    res.status(500).json({ error: "Erro ao conversar com o mentor" });
  }
});

app.post("/api/generate", async (req, res) => {
  try {
    const cached = getCachedContent(req.body);
    if (cached) {
      console.log("Serving from cache:", req.body.unidade);
      return res.json(cached);
    }

    const jsonResult = await generateEducationalContent(req.body);
    
    // Save to cache
    saveToCache(req.body, jsonResult);
    
    res.json(jsonResult);
  } catch (error: any) {
    const isRateLimit = error?.status === 429 || error?.status === "RESOURCE_EXHAUSTED" || error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED");
    
    if (isRateLimit) {
        res.status(429).json({ error: "O limite de uso da Inteligência Artificial foi atingido. Por favor, aguarde cerca de 1 minuto e tente novamente." });
        return;
    }

    console.error("Error generating content:", error);
    res.status(500).json({ error: error.message || "Failed to generate content" });
  }
});

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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
