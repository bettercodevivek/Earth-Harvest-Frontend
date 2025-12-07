import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Check, Award, Leaf, Shield, Users, Globe, Star, Heart, Zap, Truck, Lock, Package, Gift, Minus, Plus, ChevronDown, Sparkles, Clock, ThumbsUp } from 'lucide-react';
import CountUpStat from './CountUpStat';

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [currentIngredientImage, setCurrentIngredientImage] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState('30');
  const [quantity, setQuantity] = useState(1);
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, 100]);
  const parallaxY = useTransform(smoothProgress, [0, 1], [0, -100]);

  const heroImages = [
    {
      src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&h=1400&fit=crop",
      alt: "Happy Golden Retriever"
    },
    {
      src: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&h=1400&fit=crop",
      alt: "Healthy Labrador"
    },
    {
      src: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1200&h=1400&fit=crop",
      alt: "Energetic German Shepherd"
    },
    {
      src: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=1200&h=1400&fit=crop",
      alt: "Active Border Collie"
    }
  ];

  const ingredientImages = [
    {
      src: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&h=1000&fit=crop",
      alt: "Premium dog food ingredients"
    },
    {
      src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1000&fit=crop",
      alt: "Fresh salmon and vegetables"
    },
    {
      src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=1000&fit=crop",
      alt: "Natural organic ingredients"
    },
    {
      src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=1000&fit=crop",
      alt: "Healthy superfoods"
    }
  ];

  const product = {
    name: "NOURISH Complete",
    tagline: "The Only Dog Food Your Best Friend Needs",
    description: "Our revolutionary all-in-one formula, meticulously crafted with 47 premium ingredients. Veterinary-approved nutrition that adapts to every life stage.",
    price: 89.99,
    oldPrice: 119.99,
    rating: 4.9,
    reviews: 12847,
    sizes: [
      { weight: '15', price: 49.99, oldPrice: 64.99 },
      { weight: '30', price: 89.99, oldPrice: 119.99 },
      { weight: '45', price: 124.99, oldPrice: 169.99 },
    ]
  };

  const currentPrice = product.sizes.find(s => s.weight === selectedSize);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIngredientImage((prev) => (prev + 1) % ingredientImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [ingredientImages.length]);

  const addToCart = () => {
    setCartCount(prev => prev + quantity);
  };

  const stats = [
    { value: 2300000, label: "Happy Dogs", icon: Heart, suffix: "+" },
    { value: 47, label: "Countries", icon: Globe },
    { value: 99, label: "Satisfaction", icon: Award, suffix: "%" },
    { value: 1, label: "Vet Recommended", icon: Shield, prefix: "#" }
  ];

  const testimonials = [
    {
      text: "After 3 weeks on NOURISH Complete, Max's coat is shinier than ever. His energy levels are through the roof, and he actually gets excited for meal time now!",
      author: "Dr. Sarah Mitchell",
      role: "Veterinarian & Golden Retriever Owner",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      rating: 5
    },
    {
      text: "I've recommended NOURISH to over 500 clients this year. The results speak for themselves - healthier coats, better digestion, and more vitality.",
      author: "Marcus Chen",
      role: "Professional Dog Trainer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      rating: 5
    },
    {
      text: "Switching our entire rescue facility to NOURISH reduced health issues by 40%. It's now the only food we trust for our 200+ dogs.",
      author: "Jennifer Rodriguez",
      role: "Rescue Facility Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      rating: 5
    },
    {
      text: "My picky eater finally loves his food! NOURISH Complete changed everything. Worth every penny for the peace of mind.",
      author: "David Thompson",
      role: "French Bulldog Dad",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      rating: 5
    }
  ];

  const ingredients = [
    { name: "Wild-Caught Salmon", benefit: "Omega-3 for coat health", icon: "🐟" },
    { name: "Organic Chicken", benefit: "Lean protein for muscles", icon: "🍗" },
    { name: "Sweet Potato", benefit: "Healthy carbs & fiber", icon: "🍠" },
    { name: "Blueberries", benefit: "Antioxidant powerhouse", icon: "🫐" },
    { name: "Spinach", benefit: "Iron & vitamins", icon: "🥬" },
    { name: "Coconut Oil", benefit: "Skin & digestive health", icon: "🥥" },
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Complete Nutrition",
      description: "47 essential nutrients for whole-body health at every life stage"
    },
    {
      icon: Zap,
      title: "Visible Energy",
      description: "See the difference in 14 days or your money back"
    },
    {
      icon: Shield,
      title: "Vet Approved",
      description: "Developed with leading veterinary nutritionists"
    },
    {
      icon: Leaf,
      title: "Clean Ingredients",
      description: "No fillers, no artificial anything. Just real food."
    }
  ];

  const guarantees = [
    { icon: Truck, title: "Free Shipping", desc: "On all orders" },
    { icon: Lock, title: "90-Day Guarantee", desc: "Full refund, no questions" },
    { icon: Package, title: "Subscribe & Save", desc: "20% off recurring" },
    { icon: Gift, title: "Free Sample", desc: "With every order" }
  ];

  const transformationSteps = [
    {
      icon: Clock,
      day: "Day 1-7",
      title: "Transition Period",
      description: "Gradual introduction to NOURISH. Your dog starts accepting the new taste profile."
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
      q: "Is NOURISH Complete suitable for all dog breeds and ages?",
      a: "Yes! Our formula is designed to provide complete nutrition for all breeds, from puppies (8 weeks+) to senior dogs. The balanced nutrient profile adapts to your dog's needs."
    },
    {
      q: "How long until I see results?",
      a: "Most pet parents notice improved energy within 7 days, and visible coat improvements within 14-21 days. We're so confident, we offer a 90-day money-back guarantee."
    },
    {
      q: "What makes NOURISH different from other premium brands?",
      a: "We use only human-grade ingredients, no fillers or by-products. Every batch is third-party tested, and we're the only brand with our proprietary Vitality Blend of 47 essential nutrients."
    },
    {
      q: "How do I transition my dog to NOURISH Complete?",
      a: "We recommend a gradual 7-day transition: Start with 25% NOURISH mixed with current food, increasing by 25% every 2 days. Full instructions included with your order."
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Promo Banner */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-xs sm:text-sm font-semibold">
        <span className="hidden sm:inline">🎁 LAUNCH SPECIAL: </span>
        25% OFF + FREE SHIPPING • Code: <span className="font-bold">HEALTHYDOG</span>
        <span className="hidden md:inline"> • Ends Sunday</span>
      </div>

      {/* <Navbar cartCount={cartCount} /> */}

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-background" />
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-20 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 lg:space-y-8 order-2 lg:order-1"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center space-x-1 bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-bold">
                  <Star className="w-3 h-3 fill-accent" />
                  <span>BESTSELLER</span>
                </span>
                <span className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                  <Award className="w-3 h-3" />
                  <span>#1 VET RECOMMENDED</span>
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1]">
                {product.tagline.split(' ').slice(0, 3).join(' ')}
                <span className="block text-primary">{product.tagline.split(' ').slice(3).join(' ')}</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                {product.description}
              </p>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                  ))}
                </div>
                <span className="font-bold text-foreground">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews.toLocaleString()} reviews)</span>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <p className="font-semibold text-foreground">Select Size:</p>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.weight}
                      onClick={() => setSelectedSize(size.weight)}
                      className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                        selectedSize === size.weight
                          ? 'bg-primary text-primary-foreground shadow-premium ring-2 ring-primary ring-offset-2'
                          : 'bg-card text-foreground border border-border hover:border-primary'
                      }`}
                    >
                      {size.weight} lbs
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">${currentPrice?.price}</span>
                  <span className="text-lg sm:text-xl text-muted-foreground line-through">${currentPrice?.oldPrice}</span>
                  <span className="bg-accent text-primary-foreground px-2 py-1 rounded text-xs font-bold">
                    SAVE {Math.round(((currentPrice?.oldPrice || 0) - (currentPrice?.price || 0)) / (currentPrice?.oldPrice || 1) * 100)}%
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-border rounded-xl overflow-hidden">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-3 hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 sm:px-6 font-semibold">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-3 hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button 
                    onClick={addToCart}
                    className="flex-1 bg-primary hover:bg-accent text-primary-foreground py-3 sm:py-4 px-6 rounded-xl font-bold text-base sm:text-lg transition-all shadow-premium hover:shadow-elevated hover:scale-[1.02] flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-muted-foreground pt-2">
                  <span className="flex items-center space-x-1">
                    <Truck className="w-4 h-4 text-primary" />
                    <span>Free Shipping</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Lock className="w-4 h-4 text-primary" />
                    <span>90-Day Guarantee</span>
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right - Image Slideshow with Ken Burns Effect */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative order-1 lg:order-2"
            >
              <motion.div 
                style={{ y: heroY }}
                className="absolute -inset-8 bg-primary/20 rounded-[3rem] blur-3xl"
              />
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-elevated">
                <div className="relative aspect-[4/5] sm:aspect-[3/4]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentHeroImage}
                      src={heroImages[currentHeroImage].src}
                      alt={heroImages[currentHeroImage].alt}
                      initial={{ opacity: 0, scale: 1.2 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        transition: { 
                          opacity: { duration: 0.8, ease: "easeOut" },
                          scale: { duration: 4, ease: "linear" }
                        }
                      }}
                      exit={{ 
                        opacity: 0, 
                        transition: { duration: 0.5 }
                      }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/20">
                    <motion.div 
                      key={currentHeroImage}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, ease: "linear" }}
                      className="h-full bg-primary"
                    />
                  </div>
                  
                  {/* Slideshow Dots */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentHeroImage(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentHeroImage ? 'bg-primary w-8' : 'bg-background/60 w-2 hover:bg-background'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-4 -left-4 sm:bottom-8 sm:-left-8 bg-card border border-border rounded-2xl p-4 shadow-elevated"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">2.3M+ Dogs</p>
                    <p className="text-sm text-muted-foreground">Fed & Thriving</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 sm:py-8 bg-foreground">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {guarantees.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-3"
              >
                <item.icon className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-bold text-background text-sm">{item.title}</p>
                  <p className="text-xs text-muted">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats with Counting Animation */}
      <section className="py-12 sm:py-16 bg-secondary/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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

      {/* Benefits */}
      <section id="benefits" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-background">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Why Dogs Love NOURISH</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Science-backed nutrition with ingredients you can actually pronounce
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
                className="bg-card rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-premium transition-all hover:-translate-y-2 border border-border text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 mx-auto">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients with Slideshow */}
      <section id="ingredients" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-secondary/30">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Real Food.<br />Real Results.
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Every ingredient is hand-selected for quality and purpose. No fillers, no by-products, no artificial anything.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {ingredients.map((ing, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all"
                  >
                    <span className="text-2xl mb-2 block">{ing.icon}</span>
                    <h4 className="font-bold text-foreground text-sm">{ing.name}</h4>
                    <p className="text-xs text-muted-foreground">{ing.benefit}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {['AAFCO Certified', 'Non-GMO', 'Human Grade', 'No Fillers'].map((badge) => (
                  <span key={badge} className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold">
                    <Check className="w-3 h-3" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Ingredient Image Slideshow */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ y: parallaxY }}
              className="relative"
            >
              <div className="relative rounded-2xl shadow-elevated overflow-hidden aspect-[4/5]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIngredientImage}
                    src={ingredientImages[currentIngredientImage].src}
                    alt={ingredientImages[currentIngredientImage].alt}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-background">
                  <p className="font-bold text-xl">47 Essential Nutrients</p>
                  <p className="text-sm text-background/80">In every bowl</p>
                </div>
                
                {/* Slideshow Indicators */}
                <div className="absolute top-6 right-6 flex gap-1.5">
                  {ingredientImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIngredientImage(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentIngredientImage ? 'bg-primary w-6' : 'bg-background/50 w-1.5'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Transformation Journey Section (Replaces Video) */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-foreground">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-background mb-4">
              The NOURISH Transformation
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Watch your dog transform from the very first week. Here's what to expect on this journey.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary/30 -translate-y-1/2" />
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
              {transformationSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="relative bg-card rounded-2xl p-6 shadow-elevated border border-border text-center group hover:-translate-y-2 transition-all"
                >
                  {/* Step Number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground shadow-lg">
                    {idx + 1}
                  </div>
                  
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-2 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-3">
                    {step.day}
                  </span>
                  
                  <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link 
              to="/product"
              className="inline-flex items-center space-x-2 bg-primary hover:bg-accent text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-premium hover:shadow-elevated hover:scale-105"
            >
              <span>Start Your Dog's Transformation</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-16 sm:py-20 lg:py-24 bg-background px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              12,847+ Happy Pet Parents
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-accent fill-accent" />
                ))}
              </div>
              <span className="font-bold text-foreground">4.9/5</span>
              <span className="text-muted-foreground">average rating</span>
            </div>
          </motion.div>
          
          {/* Testimonial Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-lg"
              >
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-sm text-foreground mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center space-x-3">
                  <img src={t.image} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-secondary/30">
        <div className="max-w-[800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Questions? We've Got Answers
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold text-foreground pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
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
                      <p className="px-5 pb-5 text-muted-foreground">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-primary">
        <div className="max-w-[900px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Give Your Dog The Best
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join 2.3 million pet parents who made the switch. 90-day money-back guarantee.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/product"
                className="bg-background hover:bg-muted text-foreground px-8 sm:px-12 py-4 rounded-xl font-bold text-lg transition-all shadow-elevated hover:scale-105 inline-flex items-center justify-center space-x-2"
              >
                <span>Shop Now - 25% OFF</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <p className="text-primary-foreground/70 mt-6 text-sm">
              Free shipping • 90-day guarantee • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* <Footer /> */}

      {/* Mobile Bottom CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-elevated z-50 p-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-bold text-foreground text-sm">${currentPrice?.price}</p>
            <p className="text-xs text-muted-foreground line-through">${currentPrice?.oldPrice}</p>
          </div>
          <button 
            onClick={addToCart}
            className="flex-[2] bg-primary hover:bg-accent text-primary-foreground py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
