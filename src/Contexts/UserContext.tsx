import { createContext } from "react"; 
import { IUser } from "../user";
import { useState } from 'react';


interface UserContext {
    user: IUser | null;
    saveUser: (user: IUser | null) => void;
}

const initialUser = {
    email: "",
    authToken: "",
    sheetURL: "",
}


/**
 * Context for user login status
 * default value is null
 */
export const UserContext = createContext<UserContext>({
    user: null,
    saveUser: () => {},
})
