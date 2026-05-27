export default function LoginPage() {
  return (
    <main className="flex-1 px-6 sm:px-10 py-20 sm:py-28">
      <div className="mx-auto max-w-md">
        <div className="text-[10px] tracking-[0.35em] uppercase text-bg/50 mb-3">
          Sign in · 签到
        </div>
        <h1 className="font-display text-4xl sm:text-5xl leading-[0.95] tracking-[-0.02em] mb-6">
          Magic link <em className="text-cinnabar italic font-normal">only.</em>
        </h1>
        <p className="text-bg/75 leading-relaxed mb-10 text-sm">
          We don&rsquo;t use passwords. Enter the email tied to your account
          and we&rsquo;ll send a one-time link to sign in.
        </p>
        <form className="space-y-8">
          <label className="block">
            <div className="text-[10px] tracking-[0.3em] uppercase text-bg/60 mb-2">
              Agency email
            </div>
            <input
              type="email"
              name="email"
              required
              placeholder="you@agency.sg"
              className="w-full bg-transparent border-b-2 border-bg/30 focus:border-cinnabar transition-colors py-2 text-base placeholder:text-bg/30 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled
            className="font-display text-xl text-cinnabar/50 inline-flex items-center gap-2 cursor-not-allowed"
            title="Magic-link sender connects in next build"
          >
            Send magic link <span aria-hidden>→</span>
          </button>
        </form>
        <p className="text-[10px] tracking-wide text-bg/40 mt-12">
          New here? <a href="/apply" className="text-cinnabar">Apply for access</a> ·
          The dashboard opens once your RES number is verified.
        </p>
      </div>
    </main>
  );
}
