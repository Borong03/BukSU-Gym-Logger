// src/pages/Home.js
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <img src="/media/logo.png" className="fitlogo" alt="Gym Logo" />

      <div className="welcomepage">
        <p>Welcome to the</p>
        <h1>
          <b>BukSU Fitness Gym</b>
        </h1>
      </div>

      <div className="groupbuttons">
        <button type="button" className="FAQs btn btn-light">
          FAQs
        </button>
        <button type="button" className="Visits btn btn-light">
          Most Visits
        </button>
        <button
          onClick={() => navigate("/fingerprint")}
          type="button"
          className="gogo btn btn-success"
        >
          Get Started &gt;
        </button>
      </div>
    </div>
  );
};

export default Home;
