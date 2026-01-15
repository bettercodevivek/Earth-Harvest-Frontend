import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, Home, RotateCcw, AlertCircle } from 'lucide-react';
import Navbar from './Navbar';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] to-[#F8F2EC]">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#2D4A3E] mb-3">
            Payment Failed
          </h1>
          <p className="text-lg text-[#6B7C72] mb-8">
            {error || "We couldn't process your payment. Please try again."}
          </p>

          {/* Error Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-red-200 mb-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-bold text-[#2D4A3E] mb-2">What happened?</h3>
                <p className="text-[#6B7C72] text-sm">
                  Your payment could not be processed. This could be due to insufficient funds, 
                  incorrect card details, or a temporary issue with the payment gateway.
                </p>
              </div>
            </div>

            {orderId && (
              <div className="mt-4 pt-4 border-t-2 border-[#E8DFD0]">
                <p className="text-sm text-[#6B7C72]">
                  Order ID: <span className="font-mono font-semibold text-[#2D4A3E]">{orderId}</span>
                </p>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/product"
              className="flex-1 sm:flex-initial bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </Link>
            <Link
              to="/"
              className="flex-1 sm:flex-initial border-2 border-[#C8945C] text-[#C8945C] px-8 py-4 rounded-xl font-bold hover:bg-[#C8945C]/10 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentFailure;

