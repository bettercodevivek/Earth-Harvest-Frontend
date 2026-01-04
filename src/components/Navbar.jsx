import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, LogOut, Settings, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ cartCount }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <nav
      className={`sticky top-0 w-full z-50 transition-all duration-300 backdrop-blur-md
      ${scrolled ? 'bg-white/95 py-3 shadow-md border-b border-gray-200' : 'bg-white/80 py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* FLEX CONTAINER */}
        <div className="flex items-center justify-between w-full">

          {/* LEFT - LOGO */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="https://i.ibb.co/99XT05ZF/New-Logo-Tinny-transparent.png"
                alt="Earth & Harvest Logo"
                className="h-10 sm:h-12 lg:h-16 w-auto object-contain"
              />
            </Link>
          </div>

          {/* CENTER NAV LINKS (hidden on mobile, visible on md+) */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#benefits" className="text-gray-700 font-medium text-sm hover:text-[#C8945C] transition-colors">
              Benefits
            </a>
            <a href="#ingredients" className="text-gray-700 font-medium text-sm hover:text-[#C8945C] transition-colors">
              Ingredients
            </a>
            <a href="#reviews" className="text-gray-700 font-medium text-sm hover:text-[#C8945C] transition-colors">
              Reviews
            </a>
            <a href="#faq" className="text-gray-700 font-medium text-sm hover:text-[#C8945C] transition-colors">
              FAQ
            </a>
          </div>

          {/* RIGHT SIDE - CART + USER + BUY BUTTON */}
          <div className="flex items-center space-x-3">

            {/* Cart */}
            <button className="relative p-2.5 text-gray-700 hover:text-[#C8945C] transition-colors rounded-lg hover:bg-gray-50">
              <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />

              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white 
                  text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-[#C8945C] to-[#B8844C] rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-semibold text-gray-700">
                    {user.name || user.email?.split('@')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-[#C8945C]" />
                        <span className="text-sm text-foreground">My Profile</span>
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#C8945C]" />
                          <span className="text-sm text-foreground">Admin Panel</span>
                        </Link>
                      )}
                      <Link
                        to="/profile?tab=settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-[#C8945C]" />
                        <span className="text-sm text-foreground">Settings</span>
                      </Link>
                      <div className="border-t border-gray-200"></div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-600">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}

            {/* CTA */}
            <Link
              to="/product"
              className="bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white hover:from-[#B8844C] hover:to-[#C8945C]
              px-5 sm:px-6 py-2.5 rounded-lg font-semibold transition-all 
              shadow-lg hover:shadow-xl text-sm"
            >
              Shop Now
            </Link>

          </div>
        </div>

        {/* MOBILE NAV LINKS (visible on mobile, centered under main row)
        <div className="flex flex-wrap justify-center gap-4 mt-3 md:hidden">
          <a href="#benefits" className="text-foreground text-sm font-medium hover:text-primary transition">
            Benefits
          </a>
          <a href="#ingredients" className="text-foreground text-sm font-medium hover:text-primary transition">
            Ingredients
          </a>
          <a href="#reviews" className="text-foreground text-sm font-medium hover:text-primary transition">
            Reviews
          </a>
          <a href="#faq" className="text-foreground text-sm font-medium hover:text-primary transition">
            FAQ
          </a>
        </div> */}

      </div>
    </nav>
  );
};

export default Navbar;
