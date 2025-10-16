// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import pkg from "@supabase/supabase-js";

const { createClient } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// --- Supabase ---
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// --- API: save assessment ---
app.post("/api/assessments", async (req, res) => {
  const { user_id, payload } = req.body; // payload = your JSON result
  const { data, error } = await supabase
    .from("assessments")
    .insert({ user_id, payload })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true, data });
});

// --- API: load latest assessment for a user ---
app.get("/api/assessments/:userId/latest", async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true, data });
});

app.get("/healthz", (_, res) => res.send("ok"));
// --- Serve built frontend ---
app.use(express.static(path.join(__dirname, "dist")));
app.get(/^\/(?!api(?:\/|$)|healthz$).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => console.log(`Up on ${PORT}`));
