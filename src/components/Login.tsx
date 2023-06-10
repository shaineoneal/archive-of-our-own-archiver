import { UserContext } from "../Contexts/UserContext";
import { IUser } from "../user";
import { useUser, checkUserStatus } from "../useUser";
import { useLocalStorage } from "../useLocalStorage";
import React, { useEffect } from 'react';

/** Login component */


export const userAuth = () => {

    console.log("user auth");

    const { user, addUser, removeUser} = useUser();
    const { getItem } = useLocalStorage();

    useEffect(() => {
        const user = getItem("user");
        if (user) {
            addUser(JSON.parse(user));
        }
    }, []);

    const login = (user: IUser) => {
        addUser(user);
    };

    const logout = () => {
        removeUser();
    };

    return { user, login, logout };
};

const Login = () => {
    const { login } = userAuth();
    

    const handleLogin = () => {
        console.log("handle login");
        login({
            email: "test@gmail.com",
            authToken: "test",
            sheetURL: "google.com/test",
          });
    };


    return (
        <div>
            <button onClick={handleLogin} disabled={!userAuth().user}>
                {!userAuth().user ? "Logged In!" : "Login"}
            </button>
        </div>
    );
}

export default Login;

/*export const AddUser: React.FC = () => {
    console.log("add user");
    const { saveNewUser } = React.useContext(UserContext) as UserContextType;
    console.log("add user 2")
    const [user, setUser] = useState<IUser | null>(null);

    const handleLogin = async () => {
        try {
            console.log("handle login");
            chrome.runtime.sendMessage({ reason: "login" }, (response) => {
                chrome.storage.sync.set({ isLoggedIn: true });
                console.log("login response", response);
                saveNewUser(response);
                setUser(response);
            });
        }
        catch (error) {
            console.log("error logging in", error);
        }
    }

    return (
        <div>
            <button onClick={handleLogin} disabled={!!user}>
                {!!user ? "Logged In!" : "Login"}
            </button>
        </div>
    )
}


/*export async function handleLogin() {
    try {
        chrome.runtime.sendMessage({ reason: "login" }, (response) => {
            
            chrome.storage.sync.set({ isLoggedIn: true });          
            return response;
        });
    }
    catch (error) {
        console.log("error logging in", error);
    }
}*/
    

/*
    //get auth token
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (token) {
            console.log("token", token);
            const authToken = token;
        } else {
            chrome.identity.clearAllCachedAuthTokens(() => {
                console.log("Cleared all cached");
            });
            throw new Error("Error getting token");
        }
    });

    //get user info
    chrome.identity.getProfileUserInfo((userInfo) => {
        console.log("user info", userInfo);
        return userInfo.email;
    });


    
    const authToken = await getAuthToken();
    const email = await getUserInfo();

    if (authToken === null || email === null) {
        throw new Error("Error getting token or user info");
    } else {
        return { email: email, authToken: authToken; sheetURL: "" };
    }


}


async function getUserInfo(){
    
}





async function getAuthToken() {
    console.log("getAuthToken");

    chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (token) {
            return token;
        } else {
            chrome.identity.clearAllCachedAuthTokens(() => {
                console.log("Cleared all cached");
            });
        }
    });

}

// checks if x is not null
function isNull(x: any): boolean {
    return x === null;
}*/