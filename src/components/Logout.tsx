import React from "react";
import { removeToken } from "../chrome-services/authToken";

export const Logout = () => {


  const handleLogout = () => {
    removeToken();
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
