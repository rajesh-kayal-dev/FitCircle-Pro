import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ArrowRight, Loader2, ChevronLeft, Shield, Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Logo } from "../../app/components/Logo";
import { useAuth } from "../../context/AuthContext";


const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* ── Google SVG ─────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <g fill="none">
        <path d="M17.64 9.2a10.34 10.34 0 00-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.258h2.908C16.658 14.252 17.64 11.946 17.64 9.2z" fill="#4285F4" />
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
        <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
      </g>
    </svg>
  );
}


/* ── OTP Boxes ──────────────────────────────────────────────── */
function OTPBoxes({ otp, setOtp, onComplete, disabled }) {
  const inputRefs = useRef([]);

  const handleChange = (e, i) => {
    const val = e.target.value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
    if (newOtp.every((d) => d !== "")) onComplete(newOtp.join(""));
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      if (!otp[i] && i > 0) {
        const newOtp = [...otp];
        newOtp[i - 1] = "";
        setOtp(newOtp);
        inputRefs.current[i - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    if (newOtp.every((d) => d !== "")) onComplete(newOtp.join(""));
  };

  return (
    <div className="flex gap-2.5 justify-center">
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          autoFocus={i === 0}
          className={[
            "w-11 h-14 text-center text-xl font-bold rounded-2xl border-2 transition-all outline-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            digit
              ? "border-[#F97316] bg-orange-50 text-[#F97316]"
              : "border-gray-200 bg-white text-gray-900 focus:border-[#F97316] focus:bg-orange-50/30",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

/* ── Slide animation config ─────────────────────────────────── */
const slideVariants = {
  enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d < 0 ? "100%" : "-100%", opacity: 0 }),
};
const slideTransition = { duration: 0.32, ease: [0.4, 0, 0.2, 1] };

/* ── Main Login Component ──────────────────────────────────── */
export function Login() {
  const [step, setStep] = useState(0); // 0 = email, 1 = otp
  const [direction, setDirection] = useState(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { sendOTP, verifyOTP, loginWithGoogle, isAuthenticated, user } = useAuth();

  /* redirect if already logged in handled by RequireNoAuth in routes.jsx */

  /* countdown */
  useEffect(() => {
    if (step !== 1 || timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [step, timer]);

  const goTo = (nextStep) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  };

  /* ── Email submit ── */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      await sendOTP(email);
      toast.success("OTP sent successfully to your email");
      setTimer(30);
      setOtp(["", "", "", "", "", ""]);
      goTo(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── OTP complete ── */
  const handleOTPComplete = useCallback(
    async (otpValue) => {
      if (loading) return;
      setLoading(true);
      try {
        const { isNewUser } = await verifyOTP(email, otpValue);
        toast.success("Welcome to FitCircle! 🎉");
        // isNewUser = true means not onboarded → go to onboarding
        // isNewUser = false means onboarded → go to home
        navigate(isNewUser ? "/onboarding" : "/home", { replace: true });
      } catch (err) {
        toast.error(err.response?.data?.message || "Invalid or expired code.");
        setOtp(["", "", "", "", "", ""]);
      } finally {
        setLoading(false);
      }
    },
    [loading, verifyOTP, email, navigate]
  );

  /* ── Resend OTP ── */
  const handleResend = async () => {
    if (timer > 0 || loading) return;
    setLoading(true);
    try {
      await sendOTP(email);
      setTimer(30);
      setOtp(["", "", "", "", "", ""]);
      toast.success("New code sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Google login ── */
  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    try {
      const result = await loginWithGoogle(response.access_token);

      if (result?.otpSent) {
        setEmail(result.email || "");
        setTimer(30);
        setOtp(["", "", "", "", "", ""]);
        goTo(1);
      } else {
        navigate(result?.isNewUser ? "/onboarding" : "/home", { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in failed.");
  };

  const loginWithGoogleFlow = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-orange-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-orange-50/80 blur-3xl" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Logo size="md" />
          <p className="mt-3 text-xl font-black text-gray-900 tracking-tight">
            FitCircle <span className="text-[#F97316]">Pro</span>
          </p>
        </div>

        {/* Sliding steps */}
        <div className="overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            {step === 0 && (
              <motion.div
                key="email-step"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
              >
                {/* ── Step 0: Email ── */}
                <div className="text-center mb-8">
                  <h1 className="text-[1.6rem] font-black text-gray-900 leading-tight mb-2">
                    Welcome to FitCircle
                  </h1>
                  <p className="text-gray-500 text-sm">Enter your email to continue</p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <div
                      className={[
                        "flex items-center gap-3 bg-white border-2 rounded-2xl px-4 py-3 transition-all",
                        emailError
                          ? "border-red-300"
                          : "border-gray-200 focus-within:border-[#F97316]",
                      ].join(" ")}
                    >
                      <Mail size={18} className="text-gray-400 shrink-0" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError("");
                        }}
                        placeholder="you@email.com"
                        autoFocus
                        className="flex-1 outline-none text-sm text-gray-900 placeholder:text-gray-400 bg-transparent"
                      />
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1">{emailError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full h-12 bg-[#F97316] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:bg-orange-500 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        Continue <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  {/* admin link removed from here; placed below Google button */}
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Google */}
                <button
                  type="button"
                  onClick={() => loginWithGoogleFlow()}
                  disabled={loading}
                  className="w-full h-12 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl flex items-center justify-center gap-3 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all text-sm disabled:opacity-60"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                {/* Small admin link (placed under Google) */}
                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => navigate('/admin-login')}
                    className="text-xs text-gray-500 hover:text-gray-700 underline-offset-2 hover:underline"
                  >
                    Continue with admin login
                  </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
                  By continuing, you agree to our{" "}
                  <span className="text-[#F97316] cursor-pointer font-medium">Terms</span> &{" "}
                  <span className="text-[#F97316] cursor-pointer font-medium">Privacy Policy</span>
                </p>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="otp-step"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
              >
                {/* ── Step 1: OTP ── */}
                <div className="text-center mb-8">
                  <button
                    type="button"
                    onClick={() => goTo(0)}
                    className="inline-flex items-center gap-1 text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors mb-5"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                  <h1 className="text-[1.6rem] font-black text-gray-900 leading-tight mb-2">
                    Verify your email
                  </h1>
                  <p className="text-gray-500 text-sm">We sent a 6-digit code to</p>
                  <p className="text-gray-800 font-semibold text-sm mt-1 truncate">{email}</p>
                </div>

                <div className="space-y-6">
                  <OTPBoxes
                    otp={otp}
                    setOtp={setOtp}
                    onComplete={handleOTPComplete}
                    disabled={loading}
                  />

                  {loading && (
                    <div className="flex justify-center">
                      <Loader2 size={20} className="animate-spin text-[#F97316]" />
                    </div>
                  )}

                  {/* Timer / Resend */}
                  <div className="text-center">
                    {timer > 0 ? (
                      <p className="text-sm text-gray-400">
                        Resend code in{" "}
                        <span className="text-[#F97316] font-bold tabular-nums">{timer}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={loading}
                        className="text-sm text-[#F97316] font-bold hover:underline disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>


                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
