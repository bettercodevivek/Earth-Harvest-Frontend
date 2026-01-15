import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, Mail, Home, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, showToast } = useAuth();
  const orderId = searchParams.get('orderId');
  const isTest = searchParams.get('test') === 'true';
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("Order ID is missing");
        setLoading(false);
        return;
      }

      // Check if user has token (might be authenticated but context not loaded yet)
      const hasToken = localStorage.getItem('token');
      
      if (!hasToken) {
        // No token, but still show success page with basic info
        setOrder({
          _id: orderId,
          orderStatus: 'Confirmed',
          paymentStatus: 'Completed'
        });
        setLoading(false);
        return;
      }

      try {
        // Try to verify payment and get order details
        try {
          const response = await apiFetch(`/payment/verify/${orderId}`);
          
          if (response.success && response.data && response.data.order) {
            setOrder(response.data.order);
            
            // Show success toast
            if (showToast) {
              showToast({
                type: 'success',
                title: 'Payment Successful!',
                message: isTest ? 'Test payment completed successfully' : 'Your order has been confirmed',
                duration: 5000
              });
            }
            setLoading(false);
            return;
          }
        } catch (verifyErr) {
          console.log("Verify payment failed, trying direct order fetch:", verifyErr);
        }

        // If verify fails, try to get order directly
        try {
          const orderResponse = await apiFetch(`/order/${orderId}`);
          if (orderResponse.success && orderResponse.data) {
            setOrder(orderResponse.data);
            setLoading(false);
            return;
          }
        } catch (orderErr) {
          console.log("Direct order fetch failed:", orderErr);
        }

        // If both fail, still show success with basic info from URL
        setOrder({
          _id: orderId,
          orderStatus: 'Confirmed',
          paymentStatus: 'Completed'
        });
        
      } catch (err) {
        console.error("Error fetching order:", err);
        // Even if we can't fetch order details, show success page with orderId
        setOrder({
          _id: orderId,
          orderStatus: 'Confirmed',
          paymentStatus: 'Completed'
        });
      } finally {
        setLoading(false);
      }
    };

    // Always try to fetch if we have orderId
    if (orderId) {
      fetchOrderDetails();
    } else {
      setError("Order ID is missing");
      setLoading(false);
    }
  }, [orderId, isTest, showToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] to-[#F8F2EC]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#C8945C] mx-auto mb-4" />
            <p className="text-[#2D4A3E] font-medium">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] to-[#F8F2EC]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl text-center border-2 border-red-200"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#2D4A3E] mb-2">Error</h2>
            <p className="text-[#6B7C72] mb-6">{error}</p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Go Home
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] to-[#F8F2EC]">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 pt-24 sm:pt-28 pb-12 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#2D4A3E] mb-3">
            Payment Successful!
          </h1>
          <p className="text-lg text-[#6B7C72]">
            {isTest ? "Test payment completed successfully" : "Thank you for your order"}
          </p>
          {isTest && (
            <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              Test Mode
            </div>
          )}
        </motion.div>

        {/* Order Details Card - Always show, even with minimal info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-[#E8DFD0] mb-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-[#2D4A3E] mb-6 flex items-center gap-2">
            <Package className="w-6 h-6 text-[#C8945C]" />
            Order Details
          </h2>

          {order ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b-2 border-[#E8DFD0]">
                <span className="text-[#6B7C72] font-medium">Order Number</span>
                <span className="font-bold text-[#2D4A3E] text-lg">
                  #{order._id ? (typeof order._id === 'string' ? order._id.slice(-8) : order._id.toString().slice(-8)).toUpperCase() : orderId?.slice(-8).toUpperCase() || 'N/A'}
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b-2 border-[#E8DFD0]">
                <span className="text-[#6B7C72] font-medium">Order Status</span>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                  {order.orderStatus || 'Confirmed'}
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b-2 border-[#E8DFD0]">
                <span className="text-[#6B7C72] font-medium">Payment Status</span>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                  {order.paymentStatus || 'Completed'}
                </span>
              </div>

              {order.amountPaid && (
                <div className="flex justify-between items-center pb-4 border-b-2 border-[#E8DFD0]">
                  <span className="text-[#6B7C72] font-medium">Total Amount</span>
                  <span className="font-bold text-[#C8945C] text-xl">
                    AED {order.amountPaid}
                  </span>
                </div>
              )}

              {order.product && (
                <div className="pt-4">
                  <p className="text-[#6B7C72] font-medium mb-2">Product</p>
                  <p className="font-semibold text-[#2D4A3E]">
                    {order.product.productName || order.product.name || 'Earth & Harvest Product'}
                  </p>
                  {order.sizeSelected && order.quantity && (
                    <div className="mt-2 flex gap-4 text-sm text-[#6B7C72]">
                      <span>Size: {order.sizeSelected}g</span>
                      <span>Quantity: {order.quantity}</span>
                    </div>
                  )}
                </div>
              )}

              {order.address && (
                <div className="pt-4 border-t-2 border-[#E8DFD0]">
                  <p className="text-[#6B7C72] font-medium mb-2 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Delivery Address
                  </p>
                  <p className="text-[#2D4A3E]">
                    {order.address.street && <>{order.address.street}<br /></>}
                    {order.address.city}{order.address.zipCode ? `, ${order.address.zipCode}` : ''}<br />
                    {order.address.country || 'United Arab Emirates'}
                  </p>
                </div>
              )}

              {!order.product && !order.address && (
                <div className="pt-4 text-center text-[#6B7C72]">
                  <p className="text-sm">Order details are being processed. You'll receive a confirmation email shortly.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-[#C8945C] mx-auto mb-4" />
              <p className="text-[#6B7C72]">Loading order details...</p>
            </div>
          )}
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-[#E8DFD0] mb-6"
        >
          <h3 className="text-xl font-bold text-[#2D4A3E] mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#C8945C]" />
            What's Next?
          </h3>
          <ul className="space-y-3 text-[#6B7C72]">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>You'll receive an order confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>We'll send you tracking information once your order ships</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Expected delivery: 2-3 business days</span>
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="flex-1 sm:flex-initial bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Continue Shopping
          </Link>
          <Link
            to="/profile"
            className="flex-1 sm:flex-initial border-2 border-[#C8945C] text-[#C8945C] px-8 py-4 rounded-xl font-bold hover:bg-[#C8945C]/10 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            View Orders
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

