import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Assistant from "../assistant";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  return (
    <div className="page">
      <h2 style={{ marginBottom: "16px" }}>Check Symptoms</h2>

      <div className="disclaimer-box">
        <span>⚠️</span>
        <span>
          <strong>Medical disclaimer:</strong> This tool provides general
          information only. It is not a substitute for professional medical
          advice or diagnosis. If you think you may have a medical emergency,
          call 911 immediately.
        </span>
      </div>

      <div style={{ marginTop: "24px" }}>
        <p className="section-label">Describe your symptoms</p>
        <Assistant />
      </div>
    </div>
  );
}
