import {  AuthRequestResponse, syncStorageSet } from '..';
import log from '../utils/logger'

/**
 * Checks if the user has a refresh token.
 * @returns A promise that resolves with the refresh token if the user has one, or rejects with an error if there was an error retrieving the token.
 */
export function doesUserHaveRefreshToken(): Promise<string> {
    log('Checking if user has refresh token...');
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['refresh_token'], (result) => {
            if (chrome.runtime.lastError) {
                log('Error retrieving refresh token: ', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            }
            else {
                if (result.refresh_token) {
                    log('User has refresh token: ', result.refresh_token);
                    resolve(result.refresh_token);
                }
            }
        });
    });
}
    
export function handleAuthResponse(response: AuthRequestResponse, setRefreshToken: (token: string) => void){
    //AuthRequestResponse always has an access_token
    syncStorageSet('access_token', response.access_token);
   
    if (response.refresh_token) {
        setRefreshToken(response.refresh_token);
    } else {
        setRefreshToken('error');
    }
}
/*
export function checkResponseForRefreshToken(response: TokenRequestResponse): RefreshTokenType {

    if (!response.refresh_token) {
        return RefreshTokenState.NOT_LOADED;
    }
    if (response.refresh_token) {
        return RefreshTokenState.LOADED;
    }
}
*/