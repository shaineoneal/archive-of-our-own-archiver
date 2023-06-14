import { createContext, useContext } from "react"; 

export type URLStateType = {
    url: string;
    setURL: (url: string) => void;
}

export const URLContext = createContext<URLStateType>({
    url: "",
    setURL: () => {}
});

