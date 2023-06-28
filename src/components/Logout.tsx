import React from "react";
import { removeToken } from "../chrome-services/authToken";
import { UserContext, defaultUser } from "../contexts";

export const Logout = () => {

  const { setUser } = React.useContext(UserContext);

  const handleLogout = () => {
    removeToken();
    setUser(defaultUser);
    chrome.storage.sync.remove(["userInfo"]);
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
