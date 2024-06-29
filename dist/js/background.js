/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/chrome-services/authToken.tsx":
/*!*******************************************!*\
  !*** ./src/chrome-services/authToken.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchToken: () => (/* binding */ fetchToken),
/* harmony export */   getSavedToken: () => (/* binding */ getSavedToken),
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
function fetchToken(interactive) {
    return new Promise((resolve) => {
        if (interactive === true) {
            //getting token interactively
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__.log)('getting token interactively');
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                if (token) {
                    resolve(token);
                }
                else {
                    chrome.identity.clearAllCachedAuthTokens(() => {
                        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__.log)('Cleared all cached');
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
                        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__.log)('Cleared all cached');
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
        const token = yield getSavedToken();
        if (token === '') {
            throw new Error('Error getting token');
        }
        chrome.storage.sync.remove(['authToken']);
        // remove all identity tokens
        chrome.cookies.remove({
            name: 'authToken',
            url: 'https://archiveofourown.org',
        }, () => {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__.log)('Removed cookie');
        });
    });
}
// Get the user's saved token from chrome storage
function getSavedToken() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            chrome.cookies.get({
                name: 'authToken',
                url: 'https://archiveofourown.org',
            }, (cookie) => {
                if (cookie) {
                    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_0__.log)('cookie.value: ', cookie.value);
                    resolve(cookie.value);
                }
                else {
                    reject('Error getting token');
                }
            });
        });
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
/* harmony export */   createCookie: () => (/* reexport safe */ _utils_cookies__WEBPACK_IMPORTED_MODULE_4__.createCookie),
/* harmony export */   createSpreadsheet: () => (/* reexport safe */ _spreadsheet__WEBPACK_IMPORTED_MODULE_1__.createSpreadsheet),
/* harmony export */   fetchSpreadsheetUrl: () => (/* reexport safe */ _spreadsheet__WEBPACK_IMPORTED_MODULE_1__.fetchSpreadsheetUrl),
/* harmony export */   fetchToken: () => (/* reexport safe */ _authToken__WEBPACK_IMPORTED_MODULE_0__.fetchToken),
/* harmony export */   getCookie: () => (/* reexport safe */ _utils_cookies__WEBPACK_IMPORTED_MODULE_4__.getCookie),
/* harmony export */   getSavedToken: () => (/* reexport safe */ _authToken__WEBPACK_IMPORTED_MODULE_0__.getSavedToken),
/* harmony export */   getSheetId: () => (/* reexport safe */ _utils_getSheetId__WEBPACK_IMPORTED_MODULE_3__.getSheetId),
/* harmony export */   removeToken: () => (/* reexport safe */ _authToken__WEBPACK_IMPORTED_MODULE_0__.removeToken)
/* harmony export */ });
/* harmony import */ var _authToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./authToken */ "./src/chrome-services/authToken.tsx");
/* harmony import */ var _spreadsheet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./spreadsheet */ "./src/chrome-services/spreadsheet.tsx");
/* harmony import */ var _utils_addWorkToSheet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/addWorkToSheet */ "./src/chrome-services/utils/addWorkToSheet.tsx");
/* harmony import */ var _utils_getSheetId__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/getSheetId */ "./src/chrome-services/utils/getSheetId.tsx");
/* harmony import */ var _utils_cookies__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/cookies */ "./src/chrome-services/utils/cookies.ts");







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
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils/index.ts");
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
        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.log)('query', encodeURIComponent(query));
        return fetch(`https://docs.google.com/spreadsheets/d/${spreadsheetUrl.split('/')[5]}/gviz/tq?tq=${encodeURIComponent(query)}&access_token=${authToken}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
        }).then((res) => res.text()).then((res) => {
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.log)('query', 'res', res);
            const json = JSON.parse(res.substring(47, res.length - 2));
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.log)('query', 'json', json);
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
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils/index.ts");
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
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('getting spreadsheet URL');
    return new Promise((resolve, reject) => {
        // check for a stored spreadsheet URL
        chrome.storage.sync.get(['spreadsheetUrl'], (result) => __awaiter(this, void 0, void 0, function* () {
            (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('fetchSpreadSheetUrl result: ', result);
            const spreadsheetUrl = result.spreadsheetUrl;
            (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('spreadsheetUrl type: ', typeof spreadsheetUrl);
            // does the user have a spreadsheet URL already?
            if (spreadsheetUrl !== undefined && Object.keys(spreadsheetUrl).length !== 0) {
                (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('user has spreadsheet URL: ', spreadsheetUrl);
                (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('spreadsheetID: ', String(spreadsheetUrl).split('/')[5]);
                resolve(spreadsheetUrl);
            }
            else {
                (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)("user doesn't have spreadsheet URL, creating spreadsheet");
                //get authToken
                const token = yield (0,___WEBPACK_IMPORTED_MODULE_0__.getSavedToken)();
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
                    title: 'Saved Works',
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
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('options: ', options);
        return fetch(url, options)
            .then((response) => {
            (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('Response status:', response.status);
            return response.json();
        })
            .then((data) => {
            (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('Success:', data);
            chrome.storage.sync.set({ spreadsheetUrl: data.spreadsheetUrl });
            return data.spreadsheetUrl;
        })
            .catch((error) => {
            (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('Error creating spreadsheet:', error);
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
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils */ "./src/utils/index.ts");
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
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.log)('addWorkToSheet', work);
    const sheetId = yield (0,_getSheetId__WEBPACK_IMPORTED_MODULE_1__.getSheetId)(spreadsheetUrl, authToken);
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.log)('addWorkToSheet', 'sheetId', sheetId);
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
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils */ "./src/utils/index.ts");

function createCookie(cookie) {
    return new Promise((resolve, reject) => {
        chrome.cookies.set(cookie, (cookie) => {
            if (cookie) {
                (0,_utils__WEBPACK_IMPORTED_MODULE_0__.log)('createCookie cookie', cookie);
            }
            resolve(cookie);
        });
    });
}
function getCookie(cookieName, url) {
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.log)('getting cookie', cookieName, url);
    return new Promise((resolve) => {
        chrome.cookies.get({ name: cookieName, url: url }, (cookie) => {
            if (cookie) {
                (0,_utils__WEBPACK_IMPORTED_MODULE_0__.log)('getCookie cookie', cookie);
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
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils */ "./src/utils/index.ts");
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
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.log)('getSheetId: ', spreadsheetUrl);
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.log)('getSheetId', authToken);
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
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils */ "./src/utils/index.ts");
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
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.log)('responseUrl', responseUrl);
            const url = new URL(responseUrl);
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.log)('url', url);
            const urlParams = new URLSearchParams(url.hash.slice(1));
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.log)('urlParams', urlParams);
            const params = Object.fromEntries(urlParams.entries()); // access_token, expires_in
            params.expires_in = '43199'; // 12 hours
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.log)('params', params);
            const token = params.access_token;
            const cookie = yield (0,_cookies__WEBPACK_IMPORTED_MODULE_1__.createCookie)({
                name: 'authToken',
                url: 'https://www.archiveofourown.org/',
                value: token,
                expirationDate: Date.now() / 1000 + 43199,
                domain: '.archiveofourown.org',
            });
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.log)('cookie', cookie);
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
        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.log)('refreshToken data', data);
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
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ */ "./src/utils/index.ts");

//returns bool for each item in searchList as an array
function compareArrays(searchList, response) {
    var boolArray = new Array(20).fill(false);
    (0,___WEBPACK_IMPORTED_MODULE_0__.log)('searchList', searchList);
    (0,___WEBPACK_IMPORTED_MODULE_0__.log)('response', response);
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

/***/ "./src/utils/index.ts":
/*!****************************!*\
  !*** ./src/utils/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   log: () => (/* reexport safe */ _logger__WEBPACK_IMPORTED_MODULE_0__.log),
/* harmony export */   wrap: () => (/* reexport safe */ _wrapper__WEBPACK_IMPORTED_MODULE_1__.wrap)
/* harmony export */ });
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ "./src/utils/logger.ts");
/* harmony import */ var _wrapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wrapper */ "./src/utils/wrapper.ts");




/***/ }),

/***/ "./src/utils/logger.ts":
/*!*****************************!*\
  !*** ./src/utils/logger.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   log: () => (/* binding */ log)
/* harmony export */ });
const log = (function (environment) {
    if (environment === 'production') {
        return () => { };
    }
    return (...args) => {
        console.log(...args);
    };
})("development");



/***/ }),

/***/ "./src/utils/wrapper.ts":
/*!******************************!*\
  !*** ./src/utils/wrapper.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   wrap: () => (/* binding */ wrap)
/* harmony export */ });
function wrap(wrapee, wrapper) {
    wrapee.parentNode.insertBefore(wrapper, wrapee);
    wrapper.appendChild(wrapee);
}


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
    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('checking access token');
    port.onMessage.addListener(function (msg) {
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('port message', msg);
        if (msg.message === 'getAuthToken') {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('getAuthToken message recieved');
            (0,_chrome_services__WEBPACK_IMPORTED_MODULE_0__.getSavedToken)().then((token) => {
                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('port token', token);
                port.postMessage({ token: token });
            }).catch(() => {
                var _a, _b;
                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('port token', 'none');
                chrome.scripting.executeScript({
                    target: { tabId: ((_b = (_a = port.sender) === null || _a === void 0 ? void 0 : _a.tab) === null || _b === void 0 ? void 0 : _b.id) || 0 },
                    func: () => {
                        window.confirm('You need an auth token! Log back in?');
                    }
                }).then((response) => {
                    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('im a genius', response);
                    (0,_chrome_services_utils_oauthSignIn__WEBPACK_IMPORTED_MODULE_2__.launchWebAuthFlow)(true).then((cookie) => {
                        var _a, _b;
                        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('cookie', cookie);
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
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('fetchSpreadsheetUrl message recieved');
            (0,_chrome_services__WEBPACK_IMPORTED_MODULE_0__.fetchSpreadsheetUrl)().then((spreadsheetUrl) => {
                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('port spreadsheetUrl', spreadsheetUrl);
                port.postMessage({ spreadsheetUrl: spreadsheetUrl });
            });
        }
        else if (msg.message === 'querySheet') {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('querySheet message recieved');
            (0,_chrome_services__WEBPACK_IMPORTED_MODULE_0__.getSavedToken)().then((token) => {
                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('token', token);
                (0,_chrome_services__WEBPACK_IMPORTED_MODULE_0__.fetchSpreadsheetUrl)().then((spreadsheetUrl) => {
                    (0,_chrome_services_querySheet__WEBPACK_IMPORTED_MODULE_1__.query)(spreadsheetUrl, token, msg.list).then((response) => {
                        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('response', response);
                        const responseArray = (0,_utils_compareArrays__WEBPACK_IMPORTED_MODULE_3__.compareArrays)(msg.list, response.table.rows);
                        port.postMessage({ reason: 'querySheet', response: responseArray });
                    });
                });
            }).catch((error) => {
                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('error', error);
                port.postMessage({ reason: 'querySheet', response: error });
            });
        }
        else if (msg.message === 'sendLoginNotification') {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('sendLoginNotification message recieved');
        }
    });
    port.onDisconnect.addListener(function () {
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('port disconnected');
    });
});
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.message === 'addWorkToSheet') {
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('addWorkToSheet message recieved');
        (0,_chrome_services__WEBPACK_IMPORTED_MODULE_0__.getSavedToken)().then((token) => {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('token', token);
            (0,_chrome_services__WEBPACK_IMPORTED_MODULE_0__.fetchSpreadsheetUrl)().then((spreadsheetUrl) => {
                (0,_chrome_services__WEBPACK_IMPORTED_MODULE_0__.addWorkToSheet)(spreadsheetUrl, token, msg.work).then((response) => {
                    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('response', response);
                    sendResponse({ response: response });
                });
            });
        });
    }
});
chrome.storage.onChanged.addListener((changes) => {
    if (changes.spreadsheetUrl) {
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.log)('spreadsheetUrl changed', changes.spreadsheetUrl);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGVBQWU7QUFDMUMsVUFBVTtBQUNWO0FBQ0EsMkJBQTJCLDhCQUE4QjtBQUN6RDtBQUNBLHFCQUFxQjtBQUNyQixRQUFRO0FBQ1I7QUFDQSxvREFBb0QsNEJBQTRCO0FBQ2hGO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2Isc0NBQXNDLG1CQUFtQjtBQUN6RCwyQkFBMkIsZUFBZTtBQUMxQyxVQUFVO0FBQ1Y7QUFDQSwyQkFBMkIsOEJBQThCO0FBQ3pEO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCIsInNvdXJjZXMiOlsid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2Nocm9tZS1zZXJ2aWNlcy9hdXRoVG9rZW4udHN4Iiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2Nocm9tZS1zZXJ2aWNlcy9pbmRleC50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jaHJvbWUtc2VydmljZXMvcXVlcnlTaGVldC50c3giLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY2hyb21lLXNlcnZpY2VzL3NwcmVhZHNoZWV0LnRzeCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jaHJvbWUtc2VydmljZXMvdXRpbHMvYWRkV29ya1RvU2hlZXQudHN4Iiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2Nocm9tZS1zZXJ2aWNlcy91dGlscy9jb29raWVzLnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2Nocm9tZS1zZXJ2aWNlcy91dGlscy9nZXRTaGVldElkLnRzeCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jaHJvbWUtc2VydmljZXMvdXRpbHMvb2F1dGhTaWduSW4udHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvdXRpbHMvY29tcGFyZUFycmF5cy50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy91dGlscy9pbmRleC50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy91dGlscy9sb2dnZXIudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvdXRpbHMvd3JhcHBlci50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2JhY2tncm91bmQvYmFja2dyb3VuZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uL3V0aWxzL2xvZ2dlcic7XG4vKiogZ2V0IHRva2VuIGZyb20gaWRlbnRpdHkgQVBJXG4gKlxuICogQHBhcmFtIGludGVyYWN0aXZlID0gdHJ1ZSBpZiB5b3Ugd2FudCB0byBhc2sgdGhlIHVzZXIgZm9yIHBlcm1pc3Npb24gdG8gYWNjZXNzIHRoZWlyIGdvb2dsZSBhY2NvdW50XG4gKiBAcmV0dXJucyB0b2tlbiBvciBlbXB0eSBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZldGNoVG9rZW4oaW50ZXJhY3RpdmUpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgaWYgKGludGVyYWN0aXZlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAvL2dldHRpbmcgdG9rZW4gaW50ZXJhY3RpdmVseVxuICAgICAgICAgICAgbG9nKCdnZXR0aW5nIHRva2VuIGludGVyYWN0aXZlbHknKTtcbiAgICAgICAgICAgIGNocm9tZS5pZGVudGl0eS5nZXRBdXRoVG9rZW4oeyBpbnRlcmFjdGl2ZTogdHJ1ZSB9LCAodG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuaWRlbnRpdHkuY2xlYXJBbGxDYWNoZWRBdXRoVG9rZW5zKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZygnQ2xlYXJlZCBhbGwgY2FjaGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCcnKTsgLy8gVE9ETzogbWFrZSBhbiBhY3R1YWwgZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBnZXQgdG9rZW4gZnJvbSBpZGVudGl0eSBBUElcbiAgICAgICAgICAgIGNocm9tZS5pZGVudGl0eS5nZXRBdXRoVG9rZW4oeyBpbnRlcmFjdGl2ZTogZmFsc2UgfSwgKHRva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLmlkZW50aXR5LmNsZWFyQWxsQ2FjaGVkQXV0aFRva2VucygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2coJ0NsZWFyZWQgYWxsIGNhY2hlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgnJyk7IC8vIFRPRE86IG1ha2UgYW4gYWN0dWFsIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4vL3JlbW92ZSB0b2tlbiBmcm9tIGNocm9tZSBzdG9yYWdlIGFuZCBpZGVudGl0eSBBUElcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVUb2tlbigpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCB0b2tlbiA9IHlpZWxkIGdldFNhdmVkVG9rZW4oKTtcbiAgICAgICAgaWYgKHRva2VuID09PSAnJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBnZXR0aW5nIHRva2VuJyk7XG4gICAgICAgIH1cbiAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5yZW1vdmUoWydhdXRoVG9rZW4nXSk7XG4gICAgICAgIC8vIHJlbW92ZSBhbGwgaWRlbnRpdHkgdG9rZW5zXG4gICAgICAgIGNocm9tZS5jb29raWVzLnJlbW92ZSh7XG4gICAgICAgICAgICBuYW1lOiAnYXV0aFRva2VuJyxcbiAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vYXJjaGl2ZW9mb3Vyb3duLm9yZycsXG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIGxvZygnUmVtb3ZlZCBjb29raWUnKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyBHZXQgdGhlIHVzZXIncyBzYXZlZCB0b2tlbiBmcm9tIGNocm9tZSBzdG9yYWdlXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2F2ZWRUb2tlbigpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY2hyb21lLmNvb2tpZXMuZ2V0KHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnYXV0aFRva2VuJyxcbiAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL2FyY2hpdmVvZm91cm93bi5vcmcnLFxuICAgICAgICAgICAgfSwgKGNvb2tpZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjb29raWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCdjb29raWUudmFsdWU6ICcsIGNvb2tpZS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY29va2llLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgnRXJyb3IgZ2V0dGluZyB0b2tlbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiIsImV4cG9ydCAqIGZyb20gJy4vYXV0aFRva2VuJztcbmV4cG9ydCAqIGZyb20gJy4vc3ByZWFkc2hlZXQnO1xuZXhwb3J0ICogZnJvbSAnLi91dGlscy9hZGRXb3JrVG9TaGVldCc7XG5leHBvcnQgKiBmcm9tICcuL3V0aWxzL2dldFNoZWV0SWQnO1xuZXhwb3J0ICogZnJvbSAnLi91dGlscy9jb29raWVzJztcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi4vdXRpbHMnO1xuLy8gcXVlcnkgdGhlIHNwcmVhZHNoZWV0IGZvciB0aGUgd29ya3MgaW4gdGhlIHNlYXJjaExpc3RcbmV4cG9ydCBmdW5jdGlvbiBxdWVyeShzcHJlYWRzaGVldFVybCwgYXV0aFRva2VuLCBzZWFyY2hMaXN0KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgbGV0IHF1ZXJ5ID0gYHNlbGVjdCBBIHdoZXJlIEEgbWF0Y2hlc2A7XG4gICAgICAgIHNlYXJjaExpc3QuZm9yRWFjaCgod29ya0lkKSA9PiB7XG4gICAgICAgICAgICBpZiAod29ya0lkID09PSBzZWFyY2hMaXN0WzBdKSB7XG4gICAgICAgICAgICAgICAgcXVlcnkgKz0gYCAnJHt3b3JrSWR9J2A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBxdWVyeSArPSBgIG9yIEEgbWF0Y2hlcyAnJHt3b3JrSWR9J2A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBlbmNvZGVVUklDb21wb25lbnQocXVlcnkpO1xuICAgICAgICBsb2coJ3F1ZXJ5JywgZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5KSk7XG4gICAgICAgIHJldHVybiBmZXRjaChgaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvJHtzcHJlYWRzaGVldFVybC5zcGxpdCgnLycpWzVdfS9ndml6L3RxP3RxPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5KX0mYWNjZXNzX3Rva2VuPSR7YXV0aFRva2VufWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7YXV0aFRva2VufWAsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KS50aGVuKChyZXMpID0+IHJlcy50ZXh0KCkpLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgbG9nKCdxdWVyeScsICdyZXMnLCByZXMpO1xuICAgICAgICAgICAgY29uc3QganNvbiA9IEpTT04ucGFyc2UocmVzLnN1YnN0cmluZyg0NywgcmVzLmxlbmd0aCAtIDIpKTtcbiAgICAgICAgICAgIGxvZygncXVlcnknLCAnanNvbicsIGpzb24pO1xuICAgICAgICAgICAgcmV0dXJuIGpzb247XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBnZXRTYXZlZFRva2VuIH0gZnJvbSAnLic7XG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuLi91dGlscyc7XG4vKipcbiAqXG4gKiBAcmV0dXJucyB1c2VyJ3Mgc3ByZWFkc2hlZXQgVVJMXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFNwcmVhZHNoZWV0VXJsKCkge1xuICAgIGxvZygnZ2V0dGluZyBzcHJlYWRzaGVldCBVUkwnKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAvLyBjaGVjayBmb3IgYSBzdG9yZWQgc3ByZWFkc2hlZXQgVVJMXG4gICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFsnc3ByZWFkc2hlZXRVcmwnXSwgKHJlc3VsdCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgbG9nKCdmZXRjaFNwcmVhZFNoZWV0VXJsIHJlc3VsdDogJywgcmVzdWx0KTtcbiAgICAgICAgICAgIGNvbnN0IHNwcmVhZHNoZWV0VXJsID0gcmVzdWx0LnNwcmVhZHNoZWV0VXJsO1xuICAgICAgICAgICAgbG9nKCdzcHJlYWRzaGVldFVybCB0eXBlOiAnLCB0eXBlb2Ygc3ByZWFkc2hlZXRVcmwpO1xuICAgICAgICAgICAgLy8gZG9lcyB0aGUgdXNlciBoYXZlIGEgc3ByZWFkc2hlZXQgVVJMIGFscmVhZHk/XG4gICAgICAgICAgICBpZiAoc3ByZWFkc2hlZXRVcmwgIT09IHVuZGVmaW5lZCAmJiBPYmplY3Qua2V5cyhzcHJlYWRzaGVldFVybCkubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgbG9nKCd1c2VyIGhhcyBzcHJlYWRzaGVldCBVUkw6ICcsIHNwcmVhZHNoZWV0VXJsKTtcbiAgICAgICAgICAgICAgICBsb2coJ3NwcmVhZHNoZWV0SUQ6ICcsIFN0cmluZyhzcHJlYWRzaGVldFVybCkuc3BsaXQoJy8nKVs1XSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShzcHJlYWRzaGVldFVybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2coXCJ1c2VyIGRvZXNuJ3QgaGF2ZSBzcHJlYWRzaGVldCBVUkwsIGNyZWF0aW5nIHNwcmVhZHNoZWV0XCIpO1xuICAgICAgICAgICAgICAgIC8vZ2V0IGF1dGhUb2tlblxuICAgICAgICAgICAgICAgIGNvbnN0IHRva2VuID0geWllbGQgZ2V0U2F2ZWRUb2tlbigpO1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoJ0Vycm9yIGdldHRpbmcgdG9rZW4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY3JlYXRlIHNwcmVhZHNoZWV0XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIGNyZWF0ZVNwcmVhZHNoZWV0KHRva2VuKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHVybCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh1cmwpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfSk7XG59XG4vKipcbiAqXG4gKiBAcGFyYW0gdG9rZW4gdXNlcidzIGF1dGggdG9rZW5cbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTcHJlYWRzaGVldCh0b2tlbikge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IHNoZWV0TGF5b3V0ID0ge1xuICAgICAgICAgICAgcHJvcGVydGllczogeyB0aXRsZTogJ0FPM0UnIH0sXG4gICAgICAgICAgICBuYW1lZFJhbmdlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZWRSYW5nZUlkOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdXb3JrSUQnLFxuICAgICAgICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlZXRJZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Q29sdW1uSW5kZXg6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRDb2x1bW5JbmRleDogMVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWVkUmFuZ2VJZDogJzEnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAndGl0bGUnLFxuICAgICAgICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlZXRJZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Q29sdW1uSW5kZXg6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRDb2x1bW5JbmRleDogMlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWVkUmFuZ2VJZDogJzInLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnYXV0aG9ycycsXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVldElkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDb2x1bW5JbmRleDogMixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZENvbHVtbkluZGV4OiAzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZWRSYW5nZUlkOiAnMycsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdmYW5kb21zJyxcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWV0SWQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydENvbHVtbkluZGV4OiAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kQ29sdW1uSW5kZXg6IDRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lZFJhbmdlSWQ6ICc0JyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3JlbGF0aW9uc2hpcHMnLFxuICAgICAgICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlZXRJZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Q29sdW1uSW5kZXg6IDQsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRDb2x1bW5JbmRleDogNVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWVkUmFuZ2VJZDogJzUnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAndGFncycsXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVldElkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDb2x1bW5JbmRleDogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZENvbHVtbkluZGV4OiA2XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZWRSYW5nZUlkOiAnNicsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdkZXNjcmlwdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVldElkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDb2x1bW5JbmRleDogNixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZENvbHVtbkluZGV4OiA3XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZWRSYW5nZUlkOiAnNycsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICd3b3JkQ291bnQnLFxuICAgICAgICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hlZXRJZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Q29sdW1uSW5kZXg6IDcsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRDb2x1bW5JbmRleDogOFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWVkUmFuZ2VJZDogJzgnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY2hhcHRlckNvdW50JyxcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWV0SWQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydENvbHVtbkluZGV4OiA4LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kQ29sdW1uSW5kZXg6IDlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lZFJhbmdlSWQ6ICc5JyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3N0YXR1cycsXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVldElkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDb2x1bW5JbmRleDogOSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZENvbHVtbkluZGV4OiAxMFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWVkUmFuZ2VJZDogJzEwJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3JhdGluZycsXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVldElkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDb2x1bW5JbmRleDogMTAsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRDb2x1bW5JbmRleDogMTFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBzaGVldHM6IHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU2F2ZWQgV29ya3MnLFxuICAgICAgICAgICAgICAgICAgICBzaGVldElkOiAwLFxuICAgICAgICAgICAgICAgICAgICAvKmdyaWRQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dDb3VudDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbkNvdW50OiAxMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbkdyb3VwQ29udHJvbEFmdGVyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHByb3RlY3RlZFJhbmdlczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm90ZWN0ZWRSYW5nZUlkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQcm90ZWN0ZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2FybmluZ09ubHk6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Um93OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDb2x1bW46IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dEYXRhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyRW50ZXJlZFZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiAnV29yayBJRCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyRW50ZXJlZEZvcm1hdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Rm9ybWF0OiB7IGJvbGQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyRW50ZXJlZFZhbHVlOiB7IHN0cmluZ1ZhbHVlOiAnVGl0bGUnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRGb3JtYXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEZvcm1hdDogeyBib2xkOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRWYWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdWYWx1ZTogJ0F1dGhvcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRGb3JtYXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEZvcm1hdDogeyBib2xkOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRWYWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdWYWx1ZTogJ0ZhbmRvbXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRGb3JtYXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEZvcm1hdDogeyBib2xkOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRWYWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdWYWx1ZTogJ1JlbGF0aW9uc2hpcHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRGb3JtYXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEZvcm1hdDogeyBib2xkOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRWYWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdWYWx1ZTogJ1RhZ3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRGb3JtYXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEZvcm1hdDogeyBib2xkOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRWYWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdWYWx1ZTogJ0Rlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkRm9ybWF0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRGb3JtYXQ6IHsgYm9sZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkVmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nVmFsdWU6ICdXb3JkIENvdW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkRm9ybWF0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRGb3JtYXQ6IHsgYm9sZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkVmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nVmFsdWU6ICdDaGFwdGVyIENvdW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkRm9ybWF0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRGb3JtYXQ6IHsgYm9sZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkVmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nVmFsdWU6ICdTdGF0dXMnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyRW50ZXJlZEZvcm1hdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Rm9ybWF0OiB7IGJvbGQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyRW50ZXJlZFZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiAnUmF0aW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkRm9ybWF0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRGb3JtYXQ6IHsgYm9sZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7IHN0YXJ0Q29sdW1uOiAwLCBjb2x1bW5NZXRhZGF0YTogeyBwaXhlbFNpemU6IDEwMCB9IH0sXG4gICAgICAgICAgICAgICAgICAgIHsgc3RhcnRDb2x1bW46IDEsIGNvbHVtbk1ldGFkYXRhOiB7IHBpeGVsU2l6ZTogMzAwIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgeyBzdGFydENvbHVtbjogMiwgY29sdW1uTWV0YWRhdGE6IHsgcGl4ZWxTaXplOiAyMDAgfSB9LFxuICAgICAgICAgICAgICAgICAgICB7IHN0YXJ0Q29sdW1uOiAzLCBjb2x1bW5NZXRhZGF0YTogeyBwaXhlbFNpemU6IDIwMCB9IH0sXG4gICAgICAgICAgICAgICAgICAgIHsgc3RhcnRDb2x1bW46IDQsIGNvbHVtbk1ldGFkYXRhOiB7IHBpeGVsU2l6ZTogMTAwIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgeyBzdGFydENvbHVtbjogNSwgY29sdW1uTWV0YWRhdGE6IHsgcGl4ZWxTaXplOiAxMDAgfSB9LFxuICAgICAgICAgICAgICAgICAgICB7IHN0YXJ0Q29sdW1uOiA2LCBjb2x1bW5NZXRhZGF0YTogeyBwaXhlbFNpemU6IDEwMCB9IH0sIC8vc3RhdHVzXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHVybCA9ICdodHRwczovL3NoZWV0cy5nb29nbGVhcGlzLmNvbS92NC9zcHJlYWRzaGVldHMnO1xuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiAnQmVhcmVyICcgKyB0b2tlbixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzaGVldExheW91dCksXG4gICAgICAgIH07XG4gICAgICAgIGxvZygnb3B0aW9uczogJywgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXG4gICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGxvZygnUmVzcG9uc2Ugc3RhdHVzOicsIHJlc3BvbnNlLnN0YXR1cyk7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGxvZygnU3VjY2VzczonLCBkYXRhKTtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgc3ByZWFkc2hlZXRVcmw6IGRhdGEuc3ByZWFkc2hlZXRVcmwgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5zcHJlYWRzaGVldFVybDtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIGxvZygnRXJyb3IgY3JlYXRpbmcgc3ByZWFkc2hlZXQ6JywgZXJyb3IpO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuLi8uLi91dGlscyc7XG5pbXBvcnQgeyBnZXRTaGVldElkIH0gZnJvbSAnLi9nZXRTaGVldElkJztcbmV4cG9ydCBjb25zdCBhZGRXb3JrVG9TaGVldCA9IChzcHJlYWRzaGVldFVybCwgYXV0aFRva2VuLCB3b3JrKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICA7XG4gICAgbG9nKCdhZGRXb3JrVG9TaGVldCcsIHdvcmspO1xuICAgIGNvbnN0IHNoZWV0SWQgPSB5aWVsZCBnZXRTaGVldElkKHNwcmVhZHNoZWV0VXJsLCBhdXRoVG9rZW4pO1xuICAgIGxvZygnYWRkV29ya1RvU2hlZXQnLCAnc2hlZXRJZCcsIHNoZWV0SWQpO1xuICAgIHJldHVybiBmZXRjaChgaHR0cHM6Ly9zaGVldHMuZ29vZ2xlYXBpcy5jb20vdjQvc3ByZWFkc2hlZXRzLyR7c3ByZWFkc2hlZXRVcmwuc3BsaXQoJy8nKVs1XX06YmF0Y2hVcGRhdGVgLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2F1dGhUb2tlbn1gLFxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICByZXF1ZXN0czogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYXBwZW5kRGltZW5zaW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGVldElkOiBzaGVldElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGltZW5zaW9uOiAnUk9XUycsXG4gICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGg6IDEsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYXBwZW5kQ2VsbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoZWV0SWQ6IHNoZWV0SWQsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB2YWx1ZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdXNlckVudGVyZWRWYWx1ZTogeyBudW1iZXJWYWx1ZTogd29yay53b3JrSWQgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB1c2VyRW50ZXJlZFZhbHVlOiB7IHN0cmluZ1ZhbHVlOiB3b3JrLnRpdGxlIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdXNlckVudGVyZWRWYWx1ZTogeyBzdHJpbmdWYWx1ZTogd29yay5hdXRob3IudG9TdHJpbmcoKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkRm9ybWF0OiB7IHdyYXBTdHJhdGVneTogJ1dSQVAnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdXNlckVudGVyZWRWYWx1ZTogeyBzdHJpbmdWYWx1ZTogd29yay5mYW5kb21zLnRvU3RyaW5nKCkgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyRW50ZXJlZEZvcm1hdDogeyB3cmFwU3RyYXRlZ3k6ICdXUkFQJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHVzZXJFbnRlcmVkVmFsdWU6IHsgc3RyaW5nVmFsdWU6IHdvcmsucmVsYXRpb25zaGlwcy50b1N0cmluZygpIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVudGVyZWRGb3JtYXQ6IHsgd3JhcFN0cmF0ZWd5OiAnV1JBUCcgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB1c2VyRW50ZXJlZFZhbHVlOiB7IHN0cmluZ1ZhbHVlOiB3b3JrLnRhZ3MudG9TdHJpbmcoKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkRm9ybWF0OiB7IHdyYXBTdHJhdGVneTogJ1dSQVAnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdXNlckVudGVyZWRWYWx1ZTogeyBzdHJpbmdWYWx1ZTogd29yay5kZXNjcmlwdGlvbiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJFbnRlcmVkRm9ybWF0OiB7IHdyYXBTdHJhdGVneTogJ1dSQVAnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdXNlckVudGVyZWRWYWx1ZTogeyBudW1iZXJWYWx1ZTogd29yay53b3JkQ291bnQgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB1c2VyRW50ZXJlZFZhbHVlOiB7IG51bWJlclZhbHVlOiB3b3JrLnRvdGFsQ2hhcHRlcnMgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB1c2VyRW50ZXJlZFZhbHVlOiB7IHN0cmluZ1ZhbHVlOiB3b3JrLnN0YXR1cyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHVzZXJFbnRlcmVkVmFsdWU6IHsgbnVtYmVyVmFsdWU6IHdvcmsucmF0aW5nIH0gfSwgLy8xMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzOiAnKicsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYXV0b1Jlc2l6ZURpbWVuc2lvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVldElkOiBzaGVldElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbjogJ1JPV1MnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgaW5jbHVkZVNwcmVhZHNoZWV0SW5SZXNwb25zZTogZmFsc2VcbiAgICAgICAgfSksXG4gICAgfSkudGhlbigocmVzKSA9PiByZXMuanNvbigpKTtcbn0pO1xuIiwiaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29va2llKGNvb2tpZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNocm9tZS5jb29raWVzLnNldChjb29raWUsIChjb29raWUpID0+IHtcbiAgICAgICAgICAgIGlmIChjb29raWUpIHtcbiAgICAgICAgICAgICAgICBsb2coJ2NyZWF0ZUNvb2tpZSBjb29raWUnLCBjb29raWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzb2x2ZShjb29raWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb29raWUoY29va2llTmFtZSwgdXJsKSB7XG4gICAgbG9nKCdnZXR0aW5nIGNvb2tpZScsIGNvb2tpZU5hbWUsIHVybCk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNocm9tZS5jb29raWVzLmdldCh7IG5hbWU6IGNvb2tpZU5hbWUsIHVybDogdXJsIH0sIChjb29raWUpID0+IHtcbiAgICAgICAgICAgIGlmIChjb29raWUpIHtcbiAgICAgICAgICAgICAgICBsb2coJ2dldENvb2tpZSBjb29raWUnLCBjb29raWUpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoY29va2llKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuLy8gR2V0IHRoZSBzaGVldElkIGZyb20gdGhlIHNwcmVhZHNoZWV0VXJsXG4vLyBUT0RPOiBzYXZlIHRoZSBzaGVldElkIGluIHNlc3Npb24gc3RvcmFnZVxuZXhwb3J0IGNvbnN0IGdldFNoZWV0SWQgPSAoc3ByZWFkc2hlZXRVcmwsIGF1dGhUb2tlbikgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgbG9nKCdnZXRTaGVldElkOiAnLCBzcHJlYWRzaGVldFVybCk7XG4gICAgbG9nKCdnZXRTaGVldElkJywgYXV0aFRva2VuKTtcbiAgICByZXR1cm4gZmV0Y2goYGh0dHBzOi8vc2hlZXRzLmdvb2dsZWFwaXMuY29tL3Y0L3NwcmVhZHNoZWV0cy8ke3NwcmVhZHNoZWV0VXJsLnNwbGl0KCcvJylbNV19YCwge1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2F1dGhUb2tlbn1gLFxuICAgICAgICB9LFxuICAgIH0pLnRoZW4oKHJlcykgPT4gcmVzLmpzb24oKSkudGhlbigocmVzKSA9PiByZXMuc2hlZXRzWzBdLnByb3BlcnRpZXMuc2hlZXRJZCk7XG59KTtcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5pbXBvcnQgeyBjcmVhdGVDb29raWUgfSBmcm9tIFwiLi9jb29raWVzXCI7XG5jb25zdCByZWRpcmVjdFVSTCA9IGNocm9tZS5pZGVudGl0eS5nZXRSZWRpcmVjdFVSTCgpO1xuY29uc3QgeyBvYXV0aDIgfSA9IGNocm9tZS5ydW50aW1lLmdldE1hbmlmZXN0KCk7XG5pZiAoIW9hdXRoMikge1xuICAgIHRocm93IG5ldyBFcnJvcignWW91IG5lZWQgdG8gc3BlY2lmeSBvYXV0aDIgaW4gbWFuaWZlc3QuanNvbicpO1xufVxuY29uc3QgY2xpZW50SWQgPSBvYXV0aDIuY2xpZW50X2lkO1xuY29uc3QgYXV0aFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoe1xuICAgIC8vYWNjZXNzX3R5cGU6ICdvZmZsaW5lJyxcbiAgICBjbGllbnRfaWQ6IGNsaWVudElkLFxuICAgIHJlc3BvbnNlX3R5cGU6ICd0b2tlbicsXG4gICAgcmVkaXJlY3RfdXJpOiByZWRpcmVjdFVSTCxcbiAgICBzY29wZTogWydodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL3NwcmVhZHNoZWV0cyddLmpvaW4oJyAnKSxcbn0pO1xuY29uc3QgYXV0aFVSTCA9IGBodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvYXV0aD8ke2F1dGhQYXJhbXMudG9TdHJpbmcoKX1gO1xuLy9GSVg6IGludGVyYWN0aXZlIGNhbid0IGJlIGZhbHNlXG5leHBvcnQgZnVuY3Rpb24gbGF1bmNoV2ViQXV0aEZsb3coaW50ZXJhY3RpdmUpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjaHJvbWUuaWRlbnRpdHkubGF1bmNoV2ViQXV0aEZsb3coeyB1cmw6IGF1dGhVUkwsIGludGVyYWN0aXZlIH0sICgocmVzcG9uc2VVcmwpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGxvZygncmVzcG9uc2VVcmwnLCByZXNwb25zZVVybCk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHJlc3BvbnNlVXJsKTtcbiAgICAgICAgICAgIGxvZygndXJsJywgdXJsKTtcbiAgICAgICAgICAgIGNvbnN0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXModXJsLmhhc2guc2xpY2UoMSkpO1xuICAgICAgICAgICAgbG9nKCd1cmxQYXJhbXMnLCB1cmxQYXJhbXMpO1xuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmZyb21FbnRyaWVzKHVybFBhcmFtcy5lbnRyaWVzKCkpOyAvLyBhY2Nlc3NfdG9rZW4sIGV4cGlyZXNfaW5cbiAgICAgICAgICAgIHBhcmFtcy5leHBpcmVzX2luID0gJzQzMTk5JzsgLy8gMTIgaG91cnNcbiAgICAgICAgICAgIGxvZygncGFyYW1zJywgcGFyYW1zKTtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gcGFyYW1zLmFjY2Vzc190b2tlbjtcbiAgICAgICAgICAgIGNvbnN0IGNvb2tpZSA9IHlpZWxkIGNyZWF0ZUNvb2tpZSh7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2F1dGhUb2tlbicsXG4gICAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly93d3cuYXJjaGl2ZW9mb3Vyb3duLm9yZy8nLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB0b2tlbixcbiAgICAgICAgICAgICAgICBleHBpcmF0aW9uRGF0ZTogRGF0ZS5ub3coKSAvIDEwMDAgKyA0MzE5OSxcbiAgICAgICAgICAgICAgICBkb21haW46ICcuYXJjaGl2ZW9mb3Vyb3duLm9yZycsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGxvZygnY29va2llJywgY29va2llKTtcbiAgICAgICAgICAgIGlmIChjb29raWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShjb29raWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKSk7XG4gICAgfSk7XG59XG4vL2ZldGNoKGBodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjEvdXNlcmluZm8/YWx0PWpzb24mYWNjZXNzX3Rva2VuPSR7cGFyYW1zLmFjY2Vzc190b2tlbn1gLCB7XG4vLyAgICBtZXRob2Q6ICdHRVQnLFxuLy8gICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4vL30pLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKS50aGVuKChkYXRhKSA9PiB7XG4vLyAgICBhbGVydChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4vL30pO1xuZnVuY3Rpb24gcmVmcmVzaFRva2VuKHJlZnJlc2hUb2tlbikge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0geWllbGQgZmV0Y2goJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92NC90b2tlbicsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgY2xpZW50X2lkOiBjbGllbnRJZCxcbiAgICAgICAgICAgICAgICByZWZyZXNoX3Rva2VuOiByZWZyZXNoVG9rZW4sXG4gICAgICAgICAgICAgICAgZ3JhbnRfdHlwZTogJ3JlZnJlc2hfdG9rZW4nLFxuICAgICAgICAgICAgfSksXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBkYXRhID0geWllbGQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICBsb2coJ3JlZnJlc2hUb2tlbiBkYXRhJywgZGF0YSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi8nO1xuLy9yZXR1cm5zIGJvb2wgZm9yIGVhY2ggaXRlbSBpbiBzZWFyY2hMaXN0IGFzIGFuIGFycmF5XG5leHBvcnQgZnVuY3Rpb24gY29tcGFyZUFycmF5cyhzZWFyY2hMaXN0LCByZXNwb25zZSkge1xuICAgIHZhciBib29sQXJyYXkgPSBuZXcgQXJyYXkoMjApLmZpbGwoZmFsc2UpO1xuICAgIGxvZygnc2VhcmNoTGlzdCcsIHNlYXJjaExpc3QpO1xuICAgIGxvZygncmVzcG9uc2UnLCByZXNwb25zZSk7XG4gICAgc2VhcmNoTGlzdC5mb3JFYWNoKChzZWFyY2hJdGVtKSA9PiB7XG4gICAgICAgIHJlc3BvbnNlLmZvckVhY2goKHJlc3BvbnNlSXRlbSkgPT4ge1xuICAgICAgICAgICAgaWYgKHNlYXJjaEl0ZW0gPT09IHJlc3BvbnNlSXRlbS5jWzBdLmYpIHtcbiAgICAgICAgICAgICAgICBib29sQXJyYXlbc2VhcmNoTGlzdC5pbmRleE9mKHNlYXJjaEl0ZW0pXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2Uuc3BsaWNlKHJlc3BvbnNlLmluZGV4T2YocmVzcG9uc2VJdGVtKSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBib29sQXJyYXk7XG59XG4iLCJleHBvcnQgKiBmcm9tICcuL2xvZ2dlcic7XG5leHBvcnQgKiBmcm9tICcuL3dyYXBwZXInO1xuIiwiY29uc3QgbG9nID0gKGZ1bmN0aW9uIChlbnZpcm9ubWVudCkge1xuICAgIGlmIChlbnZpcm9ubWVudCA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IH07XG4gICAgfVxuICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyguLi5hcmdzKTtcbiAgICB9O1xufSkocHJvY2Vzcy5lbnYuTk9ERV9FTlYpO1xuZXhwb3J0IHsgbG9nIH07XG4iLCJleHBvcnQgZnVuY3Rpb24gd3JhcCh3cmFwZWUsIHdyYXBwZXIpIHtcbiAgICB3cmFwZWUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUod3JhcHBlciwgd3JhcGVlKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHdyYXBlZSk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGFkZFdvcmtUb1NoZWV0LCBmZXRjaFNwcmVhZHNoZWV0VXJsLCBnZXRTYXZlZFRva2VuIH0gZnJvbSAnLi4vY2hyb21lLXNlcnZpY2VzJztcbmltcG9ydCB7IHF1ZXJ5IH0gZnJvbSAnLi4vY2hyb21lLXNlcnZpY2VzL3F1ZXJ5U2hlZXQnO1xuaW1wb3J0IHsgbGF1bmNoV2ViQXV0aEZsb3cgfSBmcm9tICcuLi9jaHJvbWUtc2VydmljZXMvdXRpbHMvb2F1dGhTaWduSW4nO1xuaW1wb3J0IHsgY29tcGFyZUFycmF5cyB9IGZyb20gJy4uL3V0aWxzL2NvbXBhcmVBcnJheXMnO1xuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi4vdXRpbHMvbG9nZ2VyJztcbi8vd2luZG93LmFsZXJ0KCdiYWNrZ3JvdW5kIHNjcmlwdCBsb2FkZWQnKTtcbmNocm9tZS5ydW50aW1lLm9uQ29ubmVjdC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAocG9ydCkge1xuICAgIGxvZygnY2hlY2tpbmcgYWNjZXNzIHRva2VuJyk7XG4gICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBsb2coJ3BvcnQgbWVzc2FnZScsIG1zZyk7XG4gICAgICAgIGlmIChtc2cubWVzc2FnZSA9PT0gJ2dldEF1dGhUb2tlbicpIHtcbiAgICAgICAgICAgIGxvZygnZ2V0QXV0aFRva2VuIG1lc3NhZ2UgcmVjaWV2ZWQnKTtcbiAgICAgICAgICAgIGdldFNhdmVkVG9rZW4oKS50aGVuKCh0b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgIGxvZygncG9ydCB0b2tlbicsIHRva2VuKTtcbiAgICAgICAgICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKHsgdG9rZW46IHRva2VuIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICAgICAgbG9nKCdwb3J0IHRva2VuJywgJ25vbmUnKTtcbiAgICAgICAgICAgICAgICBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHsgdGFiSWQ6ICgoX2IgPSAoX2EgPSBwb3J0LnNlbmRlcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnRhYikgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmlkKSB8fCAwIH0sXG4gICAgICAgICAgICAgICAgICAgIGZ1bmM6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jb25maXJtKCdZb3UgbmVlZCBhbiBhdXRoIHRva2VuISBMb2cgYmFjayBpbj8nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZygnaW0gYSBnZW5pdXMnLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIGxhdW5jaFdlYkF1dGhGbG93KHRydWUpLnRoZW4oKGNvb2tpZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZygnY29va2llJywgY29va2llKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5ydW50aW1lLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHsgdGFiSWQ6ICgoX2IgPSAoX2EgPSBwb3J0LnNlbmRlcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnRhYikgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmlkKSB8fCAwIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuYzogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobXNnLm1lc3NhZ2UgPT09ICdmZXRjaFNwcmVhZHNoZWV0VXJsJykge1xuICAgICAgICAgICAgbG9nKCdmZXRjaFNwcmVhZHNoZWV0VXJsIG1lc3NhZ2UgcmVjaWV2ZWQnKTtcbiAgICAgICAgICAgIGZldGNoU3ByZWFkc2hlZXRVcmwoKS50aGVuKChzcHJlYWRzaGVldFVybCkgPT4ge1xuICAgICAgICAgICAgICAgIGxvZygncG9ydCBzcHJlYWRzaGVldFVybCcsIHNwcmVhZHNoZWV0VXJsKTtcbiAgICAgICAgICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKHsgc3ByZWFkc2hlZXRVcmw6IHNwcmVhZHNoZWV0VXJsIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobXNnLm1lc3NhZ2UgPT09ICdxdWVyeVNoZWV0Jykge1xuICAgICAgICAgICAgbG9nKCdxdWVyeVNoZWV0IG1lc3NhZ2UgcmVjaWV2ZWQnKTtcbiAgICAgICAgICAgIGdldFNhdmVkVG9rZW4oKS50aGVuKCh0b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgIGxvZygndG9rZW4nLCB0b2tlbik7XG4gICAgICAgICAgICAgICAgZmV0Y2hTcHJlYWRzaGVldFVybCgpLnRoZW4oKHNwcmVhZHNoZWV0VXJsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5KHNwcmVhZHNoZWV0VXJsLCB0b2tlbiwgbXNnLmxpc3QpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2coJ3Jlc3BvbnNlJywgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VBcnJheSA9IGNvbXBhcmVBcnJheXMobXNnLmxpc3QsIHJlc3BvbnNlLnRhYmxlLnJvd3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9ydC5wb3N0TWVzc2FnZSh7IHJlYXNvbjogJ3F1ZXJ5U2hlZXQnLCByZXNwb25zZTogcmVzcG9uc2VBcnJheSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBsb2coJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICAgICAgICAgIHBvcnQucG9zdE1lc3NhZ2UoeyByZWFzb246ICdxdWVyeVNoZWV0JywgcmVzcG9uc2U6IGVycm9yIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobXNnLm1lc3NhZ2UgPT09ICdzZW5kTG9naW5Ob3RpZmljYXRpb24nKSB7XG4gICAgICAgICAgICBsb2coJ3NlbmRMb2dpbk5vdGlmaWNhdGlvbiBtZXNzYWdlIHJlY2lldmVkJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBwb3J0Lm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxvZygncG9ydCBkaXNjb25uZWN0ZWQnKTtcbiAgICB9KTtcbn0pO1xuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChtc2csIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gICAgaWYgKG1zZy5tZXNzYWdlID09PSAnYWRkV29ya1RvU2hlZXQnKSB7XG4gICAgICAgIGxvZygnYWRkV29ya1RvU2hlZXQgbWVzc2FnZSByZWNpZXZlZCcpO1xuICAgICAgICBnZXRTYXZlZFRva2VuKCkudGhlbigodG9rZW4pID0+IHtcbiAgICAgICAgICAgIGxvZygndG9rZW4nLCB0b2tlbik7XG4gICAgICAgICAgICBmZXRjaFNwcmVhZHNoZWV0VXJsKCkudGhlbigoc3ByZWFkc2hlZXRVcmwpID0+IHtcbiAgICAgICAgICAgICAgICBhZGRXb3JrVG9TaGVldChzcHJlYWRzaGVldFVybCwgdG9rZW4sIG1zZy53b3JrKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsb2coJ3Jlc3BvbnNlJywgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMpID0+IHtcbiAgICBpZiAoY2hhbmdlcy5zcHJlYWRzaGVldFVybCkge1xuICAgICAgICBsb2coJ3NwcmVhZHNoZWV0VXJsIGNoYW5nZWQnLCBjaGFuZ2VzLnNwcmVhZHNoZWV0VXJsKTtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyBtZXNzYWdlOiBcInNwcmVhZHNoZWV0VXJsQ2hhbmdlZFwiLCBuZXdVcmw6IGNoYW5nZXMuc3ByZWFkc2hlZXRVcmwubmV3VmFsdWUgfSk7XG4gICAgfVxufSk7XG4vKmNocm9tZS50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcihhc3luYyAodGFiSWQsIGNoYW5nZUluZm8sIHRhYikgPT4ge1xuICAgIGlmIChcbiAgICAgICAgY2hhbmdlSW5mby5zdGF0dXMgPT09ICdjb21wbGV0ZScgJiZcbiAgICAgICAgdGFiLnVybD8uaW5jbHVkZXMoJ2FyY2hpdmVvZm91cm93bi5vcmcnKVxuICAgICkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgY2hyb21lLnNjcmlwdGluZ1xuICAgICAgICAgICAgICAgIC5pbnNlcnRDU1Moe1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHsgdGFiSWQ6IHRhYklkLCBhbGxGcmFtZXM6IHRydWUgfSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsnLi9qcy9jb250ZW50X3NjcmlwdC5jc3MnXSxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCdjb250ZW50X3NjcmlwdC5jc3MgaW5qZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxvZygnRXJyb3IgaW4gaW5zZXJ0Q1NTOicsIGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBpc0xvZ2dlZEluOiBmYWxzZSB9KTtcbn0pO1xuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFtcImlzTG9nZ2VkSW5cIl0sIChyZXN1bHQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJpc0xvZ2dlZEluOiBcIiwgcmVzdWx0LmlzTG9nZ2VkSW4pO1xuICAgIH0pO1xufSk7XG5cbmNocm9tZS50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcigodGFiKSA9PiB7XG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChpc0xvYWRlZCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKGlzTG9hZGVkKSB7XG4gICAgICAgICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiLCB7IHR5cGU6IFwiZ2V0TG9naW5TdGF0dXNcIiB9KTtcbiAgICAgICAgICAgICAgICBsb2coXCJyZXNwb25zZVwiLCByZXNwb25zZSk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcblxuXG5hc3luYyBmdW5jdGlvbiBnZXRVUkwoKSB7XG4gICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlLCB1cmw6IFwiKjovLyouYXJjaGl2ZW9mb3Vyb3duLm9yZy8qXCIgfSk7XG4gICAgY29uc3QgYWN0aXZlVGFiID0gdGFic1swXTtcbiAgICBpZiAoIWFjdGl2ZVRhYikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHVybCA9IGFjdGl2ZVRhYi51cmw7XG4gICAgbG9nKCd1cmwnLCB1cmwpO1xuICAgIHJldHVybiB1cmw7XG59XG5cblxuXG4gICAgICAgICAgICAvL3ZhciBwb3J0ID0gY2hyb21lLnRhYnMuY29ubmVjdChpZCwgeyBuYW1lOiAnYW8zJyB9KTtcbiAgICAgICAgICAgIC8vcG9ydC5wb3N0TWVzc2FnZSh7IHVybDogdXJsIH0pO1xuICAgICAgICAgICAgLy9wb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAvLyAgICBsb2coJ2xpc3RlbmVyOiBtc2cnLCBtc2cpO1xuICAgICAgICAgICAgLy8gICAgaWYgKG1zZy50eXBlID09PSAnYW8zJykge1xuICAgICAgICAgICAgLy8gICAgICAgIGxvZygnbGlzdGVuZXI6IG1zZycsIG1zZyk7XG4gICAgICAgICAgICAvLyAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBpc0xvZ2dlZEluOiBtc2cuaXNMb2dnZWRJbiB9KTtcbiAgICAgICAgICAgIC8vICAgIH1cbiAgICAgICAgICAgIC8vfSk7XG5cblxuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoYXN5bmMgZnVuY3Rpb24gKGJ1dHRvbkNsaWNrZWQsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gICAgY29uc29sZS5sb2coYnV0dG9uQ2xpY2tlZC5yZWFzb24pO1xuICAgIGlmIChidXR0b25DbGlja2VkLnJlYXNvbiA9PT0gXCJsb2dpblwiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibG9naW4gaGVhcmRcIik7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB1c2VyTG9naW4oKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXV0aGVudGljYXRpb24gc3VjY2Vzc2Z1bFwiKTtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkF1dGhlbnRpY2F0aW9uIGZhaWxlZDogXCIsIGVycm9yKTtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyb3IgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7IC8vIFJldHVybiB0cnVlIHRvIGluZGljYXRlIHRoYXQgc2VuZFJlc3BvbnNlIHdpbGwgYmUgdXNlZCBhc3luY2hyb25vdXNseVxuICAgICAgfSBlbHNlIGlmIChidXR0b25DbGlja2VkLnJlYXNvbiA9PT0gXCJsb2dvdXRcIikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY2hyb21lLmlkZW50aXR5LnJlbW92ZUNhY2hlZEF1dGhUb2tlbih7IHRva2VuOiBidXR0b25DbGlja2VkLnJlYXNvbn0sICgpID0+IHtcbiAgICAgICAgICAgICAgICBmZXRjaChcbiAgICAgICAgICAgICAgICAgICAgXCJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvcmV2b2tlP3Rva2VuPVwiICsgYnV0dG9uQ2xpY2tlZC50b2tlbixcbiAgICAgICAgICAgICAgICAgICAgeyBtZXRob2Q6IFwiR0VUXCIgfVxuICAgICAgICAgICAgICAgICkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dvdXQgcmVzcG9uc2VcIiwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IGlzTG9nZ2VkSW46IGZhbHNlIH0pO1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gbG9nb3V0OlwiLCBlcnJvcik7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlOyAvLyBSZXR1cm4gdHJ1ZSB0byBpbmRpY2F0ZSB0aGF0IHNlbmRSZXNwb25zZSB3aWxsIGJlIHVzZWQgYXN5bmNocm9ub3VzbHlcbiAgICAgIH1cbiAgICB9KTtcblxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChjaGFuZ2VzLCBuYW1lc3BhY2UpIHtcbiAgICBjb25zb2xlLmxvZyhcInN0b3JhZ2UgY2hhbmdlZFwiKTtcbiAgICAvL2NvbnN0IGxvZ2luU3RhdHVzID0gZ2V0TG9naW5TdGF0dXMoKTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBjaGFuZ2VzKSB7XG4gICAgICAgIGNvbnN0IHN0b3JhZ2VDaGFuZ2UgPSBjaGFuZ2VzW2tleV07XG4gICAgICAgIGNvbnNvbGUubG9nKHN0b3JhZ2VDaGFuZ2UpO1xuICAgIH1cbn0pO1xuKi9cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==