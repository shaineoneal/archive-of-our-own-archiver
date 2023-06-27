import { createContext, useState } from "react";
import useEffect from 'react';
import getState from "../utils/useSetState";
import { log } from "../utils/logger";

export type UserStateType = {
  user: User,
  setUser: (user: User) => void;
  getUser: () => User;
};

export interface User {
  authToken: string;
  sheetId: string;
  sheetUrl: string;
}

export const defaultUser: User = {
  authToken: "",
  sheetId: "",
  sheetUrl: "",
}

export const UserContext = createContext<UserStateType>({
  user: defaultUser,
  setUser: () => {},
  getUser: () => {return defaultUser},
});

export function doesUserExist(user: User) {
  if(user.authToken === "" || user.sheetId === "" || user.sheetUrl === "") {
    return false;
  } else {
    return true;
  }
}