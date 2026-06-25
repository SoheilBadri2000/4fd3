"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.API_URL || "http://localhost:3001";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

export async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.error) return { error: data.error };

    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set("email", data.email, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return { success: true };
  } catch {
    return { error: "Could not reach the server" };
  }
}

export async function register(email, password) {
  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.error) return { error: data.error };

    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set("email", data.email, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return { success: true };
  } catch {
    return { error: "Could not reach the server" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("email");
  redirect("/login");
}

export async function generate(symptoms) {
  const token = await getToken();
  if (!token) return { error: "Not authenticated" };
  if (!symptoms?.trim()) return { error: "Please describe your symptoms" };

  try {
    const res = await fetch(`${API_URL}/api/symptoms/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ symptoms }),
    });
    return await res.json();
  } catch {
    return { error: "Could not reach the assistant" };
  }
}

export async function getHistory() {
  const token = await getToken();
  if (!token) return { error: "Not authenticated" };

  try {
    const res = await fetch(`${API_URL}/api/symptoms/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { error: "Could not fetch history" };
  }
}

export async function deleteEntry(id) {
  const token = await getToken();
  if (!token) return { error: "Not authenticated" };

  try {
    const res = await fetch(`${API_URL}/api/symptoms/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { error: "Could not delete entry" };
  }
}

export async function followUp(symptoms, initialResponse, messages, question) {
  const token = await getToken();
  if (!token) return { error: "Not authenticated" };

  try {
    const res = await fetch(`${API_URL}/api/symptoms/followup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ symptoms, initialResponse, messages, question }),
    });
    return await res.json();
  } catch {
    return { error: "Could not generate response" };
  }
}
