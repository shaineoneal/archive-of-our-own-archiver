import React from "react";
import { LoginContext } from "../contexts/LoginContext";
import { removeToken } from "../hooks/authToken";

export const Logout = () => {
  const { setLoggedIn } = React.useContext(LoginContext);

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
    chrome.storage.sync.set({ isLoggedIn: false });
    chrome.storage.sync.remove(["userInfo"]);
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
export default Logout;
