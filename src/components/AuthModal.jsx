import { useState, useEffect, useRef } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  KeyRound,
  RotateCcw,
  Sparkles,
  X,
  Loader2,
} from "lucide-react";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  // Views: "login" | "register" | "forgot_email" | "forgot_otp" | "forgot_newpass" | "reset_success"
  const [view, setView] = useState("login");

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Forgot password OTP flow
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Timers & cooldowns
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes OTP countdown
  const [resendCooldown, setResendCooldown] = useState(60); // 60s cooldown for resend button
  const otpInputRefs = useRef([]);

  // UI status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Reset internal states when modal closes or opens
  useEffect(() => {
    if (isOpen) {
      setErrorMsg("");
      setSuccessMsg("");
    } else {
      // Small timeout before resetting view so exit animation finishes cleanly
      const t = setTimeout(() => {
        setView("login");
        setErrorMsg("");
        setSuccessMsg("");
      }, 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // OTP Countdown Timer
  useEffect(() => {
    let interval = null;
    if (view === "forgot_otp" && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view, timerSeconds]);

  // Resend Cooldown Timer
  useEffect(() => {
    let interval = null;
    if (view === "forgot_otp" && resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view, resendCooldown]);

  if (!isOpen) return null;

  // Mask email for display: e.g. "priya.sharma@gmail.com" -> "p***a@gmail.com"
  const maskEmail = (email) => {
    if (!email) return "";
    const [userPart, domain] = email.split("@");
    if (!domain) return email;
    if (userPart.length <= 2) return `${userPart[0]}***@${domain}`;
    return `${userPart[0]}***${userPart[userPart.length - 1]}@${domain}`;
  };

  // Format seconds into MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ==========================================
  // HANDLERS
  // ==========================================

  // 1. Customer Sign In
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!loginPassword) {
      setErrorMsg("Please enter your account password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://multivendorstore-backend-3.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.trim().toLowerCase(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      // Store token & user in existing convention
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccessMsg(`Welcome back, ${data.user?.name?.split(" ")[0]}!`);
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
        onClose();
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Customer Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!regName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://multivendorstore-backend-3.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim().toLowerCase(),
          password: regPassword,
          role: "customer",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccessMsg("Account created successfully! You can now sign in.");
      setLoginEmail(regEmail.trim().toLowerCase());
      setLoginPassword("");
      setTimeout(() => {
        setView("login");
        setSuccessMsg("Account created! Please sign in with your password.");
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || "Unable to complete registration.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Step 1: Request Password Reset OTP
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const targetEmail = recoveryEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(targetEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://multivendorstore-backend-3.onrender.com/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Could not dispatch reset verification code.");
      }

      setOtpDigits(["", "", "", "", "", ""]);
      setTimerSeconds(600); // 10 minutes validity
      setResendCooldown(60); // 60s cooldown
      setView("forgot_otp");
      setSuccessMsg("Verification code dispatched to your registered email address.");
      setTimeout(() => {
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
        }
      }, 100);
    } catch (err) {
      setErrorMsg(err.message || "Failed to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  // 4. OTP Inputs Handling (auto-focus next, backspace support, paste support)
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-focus next input box
    if (value && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split("");
      setOtpDigits(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  // 5. Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://multivendorstore-backend-3.onrender.com/api/auth/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: recoveryEmail.trim().toLowerCase(),
          otp: fullOtp,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid or expired verification code.");
      }

      setResetToken(data.resetToken);
      setView("forgot_newpass");
      setSuccessMsg("Code verified! You may now create your new password.");
    } catch (err) {
      setErrorMsg(err.message || "Verification failed. Check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  // 6. Step 3: Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg("Passwords do not match. Please confirm your new password.");
      return;
    }
    if (!resetToken) {
      setErrorMsg("Reset session expired. Please restart the recovery flow.");
      setView("forgot_email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://multivendorstore-backend-3.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: recoveryEmail.trim().toLowerCase(),
          resetToken,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Unable to reset password.");
      }

      setView("reset_success");
      setLoginEmail(recoveryEmail.trim().toLowerCase());
      setLoginPassword("");
    } catch (err) {
      setErrorMsg(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E6E0D2] shadow-2xl overflow-hidden my-6 transition-all duration-300">
        
        {/* Brand Accent Top Stripe */}
        <div className="h-1.5 bg-linear-to-r from-[#174C3C] via-[#D5B779] to-[#174C3C]" />

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#68736C] hover:text-[#202824] hover:bg-[#E8EFE8] transition z-10"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header Brand Badge */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#174C3C] text-[#D5B779] flex items-center justify-center font-bold text-xs shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif-heading text-lg font-bold tracking-tight text-[#174C3C]">
                MarketNest<span className="text-[#D5B779]">.</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#A66B12] font-semibold ml-2">
                Customer Portal
              </span>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-[#C0392B] flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="flex-1 leading-snug">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#26734D] flex items-start space-x-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="flex-1 leading-snug">{successMsg}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW: 1. SIGN IN                                               */}
          {/* ============================================================== */}
          {view === "login" && (
            <div>
              <div className="mb-6">
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#174C3C]">
                  Welcome Back
                </h2>
                <p className="text-xs text-[#68736C] mt-1">
                  Sign in to continue your shopping journey.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#68736C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8F5EC] border border-[#E6E0D2] rounded-xl text-sm text-[#202824] focus:outline-none focus:border-[#174C3C] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824]">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#68736C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#F8F5EC] border border-[#E6E0D2] rounded-xl text-sm text-[#202824] focus:outline-none focus:border-[#174C3C] focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#68736C] hover:text-[#202824] transition"
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-right mt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setRecoveryEmail(loginEmail);
                        setErrorMsg("");
                        setSuccessMsg("");
                        setView("forgot_email");
                      }}
                      className="text-xs font-semibold text-[#A66B12] hover:text-[#174C3C] hover:underline transition"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#174C3C] hover:bg-[#0f3429] text-white font-bold text-sm transition mt-2 shadow-sm disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D5B779]" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4 text-[#D5B779] group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-[#F0ECE1] text-center text-xs text-[#68736C]">
                New to MarketNest?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setSuccessMsg("");
                    setView("register");
                  }}
                  className="font-bold text-[#174C3C] hover:underline"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW: 2. REGISTER                                             */}
          {/* ============================================================== */}
          {view === "register" && (
            <div>
              <div className="mb-6">
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#174C3C]">
                  Join MarketNest
                </h2>
                <p className="text-xs text-[#68736C] mt-1">
                  Create your account and discover products you&apos;ll love.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#68736C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Priya Sharma"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8F5EC] border border-[#E6E0D2] rounded-xl text-sm text-[#202824] focus:outline-none focus:border-[#174C3C] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#68736C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8F5EC] border border-[#E6E0D2] rounded-xl text-sm text-[#202824] focus:outline-none focus:border-[#174C3C] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#68736C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#F8F5EC] border border-[#E6E0D2] rounded-xl text-sm text-[#202824] focus:outline-none focus:border-[#174C3C] focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#68736C] hover:text-[#202824] transition"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#68736C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegConfirmPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#F8F5EC] border border-[#E6E0D2] rounded-xl text-sm text-[#202824] focus:outline-none focus:border-[#174C3C] focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#68736C] hover:text-[#202824] transition"
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {regPassword && regConfirmPassword && regPassword !== regConfirmPassword && (
                    <p className="text-[11px] text-[#C0392B] mt-1 font-medium">Passwords do not match.</p>
                  )}
                </div>

                <div className="p-3 bg-[#E8EFE8] rounded-xl text-[11px] text-[#174C3C] flex items-center space-x-2">
                  <Shield className="w-4 h-4 flex-shrink-0 text-[#26734D]" />
                  <span>Passwords are secured using salt-hashed encryption.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#174C3C] hover:bg-[#0f3429] text-white font-bold text-sm transition mt-2 shadow-sm disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D5B779]" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4 text-[#D5B779] group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-[#F0ECE1] text-center text-xs text-[#68736C]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setSuccessMsg("");
                    setView("login");
                  }}
                  className="font-bold text-[#174C3C] hover:underline"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW: 3. FORGOT PASSWORD - STEP 1 (REQUEST OTP)                */}
          {/* ============================================================== */}
          {view === "forgot_email" && (
            <div>
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setSuccessMsg("");
                    setView("login");
                  }}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-[#68736C] hover:text-[#174C3C] mb-2 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </button>
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#174C3C]">
                  Forgot Your Password?
                </h2>
                <p className="text-xs text-[#68736C] mt-1">
                  Enter your registered email address to receive a verification code.
                </p>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#68736C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8F5EC] border border-[#E6E0D2] rounded-xl text-sm text-[#202824] focus:outline-none focus:border-[#174C3C] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#F8F5EC] rounded-xl border border-[#E6E0D2] text-[11px] text-[#68736C]">
                  🔒 A secure 6-digit one-time password (OTP) will be sent to this email, valid for 10 minutes.
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#174C3C] hover:bg-[#0f3429] text-white font-bold text-sm transition shadow-sm disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D5B779]" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4 text-[#D5B779]" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-[#F0ECE1] text-center text-xs text-[#68736C]">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setSuccessMsg("");
                    setView("login");
                  }}
                  className="font-bold text-[#174C3C] hover:underline"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW: 4. FORGOT PASSWORD - STEP 2 (VERIFY OTP)                 */}
          {/* ============================================================== */}
          {view === "forgot_otp" && (
            <div>
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setSuccessMsg("");
                    setView("forgot_email");
                  }}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-[#68736C] hover:text-[#174C3C] mb-2 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#174C3C]">
                  Verify Your Email
                </h2>
                <p className="text-xs text-[#68736C] mt-1">
                  We sent a 6-digit verification code to{" "}
                  <strong className="text-[#202824]">{maskEmail(recoveryEmail)}</strong>.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {/* 6 Digit Input Group */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-2 text-center">
                    Enter 6-Digit Code
                  </label>
                  <div className="flex justify-between gap-1.5 sm:gap-2" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-[#F8F5EC] border-2 border-[#E6E0D2] rounded-xl text-[#174C3C] focus:border-[#174C3C] focus:bg-white focus:outline-none transition"
                      />
                    ))}
                  </div>
                </div>

                {/* Expiry & Resend Information */}
                <div className="flex items-center justify-between text-xs text-[#68736C] px-1">
                  <div className="flex items-center space-x-1">
                    <span>Code expires in:</span>
                    <span className="font-bold text-[#A66B12] font-mono">
                      {formatTime(timerSeconds)}
                    </span>
                  </div>

                  {resendCooldown > 0 ? (
                    <span className="text-[11px] text-[#68736C]">
                      Resend in {resendCooldown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRequestOtp()}
                      className="font-bold text-[#174C3C] hover:underline inline-flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Resend OTP</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otpDigits.join("").length !== 6 || timerSeconds === 0}
                  className="w-full py-3 rounded-full bg-[#174C3C] hover:bg-[#0f3429] text-white font-bold text-sm transition shadow-sm disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D5B779]" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <ArrowRight className="w-4 h-4 text-[#D5B779]" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW: 5. FORGOT PASSWORD - STEP 3 (NEW PASSWORD)               */}
          {/* ============================================================== */}
          {view === "forgot_newpass" && (
            <div>
              <div className="mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#26734D] flex items-center justify-center font-bold mb-3 border border-emerald-200">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#174C3C]">
                  Create New Password
                </h2>
                <p className="text-xs text-[#68736C] mt-1">
                  Choose a strong password to secure your MarketNest account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#68736C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#F8F5EC] border border-[#E6E0D2] rounded-xl text-sm text-[#202824] focus:outline-none focus:border-[#174C3C] focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#68736C] hover:text-[#202824] transition"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#68736C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#F8F5EC] border border-[#E6E0D2] rounded-xl text-sm text-[#202824] focus:outline-none focus:border-[#174C3C] focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#68736C] hover:text-[#202824] transition"
                    >
                      {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {newPassword && confirmNewPassword && newPassword !== confirmNewPassword && (
                    <p className="text-[11px] text-[#C0392B] mt-1 font-medium">Passwords do not match.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#174C3C] hover:bg-[#0f3429] text-white font-bold text-sm transition mt-2 shadow-sm disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D5B779]" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Save New Password</span>
                      <CheckCircle className="w-4 h-4 text-[#D5B779]" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW: 6. SUCCESS CONFIRMATION                                  */}
          {/* ============================================================== */}
          {view === "reset_success" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#E8EFE8] text-[#26734D] flex items-center justify-center font-bold mb-4 border border-[#26734D]/30 shadow-xs">
                <CheckCircle className="w-8 h-8" />
              </div>

              <h2 className="font-serif-heading text-2xl font-bold text-[#174C3C]">
                Password Reset Successful!
              </h2>
              <p className="text-xs text-[#68736C] mt-2 mb-6 max-w-xs mx-auto leading-relaxed">
                Your MarketNest account credentials have been updated securely. You can now sign in with your new password.
              </p>

              <button
                type="button"
                onClick={() => {
                  setErrorMsg("");
                  setSuccessMsg("");
                  setView("login");
                }}
                className="w-full py-3 rounded-full bg-[#174C3C] hover:bg-[#0f3429] text-white font-bold text-sm transition shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Back to Sign In</span>
                <ArrowRight className="w-4 h-4 text-[#D5B779]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
