import { useState, useEffect } from "react";
import { FaHeartbeat, FaBars, FaTimes, FaUserCircle, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "doctor") return "/doctor/dashboard";
    return "/patient/dashboard";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-3"
          : "bg-white/80 backdrop-blur-sm py-4 border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-teal-500 rounded-xl text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <FaHeartbeat className="text-xl" />
          </div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-900 to-teal-700 bg-clip-text text-transparent">
            LifeLink
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600 text-sm">
          <a href="#hero" className="hover:text-blue-600 transition">Home</a>
          <a href="#services" className="hover:text-blue-600 transition">Services</a>
          <a href="#doctors" className="hover:text-blue-600 transition">Specialists</a>
          <a href="#emergency" className="hover:text-blue-600 transition">Emergency</a>
          <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link
              to={getDashboardPath()}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
            >
              <FaUserCircle className="text-base" />
              <span>Dashboard ({user.name?.split(" ")[0]})</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-700 font-semibold text-sm hover:text-blue-600 px-4 py-2 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
              >
                <span>Book Appointment</span>
                <FaArrowRight className="text-xs" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl animate-fade-in">
          <nav className="flex flex-col space-y-3 font-medium text-slate-700">
            <a 
              href="#hero" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-blue-600 transition border-b border-slate-100"
            >
              Home
            </a>
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-blue-600 transition border-b border-slate-100"
            >
              Services
            </a>
            <a 
              href="#doctors" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-blue-600 transition border-b border-slate-100"
            >
              Specialists
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-blue-600 transition border-b border-slate-100"
            >
              Contact
            </a>
          </nav>

          <div className="pt-2 flex flex-col gap-3">
            {user ? (
              <Link
                to={getDashboardPath()}
                className="w-full text-center bg-blue-600 text-white py-3 rounded-xl font-semibold shadow"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full text-center border border-slate-300 text-slate-700 py-2.5 rounded-xl font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center bg-blue-600 text-white py-2.5 rounded-xl font-semibold shadow"
                >
                  Register Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}