const Footer = () => {
  return (
    <footer className="bg-foreground text-muted-foreground py-12 sm:py-16 px-4 sm:px-6 lg:px-12 pb-24 lg:pb-16">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Top Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand + Social */}
          <div className="lg:col-span-2">
            <img 
              src="https://i.ibb.co/99XT05ZF/New-Logo-Tinny-transparent.png" 
              alt="Nourish Logo"
              className="w-32 h-12 object-contain mb-4"
            />
            <p className="text-sm max-w-md mb-6">
              Premium nutrition for your best friend. Trusted by veterinarians, loved by dogs worldwide.
            </p>

            <div className="flex space-x-4">
              {["Ig", "Fb", "Tw", "Yt"].map((social) => (
                <button 
                  key={social}
                  className="w-10 h-10 bg-card hover:bg-primary rounded-lg transition-colors flex items-center justify-center text-sm font-bold text-foreground hover:text-primary-foreground"
                >
                  {social}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-background font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#benefits" className="hover:text-primary transition-colors">Benefits</a></li>
              <li><a href="#ingredients" className="hover:text-primary transition-colors">Ingredients</a></li>
              <li><a href="#reviews" className="hover:text-primary transition-colors">Reviews</a></li>
              <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-background font-bold mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-sm">
          <p>© 2024 NOURISH. All rights reserved.</p>

          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
