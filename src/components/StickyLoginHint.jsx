import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const StickyLoginHint = () => {
  const { isAuthenticated, setShowLoginModal } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show hint immediately on mount if not authenticated and mobile
  useEffect(() => {
    if (!isAuthenticated && isMobile) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isAuthenticated, isMobile]);

  if (isAuthenticated || !isMobile) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 w-full h-7 z-50 pointer-events-none"
          style={{ 
            height: '28px',
            background: 'rgba(250, 247, 242, 0.95)', // subtle beige background with slight transparency
            backdropFilter: 'blur(8px)'
          }}
        >
          <div className="w-full h-full flex items-center justify-center pointer-events-auto">
            <p 
              className="text-center text-sm font-normal"
              style={{
                fontSize: '13px',
                fontWeight: 400,
                color: '#5C4033', // neutral dark brown
                lineHeight: '28px'
              }}
            >
              Back for more treats ?{' '}
              <button
                onClick={() => setShowLoginModal(true)}
                className="font-semibold transition-colors focus:outline-none"
                style={{
                  fontWeight: 600,
                  color: '#C8945C', // brand accent brown
                  cursor: 'pointer'
                }}
              >
                Login
              </button>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyLoginHint;

