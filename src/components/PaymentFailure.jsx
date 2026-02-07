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
      
      <div className="max-w-2xl mx-auto px-4 pt-24 sm:pt-28 pb-12 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* ERROR INDICATOR */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 border-2 border-red-200 rounded-full mb-5">
            <XCircle className="w-9 h-9 text-red-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            Payment Could Not Be Processed
          </h1>
          <p className="text-base text-gray-600 mb-8">
            {error || "We were unable to complete your payment. Please review the details and try again."}
          </p>

          {/* ERROR DETAILS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 sm:p-8 border border-gray-200 mb-6 text-left"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 bg-red-50 border border-red-200 rounded-md flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">What happened?</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Your payment could not be processed. This could be due to insufficient funds, 
                  incorrect card details, or a temporary issue with the payment gateway.
                </p>
              </div>
            </div>

            {orderId && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Order Reference: <span className="font-mono font-medium text-gray-900">{orderId}</span>
                </p>
              </div>
            )}
          </motion.div>

          {/* HELP SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6 text-left"
          >
            <h3 className="text-sm font-semibold text-amber-900 mb-3">What you can do:</h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Verify your payment details and try again</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Check with your bank for any transaction restrictions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Try using a different payment method</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Contact our support team if the issue persists</span>
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
              to="/product"
              className="flex-1 sm:flex-initial bg-[#C8945C] hover:bg-[#B8844C] text-white px-6 py-2.5 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Link>
            <Link
              to="/"
              className="flex-1 sm:flex-initial border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentFailure;