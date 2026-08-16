import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  FaHeartbeat, FaBrain, FaBaby, FaBone, FaUserMd, FaEye, 
  FaCalendarCheck, FaUserNurse, FaShieldAlt, FaPhoneAlt, 
  FaClock, FaCheckCircle, FaArrowRight, FaClinicMedical 
} from "react-icons/fa";
import { Link } from "react-router-dom";

// Department icon mapping
const DEPT_ICONS = {
  Cardiology: <FaHeartbeat className="text-rose-500 text-3xl" />,
  Neurology: <FaBrain className="text-indigo-500 text-3xl" />,
  Pediatrics: <FaBaby className="text-amber-500 text-3xl" />,
  Orthopedics: <FaBone className="text-teal-500 text-3xl" />,
  Dermatology: <FaUserNurse className="text-purple-500 text-3xl" />,
  Ophthalmology: <FaEye className="text-sky-500 text-3xl" />,
  Default: <FaClinicMedical className="text-teal-500 text-3xl" />
};

const DEPT_DESCS = {
  Cardiology: "Advanced cardiovascular diagnosis, heart health monitoring, and catheterization procedures.",
  Neurology: "Comprehensive evaluation and therapy for complex brain, nerve, and spinal conditions.",
  Pediatrics: "Specialized, compassionate medical care for infants, children, and adolescents.",
  Orthopedics: "Expert treatment for bone joint conditions, sports injuries, and joint replacement.",
  Dermatology: "Comprehensive medical and cosmetic treatment for skin, hair, and nail care.",
  Ophthalmology: "Precision eye exams, vision correction surgeries, and glaucoma therapies.",
  Default: "Dedicated specialized clinical care provided by experienced medical staff."
};

const DEPT_COLORS = [
  "bg-rose-50 border-rose-100",
  "bg-indigo-50 border-indigo-100",
  "bg-amber-50 border-amber-100",
  "bg-teal-50 border-teal-100",
  "bg-purple-50 border-purple-100",
  "bg-sky-50 border-sky-100"
];

export default function Landing() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/doctors`);
      setDoctors(res.data.data || []);
    } catch (err) {
      console.error("Error fetching doctors for landing page", err);
    } finally {
      setLoading(false);
    }
  };

  // Group registered doctors by department/specialization
  const deptMap = {};
  doctors.forEach((doc) => {
    const deptName = doc.specialization || "General Medicine";
    if (!deptMap[deptName]) {
      deptMap[deptName] = {
        name: deptName,
        count: 0,
        doctors: []
      };
    }
    deptMap[deptName].count += 1;
    deptMap[deptName].doctors.push(doc);
  });

  const registeredDepartments = Object.values(deptMap);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      {/* HERO SECTION */}
      <section
        id="hero"
        className="relative pt-32 pb-24 lg:pt-44 lg:pb-36 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white"
      >
        {/* Decorative Light Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <FaShieldAlt className="text-teal-400" />
              <span>Certified Healthcare Excellence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Caring for Life <br />
              <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-sky-300 bg-clip-text text-transparent">
                Every Single Day.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Experience world-class medical healthcare with our team of expert registered doctors, 24/7 emergency response, and seamless digital health management.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all"
              >
                <span>Book Appointment</span>
                <FaArrowRight />
              </Link>

              <a
                href="#doctors"
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 bg-slate-800/60 hover:bg-slate-800 text-slate-200 px-7 py-4 rounded-2xl font-semibold transition"
              >
                <FaUserMd className="text-teal-400" />
                <span>Meet Our Specialists</span>
              </a>
            </div>

            {/* Metrics pills */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-teal-400">{doctors.length}+</div>
                <div className="text-xs text-slate-400 mt-0.5">Specialist Doctors</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-teal-400">{registeredDepartments.length}</div>
                <div className="text-xs text-slate-400 mt-0.5">Active Departments</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-teal-400">24/7</div>
                <div className="text-xs text-slate-400 mt-0.5">Emergency Care</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-2xl">
                  <FaCalendarCheck />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Instant Online Booking</h3>
                  <p className="text-xs text-slate-400">Select doctor & time slot</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700/50 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">1. Choose Specialist</span>
                  <FaCheckCircle className="text-teal-400 text-sm" />
                </div>
                <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700/50 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">2. Pick Preferred Time</span>
                  <FaCheckCircle className="text-teal-400 text-sm" />
                </div>
                <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700/50 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">3. Receive Confirmation</span>
                  <FaCheckCircle className="text-teal-400 text-sm" />
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full block text-center bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold py-3 rounded-xl border border-teal-500/30 transition"
                >
                  Already registered? Sign in to Portal →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTERED DEPARTMENTS SECTION (REQUIREMENT 11) */}
      <section id="services" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              Active Hospital Departments
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Registered Medical Departments
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Showing active hospital departments with registered specialist doctors.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-48 bg-slate-100 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : registeredDepartments.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border">
              No registered doctor departments currently available.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {registeredDepartments.map((dept, i) => {
                const icon = DEPT_ICONS[dept.name] || DEPT_ICONS.Default;
                const desc = DEPT_DESCS[dept.name] || DEPT_DESCS.Default;
                const color = DEPT_COLORS[i % DEPT_COLORS.length];

                return (
                  <div
                    key={dept.name}
                    className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${color} space-y-4 group`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        {icon}
                      </div>
                      <span className="text-xs font-bold bg-white/80 px-3 py-1 rounded-full text-slate-700 shadow-xs border">
                        {dept.count} {dept.count === 1 ? "Doctor" : "Doctors"}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{dept.name}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* REGISTERED DOCTORS SECTION (REQUIREMENTS 9 & 10) */}
      <section id="doctors" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
              Expert Clinical Staff
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Meet Our Medical Specialists
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Our board-certified physicians and specialists are dedicated to offering high-quality clinical care with empathy and precision.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 bg-slate-200 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-white rounded-3xl border">
              No registered doctors found in database.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {doctors.map((doc) => {
                const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=0d9488&color=fff&bold=true&size=512`;
                const expText = doc.experience ? `${doc.experience}+ Years Exp` : "Certified Specialist";

                return (
                  <div
                    key={doc._id}
                    className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative h-64 overflow-hidden bg-slate-100 flex items-center justify-center">
                      <img
                        src={avatarUrl}
                        alt={doc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        {expText}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Dr. {doc.name}</h3>
                        <p className="text-sm font-semibold text-teal-600">
                          {doc.specialization || "General Medicine"}
                        </p>
                      </div>

                      <Link
                        to="/register"
                        className="w-full text-center bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* EMERGENCY HIGHLIGHT BANNER */}
      <section id="emergency" className="py-16 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
              <FaClock /> 24/7 Emergency Line
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">Need Immediate Medical Assistance?</h3>
            <p className="text-slate-100 text-sm max-w-xl">
              Our emergency response team and ICU care specialists are available 24 hours a day, 7 days a week.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <a
              href="tel:+18005554325"
              className="flex items-center gap-3 bg-white text-blue-700 px-6 py-3.5 rounded-2xl font-extrabold shadow-lg hover:bg-slate-100 transition"
            >
              <FaPhoneAlt />
              <span>+1 (800) 555-HEALTH</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}