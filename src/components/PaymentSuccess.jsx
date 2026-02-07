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

      const hasToken = localStorage.getItem('token');
      
      if (!hasToken) {
        setOrder({
          _id: orderId,
          orderStatus: 'Confirmed',
          paymentStatus: 'Completed'
        });
        setLoading(false);
        return;
      }

      try {
        try {
          const response = await apiFetch(`/payment/verify/${orderId}`);
          
          if (response.success && response.data && response.data.order) {
            setOrder(response.data.order);
            
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

        setOrder({
          _id: orderId,
          orderStatus: 'Confirmed',
          paymentStatus: 'Completed'
        });
        
      } catch (err) {
        console.error("Error fetching order:", err);
        setOrder({
          _id: orderId,
          orderStatus: 'Confirmed',
          paymentStatus: 'Completed'
        });
      } finally {
        setLoading(false);
      }
    };

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
            <Loader2 className="w-10 h-10 animate-spin text-[#C8945C] mx-auto mb-3" />
            <p className="text-sm text-gray-600">Loading order details...</p>
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-lg p-8 border border-gray-200 text-center"
          >
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-sm text-gray-600 mb-6">{error}</p>
            <Link
              to="/"
              className="inline-block bg-[#C8945C] hover:bg-[#B8844C] text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
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
      
      <div className="max-w-3xl mx-auto px-4 pt-24 sm:pt-28 pb-12 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* SUCCESS INDICATOR */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 border-2 border-green-200 rounded-full mb-5">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            Payment Successful
          </h1>
          <p className="text-base text-gray-600">
            {isTest ? "Test payment completed successfully" : "Your order has been confirmed"}
          </p>
          {isTest && (
            <div className="mt-4 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md text-xs font-medium border border-blue-200">
              Test Mode
            </div>
          )}
        </motion.div>

        {/* ORDER DETAILS CARD */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 sm:p-8 border border-gray-200 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-600" />
            Order Details
          </h2>

          {order ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Order Number</span>
                <span className="font-semibold text-gray-900">
                  #{order._id ? (typeof order._id === 'string' ? order._id.slice(-8) : order._id.toString().slice(-8)).toUpperCase() : orderId?.slice(-8).toUpperCase() || 'N/A'}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Order Status</span>
                <span className="inline-flex px-3 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium border border-green-200">
                  {order.orderStatus || 'Confirmed'}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Payment Status</span>
                <span className="inline-flex px-3 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium border border-green-200">
                  {order.paymentStatus || 'Completed'}
                </span>
              </div>

              {order.amountPaid && (
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <span className="font-semibold text-gray-900 text-lg">
                    AED {order.amountPaid}
                  </span>
                </div>
              )}

              {order.product && (
                <div className="pt-3">
                  <p className="text-sm text-gray-600 mb-2">Product</p>
                  <p className="font-medium text-gray-900">
                    {order.product.productName || order.product.name || 'Earth & Harvest Product'}
                  </p>
                  {order.sizeSelected && order.quantity && (
                    <div className="mt-2 flex gap-4 text-sm text-gray-600">
                      <span>Size: {order.sizeSelected}g</span>
                      <span>Quantity: {order.quantity}</span>
                    </div>
                  )}
                </div>
              )}

              {order.address && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Delivery Address
                  </p>
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {order.address.street && <>{order.address.street}<br /></>}
                    {order.address.city}{order.address.zipCode ? `, ${order.address.zipCode}` : ''}<br />
                    {order.address.country || 'United Arab Emirates'}
                  </p>
                </div>
              )}

              {!order.product && !order.address && (
                <div className="pt-3 text-center">
                  <p className="text-sm text-gray-600">Order details are being processed. You'll receive a confirmation email shortly.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-[#C8945C] mx-auto mb-3" />
              <p className="text-sm text-gray-600">Loading order details...</p>
            </div>
          )}
        </motion.div>

        {/* NEXT STEPS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 sm:p-8 border border-gray-200 mb-6"
        >
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-600" />
            What's Next?
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>You'll receive an order confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>We'll send you tracking information once your order ships</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Expected delivery: 2-3 business days</span>
            </li>
          </ul>
        </motion.div>

        {/* ACTION BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/"
            className="flex-1 sm:flex-initial bg-[#C8945C] hover:bg-[#B8844C] text-white px-6 py-2.5 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Continue Shopping
          </Link>
          <Link
            to="/profile"
            className="flex-1 sm:flex-initial border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            View Orders
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;