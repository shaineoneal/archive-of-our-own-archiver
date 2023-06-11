import { useContext } from 'react';
import { UserContext } from './Contexts/UserContext';
import { UserType } from './user';

export function useUser() {
    const { user, setUser } = useContext(UserContext);

    const login = (user: UserType) => {
        console.log("login");
        setUser(user);
    }

    return { user, login };
}


/*export const useUser = () => {

    console.log("use user");

    console.log("creating user context");
    const { user, saveUser } = useContext(UserContext);

    const addUser = (user: UserType) => {
        console.log("add user; email: ", user?.email);
        saveUser(user);
        chrome.storage.local.set({ user });
    };

    const removeUser = () => {
        saveUser(null);
        chrome.storage.local.remove("user");
    };

    return { user, addUser, removeUser};
}

/**
 * 
 * @returns {boolean} Whether the user is logged in or not
 

export const checkLocal = () => {

    const user = chrome.storage.local.get("user")
    if (user) {
        return user;
    } else {
        return null;
    }
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    console.log("user");
    const [user, saveUser] = useState<UserType | null>(null);

    return (
        <UserContext.Provider value={{ user, saveUser }}>
            {children}
        </UserContext.Provider>
    );
} 

export default UserProvider;*/