import { redirect } from "next/navigation";
import { getHistory } from "../actions";
import HistoryList from "./HistoryList";

export default async function HistoryPage() {
  const result = await getHistory();
  if (result?.error === "Not authenticated") redirect("/login");

  const history = Array.isArray(result) ? result : [];

  return (
    <div className="page">
      <h2 style={{ marginBottom: "16px" }}>Symptom History</h2>
      <HistoryList initialHistory={history} />
    </div>
  );
}
