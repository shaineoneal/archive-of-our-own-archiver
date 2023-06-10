import React, { useContext } from 'react';
import { UserContext } from './Contexts/UserContext';
import { useLocalStorage } from './useLocalStorage';
import { IUser } from './user';
import { useState } from 'react';



export const useUser = () => {

    console.log("use user");

    console.log("creating user context");
    const { user, saveUser } = useContext(UserContext);
    const { setItem } = useLocalStorage();

    const addUser = (user: IUser) => {
        console.log("add user; email: ", user?.email);
        saveUser(user);
        setItem("user", JSON.stringify(user));
    };

    const removeUser = () => {
        saveUser(null);
        setItem("user", "");
    };

    return { user, addUser, removeUser};
}

/**
 * 
 * @returns {boolean} Whether the user is logged in or not
 */

export const checkUserStatus = () => {
    
    const userStatus = useContext(UserContext).user;
    console.log("check user status", userStatus);
    if (userStatus) {
        return true;
    } else {
    return false;
    }
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    console.log("user");
    const [user, setUser] = useState(
        { email: "", authToken: "", sheetURL: "" } as IUser
    );
    
    const saveUser = (user: IUser | null) => {
        
        if (user) {
            const newUser: IUser = {
                email: user.email,
                authToken: user.authToken,
                sheetURL: user.sheetURL,
            };
            setUser(newUser);
        }
    };


    return (
        <UserContext.Provider value={{ user, saveUser }}>
            {children}
        </UserContext.Provider>
    );
}