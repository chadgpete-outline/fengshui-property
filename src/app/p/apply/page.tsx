import { submitApplication } from "./actions";
import { isValidRef } from "./refs";

type SP = { ref?: string; submitted?: string; error?: string };

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const params = await searchParams;

  if (params.submitted === "1") {
    return <Submitted />;
  }

  if (!isValidRef(params.ref)) {
    return <NoCode error={params.error} />;
  }

  return <ApplyForm refCode={params.ref!.trim().toLowerCase()} error={params.error} />;
}

function NoCode({ error }: { error?: string }) {
  return (
    <main className="flex-1 px-6 sm:px-10 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <div className="text-[10px] tracking-[0.35em] uppercase text-bg/50 mb-3">
          {error === "invalid-code"
            ? "Code not recognised"
            : "Application is invite-only"}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl leading-[0.95] tracking-[-0.02em] mb-8">
          The application takes{" "}
          <em className="text-cinnabar italic font-normal">a code.</em>
        </h1>
        <p className="text-bg/75 leading-relaxed mb-6">
          We onboard a small number of top specialists per estate. If you
          received an invitation, your code is in the email — use the link
          from there.
        </p>
        <p className="text-bg/75 leading-relaxed mb-10">
          If you didn&rsquo;t and your district feels under-served, write to{" "}
          <a
            href="mailto:partners@fengshuiai.sg"
            className="text-cinnabar hover:underline"
          >
            partners@fengshuiai.sg
          </a>{" "}
          — tell us your name, agency, RES number, and the estates you cover.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 font-display text-lg text-cinnabar hover:gap-3 transition-all"
        >
          <span aria-hidden>←</span> Back to overview
        </a>
      </div>
    </main>
  );
}

function Submitted() {
  return (
    <main className="flex-1 px-6 sm:px-10 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <div className="text-[10px] tracking-[0.35em] uppercase text-cinnabar mb-3">
          Received · 收到
        </div>
        <h1 className="font-display text-4xl sm:text-5xl leading-[0.95] tracking-[-0.02em] mb-8">
          Your application is{" "}
          <em className="text-cinnabar italic font-normal">in the book.</em>
        </h1>
        <p className="text-bg/75 leading-relaxed mb-6">
          We review every application within 48 hours. We verify the RES
          number against the CEA public directory and, if your territory has
          capacity, you&rsquo;ll receive a magic link to sign in to the
          dashboard.
        </p>
        <p className="text-bg/75 leading-relaxed mb-10">
          Watch for an email from{" "}
          <span className="text-bg">partners@fengshuiai.sg</span> — add it to
          your contacts so it doesn&rsquo;t end up in spam.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 font-display text-lg text-cinnabar hover:gap-3 transition-all"
        >
          <span aria-hidden>←</span> Back to overview
        </a>
      </div>
    </main>
  );
}

function ApplyForm({ refCode, error }: { refCode: string; error?: string }) {
  return (
    <main className="flex-1 px-6 sm:px-10 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-[10px] tracking-[0.35em] uppercase text-bg/50 mb-3 flex flex-wrap gap-x-3">
          <span>Invitation accepted</span>
          <span className="text-cinnabar">·</span>
          <span className="font-mono text-bg/40 tracking-normal">
            ref: {refCode}
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl leading-[0.95] tracking-[-0.02em] mb-6">
          Tell us who you are.
        </h1>
        <p className="text-bg/75 leading-relaxed mb-10 max-w-xl">
          We verify the RES number against the CEA directory and review every
          application within 48 hours. Six fields, no marketing fluff.
        </p>

        {error === "missing-fields" && (
          <div className="border border-cinnabar bg-cinnabar/10 px-5 py-3 mb-8 text-sm">
            One of the fields below is missing. Have another look.
          </div>
        )}

        <form action={submitApplication} className="space-y-10">
          <input type="hidden" name="ref" value={refCode} />

          <Field label="Full name" cn="姓名" name="name" required />
          <Field
            label="Agency email"
            cn="电邮"
            name="email"
            type="email"
            required
            help="Use the address tied to your RES registration."
          />
          <Field
            label="Phone / WhatsApp"
            cn="联络"
            name="phone"
            type="tel"
            required
            placeholder="+65 8xxx xxxx"
          />
          <Field
            label="RES licence no."
            cn="执照"
            name="res"
            required
            placeholder="R0xxxxxx"
            help="We verify against the CEA public directory."
          />
          <Field label="Agency" cn="公司" name="agency" required />
          <Field
            label="Territories you cover"
            cn="覆盖区"
            name="territories"
            placeholder="Bishan, Toa Payoh, Bukit Timah…"
            help="Comma-separated estates. Districts also fine."
          />
          <Field
            label="Anything else?"
            cn="备注"
            name="note"
            multiline
            placeholder="Optional. Tell us about your typical buyer."
          />

          <div className="border-t border-bg/30 pt-6 flex flex-wrap items-baseline justify-between gap-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-bg/50 max-w-xs">
              By submitting, you allow us to verify your RES number with CEA
              and contact you about lead access.
            </p>
            <button
              type="submit"
              className="font-display text-xl text-cinnabar hover:translate-x-1 transition-transform inline-flex items-center gap-2"
            >
              Submit application <span aria-hidden>→</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  cn,
  name,
  type = "text",
  required,
  placeholder,
  help,
  multiline,
}: {
  label: string;
  cn: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  help?: string;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[10px] tracking-[0.3em] uppercase text-bg/60">
          {label}
          {required && <span className="text-cinnabar ml-1">*</span>}
        </span>
        <span className="font-cn text-sm text-bg/40">{cn}</span>
      </div>
      {multiline ? (
        <textarea
          name={name}
          rows={3}
          placeholder={placeholder}
          className="w-full bg-transparent border-b-2 border-bg/30 focus:border-cinnabar transition-colors py-2 text-base placeholder:text-bg/30 focus:outline-none resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className="w-full bg-transparent border-b-2 border-bg/30 focus:border-cinnabar transition-colors py-2 text-base placeholder:text-bg/30 focus:outline-none"
        />
      )}
      {help && <p className="text-xs text-bg/50 mt-2">{help}</p>}
    </label>
  );
}
