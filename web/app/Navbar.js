import { cookies } from "next/headers";
import Link from "next/link";
import { logout } from "./actions";

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const email = cookieStore.get("email")?.value;

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        🩺 <span>Smart Medical Assistant</span>
      </Link>

      <div className="navbar-links">
        {token ? (
          <>
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/history" className="nav-link">History</Link>
            <span className="nav-email">{email}</span>
            <form action={logout} style={{ display: "inline" }}>
              <button type="submit" className="btn btn-ghost btn-sm">
                Log Out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/login" className="nav-link">Log In</Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
