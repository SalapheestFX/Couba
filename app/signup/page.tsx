"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type Method = "Email" | "Phone";

export default function SignupPage() {
  const [method, setMethod] = useState<Method>("Email");
  const [step, setStep] = useState(1);
  const [identity, setIdentity] = useState("");
  const [referral, setReferral] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [notice, setNotice] = useState("");

  function continueRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setStep(2);
  }

  function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(
      "Verification is not connected yet. No code has been sent or verified."
    );
  }

  function createAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 8) {
      setNotice("Use a password with at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setNotice("The passwords do not match.");
      return;
    }

    setNotice(
      "Couba registration is not connected to an authentication backend. No account has been created."
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_#e0f0ff,_transparent_50%),linear-gradient(135deg,#f8fbff,#edf5fc)] px-5 py-6 text-slate-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" aria-label="Couba home">
          <img src="/couba-logo.svg" alt="Couba" className="h-9 w-auto" />
        </Link>
        <p className="text-sm text-slate-600">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-blue-700">
            Log In
          </Link>
        </p>
      </header>

      <section className="mx-auto grid min-h-[78vh] max-w-6xl items-center gap-12 py-10 md:grid-cols-2">
        <div className="hidden md:block">
          <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/55 p-10 shadow-xl shadow-blue-900/5 backdrop-blur-2xl">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-200/50 blur-3xl" />
            <div className="relative">
              <span className="text-xs font-bold tracking-[0.22em] text-blue-700">
                JOIN COUBA
              </span>
              <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight tracking-tight">
                Start your crypto journey with Couba.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">
                Create your account interface and get ready to explore digital
                asset markets as Couba develops.
              </p>

              <div className="mt-10 space-y-3">
                {[
                  "Choose your registration method",
                  "Verify your contact details",
                  "Create your account password",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-white bg-white/70 p-4"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[420px] rounded-3xl border border-white/90 bg-white/80 p-6 shadow-xl shadow-blue-950/5 backdrop-blur-2xl sm:p-9">
          <h2 className="text-3xl font-semibold tracking-tight">
            {step === 1
              ? "Create account"
              : step === 2
                ? "Verify account"
                : "Set password"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {step === 1
              ? "Register with your email address or phone number."
              : step === 2
                ? "Confirm the contact details you entered."
                : "Choose a strong password for your account."}
          </p>

          <div className="mt-6 flex items-center gap-2">
            {[1, 2, 3].map((number) => (
              <div
                key={number}
                className={`h-1 flex-1 rounded-full ${
                  number <= step ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <>
              <div className="mt-7 flex gap-6 border-b border-slate-200">
                {(["Email", "Phone"] as Method[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setMethod(item);
                      setIdentity("");
                      setNotice("");
                    }}
                    className={`relative pb-3 text-sm font-medium ${
                      method === item ? "text-blue-700" : "text-slate-500"
                    }`}
                  >
                    {item}
                    {method === item && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-blue-600" />
                    )}
                  </button>
                ))}
              </div>

              <form onSubmit={continueRegistration} className="mt-6">
                <label className="mb-2 block text-sm font-medium">
                  {method === "Email" ? "Email address" : "Phone number"}
                </label>
                <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                  {method === "Phone" && (
                    <select
                      aria-label="Country calling code"
                      defaultValue="+234"
                      className="max-w-[100px] border-r border-slate-200 bg-slate-50 px-2 text-sm outline-none"
                    >
                      <option value="+234">🇳🇬 +234</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+91">🇮🇳 +91</option>
                    </select>
                  )}
                  <input
                    required
                    autoFocus
                    type={method === "Email" ? "email" : "tel"}
                    autoComplete={method === "Email" ? "email" : "tel"}
                    value={identity}
                    onChange={(event) => setIdentity(event.target.value)}
                    placeholder={
                      method === "Email"
                        ? "Enter email address"
                        : "Enter phone number"
                    }
                    className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm outline-none"
                  />
                </div>

                <label className="mb-2 mt-5 block text-sm font-medium">
                  Referral code <span className="font-normal text-slate-400">(Optional)</span>
                </label>
                <input
                  value={referral}
                  onChange={(event) => setReferral(event.target.value)}
                  placeholder="Enter referral code"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-slate-600">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(event) => setAccepted(event.target.checked)}
                    className="mt-1 accent-blue-600"
                  />
                  <span>
                    I have read and agree to Couba's{" "}
                    <span className="font-medium text-blue-700">
                      User Agreement
                    </span>{" "}
                    and{" "}
                    <span className="font-medium text-blue-700">
                      Privacy Policy
                    </span>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!accepted}
                  className="mt-5 w-full rounded-xl bg-[#1769d2] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <form onSubmit={verifyCode} className="mt-7">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setNotice("");
                }}
                className="mb-6 text-sm text-blue-700"
              >
                ← Back
              </button>

              <div className="rounded-xl bg-blue-50/80 p-3">
                <p className="text-xs text-slate-500">
                  Verification destination
                </p>
                <p className="mt-1 break-all text-sm font-medium">{identity}</p>
              </div>

              <label className="mb-2 mt-5 block text-sm font-medium">
                Verification code
              </label>
              <input
                required
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                pattern="[0-9]{6}"
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter 6-digit code"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-center text-lg tracking-[0.4em] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <p className="mt-3 text-xs leading-5 text-slate-500">
                This is a demonstration. No email or SMS verification code has
                been sent.
              </p>

              <button
                type="submit"
                className="mt-5 w-full rounded-xl bg-[#1769d2] px-4 py-3.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Continue
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={createAccount} className="mt-7">
              <button
                type="button"
                onClick={() => {
                  setStep(2);
                  setNotice("");
                }}
                className="mb-6 text-sm text-blue-700"
              >
                ← Back
              </button>

              <label className="mb-2 block text-sm font-medium">
                Password
              </label>
              <div className="flex rounded-xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <input
                  required
                  minLength={8}
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3.5 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-xs font-medium text-blue-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <label className="mb-2 mt-5 block text-sm font-medium">
                Confirm password
              </label>
              <div className="flex rounded-xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <input
                  required
                  autoComplete="new-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter password"
                  className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3.5 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="px-3 text-xs font-medium text-blue-700"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-[#1769d2] px-4 py-3.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Create Account
              </button>
            </form>
          )}

          {notice && (
            <p role="status" className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-800">
              {notice}
            </p>
          )}

          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-blue-700">
              Log In
            </Link>
          </p>

          <p className="mt-5 text-center text-xs leading-5 text-slate-400">
            Frontend demonstration. Account creation and verification are not
            connected.
          </p>
        </div>
      </section>

      <footer className="pb-3 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Couba · Digital assets involve risk
      </footer>
    </main>
  );
}
