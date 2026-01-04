import { useState } from "react";
import { X, Mail, User, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, sendOTP, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Regular user - use OTP
    const result = await sendOTP(email, name);
    if (!result.success) {
      setError(result.message || "Failed to send OTP. Please try again.");
    }
  };

  if (!showLoginModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gradient-to-br from-[#FAF7F2] to-[#F8F2EC] rounded-2xl p-6 sm:p-8 max-w-md w-full border-2 border-[#E8DFD0] shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#C8945C] rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2D4A3E]">Get Started</h2>
                <p className="text-sm text-[#6B7C72]">We'll send you an OTP to continue</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowLoginModal(false);
                setEmail("");
                setName("");
                setError("");
              }}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5 text-[#2D4A3E]" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border-2 border-red-500 rounded-xl p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2D4A3E] mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2D4A3E] mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send OTP
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#6B7C72] mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

