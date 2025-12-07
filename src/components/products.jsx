import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, Check, Star, Heart, Truck, Lock, Package, Gift, Minus, Plus, 
  Shield, Leaf, Award, ChevronDown, ChevronUp, Zap, Clock, Users, 
  ThumbsUp, ThumbsDown, Camera, Share2, Bell, RotateCcw, BadgeCheck, Sparkles,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import Navbar from './Navbar'

const Product = () => {
  const [selectedSize, setSelectedSize] = useState('30');
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [helpfulReviews, setHelpfulReviews] = useState({});
  
  const imageRef = useRef(null);
  const buyBoxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (buyBoxRef.current) {
        const rect = buyBoxRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


const handleMouseMove = (e) => {
  if (!imageRef.current) return;
  
  const rect = imageRef.current.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  setZoomPosition({ x, y });
};


  const product = {
    name: "NOURISH Complete",
    tagline: "Premium All-in-One Dog Nutrition",
    brand: "NOURISH",
    description: "Our revolutionary formula combines 47 essential nutrients with real, human-grade ingredients. Developed with veterinary nutritionists for optimal health at every life stage.",
    longDescription: `NOURISH Complete is more than just dog food – it's a comprehensive nutrition system designed to support your dog's health from the inside out.

Every ingredient is carefully selected and balanced to provide complete nutrition for dogs of all breeds and ages. Our proprietary blend includes:

• Wild-caught salmon for omega-3 fatty acids
• Free-range chicken as the primary protein source  
• Ancient grains for sustained energy
• Probiotics for digestive health
• Glucosamine and chondroitin for joint support

Made in our FDA-registered facility in Colorado, each batch is tested for quality and safety before leaving our doors.`,
    rating: 4.9,
    reviews: 12847,
    answeredQuestions: 847,
    sizes: [
      { weight: '15', price: 49.99, oldPrice: 64.99, servings: '~30 days (small dog)', pricePerLb: 3.33 },
      { weight: '30', price: 89.99, oldPrice: 119.99, servings: '~30 days (medium dog)', pricePerLb: 3.00 },
      { weight: '45', price: 124.99, oldPrice: 169.99, servings: '~30 days (large dog)', pricePerLb: 2.78 },
    ],
    images: [
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=800&h=800&fit=crop",
    ],
    stock: 847,
    soldThisMonth: 5420,
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
    { icon: Zap, title: "High Energy", desc: "Optimal protein levels for active dogs" },
    { icon: RotateCcw, title: "Easy Digest", desc: "Probiotics for healthy gut flora" },
  ];

  const nutritionFacts = [
    { name: "Crude Protein", value: "32% min", bar: 85 },
    { name: "Crude Fat", value: "18% min", bar: 60 },
    { name: "Crude Fiber", value: "4% max", bar: 20 },
    { name: "Moisture", value: "10% max", bar: 30 },
    { name: "Omega-3 Fatty Acids", value: "0.5% min", bar: 40 },
    { name: "Omega-6 Fatty Acids", value: "3% min", bar: 55 },
    { name: "Glucosamine", value: "400mg/kg min", bar: 45 },
    { name: "Chondroitin", value: "200mg/kg min", bar: 35 },
  ];

  const ingredients = [
    "Deboned Chicken", "Chicken Meal", "Brown Rice", "Oatmeal", "Barley", 
    "Chicken Fat", "Salmon Meal", "Dried Beet Pulp", "Natural Flavor",
    "Flaxseed", "Salmon Oil", "Dried Egg Product", "Potatoes", "Pumpkin",
    "Blueberries", "Cranberries", "Carrots", "Spinach", "Kelp",
    "Vitamin E", "Vitamin A", "Vitamin D3", "Zinc", "Iron", "Copper"
  ];

  const guarantees = [
    { icon: Truck, text: "Free 2-Day Shipping", subtext: "On all orders over $50" },
    { icon: RotateCcw, text: "90-Day Money Back", subtext: "Full refund, no questions" },
    { icon: Package, text: "Subscribe & Save 20%", subtext: "Cancel anytime" },
    { icon: Gift, text: "Free Sample Pack", subtext: "With every first order" },
  ];

  const faqs = [
    { q: "What size should I choose?", a: "15 lbs is perfect for small dogs (under 20 lbs), 30 lbs for medium dogs (20-50 lbs), and 45 lbs for large dogs (50+ lbs). Each bag lasts approximately 30 days based on recommended feeding guidelines." },
    { q: "Is this suitable for puppies?", a: "Yes! NOURISH Complete is formulated for all life stages, from puppies (8 weeks+) to senior dogs. The balanced nutrient profile supports healthy growth and development at every age." },
    { q: "How do I transition my dog to this food?", a: "We recommend a 7-day transition: Start with 25% NOURISH mixed with current food, increasing by 25% every 2 days until fully transitioned. Full instructions and a transition guide are included with your order." },
    { q: "What if my dog doesn't like it?", a: "We offer a 90-day money-back guarantee. If your dog doesn't love NOURISH Complete, we'll refund your purchase in full – no questions asked. We'll even pay for return shipping." },
    { q: "Where is this product made?", a: "NOURISH Complete is proudly made in our FDA-registered facility in Colorado, USA. All ingredients are sourced from trusted suppliers, with proteins from North America and seafood from sustainable fisheries." },
    { q: "Is this grain-free?", a: "No, NOURISH Complete contains healthy whole grains like brown rice, oatmeal, and barley. Recent research suggests whole grains provide important nutrients and fiber. We also offer a grain-free option if needed." },
  ];

  const customerReviews = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      verified: true,
      rating: 5,
      date: "2 weeks ago",
      title: "Finally, a food my picky eater loves!",
      content: "As a veterinarian, I'm extremely selective about what I feed my own dogs. After trying countless premium brands, NOURISH Complete has become our household staple. My Golden's coat has never looked better, and his digestive issues have completely resolved. Worth every penny.",
      images: ["https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop"],
      helpful: 847,
      size: "30 lbs",
      dogBreed: "Golden Retriever",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      id: 2,
      name: "Marcus Chen",
      verified: true,
      rating: 5,
      date: "1 month ago",
      title: "Best investment for my working dog",
      content: "I train police K-9s professionally and have switched all 12 dogs in our program to NOURISH. The difference in energy, focus, and coat quality is remarkable. The subscription saves us 20% and auto-delivery means we never run out.",
      helpful: 623,
      size: "45 lbs",
      dogBreed: "German Shepherd",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      id: 3,
      name: "Jennifer Rodriguez",
      verified: true,
      rating: 5,
      date: "3 weeks ago",
      title: "Transformed our rescue facility",
      content: "We run a rescue with 40+ dogs. Since switching to NOURISH, vet bills dropped 40% and adoption rates increased because dogs look healthier. The company even donates to our organization. True partners in pet welfare!",
      helpful: 512,
      size: "45 lbs",
      dogBreed: "Various breeds",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    },
    {
      id: 4,
      name: "Tom Anderson",
      verified: true,
      rating: 4,
      date: "1 week ago",
      title: "Great quality, wish there were more sizes",
      content: "My Chihuahua loves this food and her energy levels are through the roof. Only wish they had a smaller 5lb bag option for tiny dogs. The 15lb bag takes us about 3 months, which is a long time to keep fresh.",
      helpful: 234,
      size: "15 lbs",
      dogBreed: "Chihuahua",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
    },
  ];

  const ratingBreakdown = [
    { stars: 5, percentage: 87, count: 11177 },
    { stars: 4, percentage: 9, count: 1156 },
    { stars: 3, percentage: 2, count: 257 },
    { stars: 2, percentage: 1, count: 128 },
    { stars: 1, percentage: 1, count: 129 },
  ];

 const handleHelpful = (reviewId, type) => {
  setHelpfulReviews(prev => ({
    ...prev,
    [reviewId]: prev[reviewId] === type ? null : type
  }));
};


  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} />
      
      {/* Breadcrumb */}
      <div className="bg-secondary/30 border-b border-border py-3 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <span className="hover:text-primary transition-colors cursor-pointer">Dog Food</span>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <span className="hover:text-primary transition-colors cursor-pointer">Premium</span>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <span className="text-foreground font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Product Images - Left Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex flex-col-reverse sm:flex-row gap-4">
                {/* Thumbnails */}
                <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      onMouseEnter={() => setSelectedImage(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all border-2 ${
                        selectedImage === idx ? 'border-primary' : 'border-transparent hover:border-primary/50'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Main Image with Zoom */}
                <div 
                  ref={imageRef}
                  className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-muted cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsZooming(true)}
                  onMouseLeave={() => setIsZooming(false)}
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
                      style={isZooming ? {
                        transform: 'scale(2)',
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                      } : {}}
                    />
                  </AnimatePresence>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-accent text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      SAVE 25%
                    </span>
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      #1 BESTSELLER
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button 
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        isWishlisted ? 'bg-red-500 text-white' : 'bg-background/90 backdrop-blur-sm text-foreground hover:bg-background'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button className="w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-all shadow-lg">
                      <Share2 className="w-5 h-5 text-foreground" />
                    </button>
                  </div>

                  {/* Image counter */}
                  <div className="absolute bottom-4 right-4 bg-foreground/80 text-background px-3 py-1 rounded-full text-sm font-medium">
                    {selectedImage + 1} / {product.images.length}
                  </div>

                  {/* Zoom hint */}
                  {!isZooming && (
                    <div className="absolute bottom-4 left-4 bg-foreground/80 text-background px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      Hover to zoom
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Info - Middle Column */}
            <div className="lg:col-span-4 space-y-5">
              {/* Brand & Title */}
              <div>
                <Link to="/" className="text-primary hover:underline text-sm font-semibold">{product.brand}</Link>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-1 mb-2">
                  {product.name}
                </h1>
                <p className="text-primary font-medium">{product.tagline}</p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-accent fill-accent' : 'text-muted'}`} />
                  ))}
                </div>
                <span className="text-primary font-bold">{product.rating}</span>
                <a href="#reviews" className="text-primary hover:underline text-sm">
                  {product.reviews.toLocaleString()} ratings
                </a>
                <span className="text-muted-foreground">|</span>
                <a href="#questions" className="text-primary hover:underline text-sm">
                  {product.answeredQuestions} answered questions
                </a>
              </div>

              {/* Sold count */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-accent font-semibold flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  {product.soldThisMonth.toLocaleString()}+ sold this month
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-3 py-1.5 rounded-full text-xs font-bold">
                  <Star className="w-3 h-3 fill-accent" />
                  BESTSELLER
                </span>
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold">
                  <Shield className="w-3 h-3" />
                  VET APPROVED
                </span>
                <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 px-3 py-1.5 rounded-full text-xs font-bold">
                  <BadgeCheck className="w-3 h-3" />
                  VERIFIED QUALITY
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-3">
                {features.slice(0, 4).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <feature.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buy Box - Right Column */}
            <div className="lg:col-span-3" ref={buyBoxRef}>
              <div className="bg-card border border-border rounded-2xl p-5 space-y-5 sticky top-24">
                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <span className="text-3xl font-bold text-foreground">${currentPrice?.price}</span>
                    <span className="text-lg text-muted-foreground line-through">${currentPrice?.oldPrice}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-accent text-primary-foreground px-2 py-0.5 rounded text-xs font-bold">
                      SAVE ${((currentPrice?.oldPrice || 0) - (currentPrice?.price || 0)).toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      (${currentPrice?.pricePerLb}/lb)
                    </span>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-600 font-semibold text-sm">In Stock</span>
                  <span className="text-muted-foreground text-xs">({product.stock} available)</span>
                </div>

                {/* Delivery */}
                <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">FREE 2-Day Delivery</span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-7">
                    Order within <span className="text-accent font-semibold">4 hrs 23 mins</span> for delivery by <span className="font-semibold text-foreground">Tuesday, Dec 10</span>
                  </p>
                </div>

                {/* Size Selection */}
                <div className="space-y-2">
                  <p className="font-semibold text-foreground text-sm">Size: <span className="font-normal text-muted-foreground">{selectedSize} lbs</span></p>
                  <div className="grid grid-cols-3 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size.weight}
                        onClick={() => setSelectedSize(size.weight)}
                        className={`p-3 rounded-lg text-center transition-all border-2 ${
                          selectedSize === size.weight
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <p className="font-bold text-sm text-foreground">{size.weight} lbs</p>
                        <p className="text-xs text-primary font-semibold">${size.price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">Qty:</span>
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-semibold">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => Math.min(10, q + 1))}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart */}
                <button 
                  onClick={addToCart}
                  className="w-full bg-primary hover:bg-accent text-primary-foreground py-4 rounded-xl font-bold text-lg transition-all shadow-premium hover:shadow-elevated hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>

                {/* Buy Now */}
                <button className="w-full bg-accent hover:bg-accent/90 text-primary-foreground py-4 rounded-xl font-bold text-lg transition-all shadow-premium hover:shadow-elevated hover:scale-[1.02]">
                  Buy Now
                </button>

                {/* Subscribe Option */}
                <div className="border border-primary/30 bg-primary/5 rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-primary text-primary focus:ring-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-primary" />
                        <span className="font-bold text-foreground text-sm">Subscribe & Save 20%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        ${((currentPrice?.price || 0) * 0.8).toFixed(2)} every 30 days. Cancel anytime.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {guarantees.map((g, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <g.icon className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{g.text}</span>
                    </div>
                  ))}
                </div>

                {/* Secure */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                  <Lock className="w-4 h-4" />
                  <span>Secure transaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Buy Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-b border-border shadow-elevated z-50"
          >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover hidden sm:block"
                  />
                  <div>
                    <p className="font-bold text-foreground">{product.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-accent fill-accent" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{product.reviews.toLocaleString()} reviews</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-2xl font-bold text-foreground">${currentPrice?.price}</span>
                    <span className="text-sm text-muted-foreground line-through ml-2">${currentPrice?.oldPrice}</span>
                  </div>
                  <button 
                    onClick={addToCart}
                    className="bg-primary hover:bg-accent text-primary-foreground px-6 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Details Tabs */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-12 bg-secondary/30">
        <div className="max-w-[1400px] mx-auto">
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto border-b border-border mb-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'ingredients', label: 'Ingredients' },
              { id: 'nutrition', label: 'Nutrition Facts' },
              { id: 'feeding', label: 'Feeding Guide' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold text-sm whitespace-nowrap transition-all border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'text-primary border-primary'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === 'description' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid lg:grid-cols-2 gap-8"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">About This Product</h3>
                  <div className="prose prose-sm text-muted-foreground whitespace-pre-line">
                    {product.longDescription}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {features.map((feature, idx) => (
                    <div key={idx} className="bg-card rounded-xl p-5 border border-border">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-bold text-foreground mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'ingredients' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-foreground">Premium Ingredients</h3>
                <p className="text-muted-foreground">Every ingredient is carefully selected for quality and nutritional value. All proteins are sourced from trusted North American suppliers.</p>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient, idx) => (
                    <span 
                      key={idx}
                      className="bg-card border border-border px-4 py-2 rounded-full text-sm font-medium text-foreground"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
                <div className="bg-card rounded-xl p-6 border border-border mt-6">
                  <div className="flex items-start gap-3">
                    <Leaf className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-foreground">No Artificial Additives</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        NOURISH Complete contains no artificial colors, flavors, or preservatives. We use only natural preservation methods including mixed tocopherols (Vitamin E).
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'nutrition' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-foreground">Guaranteed Analysis</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    {nutritionFacts.map((fact, idx) => (
                      <div 
                        key={idx}
                        className={`p-4 ${idx !== nutritionFacts.length - 1 ? 'border-b border-border' : ''}`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-foreground">{fact.name}</span>
                          <span className="text-primary font-semibold">{fact.value}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${fact.bar}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        AAFCO Statement
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        NOURISH Complete is formulated to meet the nutritional levels established by the AAFCO Dog Food Nutrient Profiles for all life stages including growth of large size dogs (70 lbs or more as an adult).
                      </p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h4 className="font-bold text-foreground mb-3">Calorie Content</h4>
                      <p className="text-2xl font-bold text-primary">3,650 kcal/kg</p>
                      <p className="text-sm text-muted-foreground mt-1">385 kcal/cup (calculated)</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'feeding' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-foreground">Daily Feeding Guidelines</h3>
                <p className="text-muted-foreground">These are general guidelines. Adjust as needed based on your dog's age, activity level, and body condition.</p>
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-primary/10">
                      <tr>
                        <th className="text-left p-4 font-semibold text-foreground">Dog Weight</th>
                        <th className="text-left p-4 font-semibold text-foreground">Daily Amount</th>
                        <th className="text-left p-4 font-semibold text-foreground hidden sm:table-cell">Cups/Day</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { weight: '5-10 lbs', amount: '½ - 1 cup', cups: '0.5 - 1' },
                        { weight: '11-25 lbs', amount: '1 - 1¾ cups', cups: '1 - 1.75' },
                        { weight: '26-50 lbs', amount: '1¾ - 2¾ cups', cups: '1.75 - 2.75' },
                        { weight: '51-75 lbs', amount: '2¾ - 3½ cups', cups: '2.75 - 3.5' },
                        { weight: '76-100 lbs', amount: '3½ - 4¼ cups', cups: '3.5 - 4.25' },
                        { weight: '100+ lbs', amount: '4¼+ cups', cups: '4.25+' },
                      ].map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-muted/30' : ''}>
                          <td className="p-4 text-foreground font-medium">{row.weight}</td>
                          <td className="p-4 text-muted-foreground">{row.amount}</td>
                          <td className="p-4 text-muted-foreground hidden sm:table-cell">{row.cups}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
                  <p className="text-sm text-foreground font-medium">
                    💡 <strong>Pro Tip:</strong> For puppies under 1 year, feed 2x the adult amount divided into 3-4 meals daily. Reduce to adult portions gradually after 12 months.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section id="reviews" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Rating Summary */}
            <div className="lg:col-span-4">
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-foreground mb-4">Customer Reviews</h2>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl font-bold text-foreground">{product.rating}</span>
                  <div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{product.reviews.toLocaleString()} global ratings</p>
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-2 mb-6">
                  {ratingBreakdown.map((item) => (
                    <button
                      key={item.stars}
                      onClick={() => setReviewFilter(item.stars.toString())}
                      className="w-full flex items-center gap-2 hover:bg-muted/50 p-1 rounded transition-colors"
                    >
                      <span className="text-sm text-primary hover:underline whitespace-nowrap">{item.stars} star</span>
                      <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-accent h-full rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">{item.percentage}%</span>
                    </button>
                  ))}
                </div>

                <button className="w-full bg-primary/10 text-primary py-3 rounded-xl font-semibold text-sm hover:bg-primary/20 transition-colors">
                  Write a Customer Review
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-foreground">Top Reviews</h3>
                <select 
                  value={reviewFilter}
                  onChange={(e) => setReviewFilter(e.target.value)}
                  className="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Stars</option>
                  <option value="5">5 Star Only</option>
                  <option value="4">4 Star Only</option>
                  <option value="3">3 Star Only</option>
                </select>
              </div>

              {customerReviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  {/* Reviewer Info */}
                  <div className="flex items-start gap-3 mb-4">
                    <img 
                      src={review.avatar} 
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">{review.name}</span>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                            <BadgeCheck className="w-3 h-3" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{review.dogBreed} • {review.size}</p>
                    </div>
                  </div>

                  {/* Rating & Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-accent fill-accent' : 'text-muted'}`} />
                      ))}
                    </div>
                    <span className="font-bold text-foreground">{review.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Reviewed {review.date}</p>

                  {/* Review Content */}
                  <p className="text-muted-foreground mb-4">{review.content}</p>

                  {/* Review Images */}
                  {review.images && (
                    <div className="flex gap-2 mb-4">
                      {review.images.map((img, idx) => (
                        <img 
                          key={idx}
                          src={img} 
                          alt="Review"
                          className="w-20 h-20 rounded-lg object-cover border border-border"
                        />
                      ))}
                    </div>
                  )}

                  {/* Helpful */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">{review.helpful} people found this helpful</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleHelpful(review.id, 'up')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          helpfulReviews[review.id] === 'up' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted hover:bg-muted/80 text-foreground'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Helpful
                      </button>
                      <button 
                        onClick={() => handleHelpful(review.id, 'down')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          helpfulReviews[review.id] === 'down'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80 text-foreground'
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              <button className="w-full py-4 border border-border rounded-xl text-foreground font-semibold hover:bg-muted/50 transition-colors">
                See All {product.reviews.toLocaleString()} Reviews
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="questions" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-secondary/30">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
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
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
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

          <div className="text-center mt-8">
            <button className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              <Users className="w-5 h-5" />
              See all {product.answeredQuestions} answered questions
            </button>
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-40 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <span className="text-2xl font-bold text-foreground">${currentPrice?.price}</span>
            <span className="text-sm text-muted-foreground line-through ml-2">${currentPrice?.oldPrice}</span>
          </div>
          <button 
            onClick={addToCart}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>

      <div className="pb-24 lg:pb-0">
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Product;
