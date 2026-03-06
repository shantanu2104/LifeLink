import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 p-10">

        <div>
          <h3 className="text-2xl font-semibold mb-3">LifeLink</h3>
          <p className="text-gray-400">
            Providing advanced medical care with compassion and expertise.
          </p>

          <div className="flex gap-4 mt-4">
            <FaFacebookF />
            <FaTwitter />
            <FaInstagram />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#hero">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#doctors">Doctors</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
          <p className="text-gray-400">123 Health Street, Med City</p>
          <p className="text-gray-400">+1 234 567 8900</p>
          <p className="text-gray-400">contact@lifelink.com</p>
        </div>
      </div>

      <div className="text-center border-t border-gray-700 py-4 text-gray-400">
        © 2026 LifeLink Hospital Management System
      </div>
    </footer>
  );
}