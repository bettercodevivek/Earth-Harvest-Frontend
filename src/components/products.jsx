import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ShoppingCart, Check, Star, Truck, Lock, Package, Gift, Minus, Plus, 
  Shield, Leaf, Award, ChevronDown, ChevronUp, Zap, Clock, Users, 
  ThumbsUp, ThumbsDown, Camera, RotateCcw, BadgeCheck, Sparkles,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  Box, Heart, X
} from 'lucide-react';
import Navbar from './Navbar'
import PremiumCheckout from "./CheckoutModals";
import ReviewForm from "./ReviewForm";
import { apiFetch } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { optimizeCloudinaryImage } from '../utils/cloudinary';


const Product = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, requireAuth, setShowLoginModal, showToast } = useAuth();
  const productId = searchParams.get('id') || "65f9e8c2f4c1a8b345456789";
  
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
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let productToFetch = productId;
        if (!productId || productId === "65f9e8c2f4c1a8b345456789") {
          try {
            const productsResponse = await apiFetch('/products?limit=1');
            if (productsResponse.success && productsResponse.data && productsResponse.data.length > 0) {
              productToFetch = productsResponse.data[0]._id;
            }
          } catch (e) {
            console.log("Could not fetch products list, using provided ID");
          }
        }
        
        if (productToFetch) {
          const response = await apiFetch(`/products/${productToFetch}`);
          if (response.success && response.data) {
            setProduct(response.data);
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

  // Handle keyboard navigation for image modal
  useEffect(() => {
    if (!showImageModal || !product?.images) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowImageModal(false);
      } else if (e.key === 'ArrowLeft' && product.images.length > 1) {
        setModalImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
      } else if (e.key === 'ArrowRight' && product.images.length > 1) {
        setModalImageIndex((prev) => (prev + 1) % product.images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showImageModal, product]);

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
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
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

  const productData = {
    _id: product?._id,
    id: product?._id,
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

  const customerReviews = (product.reviews || []).map((review, idx) => ({
    id: review._id || idx,
    name: review.userName || "Anonymous",
    verified: true,
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
    if (reviewFilter === 'all') return true;
    return review.rating.toString() === reviewFilter;
  }).sort((a, b) => {
    if (b.helpful !== a.helpful) return b.helpful - a.helpful;
    return new Date(b.date) - new Date(a.date);
  });

  const currentPrice = productData.sizes.find(s => s.weight.toString() === selectedSize || s.weight === selectedSize);

  const addToCart = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
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
    { name: "Crude Protein", value: "69% min", bar: 69 },
    { name: "Crude Fat", value: "4% max", bar: 4 },
    { name: "Ash", value: "7% max", bar: 7 },
    { name: "Moisture", value: "14% max", bar: 14 },
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
    { q: "What size should I choose?", a: "Coming soon" },
    { q: "Is this suitable for puppies?", a: "Coming soon" },
    { q: "How do I transition my dog to this food?", a: "Coming soon" },
    { q: "What if my dog doesn't like it?", a: "Coming soon" },
    { q: "Where is this product made?", a: "Coming soon" },
    { q: "Is this grain-free?", a: "Coming soon" },
  ];

  const handleHelpful = (reviewId, type) => {
    setHelpfulReviews(prev => ({
      ...prev,
      [reviewId]: prev[reviewId] === type ? null : type
    }));
  };

  const handleBuyNow = async () => {
    requireAuth(async () => {
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
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-20">
            {/* Product Images */}
            <div className="space-y-3 sm:space-y-4 order-1 w-full">
              {productData.images.length > 0 && (
                <div 
                  ref={imageRef}
                  className={`relative w-full aspect-square max-h-[85vw] sm:max-h-none rounded-xl bg-white border border-gray-200 shadow-md group ${
                    zoomLevel > 1 ? 'overflow-auto' : 'overflow-hidden'
                  }`}
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
                        duration: 0.5,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 cursor-pointer"
                      onClick={() => {
                        setModalImageIndex(selectedImage);
                        setShowImageModal(true);
                      }}
                    >
                      <img
                        src={optimizeCloudinaryImage(productData.images[selectedImage] || productData.images[0], "w_800", false)}
                        alt={productData.name}
                        className="w-full h-full object-cover transition-transform duration-300"
                        style={{
                          transform: `scale(${zoomLevel})`,
                          transformOrigin: 'center center',
                        }}
                        width="800"
                        height="800"
                        fetchPriority="high"
                        draggable={false}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Simplified Badges */}
                  <motion.div 
                    className="absolute top-3 left-3 flex flex-col gap-2 z-10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="bg-[#2D4A3E]/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md">
                      SAVE 25%
                    </span>
                    <span className="bg-[#C8945C]/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md">
                      BESTSELLER
                    </span>
                  </motion.div>

                  {/* Minimized Zoom Controls - Show on Hover */}
                  <motion.div 
                    className="absolute top-3 right-3 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <button
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 3}
                      className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-all disabled:opacity-40"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4 mx-auto text-gray-700" />
                    </button>
                    <button
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 1}
                      className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-all disabled:opacity-40"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4 mx-auto text-gray-700" />
                    </button>
                    {zoomLevel > 1 && (
                      <button
                        onClick={handleResetZoom}
                        className="w-9 h-9 rounded-lg bg-[#C8945C] text-white shadow-md hover:bg-[#B8844C] transition-all"
                        title="Reset Zoom"
                      >
                        <RotateCcw className="w-4 h-4 mx-auto" />
                      </button>
                    )}
                  </motion.div>

                  {/* Navigation Arrows */}
                  {productData.images.length > 1 && (
                    <>
                      <button
                        onClick={() => goToImage((selectedImage - 1 + productData.images.length) % productData.images.length, -1)}
                        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full items-center justify-center shadow-lg hover:bg-white transition-all z-10"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() => goToImage((selectedImage + 1) % productData.images.length, 1)}
                        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full items-center justify-center shadow-lg hover:bg-white transition-all z-10"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </button>
                    </>
                  )}

                  {/* Unified Image Counter */}
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium z-10">
                    {selectedImage + 1} / {productData.images.length}
                    {zoomLevel > 1 && ` • ${Math.round(zoomLevel * 100)}%`}
                  </div>

                  {/* Swipe Indicator (Mobile) */}
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-16 left-1/2 -translate-x-1/2 sm:hidden flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs z-10"
                  >
                    <span>Swipe for more</span>
                    <ChevronRight className="w-3 h-3 animate-pulse" />
                  </motion.div>
                </div>
              )}

              {/* Improved Thumbnails */}
              {productData.images.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {productData.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToImage(idx, idx > selectedImage ? 1 : -1)}
                      className={`w-16 h-16 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 transition-all`}
                    >
                      <img 
                        src={optimizeCloudinaryImage(img, "w_400", true)} 
                        alt="" 
                        className="w-full h-full object-cover" 
                        width="96"
                        height="96"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Click to view full size message */}
              <p className="text-xs text-gray-500 text-center mt-2">
                Click image to view full size
              </p>
            </div>

            {/* Product Info & Buy Box */}
            <div className="space-y-6 sm:space-y-8 order-2 w-full" ref={buyBoxRef}>
              {/* Breadcrumb - Moved to Top */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Link to="/" className="hover:text-[#C8945C] transition-colors">Home</Link>
                <span>/</span>
                <span className="text-gray-900">{productData.brand}</span>
              </div>

              {/* Brand & Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link to="/" className="text-[#C8945C] hover:text-[#B8844C] text-sm font-semibold uppercase tracking-wider transition-colors inline-block mb-3">
                  {productData.brand}
                </Link>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D4A3E] mb-6 leading-tight max-w-2xl">
                  {productData.name}
                </h1>
                
                {/* Condensed Rating Section */}
                <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(productData.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-gray-900">{productData.rating}</span>
                  </div>
                  <a href="#reviews" className="text-sm text-gray-600 hover:text-[#C8945C] underline underline-offset-2 font-medium">
                    {productData.reviews.toLocaleString()} reviews
                  </a>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>{productData.soldThisMonth.toLocaleString()}+ sold</span>
                  </div>
                </div>

                {/* Reduced Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#2D4A3E] to-[#3a5c4e] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    BESTSELLER
                  </span>
                  <span className="inline-flex items-center gap-1.5 border-2 border-[#C8945C] text-[#2D4A3E] px-4 py-2 rounded-full text-xs font-semibold bg-white">
                    <Shield className="w-3.5 h-3.5 text-[#C8945C]" />
                    CUSTOMER APPROVED
                  </span>
                </div>

                {/* Description */}
                <p className="text-base text-gray-700 leading-relaxed mb-8 max-w-2xl">
                  {productData.description}
                </p>
              </motion.div>

              {/* BUY BOX */}
              <motion.div 
                className="bg-[#FAF7F2] rounded-lg p-6 border border-[#E8DFD0] shadow-sm lg:sticky lg:top-24 space-y-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* PRICE SECTION */}
                <div className="pb-4 border-b border-[#E8DFD0]">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-3xl font-semibold text-[#2D4A3E]">
                      AED {currentPrice?.price?.toFixed(2)}
                    </span>
                    {currentPrice?.oldPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        AED {currentPrice.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {currentPrice?.oldPrice && (
                    <p className="text-sm text-[#2D4A3E]">
                      Save AED {(currentPrice.oldPrice - currentPrice.price).toFixed(2)}
                    </p>
                  )}
                </div>

                {/* AVAILABILITY & DELIVERY */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-[#2cb079]">
                    <span>In Stock</span>
                    <span className="text-gray-400">•</span>
                    {/* <span className="text-gray-600">{productData.stock} available</span> */}
                  </div>
                  <div className="text-gray-600">
                    Free delivery • 5-7 business days
                  </div>
                </div>

                {/* QUANTITY SELECTOR */}
                <div className="space-y-2.5 pb-4 border-b border-[#E8DFD0]">
                  <label className="block text-sm font-medium text-[#2D4A3E]">Quantity</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 flex items-center justify-center border border-[#E8DFD0] bg-white hover:border-[#C8945C] hover:bg-[#FAF7F2] transition-colors"
                    >
                      <Minus className="w-4 h-4 text-[#2D4A3E]" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={productData.stock}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(Math.max(1, Math.min(val, productData.stock)));
                      }}
                      className="w-20 text-center text-base font-medium border border-[#E8DFD0] bg-white py-2 focus:border-[#C8945C] focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(productData.stock, quantity + 1))}
                      className="w-9 h-9 flex items-center justify-center border border-[#E8DFD0] bg-white hover:border-[#C8945C] hover:bg-[#FAF7F2] transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[#2D4A3E]" />
                    </button>
                  </div>
                </div>

                {/* CTA SECTION */}
                <div className="space-y-2.5">
                  <button
                    onClick={addToCart}
                    className="w-full bg-[#C8945C] text-white py-3 rounded-md font-medium text-sm hover:bg-[#B8844C] transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full border border-[#E8DFD0] text-[#2D4A3E] bg-white py-3 rounded-md font-medium text-sm hover:bg-[#FAF7F2] transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-16 sm:py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Improved Tab Bar */}
          <div className="flex flex-col sm:flex-row border-b-2 border-gray-200 gap-2 sm:gap-0 mb-10">
            {[
              { id: 'description', label: 'Description' },
              { id: 'ingredients', label: 'Ingredients' },
              { id: 'nutrition', label: 'Nutrition Facts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold text-base transition-all sm:border-b-2 sm:-mb-0.5 rounded-lg sm:rounded-none ${
                  activeTab === tab.id
                    ? 'text-[#C8945C] sm:border-[#C8945C] bg-[#C8945C]/5 sm:bg-transparent'
                    : 'text-gray-600 sm:border-transparent hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[300px]">
            {activeTab === 'description' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-8"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">About This Product</h3>
                  <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line max-w-3xl">
                    {productData.longDescription}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                  {(productData.features.length > 0 ? productData.features : features).map((feature, idx) => {
                    const Icon = feature.icon || features[idx]?.icon || Shield;
                    return (
                      <div key={idx} className="space-y-3">
                        <div className="w-12 h-12 border-2 border-[#C8945C]/20 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[#C8945C]" />
                        </div>
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'ingredients' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-6"
              >
                <h3 className="text-2xl font-semibold text-gray-900">Premium Ingredients</h3>
                <p className="text-gray-600 max-w-2xl">
                  Every ingredient is carefully selected for quality and nutritional value.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <p className="text-base text-gray-700 leading-relaxed">
                    {(productData.ingredients.length > 0 ? productData.ingredients : ingredients).join(', ')}
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-start gap-3">
                    <Leaf className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">No Artificial Additives</h4>
                      <p className="text-sm text-gray-700">
                        Earth & Harvest Complete contains no artificial preservatives.
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
                <h3 className="text-2xl font-semibold text-gray-900">Guaranteed Analysis</h3>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden max-w-2xl">
                  {(productData.nutritionFacts.length > 0 ? productData.nutritionFacts : nutritionFacts).map((fact, idx, arr) => (
                    <div 
                      key={idx} 
                      className={`p-5 ${idx !== arr.length - 1 ? 'border-b border-gray-200' : ''}`}
                    >
                      <div className="flex justify-between items-baseline mb-3">
                        <span className="font-medium text-gray-900">{fact.name}</span>
                        <span className="text-lg font-semibold text-[#C8945C]">{fact.value}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#C8945C] h-2 rounded-full transition-all"
                          style={{ width: `${fact.bar}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-16 sm:py-20 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">Customer Reviews</h2>
            <p className="text-gray-600">Real feedback from verified customers</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm lg:sticky lg:top-24">
                <div className="text-center pb-6 border-b border-gray-200">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{productData.rating}</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Based on {productData.reviews.toLocaleString()} reviews</p>
                </div>

                <div className="space-y-2 py-6">
                  {ratingBreakdown.map((item) => (
                    <button 
                      key={item.stars}
                      onClick={() => setReviewFilter(item.stars.toString())}
                      className="flex items-center gap-3 w-full text-sm hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <span className="text-gray-700 font-medium w-12">{item.stars} ★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#C8945C] h-2 rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-gray-600 w-12 text-right">{item.percentage}%</span>
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowLoginModal(true);
                    } else {
                      setShowReviewForm(true);
                    }
                  }}
                  className="w-full bg-[#C8945C] hover:bg-[#B8844C] text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Write a Review
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">Customer Reviews</h3>

                <select
                  value={reviewFilter}
                  onChange={(e) => setReviewFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:border-[#C8945C] focus:ring-1 focus:ring-[#C8945C] focus:outline-none"
                >
                  <option value="all">All Reviews</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              {customerReviews.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                  <p className="text-gray-500 mb-6">No reviews yet. Be the first to review this product!</p>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        setShowLoginModal(true);
                      } else {
                        setShowReviewForm(true);
                      }
                    }}
                    className="bg-[#C8945C] hover:bg-[#B8844C] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Write the First Review
                  </button>
                </div>
              ) : (
                <>
                  {customerReviews.map((review, idx) => (
                    <div
                      key={review.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#C8945C] to-[#B8844C] rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                          {review.name.charAt(0)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">{review.name}</span>
                            {review.verified && (
                              <BadgeCheck className="w-4 h-4 text-[#C8945C]" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span>•</span>
                            <span>{review.date}</span>
                          </div>
                        </div>
                      </div>

                      {review.title && (
                        <h4 className="font-semibold text-gray-900">{review.title}</h4>
                      )}
                      <p className="text-gray-700 leading-relaxed">{review.content}</p>

                      {review.images?.length > 0 && (
                        <div className="flex gap-2">
                          {review.images.map((img, i) => (
                            <img 
                              key={i} 
                              src={optimizeCloudinaryImage(img, "w_400", true)} 
                              className="w-20 h-20 rounded-lg object-cover border border-gray-200" 
                              width="80"
                              height="80"
                              loading="lazy"
                              alt="Review image"
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 text-sm">
                        <span className="text-gray-600">{review.helpful} found this helpful</span>
                        <button
                          onClick={() => handleHelpful(review.id, "up")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                            helpfulReviews[review.id] === "up" 
                              ? 'bg-[#C8945C] text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Helpful
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="questions" className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-semibold text-center mb-12 text-gray-900">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex justify-between items-start w-full p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-8 text-base">{faq.q}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-gray-600 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA - Improved */}
      {showStickyBar && (
        <motion.div 
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 p-4"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
        >
          <div className="flex items-center gap-3 max-w-7xl mx-auto">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xl font-bold text-gray-900">AED {currentPrice?.price?.toFixed(2)}</span>
                {currentPrice?.oldPrice && (
                  <span className="text-sm text-gray-400 line-through">AED {currentPrice.oldPrice.toFixed(2)}</span>
                )}
              </div>
              <span className="text-xs text-gray-600">Qty: {quantity}</span>
            </div>

            <button
              onClick={addToCart}
              className="bg-[#C8945C] hover:bg-[#B8844C] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg shrink-0"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
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
            window.location.reload();
          }}
        />
      )}

      {/* Full Size Image Modal */}
      <AnimatePresence>
        {showImageModal && productData.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Image Container */}
            <div 
              className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={modalImageIndex}
                  src={optimizeCloudinaryImage(productData.images[modalImageIndex] || productData.images[0], "w_1200", false)}
                  alt={productData.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-full max-h-full object-contain"
                  draggable={false}
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {productData.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalImageIndex((modalImageIndex - 1 + productData.images.length) % productData.images.length);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalImageIndex((modalImageIndex + 1) % productData.images.length);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {productData.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium">
                  {modalImageIndex + 1} / {productData.images.length}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pb-24 lg:pb-0" />
    </div>
  );
};

export default Product;