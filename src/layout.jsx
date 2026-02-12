import React, { useState, useEffect } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import ScrollToHash from "./scrollToHash";
import ScrollToTop from "./scrollToTop";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import LoginModal from "./components/LoginModal";
import OTPModal from "./components/OTPModal";
import EarthHarvestPreloader from "./components/Preloader";

export default function Layout() {
  const [showPreloader, setShowPreloader] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("earthHarvestVisited");

    if (!hasVisited) {
      setShowPreloader(true);
    }
  }, []);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem("earthHarvestVisited", "true");
    setShowPreloader(false);
  };

  return (
    <>
 
      {showPreloader && (
        <EarthHarvestPreloader onComplete={handlePreloaderComplete} />
      )}

      <AuthProvider>
        <ScrollToTop />
        <ScrollRestoration />
        <ScrollToHash />
        <Outlet />
        <Footer />
        <LoginModal />
        <OTPModal />
      </AuthProvider>
    </>
  );
}