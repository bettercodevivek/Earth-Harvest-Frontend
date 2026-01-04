import { ArrowUp } from "lucide-react";

const Footer = () => {

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground text-muted-foreground py-10 px-4 sm:px-6 lg:px-12 relative">
      <div className="max-w-[1200px] mx-auto">

        {/* Top Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">

          {/* Logo */}
          <img 
            src="https://res.cloudinary.com/dpc7tj2ze/image/upload/v1767539648/New_Logo_Tinny_transparent_v6if1w.png" 
            alt="Earth & Harvest Logo"
            className="w-32 h-12 object-contain"
          />

          {/* Quick Links */}
          <ul className="flex flex-wrap items-center gap-6 text-sm">
            <li>
              <a href="#benefits" className="hover:text-primary transition-colors">
                Benefits
              </a>
            </li>
            <li>
              <a href="#ingredients" className="hover:text-primary transition-colors">
                Ingredients
              </a>
            </li>
            <li>
              <a href="#reviews" className="hover:text-primary transition-colors">
                Reviews
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-primary transition-colors">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} Earth & Harvest. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
