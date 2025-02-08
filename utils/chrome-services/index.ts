export * from './accessToken.tsx';
export * from './addWorkToSheet.tsx';
export * from './httpRequest.ts';
export * from './messaging.ts';
export * from './oauthSignIn.ts';
export * from './querySpreadsheet.tsx';
export * from './refreshToken.ts';
export * from './removeWorkFromSheet.ts';
export * from './spreadsheet.tsx';
export * from './store.ts';


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