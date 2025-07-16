import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    modules: ['@wxt-dev/module-react'],
    manifest: {
        name: 'Rewritten AO3 Extension',
        description: 'rewrite of AO3 Extension',
        oauth2: {
            client_id: '72283065139-0vv4km66vsale3ibeu2dr253gki1r8ln.apps.googleusercontent.com',
            scopes: ['https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/userinfo.profile']
        },
        key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmiXSszV2OCyf7MiWKkw6NsCJ2Xy9xrfseBfdcOKlX08HNPyKjpSR6gOsx96ZGVe0nVpxIkC7+zBG5GWp7rMVxVeVoDPE+d0KCvjkxpgDybq3gFtlszNZOKSUiUbRfwuk+ukstp9yY0PuNR1C/EB+WvwHGmPDTkMHAzTtgX+BEPs3VYjrGpVW6avdlGYOBtBUOcTg0oO2NdmKIQdm0cHeZIOqRTgNR/hlNMjY7rI9BGYSVVe7ac5k/wk9zqYTPB7fK/rkvoJxktRF3NavkRfiSt/XX8EmCTYzYLrlRVvq2/wQtoP4nf0wKIQAalqTGb1z5Rn7ded5+IU9iAYL9rm4VQIDAQAB',
        permissions: ['webRequest', 'identity', 'storage', 'scripting', 'activeTab', 'cookies'],
        host_permissions: ['*://*.archiveofourown.org/*', 'https://docs.google.com/spreadsheets/*', '*://*.google.com/'],
        options_ui: {
            page: "@/entrypoints/options.html",
            open_in_tab: false
        },
        action: {
            default_icon: 'icons/icon-16.png',
            default_popup: 'entrypoints/popup/index.html',
        },
        browser_action: {
            default_icon: 'icons/icon-16.png',
            default_popup: 'index.html'
        },
        web_accessible_resources: [{
            resources: ['js/content_script.css', 'popup.html'],
            matches: ['*://*.archiveofourown.org/*', 'chrome-extension://fpolkflkolbgaceliloehfofnoiklngb/*']
        }],
        browser_specific_settings: {
            gecko: {
                id: 'shaineoneal@gmail.com',
                strict_min_version: '58.0'
            }
        }
    }
});