import React, { useState } from "react";
import { redirect } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Registration successful! You can now log in.");
        redirect('/login')
        setFormData({
          username: "",
          email: "",
          password: "",
          password2: "",
        });
      } else {
        const errorData = await response.json();
        setErrors(errorData);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        non_field_errors: ["Something went wrong. Please try again."],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center mb-4">Create Your Account</h2>

        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        {errors.non_field_errors && (
          <div className="alert alert-danger">
            {errors.non_field_errors.join(" ")}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {errors.password && (
                <div className="invalid-feedback d-block">
                  {errors.password}
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <div className="input-group">
              <input
                type={showPassword2 ? "text" : "password"}
                name="password2"
                className={`form-control ${errors.password2 ? "is-invalid" : ""}`}
                value={formData.password2}
                onChange={handleChange}
                placeholder="Repeat your password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? "Hide" : "Show"}
              </button>
              {errors.password2 && (
                <div className="invalid-feedback d-block">
                  {errors.password2}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="mb-0">
            Already have an account?{" "}
            <a href="/login" className="text-primary">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
