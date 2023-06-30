import React from 'react';

export const ForgetSheet = () => {
    const handleForgetSheet = () => {
        chrome.identity.clearAllCachedAuthTokens(() => {
            console.log('Cleared all cached');
        });

        chrome.storage.sync.remove(['authToken']);
    };

    return (
        <div>
            <button onClick={handleForgetSheet}>Forget Sheet</button>
        </div>
    );
};
export default ForgetSheet;
