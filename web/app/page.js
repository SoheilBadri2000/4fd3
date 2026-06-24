import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { logout } from "./actions";
import Assistant from "./assistant";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Smart Medical Assistant</h1>
      <p>
        Logged in as {user.email}{" "}
        <form action={logout} style={{ display: "inline" }}>
          <button>Log out</button>
        </form>
      </p>
      <p>Describe your symptoms to get general information.</p>
      <Assistant />
    </main>
  );
}
