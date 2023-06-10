import { getURL } from "./sheet";
//import getLoginStatus from "../login";
import { check } from "prettier";
import { createContext, useState } from "react";
import  userLogin from "../components/Login";


chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ isLoggedIn: false });
});

chrome.runtime.onMessage.addListener(async function (buttonClicked, sender, sendResponse) {
    console.log(buttonClicked.reason);
    if (buttonClicked.reason === "login") {
        console.log("login heard");
        try {
            await userLogin();
            console.log("Authentication successful");
            sendResponse({ success: true });
        } catch (error) {
            console.log("Authentication failed: ", error);
            sendResponse({ success: false, error: error });
        }
        return true; // Return true to indicate that sendResponse will be used asynchronously
      } else if (buttonClicked.reason === "logout") {
        try {
            chrome.identity.removeCachedAuthToken({ token: buttonClicked.reason}, () => {
                fetch(
                    "https://accounts.google.com/o/oauth2/revoke?token=" + buttonClicked.token,
                    { method: "GET" }
                ).then((response) => {
                    console.log("logout response", response);
                });
            });
            chrome.storage.sync.set({ isLoggedIn: false });
            sendResponse({ success: true });
        } catch (error) {
            console.log("Error in logout:", error);
            sendResponse({ success: false, error: error });
        }
        return true; // Return true to indicate that sendResponse will be used asynchronously
      }
    });

chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log("storage changed");
    //const loginStatus = getLoginStatus();
    for (const key in changes) {
        const storageChange = changes[key];
        console.log(storageChange);
    }
});
