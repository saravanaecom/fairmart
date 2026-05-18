import React, { useEffect, useCallback, useContext, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { LocationContext } from '../components/context/LocationContext';

const GOOGLE_MAPS_API_KEY = "AIzaSyC966V9u3Yu_TyIbqAiB4ukRNPBS5AWjhc"; // Replace with your actual API key

const containerStyle = {
  width: "100%",
  height: "400px",
};

const LocationSelector = () => {
  const { setLocation, location } = useContext(LocationContext);
  const [latitude, setLatitude ] = useState('');
  const [longitude, setLongitude] = useState('');
  const defaultLocation = {
    lat:latitude ,
    lng: longitude,
    address: "",
    city: "",
    pincode: "",
  };

  const [currentLocation, setCurrentLocation] = useState(defaultLocation);

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition((position)=>{

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setLatitude(position.coords.latitude)
      setLongitude(position.coords.longitude)
      updateLocation(lat, lng);
    })

    },[])


  useEffect(() => {
    localStorage.setItem("location", JSON.stringify(currentLocation));
    setLocation(currentLocation); // Update context
  }, [currentLocation, setLocation]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          updateLocation(lat, lng);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "OK") {
        throw new Error(`Geocoding API error: ${data.status}`);
      }

      if (data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        let city = "";
        let pincode = "";

        addressComponents.forEach((component) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("postal_code")) {
            pincode = component.long_name;
          }
        });

        const newLocation = {
          lat,
          lng,
          address: data.results[0].formatted_address,
          city,
          pincode,
        };

        setCurrentLocation(newLocation); // Update local state
        setLocation(newLocation); // Update context state
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const updateLocation = useCallback((lat, lng) => {
    const updatedLocation = { ...currentLocation, lat, lng };
    setCurrentLocation(updatedLocation);
    getAddressFromCoords(lat, lng);
  }, [currentLocation]);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    updateLocation(lat, lng);
  };

  return (
    <div>
      <h2>Select Your Location</h2>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: currentLocation.lat, lng: currentLocation.lng }}
          zoom={15}
          onClick={handleMapClick}
        >
          <Marker position={{ lat: currentLocation.lat, lng: currentLocation.lng }} />
        </GoogleMap>
      </LoadScript>
      <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <h3>Selected Location Details:</h3>
        <p><strong>Address:</strong> {currentLocation.address || "Fetching..."}</p>
        <p><strong>City:</strong> {currentLocation.city || "Fetching..."}</p>
        <p><strong>Pincode:</strong> {currentLocation.pincode || "Fetching..."}</p>
      </div>
    </div>
  );
};

export default LocationSelector;
