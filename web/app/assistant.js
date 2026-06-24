"use client";

import { useState } from "react";
import { generate } from "./actions";

export default function Assistant() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask() {
    if (!symptoms.trim()) {
      setResult("Please enter your symptoms first.");
      return;
    }
    setLoading(true);
    setResult("Thinking... (this can take up to a minute)");

    const data = await generate(symptoms);
    if (data.error) {
      setResult("Error: " + data.error);
    } else {
      setResult(data.response);
    }
    setLoading(false);
  }

  return (
    <>
      <textarea
        placeholder="e.g. I have a headache and a sore throat..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />
      <button onClick={ask} disabled={loading}>
        Ask
      </button>
      <div id="result">{result}</div>
    </>
  );
}
