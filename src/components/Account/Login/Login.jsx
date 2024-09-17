import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../services/ApiService";
import "./Login.css";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser({ email, password });
      if (response.succeeded) {
        console.log("Login success:", response);
        setTimeout(() => alert(response.message), 100);
        const userId = response.data.userId;
        localStorage.setItem("userId", userId);
        navigate("/landingPage");
      } else {
        console.error("Login failed:", response.message);
        setTimeout(() => alert(response.message), 100);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Row className="vh100login mp0">
      <Col className="col-md-8 col-sm-12 mp0">
        <div className="login-image">
          <img src={require("../../../assests/Register.jpg")} alt="Login" />
        </div>
      </Col>
      <Col className="col-md-4 main-login-css">
        <div className="login-content">
          <h2 className="login-title">Sign into your account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group password-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={handleTogglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
            </div>

            <button type="submit" className="btn-login">
              Submit
            </button>
          </form>
          <div className="forgot-password">
            <a href="/forgetPassword">Forgot password?</a>
          </div>
          <div className="signup-link">
            <span>Don’t have an account? </span>
            <a href="/signup">Create Account</a>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Login;