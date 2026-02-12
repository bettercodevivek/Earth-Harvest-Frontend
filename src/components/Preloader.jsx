import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ingredients = [
  {
    name: "Yak & Cow Milk",
    icon: "https://res.cloudinary.com/dpc7tj2ze/image/upload/v1770889027/glass-of-milk-svgrepo-com_eolgvp.svg", // add real svg icons
  },
  {
    name: "Lime Juice",
    icon: "https://res.cloudinary.com/dpc7tj2ze/image/upload/v1770889027/lime-svgrepo-com_ceqkrf.svg",
  },
  {
    name: "Natural Salt",
    icon: "https://res.cloudinary.com/dpc7tj2ze/image/upload/v1770889026/salt-svgrepo-com_qkvy79.svg",
  },
];

const EarthHarvestPreloader = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 0),      // Logo
      setTimeout(() => setStage(2), 800),    // Tagline
      setTimeout(() => setStage(3), 1600),   // Ingredients slide
      setTimeout(() => setStage(4), 2800),   // Final line
      setTimeout(() => setExit(true), 3300),
      setTimeout(() => onComplete?.(), 3800),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F5EFE6] text-[#2E2E2E] px-4"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <motion.img
            src="https://res.cloudinary.com/dpc7tj2ze/image/upload/v1767539648/New_Logo_Tinny_transparent_v6if1w.png"
            alt="Earth & Harvest"
            className="w-32 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 1 ? 1 : 0 }}
            transition={{ duration: 0.8 }}
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