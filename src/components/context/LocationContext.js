// src/components/context/LocationContext.js
import React, { createContext, useState } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const initialLocation = {
    lat: null,
    lng: null,
    address: "",
    city: "",
    pincode: "",
  };

  const [location, setLocation] = useState(initialLocation);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};


