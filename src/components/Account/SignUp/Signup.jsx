import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, sendOtp } from "../../../services/ApiService";
import './Signup.css'
import { Row, Col } from "react-bootstrap";

const Signup = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    otp: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [generatedOTP, setGeneratedOTP] = useState("");

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const validate = () => {
    let tempErrors = {};
    if (!formValues.firstName) tempErrors.firstName = "First Name is required";
    if (!formValues.lastName) tempErrors.lastName = "Last Name is required";
    if (!formValues.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formValues.email))
      tempErrors.email = "Email is invalid";
    if (!formValues.otp) tempErrors.otp = "OTP is required";
    if (!formValues.mobile) tempErrors.mobile = "Mobile is required";
    if (!formValues.password) tempErrors.password = "Password is required";
    if (formValues.password !== formValues.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSend = async () => {
    try {
      const otp = generateOTP();
      const request = {
        email: formValues.email,
        otp,
      };
      await sendOtp(request);
      setGeneratedOTP(otp);
      console.log("OTP sent successfully");
    } catch (error) {
      console.error("Failed to send OTP:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        if (formValues.otp !== generatedOTP) {
          setErrors({ ...errors, otp: "Invalid OTP" });
          return;
        }
        const payload = {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          otp: formValues.otp,
          PhoneNumber: formValues.mobile,
          password: formValues.password,
          confirmPassword: formValues.confirmPassword,
          RoleId: 1,
        };

        await registerUser(payload);
        console.log("Registration successful");
        alert("Registration successful. OTP verified!");

        setFormValues({
          firstName: "",
          lastName: "",
          email: "",
          otp: "",
          mobile: "",
          password: "",
          confirmPassword: "",
        });

        navigate("/signin");
      } catch (error) {
        console.error("Registration failed:", error);
      }
    }
  };

  return (
    <Row className="vh100signup mp0">
      <Col className="col-md-7 col-sm-12 mp0">
        <div className="signup-image">
          <img src={require("../../../assests/Register.jpg")} alt="Signup" />
        </div>
      </Col>
      <Col className="col-md-5 main-signup-css">
        <div className="signup-content">
          <h2 className="signup-title">Create your account</h2>
          <form onSubmit={handleSubmit}>
            <Row>
              <div className="form-group col-md-6">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleChange}
                  required
                />
                {errors.firstName && (
                  <span className="error">{errors.firstName}</span>
                )}
              </div>

              <div className="form-group col-md-6">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleChange}
                  required
                />
                {errors.lastName && (
                  <span className="error">{errors.lastName}</span>
                )}
              </div>

              <div className="form-group col-md-12">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group col-md-10">
                <label>OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={formValues.otp}
                  onChange={handleChange}
                  required
                />
                {errors.otp && <span className="error">{errors.otp}</span>}
                <button type="button" className="getotp" onClick={handleSend}>
                  Send
                </button>
              </div>

              <div className="form-group col-md-6">
                <label>Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formValues.mobile}
                  onChange={handleChange}
                  required
                />
                {errors.mobile && (
                  <span className="error">{errors.mobile}</span>
                )}
              </div>

              <div className="form-group col-md-6">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <span className="error">{errors.password}</span>
                )}
              </div>

              <div className="form-group col-md-12">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.confirmPassword && (
                  <span className="error">{errors.confirmPassword}</span>
                )}
              </div>

              <button type="submit" className="btn-signup">
                Register
              </button>
            </Row>
          </form>
          <div className="login-link">
            <span>Already have an account? </span>
            <a href="/signin">Sign-in Here</a>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Signup;