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
  
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const heroImages = [
    {
      src: "https://res.cloudinary.com/dpc7tj2ze/image/upload/v1765534823/20251202_0058_Luxurious_Dog_Chew_Scene_remix_01kbdp3v53er4tx9gv6h3nf06c_zm6nbh.png",
      alt: "Happy Golden Retriever"
    },
    {
      src: "https://res.cloudinary.com/dpc7tj2ze/image/upload/v1765534823/20251207_2012_Dog_Enjoying_Chew_remix_01kbwm3zz8e8980xe6t7yk53wr_jtlbkc.png",
      alt: "Healthy Labrador"
    },
    {
      src: "https://res.cloudinary.com/dpc7tj2ze/image/upload/v1765534823/20251202_0045_Majestic_Golden_Retriever_simple_compose_01kbdnbbh8fmm8xrwxagafwra8_zexv3d.png",
      alt: "Energetic German Shepherd"
    },
  ];

  const videoTestimonials = [
    {
      id: 1,
      name: "Mark’s Journey",
      description: "How Earth & Harvest improved digestion and energy",
      videoUrl: "https://res.cloudinary.com/dpc7tj2ze/video/upload/v1767530853/VID-20260104-WA0002_uhnbbd.mp4",
      thumbnail: "https://res.cloudinary.com/your-cloud/image/upload/v1/max-thumb.jpg"
    },
    {
      id: 2,
      name: "Bella’s Journey",
      description: "From picky eater to happy chewer",
      videoUrl: "https://res.cloudinary.com/dpc7tj2ze/video/upload/v1767530852/VID-20251228-WA0006_yg7xbs.mp4",
      thumbnail: "https://res.cloudinary.com/your-cloud/image/upload/v1/bella-thumb.jpg"
    },
    {
      id: 3,
      name: "Julia’s Journey",
      description: "From picky eater to happy chewer",
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
    }, 5000);
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
          productId: "65f9e8c2f4c1a8b345456789",
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

  const stats = [
    { value: 1000, label: "Happy Dogs", icon: Heart, suffix: "+" },
    { value: 3, label: "Countries", icon: Globe },
    { value: 99, label: "Satisfaction", icon: Award, suffix: "%" },
    { value: 1, label: "Vet Recommended", icon: Shield, prefix: "#" }
  ];

  const testimonials = [
    {
      text: "After 3 weeks on Earth & Harvest Complete, Max's coat is shinier than ever. His energy levels are through the roof, and he actually gets excited for meal time now!",
      author: "Dr. Sarah Mitchell",
      role: "Veterinarian & Golden Retriever Owner",
      rating: 5
    },
    {
      text: "I've recommended Earth & Harvest to over 500 clients this year. The results speak for themselves - healthier coats, better digestion, and more vitality.",
      author: "Marcus Chen",
      role: "Professional Dog Trainer",
      rating: 5
    },
    {
      text: "Switching our entire rescue facility to Earth & Harvest reduced health issues by 40%. It's now the only food we trust for our 200+ dogs.",
      author: "Jennifer Rodriguez",
      role: "Rescue Facility Director",
      rating: 5
    },
  ];

  const ingredients = [
    { name: "Yak Milk", benefit: "Rich in protein & calcium", icon: "🥛" },
    { name: "Himalayan Salt", benefit: "Natural minerals & electrolytes", icon: "🧂" },
    { name: "Lime Juice", benefit: "Supports digestion & immunity", icon: "🍋" }
  ];

  const benefits = [
    {
      icon: Clock, // Represents long-lasting chew time
      title: "Long lasting",
      description: "Hard, slow-dried chews that keep dogs engaged longer and satisfy natural chewing instincts."
    },
    {
      icon: Zap, // Energy / protein
      title: "High Protein",
      description: "Naturally rich in protein from yak and cow milk to support muscle strength and vitality."
    },
    {
      icon: Shield, // Health / controlled nutrition
      title: "Low fat",
      description: "A wholesome, low-fat chew option ideal for regular chewing without excess calories."
    },
    {
      icon: Leaf, // Natural ingredients
      title: "Only 3 natural ingredients",
      description: "Made using just yak & cow milk, salt, and lime juice — no hormones, antibiotics, artificial colours, flavours, or preservatives."
    }
  ];
  

  const guarantees = [
    { icon: Truck, title: "Free Shipping", desc: "On all orders" },
    { icon: Lock, title: "30-days guarantee", desc: "Full refund, no questions on unopened packets" },
    { icon: Package, title: "Buy in bulk & Save", desc: "28.5% off when ordering 5 packets or more" },
    { icon: Gift, title: "Free Sample", desc: "With every order" }
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
      a: "Yes! Our formula is designed to provide complete nutrition for all breeds, from puppies (8 weeks+) to senior dogs. The balanced nutrient profile adapts to your dog's needs."
    },
    {
      q: "How long until I see results?",
      a: "Most pet parents notice improved energy within 7 days, and visible coat improvements within 14-21 days. We're so confident, we offer a 90-day money-back guarantee."
    },
    {
      q: "What makes Earth & Harvest different from other premium brands?",
      a: "We use only human-grade ingredients, no fillers or by-products. Every batch is third-party tested, and we're the only brand with our proprietary Vitality Blend of 47 essential nutrients."
    },
    {
      q: "How do I transition my dog to Earth & Harvest Complete?",
      a: "We recommend a gradual 7-day transition: Start with 25% Earth & Harvest mixed with current food, increasing by 25% every 2 days. Full instructions included with your order."
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Top Announcement Bar */}
      {/* <div className="bg-gradient-to-r from-[#C8945C] via-[#B8844C] to-[#C8945C] text-white py-3 px-4 text-center text-xs sm:text-sm font-medium relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <span className="relative z-10">
          <span className="hidden sm:inline">🎁 LAUNCH SPECIAL: </span>
          FREE SHIPPING ON EVERY ORDER • NO MINIMUM PURCHASE REQUIRED
        </span>
      </div> */}

      <Navbar cartCount={cartCount} />

      {/* Modern Hero Section with Advanced Animations */}
      <section className="relative mt-12 min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-white to-[#F8F2EC]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-[#C8945C]/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#B8844C]/10 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, -60, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6 lg:space-y-8 order-2 lg:order-1"
            >
              {/* Badges */}
              <motion.div 
                className="flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-[#C8945C]/20 text-[#C8945C] px-4 py-2 rounded-full text-xs font-bold shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-[#C8945C]" />
                  <span>100% NATURAL</span>
                </span>
                <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-[#C8945C]/20 text-[#C8945C] px-4 py-2 rounded-full text-xs font-bold shadow-sm">
                  <Award className="w-3.5 h-3.5" />
                  <span>REVOLUTIONARY ALL IN ONE FORMULA</span>
                </span>
              </motion.div>
              
              <div className="space-y-4">
                <motion.h1 
                  className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-gray-900 leading-tight font-chillax"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  From the Himalayas to Dubai 
                  <span className="block text-[#C8945C] mt-2">100% natural chews for Dogs</span>
                </motion.h1>
                
                <motion.p 
                  className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl font-light"
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
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">{product.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">/5</span>
                  </div>
                </div>
                <div className="h-6 w-px bg-gray-300 hidden sm:block" />
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-500">Trusted by</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">{product.reviews.toLocaleString()}+ Pet Parents</p>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  to="/product"
                  className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-4 bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Shop Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-[#B8844C] to-[#C8945C]"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
                <Link
  to="#video-testimonials"
  className="inline-flex items-center justify-center px-6 sm:px-8 py-4
             bg-white border-2 border-gray-200 text-gray-700 font-semibold
             rounded-xl hover:border-[#C8945C] hover:text-[#C8945C]
             transition-all duration-300"
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
                  <span>30-days money back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span>Vet Approved</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Hero Image with Advanced Slide Animation */}
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
                        scale: 0.8,
                        rotateY: imageDirection > 0 ? 45 : -45
                      }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        scale: 1,
                        rotateY: 0
                      }}
                      exit={{ 
                        opacity: 0, 
                        x: imageDirection > 0 ? -300 : 300,
                        scale: 0.8,
                        rotateY: imageDirection > 0 ? -45 : 45
                      }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.4, 0, 0.2, 1]
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

              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 hidden sm:block"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#C8945C] to-[#B8844C] rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">1,000+</p>
                    <p className="text-xs sm:text-sm text-gray-600">Happy Dogs</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 sm:py-10 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {guarantees.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#C8945C] to-[#B8844C] rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
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

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, idx) => (
              <CountUpStat
                key={idx}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                prefix={stat.prefix}
                suffix={stat.suffix}
                index={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Modern Grid */}
      <section id="benefits" className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Earth & Harvest
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Science-backed nutrition with ingredients you can trust
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#C8945C]/20 hover:-translate-y-2"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#C8945C]/10 to-[#B8844C]/10 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#C8945C]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 text-center">{benefit.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients Section - Modern Split */}
      <section id="ingredients" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
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
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-100 hover:border-[#C8945C]/30 transition-colors"
                  >
                    <span className="text-2xl sm:text-3xl mb-2 sm:mb-3 block">{ing.icon}</span>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">{ing.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{ing.benefit}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {['No added hormones', 'No antibiotics', 'No artificial colour', 'No artificial preservatives'].map((badge) => (
                  <span key={badge} className="inline-flex items-center gap-2 bg-[#C8945C] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{badge}</span>
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
              <div className="relative rounded-2xl shadow-2xl overflow-hidden aspect-[9/16] w-full max-w-sm mx-auto">
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

      {/* Transformation Journey
      <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              The Earth & Harvest Transformation
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Watch your dog transform from the very first week
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {transformationSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="absolute -top-3 sm:-top-4 left-6 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#C8945C] to-[#B8844C] rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                  {idx + 1}
                </div>
                
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#C8945C]/20 to-[#B8844C]/20 rounded-xl flex items-center justify-center mb-4 mt-2">
                  <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#C8945C]" />
                </div>
                
                <span className="inline-block bg-[#C8945C] text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                  {step.day}
                </span>
                
                <h3 className="text-base sm:text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

{/* Video Testimonials */}
<section id="video-testimonials" className="py-16 sm:py-24 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Heading */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12 sm:mb-16"
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        Real Stories from Real Pet Parents
      </h2>
      <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
        Watch how Earth & Harvest has transformed the lives of dogs and their families
      </p>
    </motion.div>

    {/* Portrait Video Grid */}
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
      {videoTestimonials.map((video, idx) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="relative w-full max-w-[320px] sm:max-w-[300px] lg:max-w-[320px]
                     aspect-[9/16] rounded-2xl overflow-hidden shadow-xl bg-black"
        >
          {/* Video */}
          <video
            src={video.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Soft Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

          {/* Text Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <p className="text-white font-semibold text-sm">
              {video.name}
            </p>
            <p className="text-white/80 text-xs mt-1">
              {video.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>

  </div>
</section>



      {/* Written Testimonials */}
      <section id="reviews" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Thousands of Pet Parents
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Real reviews from verified customers who've seen the difference
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base">"{t.text}"</p>
                <div className="flex items-center gap-3 sm:gap-4 pt-6 border-t border-gray-100">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#C8945C] to-[#B8844C] rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{t.author}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8 sm:mt-12"
          >
            <Link 
              to="/product#reviews"
              className="inline-flex items-center gap-2 text-[#C8945C] font-semibold hover:underline text-base sm:text-lg"
            >
              <span>Read All Reviews</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4 text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 sm:px-6 pb-4 sm:pb-6 text-gray-600 leading-relaxed text-sm sm:text-base">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Give Your Dog The Best
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join 1,000+ dog parents who made the switch. 90-day money-back guarantee.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/product"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#C8945C] px-6 sm:px-8 py-4 rounded-xl font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <span>Shop Now - 14% OFF</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <p className="text-white/80 mt-6 sm:mt-8 text-sm sm:text-base">
              Free shipping • 30-day guarantee • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
