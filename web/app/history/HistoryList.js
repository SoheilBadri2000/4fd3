"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteEntry } from "../actions";

const URGENCY_COLOR = {
  low: "#16a34a",
  medium: "#d97706",
  high: "#ea580c",
  emergency: "#dc2626",
};

const URGENCY_LABEL = {
  low: "Low", medium: "Medium", high: "High", emergency: "Emergency",
};

export default function HistoryList({ initialHistory }) {
  const [history, setHistory] = useState(initialHistory);
  const [deleting, setDeleting] = useState(null);

  async function handleDelete(id) {
    setDeleting(id);
    const result = await deleteEntry(id);
    if (!result.error) {
      setHistory((prev) => prev.filter((e) => e._id !== id));
    }
    setDeleting(null);
  }

  if (history.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h2>No checks yet</h2>
        <p>Your symptom history will appear here after your first check.</p>
        <div style={{ marginTop: "20px" }}>
          <Link href="/dashboard" className="btn btn-primary">
            Check Your Symptoms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="history-list">
      {history.map((entry) => (
        <div key={entry._id} className="history-card">
          <div className="history-card-header">
            <div className="history-meta">
              <span className="history-date">
                {new Date(entry.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {entry.response?.urgency && (
                  <span
                    className="urgency-badge"
                    style={{
                      background:
                        URGENCY_COLOR[entry.response.urgency] || "#888",
                    }}
                  >
                    {URGENCY_LABEL[entry.response.urgency] ||
                      entry.response.urgency}
                  </span>
                )}
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(entry._id)}
                  disabled={deleting === entry._id}
                  title="Delete this entry"
                >
                  {deleting === entry._id ? "…" : "🗑"}
                </button>
              </div>
            </div>
            <p className="history-symptoms">
              <strong>Symptoms:</strong> {entry.symptoms}
            </p>
          </div>

          {entry.response && (
            <div className="history-detail">
              <div>
                <div className="hd-title">Possible Explanations</div>
                <ul className="hd-items">
                  {entry.response.possibleExplanations?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="hd-title">Warning Signs</div>
                <ul className="hd-items">
                  {entry.response.warningSignsToWatch?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="hd-title">Next Steps</div>
                <ul className="hd-items">
                  {entry.response.suggestedNextSteps?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
