
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <>
      <Navbar />

      {/* HERO */}
    <section
  id="hero"
  className="relative h-screen flex items-center justify-center text-white text-center bg-cover bg-center"
  style={{
    backgroundImage:
      "VITE_URL('https://img.freepik.com/free-photo/modern-hospital-building_23-2148980753.jpg')",
  }}
>
  {/* Dark overlay to keep text visible */}
  <div className="absolute inset-0 bg-black/50"></div>

  <div className="relative z-10 px-6">
    <h1 className="text-5xl font-bold">
      Caring for Life <br />
      <span className="text-yellow-300">Every Day.</span>
    </h1>

    <p className="mt-4 max-w-xl mx-auto">
      Experience world-class healthcare with our team of expert doctors
      and state-of-the-art facilities. Your health is our priority.
    </p>

    <div className="mt-6 flex justify-center gap-6">
      <a
        href="/register"
        className="bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
      >
        Register
      </a>

      <a
        href="#doctors"
        className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black"
      >
        Find a Doctor
      </a>
    </div>
  </div>
</section>
      {/* SERVICES */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">

          <h2 className="text-4xl font-bold">Our Services</h2>
          <p className="text-gray-500 mt-2">
            Comprehensive healthcare solutions
          </p>

          <div className="grid md:grid-cols-3 gap-10 mt-12">

            <div className="bg-white p-8 shadow rounded-xl">
              <h3 className="text-xl font-semibold">Cardiology</h3>
              <p className="text-gray-500 mt-2">
                Expert heart care with advanced technology.
              </p>
            </div>

            <div className="bg-white p-8 shadow rounded-xl">
              <h3 className="text-xl font-semibold">Neurology</h3>
              <p className="text-gray-500 mt-2">
                Comprehensive care for brain disorders.
              </p>
            </div>

            <div className="bg-white p-8 shadow rounded-xl">
              <h3 className="text-xl font-semibold">Pediatrics</h3>
              <p className="text-gray-500 mt-2">
                Specialized care for infants and children.
              </p>
            </div>
           <div className="bg-white p-8 shadow rounded-xl">
  <h3 className="text-xl font-semibold">Orthopedics</h3>
  <p className="text-gray-500 mt-2">
    Advanced care for bones, joints, and sports injuries.
  </p>
</div>

<div className="bg-white p-8 shadow rounded-xl">
  <h3 className="text-xl font-semibold">Dermatology</h3>
  <p className="text-gray-500 mt-2">
    Expert treatment for skin, hair, and nail conditions.
  </p>
</div>

<div className="bg-white p-8 shadow rounded-xl">
  <h3 className="text-xl font-semibold">Ophthalmology</h3>
  <p className="text-gray-500 mt-2">
    Specialized diagnosis and treatment for eye diseases.
  </p>
</div>

          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section id="doctors" className="py-20">
        <div className="max-w-7xl mx-auto text-center">

          <h2 className="text-4xl font-bold">Meet Our Specialists</h2>

          <div className="grid md:grid-cols-3 gap-10 mt-12">

            <div className="shadow rounded-xl p-6">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"
                className="rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg">Dr. John Smith</h3>
              <p className="text-gray-500">Cardiologist</p>
            </div>

            <div className="shadow rounded-xl p-6">
              <img
                src="https://images.unsplash.com/photo-1594824476967-48c8b964273f"
                className="rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg">Dr. Sarah Lee</h3>
              <p className="text-gray-500">Neurologist</p>
            </div>

            <div className="shadow rounded-xl p-6">
              <img
                src="https://images.unsplash.com/photo-1537368910025-58d90f2cd522"
                className="rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg">Dr. Mike Ross</h3>
              <p className="text-gray-500">Pediatrician</p>
            </div>

          </div>
        </div>
      </section>

  
      <Footer />
    </>
  );
}