import React, { useEffect, useState } from "react";
import { assets } from "../../../assets/assets";
import toast from "react-hot-toast";
import { useAppContext } from "../../../context/AppContext";

const Login = () => {
  // Global States
  const { setshowUserLogin, navigate, axios, setUser } = useAppContext();

  // Mode: 'LOGIN', 'SIGNUP', 'VERIFY_EMAIL', 'FORGOT_PASS', 'VERIFY_RESET', 'RESET_PASS'
  const [mode, setMode] = useState("LOGIN");

  // Form Data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // For Login / Signup
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(""); // For Email Verify / Password Reset
  const [newPassword, setNewPassword] = useState(""); // For Reset
  const [resetToken, setResetToken] = useState(""); // Token from verify-reset-otp

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- HANDLERS ---

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/login", { email, password });
      if (data.success) {
        toast.success("Logged in successfully");
        setUser(data.user);
        setshowUserLogin(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/register", { name, email, password });
      if (data.success) {
        toast.success(data.message);
        setMode("VERIFY_EMAIL"); // Move to validation
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/verify-email", { email, otp });
      if (data.success) {
        toast.success(data.message);
        setMode("LOGIN");
        setOtp("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/forgot-password", { email });
      if (data.success) {
        toast.success(data.message);
        setMode("VERIFY_RESET");
      } else {
        // Security: usually we don't say prompt failure, but for own UI:
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Request failed");
    }
  };

  const handleVerifyResetOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/verify-reset-otp", { email, otp });
      if (data.success) {
        toast.success(data.message);
        setResetToken(data.resetToken); // Save token for next step
        setMode("RESET_PASS");
        setOtp("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Verification failed");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/reset-password", { email, newPassword, resetToken });
      if (data.success) {
        toast.success(data.message);
        setMode("LOGIN");
        setPassword("");
        setNewPassword("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Reset failed");
    }
  };


  // --- RENDER HELPERS ---

  const renderTitle = () => {
    switch (mode) {
      case "LOGIN": return "Login";
      case "SIGNUP": return "Create Account";
      case "VERIFY_EMAIL": return "Verify Email";
      case "FORGOT_PASS": return "Forgot Password";
      case "VERIFY_RESET": return "Enter Reset OTP";
      case "RESET_PASS": return "New Password";
      default: return "Login";
    }
  };

  const renderContent = () => {
    return (
      <div className="space-y-4">

        {/* NAME Input (Signup only) */}
        {mode === "SIGNUP" && (
          <div className="border hover:border-primary border-gray-400 rounded-md px-3 py-2 flex items-center gap-2">
            <span className="text-gray-500">👤</span>
            <input
              className="outline-none w-full"
              type="text" placeholder="Full Name"
              value={name} onChange={e => setName(e.target.value)} required
            />
          </div>
        )}

        {/* EMAIL Input (All modes except Reset Pass step) */}
        {mode !== "RESET_PASS" && (
          <div className="border hover:border-primary border-gray-400 rounded-md px-3 py-2 flex items-center gap-2">
            <span className="text-gray-500">✉️</span>
            <input
              className="outline-none w-full"
              type="email" placeholder="Email Address"
              value={email} onChange={e => setEmail(e.target.value)}
              disabled={mode === 'VERIFY_EMAIL' || mode === 'VERIFY_RESET'}
              required
            />
          </div>
        )}

        {/* PASSWORD Input (Login & Signup) */}
        {(mode === "LOGIN" || mode === "SIGNUP") && (
          <div className="border hover:border-primary border-gray-400 rounded-md px-3 py-2 flex items-center gap-2">
            <span className="text-gray-500">🔑</span>
            <input
              className="outline-none w-full"
              type="password" placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)} required
            />
          </div>
        )}

        {/* OTP Input (Verify Email or Verify Reset) */}
        {(mode === "VERIFY_EMAIL" || mode === "VERIFY_RESET") && (
          <div className="border hover:border-primary border-gray-400 rounded-md px-3 py-2 flex items-center gap-2">
            <span className="text-gray-500">🔢</span>
            <input
              className="outline-none w-full"
              type="text" placeholder="Enter 6-digit OTP"
              value={otp} onChange={e => setOtp(e.target.value)} required
            />
          </div>
        )}

        {/* NEW PASSWORD Input (Reset Pass) */}
        {mode === "RESET_PASS" && (
          <div className="border hover:border-primary border-gray-400 rounded-md px-3 py-2 flex items-center gap-2">
            <span className="text-gray-500">🔒</span>
            <input
              className="outline-none w-full"
              type="password" placeholder="New Password"
              value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8}
            />
          </div>
        )}

        {/* FORGOT LINK (Login only) */}
        {mode === "LOGIN" && (
          <div className="text-right">
            <span className="text-sm text-blue-600 cursor-pointer hover:underline" onClick={() => setMode("FORGOT_PASS")}>
              Forgot Password?
            </span>
          </div>
        )}

        {/* MAIN BUTTON */}
        <button type="submit" className="bg-primary hover:bg-primary-dull transition w-full text-white py-2 rounded-md font-medium">
          {mode === "LOGIN" ? "Login" :
            mode === "SIGNUP" ? "Sign Up" :
              mode === "VERIFY_EMAIL" || mode === "VERIFY_RESET" ? "Verify OTP" :
                mode === "FORGOT_PASS" ? "Send OTP" :
                  "Reset Password"}
        </button>


        {/* TOGLLE LOGIN/SIGNUP */}
        {(mode === "LOGIN" || mode === "SIGNUP") && (
          <p className="text-sm text-center mt-4">
            {mode === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
            <span className="text-primary cursor-pointer font-medium hover:underline"
              onClick={() => {
                setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
                setEmail(""); setPassword(""); setName("");
              }}
            >
              {mode === 'LOGIN' ? 'Sign Up' : 'Login'}
            </span>
          </p>
        )}

        {/* BACK TO LOGIN (Forgot/Verify modes) */}
        {(mode === "FORGOT_PASS" || mode === "VERIFY_EMAIL" || mode === "VERIFY_RESET") && (
          <p className="text-sm text-center mt-4 text-gray-500 cursor-pointer hover:underline" onClick={() => setMode("LOGIN")}>
            Back to Login
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form onSubmit={(e) => {
        if (mode === "LOGIN") handleLogin(e);
        else if (mode === "SIGNUP") handleSignup(e);
        else if (mode === "VERIFY_EMAIL") handleVerifyEmail(e);
        else if (mode === "FORGOT_PASS") handleForgotPassword(e);
        else if (mode === "VERIFY_RESET") handleVerifyResetOtp(e);
        else if (mode === "RESET_PASS") handleResetPassword(e);
      }} className="relative bg-white p-10 rounded-xl text-slate-500 max-w-md w-full">

        <h1 className="text-center text-2xl text-neutral-700 font-medium mb-2">{renderTitle()}</h1>
        <p className="text-sm text-center mb-6">Welcome to Nandan Foods</p>

        {renderContent()}

        <img
          onClick={() => setshowUserLogin(false)}
          src={assets.remove_icon}
          className="absolute top-5 right-5 w-4 cursor-pointer"
          alt="close"
        />
      </form>
    </div>
  );
};

export default Login;
