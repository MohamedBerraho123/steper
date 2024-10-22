import React from 'react';

const Navbar = ({ userData, handleLogout }) => {
  return (
    <div className="navbar">
      <p>Welcome, {userData.firstName} {userData.lastName}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Navbar;
