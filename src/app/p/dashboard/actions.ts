"use server";

import { redirect } from "next/navigation";

import { claimLead } from "@/lib/agents";
import { destroyAgentSession, getAgentId } from "@/lib/session";

export async function claimAction(formData: FormData) {
  const leadId = formData.get("leadId")?.toString() ?? "";
  const agentId = await getAgentId();
  if (!agentId) redirect("/login");
  const result = await claimLead(agentId, leadId);
  if (!result.ok) redirect("/dashboard?error=taken");
  redirect(`/leads/${leadId}`);
}

export async function agentLogout() {
  await destroyAgentSession();
  redirect("/login");
}
