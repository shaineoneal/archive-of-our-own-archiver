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
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('blurbToggle clicked!: ', work);
        chrome.runtime.sendMessage({ message: 'addWorkToSheet', work: _works_WorkBlurb__WEBPACK_IMPORTED_MODULE_2__.WorkBlurb.createWork(work) });
        work.classList.add('read-work');
    });
    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('blurbToggles: ', work);
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
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/logger */ "./src/utils/logger.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


(0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('log: content_script.tsx loaded');
connectPort().then((port) => {
    getToken(port).then((token) => {
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('token: ', token);
        pageTypeDetect(port);
    });
});
//open up connection to background script
function connectPort() {
    return __awaiter(this, void 0, void 0, function* () {
        const port = yield chrome.runtime.connect({ name: 'content_script' });
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('port: ', port);
        return port;
    });
}
//confirm port connection and get auth token
function getToken(port) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = new Promise((resolve) => {
            port.postMessage({ message: 'getAuthToken' });
            port.onMessage.addListener((msg) => {
                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('content_script', 'port.onMessage: ', msg);
                if (msg.token) {
                    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('resolved token: ', msg.token);
                    resolve(msg.token);
                }
                if (msg.error) { //user is not logged in
                    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('error: ', msg.error);
                    resolve('');
                }
            });
            //reject('Error getting token');
        });
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('token check: ', token);
        token.then((token) => {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('token: ', token);
            return token;
        }).catch((err) => {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('error: ', err);
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
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('Work Page');
        }
        else {
            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])('PANIK: Unknown page');
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
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/logger */ "./src/utils/logger.ts");
/* harmony import */ var _works_WorkBlurb__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../works/WorkBlurb */ "./src/works/WorkBlurb.ts");





const standardBlurbsPage = (port) => {
    const temp = document.querySelector('li.work, li.bookmark');
    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_3__["default"])('port test: ', port);
    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_3__["default"])('temp style: ', getComputedStyle(temp));
    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_3__["default"])('temp style: ', JSON.stringify(getComputedStyle(temp)));
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
    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_3__["default"])('searchList: ', searchList);
    //only needs to be called when button is pressed
    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_3__["default"])('work: ', _works_WorkBlurb__WEBPACK_IMPORTED_MODULE_4__.WorkBlurb.getWorkFromPage(searchList[0]));
    //port.postMessage({ message: 'batchUpdate', work: (Work.getWorkFromPage(searchList[0])) });
    port.postMessage({ message: 'querySheet', list: searchList });
    port.onMessage.addListener((msg) => {
        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_3__["default"])('content_script', 'port.onMessage: ', msg);
        if (msg.reason === 'querySheet') {
            if (msg.response) {
                msg.response.forEach((workRef, index) => {
                    (0,_utils_logger__WEBPACK_IMPORTED_MODULE_3__["default"])('workRef: ', workRef);
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

/***/ "./src/utils/index.ts":
/*!****************************!*\
  !*** ./src/utils/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   wrap: () => (/* reexport safe */ _wrapper__WEBPACK_IMPORTED_MODULE_1__.wrap)
/* harmony export */ });
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ "./src/utils/logger.ts");
/* harmony import */ var _wrapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wrapper */ "./src/utils/wrapper.ts");




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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb21wb25lbnRzL2JsdXJiVG9nZ2xlcy50c3giLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY29tcG9uZW50cy9sb29rc1JlYWQudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY29udGVudF9zY3JpcHQudHN4Iiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL3BhZ2VzL2JsdXJic1BhZ2UudHN4Iiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL3BhZ2VzL2luZGV4LnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL3V0aWxzL2luZGV4LnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL3V0aWxzL3dyYXBwZXIudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvd29ya3MvQmFzZVdvcmsudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvd29ya3MvV29ya0JsdXJiLnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi9zdHlsZXMuY3NzJztcbmltcG9ydCBsb2cgZnJvbSAnLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7IFdvcmtCbHVyYiB9IGZyb20gJy4uL3dvcmtzL1dvcmtCbHVyYic7XG4vKipcbiAqXG4gKiBAcGFyYW0gd29ya1dyYXBcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRCbHVyYlRvZ2dsZSh3b3JrV3JhcCkge1xuICAgIGNvbnN0IHdvcmsgPSB3b3JrV3JhcC5maXJzdENoaWxkO1xuICAgIHZhciBvbl9saXN0ID0gZmFsc2U7IC8vVE9ETzogY2hlY2sgaWYgd29yayBpcyBvbiBsaXN0XG4gICAgY29uc3QgaW5uZXJUb2dnbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgaW5uZXJUb2dnbGUudGV4dENvbnRlbnQgPSAnQWRkIFdvcmsnOyAvL1RPRE86IGNoYW5nZSBmb3IgYWxsIGJ1dHRvbnNcbiAgICBpbm5lclRvZ2dsZS5jbGFzc05hbWUgPSAndG9nZ2xlJztcbiAgICBpbm5lclRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgbG9nKCdibHVyYlRvZ2dsZSBjbGlja2VkITogJywgd29yayk7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgbWVzc2FnZTogJ2FkZFdvcmtUb1NoZWV0Jywgd29yazogV29ya0JsdXJiLmNyZWF0ZVdvcmsod29yaykgfSk7XG4gICAgICAgIHdvcmsuY2xhc3NMaXN0LmFkZCgncmVhZC13b3JrJyk7XG4gICAgfSk7XG4gICAgbG9nKCdibHVyYlRvZ2dsZXM6ICcsIHdvcmspO1xuICAgIGNvbnN0IHRvZ2dsZSA9IHdvcmsuY2xvbmVOb2RlKGZhbHNlKTtcbiAgICB0b2dnbGUuY2xhc3NOYW1lID0gJ2JsdXJiLXRvZ2dsZSc7XG4gICAgdG9nZ2xlLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcbiAgICB0b2dnbGUucmVtb3ZlQXR0cmlidXRlKCdyb2xlJyk7XG4gICAgdG9nZ2xlLmFwcGVuZENoaWxkKGlubmVyVG9nZ2xlKTtcbiAgICB3b3JrV3JhcC5pbnNlcnRCZWZvcmUodG9nZ2xlLCB3b3JrV3JhcC5maXJzdENoaWxkKTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBsb29rc1JlYWQodGYsIHdvcmspIHtcbiAgICBpZiAodGYpXG4gICAgICAgIHdvcmsuY2xhc3NMaXN0LmFkZCgncmVhZC13b3JrJyk7XG4gICAgZWxzZVxuICAgICAgICB3b3JrLmNsYXNzTGlzdC5yZW1vdmUoJ3JlYWQtd29yaycpO1xufVxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBzdGFuZGFyZEJsdXJic1BhZ2UgfSBmcm9tICcuL3BhZ2VzJztcbmltcG9ydCBsb2cgZnJvbSAnLi91dGlscy9sb2dnZXInO1xubG9nKCdsb2c6IGNvbnRlbnRfc2NyaXB0LnRzeCBsb2FkZWQnKTtcbmNvbm5lY3RQb3J0KCkudGhlbigocG9ydCkgPT4ge1xuICAgIGdldFRva2VuKHBvcnQpLnRoZW4oKHRva2VuKSA9PiB7XG4gICAgICAgIGxvZygndG9rZW46ICcsIHRva2VuKTtcbiAgICAgICAgcGFnZVR5cGVEZXRlY3QocG9ydCk7XG4gICAgfSk7XG59KTtcbi8vb3BlbiB1cCBjb25uZWN0aW9uIHRvIGJhY2tncm91bmQgc2NyaXB0XG5mdW5jdGlvbiBjb25uZWN0UG9ydCgpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCBwb3J0ID0geWllbGQgY2hyb21lLnJ1bnRpbWUuY29ubmVjdCh7IG5hbWU6ICdjb250ZW50X3NjcmlwdCcgfSk7XG4gICAgICAgIGxvZygncG9ydDogJywgcG9ydCk7XG4gICAgICAgIHJldHVybiBwb3J0O1xuICAgIH0pO1xufVxuLy9jb25maXJtIHBvcnQgY29ubmVjdGlvbiBhbmQgZ2V0IGF1dGggdG9rZW5cbmZ1bmN0aW9uIGdldFRva2VuKHBvcnQpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCB0b2tlbiA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKHsgbWVzc2FnZTogJ2dldEF1dGhUb2tlbicgfSk7XG4gICAgICAgICAgICBwb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnKSA9PiB7XG4gICAgICAgICAgICAgICAgbG9nKCdjb250ZW50X3NjcmlwdCcsICdwb3J0Lm9uTWVzc2FnZTogJywgbXNnKTtcbiAgICAgICAgICAgICAgICBpZiAobXNnLnRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZygncmVzb2x2ZWQgdG9rZW46ICcsIG1zZy50b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUobXNnLnRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG1zZy5lcnJvcikgeyAvL3VzZXIgaXMgbm90IGxvZ2dlZCBpblxuICAgICAgICAgICAgICAgICAgICBsb2coJ2Vycm9yOiAnLCBtc2cuZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vcmVqZWN0KCdFcnJvciBnZXR0aW5nIHRva2VuJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBsb2coJ3Rva2VuIGNoZWNrOiAnLCB0b2tlbik7XG4gICAgICAgIHRva2VuLnRoZW4oKHRva2VuKSA9PiB7XG4gICAgICAgICAgICBsb2coJ3Rva2VuOiAnLCB0b2tlbik7XG4gICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIGxvZygnZXJyb3I6ICcsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuLy9UT0RPOiBjaGVjayBmb3Igd29yayB2LiBib29rbWFyayBwYWdlIGZpcnN0XG5mdW5jdGlvbiBwYWdlVHlwZURldGVjdChwb3J0KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pbmRleC5ncm91cC53b3JrJykpIHsgLy9BRklLLCBhbGwgYmx1cmJzIHBhZ2VzIGhhdmUgdGhlc2UgY2xhc3Nlc1xuICAgICAgICAgICAgLy9zdGFuZGFyZCAyMCB3b3JrIHBhZ2VcbiAgICAgICAgICAgIHN0YW5kYXJkQmx1cmJzUGFnZShwb3J0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud29yay5tZXRhLmdyb3VwJykpIHsgLy9vbmx5IGZvdW5kIGlmIGluc2lkZSBhIHdvcmtcbiAgICAgICAgICAgIGxvZygnV29yayBQYWdlJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsb2coJ1BBTklLOiBVbmtub3duIHBhZ2UnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgYWRkQmx1cmJUb2dnbGUgfSBmcm9tICcuLi9jb21wb25lbnRzL2JsdXJiVG9nZ2xlcyc7XG5pbXBvcnQgeyBsb29rc1JlYWQgfSBmcm9tICcuLi9jb21wb25lbnRzL2xvb2tzUmVhZCc7XG5pbXBvcnQgeyB3cmFwIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IGxvZyBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHsgV29ya0JsdXJiIH0gZnJvbSAnLi4vd29ya3MvV29ya0JsdXJiJztcbmV4cG9ydCBjb25zdCBzdGFuZGFyZEJsdXJic1BhZ2UgPSAocG9ydCkgPT4ge1xuICAgIGNvbnN0IHRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdsaS53b3JrLCBsaS5ib29rbWFyaycpO1xuICAgIGxvZygncG9ydCB0ZXN0OiAnLCBwb3J0KTtcbiAgICBsb2coJ3RlbXAgc3R5bGU6ICcsIGdldENvbXB1dGVkU3R5bGUodGVtcCkpO1xuICAgIGxvZygndGVtcCBzdHlsZTogJywgSlNPTi5zdHJpbmdpZnkoZ2V0Q29tcHV0ZWRTdHlsZSh0ZW1wKSkpO1xuICAgIGNvbnN0IHdvcmtzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaS53b3JrLCBsaS5ib29rbWFyaycpKTtcbiAgICB2YXIgc2VhcmNoTGlzdCA9IG5ldyBBcnJheSgpO1xuICAgIHdvcmtzLmZvckVhY2goKHdvcmspID0+IHtcbiAgICAgICAgdmFyIG5ld0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIG5ld0VsLmNsYXNzTGlzdC5hZGQoJ2JsdXJiLXdpdGgtdG9nZ2xlcycpO1xuICAgICAgICBuZXdFbC5zdHlsZS5jc3NUZXh0ID0gSlNPTi5zdHJpbmdpZnkoZ2V0Q29tcHV0ZWRTdHlsZSh3b3JrKSk7XG4gICAgICAgIHdyYXAod29yaywgbmV3RWwpO1xuICAgICAgICBhZGRCbHVyYlRvZ2dsZShuZXdFbCk7XG4gICAgICAgIC8vaWYgaXRzIGEgYm9va21hcmssIHVzZSB0aGUgY2xhc3MgdG8gZ2V0IHRoZSB3b3JrIGlkXG4gICAgICAgIGlmICh3b3JrLmNsYXNzTGlzdC5jb250YWlucygnYm9va21hcmsnKSkge1xuICAgICAgICAgICAgc2VhcmNoTGlzdC5wdXNoKHdvcmsuY2xhc3NMaXN0WzNdLnNwbGl0KCctJylbMV0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy9lbHNlIGl0cyBhIHdvcmssIHVzZSB0aGUgaWQgdG8gZ2V0IHRoZSB3b3JrIGlkXG4gICAgICAgICAgICBzZWFyY2hMaXN0LnB1c2god29yay5pZC5zcGxpdCgnXycpWzFdKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGxvZygnc2VhcmNoTGlzdDogJywgc2VhcmNoTGlzdCk7XG4gICAgLy9vbmx5IG5lZWRzIHRvIGJlIGNhbGxlZCB3aGVuIGJ1dHRvbiBpcyBwcmVzc2VkXG4gICAgbG9nKCd3b3JrOiAnLCBXb3JrQmx1cmIuZ2V0V29ya0Zyb21QYWdlKHNlYXJjaExpc3RbMF0pKTtcbiAgICAvL3BvcnQucG9zdE1lc3NhZ2UoeyBtZXNzYWdlOiAnYmF0Y2hVcGRhdGUnLCB3b3JrOiAoV29yay5nZXRXb3JrRnJvbVBhZ2Uoc2VhcmNoTGlzdFswXSkpIH0pO1xuICAgIHBvcnQucG9zdE1lc3NhZ2UoeyBtZXNzYWdlOiAncXVlcnlTaGVldCcsIGxpc3Q6IHNlYXJjaExpc3QgfSk7XG4gICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZykgPT4ge1xuICAgICAgICBsb2coJ2NvbnRlbnRfc2NyaXB0JywgJ3BvcnQub25NZXNzYWdlOiAnLCBtc2cpO1xuICAgICAgICBpZiAobXNnLnJlYXNvbiA9PT0gJ3F1ZXJ5U2hlZXQnKSB7XG4gICAgICAgICAgICBpZiAobXNnLnJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgbXNnLnJlc3BvbnNlLmZvckVhY2goKHdvcmtSZWYsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZygnd29ya1JlZjogJywgd29ya1JlZik7XG4gICAgICAgICAgICAgICAgICAgIGlmICh3b3JrUmVmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb29rc1JlYWQodHJ1ZSwgd29ya3NbaW5kZXhdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuIiwiZXhwb3J0ICogZnJvbSAnLi9ibHVyYnNQYWdlJztcbiIsImV4cG9ydCAqIGZyb20gJy4vbG9nZ2VyJztcbmV4cG9ydCAqIGZyb20gJy4vd3JhcHBlcic7XG4iLCJleHBvcnQgZnVuY3Rpb24gd3JhcCh3cmFwZWUsIHdyYXBwZXIpIHtcbiAgICB3cmFwZWUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUod3JhcHBlciwgd3JhcGVlKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHdyYXBlZSk7XG59XG4iLCJleHBvcnQgY2xhc3MgQmFzZVdvcmsge1xuICAgIGNvbnN0cnVjdG9yKHdvcmtJZCwgdGl0bGUsIGF1dGhvciwgZmFuZG9tcywgcmVsYXRpb25zaGlwcywgdGFncywgZGVzY3JpcHRpb24sIHdvcmRDb3VudCwgdG90YWxDaGFwdGVycywgc3RhdHVzLCByYXRpbmcsIHJlcmVhZENvdW50KSB7XG4gICAgICAgIHRoaXMud29ya0lkID0gd29ya0lkO1xuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgICAgIHRoaXMuYXV0aG9yID0gYXV0aG9yO1xuICAgICAgICB0aGlzLmZhbmRvbXMgPSBmYW5kb21zO1xuICAgICAgICB0aGlzLnJlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzO1xuICAgICAgICB0aGlzLnRhZ3MgPSB0YWdzO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgICAgIHRoaXMud29yZENvdW50ID0gd29yZENvdW50O1xuICAgICAgICB0aGlzLnRvdGFsQ2hhcHRlcnMgPSB0b3RhbENoYXB0ZXJzO1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgICAgdGhpcy5yYXRpbmcgPSByYXRpbmc7XG4gICAgICAgIHRoaXMucmVyZWFkQ291bnQgPSByZXJlYWRDb3VudDtcbiAgICB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBCYXNlV29yayB9IGZyb20gXCIuL0Jhc2VXb3JrXCI7XG5leHBvcnQgY2xhc3MgV29ya0JsdXJiIGV4dGVuZHMgQmFzZVdvcmsge1xuICAgIHN0YXRpYyBnZXRXb3JrRnJvbVBhZ2Uod29ya0lkKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgY29uc3Qgd29ya05vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjd29ya18ke3dvcmtJZH1gKTtcbiAgICAgICAgaWYgKCF3b3JrTm9kZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXb3JrICR7d29ya0lkfSBub3QgZm91bmQgb24gcGFnZWApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRpdGxlID0gd29ya05vZGUucXVlcnlTZWxlY3RvcignLmhlYWRpbmcgPiBhJykudGV4dENvbnRlbnQ7XG4gICAgICAgIGNvbnN0IGF1dGhvck5vZGVzID0gd29ya05vZGUucXVlcnlTZWxlY3RvckFsbChcIltyZWw9J2F1dGhvciddXCIpO1xuICAgICAgICBjb25zdCBhdXRob3JzID0gQXJyYXkuZnJvbShhdXRob3JOb2RlcykubWFwKChhdXRob3JOb2RlKSA9PiBhdXRob3JOb2RlLnRleHRDb250ZW50KTtcbiAgICAgICAgY29uc3QgZmFuZG9tTm9kZXMgPSB3b3JrTm9kZS5xdWVyeVNlbGVjdG9yQWxsKCcuZmFuZG9tcyA+IGEnKTtcbiAgICAgICAgY29uc3QgZmFuZG9tcyA9IEFycmF5LmZyb20oZmFuZG9tTm9kZXMpLm1hcCgoZmFuZG9tTm9kZSkgPT4gZmFuZG9tTm9kZS50ZXh0Q29udGVudCk7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSBbJ3BsYWNlaG9sZGVyJ107XG4gICAgICAgIGNvbnN0IHRhZ3MgPSBbJ3BsYWNlaG9sZGVyJ107XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gJ2xvbmdlciBwbGFjZWhvbGRlcic7XG4gICAgICAgIGNvbnN0IHdvcmRDb3VudCA9IHdvcmtOb2RlLnF1ZXJ5U2VsZWN0b3IoJ2RkLndvcmRzJykudGV4dENvbnRlbnQ7XG4gICAgICAgIHZhciBjaGFwdGVyQ291bnQgPSAoX2EgPSB3b3JrTm9kZS5xdWVyeVNlbGVjdG9yKCdkZC5jaGFwdGVycyA+IGEnKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnRleHRDb250ZW50O1xuICAgICAgICBpZiAoIWNoYXB0ZXJDb3VudCkge1xuICAgICAgICAgICAgLy9vbmUtc2hvdFxuICAgICAgICAgICAgY2hhcHRlckNvdW50ID0gJzEnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgdGhpcyh3b3JrSWQsIHRpdGxlLCBhdXRob3JzLCBmYW5kb21zLCByZWxhdGlvbnNoaXBzLCB0YWdzLCBkZXNjcmlwdGlvbiwgcGFyc2VJbnQod29yZENvdW50LnJlcGxhY2UoLywvZywgJycpKSwgcGFyc2VJbnQoY2hhcHRlckNvdW50LnJlcGxhY2UoLywvZywgJycpKSwgXCJcIiwgMCwgMCk7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGVXb3JrKHdvcmtOb2RlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKCF3b3JrTm9kZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXb3JrIG5vdCBmb3VuZCBvbiBwYWdlYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgd29ya0lkID0gcGFyc2VJbnQod29ya05vZGUuaWQuc3BsaXQoJ18nKVsxXSk7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gd29ya05vZGUucXVlcnlTZWxlY3RvcignLmhlYWRpbmcgPiBhJykudGV4dENvbnRlbnQ7XG4gICAgICAgIGNvbnN0IGF1dGhvck5vZGVzID0gd29ya05vZGUucXVlcnlTZWxlY3RvckFsbChcIltyZWw9J2F1dGhvciddXCIpO1xuICAgICAgICBjb25zdCBhdXRob3JzID0gQXJyYXkuZnJvbShhdXRob3JOb2RlcykubWFwKChhdXRob3JOb2RlKSA9PiBhdXRob3JOb2RlLnRleHRDb250ZW50KTtcbiAgICAgICAgY29uc3QgZmFuZG9tTm9kZXMgPSB3b3JrTm9kZS5xdWVyeVNlbGVjdG9yQWxsKCcuZmFuZG9tcyA+IGEnKTtcbiAgICAgICAgY29uc3QgZmFuZG9tcyA9IEFycmF5LmZyb20oZmFuZG9tTm9kZXMpLm1hcCgoZmFuZG9tTm9kZSkgPT4gZmFuZG9tTm9kZS50ZXh0Q29udGVudCk7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcE5vZGVzID0gd29ya05vZGUucXVlcnlTZWxlY3RvckFsbCgnLnJlbGF0aW9uc2hpcHMgPiBhJyk7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSBBcnJheS5mcm9tKHJlbGF0aW9uc2hpcE5vZGVzKS5tYXAoKHJlbGF0aW9uc2hpcE5vZGUpID0+IHJlbGF0aW9uc2hpcE5vZGUudGV4dENvbnRlbnQpO1xuICAgICAgICBjb25zdCB0YWdOb2RlcyA9IHdvcmtOb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJy53YXJuaW5ncyA+IGEsIC5jaGFyYWN0ZXJzID4gYSwgLmZyZWVmb3JtcyA+IGEnKTtcbiAgICAgICAgY29uc3QgdGFncyA9IEFycmF5LmZyb20odGFnTm9kZXMpLm1hcCgodGFnTm9kZSkgPT4gdGFnTm9kZS50ZXh0Q29udGVudCk7XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gd29ya05vZGUucXVlcnlTZWxlY3RvcignLnN1bW1hcnkgPiBwJykudGV4dENvbnRlbnQ7XG4gICAgICAgIGNvbnN0IHdvcmRDb3VudCA9IHdvcmtOb2RlLnF1ZXJ5U2VsZWN0b3IoJ2RkLndvcmRzJykudGV4dENvbnRlbnQ7XG4gICAgICAgIHZhciBjaGFwdGVyQ291bnQgPSAoX2EgPSB3b3JrTm9kZS5xdWVyeVNlbGVjdG9yKCdkZC5jaGFwdGVycyA+IGEnKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnRleHRDb250ZW50O1xuICAgICAgICBpZiAoIWNoYXB0ZXJDb3VudCkge1xuICAgICAgICAgICAgLy9vbmUtc2hvdFxuICAgICAgICAgICAgY2hhcHRlckNvdW50ID0gJzEnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgdGhpcyh3b3JrSWQsIHRpdGxlLCBhdXRob3JzLCBmYW5kb21zLCByZWxhdGlvbnNoaXBzLCB0YWdzLCBkZXNjcmlwdGlvbiwgcGFyc2VJbnQod29yZENvdW50LnJlcGxhY2UoLywvZywgJycpKSwgcGFyc2VJbnQoY2hhcHRlckNvdW50LnJlcGxhY2UoLywvZywgJycpKSwgXCJcIiwgMCwgMCk7XG4gICAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwiY29udGVudF9zY3JpcHRcIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2hyb21lX2V4dGVuc2lvbl90eXBlc2NyaXB0X3N0YXJ0ZXJcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2hyb21lX2V4dGVuc2lvbl90eXBlc2NyaXB0X3N0YXJ0ZXJcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvclwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jb250ZW50X3NjcmlwdC50c3hcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==