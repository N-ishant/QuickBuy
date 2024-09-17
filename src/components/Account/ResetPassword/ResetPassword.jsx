import React, { useState } from "react";
import { postResetPassword } from "../../../services/ApiService";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    try {
      const email = localStorage.getItem("email");
      const otp = localStorage.getItem("otp");

      const request = {
        email: email,
        otp: otp,
        newPassword: newPassword,
      };

      const response = await postResetPassword(request);
      console.log(response);

      if (response) {
        alert("Password reset successfully!");
        localStorage.removeItem("email");
        localStorage.removeItem("otp");
        navigate("/signin");
      } else {
        alert("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Row className="vh100reset mp0">
      <Col className="col-md-8 col-sm-12 mp0">
        <div className="reset-image">
          <img
            src={require("../../../assests/Register.jpg")}
            alt="Reset Password"
          />
        </div>
      </Col>
      <Col className="col-md-4 main-reset-css">
        <div className="reset-content">
          <h2 className="reset-title">Reset Your Password</h2>
          <div className="reset-card">
            <label>Enter New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label>Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="btn-reset" onClick={handleResetPassword}>
              SUBMIT
            </button>
          </div>
          <div className="login-link">
            <span>Remembered your password? </span>
            <a href="/signin">Sign In</a>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ResetPassword;