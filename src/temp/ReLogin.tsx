/*import React, { createContext, useContext, useState } from 'react';
import { UserType, UserStateT} from '../user';

const UserContext = createContext<UserStateT({
    user: {
        email: null,
        authToken: null,
        sheetURL: null
    },
    setUser: () => {}
});

function userAuth() {
    const { user, setUser } = useContext(UserContext);

    const login = (user: UserType) => {
        console.log("login");
        setUser(user);
    }

    return { user, login };
}



const ReLogin = () => {
    const { user, login } = userAuth();
    
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
            <button onClick={handleLogin} disabled={!userAuth}>Login</button>
            <h1>{userAuth().user?.email}</h1>
        </>
    );
}

const App = () => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <ReLogin />
        </UserContext.Provider>

    )
}

export default App;*/