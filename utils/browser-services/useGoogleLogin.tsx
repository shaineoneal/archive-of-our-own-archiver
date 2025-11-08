import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';


let redirectUri = import.meta.env.WXT_API_REDIRECT_URI;

export const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
        console.log(codeResponse);
        const tokens = await axios.post(
            'http://localhost:3001/auth/google', {
                code: codeResponse.code,
            });

        console.log(tokens);
    },
    onError: errorResponse => console.log(errorResponse),
});