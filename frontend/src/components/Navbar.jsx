import { FaHeartbeat, FaBars } from "react-icons/fa";

export default function Navbar() {
  return (
    <header className="w-full fixed top-0 bg-white shadow z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

        <div className="flex items-center text-2xl font-bold text-blue-600">
          <FaHeartbeat className="mr-2" />
          LifeLink
        </div>

        <nav>
          <ul className="hidden md:flex gap-8 font-medium">
            <li><a href="#hero" className="hover:text-blue-600">Home</a></li>
            <li><a href="#about" className="hover:text-blue-600">About Us</a></li>
            <li><a href="#services" className="hover:text-blue-600">Services</a></li>
            <li><a href="#doctors" className="hover:text-blue-600">Doctors</a></li>
            <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
          </ul>
        </nav>

        <a
          href="/login"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
           Login
        </a>

        <FaBars className="md:hidden text-xl cursor-pointer" />
      </div>
    </header>
  );
}