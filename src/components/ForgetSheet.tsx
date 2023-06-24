import React from "react";
import { LoginContext } from "../contexts/LoginContext";

export const ForgetSheet = () => {
  const { setLoggedIn } = React.useContext(LoginContext);

  const handleForgetSheet = () => {
    chrome.identity.clearAllCachedAuthTokens(() => {
      console.log("Cleared all cached");
    });
    setLoggedIn(false);
    chrome.storage.sync.set({ isLoggedIn: false });
    chrome.storage.sync.remove("sheetURL");
    chrome.storage.sync.remove("sheetID");
  };

  return (
    <div>
      <button onClick={handleForgetSheet}>Forget Sheet</button>
    </div>
  );
};
export default ForgetSheet;
