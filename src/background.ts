import { google } from 'googleapis';

function polling() {
  // console.log("polling");
  setTimeout(polling, 1000 * 30);
}

polling();
