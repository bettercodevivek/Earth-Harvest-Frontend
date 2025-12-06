import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check, Star, Heart, Truck, Lock, Package, Gift, Minus, Plus, Shield, Leaf, Award, ChevronDown, ChevronRight } from 'lucide-react';

const Product = () => {
  const [selectedSize, setSelectedSize] = useState('30');
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const product = {
    name: "NOURISH Complete",
    tagline: "Premium All-in-One Dog Nutrition",
    description: "Our revolutionary formula combines 47 essential nutrients with real, human-grade ingredients. Developed with veterinary nutritionists for optimal health at every life stage.",
    longDescription: "NOURISH Complete is more than just dog food – it's a comprehensive nutrition system designed to support your dog's health from the inside out. Every ingredient is carefully selected and balanced to provide complete nutrition for dogs of all breeds and ages.",
    rating: 4.9,
    reviews: 12847,
    sizes: [
      { weight: '15', price: 49.99, oldPrice: 64.99, servings: '~30 days (small dog)' },
      { weight: '30', price: 89.99, oldPrice: 119.99, servings: '~30 days (medium dog)' },
      { weight: '45', price: 124.99, oldPrice: 169.99, servings: '~30 days (large dog)' },
    ],
    images: [
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=800&fit=crop",
    ]
  };

  const currentPrice = product.sizes.find(s => s.weight === selectedSize);

  const addToCart = () => {
    setCartCount(prev => prev + quantity);
  };

  const features = [
    { icon: Shield, title: "Vet Formulated", desc: "Developed with leading veterinary nutritionists" },
    { icon: Leaf, title: "100% Natural", desc: "No artificial colors, flavors, or preservatives" },
    { icon: Award, title: "Human Grade", desc: "Every ingredient meets human food standards" },
    { icon: Heart, title: "Complete Nutrition", desc: "47 essential nutrients in every serving" },
  ];

  const nutritionFacts = [
    { name: "Crude Protein", value: "32% min" },
    { name: "Crude Fat", value: "18% min" },
    { name: "Crude Fiber", value: "4% max" },
    { name: "Moisture", value: "10% max" },
    { name: "Omega-3 Fatty Acids", value: "0.5% min" },
    { name: "Omega-6 Fatty Acids", value: "3% min" },
  ];

  const guarantees = [
    { icon: Truck, text: "Free Shipping", subtext: "On all orders" },
    { icon: Lock, text: "90-Day Guarantee", subtext: "Full refund, no questions" },
    { icon: Package, text: "Subscribe & Save", subtext: "20% off recurring orders" },
    { icon: Gift, text: "Free Sample Pack", subtext: "With every order" },
  ];

  const faqs = [
    { q: "What size should I choose?", a: "15 lbs is perfect for small dogs (under 20 lbs), 30 lbs for medium dogs (20-50 lbs), and 45 lbs for large dogs (50+ lbs). Each bag lasts approximately 30 days." },
    { q: "Is this suitable for puppies?", a: "Yes! NOURISH Complete is formulated for all life stages, from puppies (8 weeks+) to senior dogs. The balanced nutrient profile supports healthy growth and development." },
    { q: "How do I transition my dog?", a: "We recommend a 7-day transition: Start with 25% NOURISH mixed with current food, increasing by 25% every 2 days. Full instructions included with your order." },
    { q: "What if my dog doesn't like it?", a: "We offer a 90-day money-back guarantee. If your dog doesn't love NOURISH Complete, we'll refund your purchase in full – no questions asked." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Promo Banner */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-xs sm:text-sm font-semibold">
        🎁 LAUNCH SPECIAL: 25% OFF + FREE SHIPPING • Code: <span className="font-bold">HEALTHYDOG</span>
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-background/95 backdrop-blur-xl shadow-premium py-2' : 'bg-background py-3'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">Back</span>
              </Link>
              <img 
                src="https://i.ibb.co/99XT05ZF/New-Logo-Tinny-transparent.png" 
                alt="Nourish Logo"
                className="w-24 sm:w-28 h-10 sm:h-12 object-contain"
              />
            </div>

            <div className="flex items-center space-x-3">
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
            </div>
          </div>
        </div>
      </nav>

      {/* Product Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Images */}
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative aspect-square rounded-2xl overflow-hidden bg-muted"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={product.images[selectedImage]}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <button className="absolute top-4 right-4 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-all shadow-lg">
                  <Heart className="w-5 h-5 text-foreground" />
                </button>
                <div className="absolute top-4 left-4 bg-accent text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                  SAVE 25%
                </div>
              </motion.div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden transition-all ${
                      selectedImage === idx ? 'ring-2 ring-primary ring-offset-2' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="inline-flex items-center space-x-1 bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-bold">
                    <Star className="w-3 h-3 fill-accent" />
                    <span>BESTSELLER</span>
                  </span>
                  <span className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                    <Shield className="w-3 h-3" />
                    <span>VET APPROVED</span>
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                <p className="text-lg text-primary font-semibold">{product.tagline}</p>
              </div>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                  ))}
                </div>
                <span className="font-bold text-foreground">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews.toLocaleString()} reviews)</span>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Size Selection */}
              <div className="space-y-3">
                <p className="font-semibold text-foreground">Select Size:</p>
                <div className="grid grid-cols-3 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.weight}
                      onClick={() => setSelectedSize(size.weight)}
                      className={`p-4 rounded-xl text-center transition-all ${
                        selectedSize === size.weight
                          ? 'bg-primary text-primary-foreground shadow-premium ring-2 ring-primary ring-offset-2'
                          : 'bg-card text-foreground border border-border hover:border-primary'
                      }`}
                    >
                      <p className="font-bold text-lg">{size.weight} lbs</p>
                      <p className={`text-xs ${selectedSize === size.weight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {size.servings}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-4xl font-bold text-foreground">${currentPrice?.price}</span>
                  <span className="text-xl text-muted-foreground line-through">${currentPrice?.oldPrice}</span>
                  <span className="bg-accent text-primary-foreground px-3 py-1 rounded text-sm font-bold">
                    SAVE ${((currentPrice?.oldPrice || 0) - (currentPrice?.price || 0)).toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center border border-border rounded-xl overflow-hidden">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-4 hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 font-semibold text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-4 hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button 
                    onClick={addToCart}
                    className="flex-1 bg-primary hover:bg-accent text-primary-foreground py-4 px-8 rounded-xl font-bold text-lg transition-all shadow-premium hover:shadow-elevated hover:scale-[1.02] flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {guarantees.slice(0, 2).map((g, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      <g.icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{g.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscribe Option */}
              <div className="bg-secondary/50 border border-primary/20 rounded-2xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-foreground flex items-center gap-2">
                      <Gift className="w-5 h-5 text-primary" />
                      Subscribe & Save 20%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Auto-delivery every 30 days. Cancel anytime.
                    </p>
                  </div>
                  <p className="font-bold text-primary text-lg">
                    ${((currentPrice?.price || 0) * 0.8).toFixed(2)}/mo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-secondary/30">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nutrition Facts */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            Guaranteed Analysis
          </h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {nutritionFacts.map((fact, idx) => (
              <div 
                key={idx}
                className={`flex justify-between items-center p-4 ${idx !== nutritionFacts.length - 1 ? 'border-b border-border' : ''}`}
              >
                <span className="font-medium text-foreground">{fact.name}</span>
                <span className="text-muted-foreground">{fact.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-secondary/30">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            Common Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
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
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-muted-foreground">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-foreground">
        <div className="max-w-[600px] mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-background mb-4">
            Ready to Transform Your Dog's Health?
          </h2>
          <p className="text-muted mb-6">
            Join 2.3 million happy pet parents. 90-day money-back guarantee.
          </p>
          <button 
            onClick={addToCart}
            className="bg-primary hover:bg-accent text-primary-foreground px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-premium hover:scale-105 inline-flex items-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart - ${currentPrice?.price}</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-muted-foreground py-8 px-4 sm:px-6 lg:px-12 pb-24 lg:pb-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <img 
              src="https://i.ibb.co/99XT05ZF/New-Logo-Tinny-transparent.png" 
              alt="Nourish Logo"
              className="w-24 h-10 object-contain"
            />
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
            <p className="text-sm">© 2024 NOURISH</p>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-elevated z-50 p-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-bold text-foreground text-lg">${currentPrice?.price}</p>
            <p className="text-xs text-muted-foreground line-through">${currentPrice?.oldPrice}</p>
          </div>
          <button 
            onClick={addToCart}
            className="flex-[2] bg-primary text-primary-foreground py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
