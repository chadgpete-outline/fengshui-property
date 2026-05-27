import "server-only";

import crypto from "node:crypto";
import { eq } from "drizzle-orm";

import { db, ensureSchema } from "./db";
import {
  type Agent,
  type Lead,
  agents,
  analyses,
  claims,
  leads,
} from "./db/schema";

export type Tier = "hot" | "warm";
export const PRICE_CENTS: Record<Tier, number> = { hot: 12000, warm: 5000 };

export function sgd(cents: number): string {
  return `S$${(cents / 100).toFixed(0)}`;
}

const clean = (v?: string | null) => {
  const t = v?.trim();
  return t ? t : null;
};

export async function applyAgent(p: {
  email: string;
  name?: string;
  agency?: string;
  resNo?: string;
  territories?: string;
  referredBy?: string;
  approved: boolean;
}): Promise<void> {
  await ensureSchema();
  const email = p.email.trim().toLowerCase();
  const status = p.approved ? "approved" : "pending";

  const existing = await db
    .select()
    .from(agents)
    .where(eq(agents.email, email))
    .limit(1);

  if (existing[0]) {
    const cur = existing[0];
    await db
      .update(agents)
      .set({
        name: clean(p.name) ?? cur.name,
        agency: clean(p.agency) ?? cur.agency,
        resNo: clean(p.resNo) ?? cur.resNo,
        territories: clean(p.territories) ?? cur.territories,
        status: cur.status === "approved" ? "approved" : status,
      })
      .where(eq(agents.id, cur.id));
    return;
  }

  await db.insert(agents).values({
    id: crypto.randomUUID(),
    email,
    name: clean(p.name),
    agency: clean(p.agency),
    resNo: clean(p.resNo),
    territories: clean(p.territories),
    status,
    referredBy: clean(p.referredBy),
    createdAt: Date.now(),
  });
}

export async function getApprovedAgentByEmail(
  email: string,
): Promise<Agent | null> {
  await ensureSchema();
  const r = await db
    .select()
    .from(agents)
    .where(eq(agents.email, email.trim().toLowerCase()))
    .limit(1);
  const a = r[0];
  return a && a.status === "approved" ? a : null;
}

export async function getAgent(id: string): Promise<Agent | null> {
  await ensureSchema();
  const r = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
  return r[0] ?? null;
}

async function leadStats(): Promise<Map<string, { count: number; top: number | null }>> {
  const rows = await db
    .select({ leadId: analyses.leadId, score: analyses.score })
    .from(analyses);
  const map = new Map<string, { count: number; top: number | null }>();
  for (const r of rows) {
    const cur = map.get(r.leadId) ?? { count: 0, top: null };
    cur.count += 1;
    if (r.score != null && (cur.top == null || r.score > cur.top)) {
      cur.top = r.score;
    }
    map.set(r.leadId, cur);
  }
  return map;
}

export type MarketLead = {
  id: string;
  tier: Tier;
  priceCents: number;
  propertyInterest: string | null;
  timeline: string | null;
  createdAt: number;
  analysisCount: number;
  topScore: number | null;
};

export async function listAvailableLeads(): Promise<MarketLead[]> {
  await ensureSchema();
  const claimedRows = await db.select({ leadId: claims.leadId }).from(claims);
  const claimed = new Set(claimedRows.map((c) => c.leadId));
  const all = await db.select().from(leads);
  const stats = await leadStats();

  const out: MarketLead[] = [];
  for (const l of all) {
    if (!l.phone || claimed.has(l.id)) continue; // sellable = has contact, unclaimed
    const s = stats.get(l.id) ?? { count: 0, top: null };
    const tier: Tier = s.count > 0 ? "hot" : "warm";
    out.push({
      id: l.id,
      tier,
      priceCents: PRICE_CENTS[tier],
      propertyInterest: l.propertyInterest,
      timeline: l.timeline,
      createdAt: l.createdAt,
      analysisCount: s.count,
      topScore: s.top,
    });
  }
  out.sort((a, b) =>
    a.tier === b.tier ? b.createdAt - a.createdAt : a.tier === "hot" ? -1 : 1,
  );
  return out;
}

export async function claimLead(
  agentId: string,
  leadId: string,
): Promise<{ ok: true; tier: Tier } | { ok: false; error: string }> {
  await ensureSchema();
  const lr = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
  const lead = lr[0];
  if (!lead || !lead.phone) {
    return { ok: false, error: "That lead is no longer available." };
  }
  const existing = await db
    .select({ id: claims.id })
    .from(claims)
    .where(eq(claims.leadId, leadId))
    .limit(1);
  if (existing[0]) {
    return { ok: false, error: "Another agent claimed this lead first." };
  }
  const stats = await leadStats();
  const s = stats.get(leadId);
  const tier: Tier = s && s.count > 0 ? "hot" : "warm";
  try {
    await db.insert(claims).values({
      id: crypto.randomUUID(),
      leadId,
      agentId,
      tier,
      priceCents: PRICE_CENTS[tier],
      claimedAt: Date.now(),
    });
  } catch {
    return { ok: false, error: "Another agent claimed this lead first." };
  }
  return { ok: true, tier };
}

export type MyClaim = {
  leadId: string;
  tier: string;
  priceCents: number;
  claimedAt: number;
  email: string;
  name: string | null;
  phone: string | null;
  propertyInterest: string | null;
};

export async function listMyClaims(agentId: string): Promise<MyClaim[]> {
  await ensureSchema();
  const cs = await db.select().from(claims).where(eq(claims.agentId, agentId));
  const out: MyClaim[] = [];
  for (const c of cs) {
    const lr = await db.select().from(leads).where(eq(leads.id, c.leadId)).limit(1);
    const l = lr[0];
    if (!l) continue;
    out.push({
      leadId: c.leadId,
      tier: c.tier,
      priceCents: c.priceCents,
      claimedAt: c.claimedAt,
      email: l.email,
      name: l.name,
      phone: l.phone,
      propertyInterest: l.propertyInterest,
    });
  }
  out.sort((a, b) => b.claimedAt - a.claimedAt);
  return out;
}

export type ClaimedLeadDetail = {
  tier: Tier;
  priceCents: number;
  claimedAt: number;
  lead: Lead;
  analyses: { facing: string | null; score: number | null; createdAt: number }[];
};

export async function getClaimedLeadDetail(
  agentId: string,
  leadId: string,
): Promise<ClaimedLeadDetail | null> {
  await ensureSchema();
  const cr = await db
    .select()
    .from(claims)
    .where(eq(claims.leadId, leadId))
    .limit(1);
  const claim = cr[0];
  if (!claim || claim.agentId !== agentId) return null;
  const lr = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
  const lead = lr[0];
  if (!lead) return null;
  const ar = await db.select().from(analyses).where(eq(analyses.leadId, leadId));
  return {
    tier: claim.tier as Tier,
    priceCents: claim.priceCents,
    claimedAt: claim.claimedAt,
    lead,
    analyses: ar
      .map((a) => ({ facing: a.facing, score: a.score, createdAt: a.createdAt }))
      .sort((x, y) => y.createdAt - x.createdAt),
  };
}
