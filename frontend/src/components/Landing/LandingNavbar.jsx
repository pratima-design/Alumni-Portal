import { Link } from "react-router-dom";

export default function LandingNavbar() {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AC</span>
              </div>
              <span className="text-xl font-bold text-slate-900">AlumniConnect</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-slate-600 hover:text-brand-500 transition-colors">Services</a>
            <a href="#about" className="text-slate-600 hover:text-brand-500 transition-colors">About</a>
            <a href="#contact" className="text-slate-600 hover:text-brand-500 transition-colors">Contact</a>
          </nav>

          {/* Auth Links */}
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-600 hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link to="/register/user" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
