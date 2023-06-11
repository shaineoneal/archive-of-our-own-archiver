import { UserContext } from "../Contexts/UserContext";
import { UserType } from "../user";
import { useUser } from "../useUser";
import React, { useState } from 'react';

/** Login component */

const LoginButton = () => {
    const { user, login } = useUser();
    
    const handleLogin = () => {
        console.log("save user; email: ", user?.email);
        login({
            email: "test@gmail.com",
            authToken: "test",
            sheetURL: "google.com/test",
        });
    }

    return (
        <>
            <button onClick={handleLogin} disabled={!useUser()}>Login</button>
            <h1>{useUser().user?.email}</h1>
        </>
    );
}

const Login = () => {
    const [user, setUser] = useState<UserType | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <LoginButton />
        </UserContext.Provider>

    )
}

export default Login;



/*
export class LoginClass extends Component <UserContextType> {

    static contextType = UserContext;


    render() {
        const currentUser = LoginClass.contextType;

        return (
            <div>
                <h1>{ this.props.user?.email }</h1>
            </div>
        )
    }
}




export const useUser = () => {

    console.log("user auth");

    const { user, saveUser } = useContext(UserContext);

    useEffect(() => {
        chrome.storage.local.get("user")
            .then((user) => { 
                saveUser(user.user);
                console.log("user auth; user: ", user.user);
            });

    }, []);

    const login = (user: UserType) => {
        console.log("login");
        saveUser(user);
        chrome.storage.local.set({ user });

    };

    /*const logout = () => {
        saveUser(null);
        chrome.storage.local.remove("user");
    };

    const getUserStatus = () => {
        if (user) {
            return true;
        } else { return false; }
    }
    
    return { user, login };
};

const Login = () => {

    const { user, login } = useUser();

    const handleLogin = () => {
        console.log("handle login; current local storage: ", checkLocal());
        login({
            email: "test@gmail.com",
            authToken: "test",
            sheetURL: "google.com/test",
          });
    };


    return (
        <div>
            <button onClick={handleLogin} >
                {!!useUser().user ? "Logged In!" : "Login"}
            </button>
        </div>
    );
}

export default Login;

export const AddUser: React.FC = () => {
    console.log("add user");
    const { saveNewUser } = React.useContext(UserContext) as UserContextType;
    console.log("add user 2")
    const [user, saveUser] = useState<IUser | null>(null);

    const handleLogin = async () => {
        try {
            console.log("handle login");
            chrome.runtime.sendMessage({ reason: "login" }, (response) => {
                chrome.storage.sync.set({ isLoggedIn: true });
                console.log("login response", response);
                saveNewUser(response);
                saveUser(response);
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