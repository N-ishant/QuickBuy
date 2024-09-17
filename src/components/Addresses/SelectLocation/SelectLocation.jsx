import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./SelectLocation.css";

const SelectLocation = () => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition({ lat: latitude, lng: longitude });
          setLoading(false);

          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data && data.address) {
                const {
                  road,
                  suburb,
                  village,
                  neighbourhood,
                  locality,
                  city,
                  state,
                  postcode,
                  country,
                  town,
                  municipality,
                } = data.address;

                const lane =
                  road ||
                  suburb ||
                  village ||
                  neighbourhood ||
                  locality ||
                  town ||
                  municipality ||
                  "Not available";

                setAddress({
                  lane,
                  city: city || town || municipality || "Not available",
                  state: state || "Not available",
                  pincode: postcode || "Not available",
                  country: country || "Not available",
                });
              }
            })
            .catch((error) => console.error("Error fetching address:", error));
        },
        (error) => {
          console.error("Error fetching location: ", error);
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  const handleConfirmLocation = () => {
    if (address) {
      localStorage.setItem("selectedAddress", JSON.stringify(address));
      navigate("/AddAddress");
    } else {
      alert("Location or address not found.");
    }
  };

  return (
    <div className="select-location-container">
      <h2>Select Your Live Location</h2>
      {loading ? (
        <p>Loading your location...</p>
      ) : (
        <>
          <MapContainer
            center={position || [51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={false}
            className="map-container"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {position && <Marker position={position}></Marker>}
          </MapContainer>

          {address ? (
            <div className="address-details">
              <p>
                <b>Lane:</b> {address.lane}
              </p>
              <p>
                <b>City:</b> {address.city}
              </p>
              <p>
                <b>State:</b> {address.state}
              </p>
              <p>
                <b>Pin Code:</b> {address.pincode}
              </p>
              <p>
                <b>Country:</b> {address.country}
              </p>
            </div>
          ) : (
            <p>Fetching address details...</p>
          )}

          <button
            onClick={handleConfirmLocation}
            className="confirm-location-button"
          >
            Confirm Location
          </button>
        </>
      )}
    </div>
  );
};

export default SelectLocation;