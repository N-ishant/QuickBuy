import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAddress } from "../../../services/ApiService";
import "./AddAddress.css";

const AddAddress = () => {
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

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/signin");
    }

    const selectedAddress = JSON.parse(localStorage.getItem("selectedAddress"));
    if (selectedAddress) {
      setAddress((prevState) => ({
        ...prevState,
        area: selectedAddress.lane || "",
        city: selectedAddress.city || "",
        stateName: selectedAddress.state || "",
        pinCode: selectedAddress.pincode || "",
        country: selectedAddress.country || "",
      }));
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        await createAddress({
          userId,
          ...address,
        });
        alert("Address added successfully");
        setAddress({
          custName: "",
          mobileNo: "",
          flatNo: "",
          area: "",
          city: "",
          stateName: "",
          pinCode: "",
          country: "",
        });
        navigate("/allAddresses");
      } catch (error) {
        console.error("There was an error adding the address!", error);
      }
    }
  };

  return (
    <div className="add-address-page">
      <div className="add-address-container">
        <h2>Add Address</h2>
        <form onSubmit={handleSubmit} className="add-address-form">
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
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={address.country}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-btn">
            Add Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAddress;