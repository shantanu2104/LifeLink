import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaHeartbeat, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Col 1: Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-teal-500 rounded-xl text-white shadow-md shadow-blue-500/20">
              <FaHeartbeat className="text-xl" />
            </div>
            <span className="text-2xl font-extrabold text-white">
              LifeLink
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Providing compassionate, world-class healthcare with state-of-the-art medical technology and specialized doctors.
          </p>
          <div className="flex gap-3 pt-2">
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition">
              <FaFacebookF />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition">
              <FaTwitter />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition">
              <FaInstagram />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-700 hover:text-white transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Quick Navigation</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><a href="#hero" className="hover:text-teal-400 transition flex items-center gap-2"><span>›</span> Home</a></li>
            <li><a href="#services" className="hover:text-teal-400 transition flex items-center gap-2"><span>›</span> Medical Services</a></li>
            <li><a href="#doctors" className="hover:text-teal-400 transition flex items-center gap-2"><span>›</span> Our Doctors</a></li>
            <li><Link to="/login" className="hover:text-teal-400 transition flex items-center gap-2"><span>›</span> Patient Portal</Link></li>
            <li><Link to="/register" className="hover:text-teal-400 transition flex items-center gap-2"><span>›</span> Book Appointment</Link></li>
          </ul>
        </div>

        {/* Col 3: Hours & Emergency */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Hospital Hours</h4>
          <div className="space-y-2 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <FaClock className="text-teal-400 text-xs" />
              <span>Emergency: 24 / 7 Available</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-teal-400 text-xs" />
              <span>OPD: Mon - Sat (8:00 AM - 8:00 PM)</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-teal-400 text-xs" />
              <span>Visiting Hours: 4:00 PM - 7:00 PM</span>
            </div>
          </div>
        </div>

        {/* Col 4: Contact */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Contact Us</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-teal-400 text-base mt-1 shrink-0" />
              <span>123 Health Care Boulevard, Medical City, MC 90210</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-teal-400 text-base shrink-0" />
              <span>+1 (800) 555-HEALTH / +1 234 567 8900</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-teal-400 text-base shrink-0" />
              <span>contact@lifelink-health.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} LifeLink Hospital Management System. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-400 transition">Privacy Policy</a>
          <a href="#" className="hover:text-slate-400 transition">Terms of Service</a>
          <a href="#" className="hover:text-slate-400 transition">HIPAA Compliance</a>
        </div>
      </div>
    </footer>
  );
}