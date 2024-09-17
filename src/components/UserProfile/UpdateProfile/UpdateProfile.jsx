import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getViewProfile, updateProfile } from "../../../services/ApiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const defaultUser = {
    profilePicture:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6tWkfCJfejkeaq78A0p6L5CZWFFVwxyz0DA&s",
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      console.log("Fetching profile for user ID:", userId);
      getViewProfile(userId)
        .then((response) => {
          console.log(response);
          if (response.succeeded) {
            const data = response.data;
            setUsername(`${data.firstName} ${data.lastName}`);
            setMobile(data.phone);
            setEmail(data.email);
            setProfilePicture(data.profileImage || defaultUser.profilePicture);
          }
        })
        .catch((error) => {
          console.error("There was an error fetching the profile!", error);
        });
    }
  }, [defaultUser.profilePicture]);

  const handleSaveChanges = async () => {
    const userId = localStorage.getItem("userId");
    console.log("Updating profile for user ID:", userId);
    const [firstName, lastName] = username.split(" ");

    const updateData = {
      userId: parseInt(userId),
      firstName,
      lastName,
      phone: mobile,
      email,
      profileImage: profilePicture,
    };

    if (newProfilePicture) {
      const base64Image = await toBase64(newProfilePicture);
      updateData.profileImage = base64Image;
    }
    console.log(updateData);
    updateProfile(userId, updateData)
      .then((response) => {
        if (response.succeeded) {
          console.log("Profile updated successfully!");
          alert("Profile updated successfully!");
          if (newProfilePicture) {
            setProfilePicture(URL.createObjectURL(newProfilePicture));
          }
          navigate("/viewProfile");
        } else {
          console.error("Profile update failed:", response.message);
        }
      })
      .catch((error) => {
        console.error("There was an error updating the profile!", error);
      });
  };

  const handleChangeProfilePicture = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfilePicture(file);
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className="update-profile">
      <div className="profile-header">
        <img src={profilePicture} alt="Profile" className="profile-picture" />
        <button
          className="change-picture-button"
          onClick={handleChangeProfilePicture}
        >
          Edit Profile Pic
        </button>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
      <h2>User Profile</h2>
      <div className="profile-details">
        <div className="profile-item">
          <span>Name:</span>
          {isEditingName ? (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              autoFocus
            />
          ) : (
            <span>{username}</span>
          )}
          <FontAwesomeIcon
            icon={faPen}
            className="edit-icon"
            onClick={() => setIsEditingName(!isEditingName)}
          />
        </div>
        <div className="profile-item">
          <span>Mobile No:</span>
          {isEditingMobile ? (
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              onBlur={() => setIsEditingMobile(false)}
              autoFocus
            />
          ) : (
            <span>{mobile}</span>
          )}
          <FontAwesomeIcon
            icon={faPen}
            className="edit-icon"
            onClick={() => setIsEditingMobile(!isEditingMobile)}
          />
        </div>
        <div className="profile-item">
          <span>Email ID:</span>
          {isEditingEmail ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setIsEditingEmail(false)}
              autoFocus
            />
          ) : (
            <span>{email}</span>
          )}
          <FontAwesomeIcon
            icon={faPen}
            className="edit-icon"
            onClick={() => setIsEditingEmail(!isEditingEmail)}
          />
        </div>
      </div>
      <button onClick={handleSaveChanges} className="save-button">
        Save Changes
      </button>
    </div>
  );
};

export default UpdateProfile;