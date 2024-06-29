/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/blurbToggles.tsx":
/*!*****************************************!*\
  !*** ./src/components/blurbToggles.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addBlurbToggle: () => (/* binding */ addBlurbToggle)
/* harmony export */ });
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles.css */ "./src/styles.css");
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/logger */ "./src/utils/logger.ts");
/* harmony import */ var _works_WorkBlurb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../works/WorkBlurb */ "./src/works/WorkBlurb.ts");



/**
 *
 * @param workWrap
 * @returns
 */
function addBlurbToggle(workWrap) {
    const work = workWrap.firstChild;
    var on_list = false; //TODO: check if work is on list
    const innerToggle = document.createElement('a');
    innerToggle.textContent = 'Add Work'; //TODO: change for all buttons
    innerToggle.className = 'toggle';
    innerToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__.log)('blurbToggle clicked!: ', work);
        chrome.runtime.sendMessage({ message: 'addWorkToSheet', work: _works_WorkBlurb__WEBPACK_IMPORTED_MODULE_2__.WorkBlurb.createWork(work) });
        work.classList.add('read-work');
    });
    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__.log)('blurbToggles: ', work);
    const toggle = work.cloneNode(false);
    toggle.className = 'blurb-toggle';
    toggle.removeAttribute('id');
    toggle.removeAttribute('role');
    toggle.appendChild(innerToggle);
    workWrap.insertBefore(toggle, workWrap.firstChild);
}


/***/ }),

/***/ "./src/components/looksRead.ts":
/*!*************************************!*\
  !*** ./src/components/looksRead.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   looksRead: () => (/* binding */ looksRead)
/* harmony export */ });
function looksRead(tf, work) {
    if (tf)
        work.classList.add('read-work');
    else
        work.classList.remove('read-work');
}


/***/ }),

/***/ "./src/content_script.tsx":
/*!********************************!*\
  !*** ./src/content_script.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pages__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pages */ "./src/pages/index.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


(0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('log: content_script.tsx loaded');
connectPort().then((port) => {
    getToken(port).then((token) => {
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('token: ', token);
        pageTypeDetect(port);
    });
});
//open up connection to background script
function connectPort() {
    return __awaiter(this, void 0, void 0, function* () {
        const port = yield chrome.runtime.connect({ name: 'content_script' });
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('port: ', port);
        return port;
    });
}
//confirm port connection and get auth token
function getToken(port) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = new Promise((resolve) => {
            port.postMessage({ message: 'getAuthToken' });
            port.onMessage.addListener((msg) => {
                (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('content_script', 'port.onMessage: ', msg);
                if (msg.token) {
                    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('resolved token: ', msg.token);
                    resolve(msg.token);
                }
                if (msg.error) { //user is not logged in
                    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('error: ', msg.error);
                    resolve('');
                }
            });
            //reject('Error getting token');
        });
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('token check: ', token);
        token.then((token) => {
            (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('token: ', token);
            return token;
        }).catch((err) => {
            (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('error: ', err);
            return '';
        });
    });
}
//TODO: check for work v. bookmark page first
function pageTypeDetect(port) {
    return __awaiter(this, void 0, void 0, function* () {
        if (document.querySelector('.index.group.work')) { //AFIK, all blurbs pages have these classes
            //standard 20 work page
            (0,_pages__WEBPACK_IMPORTED_MODULE_0__.standardBlurbsPage)(port);
        }
        else if (document.querySelector('.work.meta.group')) { //only found if inside a work
            (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('Work Page');
        }
        else {
            (0,_utils__WEBPACK_IMPORTED_MODULE_1__.log)('PANIK: Unknown page');
        }
    });
}


/***/ }),

/***/ "./src/pages/blurbsPage.tsx":
/*!**********************************!*\
  !*** ./src/pages/blurbsPage.tsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   standardBlurbsPage: () => (/* binding */ standardBlurbsPage)
/* harmony export */ });
/* harmony import */ var _components_blurbToggles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/blurbToggles */ "./src/components/blurbToggles.tsx");
/* harmony import */ var _components_looksRead__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/looksRead */ "./src/components/looksRead.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils/index.ts");
/* harmony import */ var _works_WorkBlurb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../works/WorkBlurb */ "./src/works/WorkBlurb.ts");




const standardBlurbsPage = (port) => {
    const temp = document.querySelector('li.work, li.bookmark');
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.log)('port test: ', port);
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.log)('temp style: ', getComputedStyle(temp));
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.log)('temp style: ', JSON.stringify(getComputedStyle(temp)));
    const works = Array.from(document.querySelectorAll('li.work, li.bookmark'));
    var searchList = new Array();
    works.forEach((work) => {
        var newEl = document.createElement('div');
        newEl.classList.add('blurb-with-toggles');
        newEl.style.cssText = JSON.stringify(getComputedStyle(work));
        (0,_utils__WEBPACK_IMPORTED_MODULE_2__.wrap)(work, newEl);
        (0,_components_blurbToggles__WEBPACK_IMPORTED_MODULE_0__.addBlurbToggle)(newEl);
        //if its a bookmark, use the class to get the work id
        if (work.classList.contains('bookmark')) {
            searchList.push(work.classList[3].split('-')[1]);
        }
        else {
            //else its a work, use the id to get the work id
            searchList.push(work.id.split('_')[1]);
        }
    });
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.log)('searchList: ', searchList);
    //only needs to be called when button is pressed
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.log)('work: ', _works_WorkBlurb__WEBPACK_IMPORTED_MODULE_3__.WorkBlurb.getWorkFromPage(searchList[0]));
    //port.postMessage({ message: 'batchUpdate', work: (Work.getWorkFromPage(searchList[0])) });
    port.postMessage({ message: 'querySheet', list: searchList });
    port.onMessage.addListener((msg) => {
        (0,_utils__WEBPACK_IMPORTED_MODULE_2__.log)('content_script', 'port.onMessage: ', msg);
        if (msg.reason === 'querySheet') {
            if (msg.response) {
                msg.response.forEach((workRef, index) => {
                    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.log)('workRef: ', workRef);
                    if (workRef) {
                        (0,_components_looksRead__WEBPACK_IMPORTED_MODULE_1__.looksRead)(true, works[index]);
                    }
                });
            }
        }
    });
};


/***/ }),

/***/ "./src/pages/index.ts":
/*!****************************!*\
  !*** ./src/pages/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   standardBlurbsPage: () => (/* reexport safe */ _blurbsPage__WEBPACK_IMPORTED_MODULE_0__.standardBlurbsPage)
/* harmony export */ });
/* harmony import */ var _blurbsPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./blurbsPage */ "./src/pages/blurbsPage.tsx");



/***/ }),

/***/ "./src/works/BaseWork.ts":
/*!*******************************!*\
  !*** ./src/works/BaseWork.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseWork: () => (/* binding */ BaseWork)
/* harmony export */ });
class BaseWork {
    constructor(workId, title, author, fandoms, relationships, tags, description, wordCount, totalChapters, status, rating, rereadCount) {
        this.workId = workId;
        this.title = title;
        this.author = author;
        this.fandoms = fandoms;
        this.relationships = relationships;
        this.tags = tags;
        this.description = description;
        this.wordCount = wordCount;
        this.totalChapters = totalChapters;
        this.status = status;
        this.rating = rating;
        this.rereadCount = rereadCount;
    }
    toString() {
        return JSON.stringify(this);
    }
}


/***/ }),

/***/ "./src/works/WorkBlurb.ts":
/*!********************************!*\
  !*** ./src/works/WorkBlurb.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorkBlurb: () => (/* binding */ WorkBlurb)
/* harmony export */ });
/* harmony import */ var _BaseWork__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseWork */ "./src/works/BaseWork.ts");

class WorkBlurb extends _BaseWork__WEBPACK_IMPORTED_MODULE_0__.BaseWork {
    static getWorkFromPage(workId) {
        var _a;
        const workNode = document.querySelector(`#work_${workId}`);
        if (!workNode) {
            throw new Error(`Work ${workId} not found on page`);
        }
        const title = workNode.querySelector('.heading > a').textContent;
        const authorNodes = workNode.querySelectorAll("[rel='author']");
        const authors = Array.from(authorNodes).map((authorNode) => authorNode.textContent);
        const fandomNodes = workNode.querySelectorAll('.fandoms > a');
        const fandoms = Array.from(fandomNodes).map((fandomNode) => fandomNode.textContent);
        const relationships = ['placeholder'];
        const tags = ['placeholder'];
        const description = 'longer placeholder';
        const wordCount = workNode.querySelector('dd.words').textContent;
        var chapterCount = (_a = workNode.querySelector('dd.chapters > a')) === null || _a === void 0 ? void 0 : _a.textContent;
        if (!chapterCount) {
            //one-shot
            chapterCount = '1';
        }
        return new this(workId, title, authors, fandoms, relationships, tags, description, parseInt(wordCount.replace(/,/g, '')), parseInt(chapterCount.replace(/,/g, '')), "", 0, 0);
    }
    static createWork(workNode) {
        var _a;
        if (!workNode) {
            throw new Error(`Work not found on page`);
        }
        const workId = parseInt(workNode.id.split('_')[1]);
        const title = workNode.querySelector('.heading > a').textContent;
        const authorNodes = workNode.querySelectorAll("[rel='author']");
        const authors = Array.from(authorNodes).map((authorNode) => authorNode.textContent);
        const fandomNodes = workNode.querySelectorAll('.fandoms > a');
        const fandoms = Array.from(fandomNodes).map((fandomNode) => fandomNode.textContent);
        const relationshipNodes = workNode.querySelectorAll('.relationships > a');
        const relationships = Array.from(relationshipNodes).map((relationshipNode) => relationshipNode.textContent);
        const tagNodes = workNode.querySelectorAll('.warnings > a, .characters > a, .freeforms > a');
        const tags = Array.from(tagNodes).map((tagNode) => tagNode.textContent);
        const description = workNode.querySelector('.summary > p').textContent;
        const wordCount = workNode.querySelector('dd.words').textContent;
        var chapterCount = (_a = workNode.querySelector('dd.chapters > a')) === null || _a === void 0 ? void 0 : _a.textContent;
        if (!chapterCount) {
            //one-shot
            chapterCount = '1';
        }
        return new this(workId, title, authors, fandoms, relationships, tags, description, parseInt(wordCount.replace(/,/g, '')), parseInt(chapterCount.replace(/,/g, '')), "", 0, 0);
    }
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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"content_script": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkchrome_extension_typescript_starter"] = self["webpackChunkchrome_extension_typescript_starter"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/content_script.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQ2hEQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsK0JBQStCLHdDQUF3QztXQUN2RTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlCQUFpQixxQkFBcUI7V0FDdEM7V0FDQTtXQUNBLGtCQUFrQixxQkFBcUI7V0FDdkM7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2NvbXBvbmVudHMvYmx1cmJUb2dnbGVzLnRzeCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb21wb25lbnRzL2xvb2tzUmVhZC50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50X3NjcmlwdC50c3giLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvcGFnZXMvYmx1cmJzUGFnZS50c3giLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvcGFnZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvd29ya3MvQmFzZVdvcmsudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvd29ya3MvV29ya0JsdXJiLnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi9zdHlsZXMuY3NzJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQgeyBXb3JrQmx1cmIgfSBmcm9tICcuLi93b3Jrcy9Xb3JrQmx1cmInO1xuLyoqXG4gKlxuICogQHBhcmFtIHdvcmtXcmFwXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkQmx1cmJUb2dnbGUod29ya1dyYXApIHtcbiAgICBjb25zdCB3b3JrID0gd29ya1dyYXAuZmlyc3RDaGlsZDtcbiAgICB2YXIgb25fbGlzdCA9IGZhbHNlOyAvL1RPRE86IGNoZWNrIGlmIHdvcmsgaXMgb24gbGlzdFxuICAgIGNvbnN0IGlubmVyVG9nZ2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGlubmVyVG9nZ2xlLnRleHRDb250ZW50ID0gJ0FkZCBXb3JrJzsgLy9UT0RPOiBjaGFuZ2UgZm9yIGFsbCBidXR0b25zXG4gICAgaW5uZXJUb2dnbGUuY2xhc3NOYW1lID0gJ3RvZ2dsZSc7XG4gICAgaW5uZXJUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGxvZygnYmx1cmJUb2dnbGUgY2xpY2tlZCE6ICcsIHdvcmspO1xuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IG1lc3NhZ2U6ICdhZGRXb3JrVG9TaGVldCcsIHdvcms6IFdvcmtCbHVyYi5jcmVhdGVXb3JrKHdvcmspIH0pO1xuICAgICAgICB3b3JrLmNsYXNzTGlzdC5hZGQoJ3JlYWQtd29yaycpO1xuICAgIH0pO1xuICAgIGxvZygnYmx1cmJUb2dnbGVzOiAnLCB3b3JrKTtcbiAgICBjb25zdCB0b2dnbGUgPSB3b3JrLmNsb25lTm9kZShmYWxzZSk7XG4gICAgdG9nZ2xlLmNsYXNzTmFtZSA9ICdibHVyYi10b2dnbGUnO1xuICAgIHRvZ2dsZS5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgdG9nZ2xlLnJlbW92ZUF0dHJpYnV0ZSgncm9sZScpO1xuICAgIHRvZ2dsZS5hcHBlbmRDaGlsZChpbm5lclRvZ2dsZSk7XG4gICAgd29ya1dyYXAuaW5zZXJ0QmVmb3JlKHRvZ2dsZSwgd29ya1dyYXAuZmlyc3RDaGlsZCk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gbG9va3NSZWFkKHRmLCB3b3JrKSB7XG4gICAgaWYgKHRmKVxuICAgICAgICB3b3JrLmNsYXNzTGlzdC5hZGQoJ3JlYWQtd29yaycpO1xuICAgIGVsc2VcbiAgICAgICAgd29yay5jbGFzc0xpc3QucmVtb3ZlKCdyZWFkLXdvcmsnKTtcbn1cbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgc3RhbmRhcmRCbHVyYnNQYWdlIH0gZnJvbSAnLi9wYWdlcyc7XG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuL3V0aWxzJztcbmxvZygnbG9nOiBjb250ZW50X3NjcmlwdC50c3ggbG9hZGVkJyk7XG5jb25uZWN0UG9ydCgpLnRoZW4oKHBvcnQpID0+IHtcbiAgICBnZXRUb2tlbihwb3J0KS50aGVuKCh0b2tlbikgPT4ge1xuICAgICAgICBsb2coJ3Rva2VuOiAnLCB0b2tlbik7XG4gICAgICAgIHBhZ2VUeXBlRGV0ZWN0KHBvcnQpO1xuICAgIH0pO1xufSk7XG4vL29wZW4gdXAgY29ubmVjdGlvbiB0byBiYWNrZ3JvdW5kIHNjcmlwdFxuZnVuY3Rpb24gY29ubmVjdFBvcnQoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3QgcG9ydCA9IHlpZWxkIGNocm9tZS5ydW50aW1lLmNvbm5lY3QoeyBuYW1lOiAnY29udGVudF9zY3JpcHQnIH0pO1xuICAgICAgICBsb2coJ3BvcnQ6ICcsIHBvcnQpO1xuICAgICAgICByZXR1cm4gcG9ydDtcbiAgICB9KTtcbn1cbi8vY29uZmlybSBwb3J0IGNvbm5lY3Rpb24gYW5kIGdldCBhdXRoIHRva2VuXG5mdW5jdGlvbiBnZXRUb2tlbihwb3J0KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgcG9ydC5wb3N0TWVzc2FnZSh7IG1lc3NhZ2U6ICdnZXRBdXRoVG9rZW4nIH0pO1xuICAgICAgICAgICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZykgPT4ge1xuICAgICAgICAgICAgICAgIGxvZygnY29udGVudF9zY3JpcHQnLCAncG9ydC5vbk1lc3NhZ2U6ICcsIG1zZyk7XG4gICAgICAgICAgICAgICAgaWYgKG1zZy50b2tlbikge1xuICAgICAgICAgICAgICAgICAgICBsb2coJ3Jlc29sdmVkIHRva2VuOiAnLCBtc2cudG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG1zZy50b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChtc2cuZXJyb3IpIHsgLy91c2VyIGlzIG5vdCBsb2dnZWQgaW5cbiAgICAgICAgICAgICAgICAgICAgbG9nKCdlcnJvcjogJywgbXNnLmVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL3JlamVjdCgnRXJyb3IgZ2V0dGluZyB0b2tlbicpO1xuICAgICAgICB9KTtcbiAgICAgICAgbG9nKCd0b2tlbiBjaGVjazogJywgdG9rZW4pO1xuICAgICAgICB0b2tlbi50aGVuKCh0b2tlbikgPT4ge1xuICAgICAgICAgICAgbG9nKCd0b2tlbjogJywgdG9rZW4pO1xuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBsb2coJ2Vycm9yOiAnLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vVE9ETzogY2hlY2sgZm9yIHdvcmsgdi4gYm9va21hcmsgcGFnZSBmaXJzdFxuZnVuY3Rpb24gcGFnZVR5cGVEZXRlY3QocG9ydCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW5kZXguZ3JvdXAud29yaycpKSB7IC8vQUZJSywgYWxsIGJsdXJicyBwYWdlcyBoYXZlIHRoZXNlIGNsYXNzZXNcbiAgICAgICAgICAgIC8vc3RhbmRhcmQgMjAgd29yayBwYWdlXG4gICAgICAgICAgICBzdGFuZGFyZEJsdXJic1BhZ2UocG9ydCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndvcmsubWV0YS5ncm91cCcpKSB7IC8vb25seSBmb3VuZCBpZiBpbnNpZGUgYSB3b3JrXG4gICAgICAgICAgICBsb2coJ1dvcmsgUGFnZScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbG9nKCdQQU5JSzogVW5rbm93biBwYWdlJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IGFkZEJsdXJiVG9nZ2xlIH0gZnJvbSAnLi4vY29tcG9uZW50cy9ibHVyYlRvZ2dsZXMnO1xuaW1wb3J0IHsgbG9va3NSZWFkIH0gZnJvbSAnLi4vY29tcG9uZW50cy9sb29rc1JlYWQnO1xuaW1wb3J0IHsgbG9nLCB3cmFwIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgV29ya0JsdXJiIH0gZnJvbSAnLi4vd29ya3MvV29ya0JsdXJiJztcbmV4cG9ydCBjb25zdCBzdGFuZGFyZEJsdXJic1BhZ2UgPSAocG9ydCkgPT4ge1xuICAgIGNvbnN0IHRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdsaS53b3JrLCBsaS5ib29rbWFyaycpO1xuICAgIGxvZygncG9ydCB0ZXN0OiAnLCBwb3J0KTtcbiAgICBsb2coJ3RlbXAgc3R5bGU6ICcsIGdldENvbXB1dGVkU3R5bGUodGVtcCkpO1xuICAgIGxvZygndGVtcCBzdHlsZTogJywgSlNPTi5zdHJpbmdpZnkoZ2V0Q29tcHV0ZWRTdHlsZSh0ZW1wKSkpO1xuICAgIGNvbnN0IHdvcmtzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaS53b3JrLCBsaS5ib29rbWFyaycpKTtcbiAgICB2YXIgc2VhcmNoTGlzdCA9IG5ldyBBcnJheSgpO1xuICAgIHdvcmtzLmZvckVhY2goKHdvcmspID0+IHtcbiAgICAgICAgdmFyIG5ld0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIG5ld0VsLmNsYXNzTGlzdC5hZGQoJ2JsdXJiLXdpdGgtdG9nZ2xlcycpO1xuICAgICAgICBuZXdFbC5zdHlsZS5jc3NUZXh0ID0gSlNPTi5zdHJpbmdpZnkoZ2V0Q29tcHV0ZWRTdHlsZSh3b3JrKSk7XG4gICAgICAgIHdyYXAod29yaywgbmV3RWwpO1xuICAgICAgICBhZGRCbHVyYlRvZ2dsZShuZXdFbCk7XG4gICAgICAgIC8vaWYgaXRzIGEgYm9va21hcmssIHVzZSB0aGUgY2xhc3MgdG8gZ2V0IHRoZSB3b3JrIGlkXG4gICAgICAgIGlmICh3b3JrLmNsYXNzTGlzdC5jb250YWlucygnYm9va21hcmsnKSkge1xuICAgICAgICAgICAgc2VhcmNoTGlzdC5wdXNoKHdvcmsuY2xhc3NMaXN0WzNdLnNwbGl0KCctJylbMV0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy9lbHNlIGl0cyBhIHdvcmssIHVzZSB0aGUgaWQgdG8gZ2V0IHRoZSB3b3JrIGlkXG4gICAgICAgICAgICBzZWFyY2hMaXN0LnB1c2god29yay5pZC5zcGxpdCgnXycpWzFdKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGxvZygnc2VhcmNoTGlzdDogJywgc2VhcmNoTGlzdCk7XG4gICAgLy9vbmx5IG5lZWRzIHRvIGJlIGNhbGxlZCB3aGVuIGJ1dHRvbiBpcyBwcmVzc2VkXG4gICAgbG9nKCd3b3JrOiAnLCBXb3JrQmx1cmIuZ2V0V29ya0Zyb21QYWdlKHNlYXJjaExpc3RbMF0pKTtcbiAgICAvL3BvcnQucG9zdE1lc3NhZ2UoeyBtZXNzYWdlOiAnYmF0Y2hVcGRhdGUnLCB3b3JrOiAoV29yay5nZXRXb3JrRnJvbVBhZ2Uoc2VhcmNoTGlzdFswXSkpIH0pO1xuICAgIHBvcnQucG9zdE1lc3NhZ2UoeyBtZXNzYWdlOiAncXVlcnlTaGVldCcsIGxpc3Q6IHNlYXJjaExpc3QgfSk7XG4gICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZykgPT4ge1xuICAgICAgICBsb2coJ2NvbnRlbnRfc2NyaXB0JywgJ3BvcnQub25NZXNzYWdlOiAnLCBtc2cpO1xuICAgICAgICBpZiAobXNnLnJlYXNvbiA9PT0gJ3F1ZXJ5U2hlZXQnKSB7XG4gICAgICAgICAgICBpZiAobXNnLnJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgbXNnLnJlc3BvbnNlLmZvckVhY2goKHdvcmtSZWYsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZygnd29ya1JlZjogJywgd29ya1JlZik7XG4gICAgICAgICAgICAgICAgICAgIGlmICh3b3JrUmVmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb29rc1JlYWQodHJ1ZSwgd29ya3NbaW5kZXhdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuIiwiZXhwb3J0ICogZnJvbSAnLi9ibHVyYnNQYWdlJztcbiIsImV4cG9ydCBjbGFzcyBCYXNlV29yayB7XG4gICAgY29uc3RydWN0b3Iod29ya0lkLCB0aXRsZSwgYXV0aG9yLCBmYW5kb21zLCByZWxhdGlvbnNoaXBzLCB0YWdzLCBkZXNjcmlwdGlvbiwgd29yZENvdW50LCB0b3RhbENoYXB0ZXJzLCBzdGF0dXMsIHJhdGluZywgcmVyZWFkQ291bnQpIHtcbiAgICAgICAgdGhpcy53b3JrSWQgPSB3b3JrSWQ7XG4gICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICAgICAgdGhpcy5hdXRob3IgPSBhdXRob3I7XG4gICAgICAgIHRoaXMuZmFuZG9tcyA9IGZhbmRvbXM7XG4gICAgICAgIHRoaXMucmVsYXRpb25zaGlwcyA9IHJlbGF0aW9uc2hpcHM7XG4gICAgICAgIHRoaXMudGFncyA9IHRhZ3M7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICAgICAgdGhpcy53b3JkQ291bnQgPSB3b3JkQ291bnQ7XG4gICAgICAgIHRoaXMudG90YWxDaGFwdGVycyA9IHRvdGFsQ2hhcHRlcnM7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICB0aGlzLnJhdGluZyA9IHJhdGluZztcbiAgICAgICAgdGhpcy5yZXJlYWRDb3VudCA9IHJlcmVhZENvdW50O1xuICAgIH1cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEJhc2VXb3JrIH0gZnJvbSBcIi4vQmFzZVdvcmtcIjtcbmV4cG9ydCBjbGFzcyBXb3JrQmx1cmIgZXh0ZW5kcyBCYXNlV29yayB7XG4gICAgc3RhdGljIGdldFdvcmtGcm9tUGFnZSh3b3JrSWQpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCB3b3JrTm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCN3b3JrXyR7d29ya0lkfWApO1xuICAgICAgICBpZiAoIXdvcmtOb2RlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdvcmsgJHt3b3JrSWR9IG5vdCBmb3VuZCBvbiBwYWdlYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGl0bGUgPSB3b3JrTm9kZS5xdWVyeVNlbGVjdG9yKCcuaGVhZGluZyA+IGEnKS50ZXh0Q29udGVudDtcbiAgICAgICAgY29uc3QgYXV0aG9yTm9kZXMgPSB3b3JrTm9kZS5xdWVyeVNlbGVjdG9yQWxsKFwiW3JlbD0nYXV0aG9yJ11cIik7XG4gICAgICAgIGNvbnN0IGF1dGhvcnMgPSBBcnJheS5mcm9tKGF1dGhvck5vZGVzKS5tYXAoKGF1dGhvck5vZGUpID0+IGF1dGhvck5vZGUudGV4dENvbnRlbnQpO1xuICAgICAgICBjb25zdCBmYW5kb21Ob2RlcyA9IHdvcmtOb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5mYW5kb21zID4gYScpO1xuICAgICAgICBjb25zdCBmYW5kb21zID0gQXJyYXkuZnJvbShmYW5kb21Ob2RlcykubWFwKChmYW5kb21Ob2RlKSA9PiBmYW5kb21Ob2RlLnRleHRDb250ZW50KTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IFsncGxhY2Vob2xkZXInXTtcbiAgICAgICAgY29uc3QgdGFncyA9IFsncGxhY2Vob2xkZXInXTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSAnbG9uZ2VyIHBsYWNlaG9sZGVyJztcbiAgICAgICAgY29uc3Qgd29yZENvdW50ID0gd29ya05vZGUucXVlcnlTZWxlY3RvcignZGQud29yZHMnKS50ZXh0Q29udGVudDtcbiAgICAgICAgdmFyIGNoYXB0ZXJDb3VudCA9IChfYSA9IHdvcmtOb2RlLnF1ZXJ5U2VsZWN0b3IoJ2RkLmNoYXB0ZXJzID4gYScpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudGV4dENvbnRlbnQ7XG4gICAgICAgIGlmICghY2hhcHRlckNvdW50KSB7XG4gICAgICAgICAgICAvL29uZS1zaG90XG4gICAgICAgICAgICBjaGFwdGVyQ291bnQgPSAnMSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzKHdvcmtJZCwgdGl0bGUsIGF1dGhvcnMsIGZhbmRvbXMsIHJlbGF0aW9uc2hpcHMsIHRhZ3MsIGRlc2NyaXB0aW9uLCBwYXJzZUludCh3b3JkQ291bnQucmVwbGFjZSgvLC9nLCAnJykpLCBwYXJzZUludChjaGFwdGVyQ291bnQucmVwbGFjZSgvLC9nLCAnJykpLCBcIlwiLCAwLCAwKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZVdvcmsod29ya05vZGUpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoIXdvcmtOb2RlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdvcmsgbm90IGZvdW5kIG9uIHBhZ2VgKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3b3JrSWQgPSBwYXJzZUludCh3b3JrTm9kZS5pZC5zcGxpdCgnXycpWzFdKTtcbiAgICAgICAgY29uc3QgdGl0bGUgPSB3b3JrTm9kZS5xdWVyeVNlbGVjdG9yKCcuaGVhZGluZyA+IGEnKS50ZXh0Q29udGVudDtcbiAgICAgICAgY29uc3QgYXV0aG9yTm9kZXMgPSB3b3JrTm9kZS5xdWVyeVNlbGVjdG9yQWxsKFwiW3JlbD0nYXV0aG9yJ11cIik7XG4gICAgICAgIGNvbnN0IGF1dGhvcnMgPSBBcnJheS5mcm9tKGF1dGhvck5vZGVzKS5tYXAoKGF1dGhvck5vZGUpID0+IGF1dGhvck5vZGUudGV4dENvbnRlbnQpO1xuICAgICAgICBjb25zdCBmYW5kb21Ob2RlcyA9IHdvcmtOb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5mYW5kb21zID4gYScpO1xuICAgICAgICBjb25zdCBmYW5kb21zID0gQXJyYXkuZnJvbShmYW5kb21Ob2RlcykubWFwKChmYW5kb21Ob2RlKSA9PiBmYW5kb21Ob2RlLnRleHRDb250ZW50KTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwTm9kZXMgPSB3b3JrTm9kZS5xdWVyeVNlbGVjdG9yQWxsKCcucmVsYXRpb25zaGlwcyA+IGEnKTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IEFycmF5LmZyb20ocmVsYXRpb25zaGlwTm9kZXMpLm1hcCgocmVsYXRpb25zaGlwTm9kZSkgPT4gcmVsYXRpb25zaGlwTm9kZS50ZXh0Q29udGVudCk7XG4gICAgICAgIGNvbnN0IHRhZ05vZGVzID0gd29ya05vZGUucXVlcnlTZWxlY3RvckFsbCgnLndhcm5pbmdzID4gYSwgLmNoYXJhY3RlcnMgPiBhLCAuZnJlZWZvcm1zID4gYScpO1xuICAgICAgICBjb25zdCB0YWdzID0gQXJyYXkuZnJvbSh0YWdOb2RlcykubWFwKCh0YWdOb2RlKSA9PiB0YWdOb2RlLnRleHRDb250ZW50KTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB3b3JrTm9kZS5xdWVyeVNlbGVjdG9yKCcuc3VtbWFyeSA+IHAnKS50ZXh0Q29udGVudDtcbiAgICAgICAgY29uc3Qgd29yZENvdW50ID0gd29ya05vZGUucXVlcnlTZWxlY3RvcignZGQud29yZHMnKS50ZXh0Q29udGVudDtcbiAgICAgICAgdmFyIGNoYXB0ZXJDb3VudCA9IChfYSA9IHdvcmtOb2RlLnF1ZXJ5U2VsZWN0b3IoJ2RkLmNoYXB0ZXJzID4gYScpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudGV4dENvbnRlbnQ7XG4gICAgICAgIGlmICghY2hhcHRlckNvdW50KSB7XG4gICAgICAgICAgICAvL29uZS1zaG90XG4gICAgICAgICAgICBjaGFwdGVyQ291bnQgPSAnMSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzKHdvcmtJZCwgdGl0bGUsIGF1dGhvcnMsIGZhbmRvbXMsIHJlbGF0aW9uc2hpcHMsIHRhZ3MsIGRlc2NyaXB0aW9uLCBwYXJzZUludCh3b3JkQ291bnQucmVwbGFjZSgvLC9nLCAnJykpLCBwYXJzZUludChjaGFwdGVyQ291bnQucmVwbGFjZSgvLC9nLCAnJykpLCBcIlwiLCAwLCAwKTtcbiAgICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJjb250ZW50X3NjcmlwdFwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjaHJvbWVfZXh0ZW5zaW9uX3R5cGVzY3JpcHRfc3RhcnRlclwiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjaHJvbWVfZXh0ZW5zaW9uX3R5cGVzY3JpcHRfc3RhcnRlclwiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9yXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NvbnRlbnRfc2NyaXB0LnRzeFwiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9