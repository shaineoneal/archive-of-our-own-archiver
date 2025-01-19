export * from './accessToken';
export * from './addWorkToSheet';
export * from './httpRequest';
export * from './messaging';
export * from './oauthSignIn';
export * from './querySpreadsheet';
export * from './refreshToken';
export * from './removeWorkFromSheet';
export * from './spreadsheet';
export * from './store';


//date saves as "M/D/YYYY, H:MM:SS AM/PM"
export function convertToAO3Date(datetime: string): string {


    let date = new Date(datetime);


    // Change date to AO3 format (DD MMM YYYY)
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let formattedDate = `${day} ${months[month]} ${year}`;
    return date.toDateString();
}