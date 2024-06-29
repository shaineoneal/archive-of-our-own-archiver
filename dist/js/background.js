/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/chrome-services/accessToken.tsx":
/*!*********************************************!*\
  !*** ./src/chrome-services/accessToken.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchNewAccessToken: () => (/* binding */ fetchNewAccessToken),
/* harmony export */   getAccessToken: () => (/* binding */ getAccessToken),
/* harmony export */   isAccessTokenValid: () => (/* binding */ isAccessTokenValid),
/* harmony export */   removeToken: () => (/* binding */ removeToken)
/* harmony export */ });
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/logger */ "./src/utils/logger.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

/** get token from identity API
 *
 * @param interactive = true if you want to ask the user for permission to access their google account
 * @returns token or empty string
 */
function fetchNewAccessToken(interactive) {
    return new Promise((resolve) => {
        if (interactive === true) {
            //getting token interactively
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('getting token interactively');
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                if (token) {
                    resolve(token);
                }
                else {
                    chrome.identity.clearAllCachedAuthTokens(() => {
                        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('Cleared all cached');
                        resolve(''); // TODO: make an actual error
                    });
                }
            });
        }
        else {
            // get token from identity API
            chrome.identity.getAuthToken({ interactive: false }, (token) => {
                if (token) {
                    resolve(token);
                }
                else {
                    chrome.identity.clearAllCachedAuthTokens(() => {
                        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('Cleared all cached');
                        resolve(''); // TODO: make an actual error
                    });
                }
            });
        }
    });
}
//remove token from chrome storage and identity API
function removeToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield getAccessToken();
        if (token === '') {
            throw new Error('Error getting token');
        }
        chrome.storage.sync.remove(['authToken']);
        // remove all identity tokens
        chrome.cookies.remove({
            name: 'authToken',
            url: 'https://archiveofourown.org',
        }, () => {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('Removed cookie');
        });
    });
}
/**
 * Retrieves the access token from a cookie.
 * @returns A promise that resolves to the access token string.
 * @throws An error if the access token cannot be retrieved.
 */
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            chrome.cookies.get({
                name: 'authToken',
                url: 'https://archiveofourown.org',
            }, (cookie) => {
                if (cookie) {
                    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('Access token cookie.value: ', cookie.value);
                    resolve(cookie.value);
                }
                else {
                    reject('Error getting token');
                }
            });
        });
    });
}
function isAccessTokenValid() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield getAccessToken();
        if (token == '') {
            return false;
        }
        return true;
    });
}


/***/ }),

/***/ "./src/chrome-services/index.ts":
/*!**************************************!*\
  !*** ./src/chrome-services/index.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addWorkToSheet: () => (/* reexport safe */ _utils_addWorkToSheet__WEBPACK_IMPORTED_MODULE_2__.addWorkToSheet),
/* harmony export */   createCookie: () => (/* reexport safe */ _utils_cookies__WEBPACK_IMPORTED_MODULE_3__.createCookie),
/* harmony export */   createSpreadsheet: () => (/* reexport safe */ _spreadsheet__WEBPACK_IMPORTED_MODULE_1__.createSpreadsheet),
/* harmony export */   fetchNewAccessToken: () => (/* reexport safe */ _accessToken__WEBPACK_IMPORTED_MODULE_0__.fetchNewAccessToken),
/* harmony export */   fetchSpreadsheetUrl: () => (/* reexport safe */ _spreadsheet__WEBPACK_IMPORTED_MODULE_1__.fetchSpreadsheetUrl),
/* harmony export */   getAccessToken: () => (/* reexport safe */ _accessToken__WEBPACK_IMPORTED_MODULE_0__.getAccessToken),
/* harmony export */   getCookie: () => (/* reexport safe */ _utils_cookies__WEBPACK_IMPORTED_MODULE_3__.getCookie),
/* harmony export */   getSheetId: () => (/* reexport safe */ _utils_getSheetId__WEBPACK_IMPORTED_MODULE_4__.getSheetId),
/* harmony export */   isAccessTokenValid: () => (/* reexport safe */ _accessToken__WEBPACK_IMPORTED_MODULE_0__.isAccessTokenValid),
/* harmony export */   removeToken: () => (/* reexport safe */ _accessToken__WEBPACK_IMPORTED_MODULE_0__.removeToken)
/* harmony export */ });
/* harmony import */ var _accessToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./accessToken */ "./src/chrome-services/accessToken.tsx");
/* harmony import */ var _spreadsheet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./spreadsheet */ "./src/chrome-services/spreadsheet.tsx");
/* harmony import */ var _utils_addWorkToSheet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/addWorkToSheet */ "./src/chrome-services/utils/addWorkToSheet.tsx");
/* harmony import */ var _utils_cookies__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/cookies */ "./src/chrome-services/utils/cookies.ts");
/* harmony import */ var _utils_getSheetId__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/getSheetId */ "./src/chrome-services/utils/getSheetId.tsx");







/***/ }),

/***/ "./src/chrome-services/querySheet.tsx":
/*!********************************************!*\
  !*** ./src/chrome-services/querySheet.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   query: () => (/* binding */ query)
/* harmony export */ });
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/logger */ "./src/utils/logger.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

// query the spreadsheet for the works in the searchList
function query(spreadsheetUrl, authToken, searchList) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = `select A where A matches`;
        searchList.forEach((workId) => {
            if (workId === searchList[0]) {
                query += ` '${workId}'`;
            }
            else {
                query += ` or A matches '${workId}'`;
            }
        });
        encodeURIComponent(query);
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('query', encodeURIComponent(query));
        return fetch(`https://docs.google.com/spreadsheets/d/${spreadsheetUrl.split('/')[5]}/gviz/tq?tq=${encodeURIComponent(query)}&access_token=${authToken}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
        }).then((res) => res.text()).then((res) => {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('query', 'res', res);
            const json = JSON.parse(res.substring(47, res.length - 2));
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('query', 'json', json);
            return json;
        });
    });
}


/***/ }),

/***/ "./src/chrome-services/spreadsheet.tsx":
/*!*********************************************!*\
  !*** ./src/chrome-services/spreadsheet.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSpreadsheet: () => (/* binding */ createSpreadsheet),
/* harmony export */   fetchSpreadsheetUrl: () => (/* binding */ fetchSpreadsheetUrl)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/chrome-services/index.ts");
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/logger */ "./src/utils/logger.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


/**
 *
 * @returns user's spreadsheet URL
 */
function fetchSpreadsheetUrl() {
    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('getting spreadsheet URL');
    return new Promise((resolve, reject) => {
        // check for a stored spreadsheet URL
        chrome.storage.sync.get(['spreadsheetUrl'], (result) => __awaiter(this, void 0, void 0, function* () {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('fetchSpreadSheetUrl result: ', result);
            const spreadsheetUrl = result.spreadsheetUrl;
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('spreadsheetUrl type: ', typeof spreadsheetUrl);
            // does the user have a spreadsheet URL already?
            if (spreadsheetUrl !== undefined && Object.keys(spreadsheetUrl).length !== 0) {
                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('user has spreadsheet URL: ', spreadsheetUrl);
                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('spreadsheetID: ', String(spreadsheetUrl).split('/')[5]);
                resolve(spreadsheetUrl);
            }
            else {
                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])("user doesn't have spreadsheet URL, creating spreadsheet");
                //get authToken
                const token = yield (0,___WEBPACK_IMPORTED_MODULE_0__.getAccessToken)();
                if (token === null) {
                    reject('Error getting token');
                }
                else {
                    //create spreadsheet
                    yield createSpreadsheet(token)
                        .then((url) => {
                        resolve(url);
                    })
                        .catch((error) => {
                        reject(error);
                    });
                }
            }
        }));
    });
}
/**
 *
 * @param token user's auth token
 * @returns
 */
function createSpreadsheet(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const sheetLayout = {
            properties: { title: 'AO3E' },
            namedRanges: [
                {
                    namedRangeId: '0',
                    name: 'WorkID',
                    range: {
                        sheetId: 0,
                        startColumnIndex: 0,
                        endColumnIndex: 1
                    }
                },
                {
                    namedRangeId: '1',
                    name: 'title',
                    range: {
                        sheetId: 0,
                        startColumnIndex: 1,
                        endColumnIndex: 2
                    }
                },
                {
                    namedRangeId: '2',
                    name: 'authors',
                    range: {
                        sheetId: 0,
                        startColumnIndex: 2,
                        endColumnIndex: 3
                    }
                },
                {
                    namedRangeId: '3',
                    name: 'fandoms',
                    range: {
                        sheetId: 0,
                        startColumnIndex: 3,
                        endColumnIndex: 4
                    }
                },
                {
                    namedRangeId: '4',
                    name: 'relationships',
                    range: {
                        sheetId: 0,
                        startColumnIndex: 4,
                        endColumnIndex: 5
                    }
                },
                {
                    namedRangeId: '5',
                    name: 'tags',
                    range: {
                        sheetId: 0,
                        startColumnIndex: 5,
                        endColumnIndex: 6
                    }
                },
                {
                    namedRangeId: '6',
                    name: 'description',
                    range: {
                        sheetId: 0,
                        startColumnIndex: 6,
                        endColumnIndex: 7
                    }
                },
                {
                    namedRangeId: '7',
                    name: 'wordCount',
                    range: {
                        sheetId: 0,
                        startColumnIndex: 7,
                        endColumnIndex: 8
                    }
                },
                {
                    namedRangeId: '8',
                    name: 'chapterCount',
                    range: {
                        sheetId: 0,
                        startColumnIndex: 8,
                        endColumnIndex: 9
                    }
                },
                {
                    namedRangeId: '9',
                    name: 'status',
                    range: {
                        sheetId: 0,
                        startColumnIndex: 9,
                        endColumnIndex: 10
                    }
                },
                {
                    namedRangeId: '10',
                    name: 'rating',
                    range: {
                        sheetId: 0,
                        startColumnIndex: 10,
                        endColumnIndex: 11
                    }
                }
            ],
            sheets: {
                properties: {
                    title: 'Access Works',
                    sheetId: 0,
                    /*gridProperties: {
                        rowCount: 1,
                        columnCount: 11,
                        columnGroupControlAfter: true,
                    }*/
                },
                protectedRanges: [
                    {
                        protectedRangeId: 0,
                        range: {},
                        description: 'Protected',
                        warningOnly: true,
                    },
                ],
                data: [
                    {
                        startRow: 0,
                        startColumn: 0,
                        rowData: [
                            {
                                values: [
                                    {
                                        userEnteredValue: {
                                            stringValue: 'Work ID',
                                        },
                                        userEnteredFormat: {
                                            textFormat: { bold: true },
                                        },
                                    },
                                    {
                                        userEnteredValue: { stringValue: 'Title' },
                                        userEnteredFormat: {
                                            textFormat: { bold: true },
                                        },
                                    },
                                    {
                                        userEnteredValue: {
                                            stringValue: 'Authors',
                                        },
                                        userEnteredFormat: {
                                            textFormat: { bold: true },
                                        },
                                    },
                                    {
                                        userEnteredValue: {
                                            stringValue: 'Fandoms',
                                        },
                                        userEnteredFormat: {
                                            textFormat: { bold: true },
                                        },
                                    },
                                    {
                                        userEnteredValue: {
                                            stringValue: 'Relationships',
                                        },
                                        userEnteredFormat: {
                                            textFormat: { bold: true },
                                        },
                                    },
                                    {
                                        userEnteredValue: {
                                            stringValue: 'Tags',
                                        },
                                        userEnteredFormat: {
                                            textFormat: { bold: true },
                                        },
                                    },
                                    {
                                        userEnteredValue: {
                                            stringValue: 'Description',
                                        },
                                        userEnteredFormat: {
                                            textFormat: { bold: true },
                                        },
                                    },
                                    {
                                        userEnteredValue: {
                                            stringValue: 'Word Count',
                                        },
                                        userEnteredFormat: {
                                            textFormat: { bold: true },
                                        },
                                    },
                                    {
                                        userEnteredValue: {
                                            stringValue: 'Chapter Count',
                                        },
                                        userEnteredFormat: {
                                            textFormat: { bold: true },
                                        },
                                    },
                                    {
                                        userEnteredValue: {
                                            stringValue: 'Status'
                                        },
                                        userEnteredFormat: {
                                            textFormat: { bold: true },
                                        },
                                    },
                                    {
                                        userEnteredValue: {
                                            stringValue: 'Rating',
                                        },
                                        userEnteredFormat: {
                                            textFormat: { bold: true },
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    { startColumn: 0, columnMetadata: { pixelSize: 100 } },
                    { startColumn: 1, columnMetadata: { pixelSize: 300 } },
                    { startColumn: 2, columnMetadata: { pixelSize: 200 } },
                    { startColumn: 3, columnMetadata: { pixelSize: 200 } },
                    { startColumn: 4, columnMetadata: { pixelSize: 100 } },
                    { startColumn: 5, columnMetadata: { pixelSize: 100 } },
                    { startColumn: 6, columnMetadata: { pixelSize: 100 } }, //status
                ],
            },
        };
        const url = 'https://sheets.googleapis.com/v4/spreadsheets';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(sheetLayout),
        };
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('options: ', options);
        return fetch(url, options)
            .then((response) => {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('Response status:', response.status);
            return response.json();
        })
            .then((data) => {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('Success:', data);
            chrome.storage.sync.set({ spreadsheetUrl: data.spreadsheetUrl });
            return data.spreadsheetUrl;
        })
            .catch((error) => {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('Error creating spreadsheet:', error);
            throw error;
        });
    });
}


/***/ }),

/***/ "./src/chrome-services/utils/addWorkToSheet.tsx":
/*!******************************************************!*\
  !*** ./src/chrome-services/utils/addWorkToSheet.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addWorkToSheet: () => (/* binding */ addWorkToSheet)
/* harmony export */ });
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/logger */ "./src/utils/logger.ts");
/* harmony import */ var _getSheetId__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getSheetId */ "./src/chrome-services/utils/getSheetId.tsx");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const addWorkToSheet = (spreadsheetUrl, authToken, work) => __awaiter(void 0, void 0, void 0, function* () {
    ;
    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('addWorkToSheet', work);
    const sheetId = yield (0,_getSheetId__WEBPACK_IMPORTED_MODULE_1__.getSheetId)(spreadsheetUrl, authToken);
    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('addWorkToSheet', 'sheetId', sheetId);
    return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetUrl.split('/')[5]}:batchUpdate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            requests: [
                {
                    appendDimension: {
                        sheetId: sheetId,
                        dimension: 'ROWS',
                        length: 1,
                    }
                },
                {
                    appendCells: {
                        sheetId: sheetId,
                        rows: [
                            { values: [
                                    { userEnteredValue: { numberValue: work.workId } },
                                    { userEnteredValue: { stringValue: work.title } },
                                    { userEnteredValue: { stringValue: work.author.toString() },
                                        userEnteredFormat: { wrapStrategy: 'WRAP' } },
                                    { userEnteredValue: { stringValue: work.fandoms.toString() },
                                        userEnteredFormat: { wrapStrategy: 'WRAP' } },
                                    { userEnteredValue: { stringValue: work.relationships.toString() },
                                        userEnteredFormat: { wrapStrategy: 'WRAP' } },
                                    { userEnteredValue: { stringValue: work.tags.toString() },
                                        userEnteredFormat: { wrapStrategy: 'WRAP' } },
                                    { userEnteredValue: { stringValue: work.description },
                                        userEnteredFormat: { wrapStrategy: 'WRAP' } },
                                    { userEnteredValue: { numberValue: work.wordCount } },
                                    { userEnteredValue: { numberValue: work.totalChapters } },
                                    { userEnteredValue: { stringValue: work.status } },
                                    { userEnteredValue: { numberValue: work.rating } }, //10
                                ] },
                        ],
                        fields: '*',
                    }
                },
                {
                    autoResizeDimensions: {
                        dimensions: {
                            sheetId: sheetId,
                            dimension: 'ROWS'
                        }
                    }
                }
            ],
            includeSpreadsheetInResponse: false
        }),
    }).then((res) => res.json());
});


/***/ }),

/***/ "./src/chrome-services/utils/cookies.ts":
/*!**********************************************!*\
  !*** ./src/chrome-services/utils/cookies.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCookie: () => (/* binding */ createCookie),
/* harmony export */   getCookie: () => (/* binding */ getCookie)
/* harmony export */ });
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/logger */ "./src/utils/logger.ts");

function createCookie(cookie) {
    return new Promise((resolve, reject) => {
        chrome.cookies.set(cookie, (cookie) => {
            if (cookie) {
                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('createCookie cookie', cookie);
            }
            resolve(cookie);
        });
    });
}
function getCookie(cookieName, url) {
    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('getting cookie', cookieName, url);
    return new Promise((resolve) => {
        chrome.cookies.get({ name: cookieName, url: url }, (cookie) => {
            if (cookie) {
                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('getCookie cookie', cookie);
                resolve(cookie);
            }
            else {
                resolve('');
            }
        });
    });
}


/***/ }),

/***/ "./src/chrome-services/utils/getSheetId.tsx":
/*!**************************************************!*\
  !*** ./src/chrome-services/utils/getSheetId.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getSheetId: () => (/* binding */ getSheetId)
/* harmony export */ });
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/logger */ "./src/utils/logger.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

// Get the sheetId from the spreadsheetUrl
// TODO: save the sheetId in session storage
const getSheetId = (spreadsheetUrl, authToken) => __awaiter(void 0, void 0, void 0, function* () {
    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('getSheetId: ', spreadsheetUrl);
    return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetUrl.split('/')[5]}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
    }).then((res) => res.json()).then((res) => res.sheets[0].properties.sheetId);
});


/***/ }),

/***/ "./src/chrome-services/utils/oauthSignIn.ts":
/*!**************************************************!*\
  !*** ./src/chrome-services/utils/oauthSignIn.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   launchWebAuthFlow: () => (/* binding */ launchWebAuthFlow)
/* harmony export */ });
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/logger */ "./src/utils/logger.ts");
/* harmony import */ var _cookies__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cookies */ "./src/chrome-services/utils/cookies.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const redirectURL = chrome.identity.getRedirectURL();
const { oauth2 } = chrome.runtime.getManifest();
if (!oauth2) {
    throw new Error('You need to specify oauth2 in manifest.json');
}
const clientId = oauth2.client_id;
const authParams = new URLSearchParams({
    //access_type: 'offline',
    client_id: clientId,
    response_type: 'token',
    redirect_uri: redirectURL,
    scope: ['https://www.googleapis.com/auth/spreadsheets'].join(' '),
});
const authURL = `https://accounts.google.com/o/oauth2/auth?${authParams.toString()}`;
//FIX: interactive can't be false
function launchWebAuthFlow(interactive) {
    return new Promise((resolve, reject) => {
        chrome.identity.launchWebAuthFlow({ url: authURL, interactive }, ((responseUrl) => __awaiter(this, void 0, void 0, function* () {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('responseUrl', responseUrl);
            const url = new URL(responseUrl);
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('url', url);
            const urlParams = new URLSearchParams(url.hash.slice(1));
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('urlParams', urlParams);
            const params = Object.fromEntries(urlParams.entries()); // access_token, expires_in
            params.expires_in = '43199'; // 12 hours
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('params', params);
            const token = params.access_token;
            const cookie = yield (0,_cookies__WEBPACK_IMPORTED_MODULE_1__.createCookie)({
                name: 'authToken',
                url: 'https://www.archiveofourown.org/',
                value: token,
                expirationDate: Date.now() / 1000 + 43199,
                domain: '.archiveofourown.org',
            });
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('cookie', cookie);
            if (cookie) {
                return resolve(cookie);
            }
            else {
                reject();
            }
        })));
    });
}
//fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`, {
//    method: 'GET',
//    headers: { 'Content-Type': 'application/json' },
//}).then(response => response.json()).then((data) => {
//    alert(JSON.stringify(data));
//});
function refreshToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('https://www.googleapis.com/oauth2/v4/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: clientId,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }),
        });
        const data = yield response.json();
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('refreshToken data', data);
        return data;
    });
}


/***/ }),

/***/ "./src/utils/compareArrays.ts":
/*!************************************!*\
  !*** ./src/utils/compareArrays.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   compareArrays: () => (/* binding */ compareArrays)
/* harmony export */ });
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ "./src/utils/logger.ts");

//returns bool for each item in searchList as an array
function compareArrays(searchList, response) {
    var boolArray = new Array(20).fill(false);
    (0,_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('searchList', searchList);
    (0,_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('response', response);
    searchList.forEach((searchItem) => {
        response.forEach((responseItem) => {
            if (searchItem === responseItem.c[0].f) {
                boolArray[searchList.indexOf(searchItem)] = true;
                response.splice(response.indexOf(responseItem), 1);
            }
            ;
        });
    });
    return boolArray;
}


/***/ }),

/***/ "./src/utils/logger.ts":
/*!*****************************!*\
  !*** ./src/utils/logger.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const log = (function (environment) {
    if (environment === 'production') {
        return () => { };
    }
    return (...args) => {
        console.log(...args);
    };
})("development");
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (log);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _chrome_services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../chrome-services */ "./src/chrome-services/index.ts");
/* harmony import */ var _chrome_services_querySheet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../chrome-services/querySheet */ "./src/chrome-services/querySheet.tsx");
/* harmony import */ var _chrome_services_utils_oauthSignIn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../chrome-services/utils/oauthSignIn */ "./src/chrome-services/utils/oauthSignIn.ts");
/* harmony import */ var _utils_compareArrays__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/compareArrays */ "./src/utils/compareArrays.ts");
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/logger */ "./src/utils/logger.ts");





//window.alert('background script loaded');
chrome.runtime.onConnect.addListener(function (port) {
    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('checking access token');
    port.onMessage.addListener(function (msg) {
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('port message', msg);
        if (msg.message === 'getAuthToken') {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('getAuthToken message recieved');
            (0,_chrome_services__WEBPACK_IMPORTED_MODULE_0__.getAccessToken)().then((token) => {
                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('port token', token);
                port.postMessage({ token: token });
            }).catch(() => {
                var _a, _b;
                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('port token', 'none');
                chrome.scripting.executeScript({
                    target: { tabId: ((_b = (_a = port.sender) === null || _a === void 0 ? void 0 : _a.tab) === null || _b === void 0 ? void 0 : _b.id) || 0 },
                    func: () => {
                        window.confirm('You need an auth token! Log back in?');
                    }
                }).then((response) => {
                    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('im a genius', response);
                    (0,_chrome_services_utils_oauthSignIn__WEBPACK_IMPORTED_MODULE_2__.launchWebAuthFlow)(true).then((cookie) => {
                        var _a, _b;
                        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('cookie', cookie);
                        chrome.runtime.reload();
                        chrome.scripting.executeScript({
                            target: { tabId: ((_b = (_a = port.sender) === null || _a === void 0 ? void 0 : _a.tab) === null || _b === void 0 ? void 0 : _b.id) || 0 },
                            func: () => {
                                window.location.reload();
                            }
                        });
                    });
                });
            });
        }
        else if (msg.message === 'fetchSpreadsheetUrl') {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('fetchSpreadsheetUrl message recieved');
            (0,_chrome_services__WEBPACK_IMPORTED_MODULE_0__.fetchSpreadsheetUrl)().then((spreadsheetUrl) => {
                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('port spreadsheetUrl', spreadsheetUrl);
                port.postMessage({ spreadsheetUrl: spreadsheetUrl });
            });
        }
        else if (msg.message === 'querySheet') {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('querySheet message recieved');
            (0,_chrome_services__WEBPACK_IMPORTED_MODULE_0__.getAccessToken)().then((token) => {
                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('token', token);
                (0,_chrome_services__WEBPACK_IMPORTED_MODULE_0__.fetchSpreadsheetUrl)().then((spreadsheetUrl) => {
                    (0,_chrome_services_querySheet__WEBPACK_IMPORTED_MODULE_1__.query)(spreadsheetUrl, token, msg.list).then((response) => {
                        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('response', response);
                        const responseArray = (0,_utils_compareArrays__WEBPACK_IMPORTED_MODULE_3__.compareArrays)(msg.list, response.table.rows);
                        port.postMessage({ reason: 'querySheet', response: responseArray });
                    });
                });
            }).catch((error) => {
                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('error', error);
                port.postMessage({ reason: 'querySheet', response: error });
            });
        }
        else if (msg.message === 'sendLoginNotification') {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('sendLoginNotification message recieved');
        }
    });
    port.onDisconnect.addListener(function () {
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('port disconnected');
    });
});
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.message === 'addWorkToSheet') {
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('addWorkToSheet message recieved');
        (0,_chrome_services__WEBPACK_IMPORTED_MODULE_0__.getAccessToken)().then((token) => {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('token', token);
            (0,_chrome_services__WEBPACK_IMPORTED_MODULE_0__.fetchSpreadsheetUrl)().then((spreadsheetUrl) => {
                (0,_chrome_services__WEBPACK_IMPORTED_MODULE_0__.addWorkToSheet)(spreadsheetUrl, token, msg.work).then((response) => {
                    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('response', response);
                    sendResponse({ response: response });
                });
            });
        });
    }
});
chrome.storage.onChanged.addListener((changes) => {
    if (changes.spreadsheetUrl) {
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__["default"])('spreadsheetUrl changed', changes.spreadsheetUrl);
        chrome.runtime.sendMessage({ message: "spreadsheetUrlChanged", newUrl: changes.spreadsheetUrl.newValue });
    }
});
/*chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (
        changeInfo.status === 'complete' &&
        tab.url?.includes('archiveofourown.org')
    ) {
        try {
            await chrome.scripting
                .insertCSS({
                    target: { tabId: tabId, allFrames: true },
                    files: ['./js/content_script.css'],
                })
                .then(() => {
                    log('content_script.css injected');
                });
        } catch (error) {
            log('Error in insertCSS:', error);
        }
    }
});

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ isLoggedIn: false });
});

chrome.storage.onChanged.addListener(() => {
    chrome.storage.sync.get(["isLoggedIn"], (result) => {
        console.log("isLoggedIn: ", result.isLoggedIn);
    });
});

chrome.tabs.onUpdated.addListener((tab) => {
    chrome.runtime.onMessage.addListener((isLoaded, sender, sendResponse) => {
        if (isLoaded) {
            (async () => {
                const response = await chrome.tabs.sendMessage(tab, { type: "getLoginStatus" });
                log("response", response);
            })();
        }
    });
});


async function getURL() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true, url: "*://*.archiveofourown.org/*" });
    const activeTab = tabs[0];
    if (!activeTab) {
        return;
    }
    const url = activeTab.url;
    log('url', url);
    return url;
}



            //var port = chrome.tabs.connect(id, { name: 'ao3' });
            //port.postMessage({ url: url });
            //port.onMessage.addListener(function (msg) {
            //    log('listener: msg', msg);
            //    if (msg.type === 'ao3') {
            //        log('listener: msg', msg);
            //        chrome.storage.sync.set({ isLoggedIn: msg.isLoggedIn });
            //    }
            //});



chrome.runtime.onMessage.addListener(async function (buttonClicked, sender, sendResponse) {
    console.log(buttonClicked.reason);
    if (buttonClicked.reason === "login") {
        console.log("login heard");
        try {
            await userLogin();
            console.log("Authentication successful");
            sendResponse({ success: true });
        } catch (error) {
            console.log("Authentication failed: ", error);
            sendResponse({ success: false, error: error });
        }
        return true; // Return true to indicate that sendResponse will be used asynchronously
      } else if (buttonClicked.reason === "logout") {
        try {
            chrome.identity.removeCachedAuthToken({ token: buttonClicked.reason}, () => {
                fetch(
                    "https://accounts.google.com/o/oauth2/revoke?token=" + buttonClicked.token,
                    { method: "GET" }
                ).then((response) => {
                    console.log("logout response", response);
                });
            });
            chrome.storage.sync.set({ isLoggedIn: false });
            sendResponse({ success: true });
        } catch (error) {
            console.log("Error in logout:", error);
            sendResponse({ success: false, error: error });
        }
        return true; // Return true to indicate that sendResponse will be used asynchronously
      }
    });

chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log("storage changed");
    //const loginStatus = getLoginStatus();
    for (const key in changes) {
        const storageChange = changes[key];
        console.log(storageChange);
    }
});
*/

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7O0FBSWY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsZUFBZTtBQUMxQyxVQUFVO0FBQ1Y7QUFDQSwyQkFBMkIsOEJBQThCO0FBQ3pEO0FBQ0EscUJBQXFCO0FBQ3JCLFFBQVE7QUFDUjtBQUNBLG9EQUFvRCw0QkFBNEI7QUFDaEY7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixzQ0FBc0MsbUJBQW1CO0FBQ3pELDJCQUEyQixlQUFlO0FBQzFDLFVBQVU7QUFDVjtBQUNBLDJCQUEyQiw4QkFBOEI7QUFDekQ7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY2hyb21lLXNlcnZpY2VzL2FjY2Vzc1Rva2VuLnRzeCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jaHJvbWUtc2VydmljZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY2hyb21lLXNlcnZpY2VzL3F1ZXJ5U2hlZXQudHN4Iiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2Nocm9tZS1zZXJ2aWNlcy9zcHJlYWRzaGVldC50c3giLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY2hyb21lLXNlcnZpY2VzL3V0aWxzL2FkZFdvcmtUb1NoZWV0LnRzeCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jaHJvbWUtc2VydmljZXMvdXRpbHMvY29va2llcy50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jaHJvbWUtc2VydmljZXMvdXRpbHMvZ2V0U2hlZXRJZC50c3giLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY2hyb21lLXNlcnZpY2VzL3V0aWxzL29hdXRoU2lnbkluLnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL3V0aWxzL2NvbXBhcmVBcnJheXMudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvdXRpbHMvbG9nZ2VyLnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvYmFja2dyb3VuZC9iYWNrZ3JvdW5kLnRzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IGxvZyBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuLyoqIGdldCB0b2tlbiBmcm9tIGlkZW50aXR5IEFQSVxuICpcbiAqIEBwYXJhbSBpbnRlcmFjdGl2ZSA9IHRydWUgaWYgeW91IHdhbnQgdG8gYXNrIHRoZSB1c2VyIGZvciBwZXJtaXNzaW9uIHRvIGFjY2VzcyB0aGVpciBnb29nbGUgYWNjb3VudFxuICogQHJldHVybnMgdG9rZW4gb3IgZW1wdHkgc3RyaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaE5ld0FjY2Vzc1Rva2VuKGludGVyYWN0aXZlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGlmIChpbnRlcmFjdGl2ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy9nZXR0aW5nIHRva2VuIGludGVyYWN0aXZlbHlcbiAgICAgICAgICAgIGxvZygnZ2V0dGluZyB0b2tlbiBpbnRlcmFjdGl2ZWx5Jyk7XG4gICAgICAgICAgICBjaHJvbWUuaWRlbnRpdHkuZ2V0QXV0aFRva2VuKHsgaW50ZXJhY3RpdmU6IHRydWUgfSwgKHRva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLmlkZW50aXR5LmNsZWFyQWxsQ2FjaGVkQXV0aFRva2VucygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2coJ0NsZWFyZWQgYWxsIGNhY2hlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgnJyk7IC8vIFRPRE86IG1ha2UgYW4gYWN0dWFsIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZ2V0IHRva2VuIGZyb20gaWRlbnRpdHkgQVBJXG4gICAgICAgICAgICBjaHJvbWUuaWRlbnRpdHkuZ2V0QXV0aFRva2VuKHsgaW50ZXJhY3RpdmU6IGZhbHNlIH0sICh0b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNocm9tZS5pZGVudGl0eS5jbGVhckFsbENhY2hlZEF1dGhUb2tlbnMoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nKCdDbGVhcmVkIGFsbCBjYWNoZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoJycpOyAvLyBUT0RPOiBtYWtlIGFuIGFjdHVhbCBlcnJvclxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLy9yZW1vdmUgdG9rZW4gZnJvbSBjaHJvbWUgc3RvcmFnZSBhbmQgaWRlbnRpdHkgQVBJXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlVG9rZW4oKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSB5aWVsZCBnZXRBY2Nlc3NUb2tlbigpO1xuICAgICAgICBpZiAodG9rZW4gPT09ICcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGdldHRpbmcgdG9rZW4nKTtcbiAgICAgICAgfVxuICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnJlbW92ZShbJ2F1dGhUb2tlbiddKTtcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBpZGVudGl0eSB0b2tlbnNcbiAgICAgICAgY2hyb21lLmNvb2tpZXMucmVtb3ZlKHtcbiAgICAgICAgICAgIG5hbWU6ICdhdXRoVG9rZW4nLFxuICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcmNoaXZlb2ZvdXJvd24ub3JnJyxcbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgbG9nKCdSZW1vdmVkIGNvb2tpZScpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8qKlxuICogUmV0cmlldmVzIHRoZSBhY2Nlc3MgdG9rZW4gZnJvbSBhIGNvb2tpZS5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBhY2Nlc3MgdG9rZW4gc3RyaW5nLlxuICogQHRocm93cyBBbiBlcnJvciBpZiB0aGUgYWNjZXNzIHRva2VuIGNhbm5vdCBiZSByZXRyaWV2ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY2Nlc3NUb2tlbigpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY2hyb21lLmNvb2tpZXMuZ2V0KHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnYXV0aFRva2VuJyxcbiAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL2FyY2hpdmVvZm91cm93bi5vcmcnLFxuICAgICAgICAgICAgfSwgKGNvb2tpZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjb29raWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCdBY2Nlc3MgdG9rZW4gY29va2llLnZhbHVlOiAnLCBjb29raWUudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNvb2tpZS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoJ0Vycm9yIGdldHRpbmcgdG9rZW4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNBY2Nlc3NUb2tlblZhbGlkKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0geWllbGQgZ2V0QWNjZXNzVG9rZW4oKTtcbiAgICAgICAgaWYgKHRva2VuID09ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG59XG4iLCJleHBvcnQgKiBmcm9tICcuL2FjY2Vzc1Rva2VuJztcbmV4cG9ydCAqIGZyb20gJy4vc3ByZWFkc2hlZXQnO1xuZXhwb3J0ICogZnJvbSAnLi91dGlscy9hZGRXb3JrVG9TaGVldCc7XG5leHBvcnQgKiBmcm9tICcuL3V0aWxzL2Nvb2tpZXMnO1xuZXhwb3J0ICogZnJvbSAnLi91dGlscy9nZXRTaGVldElkJztcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IGxvZyBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuLy8gcXVlcnkgdGhlIHNwcmVhZHNoZWV0IGZvciB0aGUgd29ya3MgaW4gdGhlIHNlYXJjaExpc3RcbmV4cG9ydCBmdW5jdGlvbiBxdWVyeShzcHJlYWRzaGVldFVybCwgYXV0aFRva2VuLCBzZWFyY2hMaXN0KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgbGV0IHF1ZXJ5ID0gYHNlbGVjdCBBIHdoZXJlIEEgbWF0Y2hlc2A7XG4gICAgICAgIHNlYXJjaExpc3QuZm9yRWFjaCgod29ya0lkKSA9PiB7XG4gICAgICAgICAgICBpZiAod29ya0lkID09PSBzZWFyY2hMaXN0WzBdKSB7XG4gICAgICAgICAgICAgICAgcXVlcnkgKz0gYCAnJHt3b3JrSWR9J2A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBxdWVyeSArPSBgIG9yIEEgbWF0Y2hlcyAnJHt3b3JrSWR9J2A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBlbmNvZGVVUklDb21wb25lbnQocXVlcnkpO1xuICAgICAgICBsb2coJ3F1ZXJ5JywgZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5KSk7XG4gICAgICAgIHJldHVybiBmZXRjaChgaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvJHtzcHJlYWRzaGVldFVybC5zcGxpdCgnLycpWzVdfS9ndml6L3RxP3RxPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5KX0mYWNjZXNzX3Rva2VuPSR7YXV0aFRva2VufWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7YXV0aFRva2VufWAsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KS50aGVuKChyZXMpID0+IHJlcy50ZXh0KCkpLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgbG9nKCdxdWVyeScsICdyZXMnLCByZXMpO1xuICAgICAgICAgICAgY29uc3QganNvbiA9IEpTT04ucGFyc2UocmVzLnN1YnN0cmluZyg0NywgcmVzLmxlbmd0aCAtIDIpKTtcbiAgICAgICAgICAgIGxvZygncXVlcnknLCAnanNvbicsIGpzb24pO1xuICAgICAgICAgICAgcmV0dXJuIGpzb247XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBnZXRBY2Nlc3NUb2tlbiB9IGZyb20gJy4nO1xuaW1wb3J0IGxvZyBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuLyoqXG4gKlxuICogQHJldHVybnMgdXNlcidzIHNwcmVhZHNoZWV0IFVSTFxuICovXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hTcHJlYWRzaGVldFVybCgpIHtcbiAgICBsb2coJ2dldHRpbmcgc3ByZWFkc2hlZXQgVVJMJyk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgLy8gY2hlY2sgZm9yIGEgc3RvcmVkIHNwcmVhZHNoZWV0IFVSTFxuICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChbJ3NwcmVhZHNoZWV0VXJsJ10sIChyZXN1bHQpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGxvZygnZmV0Y2hTcHJlYWRTaGVldFVybCByZXN1bHQ6ICcsIHJlc3VsdCk7XG4gICAgICAgICAgICBjb25zdCBzcHJlYWRzaGVldFVybCA9IHJlc3VsdC5zcHJlYWRzaGVldFVybDtcbiAgICAgICAgICAgIGxvZygnc3ByZWFkc2hlZXRVcmwgdHlwZTogJywgdHlwZW9mIHNwcmVhZHNoZWV0VXJsKTtcbiAgICAgICAgICAgIC8vIGRvZXMgdGhlIHVzZXIgaGF2ZSBhIHNwcmVhZHNoZWV0IFVSTCBhbHJlYWR5P1xuICAgICAgICAgICAgaWYgKHNwcmVhZHNoZWV0VXJsICE9PSB1bmRlZmluZWQgJiYgT2JqZWN0LmtleXMoc3ByZWFkc2hlZXRVcmwpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGxvZygndXNlciBoYXMgc3ByZWFkc2hlZXQgVVJMOiAnLCBzcHJlYWRzaGVldFVybCk7XG4gICAgICAgICAgICAgICAgbG9nKCdzcHJlYWRzaGVldElEOiAnLCBTdHJpbmcoc3ByZWFkc2hlZXRVcmwpLnNwbGl0KCcvJylbNV0pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoc3ByZWFkc2hlZXRVcmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nKFwidXNlciBkb2Vzbid0IGhhdmUgc3ByZWFkc2hlZXQgVVJMLCBjcmVhdGluZyBzcHJlYWRzaGVldFwiKTtcbiAgICAgICAgICAgICAgICAvL2dldCBhdXRoVG9rZW5cbiAgICAgICAgICAgICAgICBjb25zdCB0b2tlbiA9IHlpZWxkIGdldEFjY2Vzc1Rva2VuKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgnRXJyb3IgZ2V0dGluZyB0b2tlbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jcmVhdGUgc3ByZWFkc2hlZXRcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgY3JlYXRlU3ByZWFkc2hlZXQodG9rZW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigodXJsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHVybCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbi8qKlxuICpcbiAqIEBwYXJhbSB0b2tlbiB1c2VyJ3MgYXV0aCB0b2tlblxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNwcmVhZHNoZWV0KHRva2VuKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3Qgc2hlZXRMYXlvdXQgPSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7IHRpdGxlOiAnQU8zRScgfSxcbiAgICAgICAgICAgIG5hbWVkUmFuZ2VzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lZFJhbmdlSWQ6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1dvcmtJRCcsXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVldElkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDb2x1bW5JbmRleDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZENvbHVtbkluZGV4OiAxXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZWRSYW5nZUlkOiAnMScsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICd0aXRsZScsXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVldElkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDb2x1bW5JbmRleDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZENvbHVtbkluZGV4OiAyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZWRSYW5nZUlkOiAnMicsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdhdXRob3JzJyxcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWV0SWQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydENvbHVtbkluZGV4OiAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kQ29sdW1uSW5kZXg6IDNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lZFJhbmdlSWQ6ICczJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2ZhbmRvbXMnLFxuICAgICAgICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlZXRJZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Q29sdW1uSW5kZXg6IDMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRDb2x1bW5JbmRleDogNFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWVkUmFuZ2VJZDogJzQnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAncmVsYXRpb25zaGlwcycsXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVldElkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDb2x1bW5JbmRleDogNCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZENvbHVtbkluZGV4OiA1XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZWRSYW5nZUlkOiAnNScsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICd0YWdzJyxcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWV0SWQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydENvbHVtbkluZGV4OiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kQ29sdW1uSW5kZXg6IDZcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lZFJhbmdlSWQ6ICc2JyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2Rlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWV0SWQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydENvbHVtbkluZGV4OiA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kQ29sdW1uSW5kZXg6IDdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lZFJhbmdlSWQ6ICc3JyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3dvcmRDb3VudCcsXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVldElkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDb2x1bW5JbmRleDogNyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZENvbHVtbkluZGV4OiA4XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZWRSYW5nZUlkOiAnOCcsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjaGFwdGVyQ291bnQnLFxuICAgICAgICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlZXRJZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Q29sdW1uSW5kZXg6IDgsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRDb2x1bW5JbmRleDogOVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWVkUmFuZ2VJZDogJzknLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnc3RhdHVzJyxcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWV0SWQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydENvbHVtbkluZGV4OiA5LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kQ29sdW1uSW5kZXg6IDEwXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZWRSYW5nZUlkOiAnMTAnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAncmF0aW5nJyxcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWV0SWQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydENvbHVtbkluZGV4OiAxMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZENvbHVtbkluZGV4OiAxMVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHNoZWV0czoge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdBY2Nlc3MgV29ya3MnLFxuICAgICAgICAgICAgICAgICAgICBzaGVldElkOiAwLFxuICAgICAgICAgICAgICAgICAgICAvKmdyaWRQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dDb3VudDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbkNvdW50OiAxMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbkdyb3VwQ29udHJvbEFmdGVyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHByb3RlY3RlZFJhbmdlczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm90ZWN0ZWRSYW5nZUlkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQcm90ZWN0ZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2FybmluZ09ubHk6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Um93OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDb2x1bW46IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dEYXRhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyRW50ZXJlZFZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiAnV29yayBJRCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyRW50ZXJlZEZvcm1hdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Rm9ybWF0OiB7IGJvbGQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyRW50ZXJlZFZhbHVlOiB7IHN0cmluZ1ZhbHVlOiAnVGl0bGUnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRGb3JtYXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEZvcm1hdDogeyBib2xkOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRWYWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdWYWx1ZTogJ0F1dGhvcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRGb3JtYXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEZvcm1hdDogeyBib2xkOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRWYWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdWYWx1ZTogJ0ZhbmRvbXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRGb3JtYXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEZvcm1hdDogeyBib2xkOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRWYWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdWYWx1ZTogJ1JlbGF0aW9uc2hpcHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRGb3JtYXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEZvcm1hdDogeyBib2xkOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRWYWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdWYWx1ZTogJ1RhZ3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRGb3JtYXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEZvcm1hdDogeyBib2xkOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRWYWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdWYWx1ZTogJ0Rlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkRm9ybWF0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRGb3JtYXQ6IHsgYm9sZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkVmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nVmFsdWU6ICdXb3JkIENvdW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkRm9ybWF0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRGb3JtYXQ6IHsgYm9sZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkVmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nVmFsdWU6ICdDaGFwdGVyIENvdW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkRm9ybWF0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRGb3JtYXQ6IHsgYm9sZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkVmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nVmFsdWU6ICdTdGF0dXMnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyRW50ZXJlZEZvcm1hdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Rm9ybWF0OiB7IGJvbGQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyRW50ZXJlZFZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiAnUmF0aW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkRm9ybWF0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRGb3JtYXQ6IHsgYm9sZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7IHN0YXJ0Q29sdW1uOiAwLCBjb2x1bW5NZXRhZGF0YTogeyBwaXhlbFNpemU6IDEwMCB9IH0sXG4gICAgICAgICAgICAgICAgICAgIHsgc3RhcnRDb2x1bW46IDEsIGNvbHVtbk1ldGFkYXRhOiB7IHBpeGVsU2l6ZTogMzAwIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgeyBzdGFydENvbHVtbjogMiwgY29sdW1uTWV0YWRhdGE6IHsgcGl4ZWxTaXplOiAyMDAgfSB9LFxuICAgICAgICAgICAgICAgICAgICB7IHN0YXJ0Q29sdW1uOiAzLCBjb2x1bW5NZXRhZGF0YTogeyBwaXhlbFNpemU6IDIwMCB9IH0sXG4gICAgICAgICAgICAgICAgICAgIHsgc3RhcnRDb2x1bW46IDQsIGNvbHVtbk1ldGFkYXRhOiB7IHBpeGVsU2l6ZTogMTAwIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgeyBzdGFydENvbHVtbjogNSwgY29sdW1uTWV0YWRhdGE6IHsgcGl4ZWxTaXplOiAxMDAgfSB9LFxuICAgICAgICAgICAgICAgICAgICB7IHN0YXJ0Q29sdW1uOiA2LCBjb2x1bW5NZXRhZGF0YTogeyBwaXhlbFNpemU6IDEwMCB9IH0sIC8vc3RhdHVzXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHVybCA9ICdodHRwczovL3NoZWV0cy5nb29nbGVhcGlzLmNvbS92NC9zcHJlYWRzaGVldHMnO1xuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiAnQmVhcmVyICcgKyB0b2tlbixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzaGVldExheW91dCksXG4gICAgICAgIH07XG4gICAgICAgIGxvZygnb3B0aW9uczogJywgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXG4gICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGxvZygnUmVzcG9uc2Ugc3RhdHVzOicsIHJlc3BvbnNlLnN0YXR1cyk7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGxvZygnU3VjY2VzczonLCBkYXRhKTtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgc3ByZWFkc2hlZXRVcmw6IGRhdGEuc3ByZWFkc2hlZXRVcmwgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5zcHJlYWRzaGVldFVybDtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIGxvZygnRXJyb3IgY3JlYXRpbmcgc3ByZWFkc2hlZXQ6JywgZXJyb3IpO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgbG9nIGZyb20gJy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQgeyBnZXRTaGVldElkIH0gZnJvbSAnLi9nZXRTaGVldElkJztcbmV4cG9ydCBjb25zdCBhZGRXb3JrVG9TaGVldCA9IChzcHJlYWRzaGVldFVybCwgYXV0aFRva2VuLCB3b3JrKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICA7XG4gICAgbG9nKCdhZGRXb3JrVG9TaGVldCcsIHdvcmspO1xuICAgIGNvbnN0IHNoZWV0SWQgPSB5aWVsZCBnZXRTaGVldElkKHNwcmVhZHNoZWV0VXJsLCBhdXRoVG9rZW4pO1xuICAgIGxvZygnYWRkV29ya1RvU2hlZXQnLCAnc2hlZXRJZCcsIHNoZWV0SWQpO1xuICAgIHJldHVybiBmZXRjaChgaHR0cHM6Ly9zaGVldHMuZ29vZ2xlYXBpcy5jb20vdjQvc3ByZWFkc2hlZXRzLyR7c3ByZWFkc2hlZXRVcmwuc3BsaXQoJy8nKVs1XX06YmF0Y2hVcGRhdGVgLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2F1dGhUb2tlbn1gLFxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICByZXF1ZXN0czogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYXBwZW5kRGltZW5zaW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVldElkOiBzaGVldElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGltZW5zaW9uOiAnUk9XUycsXG4gICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGg6IDEsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYXBwZW5kQ2VsbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWV0SWQ6IHNoZWV0SWQsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB2YWx1ZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdXNlckVudGVyZWRWYWx1ZTogeyBudW1iZXJWYWx1ZTogd29yay53b3JrSWQgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB1c2VyRW50ZXJlZFZhbHVlOiB7IHN0cmluZ1ZhbHVlOiB3b3JrLnRpdGxlIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdXNlckVudGVyZWRWYWx1ZTogeyBzdHJpbmdWYWx1ZTogd29yay5hdXRob3IudG9TdHJpbmcoKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkRm9ybWF0OiB7IHdyYXBTdHJhdGVneTogJ1dSQVAnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdXNlckVudGVyZWRWYWx1ZTogeyBzdHJpbmdWYWx1ZTogd29yay5mYW5kb21zLnRvU3RyaW5nKCkgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyRW50ZXJlZEZvcm1hdDogeyB3cmFwU3RyYXRlZ3k6ICdXUkFQJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHVzZXJFbnRlcmVkVmFsdWU6IHsgc3RyaW5nVmFsdWU6IHdvcmsucmVsYXRpb25zaGlwcy50b1N0cmluZygpIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRGb3JtYXQ6IHsgd3JhcFN0cmF0ZWd5OiAnV1JBUCcgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB1c2VyRW50ZXJlZFZhbHVlOiB7IHN0cmluZ1ZhbHVlOiB3b3JrLnRhZ3MudG9TdHJpbmcoKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkRm9ybWF0OiB7IHdyYXBTdHJhdGVneTogJ1dSQVAnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdXNlckVudGVyZWRWYWx1ZTogeyBzdHJpbmdWYWx1ZTogd29yay5kZXNjcmlwdGlvbiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkRm9ybWF0OiB7IHdyYXBTdHJhdGVneTogJ1dSQVAnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdXNlckVudGVyZWRWYWx1ZTogeyBudW1iZXJWYWx1ZTogd29yay53b3JkQ291bnQgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB1c2VyRW50ZXJlZFZhbHVlOiB7IG51bWJlclZhbHVlOiB3b3JrLnRvdGFsQ2hhcHRlcnMgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB1c2VyRW50ZXJlZFZhbHVlOiB7IHN0cmluZ1ZhbHVlOiB3b3JrLnN0YXR1cyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHVzZXJFbnRlcmVkVmFsdWU6IHsgbnVtYmVyVmFsdWU6IHdvcmsucmF0aW5nIH0gfSwgLy8xMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzOiAnKicsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYXV0b1Jlc2l6ZURpbWVuc2lvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVldElkOiBzaGVldElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbjogJ1JPV1MnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgaW5jbHVkZVNwcmVhZHNoZWV0SW5SZXNwb25zZTogZmFsc2VcbiAgICAgICAgfSksXG4gICAgfSkudGhlbigocmVzKSA9PiByZXMuanNvbigpKTtcbn0pO1xuIiwiaW1wb3J0IGxvZyBmcm9tIFwiLi4vLi4vdXRpbHMvbG9nZ2VyXCI7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29va2llKGNvb2tpZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNocm9tZS5jb29raWVzLnNldChjb29raWUsIChjb29raWUpID0+IHtcbiAgICAgICAgICAgIGlmIChjb29raWUpIHtcbiAgICAgICAgICAgICAgICBsb2coJ2NyZWF0ZUNvb2tpZSBjb29raWUnLCBjb29raWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzb2x2ZShjb29raWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb29raWUoY29va2llTmFtZSwgdXJsKSB7XG4gICAgbG9nKCdnZXR0aW5nIGNvb2tpZScsIGNvb2tpZU5hbWUsIHVybCk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNocm9tZS5jb29raWVzLmdldCh7IG5hbWU6IGNvb2tpZU5hbWUsIHVybDogdXJsIH0sIChjb29raWUpID0+IHtcbiAgICAgICAgICAgIGlmIChjb29raWUpIHtcbiAgICAgICAgICAgICAgICBsb2coJ2dldENvb2tpZSBjb29raWUnLCBjb29raWUpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoY29va2llKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IGxvZyBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuLy8gR2V0IHRoZSBzaGVldElkIGZyb20gdGhlIHNwcmVhZHNoZWV0VXJsXG4vLyBUT0RPOiBzYXZlIHRoZSBzaGVldElkIGluIHNlc3Npb24gc3RvcmFnZVxuZXhwb3J0IGNvbnN0IGdldFNoZWV0SWQgPSAoc3ByZWFkc2hlZXRVcmwsIGF1dGhUb2tlbikgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgbG9nKCdnZXRTaGVldElkOiAnLCBzcHJlYWRzaGVldFVybCk7XG4gICAgcmV0dXJuIGZldGNoKGBodHRwczovL3NoZWV0cy5nb29nbGVhcGlzLmNvbS92NC9zcHJlYWRzaGVldHMvJHtzcHJlYWRzaGVldFVybC5zcGxpdCgnLycpWzVdfWAsIHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHthdXRoVG9rZW59YCxcbiAgICAgICAgfSxcbiAgICB9KS50aGVuKChyZXMpID0+IHJlcy5qc29uKCkpLnRoZW4oKHJlcykgPT4gcmVzLnNoZWV0c1swXS5wcm9wZXJ0aWVzLnNoZWV0SWQpO1xufSk7XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCBsb2cgZnJvbSBcIi4uLy4uL3V0aWxzL2xvZ2dlclwiO1xuaW1wb3J0IHsgY3JlYXRlQ29va2llIH0gZnJvbSBcIi4vY29va2llc1wiO1xuY29uc3QgcmVkaXJlY3RVUkwgPSBjaHJvbWUuaWRlbnRpdHkuZ2V0UmVkaXJlY3RVUkwoKTtcbmNvbnN0IHsgb2F1dGgyIH0gPSBjaHJvbWUucnVudGltZS5nZXRNYW5pZmVzdCgpO1xuaWYgKCFvYXV0aDIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBuZWVkIHRvIHNwZWNpZnkgb2F1dGgyIGluIG1hbmlmZXN0Lmpzb24nKTtcbn1cbmNvbnN0IGNsaWVudElkID0gb2F1dGgyLmNsaWVudF9pZDtcbmNvbnN0IGF1dGhQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHtcbiAgICAvL2FjY2Vzc190eXBlOiAnb2ZmbGluZScsXG4gICAgY2xpZW50X2lkOiBjbGllbnRJZCxcbiAgICByZXNwb25zZV90eXBlOiAndG9rZW4nLFxuICAgIHJlZGlyZWN0X3VyaTogcmVkaXJlY3RVUkwsXG4gICAgc2NvcGU6IFsnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC9zcHJlYWRzaGVldHMnXS5qb2luKCcgJyksXG59KTtcbmNvbnN0IGF1dGhVUkwgPSBgaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tL28vb2F1dGgyL2F1dGg/JHthdXRoUGFyYW1zLnRvU3RyaW5nKCl9YDtcbi8vRklYOiBpbnRlcmFjdGl2ZSBjYW4ndCBiZSBmYWxzZVxuZXhwb3J0IGZ1bmN0aW9uIGxhdW5jaFdlYkF1dGhGbG93KGludGVyYWN0aXZlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY2hyb21lLmlkZW50aXR5LmxhdW5jaFdlYkF1dGhGbG93KHsgdXJsOiBhdXRoVVJMLCBpbnRlcmFjdGl2ZSB9LCAoKHJlc3BvbnNlVXJsKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBsb2coJ3Jlc3BvbnNlVXJsJywgcmVzcG9uc2VVcmwpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChyZXNwb25zZVVybCk7XG4gICAgICAgICAgICBsb2coJ3VybCcsIHVybCk7XG4gICAgICAgICAgICBjb25zdCB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHVybC5oYXNoLnNsaWNlKDEpKTtcbiAgICAgICAgICAgIGxvZygndXJsUGFyYW1zJywgdXJsUGFyYW1zKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5mcm9tRW50cmllcyh1cmxQYXJhbXMuZW50cmllcygpKTsgLy8gYWNjZXNzX3Rva2VuLCBleHBpcmVzX2luXG4gICAgICAgICAgICBwYXJhbXMuZXhwaXJlc19pbiA9ICc0MzE5OSc7IC8vIDEyIGhvdXJzXG4gICAgICAgICAgICBsb2coJ3BhcmFtcycsIHBhcmFtcyk7XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IHBhcmFtcy5hY2Nlc3NfdG9rZW47XG4gICAgICAgICAgICBjb25zdCBjb29raWUgPSB5aWVsZCBjcmVhdGVDb29raWUoe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdhdXRoVG9rZW4nLFxuICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vd3d3LmFyY2hpdmVvZm91cm93bi5vcmcvJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdG9rZW4sXG4gICAgICAgICAgICAgICAgZXhwaXJhdGlvbkRhdGU6IERhdGUubm93KCkgLyAxMDAwICsgNDMxOTksXG4gICAgICAgICAgICAgICAgZG9tYWluOiAnLmFyY2hpdmVvZm91cm93bi5vcmcnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsb2coJ2Nvb2tpZScsIGNvb2tpZSk7XG4gICAgICAgICAgICBpZiAoY29va2llKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoY29va2llKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSkpO1xuICAgIH0pO1xufVxuLy9mZXRjaChgaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vb2F1dGgyL3YxL3VzZXJpbmZvP2FsdD1qc29uJmFjY2Vzc190b2tlbj0ke3BhcmFtcy5hY2Nlc3NfdG9rZW59YCwge1xuLy8gICAgbWV0aG9kOiAnR0VUJyxcbi8vICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuLy99KS50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSkudGhlbigoZGF0YSkgPT4ge1xuLy8gICAgYWxlcnQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuLy99KTtcbmZ1bmN0aW9uIHJlZnJlc2hUb2tlbihyZWZyZXNoVG9rZW4pIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IHlpZWxkIGZldGNoKCdodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjQvdG9rZW4nLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIGNsaWVudF9pZDogY2xpZW50SWQsXG4gICAgICAgICAgICAgICAgcmVmcmVzaF90b2tlbjogcmVmcmVzaFRva2VuLFxuICAgICAgICAgICAgICAgIGdyYW50X3R5cGU6ICdyZWZyZXNoX3Rva2VuJyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgbG9nKCdyZWZyZXNoVG9rZW4gZGF0YScsIGRhdGEpO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9KTtcbn1cbiIsImltcG9ydCBsb2cgZnJvbSAnLi9sb2dnZXInO1xuLy9yZXR1cm5zIGJvb2wgZm9yIGVhY2ggaXRlbSBpbiBzZWFyY2hMaXN0IGFzIGFuIGFycmF5XG5leHBvcnQgZnVuY3Rpb24gY29tcGFyZUFycmF5cyhzZWFyY2hMaXN0LCByZXNwb25zZSkge1xuICAgIHZhciBib29sQXJyYXkgPSBuZXcgQXJyYXkoMjApLmZpbGwoZmFsc2UpO1xuICAgIGxvZygnc2VhcmNoTGlzdCcsIHNlYXJjaExpc3QpO1xuICAgIGxvZygncmVzcG9uc2UnLCByZXNwb25zZSk7XG4gICAgc2VhcmNoTGlzdC5mb3JFYWNoKChzZWFyY2hJdGVtKSA9PiB7XG4gICAgICAgIHJlc3BvbnNlLmZvckVhY2goKHJlc3BvbnNlSXRlbSkgPT4ge1xuICAgICAgICAgICAgaWYgKHNlYXJjaEl0ZW0gPT09IHJlc3BvbnNlSXRlbS5jWzBdLmYpIHtcbiAgICAgICAgICAgICAgICBib29sQXJyYXlbc2VhcmNoTGlzdC5pbmRleE9mKHNlYXJjaEl0ZW0pXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2Uuc3BsaWNlKHJlc3BvbnNlLmluZGV4T2YocmVzcG9uc2VJdGVtKSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBib29sQXJyYXk7XG59XG4iLCJjb25zdCBsb2cgPSAoZnVuY3Rpb24gKGVudmlyb25tZW50KSB7XG4gICAgaWYgKGVudmlyb25tZW50ID09PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHsgfTtcbiAgICB9XG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MpO1xuICAgIH07XG59KShwcm9jZXNzLmVudi5OT0RFX0VOVik7XG5leHBvcnQgZGVmYXVsdCBsb2c7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGFkZFdvcmtUb1NoZWV0LCBmZXRjaFNwcmVhZHNoZWV0VXJsLCBnZXRBY2Nlc3NUb2tlbiB9IGZyb20gJy4uL2Nocm9tZS1zZXJ2aWNlcyc7XG5pbXBvcnQgeyBxdWVyeSB9IGZyb20gJy4uL2Nocm9tZS1zZXJ2aWNlcy9xdWVyeVNoZWV0JztcbmltcG9ydCB7IGxhdW5jaFdlYkF1dGhGbG93IH0gZnJvbSAnLi4vY2hyb21lLXNlcnZpY2VzL3V0aWxzL29hdXRoU2lnbkluJztcbmltcG9ydCB7IGNvbXBhcmVBcnJheXMgfSBmcm9tICcuLi91dGlscy9jb21wYXJlQXJyYXlzJztcbmltcG9ydCBsb2cgZnJvbSAnLi4vdXRpbHMvbG9nZ2VyJztcbi8vd2luZG93LmFsZXJ0KCdiYWNrZ3JvdW5kIHNjcmlwdCBsb2FkZWQnKTtcbmNocm9tZS5ydW50aW1lLm9uQ29ubmVjdC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAocG9ydCkge1xuICAgIGxvZygnY2hlY2tpbmcgYWNjZXNzIHRva2VuJyk7XG4gICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBsb2coJ3BvcnQgbWVzc2FnZScsIG1zZyk7XG4gICAgICAgIGlmIChtc2cubWVzc2FnZSA9PT0gJ2dldEF1dGhUb2tlbicpIHtcbiAgICAgICAgICAgIGxvZygnZ2V0QXV0aFRva2VuIG1lc3NhZ2UgcmVjaWV2ZWQnKTtcbiAgICAgICAgICAgIGdldEFjY2Vzc1Rva2VuKCkudGhlbigodG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICBsb2coJ3BvcnQgdG9rZW4nLCB0b2tlbik7XG4gICAgICAgICAgICAgICAgcG9ydC5wb3N0TWVzc2FnZSh7IHRva2VuOiB0b2tlbiB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgICAgIGxvZygncG9ydCB0b2tlbicsICdub25lJyk7XG4gICAgICAgICAgICAgICAgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB7IHRhYklkOiAoKF9iID0gKF9hID0gcG9ydC5zZW5kZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50YWIpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5pZCkgfHwgMCB9LFxuICAgICAgICAgICAgICAgICAgICBmdW5jOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY29uZmlybSgnWW91IG5lZWQgYW4gYXV0aCB0b2tlbiEgTG9nIGJhY2sgaW4/Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsb2coJ2ltIGEgZ2VuaXVzJywgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBsYXVuY2hXZWJBdXRoRmxvdyh0cnVlKS50aGVuKChjb29raWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2coJ2Nvb2tpZScsIGNvb2tpZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaHJvbWUucnVudGltZS5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB7IHRhYklkOiAoKF9iID0gKF9hID0gcG9ydC5zZW5kZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50YWIpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5pZCkgfHwgMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmM6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1zZy5tZXNzYWdlID09PSAnZmV0Y2hTcHJlYWRzaGVldFVybCcpIHtcbiAgICAgICAgICAgIGxvZygnZmV0Y2hTcHJlYWRzaGVldFVybCBtZXNzYWdlIHJlY2lldmVkJyk7XG4gICAgICAgICAgICBmZXRjaFNwcmVhZHNoZWV0VXJsKCkudGhlbigoc3ByZWFkc2hlZXRVcmwpID0+IHtcbiAgICAgICAgICAgICAgICBsb2coJ3BvcnQgc3ByZWFkc2hlZXRVcmwnLCBzcHJlYWRzaGVldFVybCk7XG4gICAgICAgICAgICAgICAgcG9ydC5wb3N0TWVzc2FnZSh7IHNwcmVhZHNoZWV0VXJsOiBzcHJlYWRzaGVldFVybCB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1zZy5tZXNzYWdlID09PSAncXVlcnlTaGVldCcpIHtcbiAgICAgICAgICAgIGxvZygncXVlcnlTaGVldCBtZXNzYWdlIHJlY2lldmVkJyk7XG4gICAgICAgICAgICBnZXRBY2Nlc3NUb2tlbigpLnRoZW4oKHRva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgbG9nKCd0b2tlbicsIHRva2VuKTtcbiAgICAgICAgICAgICAgICBmZXRjaFNwcmVhZHNoZWV0VXJsKCkudGhlbigoc3ByZWFkc2hlZXRVcmwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcXVlcnkoc3ByZWFkc2hlZXRVcmwsIHRva2VuLCBtc2cubGlzdCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZygncmVzcG9uc2UnLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZUFycmF5ID0gY29tcGFyZUFycmF5cyhtc2cubGlzdCwgcmVzcG9uc2UudGFibGUucm93cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKHsgcmVhc29uOiAncXVlcnlTaGVldCcsIHJlc3BvbnNlOiByZXNwb25zZUFycmF5IH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIGxvZygnZXJyb3InLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgcG9ydC5wb3N0TWVzc2FnZSh7IHJlYXNvbjogJ3F1ZXJ5U2hlZXQnLCByZXNwb25zZTogZXJyb3IgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtc2cubWVzc2FnZSA9PT0gJ3NlbmRMb2dpbk5vdGlmaWNhdGlvbicpIHtcbiAgICAgICAgICAgIGxvZygnc2VuZExvZ2luTm90aWZpY2F0aW9uIG1lc3NhZ2UgcmVjaWV2ZWQnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHBvcnQub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG9nKCdwb3J0IGRpc2Nvbm5lY3RlZCcpO1xuICAgIH0pO1xufSk7XG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKG1zZywgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICBpZiAobXNnLm1lc3NhZ2UgPT09ICdhZGRXb3JrVG9TaGVldCcpIHtcbiAgICAgICAgbG9nKCdhZGRXb3JrVG9TaGVldCBtZXNzYWdlIHJlY2lldmVkJyk7XG4gICAgICAgIGdldEFjY2Vzc1Rva2VuKCkudGhlbigodG9rZW4pID0+IHtcbiAgICAgICAgICAgIGxvZygndG9rZW4nLCB0b2tlbik7XG4gICAgICAgICAgICBmZXRjaFNwcmVhZHNoZWV0VXJsKCkudGhlbigoc3ByZWFkc2hlZXRVcmwpID0+IHtcbiAgICAgICAgICAgICAgICBhZGRXb3JrVG9TaGVldChzcHJlYWRzaGVldFVybCwgdG9rZW4sIG1zZy53b3JrKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsb2coJ3Jlc3BvbnNlJywgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMpID0+IHtcbiAgICBpZiAoY2hhbmdlcy5zcHJlYWRzaGVldFVybCkge1xuICAgICAgICBsb2coJ3NwcmVhZHNoZWV0VXJsIGNoYW5nZWQnLCBjaGFuZ2VzLnNwcmVhZHNoZWV0VXJsKTtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyBtZXNzYWdlOiBcInNwcmVhZHNoZWV0VXJsQ2hhbmdlZFwiLCBuZXdVcmw6IGNoYW5nZXMuc3ByZWFkc2hlZXRVcmwubmV3VmFsdWUgfSk7XG4gICAgfVxufSk7XG4vKmNocm9tZS50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcihhc3luYyAodGFiSWQsIGNoYW5nZUluZm8sIHRhYikgPT4ge1xuICAgIGlmIChcbiAgICAgICAgY2hhbmdlSW5mby5zdGF0dXMgPT09ICdjb21wbGV0ZScgJiZcbiAgICAgICAgdGFiLnVybD8uaW5jbHVkZXMoJ2FyY2hpdmVvZm91cm93bi5vcmcnKVxuICAgICkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgY2hyb21lLnNjcmlwdGluZ1xuICAgICAgICAgICAgICAgIC5pbnNlcnRDU1Moe1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHsgdGFiSWQ6IHRhYklkLCBhbGxGcmFtZXM6IHRydWUgfSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsnLi9qcy9jb250ZW50X3NjcmlwdC5jc3MnXSxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCdjb250ZW50X3NjcmlwdC5jc3MgaW5qZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxvZygnRXJyb3IgaW4gaW5zZXJ0Q1NTOicsIGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBpc0xvZ2dlZEluOiBmYWxzZSB9KTtcbn0pO1xuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFtcImlzTG9nZ2VkSW5cIl0sIChyZXN1bHQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJpc0xvZ2dlZEluOiBcIiwgcmVzdWx0LmlzTG9nZ2VkSW4pO1xuICAgIH0pO1xufSk7XG5cbmNocm9tZS50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcigodGFiKSA9PiB7XG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChpc0xvYWRlZCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKGlzTG9hZGVkKSB7XG4gICAgICAgICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiLCB7IHR5cGU6IFwiZ2V0TG9naW5TdGF0dXNcIiB9KTtcbiAgICAgICAgICAgICAgICBsb2coXCJyZXNwb25zZVwiLCByZXNwb25zZSk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcblxuXG5hc3luYyBmdW5jdGlvbiBnZXRVUkwoKSB7XG4gICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlLCB1cmw6IFwiKjovLyouYXJjaGl2ZW9mb3Vyb3duLm9yZy8qXCIgfSk7XG4gICAgY29uc3QgYWN0aXZlVGFiID0gdGFic1swXTtcbiAgICBpZiAoIWFjdGl2ZVRhYikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHVybCA9IGFjdGl2ZVRhYi51cmw7XG4gICAgbG9nKCd1cmwnLCB1cmwpO1xuICAgIHJldHVybiB1cmw7XG59XG5cblxuXG4gICAgICAgICAgICAvL3ZhciBwb3J0ID0gY2hyb21lLnRhYnMuY29ubmVjdChpZCwgeyBuYW1lOiAnYW8zJyB9KTtcbiAgICAgICAgICAgIC8vcG9ydC5wb3N0TWVzc2FnZSh7IHVybDogdXJsIH0pO1xuICAgICAgICAgICAgLy9wb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAvLyAgICBsb2coJ2xpc3RlbmVyOiBtc2cnLCBtc2cpO1xuICAgICAgICAgICAgLy8gICAgaWYgKG1zZy50eXBlID09PSAnYW8zJykge1xuICAgICAgICAgICAgLy8gICAgICAgIGxvZygnbGlzdGVuZXI6IG1zZycsIG1zZyk7XG4gICAgICAgICAgICAvLyAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBpc0xvZ2dlZEluOiBtc2cuaXNMb2dnZWRJbiB9KTtcbiAgICAgICAgICAgIC8vICAgIH1cbiAgICAgICAgICAgIC8vfSk7XG5cblxuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoYXN5bmMgZnVuY3Rpb24gKGJ1dHRvbkNsaWNrZWQsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gICAgY29uc29sZS5sb2coYnV0dG9uQ2xpY2tlZC5yZWFzb24pO1xuICAgIGlmIChidXR0b25DbGlja2VkLnJlYXNvbiA9PT0gXCJsb2dpblwiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibG9naW4gaGVhcmRcIik7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB1c2VyTG9naW4oKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXV0aGVudGljYXRpb24gc3VjY2Vzc2Z1bFwiKTtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkF1dGhlbnRpY2F0aW9uIGZhaWxlZDogXCIsIGVycm9yKTtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyb3IgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7IC8vIFJldHVybiB0cnVlIHRvIGluZGljYXRlIHRoYXQgc2VuZFJlc3BvbnNlIHdpbGwgYmUgdXNlZCBhc3luY2hyb25vdXNseVxuICAgICAgfSBlbHNlIGlmIChidXR0b25DbGlja2VkLnJlYXNvbiA9PT0gXCJsb2dvdXRcIikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY2hyb21lLmlkZW50aXR5LnJlbW92ZUNhY2hlZEF1dGhUb2tlbih7IHRva2VuOiBidXR0b25DbGlja2VkLnJlYXNvbn0sICgpID0+IHtcbiAgICAgICAgICAgICAgICBmZXRjaChcbiAgICAgICAgICAgICAgICAgICAgXCJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvcmV2b2tlP3Rva2VuPVwiICsgYnV0dG9uQ2xpY2tlZC50b2tlbixcbiAgICAgICAgICAgICAgICAgICAgeyBtZXRob2Q6IFwiR0VUXCIgfVxuICAgICAgICAgICAgICAgICkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dvdXQgcmVzcG9uc2VcIiwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IGlzTG9nZ2VkSW46IGZhbHNlIH0pO1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gbG9nb3V0OlwiLCBlcnJvcik7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlOyAvLyBSZXR1cm4gdHJ1ZSB0byBpbmRpY2F0ZSB0aGF0IHNlbmRSZXNwb25zZSB3aWxsIGJlIHVzZWQgYXN5bmNocm9ub3VzbHlcbiAgICAgIH1cbiAgICB9KTtcblxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChjaGFuZ2VzLCBuYW1lc3BhY2UpIHtcbiAgICBjb25zb2xlLmxvZyhcInN0b3JhZ2UgY2hhbmdlZFwiKTtcbiAgICAvL2NvbnN0IGxvZ2luU3RhdHVzID0gZ2V0TG9naW5TdGF0dXMoKTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBjaGFuZ2VzKSB7XG4gICAgICAgIGNvbnN0IHN0b3JhZ2VDaGFuZ2UgPSBjaGFuZ2VzW2tleV07XG4gICAgICAgIGNvbnNvbGUubG9nKHN0b3JhZ2VDaGFuZ2UpO1xuICAgIH1cbn0pO1xuKi9cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==