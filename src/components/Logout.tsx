import { removeToken } from '../chrome-services';

export const Logout = () => {
    const handleLogout = () => {
        removeToken();
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout;
