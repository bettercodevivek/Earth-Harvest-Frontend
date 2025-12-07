import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const Navbar = ({ cartCount }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#F8F2EC]  py-2' : 'bg-[#F8F2EC] py-3'}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3">
            <img 
              src="https://i.ibb.co/99XT05ZF/New-Logo-Tinny-transparent.png" 
              alt="Nourish Logo"
              className="w-24 sm:w-28 lg:w-32 h-10 sm:h-12 lg:h-14 object-contain"
            />
          </a>
          
         <div className="hidden md:flex items-center space-x-8">
  <a
    href="#benefits"
    className="underline-animate text-foreground transition-colors font-medium text-sm"
  >
    Benefits
  </a>
  <a
    href="#ingredients"
    className="underline-animate text-foreground transition-colors font-medium text-sm"
  >
    Ingredients
  </a>
  <a
    href="#reviews"
    className="underline-animate text-foreground transition-colors font-medium text-sm"
  >
    Reviews
  </a>
  <a
    href="#faq"
    className="underline-animate text-foreground transition-colors font-medium text-sm"
  >
    FAQ
  </a>
</div>


          {/* Cart + CTA */}
          <div className="flex items-center space-x-3">
            <button className="relative p-2 text-foreground hover:text-primary transition-colors">
              <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />

              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-accent text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            <Link 
              to="/product"
              className="bg-[#C8945C] text-black hover:bg-white hover:text-[#C8945C] text-primary-foreground px-4 sm:px-6 py-2 lg:py-2.5 rounded-lg font-semibold transition-all shadow-premium text-sm"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
