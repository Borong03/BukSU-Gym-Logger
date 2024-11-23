import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Disclaimer from "./pages/Disclaimer";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.css";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import Success from "./pages/Success";
import Dash from "./pages/member/Dash";
import History from "./pages/member/History";
import Logout from "./pages/member/Logout";
import Limit from "./pages/member/Limit";
import IDCheck from "./pages/admin/IDCheck";
import AdminDash from "./pages/admin/admin";
import Manage from "./pages/admin/manage";
import Update from "./pages/admin/update";
import Admin from "./pages/admin/admin";

function App() {
  return (
    <Router>
      {/* Toast container where the toasts will be rendered */}
      <div
        id="toast-container"
        className="position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1050 }}
      ></div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/success" element={<Success />} />
        <Route path="/dash" element={<Dash />} />
        <Route path="/history" element={<History />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/limit" element={<Limit />} />
        <Route path="/idcheck" element={<IDCheck />} />
        <Route path="/admindashboard" element={<AdminDash />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/update" element={<Update />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
