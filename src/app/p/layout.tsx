import type { Metadata } from "next";

import { PartnersMasthead } from "@/components/partners-masthead";

export const metadata: Metadata = {
  title: {
    default: "Fengshui AI · Partners",
    template: "%s · Fengshui AI Partners",
  },
  description:
    "Invite-only lead marketplace for Singapore property specialists. Pay only on claim. No subscriptions.",
  robots: { index: false, follow: false },
};

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-ink text-bg min-h-screen flex flex-col">
      <PartnersMasthead />
      {children}
    </div>
  );
}
