/*import React, { useState, createContext } from "react";
//import { getSheetURL } from "./sheets";
import { UserContext } from "./Contexts/UserContext";
//import { UserContextType, IUser } from "./user";







export const LoginContext = createContext({ loggedIn: false,
    setLoggedIn: (loggedIn: false) => {} })

const Login = () => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    return (
        <>
            <LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
                <div>
                    <button onClick={() => handleLogin()} disabled={loginStatus}>
                        {loginStatus ? "Logged In!" : "Login"}
                    </button>
                </div>
            </LoginContext.Provider>
        </>
    )
}

export default Login;





const AddLogin: React.FC = () => {
    const { saveNewUser } = React.useContext(UserContext) as UserContextType;
    const [username, setUsername] = useState<IUser | null>(null);

    const handleLogin = async () => {
        setUsername(...username, )
    }


    return (
        <div>
            <button onClick={() => toggleLoginStatus()} disabled={loginStatus}>
                {loginStatus ? "Logged In!" : "Login"}
            </button>
        </div>
    );

}





function handleLogin() {
    try {
        chrome.runtime.sendMessage({ reason: "login" }, (response) => {
            chrome.storage.sync.set({ isLoggedIn: true });
            console.log("login response", response);
            setLoginState(true);
        });
    }
    catch (error) {
        console.log("error logging in", error);
    }
}






class CurrentUser {
    username: string;
    authToken: string;  //async
    sheetURL: string;   //async

    private constructor(username: string, authToken: string, sheetURL: string) {
        this.username = username;
        this.authToken = authToken;
        this.sheetURL = sheetURL;
    }
    public async init() {
        const authToken = await this.getAuthToken();
        const sheetURL = await getSheetURL(authToken);
        return new CurrentUser(this.username, authToken, sheetURL);
    }

    async handleAuthentication() {
        //make sure getAuthToken worked
        console.log("handleAuthentication");
        try {   
            const token: string = await this.getAuthToken();
            //make sure getAuthToken returned the token
            console.log("getAuthToken success", token);
            //get the sheet URL from local storage
            const url: string = await this.getURL();
            //make sure sheetURL returned the URL
            console.log("sheetURL success", url);
        } catch (error) {
            console.log("Error in handleAuthentication:", error);
        }
    }
    
    async getAuthToken(): Promise<string>{
        console.log("getAuthToken");
        const token = "";
        try {
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                console.log("Got the token", token);
                chrome.storage.sync.set({ authToken: token });
                chrome.storage.sync.set({ isLoggedIn: true });
                
            });
        } catch (error) {  
            console.log("Error in getAuthToken:", chrome.runtime.lastError);
            chrome.identity.clearAllCachedAuthTokens(() => {
                console.log("Cleared all cached");
            });
        }
        chrome.storage.sync.get(["authToken"], (result) => {
            console.log("getAuthToken", result.authToken)
            return result.authToken;
        });
        return token;
    }
    
}



export default function useLoginStatus() {
    
    const [loginState, setLoginState] = useState(false);

    useEffect(() => {  
        try {
            //get login status from storage
            chrome.storage.sync.get(["isLoggedIn"], (result) => {
                console.log("login status", result.isLoggedIn);
                setLoginState(result.isLoggedIn);
                console.log("login state", loginState);
            });
        }
        catch (error) {
            console.log("error getting login status", error);
        }
    }, [loginState]);   //runs when loginState changes

    function toggleLoginStatus() {
       
        if (loginState) {   //if currently logged in, log out
            try {
                chrome.runtime.sendMessage({ reason: "logout" }, (response) => {
                    chrome.storage.sync.set({ isLoggedIn: false });
                    console.log("logout response", response);
                    setLoginState(false);
                });
            }
            catch (error) {
                console.log("error logging out", error);
            }
        } else {    //if currently logged out, log in
            try {
                chrome.runtime.sendMessage({ reason: "login" }, (response) => {
                    chrome.storage.sync.set({ isLoggedIn: true });
                    console.log("login response", response);
                    setLoginState(true);
                });
            }
            catch (error) {
                console.log("error logging in", error);
            }
        }
    }

    return [loginState, toggleLoginStatus] as const;
}

/*export function checkLoginStatus(): boolean {
    try {
        chrome.storage.sync.get("isLoggedIn", (result) => {
            console.log("getLoginStatus", result.isLoggedIn);
            if (result.isLoggedIn === true) {
                return true;
            } else {
                return false;
            }
        });
    } catch (error) {
        console.log("Error in getLoginStatus:", error);
        return false;
    } finally {
        return false;
    }

};


const getLoginStatus = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
        useEffect(() => {  
            try {
                //get login status from storage
                chrome.storage.sync.get(["isLoggedIn"], (result) => {
                    console.log("login status", result.isLoggedIn);
                    setIsLoggedIn(result.isLoggedIn);
                });
            }
            catch (error) {
                console.log("error getting login status", error);
            }
        }, []);
    return isLoggedIn;
}

export default getLoginStatus;

function handleLogin() {

    try {
        chrome.runtime.sendMessage({ reason: "login" }, (response) => {
            chrome.storage.sync.set({ isLoggedIn: true });
            console.log("login response", response);
        });
        
    }
    catch (error) {
        console.log("error handling response", error);
    }

};

export async function handleLogout() {
    try {
        chrome.runtime.sendMessage({ reason: "logout" });
    }
    catch (error) {
        console.log("error handling response", error);
    }
}*/