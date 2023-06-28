import { UserStateType, User } from "../types";
import { createContext } from "react";
import { useSetState } from "../utils";

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

type Props = {
    children: JSX.Element | JSX.Element[];
};

export function userProvider({ children }: Props) {
    const [user, setUser, getUser] = useSetState<User>(defaultUser);

    return (
        <UserContext.Provider value={{ user, setUser, getUser }}>
            {children}
        </UserContext.Provider>
    );
}