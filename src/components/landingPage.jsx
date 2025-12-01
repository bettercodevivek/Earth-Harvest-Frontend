import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ShoppingCart, ArrowRight, Play, Check, Award, Leaf, Shield, Users, TrendingUp, Globe, Star, Heart, Zap, Truck, Lock, Package, Gift } from 'lucide-react';

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, 150]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const statsY = useTransform(smoothProgress, [0.1, 0.4], [100, 0]);

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

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-xs sm:text-sm font-semibold">
        🎉 FREE SHIPPING on orders over $75 • Use code: EARTH10 for 10% off your first order
      </div>

      <nav className={`sticky top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-background/95 backdrop-blur-xl shadow-premium' : 'bg-background'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center space-x-3">
              <img 
                src="https://i.ibb.co/99XT05ZF/New-Logo-Tinny-transparent.png" 
                alt="Nourish Logo"
                className="w-24 sm:w-28 lg:w-32 h-12 sm:h-14 lg:h-16 object-contain"
              />
            </div>
            
            <div className="hidden lg:flex items-center space-x-8 xl:space-x-10">
              <a href="#products" className="text-foreground hover:text-primary transition-colors font-medium">Shop</a>
              <a href="#science" className="text-foreground hover:text-primary transition-colors font-medium">Our Science</a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">About</a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-colors font-medium">Reviews</a>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-foreground hover:text-primary transition-colors">
                <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="bg-primary hover:bg-accent text-primary-foreground px-4 sm:px-6 lg:px-8 py-2 lg:py-3 rounded-lg font-semibold transition-all shadow-premium hover:shadow-elevated hover:scale-105 text-sm lg:text-base">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-12 sm:pt-16 lg:pt-24 pb-16 sm:pb-20 lg:pb-32 px-4 sm:px-6 lg:px-12 overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-premium"></div>
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 opacity-[0.03]"
        >
          <img src='/pattern-bg.jpg' alt="" className="w-full h-full object-cover" />
        </motion.div>
        
        <div className="max-w-[1400px] mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
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
                className="inline-flex items-center space-x-2 bg-bronze/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-bronze/20"
              >
                <Award className="w-4 h-4 text-bronze" />
                <span className="text-xs sm:text-sm font-semibold text-bronze-dark">Trusted by 2.3M+ Pet Parents Worldwide</span>
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                Science-Backed Nutrition for
                <span className="block text-primary mt-2"> Peak Performance</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Engineered by veterinary nutritionists and trusted by professionals. Every formula is crafted with human-grade ingredients and backed by clinical research.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="group bg-primary hover:bg-accent text-primary-foreground px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-lg font-semibold text-base lg:text-lg transition-all shadow-premium hover:shadow-elevated hover:scale-105 flex items-center justify-center space-x-2">
                  <span>Shop Premium Collection</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-foreground text-foreground px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-lg font-semibold text-base lg:text-lg hover:bg-foreground hover:text-background transition-all flex items-center justify-center space-x-2">
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

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="absolute inset-0 bg-primary rounded-3xl transform rotate-3 opacity-20 blur-2xl"></div>
              <div className="relative bg-card rounded-2xl lg:rounded-3xl shadow-elevated overflow-hidden">
                <img 
                  src='/20251202_0058_Luxurious Dog Chew Scene_remix_01kbdp3v53er4tx9gv6h3nf06c.png'
                  alt="Premium dog"
                  className="w-full h-[350px] sm:h-[450px] lg:h-[550px] xl:h-[700px] object-cover"
                />
                {/* <div className="absolute bottom-0 left-0 right-0 bg-foreground/90 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
                  <div className="text-background">
                    <p className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-primary">Featured Formula</p>
                    <h3 className="text-xl sm:text-2xl font-bold mb-1">Heritage Grain-Free</h3>
                    <p className="text-sm sm:text-base text-background/80">The choice of champions</p>
                  </div>
                </div> */}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 bg-card border-y border-border">
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
                <badge.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                <span className="text-xs sm:text-sm font-semibold text-foreground">{badge.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


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
                <div className="text-sm sm:text-base text-bronze-light font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>


      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-background">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">Why Choose NOURISH</h2>
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
              <p className="text-lg sm:text-xl lg:text-2xl text-foreground leading-relaxed mb-6 sm:mb-8 italic">
                "{testimonials[currentTestimonial].text}"
              </p>
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
            <p className="text-base sm:text-lg lg:text-xl text-bronze-light mb-8 sm:mb-10 max-w-2xl mx-auto">
              Join thousands of veterinarians, trainers, and pet parents who trust NOURISH for superior canine nutrition.
            </p>
            <button className="bg-background hover:bg-muted text-foreground px-8 sm:px-10 lg:px-12 py-4 sm:py-5 rounded-lg font-bold text-base lg:text-lg transition-all shadow-elevated hover:shadow-premium hover:scale-105 inline-flex items-center space-x-2">
              <span>Shop Premium Collection</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-primary mt-4 sm:mt-6 text-sm font-medium">Free shipping on orders over $75 • 90-day satisfaction guarantee</p>
          </motion.div>
        </div>
      </section>

      <footer className="bg-foreground text-muted-foreground py-12 sm:py-16 px-4 sm:px-6 lg:px-12 pb-24 lg:pb-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-6">
                <img 
                  src="https://i.ibb.co/99XT05ZF/New-Logo-Tinny-transparent.png" 
                  alt="Nourish Logo"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-background">NOURISH</div>
                  <div className="text-[10px] tracking-widest text-bronze uppercase">Premium Canine Nutrition</div>
                </div>
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
              © 2024 NOURISH Corporation. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>

      <nav className="lg:hidden fixed bg-white bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-50">
        <div className="grid grid-cols-4 h-16">
          <a href="#products" className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
            <Package className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Shop</span>
          </a>
          <a href="#science" className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
            <Shield className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Science</span>
          </a>
          <a href="#testimonials" className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
            <Star className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Reviews</span>
          </a>
          <a href="#cart" className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors relative">
            <ShoppingCart className="w-5 h-5 mb-1" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1/2 translate-x-3 -translate-y-1 bg-accent text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-xs font-medium">Cart</span>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Index;