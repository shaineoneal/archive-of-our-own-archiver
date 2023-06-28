import React from "react";
import { UserContext, defaultUser } from "../contexts";

export const ForgetSheet = () => {

  const { setUser } = React.useContext(UserContext);

  const handleForgetSheet = () => {
    chrome.identity.clearAllCachedAuthTokens(() => {
      console.log("Cleared all cached");
    });
    setUser(defaultUser);
    chrome.storage.sync.remove(["userInfo"]);
  };

  return (
    <div>
      <button onClick={handleForgetSheet}>Forget Sheet</button>
    </div>
  );
};
export default ForgetSheet;
