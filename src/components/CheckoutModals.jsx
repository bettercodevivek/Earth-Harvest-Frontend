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
    
    if (!address.phone || !/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(address.phone)) {
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
    
    if (!address.zipcode || address.zipcode.trim().length < 4) {
      newErrors.zipcode = "Please enter a valid zipcode";
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
      // Update address with email
      const completeAddress = {
        ...address,
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

  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';

  const handleTestPayment = async () => {
    if (!validatePayment()) return;
    
    setIsSubmitting(true);
    try {
      // Validate all required fields before proceeding
      if (!currentPrice || !currentPrice.price) {
        throw new Error("Please select a product size");
      }

      if (!selectedSize) {
        throw new Error("Please select a size");
      }

      if (!quantity || quantity < 1) {
        throw new Error("Please select a quantity");
      }

      // Validate address fields
      if (!address.street || !address.city || !address.zipcode) {
        throw new Error("Please fill in all required address fields");
      }

      // Get productId - check multiple possible fields including prop
      const productIdValue = productId || product?._id || product?.id;
      
      if (!productIdValue) {
        console.error("Product object:", product);
        console.error("ProductId prop:", productId);
        console.error("Available product fields:", Object.keys(product || {}));
        throw new Error("Product ID is missing. Please refresh the page and try again.");
      }

      console.log("Using productId for order:", productIdValue);

      // Update address with email
      const completeAddress = {
        ...address,
        email: email,
        deliveryInstructions: deliveryInstructions
      };
      setAddress(completeAddress);
      
      // First create the order (same as regular payment)
      const amount = currentPrice.price * quantity;
      const formattedAddress = {
        street: address.street,
        city: address.city,
        state: address.state || "",
        country: address.country || "United Arab Emirates",
        zipCode: parseInt(address.zipcode) || 0
      };

      console.log("Creating order with:", {
        productId: productIdValue,
        sizeSelected: selectedSize,
        quantity: quantity,
        address: formattedAddress,
        amount: amount,
        product: product
      });

      const orderRes = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/order/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: productIdValue,
          sizeSelected: selectedSize.toString(),
          quantity: parseInt(quantity),
          address: formattedAddress,
          amount: parseFloat(amount)
        })
      });

      const orderData = await orderRes.json();
      
      console.log("Order creation response:", orderData);
      
      if (!orderData.success) {
        console.error("Order creation failed:", orderData);
        throw new Error(orderData.message || "Failed to create order");
      }

      if (!orderData.data) {
        console.error("Order data missing in response:", orderData);
        throw new Error("Order created but data is missing");
      }

      const createdOrderId = orderData.data._id || orderData.data.orderId;
      
      if (!createdOrderId) {
        console.error("Order ID missing in response:", orderData);
        throw new Error("Order created but ID is missing");
      }
      
      console.log("Created order ID:", createdOrderId);

      // Then call test payment endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/payment/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          orderId: createdOrderId
        })
      });

      const data = await response.json();
      
      console.log("Test payment response:", data);
      
      if (data.success && data.data && data.data.order) {
        const orderId = data.data.order._id || data.data.order.orderId;
        // Show success message and redirect
        window.location.href = `${window.location.origin}/payment-success?orderId=${orderId}&test=true`;
      } else {
        throw new Error(data.message || 'Test payment failed');
      }
    } catch (error) {
      console.error("Test payment error:", error);
      alert(error.message || "Test payment failed. Please try again.");
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
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-end sm:items-center justify-center sm:p-4"
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
        className="w-full sm:max-w-4xl bg-gradient-to-br from-[#FAF7F2] via-white to-[#F8F2EC] rounded-t-3xl sm:rounded-3xl shadow-2xl border-2 border-[#E8DFD0] max-h-[85vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Premium Header */}
        <div className="relative bg-gradient-to-r from-[#2D4A3E] via-[#3D5A4E] to-[#2D4A3E] px-4 sm:px-6 py-3 sm:py-5 border-b-2 border-[#C8945C]/30">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-2h-2v2h2zm0-4v-2h-2v2h2zm0-4v-2h-2v2h2zm0-4v-2h-2v2h2zm0-4v-2h-2v2h2zm0-4v-2h-2v2h2zm0-4v-2h-2v2h2zm0-4v-2h-2v2h2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-[#C8945C] to-[#B8844C] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                {React.createElement(steps[currentStepIndex].icon, { className: "w-5 h-5 sm:w-7 sm:h-7 text-white" })}
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-white mb-0.5 sm:mb-1">
                  {step === "summary" && "Order Summary"}
                  {step === "address" && "Delivery Information"}
                  {step === "payment" && "Secure Checkout"}
                </h2>
                <p className="text-[#C8945C] text-xs sm:text-sm font-medium">
                  Step {currentStepIndex + 1} of {steps.length}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all flex items-center justify-center group"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3">
            {steps.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1">
                  <div className={`flex items-center gap-1.5 sm:gap-2 flex-1 ${idx <= currentStepIndex ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                      idx < currentStepIndex 
                        ? 'bg-[#C8945C] text-white shadow-lg' 
                        : idx === currentStepIndex 
                        ? 'bg-[#C8945C] text-white shadow-lg scale-110' 
                        : 'bg-white/20 text-white/60'
                    }`}>
                      {idx < currentStepIndex ? (
                        <CheckCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                      ) : (
                        <span className="font-bold text-xs sm:text-sm">{idx + 1}</span>
                      )}
                    </div>
                    <span className="text-white font-medium text-xs sm:text-sm hidden sm:block">{s.label}</span>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 sm:h-1 rounded-full transition-all ${
                    idx < currentStepIndex ? 'bg-[#C8945C]' : 'bg-white/20'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
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
                {/* Product Card - Premium Design */}
                <div className="relative bg-white rounded-2xl p-6 border-2 border-[#E8DFD0] shadow-xl overflow-hidden group hover:shadow-2xl transition-all">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#C8945C]/10 to-transparent rounded-bl-full"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#C8945C]/5 to-transparent rounded-tr-full"></div>
                  
                  <div className="relative flex gap-3 sm:gap-6">
                    <div className="relative flex-shrink-0">
                      <img
                        src={product.images?.[0] || product.image}
                        className="w-20 h-20 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl border-2 border-[#E8DFD0] object-cover shadow-lg group-hover:scale-105 transition-transform"
                        alt={product.name}
                      />
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        Premium
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-2xl font-bold text-[#2D4A3E] mb-2 sm:mb-3">{product.name || product.productName}</h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-[#6B7C72]">
                          <Package className="w-4 h-4 text-[#C8945C]" />
                          <span>Size: <span className="font-semibold text-[#2D4A3E]">{selectedSize}g</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#6B7C72]">
                          <Sparkles className="w-4 h-4 text-[#C8945C]" />
                          <span>Quantity: <span className="font-semibold text-[#2D4A3E]">{quantity}</span></span>
                        </div>
                      </div>
                      
                      <div className="flex items-baseline gap-2 sm:gap-3">
                        <span className="text-xl sm:text-3xl font-bold text-[#C8945C]">AED {currentPrice.price.toFixed(2)}</span>
                        {currentPrice.oldPrice && (
                          <>
                            <span className="text-sm sm:text-lg text-gray-400 line-through">AED {currentPrice.oldPrice.toFixed(2)}</span>
                            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                              {Math.round(((currentPrice.oldPrice - currentPrice.price) / currentPrice.oldPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Savings Banner */}
                {savings > 0 && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-r from-[#C8945C] to-[#B8844C] rounded-2xl p-5 text-white shadow-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-sm sm:text-lg">You're Saving!</p>
                        <p className="text-xs sm:text-sm opacity-90">Premium quality at an incredible price</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl sm:text-3xl font-bold">AED {savings.toFixed(2)}</p>
                      <p className="text-sm opacity-90">Off regular price</p>
                    </div>
                  </motion.div>
                )}

                {/* Order Summary */}
                <div className="bg-white rounded-2xl p-6 border-2 border-[#E8DFD0] shadow-lg">
                  <h3 className="font-bold text-[#2D4A3E] text-base sm:text-xl mb-4 sm:mb-5 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8945C]" />
                    Order Summary
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b-2 border-[#E8DFD0]">
                      <span className="text-[#6B7C72]">Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'})</span>
                      <span className="font-semibold text-[#2D4A3E] text-sm sm:text-lg">AED {subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b-2 border-[#E8DFD0]">
                      <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-[#C8945C]" />
                        <span className="text-[#6B7C72]">Express Shipping</span>
                      </div>
                      <span className="font-semibold text-green-600 text-sm sm:text-lg">FREE</span>
                    </div>

                    <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F8F2EC] rounded-xl p-5 border-2 border-[#C8945C]/20">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#2D4A3E] text-base sm:text-xl">Total Amount</span>
                        <span className="font-bold text-[#C8945C] text-xl sm:text-3xl">
                          AED {finalTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Shield, title: "Secure", desc: "256-bit SSL" },
                    { icon: Truck, title: "Fast", desc: "2-3 Days" },
                    { icon: Award, title: "Premium", desc: "Quality" }
                  ].map((badge, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 border border-[#E8DFD0] text-center hover:shadow-lg transition-shadow">
                      <badge.icon className="w-6 h-6 text-[#C8945C] mx-auto mb-2" />
                      <p className="text-xs font-semibold text-[#2D4A3E]">{badge.title}</p>
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
                {/* Delivery Info Banner */}
                <div className="bg-gradient-to-br from-[#C8945C]/10 to-[#C8945C]/5 border-2 border-[#C8945C]/20 rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#C8945C] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2D4A3E] mb-1 text-sm sm:text-lg">Fast & Free Delivery</h4>
                    <p className="text-xs sm:text-sm text-[#6B7C72]">
                      We deliver across UAE. Your premium dog chews will arrive in 2-3 business days with express shipping.
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-2xl p-6 border-2 border-[#E8DFD0] shadow-lg">
                  <h3 className="font-bold text-[#2D4A3E] text-base sm:text-lg mb-4 sm:mb-5 flex items-center gap-2">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8945C]" />
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
                          className={`w-full border-2 ${errors.name ? 'border-red-400' : 'border-[#E8DFD0]'} p-3 sm:p-4 rounded-xl bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none transition-colors text-sm sm:text-base`}
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
                            className={`w-full border-2 ${errors.phone ? 'border-red-400' : 'border-[#E8DFD0]'} pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none transition-colors text-sm sm:text-base`}
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

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl p-6 border-2 border-[#E8DFD0] shadow-lg">
                  <h3 className="font-bold text-[#2D4A3E] text-base sm:text-lg mb-4 sm:mb-5 flex items-center gap-2">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8945C]" />
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
                          className={`w-full border-2 ${errors.street ? 'border-red-400' : 'border-[#E8DFD0]'} pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none transition-colors text-sm sm:text-base`}
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

                      <div>
                        <label className="block text-sm font-semibold text-[#2D4A3E] mb-2">
                          Zip/Postal Code <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7C72]" />
                          <input
                            type="text"
                            placeholder="00000"
                            value={address.zipcode || ""}
                            onChange={(e) => {
                              setAddress({ ...address, zipcode: e.target.value });
                              if (errors.zipcode) setErrors({ ...errors, zipcode: null });
                            }}
                            className={`w-full border-2 ${errors.zipcode ? 'border-red-400' : 'border-[#E8DFD0]'} pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none transition-colors text-sm sm:text-base`}
                          />
                          {errors.zipcode && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.zipcode}
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
                          className="w-full border-2 border-[#E8DFD0] pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none transition-colors text-sm sm:text-base resize-none"
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
                {/* Secure Payment Header */}
                <div className="bg-gradient-to-br from-[#2D4A3E] to-[#3D5A4E] rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">Secure Payment</h4>
                      <p className="text-sm text-[#C8945C]">Powered by Nomod • Bank-level encryption</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/20">
                    <div className="flex justify-between items-center">
                      <span className="text-white/90 text-sm sm:text-lg">Total Amount</span>
                      <span className="text-2xl sm:text-4xl font-bold">AED {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Security Features */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-5 border-2 border-[#E8DFD0] hover:shadow-lg transition-shadow">
                    <Shield className="w-8 h-8 text-[#C8945C] mb-3" />
                    <p className="font-semibold text-[#2D4A3E] text-sm mb-1">256-bit SSL</p>
                    <p className="text-xs text-[#6B7C72]">Bank-grade encryption</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border-2 border-[#E8DFD0] hover:shadow-lg transition-shadow">
                    <CheckCircle className="w-8 h-8 text-[#C8945C] mb-3" />
                    <p className="font-semibold text-[#2D4A3E] text-sm mb-1">PCI Compliant</p>
                    <p className="text-xs text-[#6B7C72]">Secure transactions</p>
                  </div>
                </div>

                {/* Order Review */}
                <div className="bg-white rounded-2xl p-6 border-2 border-[#E8DFD0] shadow-lg">
                  <h4 className="font-bold text-[#2D4A3E] mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8945C]" />
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
                    <div className="pt-3 border-t-2 border-[#E8DFD0]">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#2D4A3E] text-base sm:text-lg">Total</span>
                        <span className="font-bold text-[#C8945C] text-xl sm:text-2xl">AED {finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="bg-white rounded-xl p-5 border-2 border-[#E8DFD0]">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => {
                        setAgreeToTerms(e.target.checked);
                        if (errors.terms) setErrors({ ...errors, terms: null });
                      }}
                      className="mt-1 w-5 h-5 rounded border-2 border-[#C8945C] text-[#C8945C] focus:ring-[#C8945C] cursor-pointer"
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

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3 sm:py-5 bg-white border-t-2 border-[#E8DFD0]">
          <div className="flex gap-4">
            {step !== "summary" && (
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex-1 border-2 border-[#E8DFD0] py-3 sm:py-4 px-4 rounded-xl font-bold bg-white text-[#2D4A3E] hover:bg-[#FAF7F2] transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base min-w-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="truncate">Back</span>
              </button>
            )}

            {step !== "payment" ? (
                <button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white py-3 sm:py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            ) : (
              <div className={`flex gap-4 ${isDevelopment ? 'flex-col sm:flex-row' : ''} w-full`}>
                <button
                  onClick={handleCompletePayment}
                  disabled={isSubmitting || !agreeToTerms}
                  className={`${isDevelopment ? 'w-full sm:flex-1' : 'flex-1'} bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white py-3 sm:py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base`}
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
                {isDevelopment && (
                  <button
                    onClick={handleTestPayment}
                    disabled={isSubmitting || !agreeToTerms}
                    className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    title="Test payment without actual transaction"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        Test Payment
                      </>
                    )}
                  </button>
                )}
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
