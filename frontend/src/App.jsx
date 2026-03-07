import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import AddDoctor from "./pages/AddDoctor";
import Appointments from "./pages/Appointments";
import BookAppointment from "./pages/BookAppointment";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PatientsPage from "./pages/PatientsPage";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import EditDoctorProfile from "./pages/EditDoctorProfile";
import AppointmentDetails from "./pages/AppointementDetails";
function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-doctor" element={<AddDoctor />} />
        <Route path="/admin/appointments" element={<Appointments />} />
        <Route path="/patient/book-appointment" element={<BookAppointment />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/patients" element={<PatientsPage />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/edit-profile" element={<EditDoctorProfile/>} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
       <Route path="/patient/history" element={<PatientsPage/>}/>
       <Route path="/appointment/:id" element={<AppointmentDetails />} />
      </Routes>

      {/* Toast should be OUTSIDE Routes */}
     
<ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;