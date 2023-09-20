import { log } from "../../utils";

/**
 * Interface for OAuth sign-in parameters 
 */
interface OAuthParams {
    // Client ID assigned by Google
    client_id: string;
  
    // Redirect URI after user grants access
    redirect_uri: string;
  
    // Response type - set to 'token'
    response_type: 'token'; 
    
    // Scope of access being requested
    scope: string;
  
    // Whether to return refresh token
    include_granted_scopes: boolean;
  
    // State value for security
    state: string;

    [key: string]: string | boolean;
  }
  
  /**
   * Sign in using Google OAuth 2.0 endpoint
   */ 
  export function oauthSignIn() {

    log('oauthSignIn');
  
    // OAuth 2.0 endpoint
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  
    /**
     * OAuth parameters to pass
     */
    const params: OAuthParams = {
      // YOUR_CLIENT_ID assigned by Google
      client_id: '972283065139-0vv4km66vsale3ibeu2dr253gki1r8ln.apps.googleusercontent.com',
  
      // URL to redirect to after access granted
      redirect_uri: 'https://fpolkflkolbgaceliloehfofnoiklngb.chromiumapp.org/*',
      
      // Response type - set to 'token'
      response_type: 'token',
  
      // Request read-only Drive metadata access 
      scope: 'https://www.googleapis.com/auth/spreadsheets',
  
      // Request refresh token
      include_granted_scopes: true,
  
      // State value for security 
      state: 'pass-through value'
    };
  
    // Create form to submit parameters
    const form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);
  
    // Add parameters as hidden inputs
    for (const p in params) {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p] as string);
      form.appendChild(input);
    }
  
    // Add form to page and submit
    document.body.appendChild(form);
    form.submit();
  
  }