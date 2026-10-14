"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type Method = "Email/Username" | "Phone" | "QR Code";

export default function LoginPage() {
  const [method, setMethod] = useState<Method>("Email/Username");
  const [step, setStep] = useState(1);
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  function continueAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setStep(2);
  }

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(
      "Couba authentication is not connected yet. No sign-in has occurred."
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_#e0f0ff,_transparent_50%),linear-gradient(135deg,#f8fbff,#edf5fc)] px-5 py-6 text-slate-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" aria-label="Couba home">
          <img src="/couba-logo.svg" alt="Couba" className="h-9 w-auto" />
        </Link>
        <div className="text-sm text-slate-600">
          No account?{" "}
          <Link href="/signup" className="font-semibold text-blue-700">
            Sign Up
          </Link>
        </div>
      </header>

      <section className="mx-auto grid min-h-[78vh] max-w-6xl items-center gap-12 py-10 md:grid-cols-2">
        <div className="hidden md:block">
          <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/55 p-10 shadow-xl shadow-blue-900/5 backdrop-blur-2xl">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-200/50 blur-3xl" />
            <div className="relative">
              <span className="text-xs font-bold tracking-[0.22em] text-blue-700">
                COUBA EXCHANGE
              </span>
              <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight tracking-tight">
                Welcome back to your crypto journey.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">
                Sign in to continue exploring digital asset markets on Couba.
              </p>

              <div className="mt-12 rounded-2xl border border-white bg-white/70 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                    ↗
                  </div>
                  <div>
                    <p className="font-semibold">Your market, your view</p>
                    <p className="mt-1 text-sm text-slate-500">
                      A clearer way to explore crypto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[420px] rounded-3xl border border-white/90 bg-white/80 p-6 shadow-xl shadow-blue-950/5 backdrop-blur-2xl sm:p-9">
          {method !== "QR Code" ? (
            <>
              <h2 className="text-3xl font-semibold tracking-tight">
                {step === 1 ? "Log In" : "Enter password"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {step === 1
                  ? "Welcome back to Couba."
                  : "Enter the password for your account."}
              </p>

              {step === 1 ? (
                <>
                  <div className="mt-7 flex gap-5 border-b border-slate-200">
                    {(["Email/Username", "Phone"] as Method[]).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setMethod(item);
                          setIdentity("");
                          setNotice("");
                        }}
                        className={`relative pb-3 text-sm font-medium ${
                          method === item
                            ? "text-blue-700"
                            : "text-slate-500"
                        }`}
                      >
                        {item}
                        {method === item && (
                          <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-blue-600" />
                        )}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setMethod("QR Code");
                        setNotice("");
                      }}
                      className="ml-auto pb-3 text-sm text-slate-500"
                    >
                      QR Code
                    </button>
                  </div>

                  <form onSubmit={continueAccount} className="mt-6">
                    <label className="mb-2 block text-sm font-medium">
                      {method === "Phone"
                        ? "Phone number"
                        : "Email address or username"}
                    </label>
                    <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                      {method === "Phone" && (
                        <select
                          aria-label="Country calling code"
                          className="max-w-[100px] border-r border-slate-200 bg-slate-50 px-2 text-sm outline-none"
                          defaultValue="+234"
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
                        type={method === "Phone" ? "tel" : "text"}
                        autoComplete="username"
                        value={identity}
                        onChange={(event) => setIdentity(event.target.value)}
                        placeholder={
                          method === "Phone"
                            ? "Enter phone number"
                            : "Email address or username"
                        }
                        className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-5 w-full rounded-xl bg-[#1769d2] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700"
                    >
                      Continue
                    </button>
                  </form>
                </>
              ) : (
                <form onSubmit={signIn} className="mt-7">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setPassword("");
                      setNotice("");
                    }}
                    className="mb-6 text-sm text-blue-700 hover:text-blue-800"
                  >
                    ← Back
                  </button>

                  <div className="mb-5 rounded-xl bg-blue-50/80 p-3">
                    <p className="text-xs text-slate-500">Signing in as</p>
                    <p className="mt-1 break-all text-sm font-medium">
                      {identity}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setPassword("");
                        setNotice("");
                      }}
                      className="mt-1 text-xs font-medium text-blue-700"
                    >
                      Change
                    </button>
                  </div>

                  <label className="mb-2 block text-sm font-medium">
                    Password
                  </label>
                  <div className="flex rounded-xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                    <input
                      required
                      autoFocus
                      autoComplete="current-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter password"
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

                  <div className="mt-3 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setNotice(
                          "Password recovery is not connected yet."
                        )
                      }
                      className="text-sm text-blue-700"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="mt-5 w-full rounded-xl bg-[#1769d2] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 hover:bg-blue-700"
                  >
                    Sign In
                  </button>
                </form>
              )}

              {notice && (
                <p role="status" className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-800">
                  {notice}
                </p>
              )}

              <p className="mt-7 text-center text-sm text-slate-500">
                New to Couba?{" "}
                <Link href="/signup" className="font-semibold text-blue-700">
                  Create an account
                </Link>
              </p>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMethod("Email/Username")}
                className="text-sm text-blue-700"
              >
                ← Back to login
              </button>
              <h2 className="mt-5 text-3xl font-semibold">QR Code Login</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Scan a QR code using the Couba mobile app. QR authentication
                is not connected yet.
              </p>
              <div className="mx-auto mt-8 flex h-48 w-48 items-center justify-center rounded-2xl border border-dashed border-blue-300 bg-blue-50/70">
                <span className="text-5xl text-blue-700">◇</span>
              </div>
              <p className="mt-5 text-center text-sm text-slate-500">
                QR login coming soon
              </p>
            </>
          )}
        </div>
      </section>

      <footer className="pb-3 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Couba · Digital assets involve risk
      </footer>
    </main>
  );
}
