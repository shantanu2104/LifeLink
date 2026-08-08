
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
      "url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3')",
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
<section id="doctors" className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-6 text-center">

    <h2 className="text-4xl font-bold">Meet Our Specialists</h2>
    <p className="text-gray-500 mt-2">
      Our experienced doctors are dedicated to providing the best healthcare.
    </p>

    <div className="grid md:grid-cols-3 gap-10 mt-12">

      {/* Doctor 1 */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition duration-300">
        <img
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2"
          alt="Cardiologist"
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h3 className="text-lg font-semibold">Dr. Mary Jane</h3>
          <p className="text-gray-500">Cardiologist</p>
        </div>
      </div>

      {/* Doctor 2 */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition duration-300">
        <img
          src="https://images.unsplash.com/photo-1612277795421-9bc7706a4a34"
          alt="Neurologist"
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h3 className="text-lg font-semibold">Dr. Emily Chen</h3>
          <p className="text-gray-500">Neurologist</p>
        </div>
      </div>

      {/* Doctor 3 */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition duration-300">
        <img
          src="https://images.unsplash.com/photo-1582750433449-648ed127bb54"
          alt="Pediatrician"
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h3 className="text-lg font-semibold">Dr. Michael Brown</h3>
          <p className="text-gray-500">Pediatrician</p>
        </div>
      </div>

    </div>

  </div>
</section>

  
      <Footer />
    </>
  );
}