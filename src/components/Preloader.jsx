import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { optimizeCloudinaryImage } from '../utils/cloudinary';

const ingredients = [
  {
    name: "Yak & Cow Milk",
    icon: optimizeCloudinaryImage("https://res.cloudinary.com/dpc7tj2ze/image/upload/v1770889027/glass-of-milk-svgrepo-com_eolgvp.svg", "w_auto", false),
  },
  {
    name: "Lime Juice",
    icon: optimizeCloudinaryImage("https://res.cloudinary.com/dpc7tj2ze/image/upload/v1770889027/lime-svgrepo-com_ceqkrf.svg", "w_auto", false),
  },
  {
    name: "Natural Salt",
    icon: optimizeCloudinaryImage("https://res.cloudinary.com/dpc7tj2ze/image/upload/v1770889026/salt-svgrepo-com_qkvy79.svg", "w_auto", false),
  },
];

const EarthHarvestPreloader = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // Check if page is already loaded - if so, skip preloader quickly
    const isPageLoaded = document.readyState === 'complete';
    
    // If page is already loaded, skip preloader entirely
    if (isPageLoaded) {
      onComplete?.();
      return;
    }
    
    // Listen for page load event
    const handleLoad = () => {
      // If page loads before preloader completes, finish quickly
      setExit(true);
      setTimeout(() => onComplete?.(), 200);
    };
    
    window.addEventListener('load', handleLoad);
    
    const timers = [
      setTimeout(() => setStage(1), 0),           // Logo
      setTimeout(() => setStage(2), 400),         // Tagline
      setTimeout(() => setStage(3), 800),         // Ingredients slide
      setTimeout(() => setStage(4), 1200),        // Final line
      setTimeout(() => setExit(true), 1500),
      setTimeout(() => {
        window.removeEventListener('load', handleLoad);
        onComplete?.();
      }, 1800), // Max 1800ms total
    ];

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('load', handleLoad);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#F5EFE6] text-[#2E2E2E] px-4"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <motion.img
            src={optimizeCloudinaryImage("https://res.cloudinary.com/dpc7tj2ze/image/upload/v1767539648/New_Logo_Tinny_transparent_v6if1w.png", "w_auto", false)}
            alt="Earth & Harvest"
            className="w-32 mb-6"
            width="128"
            height="128"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 1 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Tagline */}
          <motion.p
            className="text-lg tracking-wide mb-12 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: stage >= 2 ? 1 : 0,
              y: stage >= 2 ? 0 : 10,
            }}
            transition={{ duration: 0.6 }}
          >
            100% Natural Chews for Dogs
          </motion.p>

          {/* Ingredients Row */}
          <div className="flex gap-12 mb-12 flex-wrap justify-center">
            {ingredients.map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 40 }}
                animate={{
                  opacity: stage >= 3 ? 1 : 0,
                  y: stage >= 3 ? 0 : 40,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.3,
                }}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-12 h-12 mb-3"
                  width="48"
                  height="48"
                />
                <p className="text-sm font-medium">{item.name}</p>
              </motion.div>
            ))}
          </div>

          {/* Final Line */}
          <motion.p
            className="text-lg font-medium tracking-wide text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 4 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          >
            Only 3 Simple Ingredients. Nothing Else.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EarthHarvestPreloader;