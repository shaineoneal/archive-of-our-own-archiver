import React from 'react';

export const Login = () => {

    const handleLogin = async () => {
        console.log('login');
    }

    return (
        <div>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}