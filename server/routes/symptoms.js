import express from "express";
import Groq from "groq-sdk";
import { authenticateToken } from "../middleware/auth.js";
import SymptomCheck from "../models/SymptomCheck.js";

const router = express.Router();

let _groq = null;
function getGroq() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set in server/.env");
  }
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _groq;
}

const SYSTEM_PROMPT = `You are a medical information assistant. When given symptoms, respond ONLY with a valid JSON object (no markdown, no text outside the JSON) with exactly these fields:
- "urgency": one of "low", "medium", "high", or "emergency"
- "possibleExplanations": array of 2-4 brief possible explanations (strings)
- "warningSignsToWatch": array of 2-4 warning signs that require immediate attention (strings)
- "suggestedNextSteps": array of 2-4 actionable next steps (strings)

Be cautious. Never provide a definitive diagnosis. When in doubt, recommend seeing a doctor.
For emergencies, set urgency to "emergency" and include "Call 911 or go to the nearest emergency room immediately" as the first item in suggestedNextSteps.`;

router.post("/generate", authenticateToken, async (req, res) => {
  const { symptoms } = req.body;
  if (!symptoms?.trim()) {
    return res.status(400).json({ error: "Symptoms are required" });
  }

  try {
    const completion = await getGroq().chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `My symptoms: ${symptoms}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 600,
    });

    const parsed = JSON.parse(completion.choices[0].message.content);

    const check = await SymptomCheck.create({
      userId: req.user.userId,
      symptoms,
      response: parsed,
    });

    res.json({ id: check._id, ...parsed });
  } catch (err) {
    console.error("Generate error:", err);
    res.status(500).json({ error: "Could not generate response" });
  }
});

router.get("/history", authenticateToken, async (req, res) => {
  try {
    const history = await SymptomCheck.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch history" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const check = await SymptomCheck.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!check) return res.status(404).json({ error: "Entry not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Could not delete entry" });
  }
});

const FOLLOWUP_PROMPT = `You are a medical information assistant having a follow-up conversation with a user about their symptoms. You have already provided an initial assessment. Answer the user's follow-up question clearly and concisely (under 120 words). Be helpful but always remind them to consult a healthcare professional. Never provide a definitive diagnosis.`;

router.post("/followup", authenticateToken, async (req, res) => {
  const { symptoms, initialResponse, messages, question } = req.body;
  if (!question?.trim()) return res.status(400).json({ error: "Question is required" });

  const context = [
    { role: "system", content: FOLLOWUP_PROMPT },
    {
      role: "user",
      content: `Original symptoms: ${symptoms}\n\nInitial assessment: urgency=${initialResponse.urgency}, explanations: ${initialResponse.possibleExplanations?.join(", ")}`,
    },
    { role: "assistant", content: "I've reviewed your symptoms and provided an initial assessment. What would you like to know more about?" },
    ...messages.flatMap((m) => [
      { role: "user", content: m.question },
      { role: "assistant", content: m.answer },
    ]),
    { role: "user", content: question },
  ];

  try {
    const completion = await getGroq().chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: context,
      temperature: 0.4,
      max_tokens: 300,
    });
    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error("Follow-up error:", err);
    res.status(500).json({ error: "Could not generate follow-up" });
  }
});

export default router;
