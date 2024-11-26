import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";

// pages
import Home from "./pages/Home";
import Disclaimer from "./pages/Disclaimer";
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
import Managed from "./pages/admin/manageSigned";

// stylesheets
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.css";
import { fetchRandomGymImage } from "./assets/unsplashService";

function App() {
  useEffect(() => {
    const setDynamicBackground = async () => {
      try {
        const imageUrl = await fetchRandomGymImage();

        if (imageUrl) {
          console.log("Fetched image URL:", imageUrl);

          // update the .background-container dynamically
          const bgContainer = document.querySelector(".background-container");
          if (bgContainer) {
            bgContainer.style.backgroundImage = `url(${imageUrl})`;
          }
        } else {
          console.error("No image URL received, using fallback.");
          const fallbackUrl = "url('/media/gaussian.png')";
          const bgContainer = document.querySelector(".background-container");
          if (bgContainer) {
            bgContainer.style.backgroundImage = fallbackUrl;
          }
        }
      } catch (error) {
        console.error("Failed to fetch or set the background image:", error);
        const fallbackUrl = "url('/media/gaussian.png')";
        const bgContainer = document.querySelector(".background-container");
        if (bgContainer) {
          bgContainer.style.backgroundImage = fallbackUrl;
        }
      }
    };

    setDynamicBackground();
  }, []);

  return (
    <Router>
      <div className="background-container"></div> {/* Background */}
      <div className="content-container">
        <div className="gradient-blur">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="gradient-blurbot">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
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
          <Route path="/manage-signed" element={<Managed />} />
          <Route path="/update" element={<Update />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
