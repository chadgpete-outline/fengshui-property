"use server";

import { redirect } from "next/navigation";

import { isValidRef } from "./refs";

export async function submitApplication(formData: FormData) {
  const ref = (formData.get("ref")?.toString() ?? "").trim().toLowerCase();

  if (!isValidRef(ref)) {
    redirect("/apply?error=invalid-code");
  }

  const application = {
    referredBy: ref,
    name: formData.get("name")?.toString().trim(),
    email: formData.get("email")?.toString().trim().toLowerCase(),
    phone: formData.get("phone")?.toString().trim(),
    res: formData.get("res")?.toString().trim().toUpperCase(),
    agency: formData.get("agency")?.toString().trim(),
    territories: formData.get("territories")?.toString().trim(),
    note: formData.get("note")?.toString().trim(),
    submittedAt: new Date().toISOString(),
  };

  if (
    !application.name ||
    !application.email ||
    !application.phone ||
    !application.res ||
    !application.agency
  ) {
    redirect(`/apply?ref=${ref}&error=missing-fields`);
  }

  console.log("[PARTNER APPLICATION]", application);

  redirect("/apply?submitted=1");
}
