import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";

// pages
import Home from "./pages/Home";
import Disclaimer from "./pages/Disclaimer";
import Login from "./pages/login";
import Auth from "./pages/authenticator";
import Barcode from "./pages/barcode";
import Signup from "./pages/Signup";
import Success from "./pages/Success";
import Dash from "./pages/member/Dash";
import History from "./pages/member/History";
import Logout from "./pages/member/Logout";
import Limit from "./pages/member/Limit";
import Leaderboards from "./pages/leaderboards";
import IDCheck from "./pages/admin/IDCheck";
import Manage from "./pages/admin/manage";
import Update from "./pages/admin/update";
import Admin from "./pages/admin/admin";
import Managed from "./pages/admin/manageSigned";

// components
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

// stylesheets
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.css";
import { fetchRandomGymImage } from "./assets/unsplashService";

function App() {
  const [backgroundStyle, setBackgroundStyle] = React.useState({});

  useEffect(() => {
    const setDynamicBackground = async () => {
      try {
        const imageUrl = await fetchRandomGymImage();
        if (imageUrl) {
          console.log("Fetched image URL:", imageUrl);
          setBackgroundStyle({
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          });
        } else {
          console.error("No image URL received, using fallback.");
          setBackgroundStyle({
            backgroundImage: "url('/media/gaussian.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          });
        }
      } catch (error) {
        console.error("Failed to fetch or set the background image:", error);
        setBackgroundStyle({
          backgroundImage: "url('/media/gaussian.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        });
      }
    };

    setDynamicBackground();
  }, []);

  return (
    <Router>
      <div className="background-container" style={backgroundStyle}>
        <div className="acrylic-overlay"></div>
      </div>
      <div className="content-container">
        <div className="gradient-blur">
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
          <Route path="/authenticator" element={<Auth />} />
          <Route path="/barcode" element={<Barcode />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/success" element={<Success />} />
          <Route path="/history" element={<History />} />
          <Route
            path="/dash"
            element={
              <ProtectedRoute requiredRole="user">
                <Dash />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <ProtectedRoute requiredRole="user">
                <Logout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/limit"
            element={
              <ProtectedRoute requiredRole="user">
                <Limit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/idcheck"
            element={
              <ProtectedRoute requiredRole="admin">
                <IDCheck />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage"
            element={
              <ProtectedRoute requiredRole="admin">
                <Manage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-signed"
            element={
              <ProtectedRoute requiredRole="admin">
                <Managed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/update"
            element={
              <ProtectedRoute requiredRole="admin">
                <Update />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
