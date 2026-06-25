import Link from "next/link";
import { cookies } from "next/headers";

const TEAM = [
  { name: "Masoumeh Mirzaeepour Gelvarzkhah", initials: "MM" },
  { name: "Soheil Badri",                     initials: "SB" },
  { name: "Kamal Mohamud",                    initials: "KM" },
  { name: "Mohammad Alhawamdeh",              initials: "MA" },
];

export default async function LandingPage() {
  const cookieStore = await cookies();
  const loggedIn = !!cookieStore.get("token")?.value;

  return (
    <div className="page">

      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-logo">🩺</div>
        <h1>Smart Medical Assistant</h1>
        <p className="hero-subtitle">
          Tired of messy search results and health scare headlines? Describe
          your symptoms and get clear, structured guidance — urgency level,
          possible explanations, warning signs, and suggested next steps.
        </p>
        <div className="hero-actions">
          {loggedIn ? (
            <Link href="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link href="/login" className="btn btn-outline btn-lg">
                Log In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Features ── */}
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <div className="feature-title">Urgency Level</div>
          <p className="feature-desc">
            Instantly know if your symptoms need urgent attention or can wait.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <div className="feature-title">Structured Guidance</div>
          <p className="feature-desc">
            Possible explanations, warning signs, and clear next steps — every
            time.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📁</div>
          <div className="feature-title">Symptom History</div>
          <p className="feature-desc">
            Every check is saved to your account so you can look back anytime.
          </p>
        </div>
      </div>

      {/* ── About the Project ── */}
      <div className="about-section">
        <h2 className="section-heading">About This Project</h2>
        <p className="about-text">
          People often search their symptoms online and end up overwhelmed by
          ads, conflicting information, and unnecessary panic. This app was
          built to change that. Instead of wall-to-wall articles, you get a
          concise, structured response that helps you decide what to do next —
          calmly and clearly.
        </p>
        <p className="about-text">
          The assistant uses a large language model to analyse your input and
          return a consistent format every time: an urgency rating, a short
          list of possible explanations, warning signs to watch for, and
          practical next steps. A medical disclaimer is always shown so users
          understand the limits of the tool.
        </p>
        <div className="about-goals">
          <div className="goal-item">✅ Free to use, runs entirely on free tiers</div>
          <div className="goal-item">✅ No ads, no clutter, no scare tactics</div>
          <div className="goal-item">✅ Secure — your data is behind your account</div>
          <div className="goal-item">✅ Emergency responses always advise calling 911</div>
        </div>
      </div>

      {/* ── Team ── */}
      <div className="team-section">
        <h2 className="section-heading">The Team</h2>
        <div className="team-grid">
          {TEAM.map((member, i) => (
            <div key={i} className="team-card">
              <div className="team-avatar">{member.initials}</div>
              <div className="team-name">{member.name}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="disclaimer">
        This tool provides general information only and is not a substitute for
        professional medical advice, diagnosis, or treatment. Always consult a
        qualified healthcare provider for medical concerns.
      </p>
    </div>
  );
}
