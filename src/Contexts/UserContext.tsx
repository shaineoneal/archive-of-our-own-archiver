import { createContext } from "react"; 
import { UserStateType } from "../user";

export const UserContext = createContext<UserStateType>({
    user: {
        email: null,
        authToken: null,
        sheetURL: null
    },
    setUser: () => {}
});