import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Package, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';
import Navbar from './Navbar';
import PremiumCheckout from './CheckoutModals';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated, showToast, requireAuth } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [updating, setUpdating] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      showToast({
        type: 'error',
        title: 'Login Required',
        message: 'Please login to view your cart'
      });
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/cart');
      if (response.success) {
        setCart(response.data);
        const totalItems = response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load cart'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }

    try {
      setUpdating(itemId);
      const response = await apiFetch('/cart/update', {
        method: 'PUT',
        body: JSON.stringify({ itemId, quantity: newQuantity })
      });

      if (response.success) {
        setCart(response.data);
        const totalItems = response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(totalItems);
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Cart updated'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update cart'
      });
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setUpdating(itemId);
      const response = await apiFetch(`/cart/item/${itemId}`, {
        method: 'DELETE'
      });

      if (response.success) {
        setCart(response.data);
        const totalItems = response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(totalItems);
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Item removed from cart'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to remove item'
      });
    } finally {
      setUpdating(null);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    
    return cart.items.reduce((total, item) => {
      if (!item.product || !item.product.sizes) return total;
      const size = item.product.sizes.find(s => 
        s.weight.toString() === item.size || s.weight === item.size
      );
      if (!size) return total;
      return total + (size.price * item.quantity);
    }, 0);
  };

  const handleProceedToCheckout = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Your cart is empty'
      });
      return;
    }

    requireAuth(() => {
      setShowCheckout(true);
    });
  };

  const initiatePayment = async () => {
    try {
      if (!cart || !cart.items || cart.items.length === 0) {
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Your cart is empty'
        });
        return;
      }

      // Process all cart items - create orders for each item
      const normalizedPhone = address.phone ? address.phone.replace(/\s+/g, '') : address.phone;
      const formattedAddress = {
        street: address.street,
        city: address.city,
        state: address.state || "",
        country: address.country || "United Arab Emirates",
        zipCode: address.zipcode ? parseInt(address.zipcode) : undefined,
        phone: normalizedPhone
      };

      // For now, process the first item. In the future, we can process all items
      const firstItem = cart.items[0];
      if (!firstItem || !firstItem.product) {
        throw new Error("Invalid cart item");
      }

      const size = firstItem.product.sizes?.find(s => 
        s.weight.toString() === firstItem.size || s.weight === firstItem.size
      );

      if (!size) {
        throw new Error("Invalid size selected");
      }

      const amount = size.price * firstItem.quantity;

      const orderRes = await apiFetch('/order/create', {
        method: "POST",
        body: JSON.stringify({
          productId: firstItem.product._id,
          sizeSelected: firstItem.size,
          quantity: firstItem.quantity,
          address: formattedAddress,
          amount,
          fromCart: true,
          cartItemId: firstItem._id
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
      showToast({
        type: 'error',
        title: 'Error',
        message: err.message || "Checkout failed. Please try again."
      });
    }
  };

  // Get the first cart item for checkout (since checkout modal handles single product)
  const getFirstCartItemForCheckout = () => {
    if (!cart || !cart.items || cart.items.length === 0) return null;
    
    const firstItem = cart.items[0];
    const size = firstItem.product?.sizes?.find(s => 
      s.weight.toString() === firstItem.size || s.weight === firstItem.size
    );

    if (!size) return null;

    return {
      product: {
        _id: firstItem.product._id,
        productName: firstItem.product.productName || firstItem.product.name,
        name: firstItem.product.productName || firstItem.product.name,
        images: firstItem.product.images || [],
        sizes: firstItem.product.sizes || []
      },
      productId: firstItem.product._id,
      selectedSize: firstItem.size,
      quantity: firstItem.quantity,
      currentPrice: size
    };
  };

  const checkoutData = getFirstCartItemForCheckout();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navbar cartCount={cartCount} />
      
      <div className="max-w-7xl mt-8 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/product"
            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#2D4A3E]" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[#2D4A3E]">
              Shopping Cart
            </h1>
            {cart?.items?.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Loading your cart...</p>
          </div>
        ) : !cart || !cart.items || cart.items.length === 0 ? (
          <div className="bg-white p-12 text-center border border-[#E8DFD0] rounded-lg shadow-sm">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#2D4A3E] mb-2">Your cart is empty</h2>
            <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
              Discover premium pet products and start building your perfect order.
            </p>
            <Link
              to="/product"
              className="inline-flex items-center gap-2 bg-[#C8945C] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#B8844C] rounded-md transition-colors"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* CART ITEMS - LEFT SIDE */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-[#E8DFD0] shadow-sm p-6">
                <div className="border-b border-[#E8DFD0] mb-4 pb-3">
                  <div className="grid grid-cols-12 gap-4 text-xs font-medium text-[#2D4A3E] uppercase tracking-wide">
                    <div className="col-span-5">Product</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Unit Price</div>
                    <div className="col-span-2 text-right">Total</div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
                <div className="space-y-0">
                  {cart.items.map((item, index) => {
                    const size = item.product?.sizes?.find(s => 
                      s.weight.toString() === item.size || s.weight === item.size
                    );
                    const itemPrice = size?.price || 0;
                    const itemTotal = itemPrice * item.quantity;

                    return (
                      <div
                        key={item._id}
                        className="grid grid-cols-12 gap-4 py-4 border-b border-[#E8DFD0] last:border-0 items-center"
                      >
                        {/* PRODUCT INFO */}
                        <div className="col-span-12 sm:col-span-5 flex items-center gap-3">
                          {item.product?.images?.[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.productName}
                              className="w-16 h-16 object-cover border border-[#E8DFD0] rounded-md"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-[#2D4A3E] text-sm truncate">
                              {item.product?.productName || 'Product'}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Size: {item.size}g
                            </p>
                          </div>
                        </div>

                        {/* QUANTITY */}
                        <div className="col-span-6 sm:col-span-2 flex items-center justify-center gap-1">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={updating === item._id}
                            className="w-7 h-7 flex items-center justify-center border border-[#E8DFD0] bg-white hover:border-[#C8945C] hover:bg-[#FAF7F2] disabled:opacity-50 transition-colors rounded-md"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3 text-[#2D4A3E]" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium text-[#2D4A3E]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={updating === item._id}
                            className="w-7 h-7 flex items-center justify-center border border-[#E8DFD0] bg-white hover:border-[#C8945C] hover:bg-[#FAF7F2] disabled:opacity-50 transition-colors rounded-md"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3 text-[#2D4A3E]" />
                          </button>
                        </div>

                        {/* UNIT PRICE */}
                        <div className="col-span-3 sm:col-span-2 text-right">
                          <p className="text-sm font-medium text-[#2D4A3E]">
                            AED {itemPrice.toFixed(2)}
                          </p>
                        </div>

                        {/* TOTAL */}
                        <div className="col-span-3 sm:col-span-2 text-right">
                          <p className="text-sm font-semibold text-[#2D4A3E]">
                            AED {itemTotal.toFixed(2)}
                          </p>
                        </div>

                        {/* REMOVE */}
                        <div className="col-span-12 sm:col-span-1 flex justify-end">
                          <button
                            onClick={() => removeItem(item._id)}
                            disabled={updating === item._id}
                            className="p-1.5 text-gray-400 hover:text-[#C8945C] disabled:opacity-50 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY - RIGHT SIDE */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#E8DFD0] rounded-lg shadow-sm p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold text-[#2D4A3E] mb-4 pb-3 border-b border-[#E8DFD0]">
                  Order Summary
                </h2>
                
                {/* PRICING BREAKDOWN */}
                <div className="space-y-3 mb-4 pb-4 border-b border-[#E8DFD0]">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#2D4A3E]">AED {calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Shipping</span>
                    <span className="font-medium text-[#2D4A3E]">Free</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#E8DFD0]">
                    <span className="font-semibold text-[#2D4A3E]">Total</span>
                    <span className="text-lg font-semibold text-[#C8945C]">
                      AED {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* CTA BUTTONS */}
                <div className="space-y-2.5">
                  <button 
                    onClick={handleProceedToCheckout}
                    className="w-full bg-[#C8945C] text-white py-2.5 text-sm font-medium hover:bg-[#B8844C] rounded-md transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <Link
                    to="/product"
                    className="block w-full border border-[#E8DFD0] text-[#2D4A3E] bg-white text-center py-2.5 text-sm font-medium hover:bg-[#FAF7F2] rounded-md transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CHECKOUT MODAL */}
      {showCheckout && checkoutData && (
        <PremiumCheckout
          product={checkoutData.product}
          productId={checkoutData.productId}
          selectedSize={checkoutData.selectedSize}
          quantity={checkoutData.quantity}
          currentPrice={checkoutData.currentPrice}
          address={address}
          setAddress={setAddress}
          onClose={() => setShowCheckout(false)}
          onPayNow={initiatePayment}
        />
      )}
    </div>
  );
};

export default Cart;