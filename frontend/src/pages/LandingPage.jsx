import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  FaHeartbeat, FaBrain, FaBaby, FaBone, FaUserMd, FaEye, 
  FaCalendarCheck, FaUserNurse, FaShieldAlt, FaPhoneAlt, 
  FaClock, FaAward, FaCheckCircle, FaArrowRight 
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Landing() {
  const services = [
    {
      title: "Cardiology",
      desc: "Advanced cardiovascular diagnosis, heart health monitoring, and catheterization procedures.",
      icon: <FaHeartbeat className="text-rose-500 text-3xl" />,
      color: "bg-rose-50 border-rose-100"
    },
    {
      title: "Neurology",
      desc: "Comprehensive evaluation and therapy for complex brain, nerve, and spinal conditions.",
      icon: <FaBrain className="text-indigo-500 text-3xl" />,
      color: "bg-indigo-50 border-indigo-100"
    },
    {
      title: "Pediatrics",
      desc: "Specialized, compassionate medical care for infants, children, and adolescents.",
      icon: <FaBaby className="text-amber-500 text-3xl" />,
      color: "bg-amber-50 border-amber-100"
    },
    {
      title: "Orthopedics",
      desc: "Expert treatment for bone joint conditions, sports injuries, and joint replacement.",
      icon: <FaBone className="text-teal-500 text-3xl" />,
      color: "bg-teal-50 border-teal-100"
    },
    {
      title: "Dermatology",
      desc: "Comprehensive medical and cosmetic treatment for skin, hair, and nail care.",
      icon: <FaUserNurse className="text-purple-500 text-3xl" />,
      color: "bg-purple-50 border-purple-100"
    },
    {
      title: "Ophthalmology",
      desc: "Precision eye exams, vision correction surgeries, and glaucoma therapies.",
      icon: <FaEye className="text-sky-500 text-3xl" />,
      color: "bg-sky-50 border-sky-100"
    }
  ];

  const doctors = [
    {
      name: "Dr. Mary Jane",
      specialty: "Chief Cardiologist",
      exp: "14+ Years Exp",
      img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Dr. Emily Chen",
      specialty: "Senior Neurologist",
      exp: "10+ Years Exp",
      img: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Dr. Michael Brown",
      specialty: "Lead Pediatrician",
      exp: "12+ Years Exp",
      img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800"
    }
  ];

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
              Experience world-class medical healthcare with our team of expert doctors, 24/7 emergency response, and seamless digital health management.
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
                <div className="text-2xl lg:text-3xl font-extrabold text-teal-400">15+</div>
                <div className="text-xs text-slate-400 mt-0.5">Specialist Doctors</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-teal-400">24/7</div>
                <div className="text-xs text-slate-400 mt-0.5">Emergency Care</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-teal-400">99.8%</div>
                <div className="text-xs text-slate-400 mt-0.5">Patient Satisfaction</div>
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

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              Department Specialties
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Comprehensive Medical Services
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              We provide state-of-the-art diagnostic, surgical, and therapeutic medical treatments tailored for complete patient wellness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <div
                key={i}
                className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${s.color} space-y-4 group`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORS SECTION */}
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

          <div className="grid md:grid-cols-3 gap-8">
            {doctors.map((doc, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={doc.img}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {doc.exp}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{doc.name}</h3>
                    <p className="text-sm font-semibold text-teal-600">{doc.specialty}</p>
                  </div>

                  <Link
                    to="/register"
                    className="w-full text-center bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
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