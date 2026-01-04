import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ShoppingCart, Check, Star, Heart, Truck, Lock, Package, Gift, Minus, Plus, 
  Shield, Leaf, Award, ChevronDown, ChevronUp, Zap, Clock, Users, 
  ThumbsUp, ThumbsDown, Camera, Share2, Bell, RotateCcw, BadgeCheck, Sparkles,
  ChevronLeft, ChevronRight,
  Box
} from 'lucide-react';
import Navbar from './Navbar'
import PremiumCheckout from "./CheckoutModals";
import ReviewForm from "./ReviewForm";
import { apiFetch } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";


const Product = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, requireAuth, setShowLoginModal, showToast } = useAuth();
  const productId = searchParams.get('id') || "65f9e8c2f4c1a8b345456789"; // Default product ID
  
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
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    zipcode: ""
  });
  const [imageDirection, setImageDirection] = useState(1);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const imageRef = useRef(null);
  const buyBoxRef = useRef(null);

  // Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If no productId or default ID, try to get first product from list
        let productToFetch = productId;
        if (!productId || productId === "65f9e8c2f4c1a8b345456789") {
          // Try to get first available product
          try {
            const productsResponse = await apiFetch('/products?limit=1');
            if (productsResponse.success && productsResponse.data && productsResponse.data.length > 0) {
              productToFetch = productsResponse.data[0]._id;
            }
          } catch (e) {
            // If products list fails, continue with original productId
            console.log("Could not fetch products list, using provided ID");
          }
        }
        
        if (productToFetch) {
          const response = await apiFetch(`/products/${productToFetch}`);
          if (response.success && response.data) {
            setProduct(response.data);
            // Set default size to first available size
            if (response.data.sizes && response.data.sizes.length > 0) {
              setSelectedSize(response.data.sizes[0].weight.toString());
            }
          } else {
            throw new Error("Product not found");
          }
        } else {
          throw new Error("No products available");
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!isAuthenticated) {
        setCartCount(0);
        return;
      }
      
      try {
        const response = await apiFetch('/cart');
        if (response.success && response.data) {
          const totalItems = response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
          setCartCount(totalItems);
        }
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [isAuthenticated]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  // Transform backend product data to match frontend format
  const productData = {
    name: product.productName || product.name,
    tagline: "Premium All-in-One Dog Nutrition",
    brand: product.brand || "Earth & Harvest",
    description: product.smallDescription || product.description || "",
    longDescription: product.longDescription || product.description || "",
    rating: product.rating || 0,
    reviews: product.totalReviews || 0,
    answeredQuestions: 847,
    sizes: product.sizes || [],
    images: product.images || [],
    stock: product.stock || 0,
    soldThisMonth: product.soldThisMonth || 0,
    features: product.features || [],
    ingredients: product.ingredients || [],
    nutritionFacts: product.nutritionFacts || [],
  };

  // Calculate rating breakdown from real reviews
  const calculateRatingBreakdown = () => {
    const reviews = product.reviews || [];
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        breakdown[review.rating]++;
      }
    });

    const total = reviews.length || 1;
    return [
      { stars: 5, percentage: Math.round((breakdown[5] / total) * 100), count: breakdown[5] },
      { stars: 4, percentage: Math.round((breakdown[4] / total) * 100), count: breakdown[4] },
      { stars: 3, percentage: Math.round((breakdown[3] / total) * 100), count: breakdown[3] },
      { stars: 2, percentage: Math.round((breakdown[2] / total) * 100), count: breakdown[2] },
      { stars: 1, percentage: Math.round((breakdown[1] / total) * 100), count: breakdown[1] },
    ];
  };

  const ratingBreakdown = calculateRatingBreakdown();

  // Transform real reviews from backend
  const customerReviews = (product.reviews || []).map((review, idx) => ({
    id: review._id || idx,
    name: review.userName || "Anonymous",
    verified: true, // Can be enhanced later with verification logic
    rating: review.rating || 5,
    date: review.date ? new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Recently",
    title: review.title || "",
    content: review.content || "",
    images: review.images || [],
    helpful: review.helpfulCount || 0,
    size: review.sizePurchased || "",
    dogBreed: review.dogBreed || "",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName || "User")}&background=C8945C&color=fff&size=100`
  })).filter(review => {
    // Filter by selected rating if not 'all'
    if (reviewFilter === 'all') return true;
    return review.rating.toString() === reviewFilter;
  }).sort((a, b) => {
    // Sort by helpful count and date
    if (b.helpful !== a.helpful) return b.helpful - a.helpful;
    return new Date(b.date) - new Date(a.date);
  });

  const currentPrice = productData.sizes.find(s => s.weight.toString() === selectedSize || s.weight === selectedSize);

  const addToCart = async () => {
    // Check if user is authenticated, if not show login modal
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      // Ensure we have a valid product ID
      const validProductId = product?._id || productId;
      if (!validProductId) {
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Product information is missing. Please refresh the page.'
        });
        return;
      }

      const response = await apiFetch('/cart/add', {
        method: "POST",
        body: JSON.stringify({
          productId: validProductId,
          size: selectedSize,
          quantity
        })
      });

      if (response.success) {
        // Update cart count
        const totalItems = response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(totalItems);
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Item added to cart!'
        });
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
      showToast({
        type: 'error',
        title: 'Error',
        message: err.message || "Failed to add to cart. Please try again."
      });
    }
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
    { q: "Is this suitable for puppies?", a: "Yes! Earth & Harvest Complete is formulated for all life stages, from puppies (8 weeks+) to senior dogs. The balanced nutrient profile supports healthy growth and development at every age." },
    { q: "How do I transition my dog to this food?", a: "We recommend a 7-day transition: Start with 25% Earth & Harvest mixed with current food, increasing by 25% every 2 days until fully transitioned. Full instructions and a transition guide are included with your order." },
    { q: "What if my dog doesn't like it?", a: "We offer a 90-day money-back guarantee. If your dog doesn't love Earth & Harvest Complete, we'll refund your purchase in full – no questions asked. We'll even pay for return shipping." },
    { q: "Where is this product made?", a: "Earth & Harvest Complete is proudly made in our FDA-registered facility in Colorado, USA. All ingredients are sourced from trusted suppliers, with proteins from North America and seafood from sustainable fisheries." },
    { q: "Is this grain-free?", a: "No, Earth & Harvest Complete contains healthy whole grains like brown rice, oatmeal, and barley. Recent research suggests whole grains provide important nutrients and fiber. We also offer a grain-free option if needed." },
  ];

  const handleHelpful = (reviewId, type) => {
    setHelpfulReviews(prev => ({
      ...prev,
      [reviewId]: prev[reviewId] === type ? null : type
    }));
  };

  const handleBuyNow = () => {
    requireAuth(() => {
      setShowCheckout(true);
    });
  };

  const initiatePayment = async () => {
    try {
      if (!currentPrice) {
        alert("Please select a size");
        return;
      }

      const amount = currentPrice.price * quantity;

      // Format address for backend
      const formattedAddress = {
        street: address.street,
        city: address.city,
        state: address.state || "",
        country: address.country || "UAE",
        zipCode: parseInt(address.zipcode) || 0
      };

      const orderRes = await apiFetch('/order/create', {
        method: "POST",
        body: JSON.stringify({
          productId: product._id || productId,
          sizeSelected: selectedSize,
          quantity,
          address: formattedAddress,
          amount
        })
      });

      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.message || "Failed to create order");
      }

      const orderId = orderRes.data._id || orderRes.data.orderId;

      const paymentRes = await apiFetch('/payment/create', {
        method: "POST",
        body: JSON.stringify({
          orderId,
          amount
        })
      });

      if (paymentRes.success && paymentRes.paymentUrl) {
        window.location.href = paymentRes.paymentUrl;
      } else {
        throw new Error(paymentRes.message || "Failed to create payment");
      }

    } catch (err) {
      console.error("Checkout failed:", err);
      alert(err.message || "Checkout failed. Please try again.");
    }
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && productData.images.length > 0) {
      const next = (selectedImage + 1) % productData.images.length;
      setImageDirection(1);
      setSelectedImage(next);
    }
    if (isRightSwipe && productData.images.length > 0) {
      const prev = (selectedImage - 1 + productData.images.length) % productData.images.length;
      setImageDirection(-1);
      setSelectedImage(prev);
    }
  };

  const goToImage = (index, direction) => {
    setImageDirection(direction);
    setSelectedImage(index);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartCount={cartCount} />
      
      {/* Modern Product Section with Creative Layout */}
      <section className="py-6 sm:py-12 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-white to-white">
        <div className="max-w-7xl mx-auto">
          {/* Mobile-First Layout */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Images - Enhanced with Swipe */}
            <div className="space-y-4 order-1">
              {/* Main Image with Advanced Animations */}
              {productData.images.length > 0 && (
                <div 
                  ref={imageRef}
                  className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-2xl group"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsZooming(true)}
                  onMouseLeave={() => setIsZooming(false)}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <AnimatePresence mode="wait" custom={imageDirection}>
                    <motion.div
                      key={selectedImage}
                      custom={imageDirection}
                      initial={{ 
                        opacity: 0, 
                        x: imageDirection > 0 ? '100%' : '-100%',
                        scale: 0.9,
                        rotateY: imageDirection > 0 ? 15 : -15
                      }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        scale: 1,
                        rotateY: 0
                      }}
                      exit={{ 
                        opacity: 0, 
                        x: imageDirection > 0 ? '-100%' : '100%',
                        scale: 0.9,
                        rotateY: imageDirection > 0 ? -15 : 15
                      }}
                      transition={{ 
                        duration: 0.5,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      className="absolute inset-0"
                    >
                      <img
                        src={productData.images[selectedImage] || productData.images[0]}
                        alt={productData.name}
                        className="w-full h-full object-cover"
                        style={isZooming ? {
                          transform: 'scale(2.5)',
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          transition: 'transform 0.1s ease-out'
                        } : {}}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

                  {/* Badges */}
                  <motion.div 
                    className="absolute top-4 sm:top-6 left-4 sm:left-6 flex flex-col gap-2 z-10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold shadow-xl backdrop-blur-sm">
                      SAVE 25%
                    </span>
                    <span className="bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold shadow-xl backdrop-blur-sm">
                      #1 BESTSELLER
                    </span>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div 
                    className="absolute top-4 sm:top-6 right-4 sm:right-6 flex flex-col gap-2 z-10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <button 
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xl transition-all backdrop-blur-md ${
                        isWishlisted ? 'bg-red-500 text-white scale-110' : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-110'
                      }`}
                    >
                      <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button className="w-11 h-11 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all shadow-xl text-gray-700 hover:scale-110">
                      <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </motion.div>

                  {/* Navigation Arrows - Desktop */}
                  {productData.images.length > 1 && (
                    <>
                      <button
                        onClick={() => goToImage((selectedImage - 1 + productData.images.length) % productData.images.length, -1)}
                        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full items-center justify-center shadow-xl hover:bg-white transition-all z-10 group"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-[#C8945C] transition-colors" />
                      </button>
                      <button
                        onClick={() => goToImage((selectedImage + 1) % productData.images.length, 1)}
                        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full items-center justify-center shadow-xl hover:bg-white transition-all z-10 group"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-[#C8945C] transition-colors" />
                      </button>
                    </>
                  )}

                  {/* Image Counter & Zoom Hint */}
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-10">
                    {productData.images.length > 1 && (
                      <div className="bg-black/70 backdrop-blur-md text-white px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium">
                        {selectedImage + 1} / {productData.images.length}
                      </div>
                    )}
                    {!isZooming && (
                      <div className="bg-black/70 backdrop-blur-md text-white px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                        <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Hover to zoom</span>
                        <span className="sm:hidden">Tap & hold</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Thumbnails - Mobile Optimized */}
              {productData.images.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-hide">
                  {productData.images.map((img, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => goToImage(idx, idx > selectedImage ? 1 : -1)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 transition-all border-2 ${
                        selectedImage === idx 
                          ? 'border-[#C8945C] shadow-lg ring-2 ring-[#C8945C]/20' 
                          : 'border-gray-200 hover:border-[#C8945C]/50'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {selectedImage === idx && (
                        <div className="absolute inset-0 bg-[#C8945C]/20" />
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info & Buy Box */}
            <div className="space-y-6 sm:space-y-8 order-2" ref={buyBoxRef}>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link to="/" className="hover:text-[#C8945C] transition-colors">Home</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">{productData.brand}</span>
              </div>

              {/* Brand & Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link to="/" className="text-[#C8945C] hover:underline text-xs sm:text-sm font-semibold uppercase tracking-wider">
                  {productData.brand}
                </Link>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-2 mb-4 sm:mb-6 leading-tight">
                  {productData.name}
                </h1>
                
                {/* Rating & Social Proof - Mobile Optimized */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(productData.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-gray-900 ml-1 sm:ml-2">{productData.rating}</span>
                  </div>
                  <div className="h-5 sm:h-6 w-px bg-gray-300 hidden sm:block" />
                  <a href="#reviews" className="text-sm sm:text-base text-gray-600 hover:text-[#C8945C] transition-colors">
                    {productData.reviews.toLocaleString()} reviews
                  </a>
                  <div className="h-5 sm:h-6 w-px bg-gray-300 hidden sm:block" />
                  <span className="text-sm sm:text-base text-gray-600 hidden sm:inline">
                    {productData.soldThisMonth.toLocaleString()}+ sold
                  </span>
                </div>

                {/* Badges - Responsive */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-1.5 sm:gap-2 bg-amber-50 text-amber-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border border-amber-200"
                  >
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-500" />
                    BESTSELLER
                  </motion.span>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-50 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border border-blue-200"
                  >
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                    VET APPROVED
                  </motion.span>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-1.5 sm:gap-2 bg-green-50 text-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border border-green-200"
                  >
                    <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                    VERIFIED
                  </motion.span>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
                  {productData.description}
                </p>
              </motion.div>

              {/* Buy Box - Mobile Optimized */}
              <motion.div 
                className="bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl sticky top-4 sm:top-24 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >

                {/* Price - Prominent */}
                <div className="mb-5 sm:mb-6">
                  <div className="flex items-baseline gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">AED {currentPrice?.price?.toFixed(2)}</span>
                    {currentPrice?.oldPrice && (
                      <span className="text-lg sm:text-xl lg:text-2xl text-gray-400 line-through">AED {currentPrice.oldPrice.toFixed(2)}</span>
                    )}
                  </div>
                  {currentPrice?.oldPrice && (
                    <motion.span 
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="inline-block bg-gradient-to-r from-red-50 to-orange-50 text-red-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold border-2 border-red-200"
                    >
                      Save AED {((currentPrice.oldPrice) - (currentPrice.price)).toFixed(2)}
                    </motion.span>
                  )}
                </div>

                {/* Stock Status */}
                <motion.div 
                  className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-700 font-bold text-sm sm:text-base">In Stock</span>
                  <span className="text-green-600 text-xs sm:text-sm">({productData.stock} available)</span>
                </motion.div>

                {/* Delivery Info */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8945C]" />
                    <span className="font-bold text-gray-900 text-sm sm:text-base">FREE 2-Day Delivery</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 pl-7 sm:pl-9">
                    Order within <span className="font-bold text-[#C8945C]">4 hrs 23 mins</span> for delivery by <span className="font-semibold">Tuesday, Dec 10</span>
                  </p>
                </div>

                {/* Subscribe Option */}
                <motion.div 
                  className="mt-5 sm:mt-6 p-4 sm:p-5 bg-gradient-to-br from-[#C8945C]/10 via-[#B8844C]/10 to-[#C8945C]/10 rounded-xl border-2 border-[#C8945C]/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    {/* <input 
                      type="checkbox" 
                      className="mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded border-[#C8945C] text-[#C8945C] focus:ring-[#C8945C] cursor-pointer" 
                    /> */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Box className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8945C]" />
                        <span className="font-bold text-gray-900 text-sm sm:text-base">Buy in bulk & Save</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">
                      28.5% off when ordering 5 packets or more
                      </p>
                    </div>
                  </label>
                </motion.div>

                {/* Trust Badges - Responsive Grid */}
                {/* <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t-2 border-gray-200">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {guarantees.map((g, idx) => (
                      <motion.div 
                        key={idx} 
                        className="flex items-start gap-2 sm:gap-3"
                        whileHover={{ scale: 1.05 }}
                      >
                        <g.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8945C] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-gray-900">{g.title}</p>
                          <p className="text-xs text-gray-600">{g.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-200">
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Secure transaction</span>
                  </div>
                </div> */}
                {/* CTA Buttons */}
<div className="mt-6 space-y-3">
  
  {/* Add to Cart */}
  <motion.button
    onClick={addToCart}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white
               bg-gradient-to-r from-[#C8945C] to-[#B8844C]
               shadow-lg hover:shadow-xl transition-all"
  >
    <ShoppingCart className="w-5 h-5" />
    Add to Cart
  </motion.button>

  {/* Buy Now */}
  <motion.button
    onClick={handleBuyNow}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    className="w-full py-4 rounded-xl font-bold text-[#C8945C]
               border-2 border-[#C8945C] bg-white
               hover:bg-[#C8945C]/10 transition-all"
  >
    Buy Now
  </motion.button>

</div>

              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs - Enhanced */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide border-b-2 border-gray-200 mb-8 sm:mb-12 -mx-4 sm:mx-0 px-4 sm:px-0">
            {[
              { id: 'description', label: 'Description' },
              { id: 'ingredients', label: 'Ingredients' },
              { id: 'nutrition', label: 'Nutrition Facts' },
              { id: 'feeding', label: 'Feeding Guide' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ y: -2 }}
                className={`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 font-bold text-sm sm:text-base whitespace-nowrap transition-all border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'text-[#C8945C] border-[#C8945C]'
                    : 'text-gray-500 border-transparent hover:text-gray-900'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          <div className="min-h-[300px]">
            {activeTab === 'description' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">About This Product</h3>
                  <div className="prose prose-sm text-muted-foreground whitespace-pre-line">
                    {productData.longDescription}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {(productData.features.length > 0 ? productData.features : features).map((feature, idx) => {
                    const Icon = feature.icon || features[idx]?.icon || Shield;
                    return (
                      <div key={idx} className="bg-[#F8F2EC] rounded-xl p-5 border border-border">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="font-bold text-foreground mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'ingredients' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Premium Ingredients</h3>
                <p className="text-muted-foreground">
                  Every ingredient is carefully selected for quality and nutritional value.
                </p>

                <div className="flex flex-wrap gap-2">
                  {(productData.ingredients.length > 0 ? productData.ingredients : ingredients).map((ingredient, idx) => (
                    <span key={idx} className="bg-card border border-border px-4 py-2 rounded-full text-sm font-medium text-foreground">
                      {ingredient}
                    </span>
                  ))}
                </div>

                <div className="bg-card rounded-xl p-6 border border-border mt-6">
                  <div className="flex items-start gap-3">
                    <Leaf className="w-6 h-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-bold text-foreground">No Artificial Additives</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Earth & Harvest Complete contains no artificial preservatives.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'nutrition' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Guaranteed Analysis</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    {(productData.nutritionFacts.length > 0 ? productData.nutritionFacts : nutritionFacts).map((fact, idx, arr) => (
                      <div key={idx} className={`p-4 ${idx !== arr.length - 1 ? "border-b border-border" : ""}`}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{fact.name}</span>
                          <span className="text-primary font-semibold">{fact.value}</span>
                        </div>

                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${fact.bar || 50}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h4 className="font-bold flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        AAFCO Statement
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Meets all AAFCO nutrient standards for all life stages.
                      </p>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6">
                      <h4 className="font-bold">Calorie Content</h4>
                      <p className="text-2xl font-bold text-primary mt-1">3,650 kcal/kg</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* {activeTab === 'feeding' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h3 className="text-2xl font-bold">Daily Feeding Guidelines</h3>

                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-primary/10">
                      <tr>
                        <th className="p-4 font-semibold text-left">Dog Weight</th>
                        <th className="p-4 font-semibold text-left">Daily Amount</th>
                        <th className="p-4 font-semibold text-left hidden sm:table-cell">Cups/Day</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { weight: "5-10 lbs", amount: "½ - 1 cup", cups: "0.5 - 1" },
                        { weight: "11-25 lbs", amount: "1 - 1¾ cups", cups: "1 - 1.75" },
                        { weight: "26-50 lbs", amount: "1¾ - 2¾ cups", cups: "1.75 - 2.75" },
                        { weight: "51-75 lbs", amount: "2¾ - 3½ cups", cups: "2.75 - 3.5" },
                        { weight: "76-100 lbs", amount: "3½ - 4¼ cups", cups: "3.5 - 4.25" },
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                          <td className="p-4 font-medium text-foreground">{row.weight}</td>
                          <td className="p-4 text-muted-foreground">{row.amount}</td>
                          <td className="p-4 text-muted-foreground hidden sm:table-cell">{row.cups}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                  <p className="text-sm text-foreground">
                    💡 Puppies under 1 year require 2× the adult amount split into 3 meals.
                  </p>
                </div>
              </motion.div>
            )} */}
          </div>
        </div>
      </section>

      {/* Reviews Section - Enhanced */}
      <section id="reviews" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
              Customer Reviews
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Real feedback from verified customers
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8">
            {/* LEFT SUMMARY CARD */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <div className="bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-lg sticky top-4 sm:top-24">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900">{productData.rating}</span>
                  <div>
                    <div className="flex mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">{productData.reviews.toLocaleString()} ratings</p>
                  </div>
                </div>

                {/* Rating bars - Enhanced */}
                <div className="space-y-2 sm:space-y-2.5 mb-6">
                  {ratingBreakdown.map((item) => (
                    <motion.button 
                      key={item.stars}
                      onClick={() => setReviewFilter(item.stars.toString())}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-2 sm:gap-3 w-full hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 min-w-[3rem]">{item.stars} star</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2.5 sm:h-3 overflow-hidden">
                        <motion.div 
                          className="bg-gradient-to-r from-[#C8945C] to-[#B8844C] h-full"
                          initial={{ width: 0 }}
                          animate={{ width: item.percentage + "%" }}
                          transition={{ duration: 0.8, delay: item.stars * 0.1 }}
                        />
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 font-medium min-w-[2.5rem] text-right">{item.percentage}%</span>
                    </motion.button>
                  ))}
                </div>

                <motion.button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowLoginModal(true);
                    } else {
                      setShowReviewForm(true);
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white rounded-xl py-4 font-semibold hover:shadow-lg transition-all"
                >
                  Write a Review
                </motion.button>
              </div>
            </div>

            {/* RIGHT REVIEWS */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-6 order-1 lg:order-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Reviews</h3>

                <select
                  value={reviewFilter}
                  onChange={(e) => setReviewFilter(e.target.value)}
                  className="border-2 border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 bg-white focus:border-[#C8945C] focus:outline-none"
                >
                  <option value="all">All Reviews</option>
                  <option value="5">5 Star</option>
                  <option value="4">4 Star</option>
                  <option value="3">3 Star</option>
                  <option value="2">2 Star</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              {customerReviews.length === 0 ? (
                <motion.div 
                  className="bg-white border-2 border-gray-200 rounded-2xl p-8 sm:p-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">No reviews yet. Be the first to review this product!</p>
                  <motion.button
                    onClick={() => {
                      if (!isAuthenticated) {
                        setShowLoginModal(true);
                      } else {
                        setShowReviewForm(true);
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-sm sm:text-base hover:shadow-lg transition-all"
                  >
                    Write the First Review
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  {customerReviews.map((review, idx) => (
                    <motion.div
                      key={review.id}
                      className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="flex items-start gap-3 sm:gap-4 mb-4">
                        <img src={review.avatar} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full ring-2 ring-[#C8945C]/20" />

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900 text-sm sm:text-base">{review.name}</span>
                            {review.verified && (
                              <span className="text-xs text-[#C8945C] flex items-center gap-1 bg-[#C8945C]/10 px-2 py-0.5 rounded-full">
                                <BadgeCheck className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>

                          <p className="text-xs sm:text-sm text-gray-500">
                            {review.dogBreed && `${review.dogBreed} • `}{review.size && `${review.size} • `}Reviewed {review.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} />
                        ))}
                        {review.title && (
                          <span className="font-bold text-gray-900 text-sm sm:text-base ml-2">{review.title}</span>
                        )}
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base">{review.content}</p>

                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                          {review.images.map((img, i) => (
                            <img key={i} src={img} className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border-2 border-gray-200 shrink-0" />
                          ))}
                        </div>
                      )}

                      {/* Helpful buttons */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 border-t border-gray-200 pt-4">
                        <span className="text-xs sm:text-sm text-gray-600">{review.helpful} found this helpful</span>

                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => handleHelpful(review.id, "up")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm flex gap-1.5 items-center font-semibold transition-all ${
                              helpfulReviews[review.id] === "up" 
                                ? "bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white shadow-md" 
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            Helpful
                          </motion.button>

                          <motion.button
                            onClick={() => handleHelpful(review.id, "down")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm ${
                              helpfulReviews[review.id] === "down" 
                                ? "bg-gray-800 text-white shadow-md" 
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <motion.button 
                    className="w-full border-2 border-gray-200 rounded-xl py-3 sm:py-4 font-semibold text-gray-700 hover:border-[#C8945C] hover:text-[#C8945C] transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    See All {productData.reviews.toLocaleString()} Reviews
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced */}
      <section id="questions" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 text-gray-900"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={idx} 
                className="bg-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden hover:border-[#C8945C]/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex justify-between items-center w-full p-4 sm:p-5 sm:p-6 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-bold text-gray-900 text-sm sm:text-base text-left pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 flex-shrink-0" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6 text-gray-600 leading-relaxed text-sm sm:text-base">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-8 sm:mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <button className="text-[#C8945C] font-semibold flex items-center gap-2 mx-auto hover:underline text-sm sm:text-base">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" /> 
              <span>See all {productData.answeredQuestions} answered questions</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Mobile Sticky CTA - Enhanced */}
      {showStickyBar && (
        <motion.div 
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50 p-4"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
        >
          <div className="flex items-center gap-3 max-w-7xl mx-auto">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-gray-900">AED {currentPrice?.price?.toFixed(2)}</span>
                {currentPrice?.oldPrice && (
                  <span className="text-sm text-gray-400 line-through">AED {currentPrice.oldPrice.toFixed(2)}</span>
                )}
              </div>
            </div>

            <motion.button
              onClick={addToCart}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg flex-shrink-0"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </motion.button>
            <motion.button
              onClick={handleBuyNow}
              whileTap={{ scale: 0.95 }}
              className="bg-white border-2 border-[#C8945C] text-[#C8945C] px-4 py-3 rounded-xl font-bold flex-shrink-0"
            >
              Buy
            </motion.button>
          </div>
        </motion.div>
      )}

      {showCheckout && currentPrice && (
        <PremiumCheckout
          product={productData}
          selectedSize={selectedSize}
          quantity={quantity}
          currentPrice={currentPrice}
          address={address}
          setAddress={setAddress}
          onClose={() => setShowCheckout(false)}
          onPayNow={initiatePayment}
        />
      )}

      {showReviewForm && (
        <ReviewForm
          productId={product._id}
          onClose={() => setShowReviewForm(false)}
          onSuccess={() => {
            // Refetch product to get updated reviews
            window.location.reload();
          }}
        />
      )}


      <div className="pb-24 lg:pb-0" />
    </div>
  );
};

export default Product;

