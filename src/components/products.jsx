import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ShoppingCart, Check, Star, Truck, Lock, Package, Gift, Minus, Plus, 
  Shield, Leaf, Award, ChevronDown, ChevronUp, Zap, Clock, Users, 
  ThumbsUp, ThumbsDown, Camera, RotateCcw, BadgeCheck, Sparkles,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  Box, Heart
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
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
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
    email: "",
    street: "",
    city: "",
    state: "",
    country: "United Arab Emirates",
    zipcode: "",
    deliveryInstructions: ""
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

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3)); // Max zoom 3x
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1)); // Min zoom 1x (normal)
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
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
    _id: product?._id, // Include the _id field
    id: product?._id, // Also include as id for compatibility
    name: product?.productName || product?.name,
    productName: product?.productName || product?.name,
    tagline: "Premium All-in-One Dog Nutrition",
    brand: product?.brand || "Earth & Harvest",
    description: product?.smallDescription || product?.description || "",
    longDescription: product?.longDescription || product?.description || "",
    rating: product?.rating || 0,
    reviews: product?.totalReviews || 0,
    answeredQuestions: 847,
    sizes: product?.sizes || [],
    images: product?.images || [],
    stock: product?.stock || 0,
    soldThisMonth: product?.soldThisMonth || 0,
    features: product?.features || [],
    ingredients: product?.ingredients || [],
    nutritionFacts: product?.nutritionFacts || [],
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
    { icon: Leaf, title: "100% Natural", desc: "No artificial colors, flavors, or preservatives" },
    { icon: Award, title: "Human Grade", desc: "Every ingredient meets human food standards" },
    { icon: Heart, title: "Complete Nutrition", desc: "All essential nutrients in every serving" },
    { icon: Zap, title: "Optimal Protein", desc: "Optimal protein levels for active dogs" },
    { icon: RotateCcw, title: "Easy Digest", desc: "Probiotics for healthy gut flora" },
  ];

  const nutritionFacts = [
    { name: "Crude Protein", value: "69% min", bar: 85 },
    { name: "Crude Fat", value: "4% max", bar: 60 },
    { name: "Ash", value: "7% max", bar: 20 },
    { name: "Moisture", value: "14% max", bar: 30 },
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

  const handleBuyNow = async () => {
    requireAuth(async () => {
      // Check if item is in cart and use cart quantity
      try {
        const cartResponse = await apiFetch('/cart');
        if (cartResponse.success && cartResponse.data?.items) {
          const cartItem = cartResponse.data.items.find(
            item => item.product?._id === (product?._id || productId) && 
            (item.size === selectedSize || item.size?.toString() === selectedSize?.toString())
          );
          if (cartItem) {
            setQuantity(cartItem.quantity);
          }
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
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
      // Normalize phone number (remove spaces) before storing
      const normalizedPhone = address.phone ? address.phone.replace(/\s+/g, '') : address.phone;
      const formattedAddress = {
        street: address.street,
        city: address.city,
        state: address.state || "",
        country: address.country || "UAE",
        zipCode: address.zipcode ? parseInt(address.zipcode) : undefined,
        phone: normalizedPhone
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
    <div className="min-h-screen bg-[#FAF7F2] overflow-x-hidden">
      <Navbar cartCount={cartCount} />
      
      {/* Premium Product Section */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-3 sm:px-4 md:px-6 lg:px-8 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto w-full">
          {/* Premium Layout */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-20">
            {/* Product Images - Enhanced with Swipe */}
            <div className="space-y-3 sm:space-y-4 order-1 w-full min-w-0 max-w-full">
              {/* Main Image with Advanced Animations */}
              {productData.images.length > 0 && (
                <div 
                  ref={imageRef}
                  className={`relative w-full aspect-square rounded-lg sm:rounded-xl md:rounded-2xl bg-white border border-[#E8DFD0]/50 shadow-[0_4px_24px_rgba(0,0,0,0.06)] group ${
                    zoomLevel > 1 ? 'overflow-auto' : 'overflow-hidden'
                  }`}
                  style={{
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    touchAction: zoomLevel > 1 ? 'pan-x pan-y' : 'pan-x',
                    WebkitOverflowScrolling: 'touch'
                  }}
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
                        className="w-full h-full object-cover transition-transform duration-300 ease-out select-none"
                        style={{
                          transform: `scale(${zoomLevel})`,
                          transformOrigin: 'center center',
                          touchAction: 'none'
                        }}
                        draggable={false}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

                  {/* Premium Badges */}
                  <motion.div 
                    className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 flex flex-col gap-1.5 sm:gap-2 z-10 max-w-[calc(100%-80px)]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="bg-[#2D4A3E] text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold tracking-wide shadow-lg backdrop-blur-sm border border-[#2D4A3E]/20 whitespace-nowrap">
                      SAVE 25%
                    </span>
                    <span className="bg-[#C8945C] text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold tracking-wide shadow-lg backdrop-blur-sm border border-[#C8945C]/20 whitespace-nowrap">
                      BESTSELLER
                    </span>
                  </motion.div>

                  {/* Premium Zoom Controls */}
                  <motion.div 
                    className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 flex flex-col gap-1.5 sm:gap-2 z-20"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.button
                      onClick={handleZoomIn}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={zoomLevel >= 3}
                      className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-md sm:rounded-lg flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all bg-white/95 backdrop-blur-sm text-[#2D4A3E] hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation border border-[#E8DFD0]/50"
                      title="Zoom In"
                      aria-label="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </motion.button>
                    <motion.button
                      onClick={handleZoomOut}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={zoomLevel <= 1}
                      className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-md sm:rounded-lg flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all bg-white/95 backdrop-blur-sm text-[#2D4A3E] hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation border border-[#E8DFD0]/50"
                      title="Zoom Out"
                      aria-label="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </motion.button>
                    {zoomLevel > 1 && (
                      <motion.button
                        onClick={handleResetZoom}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-md sm:rounded-lg flex items-center justify-center shadow-[0_2px_8px_rgba(200,148,92,0.3)] transition-all bg-[#C8945C] text-white hover:bg-[#B8844C] hover:shadow-[0_4px_12px_rgba(200,148,92,0.4)] active:scale-95 touch-manipulation"
                        title="Reset Zoom"
                        aria-label="Reset Zoom"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      </motion.button>
                    )}
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

                  {/* Premium Image Counter */}
                  <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 right-2 sm:right-3 md:right-4 flex items-center justify-between z-10 gap-2">
                    {productData.images.length > 1 && (
                      <div className="bg-[#2D4A3E]/90 backdrop-blur-md text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs md:text-sm font-medium shadow-lg border border-[#2D4A3E]/20 whitespace-nowrap">
                        {selectedImage + 1} / {productData.images.length}
                      </div>
                    )}
                    {zoomLevel > 1 && (
                      <div className="bg-[#2D4A3E]/90 backdrop-blur-md text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs md:text-sm font-medium flex items-center gap-1 sm:gap-1.5 ml-auto shadow-lg border border-[#2D4A3E]/20 whitespace-nowrap">
                        <Camera className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span>{Math.round(zoomLevel * 100)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Premium Thumbnails */}
              {productData.images.length > 1 && (
                <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {productData.images.map((img, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => goToImage(idx, idx > selectedImage ? 1 : -1)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-md sm:rounded-lg overflow-hidden shrink-0 transition-all border ${
                        selectedImage === idx 
                          ? 'border-[#C8945C] shadow-[0_4px_12px_rgba(200,148,92,0.25)] ring-1 ring-[#C8945C]/30' 
                          : 'border-[#E8DFD0] hover:border-[#C8945C]/40 bg-white'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {selectedImage === idx && (
                        <div className="absolute inset-0 bg-[#C8945C]/10 border-2 border-[#C8945C]" />
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Premium Product Info & Buy Box */}
            <div className="space-y-6 sm:space-y-8 md:space-y-10 order-2 w-full min-w-0 max-w-full" ref={buyBoxRef}>
              {/* Premium Breadcrumb */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6B7C72] font-medium overflow-x-auto scrollbar-hide">
                <Link to="/" className="hover:text-[#C8945C] transition-colors whitespace-nowrap">Home</Link>
                <span className="text-[#E8DFD0] flex-shrink-0">/</span>
                <span className="text-[#2D4A3E] whitespace-nowrap">{productData.brand}</span>
              </div>

              {/* Premium Brand & Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full min-w-0"
              >
                <Link to="/" className="text-[#C8945C] hover:text-[#B8844C] text-xs sm:text-sm font-semibold uppercase tracking-[0.1em] transition-colors inline-block">
                  {productData.brand}
                </Link>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#2D4A3E] mt-2 sm:mt-3 mb-4 sm:mb-6 md:mb-8 leading-[1.1] tracking-tight break-words">
                  {productData.name}
                </h1>
                
                {/* Premium Rating & Social Proof */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 pb-4 sm:pb-6 md:pb-8 border-b border-[#E8DFD0]">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 ${i < Math.floor(productData.rating) ? 'text-[#C8945C] fill-[#C8945C]' : 'text-[#E8DFD0]'}`} />
                      ))}
                    </div>
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#2D4A3E] ml-0.5 sm:ml-1">{productData.rating}</span>
                  </div>
                  <div className="h-5 sm:h-6 w-px bg-[#E8DFD0] hidden sm:block" />
                  <a href="#reviews" className="text-xs sm:text-sm md:text-base text-[#6B7C72] hover:text-[#C8945C] transition-colors font-medium whitespace-nowrap">
                    {productData.reviews.toLocaleString()} reviews
                  </a>
                  <div className="h-5 sm:h-6 w-px bg-[#E8DFD0] hidden sm:block" />
                  <span className="text-xs sm:text-sm md:text-base text-[#6B7C72] hidden sm:inline font-medium whitespace-nowrap">
                    {productData.soldThisMonth.toLocaleString()}+ sold
                  </span>
                </div>

                {/* Premium Badges */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                  <motion.span 
                    whileHover={{ scale: 1.02 }}
                    className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#2D4A3E] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide shadow-sm whitespace-nowrap"
                  >
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-white flex-shrink-0" />
                    BESTSELLER
                  </motion.span>
                  <motion.span 
                    whileHover={{ scale: 1.02 }}
                    className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-[#2D4A3E] px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide border border-[#E8DFD0] shadow-sm whitespace-nowrap"
                  >
                    <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#C8945C] flex-shrink-0" />
                    VET APPROVED
                  </motion.span>
                  <motion.span 
                    whileHover={{ scale: 1.02 }}
                    className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-[#2D4A3E] px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide border border-[#E8DFD0] shadow-sm whitespace-nowrap"
                  >
                    <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#C8945C] flex-shrink-0" />
                    VERIFIED
                  </motion.span>
                </div>

                {/* Premium Description */}
                <p className="text-sm sm:text-base md:text-lg text-[#6B7C72] leading-relaxed mb-6 sm:mb-8 font-light break-words">
                  {productData.description}
                </p>
              </motion.div>

              {/* Premium Buy Box */}
              <motion.div 
                className="bg-white border border-[#E8DFD0] rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sticky top-4 sm:top-6 md:top-24 z-10 w-full max-w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >

                {/* Premium Price */}
                <div className="mb-4 sm:mb-6 md:mb-8 pb-4 sm:pb-6 md:pb-8 border-b border-[#E8DFD0]">
                  <div className="flex items-baseline gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 flex-wrap">
                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D4A3E] tracking-tight break-words">AED {currentPrice?.price?.toFixed(2)}</span>
                    {currentPrice?.oldPrice && (
                      <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#6B7C72] line-through font-light">AED {currentPrice.oldPrice.toFixed(2)}</span>
                    )}
                  </div>
                  {currentPrice?.oldPrice && (
                    <motion.span 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-block bg-[#2D4A3E] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold tracking-wide shadow-sm whitespace-nowrap"
                    >
                      Save AED {((currentPrice.oldPrice) - (currentPrice.price)).toFixed(2)}
                    </motion.span>
                  )}
                </div>

                {/* Premium Stock Status */}
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8 pb-4 sm:pb-6 md:pb-8 border-b border-[#E8DFD0]">
                  <span className="w-2 h-2 bg-[#10B981] rounded-full flex-shrink-0"></span>
                  <div className="min-w-0">
                    <span className="text-[#2D4A3E] font-semibold text-xs sm:text-sm md:text-base block">In Stock</span>
                    <span className="text-[#6B7C72] text-[10px] sm:text-xs md:text-sm">{productData.stock} units available</span>
                  </div>
                </div>

                {/* Premium Delivery Info */}
                <div className="bg-[#FAF7F2] rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-[#E8DFD0]">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#C8945C]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8945C]" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-[#2D4A3E] text-xs sm:text-sm md:text-base block">Free Express Delivery</span>
                      <span className="text-[#6B7C72] text-[10px] sm:text-xs md:text-sm">5-7 business days</span>
                    </div>
                  </div>
                </div>

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
                {/* Quantity Selector */}
                <div className="mb-4 sm:mb-6 md:mb-8 pb-4 sm:pb-6 md:pb-8 border-b border-[#E8DFD0]">
                  <label className="block text-sm sm:text-base font-semibold text-[#2D4A3E] mb-3">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg border-2 border-[#E8DFD0] hover:border-[#C8945C] hover:bg-[#FAF7F2] transition-colors"
                    >
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-[#2D4A3E]" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={productData.stock || 999}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(Math.max(1, Math.min(val, productData.stock || 999)));
                      }}
                      className="w-20 sm:w-24 text-center text-lg sm:text-xl font-bold text-[#2D4A3E] border-2 border-[#E8DFD0] rounded-lg py-2 focus:border-[#C8945C] focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(productData.stock || 999, quantity + 1))}
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg border-2 border-[#E8DFD0] hover:border-[#C8945C] hover:bg-[#FAF7F2] transition-colors"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-[#2D4A3E]" />
                    </button>
                    <span className="text-sm text-[#6B7C72] ml-auto">
                      {productData.stock || 0} available
                    </span>
                  </div>
                </div>

                {/* Premium CTA Buttons */}
                <div className="space-y-2 sm:space-y-3">
                  {/* Add to Cart */}
                  <motion.button
                    onClick={addToCart}
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 md:py-5 rounded-lg font-semibold text-white
                               bg-[#C8945C] hover:bg-[#B8844C]
                               shadow-[0_4px_12px_rgba(200,148,92,0.3)] hover:shadow-[0_6px_16px_rgba(200,148,92,0.4)]
                               transition-all tracking-wide text-xs sm:text-sm md:text-base"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="whitespace-nowrap">Add to Cart</span>
                  </motion.button>

                  {/* Buy Now */}
                  <motion.button
                    onClick={handleBuyNow}
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3 sm:py-4 md:py-5 rounded-lg font-semibold text-[#2D4A3E]
                               border border-[#E8DFD0] bg-white
                               hover:border-[#C8945C] hover:bg-[#FAF7F2] transition-all tracking-wide text-xs sm:text-sm md:text-base shadow-sm"
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
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex overflow-x-auto scrollbar-hide border-b-2 border-gray-200 mb-8 sm:mb-12 -mx-3 sm:-mx-4 md:mx-0 px-3 sm:px-4 md:px-0 w-full">
            {[
              { id: 'description', label: 'Description' },
              { id: 'ingredients', label: 'Ingredients' },
              { id: 'nutrition', label: 'Nutrition Facts' },
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

                  {/* <div className="space-y-3">
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
                  </div> */}
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
      <section id="reviews" className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto w-full">
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
      <section id="questions" className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto w-full">
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

          {/* <motion.div 
            className="text-center mt-8 sm:mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <button className="text-[#C8945C] font-semibold flex items-center gap-2 mx-auto hover:underline text-sm sm:text-base">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" /> 
              <span>See all {productData.answeredQuestions} answered questions</span>
            </button>
          </motion.div> */}
        </div>
      </section>

      {/* Mobile Sticky CTA - Enhanced */}
      {showStickyBar && (
        <motion.div 
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50 p-3 sm:p-4"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
        >
          <div className="flex items-center gap-2 sm:gap-3 max-w-7xl mx-auto px-3 sm:px-4 w-full overflow-hidden">
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-lg sm:text-xl font-extrabold text-gray-900 whitespace-nowrap">AED {currentPrice?.price?.toFixed(2)}</span>
                {currentPrice?.oldPrice && (
                  <span className="text-xs sm:text-sm text-gray-400 line-through whitespace-nowrap">AED {currentPrice.oldPrice.toFixed(2)}</span>
                )}
              </div>
            </div>

            <motion.button
              onClick={addToCart}
              whileTap={{ scale: 0.95 }}
              className="bg-[#C8945C] hover:bg-[#B8844C] text-white px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 rounded-lg font-semibold flex items-center gap-1.5 sm:gap-2 shadow-lg shrink-0 text-xs sm:text-sm"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Add to Cart</span>
              <span className="sm:hidden whitespace-nowrap">Add</span>
            </motion.button>
            <motion.button
              onClick={handleBuyNow}
              whileTap={{ scale: 0.95 }}
              className="bg-white border border-[#C8945C] text-[#C8945C] px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold shrink-0 text-xs sm:text-sm whitespace-nowrap"
            >
              Buy
            </motion.button>
          </div>
        </motion.div>
      )}

      {showCheckout && currentPrice && product && (
        <PremiumCheckout
          product={productData}
          productId={product._id || productId}
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

