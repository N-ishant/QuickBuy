import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateAddress, getAddressById } from "../../../services/ApiService";
import "./UpdateAddress.css";

const UpdateAddress = () => {
  const [address, setAddress] = useState({
    custName: "",
    mobileNo: "",
    flatNo: "",
    area: "",
    city: "",
    stateName: "",
    pinCode: "",
    country: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const addressId = localStorage.getItem("editAddressId");

    if (!userId) {
      navigate("/signin");
    } else if (addressId) {
      console.log(addressId);
      getAddressById(addressId)
        .then((response) => {
          setAddress(response.data);
        })
        .catch((error) => {
          console.error("Error fetching address details:", error);
        });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    const mobileNoPattern = /^[6-9]\d{9}$/;
    const pinCodePattern = /^\d{6}$/;

    if (!mobileNoPattern.test(address.mobileNo)) {
      newErrors.mobileNo = "Mobile number must be 10 digits and start with 6-9.";
    }

    if (!pinCodePattern.test(address.pinCode)) {
      newErrors.pinCode = "Pin code must be 6 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const userId = localStorage.getItem("userId");
    const addressId = localStorage.getItem("editAddressId");

    if (userId && addressId) {
      try {
        await updateAddress(addressId, {
          userId,
          ...address,
        });
        alert("Address updated successfully");
        navigate("/allAddresses");
        localStorage.removeItem("editAddressId");
      } catch (error) {
        console.error("There was an error updating the address!", error);
      }
    }
  };

  return (
    <div className="update-address-page">
      <div className="update-address-container">
        <h2>Update Address</h2>
        <form onSubmit={handleSubmit} className="update-address-form">
          <input
            type="text"
            name="custName"
            placeholder="Customer Name"
            value={address.custName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="mobileNo"
            placeholder="Mobile Number"
            value={address.mobileNo}
            onChange={handleChange}
            required
          />
          {errors.mobileNo && <p className="error-message">{errors.mobileNo}</p>}
          <input
            type="text"
            name="flatNo"
            placeholder="Flat No"
            value={address.flatNo}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="area"
            placeholder="Lane/Area"
            value={address.area}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="stateName"
            placeholder="State"
            value={address.stateName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="pinCode"
            placeholder="Pincode"
            value={address.pinCode}
            onChange={handleChange}
            required
          />
          {errors.pinCode && <p className="error-message">{errors.pinCode}</p>}
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={address.country}
            onChange={handleChange}
            required
          />
          <button type="submit" className="update-submit-btn">
            Update Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAddress;
