import { useState, useRef, useEffect } from "react";
import { X, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export default function OTPModal() {
  const { showOtpModal, setShowOtpModal, otpEmail, verifyOTP, isLoading } = useAuth();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (showOtpModal && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [showOtpModal]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < 4; i++) {
        newOtp[i] = pastedData[i] || "";
      }
      setOtp(newOtp);
      const nextEmptyIndex = newOtp.findIndex((val) => !val);
      if (nextEmptyIndex > -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[3]?.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    
    if (otpValue.length !== 4) {
      setError("Please enter a 4-digit OTP");
      return;
    }

    setError("");
    const result = await verifyOTP(otpValue);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setShowOtpModal(false);
        setSuccess(false);
        setOtp(["", "", "", ""]);
      }, 1500);
    } else {
      setError(result.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  if (!showOtpModal) return null;

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
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2D4A3E]">Verify OTP</h2>
                <p className="text-sm text-[#6B7C72]">Enter the code sent to your email</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowOtpModal(false);
                setOtp(["", "", "", ""]);
                setError("");
              }}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5 text-[#2D4A3E]" />
            </button>
          </div>

          {/* Email Display */}
          <div className="bg-white/50 rounded-xl p-4 mb-6 flex items-center gap-3 border border-[#E8DFD0]">
            <Mail className="w-5 h-5 text-[#C8945C]" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#6B7C72]">Code sent to</p>
              <p className="text-sm font-semibold text-[#2D4A3E] truncate">{otpEmail}</p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/10 border-2 border-green-500 rounded-xl p-4 mb-6 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm font-semibold text-green-700">OTP verified successfully!</p>
            </motion.div>
          )}

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

          {/* OTP Input */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold border-2 border-[#E8DFD0] rounded-xl bg-white focus:border-[#C8945C] focus:outline-none transition-colors"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || otp.join("").length !== 4}
              className="w-full bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Verify OTP
                </>
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <p className="text-center text-sm text-[#6B7C72] mt-4">
            Didn't receive the code?{" "}
            <button
              onClick={() => {
                setOtp(["", "", "", ""]);
                setError("");
                inputRefs.current[0]?.focus();
              }}
              className="text-[#C8945C] font-semibold hover:underline"
            >
              Resend
            </button>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

