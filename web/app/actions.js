"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function generate(prompt) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }
  if (!prompt || !prompt.trim()) {
    return { error: "Prompt is required" };
  }

  const backendUrl = process.env.LLM_BACKEND_URL || "http://localhost:8000";

  try {
    const res = await fetch(`${backendUrl}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();

    await supabase.from("symptom_checks").insert({
      symptoms: prompt,
      response: data.response,
      user_id: user.id,
    });

    return { response: data.response };
  } catch (err) {
    return { error: "Could not reach the assistant." };
  }
}
