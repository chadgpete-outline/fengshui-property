"use server";

import { redirect } from "next/navigation";

import { getApprovedAgentByEmail } from "@/lib/agents";
import { createAgentSession } from "@/lib/session";

// NOTE: For MVP this signs you in from the registered email alone. Before
// agents handle real leads, gate this behind an emailed magic link (Resend).
export async function agentLogin(formData: FormData) {
  const email = (formData.get("email")?.toString() ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect("/login?error=email");
  }
  const agent = await getApprovedAgentByEmail(email);
  if (!agent) {
    redirect("/login?error=notfound");
  }
  await createAgentSession(agent.id);
  redirect("/dashboard");
}
