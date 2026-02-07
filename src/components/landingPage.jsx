import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, ArrowRight, Check, Award, Leaf, Shield, Users, Globe, Star, 
  Heart, Zap, Truck, Lock, Package, Gift, Minus, Plus, ChevronDown, 
  Sparkles, Clock, ThumbsUp, Play, TrendingUp, BarChart3, ChevronLeft, ChevronRight
} from 'lucide-react';
import CountUpStat from './CountUpStat';
import Navbar from './Navbar'
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from "../utils/api";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState('30');
  const [quantity, setQuantity] = useState(1);
  const { showLoginModal, setShowLoginModal } = useAuth();
  const [imageDirection, setImageDirection] = useState(1);
  const [testimonials, setTestimonials] = useState([]);
  const [productRating, setProductRating] = useState(4.9);
  const [productReviews, setProductReviews] = useState(1000);
  
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const heroImages = [
    {
      src: "https://res.cloudinary.com/dpc7tj2ze/image/upload/v1770408590/20260207_0136_Image_Generation_remix_01kgt8z4neftyredvv4898g1ms_kdhdvp.png",
      alt: "Energetic German Shepherd"
    },
    {
      src: "https://res.cloudinary.com/dpc7tj2ze/image/upload/v1770407267/1000095094_yp3ltw.jpg",
      alt: "Happy Golden Retriever"
    },
    {
      src: "https://res.cloudinary.com/dpc7tj2ze/image/upload/v1765534823/20251207_2012_Dog_Enjoying_Chew_remix_01kbwm3zz8e8980xe6t7yk53wr_jtlbkc.png",
      alt: "Healthy Labrador"
    },
    {
      src: "https://res.cloudinary.com/dpc7tj2ze/image/upload/v1770408590/20260207_0138_Image_Generation_remix_01kgt91ngdf6ks4zw3rtggg5wc_mclxzy.png",
      alt: "Energetic German Shepherd"
    },
  ];

  const videoTestimonials = [
    {
      id: 1,
      name: "Alby at The Greens",
      description: "How the himalayan chews have brought happiness",
      videoUrl: "https://res.cloudinary.com/dpc7tj2ze/video/upload/v1767530853/VID-20260104-WA0002_uhnbbd.mp4",
      thumbnail: "https://res.cloudinary.com/your-cloud/image/upload/v1/max-thumb.jpg"
    },
    {
      id: 2,
      name: "Nilo at The Lakes",
      description: "Another happy chewer",
      videoUrl: "https://res.cloudinary.com/dpc7tj2ze/video/upload/v1767530852/VID-20251228-WA0006_yg7xbs.mp4",
      thumbnail: "https://res.cloudinary.com/your-cloud/image/upload/v1/bella-thumb.jpg"
    },
    {
      id: 3,
      name: "Nilo at The Lakes",
      description: "Happy outside the house too",
      videoUrl: "https://res.cloudinary.com/dpc7tj2ze/video/upload/v1767532309/VID-20260104-WA0008_2_imjmoo.mp4",
      thumbnail: "https://res.cloudinary.com/your-cloud/image/upload/v1/bella-thumb.jpg"
    }
  ];
  

  const ingredientVideoUrl = "https://res.cloudinary.com/dpc7tj2ze/video/upload/v1765639780/IMG_2946_yrrhj7.mp4";

  const product = {
    name: "Earth & Harvest Complete",
    tagline: "The Only Dog Food Your Best Friend Needs",
    description: "Natural, healthy, and delicious chews that dogs love. Handcrafted with care with only 3 simple ingredients – yak/cow milk, salt and lime, for your furry friend's happiness and dental health.",
    price: 89.99,
    oldPrice: 119.99,
    rating: 4.9,
    reviews: 1000,
    sizes: [
      { weight: '15', price: 49.99, oldPrice: 64.99 },
      { weight: '30', price: 89.99, oldPrice: 119.99 },
      { weight: '45', price: 124.99, oldPrice: 169.99 },
    ]
  };

  const currentPrice = product.sizes.find(s => s.weight === selectedSize);

  // Auto-advance images with smooth transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setImageDirection(1);
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const goToImage = (index, direction) => {
    setImageDirection(direction);
    setCurrentHeroImage(index);
  };

  const addToCart = async () => {
    if (!localStorage.getItem("token")) {
      setShowLoginModal(true);
      return;
    }
    try {
      await apiFetch(`${API_BASE}/cart/add`, {
        method: "POST",
        body: JSON.stringify({
          productId: "695a7c123d10f91ab8d66f03",
          size: selectedSize,
          quantity
        })
      });
      setCartCount(prev => prev + quantity);
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await apiFetch(`${API_BASE}/cart`);
        const count = res.data.items.reduce((s, i) => s + i.quantity, 0);
        setCartCount(count);
      } catch (e) {
        setCartCount(0);
      }
    };
    if (localStorage.getItem("token")) {
      fetchCart();
    }
  }, []);

  // Fetch product reviews from database
  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
        const productId = "695a7c123d10f91ab8d66f03";
        const response = await apiFetch(`/products/${productId}`);
        
        if (response.success && response.data) {
          const product = response.data;
          
          if (product.rating) {
            setProductRating(product.rating);
          }
          if (product.totalReviews) {
            setProductReviews(product.totalReviews);
          }
          
          if (product.reviews && product.reviews.length > 0) {
            const transformedTestimonials = product.reviews
              .slice(0, 3)
              .map(review => ({
                text: review.content || review.title || "",
                author: review.userName || "Anonymous",
                role: review.dogBreed 
                  ? `${review.dogBreed}${review.sizePurchased ? ` • ${review.sizePurchased}` : ''}`
                  : review.sizePurchased || "Pet Parent",
                rating: review.rating || 5
              }))
              .filter(t => t.text);
            
            setTestimonials(transformedTestimonials);
          }
        }
      } catch (err) {
        console.error("Failed to fetch product reviews:", err);
      }
    };
    
    fetchProductReviews();
  }, []);

  const stats = [
    { value: 1000, label: "Happy Dogs", icon: Heart, suffix: "+" },
    { value: 3, label: "Countries", icon: Globe },
    { value: 99, label: "Satisfaction", icon: Award, suffix: "%" }
  ];

  const ingredients = [
    { name: "Yak & Cow Milk", benefit: "99.9%", icon: "🥛" },
    { name: "Traces of Salt", benefit: "less than 1%", icon: "🧂" },
    { name: "Trace of Lime Juice", benefit: "less than 1%", icon: "🍋" }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Long lasting",
      description: "Hard, slow-dried chews that keep dogs engaged longer and satisfy natural chewing instincts."
    },
    {
      icon: Zap,
      title: "High Protein",
      description: "Naturally rich in protein from yak and cow milk to support muscle strength and vitality."
    },
    {
      icon: Shield,
      title: "Low fat",
      description: "A wholesome, low-fat chew option ideal for regular chewing without excess calories."
    },
    {
      icon: Leaf,
      title: "Only 3 natural ingredients",
      description: "Made using just yak & cow milk, salt, and lime juice — no hormones, antibiotics, artificial colours, flavours, or preservatives."
    }
  ];
  

  const guarantees = [
    { icon: Truck, title: "Free Shipping", desc: "On all orders" },
    { icon: Lock, title: "10-days guarantee", desc: "Full refund, no questions on unopened packets" },
    { icon: Package, title: "Buy in bulk & Save", desc: "28.5% off when ordering 5 packets or more" },
  ];

  const transformationSteps = [
    {
      icon: Clock,
      day: "Day 1-7",
      title: "Transition Period",
      description: "Gradual introduction to Earth & Harvest. Your dog starts accepting the new taste profile."
    },
    {
      icon: Sparkles,
      day: "Day 7-14",
      title: "Energy Boost",
      description: "Notice increased energy levels, better mood, and more enthusiastic meal times."
    },
    {
      icon: Heart,
      day: "Day 14-30",
      title: "Visible Changes",
      description: "Shinier coat, healthier skin, improved digestion, and better overall vitality."
    },
    {
      icon: ThumbsUp,
      day: "Day 30+",
      title: "Peak Performance",
      description: "Your dog is thriving with optimal nutrition. Long-term health benefits compound."
    }
  ];

  const faqs = [
    {
      q: "Is Earth & Harvest Complete suitable for all dog breeds and ages?",
      a: "Coming soon..."
    },
    {
      q: "How long until I see results?",
      a: "Coming soon..."
    },
    {
      q: "What makes Earth & Harvest different from other premium brands?",
      a: "Coming soon..."
    },
    {
      q: "How do I transition my dog to Earth & Harvest Complete?",
      a: "Coming soon..."
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar cartCount={cartCount} />

      {/* Modern Hero Section with Refined Animations */}
      <section className="relative mt-12 min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-white to-[#F8F2EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6 lg:space-y-8 order-2 lg:order-1"
            >
              {/* Simplified Badges - Only 2 */}
              <motion.div 
                className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  <Star className="w-4 h-4 text-[#C8945C]" />
                  <span>100% NATURAL</span>
                </span>
                <span className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  <Award className="w-4 h-4 text-[#C8945C]" />
                  <span>ONLY 3 INGREDIENTS</span>
                </span>
              </motion.div>
              
              <div className="space-y-4">
                <motion.h1 
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-gray-900 leading-[1.1] tracking-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  From the Himalayas to Dubai 
                  <span className="block text-[#C8945C] mt-3 font-light">100% natural chews for Dogs</span>
                </motion.h1>
                
                <motion.p 
                  className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {product.description}
                </motion.p>
              </div>

              {/* Rating & Social Proof */}
              <motion.div 
                className="flex flex-wrap items-center gap-4 sm:gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <div className="ml-2">
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">{productRating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm ml-1">/5</span>
                  </div>
                </div>
                <div className="h-6 w-px bg-gray-300 hidden sm:block" />
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-500">Trusted by</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">{productReviews.toLocaleString()}+ Pet Parents</p>
                </div>
              </motion.div>

              {/* CTA Buttons with Clear Hierarchy */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  to="/product"
                  className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Shop Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  to="#video-testimonials"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 transition-colors text-base"
                >
                  <Play className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Watch Video</span>
                  <span className="sm:hidden">Video</span>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 text-xs sm:text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span>10-days money back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span>Customer Approved</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Hero Image with Simplified Animation */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/5] sm:aspect-square relative overflow-hidden">
                  <AnimatePresence mode="wait" custom={imageDirection}>
                    <motion.div
                      key={currentHeroImage}
                      custom={imageDirection}
                      initial={{ 
                        opacity: 0, 
                        x: imageDirection > 0 ? 300 : -300,
                      }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                      }}
                      exit={{ 
                        opacity: 0, 
                        x: imageDirection > 0 ? -300 : 300,
                      }}
                      transition={{ 
                        duration: 0.6,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0"
                    >
                      <img
                        src={heroImages[currentHeroImage].src}
                        alt={heroImages[currentHeroImage].alt}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={() => goToImage((currentHeroImage - 1 + heroImages.length) % heroImages.length, -1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-10 group"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-[#C8945C] transition-colors" />
                  </button>
                  <button
                    onClick={() => goToImage((currentHeroImage + 1) % heroImages.length, 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-10 group"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-[#C8945C] transition-colors" />
                  </button>
                  
                  {/* Image Navigation Dots */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToImage(idx, idx > currentHeroImage ? 1 : -1)}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentHeroImage ? 'bg-white w-8 shadow-lg' : 'bg-white/50 w-2 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar - Moved Up & Simplified */}
      <section className="py-10 bg-gradient-to-b from-gray-50/50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {guarantees.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{item.title}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Verification */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                  {stat.value}{stat.suffix || ''}
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Verified purchases
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Cleaner Cards */}
      <section id="benefits" className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
              Why Choose Earth & Harvest
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Science-backed nutrition with ingredients you can trust
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ boxShadow: "0 12px 24px -4px rgba(0, 0, 0, 0.08)" }}
                className="bg-white rounded-xl p-6 sm:p-8 shadow-sm transition-shadow border-0"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-[#C8945C]/20 rounded-xl flex items-center justify-center mb-5 sm:mb-6 mx-auto">
                  <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#C8945C]" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 text-center">{benefit.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients Section - Cleaner Design */}
      <section id="ingredients" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Real Ingredients.<br />
                <span className="text-[#C8945C]">Real Results.</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Every ingredient is hand-selected for quality and purpose. No fillers, no by-products, no artificial anything.
              </p>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {ingredients.map((ing, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 text-center"
                  >
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 opacity-60">{ing.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{ing.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-500">{ing.benefit}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {['No hormones', 'No antibiotics', 'No preservatives'].map((badge) => (
                  <span key={badge} className="px-4 py-2 border-2 border-[#C8945C] text-[#C8945C] rounded-full text-sm font-medium">
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Video */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative rounded-2xl shadow-2xl overflow-hidden aspect-[9/16] w-full max-w-sm mx-auto border-4 border-white">
                <video
                  src={ingredientVideoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Testimonials with Play Affordance */}
      <section id="video-testimonials" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
              Real Stories from Real Pet Parents
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Watch how Earth & Harvest has transformed the lives of dogs and their families
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
            {videoTestimonials.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl bg-black group"
              >
                <video
                  src={video.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Play Affordance */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <p className="text-white font-semibold text-base drop-shadow-lg">
                    {video.name}
                  </p>
                  <p className="text-white/90 text-sm mt-1 drop-shadow-md">
                    {video.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Written Testimonials - Improved Design */}
      <section id="reviews" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
              Trusted by Thousands of Pet Parents
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Real reviews from verified customers who've seen the difference
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.length > 0 ? testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                <p className="text-gray-700 text-lg leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#C8945C] to-[#B8844C] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-base">{t.author}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Loading reviews...</p>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link 
              to="/product#reviews"
              className="inline-flex items-center gap-2 text-[#C8945C] font-semibold hover:underline text-lg"
            >
              <span>Read All Reviews</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section - Better Spacing */}
      <section id="faq" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4 text-base">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-gray-600 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Stronger Presence */}
      <section className="py-24 bg-[#C8945C] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6 leading-tight">
              Give Your Dog The Best
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join 1,000+ dog parents who made the switch. 10-day money-back guarantee.
            </p>
            
            <Link 
              to="/product"
              className="inline-flex items-center gap-3 bg-white text-[#C8945C] px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-xl hover:scale-105 transition-all"
            >
              Shop Now - 14% OFF
              <ArrowRight className="w-6 h-6" />
            </Link>
            
            <p className="text-white/80 mt-8 text-base">
              Free shipping • 10-day guarantee • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;