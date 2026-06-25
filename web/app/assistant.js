"use client";

import { useState, useRef, useEffect } from "react";
import { generate, followUp } from "./actions";

const CHIPS = [
  "Headache", "Fever", "Sore throat", "Cough",
  "Stomach pain", "Fatigue", "Chest pain", "Dizziness",
  "Nausea", "Back pain",
];

const URGENCY = {
  low:       { color: "#16a34a", label: "Low Urgency",    dot: "🟢" },
  medium:    { color: "#d97706", label: "Medium Urgency", dot: "🟡" },
  high:      { color: "#ea580c", label: "High Urgency",   dot: "🟠" },
  emergency: { color: "#dc2626", label: "EMERGENCY",      dot: "🔴" },
};

export default function Assistant() {
  const [symptoms, setSymptoms]     = useState("");
  const [result, setResult]         = useState(null);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput]       = useState("");
  const [chatLoading, setChatLoading]   = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatMessages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  async function handleCheck() {
    if (!symptoms.trim()) {
      setError("Please describe your symptoms first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setChatMessages([]);

    const data = await generate(symptoms);
    if (data.error) {
      setError(data.error);
    } else {
      setResult(data);
    }
    setLoading(false);
  }

  async function handleFollowUp(e) {
    e.preventDefault();
    const question = chatInput.trim();
    if (!question || chatLoading) return;

    setChatInput("");
    setChatLoading(true);

    const data = await followUp(symptoms, result, chatMessages, question);
    if (!data.error) {
      setChatMessages((prev) => [...prev, { question, answer: data.answer }]);
    }
    setChatLoading(false);
  }

  function addChip(label) {
    const current = symptoms.trim();
    setSymptoms(current ? `${current}, ${label.toLowerCase()}` : label);
  }

  function reset() {
    setResult(null);
    setSymptoms("");
    setError("");
    setChatMessages([]);
    setChatInput("");
  }

  const urg = result?.urgency ? URGENCY[result.urgency] : null;

  return (
    <>
      <textarea
        placeholder="e.g. I've had a headache and sore throat for two days, with a mild fever..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        maxLength={500}
      />
      <div className="textarea-footer">
        <span className="char-count">{symptoms.length} / 500</span>
      </div>

      <p className="chips-label">Quick add:</p>
      <div className="chips">
        {CHIPS.map((c) => (
          <button key={c} type="button" className="chip" onClick={() => addChip(c)}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "16px" }}>
        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={handleCheck}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Analyzing symptoms...
            </>
          ) : (
            "Check Symptoms"
          )}
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading && (
        <div className="loading-card">
          <div className="loading-spinner-lg" />
          <span>Analyzing your symptoms — this may take a moment.</span>
        </div>
      )}

      {result && !loading && (
        <>
          <div className="result-card">
            <div className="result-header">
              <div>
                <h3 style={{ marginBottom: "8px" }}>Assessment</h3>
                {urg && (
                  <span className="urgency-badge" style={{ background: urg.color }}>
                    {urg.dot} {urg.label}
                  </span>
                )}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={reset}>
                Clear
              </button>
            </div>

            <div className="result-section">
              <h3>Possible Explanations</h3>
              <ul>
                {result.possibleExplanations?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="result-section">
              <h3>Warning Signs to Watch</h3>
              <ul>
                {result.warningSignsToWatch?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="result-section">
              <h3>Suggested Next Steps</h3>
              <ul>
                {result.suggestedNextSteps?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Follow-up Chat ── */}
          <div className="chat-section">
            <div className="chat-header">
              <span className="chat-header-icon">💬</span>
              <div>
                <div className="chat-header-title">Ask a follow-up question</div>
                <div className="chat-header-sub">
                  e.g. &quot;Is this serious for a child?&quot; or &quot;What if I also have a rash?&quot;
                </div>
              </div>
            </div>

            {chatMessages.length > 0 && (
              <div className="chat-messages">
                {chatMessages.map((msg, i) => (
                  <div key={i} className="chat-pair">
                    <div className="chat-bubble chat-bubble-user">{msg.question}</div>
                    <div className="chat-bubble chat-bubble-ai">{msg.answer}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}

            <form className="chat-input-row" onSubmit={handleFollowUp}>
              <input
                type="text"
                className="chat-input"
                placeholder="Ask a follow-up question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={chatLoading}
                maxLength={300}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={chatLoading || !chatInput.trim()}
              >
                {chatLoading ? <span className="spinner" /> : "Send"}
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
