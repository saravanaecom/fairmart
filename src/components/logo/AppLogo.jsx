import React from 'react';
import Logo from './logo.png';
const AppLogo = ({ children }) => {
  return (
    <img src={Logo} alt="logo" style={{width: '130px', height: '50px'}}/>
  );
};

export default AppLogo;
