import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="text-center">
        <h1 className="display-3 fw-bold mb-3 text-primary">Project Management</h1>
        <p className="lead text-secondary mb-5">
          Organize your projects, collaborate with your team, and stay productive.
        </p>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-primary btn-lg px-4"
            onClick={goToLogin}
          >
            Login
          </button>

          <button
            className="btn btn-outline-primary btn-lg px-4"
            onClick={goToRegister}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
