import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    srcDir: 'src',
    modules: ['@wxt-dev/module-react'],
    manifest: () => ({
        name: 'Rewritten AO3 Extension',
        description: 'rewrite of AO3 Extension',
        oauth2: {
            client_id: '72283065139-0vv4km66vsale3ibeu2dr253gki1r8ln.apps.googleusercontent.com',
            scopes: ['https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/userinfo.profile']
        },
        key: import.meta.env.WXT_API_EXTENSION_PUBLIC_KEY,
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
                id: 'ao3-archiver@gmail.com',
                strict_min_version: '58.0'
            }
        }
    })
});