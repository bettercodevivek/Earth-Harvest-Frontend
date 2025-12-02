import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, Play, Check, Award, Leaf, Shield, Users, TrendingUp, Globe, Star, Heart, Zap, Truck, Lock, Package, Gift, Search, X, ChevronRight } from 'lucide-react';

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, 150]);
  const statsY = useTransform(smoothProgress, [0.1, 0.4], [100, 0]);

  const heroImages = [
    {
      src: "/20251202_2343_Luxury Dog Treat Display_remix_01kbg4611dek5ag087q21b5s16.png",
      title: "Golden Retriever",
      subtitle: "Thriving on Heritage Formula"
    },
    {
      src: "/20251202_0058_Luxurious Dog Chew Scene_remix_01kbdp3v53er4tx9gv6h3nf06c.png",
      title: "Labrador Retriever", 
      subtitle: "Performance Blend Champion"
    },
    {
      src: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=900&fit=crop",
      title: "German Shepherd",
      subtitle: "Athletic Performance Series"
    },
    {
      src: "/20251202_0045_Majestic Golden Retriever_simple_compose_01kbdnbbh8fmm8xrwxagafwra8.png",
      title: "Border Collie",
      subtitle: "Peak Energy Formula"
    }
  ];

  const quickBuyProducts = [
    { id: 1, name: "Grain-Free Adult", price: 89.99, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&h=200&fit=crop" },
    { id: 2, name: "Performance Blend", price: 94.99, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop" },
    { id: 3, name: "Senior Care", price: 84.99, image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&h=200&fit=crop" },
    { id: 4, name: "Puppy Formula", price: 79.99, image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  const products = [
    {
      id: 1,
      category: 'premium',
      name: "Heritage Grain-Free Formula",
      subtitle: "Premium Adult Dog Nutrition",
      price: 89.99,
      oldPrice: 109.99,
      weight: "30 lbs",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&h=800&fit=crop",
      features: ["Wild-Caught Salmon", "Ancient Grains", "Omega-3 Rich"],
      badge: "Best Seller",
      rating: 4.9,
      reviews: 2847
    },
    {
      id: 2,
      category: 'performance',
      name: "Athletic Performance Blend",
      subtitle: "High-Energy Working Dogs",
      price: 94.99,
      weight: "30 lbs",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=800&fit=crop",
      features: ["35% Protein", "Joint Support", "Endurance Formula"],
      badge: "Pro Choice",
      rating: 4.8,
      reviews: 1923
    },
    {
      id: 3,
      category: 'wellness',
      name: "Longevity Senior Care",
      subtitle: "Advanced Age 7+ Formula",
      price: 84.99,
      weight: "25 lbs",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=800&fit=crop",
      features: ["Glucosamine Blend", "Antioxidants", "Easy Digest"],
      badge: "Vet Recommended",
      rating: 5.0,
      reviews: 3156
    },
    {
      id: 4,
      category: 'premium',
      name: "Puppy Development Formula",
      subtitle: "0-12 Months Growth Support",
      price: 79.99,
      weight: "28 lbs",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop",
      features: ["DHA for Brain", "Calcium Balance", "Immune Support"],
      badge: "New",
      rating: 4.9,
      reviews: 856
    }
  ];

  const stats = [
    { value: "$125M+", label: "Annual Revenue", icon: TrendingUp },
    { value: "2.3M+", label: "Dogs Fed Daily", icon: Users },
    { value: "47", label: "Countries", icon: Globe },
    { value: "99.2%", label: "Satisfaction Rate", icon: Award }
  ];

  const testimonials = [
    {
      text: "We've tried every premium brand on the market. This is the only food that solved our Golden's digestive issues while maintaining his energy levels. Worth every penny.",
      author: "Dr. Sarah Mitchell",
      role: "Veterinarian & Dog Owner",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    },
    {
      text: "As a professional trainer working with over 200 dogs annually, I exclusively recommend this brand. The difference in coat quality and performance is measurable.",
      author: "Marcus Chen",
      role: "Professional Dog Trainer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    },
    {
      text: "Transitioning our rescue facility to this food reduced health issues by 40%. The investment in quality nutrition pays off in healthier, happier dogs.",
      author: "Jennifer Rodriguez",
      role: "Rescue Facility Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
    }
  ];

  const certifications = [
    { name: "AAFCO Certified", icon: Shield },
    { name: "Non-GMO", icon: Leaf },
    { name: "Human Grade", icon: Award },
    { name: "USDA Organic", icon: Check }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Optimal Health",
      description: "Veterinary-formulated for complete nutrition"
    },
    {
      icon: Zap,
      title: "Peak Performance",
      description: "Enhanced energy and vitality at every age"
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Rigorous testing and safety standards"
    },
    {
      icon: Leaf,
      title: "Natural Ingredients",
      description: "Human-grade, sustainably sourced"
    }
  ];

  const trustBadges = [
    { icon: Truck, text: "Free Shipping Over $75" },
    { icon: Lock, text: "Secure Checkout" },
    { icon: Package, text: "30-Day Returns" },
    { icon: Gift, text: "Rewards Program" }
  ];

  const categories = [
    { name: "Adult Dogs", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop", count: 12 },
    { name: "Puppies", image: "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=400&fit=crop", count: 8 },
    { name: "Senior Dogs", image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop", count: 6 },
    { name: "Working Dogs", image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop", count: 10 },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Free Shipping Banner */}
      {/* <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-xs sm:text-sm font-semibold">
        🎉 FREE SHIPPING on orders over $75 • Use code: NOURISH10 for 10% off your first order
      </div> */}

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/95 z-[100] flex items-start justify-center pt-20 px-4"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for products, formulas, ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-14 pr-14 py-5 text-lg rounded-xl bg-background border-2 border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Quick Search Suggestions */}
              <div className="mt-6 bg-background rounded-xl p-6 shadow-elevated">
                <p className="text-sm font-semibold text-muted-foreground mb-4">POPULAR SEARCHES</p>
                <div className="flex flex-wrap gap-2">
                  {['Grain-Free', 'Puppy Food', 'Senior Formula', 'High Protein', 'Salmon Recipe'].map((term) => (
                    <button
                      key={term}
                      className="px-4 py-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full text-sm font-medium transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                
                <p className="text-sm font-semibold text-muted-foreground mt-6 mb-4">QUICK BUY</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {quickBuyProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={addToCart}
                      className="group text-left p-3 rounded-xl hover:bg-muted transition-all"
                    >
                      <img src={product.image} alt={product.name} className="w-full aspect-square object-cover rounded-lg mb-2" />
                      <p className="text-sm font-semibold truncate">{product.name}</p>
                      <p className="text-primary font-bold">${product.price}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#FAF3E1] backdrop-blur-xl shadow-premium' : 'bg-background'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center space-x-3">
              <img 
                src="https://i.ibb.co/99XT05ZF/New-Logo-Tinny-transparent.png" 
                alt="Nourish Logo"
                className="w-24 sm:w-28 lg:w-32 h-12 sm:h-14 lg:h-16 object-contain"
              />
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center space-x-3 px-4 py-2.5 bg-muted hover:bg-muted/80 rounded-xl text-muted-foreground transition-all border border-border"
              >
                <Search className="w-5 h-5" />
                <span className="text-sm">Search products...</span>
                <span className="ml-auto text-xs bg-background px-2 py-1 rounded">⌘K</span>
              </button>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <a href="#products" className="text-foreground hover:text-primary transition-colors font-medium">Shop All</a>
              <a href="#categories" className="text-foreground hover:text-primary transition-colors font-medium">Categories</a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-colors font-medium">Reviews</a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-colors font-medium">Our Story</a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-colors font-medium">Contact</a>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Search */}
              <button 
                onClick={() => setSearchOpen(true)}
                className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <button className="relative p-2 text-foreground hover:text-primary transition-colors">
                <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-accent text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>
              {/* <button className="hidden sm:block bg-primary hover:bg-accent text-primary-foreground px-4 sm:px-6 lg:px-8 py-2 lg:py-3 rounded-lg font-semibold transition-all shadow-premium hover:shadow-elevated hover:scale-105 text-sm lg:text-base">
                Shop Now
              </button> */}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Image Slideshow */}
      <section className="relative top-12 pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-24 px-4 sm:px-6 lg:px-12 overflow-hidden min-h-[90vh] flex items-center bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="max-w-[1400px] mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 lg:space-y-8"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-primary/20"
              >
                <Award className="w-4 h-4 text-primary" />
                <span className="text-xs sm:text-sm font-semibold text-primary">#1 Rated Premium Dog Food 2024</span>
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                Nutrition That
                <span className="block text-primary mt-2">Dogs Deserve</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Premium, vet-approved formulas crafted with real ingredients. See the difference in 30 days or your money back.
              </p>

              {/* Quick Add to Cart */}
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-lg">
                <p className="text-sm font-semibold text-muted-foreground mb-3">QUICK BUY - BESTSELLERS</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {quickBuyProducts.map((product) => (
                    <motion.button
                      key={product.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addToCart}
                      className="flex-shrink-0 bg-muted hover:bg-primary/10 rounded-xl p-3 transition-all group"
                    >
                      <img src={product.image} alt={product.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg mb-2" />
                      <p className="text-xs sm:text-sm font-semibold truncate max-w-[80px]">{product.name}</p>
                      <p className="text-primary font-bold text-sm">${product.price}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="group bg-primary hover:bg-accent text-primary-foreground px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl font-semibold text-base lg:text-lg transition-all shadow-premium hover:shadow-elevated hover:scale-105 flex items-center justify-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Shop All Products</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-foreground text-foreground px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl font-semibold text-base lg:text-lg hover:bg-foreground hover:text-background transition-all flex items-center justify-center space-x-2">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Watch Story</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-4 pt-4">
                {certifications.map((cert, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <cert.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span className="text-xs sm:text-sm font-semibold text-foreground">{cert.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hero Image Slideshow */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="absolute inset-0 bg-primary rounded-3xl transform rotate-3 opacity-20 blur-2xl"></div>
              <div className="relative bg-card rounded-2xl lg:rounded-3xl shadow-elevated overflow-hidden">
                <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[650px]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentHeroImage}
                      src={heroImages[currentHeroImage].src}
                      alt={heroImages[currentHeroImage].title}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.7 }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  
                  {/* Slideshow Indicators */}
                  <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentHeroImage(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === currentHeroImage ? 'bg-primary w-8' : 'bg-background/50 w-4 hover:bg-background/70'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/95 via-foreground/80 to-transparent p-4 sm:p-6 lg:p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentHeroImage}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-background"
                    >
                      {/* <p className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-primary">{heroImages[currentHeroImage].subtitle}</p>
                      <h3 className="text-xl sm:text-2xl font-bold">{heroImages[currentHeroImage].title}</h3> */}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-6 sm:py-8 lg:py-10 bg-card border-y border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trustBadges.map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left"
              >
                <badge.icon className="w-7 h-7 sm:w-9 sm:h-9 text-primary" />
                <span className="text-xs sm:text-sm font-semibold text-foreground">{badge.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section id="categories" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 bg-background">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-8 lg:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Shop by Category</h2>
              <p className="text-muted-foreground mt-2">Find the perfect formula for your dog</p>
            </div>
            <button className="hidden sm:flex items-center space-x-2 text-primary font-semibold hover:underline">
              <span>View All</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category, idx) => (
              <motion.a
                key={idx}
                href="#products"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer"
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-background">
                  <h3 className="text-lg sm:text-xl font-bold">{category.name}</h3>
                  <p className="text-sm text-background/80">{category.count} products</p>
                </div>
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop Now
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Parallax */}
      <motion.section 
        style={{ y: statsY }}
        className="py-12 sm:py-16 lg:py-20 bg-foreground"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary mx-auto mb-2 sm:mb-3" />
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-background mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base text-muted font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-background">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">Why Choose Earth & Harvest</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Premium nutrition backed by science and trusted by professionals worldwide
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-premium transition-all hover:-translate-y-2 border border-border"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">{benefit.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-secondary/30">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">Premium Product Line</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Each formula is meticulously crafted with veterinary nutritionists to meet the specific needs of your dog's life stage and lifestyle.
            </p>
          </motion.div>

          <div className="flex justify-center flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-12">
            {['all', 'premium', 'performance', 'wellness'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground shadow-premium scale-105'
                    : 'bg-card text-foreground hover:bg-muted border border-border'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 lg:gap-8">
            {products
              .filter(p => activeTab === 'all' || p.category === activeTab)
              .map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-elevated transition-all border border-border"
                >
                  <div className="grid md:grid-cols-2">
                    <div className="relative h-64 sm:h-80 md:h-full overflow-hidden bg-muted">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-accent text-primary-foreground px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                        {product.badge}
                      </div>
                      <button className="absolute top-4 right-4 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-all shadow-lg group-hover:scale-110">
                        <Heart className="w-5 h-5 text-foreground" />
                      </button>
                      {product.oldPrice && (
                        <div className="absolute bottom-4 left-4 bg-accent text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                          SAVE {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                        </div>
                      )}
                    </div>
                    <div className="p-6 sm:p-8 flex flex-col justify-between">
                      <div>
                        <div className="text-primary text-xs sm:text-sm font-semibold mb-2">{product.subtitle}</div>
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">{product.name}</h3>
                        
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-accent fill-accent' : 'text-muted'}`} />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                        </div>

                        <div className="space-y-2 mb-6">
                          {product.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-muted-foreground">
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-xs sm:text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-baseline space-x-2 mb-4">
                          <span className="text-2xl sm:text-3xl font-bold text-foreground">${product.price}</span>
                          {product.oldPrice && (
                            <span className="text-base sm:text-lg text-muted-foreground line-through">${product.oldPrice}</span>
                          )}
                          <span className="text-sm text-muted-foreground">/ {product.weight}</span>
                        </div>
                        <button 
                          onClick={addToCart}
                          className="w-full bg-primary hover:bg-accent text-primary-foreground py-3 sm:py-4 rounded-lg font-semibold transition-all shadow-premium hover:shadow-elevated hover:scale-105 flex items-center justify-center space-x-2"
                        >
                          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Add to Cart</span>
                        </button>
                        <p className="text-xs text-center text-primary mt-2 font-medium">Free shipping on this item</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 sm:py-20 lg:py-24 bg-background px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-center mb-12 sm:mb-16">Trusted by Professionals</h2>
          </motion.div>
          
          <div className="relative bg-card rounded-2xl lg:rounded-3xl shadow-elevated p-8 sm:p-12 lg:p-16 border border-border">
            <div className="absolute top-6 sm:top-8 left-6 sm:left-8 text-primary opacity-20">
              <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10 8c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.157-.672 4.243-1.757L12 24h6l2-8c0-3.314-2.686-6-6-6zm10 0c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.157-.672 4.243-1.757L22 24h6l2-8c0-3.314-2.686-6-6-6z"/>
              </svg>
            </div>
            
            <div className="text-center max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-lg sm:text-xl lg:text-2xl text-foreground leading-relaxed mb-6 sm:mb-8 italic"
                >
                  "{testimonials[currentTestimonial].text}"
                </motion.p>
              </AnimatePresence>
              <div className="flex items-center justify-center space-x-4">
                <img 
                  src={testimonials[currentTestimonial].image} 
                  alt={testimonials[currentTestimonial].author}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-primary"
                />
                <div className="text-left">
                  <div className="font-bold text-foreground text-base sm:text-lg">{testimonials[currentTestimonial].author}</div>
                  <div className="text-muted-foreground text-sm">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentTestimonial ? 'bg-primary w-8' : 'bg-muted w-2'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-secondary/30">
        <div className="max-w-[800px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Join Our Pack</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8">
              Get exclusive offers, nutrition tips, and be the first to know about new products
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg border-2 border-border bg-card text-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button className="bg-primary hover:bg-accent text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all shadow-premium hover:shadow-elevated whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-4">By subscribing, you agree to our Privacy Policy</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-foreground">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-background mb-4 sm:mb-6">
              Ready to Transform Your Dog's Health?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted mb-8 sm:mb-10 max-w-2xl mx-auto">
              Join thousands of veterinarians, trainers, and pet parents who trust Earth & Harvest for superior canine nutrition.
            </p>
            <button className="bg-background hover:bg-muted text-foreground px-8 sm:px-10 lg:px-12 py-4 sm:py-5 rounded-lg font-bold text-base lg:text-lg transition-all shadow-elevated hover:shadow-premium hover:scale-105 inline-flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Shop Premium Collection</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-primary mt-4 sm:mt-6 text-sm font-medium">Free shipping on orders over $75 • 90-day satisfaction guarantee</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-muted-foreground py-12 sm:py-16 px-4 sm:px-6 lg:px-12 pb-24 lg:pb-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-6">
                <img 
                  src="https://i.ibb.co/99XT05ZF/New-Logo-Tinny-transparent.png" 
                  alt="Nourish Logo"
                  className="w-24 h-20 object-contain"
                />
                {/* <div>
                  <div className="text-xl sm:text-2xl font-bold text-background">Earth & Harvest</div>
                  <div className="text-[10px] tracking-widest text-muted uppercase">Premium Canine Nutrition</div>
                </div> */}
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md">
                Setting the industry standard for premium dog nutrition since 2015. Trusted by veterinarians and loved by dogs worldwide.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                {['Li', 'Ig', 'Fb', 'Tw'].map((social) => (
                  <button key={social} className="w-10 h-10 bg-card hover:bg-primary rounded-lg transition-colors flex items-center justify-center text-sm font-bold text-foreground hover:text-primary-foreground">
                    {social}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-background font-bold mb-4 text-base sm:text-lg">Shop</h4>
              <ul className="space-y-3 text-sm sm:text-base">
                <li><a href="#" className="hover:text-primary transition-colors">Premium Line</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Performance Series</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Wellness Range</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Specialty Formulas</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-background font-bold mb-4 text-base sm:text-lg">Company</h4>
              <ul className="space-y-3 text-sm sm:text-base">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Our Science</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-background font-bold mb-4 text-base sm:text-lg">Support</h4>
              <ul className="space-y-3 text-sm sm:text-base">
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-sm">
            <p className="text-muted-foreground">
              © 2025 Earth & Harvest. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-50">
        <div className="grid grid-cols-4 h-16">
          <a href="#categories" className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
            <Package className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Shop</span>
          </a>
          <button 
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors"
          >
            <Search className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Search</span>
          </button>
          <a href="#testimonials" className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
            <Star className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Reviews</span>
          </a>
          <button className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors relative">
            <ShoppingCart className="w-5 h-5 mb-1" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1/2 translate-x-3 -translate-y-1 bg-accent text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-xs font-medium">Cart</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
