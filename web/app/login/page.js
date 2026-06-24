"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(
      error ? "Error: " + error.message : "Signed up! Logging you in..."
    );
    if (!error) {
      router.refresh();
      router.push("/");
    }
  }

  async function logIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMessage("Error: " + error.message);
      return;
    }
    router.refresh();
    router.push("/");
  }

  return (
    <main>
      <h1>Smart Medical Assistant</h1>
      <p>Log in or sign up to use the assistant.</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password (at least 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <button onClick={signUp}>Sign Up</button>
        <button onClick={logIn}>Log In</button>
      </div>
      <div className="auth-message">{message}</div>
    </main>
  );
}
