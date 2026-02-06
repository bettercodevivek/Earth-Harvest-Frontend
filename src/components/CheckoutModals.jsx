import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, MapPin, Lock, CheckCircle, Package, Truck, CreditCard, Shield, Award, 
  Sparkles, ChevronRight, AlertCircle, Loader2, Mail, Phone, Building2,
  Navigation, Globe, FileText, Clock, Star, Gift, ArrowLeft, ArrowRight
} from "lucide-react";

export default function PremiumCheckout({
  product,
  productId, // Direct productId prop as fallback
  selectedSize,
  quantity,
  currentPrice,
  address,
  setAddress,
  onClose,
  onPayNow,
  orderId, // Pass orderId if available
}) {
  const [step, setStep] = useState("summary");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [email, setEmail] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const totalAmount = (currentPrice?.price || 0) * quantity;
  const savings = ((currentPrice?.oldPrice || 0) - (currentPrice?.price || 0)) * quantity;
  const subtotal = totalAmount;
  const shipping = 0; // Free shipping
  const finalTotal = subtotal + shipping;

  const steps = [
    { id: "summary", label: "Review", icon: Package },
    { id: "address", label: "Delivery", icon: MapPin },
    { id: "payment", label: "Payment", icon: Lock }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Validation functions
  const validateSummary = () => {
    return true; // Summary step is always valid
  };

  const validateAddress = () => {
    const newErrors = {};
    
    if (!address.name || address.name.trim().length < 2) {
      newErrors.name = "Please enter your full name";
    }
    
    // Normalize phone number (remove spaces) before validation
    const normalizedPhone = address.phone ? address.phone.replace(/\s+/g, '') : '';
    if (!normalizedPhone || !/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(normalizedPhone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!address.street || address.street.trim().length < 5) {
      newErrors.street = "Please enter a complete street address";
    }
    
    if (!address.city || address.city.trim().length < 2) {
      newErrors.city = "Please enter your city";
    }
    
    if (!address.state || address.state.trim().length < 2) {
      newErrors.state = "Please enter your state/emirate";
    }
    
    if (!address.country || address.country.trim().length < 2) {
      newErrors.country = "Please enter your country";
    }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    if (!agreeToTerms) {
      setErrors({ ...errors, terms: "Please agree to the terms and conditions" });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === "summary") {
      setStep("address");
    } else if (step === "address") {
      if (validateAddress()) {
        setStep("payment");
      }
    }
  };

  const handleBack = () => {
    if (step === "address") {
      setStep("summary");
    } else if (step === "payment") {
      setStep("address");
    }
  };

  const handleCompletePayment = async () => {
    if (!validatePayment()) return;
    
    setIsSubmitting(true);
    try {
      // Normalize phone number (remove spaces) before storing
      const normalizedPhone = address.phone ? address.phone.replace(/\s+/g, '') : address.phone;
      // Update address with email and normalized phone
      const completeAddress = {
        ...address,
        phone: normalizedPhone, // Use normalized phone (spaces removed)
        email: email,
        deliveryInstructions: deliveryInstructions
      };
      setAddress(completeAddress);
      
      await onPayNow();
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-end sm:items-center justify-center sm:p-6 lg:p-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ 
          scale: isMobile ? 1 : 0.95, 
          opacity: 0, 
          y: isMobile ? "100%" : 20 
        }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0 
        }}
        exit={{ 
          scale: isMobile ? 1 : 0.95, 
          opacity: 0, 
          y: isMobile ? "100%" : 20 
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300
        }}
        className="w-full sm:max-w-2xl lg:max-w-3xl bg-white rounded-t-2xl sm:rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[#E8DFD0] max-h-[85vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Premium Corporate Header */}
        <div className="relative bg-[#2D4A3E] px-5 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 border-b border-[#2D4A3E]/20">

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#C8945C] rounded-lg flex items-center justify-center shadow-sm">
                {React.createElement(steps[currentStepIndex].icon, { className: "w-6 h-6 sm:w-7 sm:h-7 text-white" })}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 tracking-tight">
                  {step === "summary" && "Order Summary"}
                  {step === "address" && "Delivery Information"}
                  {step === "payment" && "Secure Checkout"}
                </h2>
                <p className="text-white/70 text-xs sm:text-sm font-medium tracking-wide">
                  Step {currentStepIndex + 1} of {steps.length}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center group border border-white/10"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* Premium Progress Steps */}
          <div className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4">
            {steps.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-2 flex-1">
                  <div className={`flex items-center gap-2 flex-1 ${idx <= currentStepIndex ? 'opacity-100' : 'opacity-50'}`}>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all ${
                      idx < currentStepIndex 
                        ? 'bg-[#C8945C] text-white shadow-sm' 
                        : idx === currentStepIndex 
                        ? 'bg-[#C8945C] text-white shadow-sm ring-2 ring-[#C8945C]/30' 
                        : 'bg-white/10 text-white/50 border border-white/20'
                    }`}>
                      {idx < currentStepIndex ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <span className="font-semibold text-xs sm:text-sm">{idx + 1}</span>
                      )}
                    </div>
                    <span className="text-white font-medium text-xs sm:text-sm hidden sm:block tracking-wide">{s.label}</span>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-px transition-all ${
                    idx < currentStepIndex ? 'bg-[#C8945C]' : 'bg-white/20'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Premium Content Area */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 lg:px-8 py-6 sm:py-8 bg-[#FAF7F2]">
          <AnimatePresence mode="wait">
            {/* SUMMARY STEP */}
            {step === "summary" && (
              <motion.div
                key="summary"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Premium Product Card */}
                <div className="relative bg-white rounded-xl p-6 sm:p-8 border border-[#E8DFD0] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden group hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-all">
                  
                  <div className="relative flex gap-3 sm:gap-4 lg:gap-6">
                    <div className="relative flex-shrink-0">
                      <img
                        src={product.images?.[0] || product.image}
                        className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-lg border border-[#E8DFD0] object-cover shadow-sm group-hover:scale-[1.02] transition-transform"
                        alt={product.name}
                      />
                      <div className="absolute -top-2 -right-2 bg-[#2D4A3E] text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 tracking-wide">
                        <Star className="w-3 h-3 fill-white" />
                        Premium
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#2D4A3E] mb-3 sm:mb-4 tracking-tight">{product.name || product.productName}</h3>
                      <div className="space-y-2 mb-4 sm:mb-5">
                        <div className="flex items-center gap-2.5 text-sm text-[#6B7C72]">
                          <Package className="w-4 h-4 text-[#C8945C]" />
                          <span>Size: <span className="font-semibold text-[#2D4A3E]">{selectedSize}g</span></span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-[#6B7C72]">
                          <Sparkles className="w-4 h-4 text-[#C8945C]" />
                          <span>Quantity: <span className="font-semibold text-[#2D4A3E]">{quantity}</span></span>
                        </div>
                      </div>
                      
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2D4A3E] tracking-tight">AED {currentPrice.price.toFixed(2)}</span>
                        {currentPrice.oldPrice && (
                          <>
                            <span className="text-base sm:text-lg lg:text-xl text-[#6B7C72] line-through font-light">AED {currentPrice.oldPrice.toFixed(2)}</span>
                            <span className="text-xs sm:text-sm font-semibold text-white bg-[#2D4A3E] px-3 py-1 rounded-lg tracking-wide">
                              {Math.round(((currentPrice.oldPrice - currentPrice.price) / currentPrice.oldPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Savings Banner */}
                {savings > 0 && (
                  <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#2D4A3E] rounded-xl p-5 sm:p-6 text-white shadow-[0_4px_16px_rgba(45,74,62,0.2)] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#C8945C]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-[#C8945C]" />
                      </div>
                      <div>
                        <p className="font-semibold text-base sm:text-lg tracking-wide">You're Saving</p>
                        <p className="text-sm text-white/70 mt-0.5">Premium quality at an incredible price</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl sm:text-3xl font-bold tracking-tight">AED {savings.toFixed(2)}</p>
                      <p className="text-xs sm:text-sm text-white/70 mt-0.5">Off regular price</p>
                    </div>
                  </motion.div>
                )}

                {/* Premium Order Summary */}
                <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E8DFD0] shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                  <h3 className="font-bold text-[#2D4A3E] text-lg sm:text-xl mb-5 sm:mb-6 flex items-center gap-2.5 tracking-tight">
                    <CreditCard className="w-5 h-5 text-[#C8945C]" />
                    Order Summary
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-[#E8DFD0]">
                      <span className="text-[#6B7C72] text-sm sm:text-base">Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'})</span>
                      <span className="font-semibold text-[#2D4A3E] text-base sm:text-lg">AED {subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-[#E8DFD0]">
                      <div className="flex items-center gap-2.5">
                        <Truck className="w-5 h-5 text-[#C8945C]" />
                        <span className="text-[#6B7C72] text-sm sm:text-base">Express Shipping</span>
                      </div>
                      <span className="font-semibold text-[#10B981] text-base sm:text-lg">FREE</span>
                    </div>

                    <div className="bg-[#FAF7F2] rounded-lg p-5 sm:p-6 border border-[#E8DFD0]">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#2D4A3E] text-lg sm:text-xl tracking-tight">Total Amount</span>
                        <span className="font-bold text-[#2D4A3E] text-2xl sm:text-3xl tracking-tight">
                          AED {finalTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Trust Badges */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { icon: Shield, title: "Secure", desc: "256-bit SSL" },
                    { icon: Truck, title: "Fast", desc: "2-3 Days" },
                    { icon: Award, title: "Premium", desc: "Quality" }
                  ].map((badge, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 sm:p-5 border border-[#E8DFD0] text-center hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all">
                      <badge.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8945C] mx-auto mb-2.5" />
                      <p className="text-xs sm:text-sm font-semibold text-[#2D4A3E] tracking-wide">{badge.title}</p>
                      <p className="text-xs text-[#6B7C72] mt-1">{badge.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ADDRESS STEP */}
            {step === "address" && (
              <motion.div
                key="address"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Premium Delivery Info Banner */}
                <div className="bg-[#FAF7F2] border border-[#E8DFD0] rounded-xl p-5 sm:p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#C8945C]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="w-6 h-6 text-[#C8945C]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2D4A3E] mb-1.5 text-base sm:text-lg tracking-tight">Fast & Free Delivery</h4>
                    <p className="text-sm text-[#6B7C72] leading-relaxed">
                      We deliver across UAE. Your premium dog chews will arrive in 2-3 business days with express shipping.
                    </p>
                  </div>
                </div>

                {/* Premium Contact Information */}
                <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E8DFD0] shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                  <h3 className="font-bold text-[#2D4A3E] text-lg sm:text-xl mb-5 sm:mb-6 flex items-center gap-2.5 tracking-tight">
                    <Mail className="w-5 h-5 text-[#C8945C]" />
                    Contact Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#2D4A3E] mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={address.name || ""}
                          onChange={(e) => {
                            setAddress({ ...address, name: e.target.value });
                            if (errors.name) setErrors({ ...errors, name: null });
                          }}
                          className={`w-full border ${errors.name ? 'border-red-400' : 'border-[#E8DFD0]'} p-3 sm:p-4 rounded-lg bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none focus:ring-1 focus:ring-[#C8945C]/20 transition-all text-sm sm:text-base`}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#2D4A3E] mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7C72]" />
                          <input
                            type="tel"
                            placeholder="+971 50 123 4567"
                            value={address.phone || ""}
                            onChange={(e) => {
                              setAddress({ ...address, phone: e.target.value });
                              if (errors.phone) setErrors({ ...errors, phone: null });
                            }}
                            className={`w-full border ${errors.phone ? 'border-red-400' : 'border-[#E8DFD0]'} pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none focus:ring-1 focus:ring-[#C8945C]/20 transition-all text-sm sm:text-base`}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#2D4A3E] mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7C72]" />
                          <input
                            type="email"
                            placeholder="john.doe@example.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) setErrors({ ...errors, email: null });
                            }}
                            className={`w-full border-2 ${errors.email ? 'border-red-400' : 'border-[#E8DFD0]'} pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none transition-colors text-sm sm:text-base`}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Shipping Address */}
                <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E8DFD0] shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                  <h3 className="font-bold text-[#2D4A3E] text-lg sm:text-xl mb-5 sm:mb-6 flex items-center gap-2.5 tracking-tight">
                    <MapPin className="w-5 h-5 text-[#C8945C]" />
                    Shipping Address
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#2D4A3E] mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7C72]" />
                        <input
                          type="text"
                          placeholder="Building name, street name, apartment/villa number"
                          value={address.street || ""}
                          onChange={(e) => {
                            setAddress({ ...address, street: e.target.value });
                            if (errors.street) setErrors({ ...errors, street: null });
                          }}
                          className={`w-full border ${errors.street ? 'border-red-400' : 'border-[#E8DFD0]'} pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none focus:ring-1 focus:ring-[#C8945C]/20 transition-all text-sm sm:text-base`}
                        />
                        {errors.street && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.street}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#2D4A3E] mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Navigation className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7C72]" />
                          <input
                            type="text"
                            placeholder="Dubai"
                            value={address.city || ""}
                            onChange={(e) => {
                              setAddress({ ...address, city: e.target.value });
                              if (errors.city) setErrors({ ...errors, city: null });
                            }}
                            className={`w-full border-2 ${errors.city ? 'border-red-400' : 'border-[#E8DFD0]'} pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none transition-colors text-sm sm:text-base`}
                          />
                          {errors.city && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.city}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#2D4A3E] mb-2">
                          State/Emirate <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7C72]" />
                          <input
                            type="text"
                            placeholder="Dubai"
                            value={address.state || ""}
                            onChange={(e) => {
                              setAddress({ ...address, state: e.target.value });
                              if (errors.state) setErrors({ ...errors, state: null });
                            }}
                            className={`w-full border-2 ${errors.state ? 'border-red-400' : 'border-[#E8DFD0]'} pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none transition-colors text-sm sm:text-base`}
                          />
                          {errors.state && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.state}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#2D4A3E] mb-2">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7C72]" />
                          <input
                            type="text"
                            placeholder="United Arab Emirates"
                            value={address.country || "United Arab Emirates"}
                            onChange={(e) => {
                              setAddress({ ...address, country: e.target.value });
                              if (errors.country) setErrors({ ...errors, country: null });
                            }}
                            className={`w-full border-2 ${errors.country ? 'border-red-400' : 'border-[#E8DFD0]'} pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none transition-colors text-sm sm:text-base`}
                          />
                          {errors.country && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.country}
                            </p>
                          )}
                        </div>
                      </div>

                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#2D4A3E] mb-2">
                        Delivery Instructions (Optional)
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-4 w-5 h-5 text-[#6B7C72]" />
                        <textarea
                          placeholder="Any special delivery instructions? (e.g., Leave at door, Call before delivery, etc.)"
                          value={deliveryInstructions}
                          onChange={(e) => setDeliveryInstructions(e.target.value)}
                          rows={3}
                          className="w-full border border-[#E8DFD0] pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none focus:ring-1 focus:ring-[#C8945C]/20 transition-all text-sm sm:text-base resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PAYMENT STEP */}
            {step === "payment" && (
              <motion.div
                key="payment"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Premium Secure Payment Header */}
                <div className="bg-[#2D4A3E] rounded-xl p-6 sm:p-8 text-white shadow-[0_4px_16px_rgba(45,74,62,0.2)]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-[#C8945C]/20 rounded-lg flex items-center justify-center">
                      <Lock className="w-7 h-7 text-[#C8945C]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl sm:text-2xl tracking-tight">Secure Payment</h4>
                      <p className="text-sm text-white/70 mt-1">Powered by Nomod • Bank-level encryption</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-5 sm:p-6 border border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white/90 text-base sm:text-lg font-medium">Total Amount</span>
                      <span className="text-3xl sm:text-4xl font-bold tracking-tight">AED {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Premium Payment Security Features */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white rounded-lg p-5 border border-[#E8DFD0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all">
                    <Shield className="w-7 h-7 text-[#C8945C] mb-3" />
                    <p className="font-semibold text-[#2D4A3E] text-sm mb-1 tracking-wide">256-bit SSL</p>
                    <p className="text-xs text-[#6B7C72]">Bank-grade encryption</p>
                  </div>
                  <div className="bg-white rounded-lg p-5 border border-[#E8DFD0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all">
                    <CheckCircle className="w-7 h-7 text-[#C8945C] mb-3" />
                    <p className="font-semibold text-[#2D4A3E] text-sm mb-1 tracking-wide">PCI Compliant</p>
                    <p className="text-xs text-[#6B7C72]">Secure transactions</p>
                  </div>
                </div>

                {/* Premium Order Review */}
                <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E8DFD0] shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                  <h4 className="font-bold text-[#2D4A3E] mb-4 sm:mb-5 text-lg sm:text-xl flex items-center gap-2.5 tracking-tight">
                    <Package className="w-5 h-5 text-[#C8945C]" />
                    Order Review
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7C72]">Product</span>
                      <span className="font-semibold text-[#2D4A3E] text-right max-w-[60%]">{product.name || product.productName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7C72]">Size</span>
                      <span className="font-semibold text-[#2D4A3E]">{selectedSize}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7C72]">Quantity</span>
                      <span className="font-semibold text-[#2D4A3E]">{quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7C72]">Delivery to</span>
                      <span className="font-semibold text-[#2D4A3E] text-right max-w-[60%]">
                        {address.street ? `${address.street}, ${address.city}` : "..."}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-[#E8DFD0]">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#2D4A3E] text-lg sm:text-xl tracking-tight">Total</span>
                        <span className="font-bold text-[#2D4A3E] text-2xl sm:text-3xl tracking-tight">AED {finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Terms & Conditions */}
                <div className="bg-white rounded-lg p-5 sm:p-6 border border-[#E8DFD0] shadow-sm">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => {
                        setAgreeToTerms(e.target.checked);
                        if (errors.terms) setErrors({ ...errors, terms: null });
                      }}
                      className="mt-1 w-5 h-5 rounded border border-[#E8DFD0] text-[#C8945C] focus:ring-1 focus:ring-[#C8945C]/20 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-[#2D4A3E]">
                        I agree to the <a href="#" className="text-[#C8945C] hover:underline font-semibold">Terms of Service</a> and <a href="#" className="text-[#C8945C] hover:underline font-semibold">Privacy Policy</a>
                      </p>
                      {errors.terms && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.terms}
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Premium Footer Actions */}
        <div className="px-5 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 bg-white border-t border-[#E8DFD0]">
          <div className="flex gap-4">
            {step !== "summary" && (
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex-1 border border-[#E8DFD0] py-3 sm:py-4 px-4 rounded-lg font-semibold bg-white text-[#2D4A3E] hover:bg-[#FAF7F2] transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base min-w-0 tracking-wide shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                {/* <span className="truncate">Back</span> */}
              </button>
            )}

            {step !== "payment" ? (
                <button
                  onClick={handleNext}
                  className="flex-1 bg-[#C8945C] hover:bg-[#B8844C] text-white py-3 sm:py-4 rounded-lg font-semibold shadow-[0_4px_12px_rgba(200,148,92,0.3)] hover:shadow-[0_6px_16px_rgba(200,148,92,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-sm sm:text-base tracking-wide"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            ) : (
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleCompletePayment}
                  disabled={isSubmitting || !agreeToTerms}
                  className="flex-1 bg-[#C8945C] hover:bg-[#B8844C] text-white py-3 sm:py-4 rounded-lg font-semibold shadow-[0_4px_12px_rgba(200,148,92,0.3)] hover:shadow-[0_6px_16px_rgba(200,148,92,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base tracking-wide"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                      Complete Payment
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-[#6B7C72] mt-4">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
