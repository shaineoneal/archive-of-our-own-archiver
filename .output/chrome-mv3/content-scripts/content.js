var content = function() {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  var _a, _b;
  function defineContentScript(definition2) {
    return definition2;
  }
  const log = /* @__PURE__ */ function(environment) {
    return (...args) => {
      console.log(...args);
    };
  }();
  content;
  let port = null;
  const initializePort = () => {
    console.log("Initializing port...");
    if (!port) {
      port = chrome.runtime.connect({ name: "persistent-port" });
      port.onDisconnect.addListener(() => {
        log("Port disconnected.");
        port = null;
      });
    }
  };
  const closePort = () => {
    if (port) {
      port.disconnect();
      port = null;
    }
  };
  var MessageName = /* @__PURE__ */ ((MessageName2) => {
    MessageName2["AddWorkToSheet"] = "addWorkToSheet";
    MessageName2["CheckLogin"] = "checkLogin";
    MessageName2["GetAccessToken"] = "getAccessToken";
    MessageName2["QuerySpreadsheet"] = "querySpreadsheet";
    MessageName2["RemoveWorkFromSheet"] = "removeWorkFromSheet";
    MessageName2["RefreshAccessToken"] = "refreshAccessToken";
    MessageName2["UpdateWorkInSheet"] = "updateWorkInSheet";
    return MessageName2;
  })(MessageName || {});
  const sendMessage = (name, payload, callback) => {
    if (!port) {
      console.error("Port not initialized");
      return;
    }
    port.postMessage({ name, payload });
    const onResponse = (response) => {
      callback(response);
      port == null ? void 0 : port.onMessage.removeListener(onResponse);
    };
    port.onMessage.addListener(onResponse);
  };
  content;
  class BaseWork {
    constructor(workId) {
      __publicField(this, "workId");
      this.workId = workId;
    }
  }
  content;
  class Ao3_BaseWork extends BaseWork {
    constructor(workId, title, authors, fandoms, relationships, tags, description, wordCount, chapterCount) {
      super(workId);
      __publicField(this, "title");
      __publicField(this, "authors");
      __publicField(this, "fandoms");
      __publicField(this, "relationships");
      __publicField(this, "tags");
      __publicField(this, "description");
      __publicField(this, "wordCount");
      __publicField(this, "chapterCount");
      this.title = title;
      this.authors = authors;
      this.fandoms = fandoms;
      this.relationships = relationships;
      this.tags = tags;
      this.description = description;
      this.wordCount = wordCount;
      this.chapterCount = chapterCount;
    }
    getWork(workId) {
      var _a2;
      const workNode = document.querySelector(`#work_${workId}`);
      if (!workNode) {
        throw new Error(`Work ${workId} not found on page`);
      }
      const title = workNode.querySelector(".heading > a").textContent;
      const authorNodes = workNode.querySelectorAll("[rel='author']");
      const authors = Array.from(authorNodes).map(
        (authorNode) => authorNode.textContent
      );
      const fandomNodes = workNode.querySelectorAll(".fandoms > a");
      const fandoms = Array.from(fandomNodes).map(
        (fandomNode) => fandomNode.textContent
      );
      const relationships = ["placeholder"];
      const tags = ["placeholder"];
      const description = "longer placeholder";
      const wordCount = workNode.querySelector("dd.words").textContent;
      let chapterCount = (_a2 = workNode.querySelector("dd.chapters > a")) == null ? void 0 : _a2.textContent;
      if (!chapterCount) {
        chapterCount = "1";
      }
      return new Ao3_BaseWork(
        workId,
        title,
        authors,
        fandoms,
        relationships,
        tags,
        description,
        parseInt(wordCount.replace(/,/g, "")),
        parseInt(chapterCount.replace(/,/g, ""))
      );
    }
    static createWork(workNode) {
      var _a2;
      if (!workNode) {
        throw new Error(`Work not found on page`);
      }
      let workId;
      if (workNode.id) {
        workId = parseInt(workNode.id.split("_")[1]);
      } else {
        const workIdNode = workNode.querySelector(`.work`);
        if (!workIdNode) {
          throw new Error(`Work not found on page`);
        }
        workId = parseInt(workIdNode.id.split("_")[1]);
      }
      const title = workNode.querySelector(".heading > a").textContent;
      const authorNodes = workNode.querySelectorAll("[rel='author']");
      const authors = Array.from(authorNodes).map(
        (authorNode) => authorNode.textContent
      );
      const fandomNodes = workNode.querySelectorAll(".fandoms > a");
      const fandoms = Array.from(fandomNodes).map(
        (fandomNode) => fandomNode.textContent
      );
      const relationshipNodes = workNode.querySelectorAll(".relationships > a");
      const relationships = Array.from(relationshipNodes).map(
        (relationshipNode) => relationshipNode.textContent
      );
      const tagNodes = workNode.querySelectorAll(".warnings > a, .characters > a, .freeforms > a");
      const tags = Array.from(tagNodes).map(
        (tagNode) => tagNode.textContent
      );
      const description = workNode.querySelector(".summary > p").textContent;
      const wordCount = workNode.querySelector("dd.words").textContent;
      let chapterCount = (_a2 = workNode.querySelector("dd.chapters > a")) == null ? void 0 : _a2.textContent;
      if (!chapterCount) {
        chapterCount = "1";
      }
      return new this(
        workId,
        title,
        authors,
        fandoms,
        relationships,
        tags,
        description,
        parseInt(wordCount.replace(/,/g, "")),
        parseInt(chapterCount.replace(/,/g, ""))
      );
    }
  }
  content;
  const STATUS_CLASSES = {
    reading: "status-reading",
    toRead: "status-to-read",
    skipped: "status-skipped",
    dropped: "status-dropped",
    read: "status-read"
  };
  function changeBlurbStyle(workStatus, workWrap) {
    const wrapEl = workWrap;
    const work = wrapEl.querySelector(".work");
    const workEl = work;
    const toggleEl = wrapEl.querySelector(".blurb-toggle");
    log("wrapEl: ", wrapEl);
    log("toggleEl: ", toggleEl);
    log("workEl: ", workEl);
    switch (workStatus) {
      case "reading":
        workEl.classList.add("status", STATUS_CLASSES.reading);
        break;
      case "toRead":
        workEl.classList.add("status", "status-to-read");
        break;
      case "skipped":
        workEl.classList.add("status", "status-skipped");
        break;
      case "dropped":
        workEl.classList.add("status", "status-dropped");
        break;
      case "read":
        work.classList.add("status", "status-read");
        if (toggleEl.querySelector(".blurb-controls")) toggleEl.removeChild(toggleEl.querySelector(".blurb-controls"));
        if (toggleEl.querySelector(".blurb-info")) toggleEl.removeChild(toggleEl.querySelector(".blurb-info"));
        toggleEl.appendChild(addControls(wrapEl));
        toggleEl.appendChild(addInfo(workEl));
        break;
      default:
        Object.keys(STATUS_CLASSES).forEach((status) => {
          workEl.classList.remove(STATUS_CLASSES[status]);
        });
        workEl.querySelectorAll(".status").forEach((statusEl) => {
          statusEl.remove();
        });
        toggleEl.querySelectorAll(".blurb-info").forEach((infoEl) => {
          infoEl.remove();
        });
        toggleEl.querySelectorAll(".toggle").forEach((toggleEl2) => {
          toggleEl2.remove();
        });
        if (toggleEl.querySelector(".blurb-controls")) toggleEl.removeChild(toggleEl.querySelector(".blurb-controls"));
        toggleEl.appendChild(addControls(wrapEl));
        break;
    }
    log("work: ", workEl);
    return workEl;
  }
  content;
  var WorkStatus = /* @__PURE__ */ ((WorkStatus2) => {
    WorkStatus2["Reading"] = "reading";
    WorkStatus2["ToRead"] = "toRead";
    WorkStatus2["Skipped"] = "skipped";
    WorkStatus2["Dropped"] = "dropped";
    WorkStatus2["Read"] = "read";
    WorkStatus2["Default"] = "";
    return WorkStatus2;
  })(WorkStatus || {});
  content;
  const defaultHistory = [{
    action: "Added",
    date: (/* @__PURE__ */ new Date()).toLocaleString()
  }];
  class User_BaseWork extends BaseWork {
    constructor(workId, index, status, history, personalTags, rating, readCount, skipReason) {
      super(workId);
      __publicField(this, "index");
      __publicField(this, "status");
      __publicField(this, "history");
      __publicField(this, "personalTags");
      __publicField(this, "rating");
      __publicField(this, "readCount");
      __publicField(this, "skipReason");
      this.index = index ?? 0;
      this.status = status ?? WorkStatus.Read;
      this.history = history ?? defaultHistory;
      this.personalTags = personalTags ?? [];
      this.rating = rating ?? 0;
      this.readCount = readCount ?? 1;
      this.skipReason = skipReason ?? "";
    }
    getWork(workId) {
      return new User_BaseWork(
        0,
        workId,
        WorkStatus.Read,
        defaultHistory,
        [],
        0,
        0,
        ""
      );
    }
    saveWorkToSession(work) {
    }
  }
  content;
  function wrap(wrapee, wrapper) {
    wrapee.parentNode.insertBefore(wrapper, wrapee);
    wrapper.appendChild(wrapee);
  }
  content;
  content;
  function addBlurbControls(worksOnPage, boolRead) {
    worksOnPage.forEach((work, index) => {
      const workEl = work;
      const workIdClass = workEl.id.split("_")[1];
      const workWrap = document.createElement("div");
      workWrap.classList.add("blurb-with-toggles", "archiver-controls", workIdClass);
      workWrap.style.cssText = JSON.stringify(getComputedStyle(workEl));
      wrap(work, workWrap);
      const infoBox = document.createElement("li");
      infoBox.classList.add("blurb-toggle", "archiver-controls");
      workWrap.appendChild(infoBox);
      infoBox.appendChild(addControls(workWrap));
      workWrap.insertBefore(infoBox, work);
    });
  }
  function addWorkControl(workWrap) {
    const innerToggle = document.createElement("a");
    innerToggle.textContent = "Add Work";
    innerToggle.className = "toggle";
    innerToggle.addEventListener("click", async (e) => {
      e.preventDefault();
      log("addWork clicked!: ", workWrap);
      const workBlurb = Ao3_BaseWork.createWork(workWrap);
      log("workBlurb: ", workBlurb);
      sendMessage(
        MessageName.AddWorkToSheet,
        { work: workBlurb },
        (response) => {
          if (response.error) {
            log("addWork error: ", response.error);
          } else {
            log("content script response: ", response.response);
            changeBlurbStyle(WorkStatus.Read, workWrap);
          }
        }
      );
    });
    return innerToggle;
  }
  function removeWorkControl(workWrap) {
    const innerToggle = document.createElement("a");
    innerToggle.textContent = "Remove Work";
    innerToggle.className = "toggle";
    innerToggle.addEventListener("click", async (e) => {
      e.preventDefault();
      log("removeWork clicked!: ", workWrap);
      const workBlurb = Ao3_BaseWork.createWork(workWrap);
      log("workBlurb.workId: ", workBlurb);
      sendMessage(
        MessageName.RemoveWorkFromSheet,
        { workId: workBlurb.workId },
        (response) => {
          if (response.error) {
            log("removeWork error: ", response.error);
          } else {
            log("content script response: ", response.response);
            changeBlurbStyle(WorkStatus.Default, workWrap);
          }
        }
      );
    });
    return innerToggle;
  }
  function addControls(workWrap) {
    const work = workWrap.querySelector(".work");
    const workId = work.id.split("_")[1];
    const controls = document.createElement("div");
    controls.className = "blurb-controls";
    chrome.storage.session.get(workId, (result2) => {
      if (!result2[workId]) {
        controls.appendChild(addWorkControl(workWrap));
      } else {
        log(`Entry found for workId: ${workId}`, result2[workId]);
        controls.appendChild(incrementReadCountControl(workWrap));
        controls.appendChild(removeWorkControl(workWrap));
      }
    });
    return controls;
  }
  function addInfo(work) {
    log("adding info to work: ", work);
    const workId = work.id.split("_")[1];
    log("workId: ", workId);
    const info = document.createElement("div");
    info.className = "blurb-info";
    chrome.storage.session.get(workId, (result2) => {
      log("result from session store: ", result2);
      const userWork = result2[workId];
      log("userWork: ", userWork);
      const history = userWork.history ? typeof userWork.history === "string" ? JSON.parse(userWork.history) : userWork.history : [];
      let dateStr = "pre-2025";
      if (history.length !== 0) {
        const date = new Date(history[history.length - 1].date);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        dateStr = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
      }
      info.className = "blurb-info";
      const lastRead = document.createElement("p");
      lastRead.textContent = `Last read: ${dateStr}`;
      lastRead.classList.add("last-read", "datetime");
      const readCount = document.createElement("p");
      readCount.textContent = `Read ${userWork.readCount} time(s)`;
      readCount.classList.add("read-count", "datetime");
      info.appendChild(lastRead);
      info.appendChild(readCount);
    });
    return info;
  }
  function incrementReadCountControl(workWrap) {
    const innerToggle = document.createElement("a");
    innerToggle.textContent = "+1";
    innerToggle.className = "toggle";
    innerToggle.addEventListener("click", async (e) => {
      e.preventDefault();
      log("incrementReadCount clicked!: ", workWrap);
      const aWork = Ao3_BaseWork.createWork(workWrap);
      const workId = `${aWork.workId}`;
      chrome.storage.session.get(workId, (result2) => {
        if (!result2[workId]) {
          return;
        }
        const uWork = result2[aWork.workId];
        log("uWork: ", uWork);
        uWork.readCount += 1;
        const history = uWork.history ? typeof uWork.history === "string" ? JSON.parse(uWork.history) : uWork.history : [{ action: "added", date: "pre-2025" }];
        history.push({
          action: "reread",
          date: (/* @__PURE__ */ new Date()).toLocaleString()
        });
        log("hist", history);
        const work = new User_BaseWork(
          aWork.workId,
          uWork.index,
          uWork.status,
          history,
          uWork.personalTags,
          uWork.rating,
          uWork.readCount,
          uWork.skipReason
        );
        sendMessage(
          MessageName.UpdateWorkInSheet,
          { work },
          (response) => {
            if (response.error) {
              log("incrementReadCount error: ", response.error);
            } else {
              log("content script response: ", response.response);
              changeBlurbStyle(WorkStatus.Read, workWrap);
            }
          }
        );
      });
    });
    return innerToggle;
  }
  content;
  async function standardBlurbsPage() {
    const workStatuses = document.querySelectorAll(".blurb-with-toggles");
    if (workStatuses.length > 0) {
      log("Work statuses already injected.");
      return;
    }
    const worksOnPage = document.querySelectorAll("li.work, li.bookmark");
    let searchList = [];
    worksOnPage.forEach((work) => {
      const workEl = work;
      if (workEl.classList.contains("bookmark")) {
        searchList.push(Number(workEl.classList[3].split("-")[1]));
      } else {
        searchList.push(Number(workEl.id.split("_")[1]));
      }
    });
    log("searchList: ", searchList);
    initializePort();
    sendMessage(
      MessageName.QuerySpreadsheet,
      { list: searchList },
      async (response) => {
        log("QuerySpreadsheet response: ", response);
        if (response === null) {
          log("No work statuses to inject.");
          addBlurbControls(worksOnPage);
          return;
        }
        if (response.error) {
          log("Error querying spreadsheet: ", response.error);
          return;
        }
        await injectWorkStatuses(worksOnPage, response.response);
        log("Injected work statuses.");
        addBlurbControls(worksOnPage, response.response);
      }
    );
  }
  async function injectWorkStatuses(worksOnPage, response) {
    if (response === null) {
      return Error;
    } else {
      response.forEach((workRef, index) => {
        log("workRef: ", workRef);
        if (workRef) {
          const workId = worksOnPage[index].id.split("_")[1];
          chrome.storage.session.get(workId, (result2) => {
            log("session result: ", result2);
            if (result2[workId].status === WorkStatus.Read) {
              changeBlurbStyle(WorkStatus.Read, worksOnPage[index].parentNode);
            }
          });
        }
      });
    }
  }
  content;
  async function getAccessTokenCookie() {
    var _a2;
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim().split("="));
    log("cookies found: ", cookies);
    return (_a2 = cookies.find((cookie) => cookie[0] === "accessToken")) == null ? void 0 : _a2[1];
  }
  content;
  const messageListener = (message, sender, sendResponse) => {
    log("content_script", "heard message: ", message);
    if (message.message === "userChanged") {
      log("userChanged");
      handleUserChanged(sendResponse);
    }
  };
  function handleUserChanged(sendResponse) {
    disconnectContentScript();
    sendResponse({ response: "userChanged heard" });
  }
  function handleVisibilityChange() {
    if (document.visibilityState === "visible") {
      log("tab is now visible");
      initializePort();
      checkAccessToken();
    } else {
      log("tab is now hidden, closing port");
      closePort();
      disconnectContentScript();
    }
  }
  function checkAccessToken() {
    getAccessTokenCookie().then((accessToken) => {
      if (accessToken) {
        log("accessToken cookie found!: ", accessToken);
      } else {
        log("no accessToken cookie found");
        refreshAccessToken();
      }
    });
  }
  function refreshAccessToken() {
    sendMessage(
      MessageName.RefreshAccessToken,
      {},
      (response) => {
        if (response.error) {
          log("refreshAccessToken error: ", response.error);
        } else {
          log("refreshAccessToken response: ", response.response);
          pageTypeDetect();
        }
      }
    );
  }
  function pageTypeDetect() {
    if (document.querySelector(".index.group.work")) {
      standardBlurbsPage().then(() => {
        log("standardBlurbsPage done");
      });
    } else if (document.querySelector(".work.meta.group")) {
      log("Work Page");
    } else {
      log("PANIK: Unknown page");
    }
  }
  function disconnectContentScript() {
    chrome.runtime.onMessage.removeListener(messageListener);
    closePort();
  }
  function main() {
    log("log: content_script.tsx loaded");
    initializePort();
    sendMessage(
      MessageName.CheckLogin,
      {},
      (response) => {
        if (response.error) {
          log("checkLogin error: ", response.error);
        } else {
          log("checkLogin response: ", response.response);
          if (response.response) {
            log("user is logged in");
            pageTypeDetect();
          } else {
            log("user is not logged in");
          }
        }
      }
    );
  }
  chrome.runtime.onMessage.addListener(messageListener);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  main();
  content;
  const definition = defineContentScript({
    matches: ["*://*.archiveofourown.org/*"],
    runAt: "document_end",
    async main() {
      console.log("content script running");
      chrome.runtime.onMessage.addListener(messageListener);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      main();
    }
  });
  content;
  const browser = (
    // @ts-expect-error
    ((_b = (_a = globalThis.browser) == null ? void 0 : _a.runtime) == null ? void 0 : _b.id) == null ? globalThis.chrome : (
      // @ts-expect-error
      globalThis.browser
    )
  );
  function print$1(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger$1 = {
    debug: (...args) => print$1(console.debug, ...args),
    log: (...args) => print$1(console.log, ...args),
    warn: (...args) => print$1(console.warn, ...args),
    error: (...args) => print$1(console.error, ...args)
  };
  const _WxtLocationChangeEvent = class _WxtLocationChangeEvent extends Event {
    constructor(newUrl, oldUrl) {
      super(_WxtLocationChangeEvent.EVENT_NAME, {});
      this.newUrl = newUrl;
      this.oldUrl = oldUrl;
    }
  };
  __publicField(_WxtLocationChangeEvent, "EVENT_NAME", getUniqueEventName("wxt:locationchange"));
  let WxtLocationChangeEvent = _WxtLocationChangeEvent;
  function getUniqueEventName(eventName) {
    var _a2;
    return `${(_a2 = browser == null ? void 0 : browser.runtime) == null ? void 0 : _a2.id}:${"content"}:${eventName}`;
  }
  function createLocationWatcher(ctx) {
    let interval;
    let oldUrl;
    return {
      /**
       * Ensure the location watcher is actively looking for URL changes. If it's already watching,
       * this is a noop.
       */
      run() {
        if (interval != null) return;
        oldUrl = new URL(location.href);
        interval = ctx.setInterval(() => {
          let newUrl = new URL(location.href);
          if (newUrl.href !== oldUrl.href) {
            window.dispatchEvent(new WxtLocationChangeEvent(newUrl, oldUrl));
            oldUrl = newUrl;
          }
        }, 1e3);
      }
    };
  }
  const _ContentScriptContext = class _ContentScriptContext {
    constructor(contentScriptName, options) {
      __publicField(this, "isTopFrame", window.self === window.top);
      __publicField(this, "abortController");
      __publicField(this, "locationWatcher", createLocationWatcher(this));
      __publicField(this, "receivedMessageIds", /* @__PURE__ */ new Set());
      this.contentScriptName = contentScriptName;
      this.options = options;
      this.abortController = new AbortController();
      if (this.isTopFrame) {
        this.listenForNewerScripts({ ignoreFirstEvent: true });
        this.stopOldScripts();
      } else {
        this.listenForNewerScripts();
      }
    }
    get signal() {
      return this.abortController.signal;
    }
    abort(reason) {
      return this.abortController.abort(reason);
    }
    get isInvalid() {
      if (browser.runtime.id == null) {
        this.notifyInvalidated();
      }
      return this.signal.aborted;
    }
    get isValid() {
      return !this.isInvalid;
    }
    /**
     * Add a listener that is called when the content script's context is invalidated.
     *
     * @returns A function to remove the listener.
     *
     * @example
     * browser.runtime.onMessage.addListener(cb);
     * const removeInvalidatedListener = ctx.onInvalidated(() => {
     *   browser.runtime.onMessage.removeListener(cb);
     * })
     * // ...
     * removeInvalidatedListener();
     */
    onInvalidated(cb) {
      this.signal.addEventListener("abort", cb);
      return () => this.signal.removeEventListener("abort", cb);
    }
    /**
     * Return a promise that never resolves. Useful if you have an async function that shouldn't run
     * after the context is expired.
     *
     * @example
     * const getValueFromStorage = async () => {
     *   if (ctx.isInvalid) return ctx.block();
     *
     *   // ...
     * }
     */
    block() {
      return new Promise(() => {
      });
    }
    /**
     * Wrapper around `window.setInterval` that automatically clears the interval when invalidated.
     */
    setInterval(handler, timeout) {
      const id = setInterval(() => {
        if (this.isValid) handler();
      }, timeout);
      this.onInvalidated(() => clearInterval(id));
      return id;
    }
    /**
     * Wrapper around `window.setTimeout` that automatically clears the interval when invalidated.
     */
    setTimeout(handler, timeout) {
      const id = setTimeout(() => {
        if (this.isValid) handler();
      }, timeout);
      this.onInvalidated(() => clearTimeout(id));
      return id;
    }
    /**
     * Wrapper around `window.requestAnimationFrame` that automatically cancels the request when
     * invalidated.
     */
    requestAnimationFrame(callback) {
      const id = requestAnimationFrame((...args) => {
        if (this.isValid) callback(...args);
      });
      this.onInvalidated(() => cancelAnimationFrame(id));
      return id;
    }
    /**
     * Wrapper around `window.requestIdleCallback` that automatically cancels the request when
     * invalidated.
     */
    requestIdleCallback(callback, options) {
      const id = requestIdleCallback((...args) => {
        if (!this.signal.aborted) callback(...args);
      }, options);
      this.onInvalidated(() => cancelIdleCallback(id));
      return id;
    }
    addEventListener(target, type, handler, options) {
      var _a2;
      if (type === "wxt:locationchange") {
        if (this.isValid) this.locationWatcher.run();
      }
      (_a2 = target.addEventListener) == null ? void 0 : _a2.call(
        target,
        type.startsWith("wxt:") ? getUniqueEventName(type) : type,
        handler,
        {
          ...options,
          signal: this.signal
        }
      );
    }
    /**
     * @internal
     * Abort the abort controller and execute all `onInvalidated` listeners.
     */
    notifyInvalidated() {
      this.abort("Content script context invalidated");
      logger$1.debug(
        `Content script "${this.contentScriptName}" context invalidated`
      );
    }
    stopOldScripts() {
      window.postMessage(
        {
          type: _ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE,
          contentScriptName: this.contentScriptName,
          messageId: Math.random().toString(36).slice(2)
        },
        "*"
      );
    }
    verifyScriptStartedEvent(event) {
      var _a2, _b2, _c;
      const isScriptStartedEvent = ((_a2 = event.data) == null ? void 0 : _a2.type) === _ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE;
      const isSameContentScript = ((_b2 = event.data) == null ? void 0 : _b2.contentScriptName) === this.contentScriptName;
      const isNotDuplicate = !this.receivedMessageIds.has((_c = event.data) == null ? void 0 : _c.messageId);
      return isScriptStartedEvent && isSameContentScript && isNotDuplicate;
    }
    listenForNewerScripts(options) {
      let isFirst = true;
      const cb = (event) => {
        if (this.verifyScriptStartedEvent(event)) {
          this.receivedMessageIds.add(event.data.messageId);
          const wasFirst = isFirst;
          isFirst = false;
          if (wasFirst && (options == null ? void 0 : options.ignoreFirstEvent)) return;
          this.notifyInvalidated();
        }
      };
      addEventListener("message", cb);
      this.onInvalidated(() => removeEventListener("message", cb));
    }
  };
  __publicField(_ContentScriptContext, "SCRIPT_STARTED_MESSAGE_TYPE", getUniqueEventName(
    "wxt:content-script-started"
  ));
  let ContentScriptContext = _ContentScriptContext;
  const nullKey = Symbol("null");
  let keyCounter = 0;
  class ManyKeysMap extends Map {
    constructor() {
      super();
      this._objectHashes = /* @__PURE__ */ new WeakMap();
      this._symbolHashes = /* @__PURE__ */ new Map();
      this._publicKeys = /* @__PURE__ */ new Map();
      const [pairs] = arguments;
      if (pairs === null || pairs === void 0) {
        return;
      }
      if (typeof pairs[Symbol.iterator] !== "function") {
        throw new TypeError(typeof pairs + " is not iterable (cannot read property Symbol(Symbol.iterator))");
      }
      for (const [keys, value] of pairs) {
        this.set(keys, value);
      }
    }
    _getPublicKeys(keys, create = false) {
      if (!Array.isArray(keys)) {
        throw new TypeError("The keys parameter must be an array");
      }
      const privateKey = this._getPrivateKey(keys, create);
      let publicKey;
      if (privateKey && this._publicKeys.has(privateKey)) {
        publicKey = this._publicKeys.get(privateKey);
      } else if (create) {
        publicKey = [...keys];
        this._publicKeys.set(privateKey, publicKey);
      }
      return { privateKey, publicKey };
    }
    _getPrivateKey(keys, create = false) {
      const privateKeys = [];
      for (let key of keys) {
        if (key === null) {
          key = nullKey;
        }
        const hashes = typeof key === "object" || typeof key === "function" ? "_objectHashes" : typeof key === "symbol" ? "_symbolHashes" : false;
        if (!hashes) {
          privateKeys.push(key);
        } else if (this[hashes].has(key)) {
          privateKeys.push(this[hashes].get(key));
        } else if (create) {
          const privateKey = `@@mkm-ref-${keyCounter++}@@`;
          this[hashes].set(key, privateKey);
          privateKeys.push(privateKey);
        } else {
          return false;
        }
      }
      return JSON.stringify(privateKeys);
    }
    set(keys, value) {
      const { publicKey } = this._getPublicKeys(keys, true);
      return super.set(publicKey, value);
    }
    get(keys) {
      const { publicKey } = this._getPublicKeys(keys);
      return super.get(publicKey);
    }
    has(keys) {
      const { publicKey } = this._getPublicKeys(keys);
      return super.has(publicKey);
    }
    delete(keys) {
      const { publicKey, privateKey } = this._getPublicKeys(keys);
      return Boolean(publicKey && super.delete(publicKey) && this._publicKeys.delete(privateKey));
    }
    clear() {
      super.clear();
      this._symbolHashes.clear();
      this._publicKeys.clear();
    }
    get [Symbol.toStringTag]() {
      return "ManyKeysMap";
    }
    get size() {
      return super.size;
    }
  }
  new ManyKeysMap();
  function initPlugins() {
  }
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  const result = (async () => {
    try {
      initPlugins();
      const { main: main2, ...options } = definition;
      const ctx = new ContentScriptContext("content", options);
      return await main2(ctx);
    } catch (err) {
      logger.error(
        `The content script "${"content"}" crashed on startup!`,
        err
      );
      throw err;
    }
  })();
  return result;
}();
content;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3NhbmRib3gvZGVmaW5lLWNvbnRlbnQtc2NyaXB0Lm1qcyIsIi4uLy4uLy4uL3V0aWxzL2xvZ2dlci50cyIsIi4uLy4uLy4uL3V0aWxzL2Nocm9tZS1zZXJ2aWNlcy9tZXNzYWdpbmcudHMiLCIuLi8uLi8uLi9lbnRyeXBvaW50cy9jb250ZW50L0Jhc2VXb3JrLnRzIiwiLi4vLi4vLi4vZW50cnlwb2ludHMvY29udGVudC9BbzNfQmFzZVdvcmsudHMiLCIuLi8uLi8uLi9lbnRyeXBvaW50cy9jb250ZW50L2NoYW5nZUJsdXJiU3R5bGUudHN4IiwiLi4vLi4vLi4vdXRpbHMvdHlwZXMvZGF0YS50cyIsIi4uLy4uLy4uL2VudHJ5cG9pbnRzL2NvbnRlbnQvVXNlcl9CYXNlV29yay50c3giLCIuLi8uLi8uLi91dGlscy93cmFwcGVyLnRzIiwiLi4vLi4vLi4vZW50cnlwb2ludHMvY29udGVudC9ibHVyYkNvbnRyb2xzLnRzeCIsIi4uLy4uLy4uL2VudHJ5cG9pbnRzL2NvbnRlbnQvYmx1cmJzUGFnZS50c3giLCIuLi8uLi8uLi91dGlscy9jaHJvbWUtc2VydmljZXMvY29va2llcy50cyIsIi4uLy4uLy4uL2VudHJ5cG9pbnRzL2NvbnRlbnQvY29udGVudF9zY3JpcHQudHN4IiwiLi4vLi4vLi4vZW50cnlwb2ludHMvY29udGVudC9pbmRleC50cyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC9icm93c2VyL2Nocm9tZS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvd3h0L2Rpc3Qvc2FuZGJveC91dGlscy9sb2dnZXIubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2NsaWVudC9jb250ZW50LXNjcmlwdHMvY3VzdG9tLWV2ZW50cy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvY2xpZW50L2NvbnRlbnQtc2NyaXB0cy9sb2NhdGlvbi13YXRjaGVyLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC9jbGllbnQvY29udGVudC1zY3JpcHRzL2NvbnRlbnQtc2NyaXB0LWNvbnRleHQubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21hbnkta2V5cy1tYXAvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQDFuYXRzdS93YWl0LWVsZW1lbnQvZGlzdC9pbmRleC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUNvbnRlbnRTY3JpcHQoZGVmaW5pdGlvbikge1xuICByZXR1cm4gZGVmaW5pdGlvbjtcbn1cbiIsIi8qKlxyXG4gKiBMb2dzIG1lc3NhZ2VzIHRvIHRoZSBjb25zb2xlIGluIG5vbi1wcm9kdWN0aW9uIGVudmlyb25tZW50cy5cclxuICogSW4gcHJvZHVjdGlvbiwgdGhlIGxvZyBmdW5jdGlvbiBkb2VzIG5vdGhpbmcuXHJcbiAqXHJcbiAqIEBwYXJhbSBlbnZpcm9ubWVudCAtIFRoZSBjdXJyZW50IGVudmlyb25tZW50IChlLmcuLCAncHJvZHVjdGlvbicsICdkZXZlbG9wbWVudCcpLlxyXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgbG9ncyBtZXNzYWdlcyB0byB0aGUgY29uc29sZSBpbiBub24tcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMuXHJcbiAqICAgICAgICAgIEluIHByb2R1Y3Rpb24sIHRoZSBmdW5jdGlvbiBpcyBhIG5vLW9wLlxyXG4gKlxyXG4gKiBUaGUgbG9nIGZ1bmN0aW9uIGNhcHR1cmVzIHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGNhbGxlZCBpdCBhbmQgaW5jbHVkZXMgaXQgaW4gdGhlIGxvZyBtZXNzYWdlLlxyXG4gKiBUaGlzIGlzIHVzZWZ1bCBmb3IgZGVidWdnaW5nIHB1cnBvc2VzIHRvIHRyYWNlIHdoZXJlIHRoZSBsb2cgbWVzc2FnZSBvcmlnaW5hdGVkLlxyXG4gKlxyXG4gKiBFeGFtcGxlIHVzYWdlOlxyXG4gKiBgYGB0eXBlc2NyaXB0XHJcbiAqIGxvZygnVGhpcyBpcyBhIGRlYnVnIG1lc3NhZ2UnKTtcclxuICogYGBgXHJcbiAqL1xyXG5jb25zdCBsb2cgPSAoZnVuY3Rpb24gKGVudmlyb25tZW50KSB7XHJcbiAgICBpZiAoZW52aXJvbm1lbnQgPT09ICdwcm9kdWN0aW9uJykge1xyXG4gICAgICAgIC8vcmV0dXJuICgpID0+IHt9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICguLi5hcmdzOiBhbnkpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyguLi5hcmdzKTtcclxuICAgIH07XHJcbn0pKHByb2Nlc3MuZW52Lk5PREVfRU5WKTtcclxuXHJcbmV4cG9ydCB7IGxvZyB9OyIsImltcG9ydCB7IEFvM19CYXNlV29yaywgVXNlcl9CYXNlV29yayB9IGZyb20gXCJAL2VudHJ5cG9pbnRzL2NvbnRlbnRcIjtcclxuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIkAvdXRpbHMvbG9nZ2VyLnRzXCI7XHJcbmltcG9ydCB7IE1lc3NhZ2VSZXNwb25zZSB9IGZyb20gXCJAL3V0aWxzL3R5cGVzL01lc3NhZ2VSZXNwb25zZVwiO1xyXG5cclxubGV0IHBvcnQ6IGNocm9tZS5ydW50aW1lLlBvcnQgfCBudWxsID0gbnVsbDtcclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplcyB0aGUgcGVyc2lzdGVudCBwb3J0IGZvciBjb21tdW5pY2F0aW9uIHdpdGggdGhlIGJhY2tncm91bmQgc2NyaXB0LlxyXG4gKiBJZiB0aGUgcG9ydCBpcyBhbHJlYWR5IGluaXRpYWxpemVkLCBpdCBkb2VzIG5vdGhpbmcuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZVBvcnQgPSAoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBwb3J0Li4uXCIpO1xyXG4gICAgaWYgKCFwb3J0KSB7XHJcbiAgICAgICAgcG9ydCA9IGNocm9tZS5ydW50aW1lLmNvbm5lY3QoeyBuYW1lOiBcInBlcnNpc3RlbnQtcG9ydFwiIH0pO1xyXG5cclxuICAgICAgICBwb3J0Lm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcigoKSA9PiB7XHJcbiAgICAgICAgICAgIGxvZyhcIlBvcnQgZGlzY29ubmVjdGVkLlwiKTtcclxuICAgICAgICAgICAgcG9ydCA9IG51bGw7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgY2xvc2VQb3J0ID0gKCkgPT4ge1xyXG4gICAgaWYgKHBvcnQpIHtcclxuICAgICAgICBwb3J0LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICBwb3J0ID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEVudW0gb2YgbWVzc2FnZSBuYW1lcy5cclxuICpcclxuICogRWFjaCBtZXNzYWdlIG5hbWUgaXMgYSBwcm9wZXJ0eSBvZiB0aGUgTWVzc2FnZXMgaW50ZXJmYWNlLlxyXG4gKi9cclxuZXhwb3J0IGVudW0gTWVzc2FnZU5hbWUge1xyXG4gICAgQWRkV29ya1RvU2hlZXQgPSAnYWRkV29ya1RvU2hlZXQnLFxyXG4gICAgQ2hlY2tMb2dpbiA9ICdjaGVja0xvZ2luJyxcclxuICAgIEdldEFjY2Vzc1Rva2VuID0gJ2dldEFjY2Vzc1Rva2VuJyxcclxuICAgIFF1ZXJ5U3ByZWFkc2hlZXQgPSAncXVlcnlTcHJlYWRzaGVldCcsXHJcbiAgICBSZW1vdmVXb3JrRnJvbVNoZWV0ID0gJ3JlbW92ZVdvcmtGcm9tU2hlZXQnLFxyXG4gICAgUmVmcmVzaEFjY2Vzc1Rva2VuID0gJ3JlZnJlc2hBY2Nlc3NUb2tlbicsXHJcbiAgICBVcGRhdGVXb3JrSW5TaGVldCA9ICd1cGRhdGVXb3JrSW5TaGVldCcsXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbnRlcmZhY2UgZGVzY3JpYmluZyB0aGUgc2hhcGUgb2YgYSBtZXNzYWdlLlxyXG4gKlxyXG4gKiBBIG1lc3NhZ2UgaGFzIGEgcGF5bG9hZCBhbmQgYSByZXNwb25zZS5cclxuICovXHJcbmludGVyZmFjZSBNZXNzYWdlIHtcclxuICAgIHBheWxvYWQ6IHVua25vd247XHJcbiAgICByZXNwb25zZTogdW5rbm93bjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEludGVyZmFjZSBkZXNjcmliaW5nIHRoZSBzaGFwZSBvZiBhbGwgbWVzc2FnZXMuXHJcbiAqXHJcbiAqIEVhY2ggcHJvcGVydHkgb2YgdGhlIE1lc3NhZ2VzIGludGVyZmFjZSByZXByZXNlbnRzIGEgbWVzc2FnZSBuYW1lLlxyXG4gKiBUaGUgdmFsdWUgb2YgZWFjaCBwcm9wZXJ0eSBpcyBhbiBvYmplY3Qgd2l0aCB0d28gcHJvcGVydGllczogcGF5bG9hZCBhbmQgcmVzcG9uc2UuXHJcbiAqIFRoZSBwYXlsb2FkIHByb3BlcnR5IHJlcHJlc2VudHMgdGhlIGRhdGEgc2VudCBpbiB0aGUgbWVzc2FnZS5cclxuICogVGhlIHJlc3BvbnNlIHByb3BlcnR5IHJlcHJlc2VudHMgdGhlIGRhdGEgcmV0dXJuZWQgaW4gdGhlIHJlc3BvbnNlLlxyXG4gKi9cclxuaW50ZXJmYWNlIE1lc3NhZ2VzIGV4dGVuZHMgUGFydGlhbDxSZWNvcmQ8TWVzc2FnZU5hbWUsIE1lc3NhZ2U+PiB7XHJcbiAgICBbTWVzc2FnZU5hbWUuQWRkV29ya1RvU2hlZXRdOiB7XHJcbiAgICAgICAgcGF5bG9hZDoge1xyXG4gICAgICAgICAgICB3b3JrOiBBbzNfQmFzZVdvcms7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXNwb25zZTogTWVzc2FnZVJlc3BvbnNlPFVzZXJfQmFzZVdvcms+O1xyXG4gICAgfTtcclxuICAgIFtNZXNzYWdlTmFtZS5DaGVja0xvZ2luXToge1xyXG4gICAgICAgIHBheWxvYWQ6IHt9O1xyXG4gICAgICAgIHJlc3BvbnNlOiBNZXNzYWdlUmVzcG9uc2U8Ym9vbGVhbj47XHJcbiAgICB9XHJcbiAgICBbTWVzc2FnZU5hbWUuR2V0QWNjZXNzVG9rZW5dOiB7XHJcbiAgICAgICAgcGF5bG9hZDoge1xyXG4gICAgICAgICAgICByZWFzb246IHN0cmluZztcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlc3BvbnNlOiBNZXNzYWdlUmVzcG9uc2U8c3RyaW5nPjtcclxuICAgIH07XHJcbiAgICBbTWVzc2FnZU5hbWUuUXVlcnlTcHJlYWRzaGVldF06IHtcclxuICAgICAgICBwYXlsb2FkOiB7XHJcbiAgICAgICAgICAgIGxpc3Q6IG51bWJlcltdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVzcG9uc2U6IE1lc3NhZ2VSZXNwb25zZTxib29sZWFuW10+O1xyXG4gICAgfTtcclxuICAgIFtNZXNzYWdlTmFtZS5SZW1vdmVXb3JrRnJvbVNoZWV0XToge1xyXG4gICAgICAgIHBheWxvYWQ6IHtcclxuICAgICAgICAgICAgd29ya0lkOiBudW1iZXI7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXNwb25zZTogTWVzc2FnZVJlc3BvbnNlPGJvb2xlYW4+O1xyXG4gICAgfTtcclxuICAgIFtNZXNzYWdlTmFtZS5SZWZyZXNoQWNjZXNzVG9rZW5dOiB7XHJcbiAgICAgICAgcGF5bG9hZDoge307XHJcbiAgICAgICAgcmVzcG9uc2U6IE1lc3NhZ2VSZXNwb25zZTxzdHJpbmc+O1xyXG4gICAgfTtcclxuICAgIFtNZXNzYWdlTmFtZS5VcGRhdGVXb3JrSW5TaGVldF06IHtcclxuICAgICAgICBwYXlsb2FkOiB7XHJcbiAgICAgICAgICAgIHdvcms6IFVzZXJfQmFzZVdvcms7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXNwb25zZTogTWVzc2FnZVJlc3BvbnNlPGJvb2xlYW4+O1xyXG4gICAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFR5cGUgcmVwcmVzZW50aW5nIGFsbCBtZXNzYWdlIG5hbWVzLlxyXG4gKlxyXG4gKiBVc2VkIHRvIGluZmVyIHRoZSB0eXBlIG9mIHRoZSBtZXNzYWdlIG5hbWUgcGFyYW1ldGVyIGluIHNlbmRNZXNzYWdlIGFuZCByZWNlaXZlTWVzc2FnZS5cclxuICovXHJcbnR5cGUgTWVzc2FnZVR5cGVzID0ga2V5b2YgTWVzc2FnZXM7XHJcblxyXG4vKipcclxuICogVHlwZSByZXByZXNlbnRpbmcgdGhlIHBheWxvYWQgb2YgYSBtZXNzYWdlLlxyXG4gKlxyXG4gKiBVc2VkIHRvIGluZmVyIHRoZSB0eXBlIG9mIHRoZSBwYXlsb2FkIHBhcmFtZXRlciBpbiBzZW5kTWVzc2FnZSBhbmQgcmVjZWl2ZU1lc3NhZ2UuXHJcbiAqIEBwYXJhbSBUIC0gVGhlIG1lc3NhZ2UgbmFtZS5cclxuICovXHJcbnR5cGUgTWVzc2FnZVBheWxvYWQ8VCBleHRlbmRzIE1lc3NhZ2VUeXBlcz4gPSBNZXNzYWdlc1tUXVsncGF5bG9hZCddXHJcblxyXG4vKipcclxuICogVHlwZSByZXByZXNlbnRpbmcgdGhlIHJlc3BvbnNlIG9mIGEgbWVzc2FnZS5cclxuICpcclxuICogVXNlZCB0byBpbmZlciB0aGUgdHlwZSBvZiB0aGUgcmVzcG9uc2UgcGFyYW1ldGVyIGluIHNlbmRNZXNzYWdlIGFuZCByZWNlaXZlTWVzc2FnZS5cclxuICogQHBhcmFtIFQgLSBUaGUgbWVzc2FnZSBuYW1lLlxyXG4gKi9cclxudHlwZSBNZXNzYWdlUmVzcG9uc2VUeXBlPFQgZXh0ZW5kcyBNZXNzYWdlVHlwZXM+ID0gTWVzc2FnZXNbVF1bJ3Jlc3BvbnNlJ11cclxuXHJcbi8qKlxyXG4gKiBUeXBlIHJlcHJlc2VudGluZyB0aGUgY2FsbGJhY2sgb2YgYSBtZXNzYWdlLlxyXG4gKlxyXG4gKiBVc2VkIHRvIGluZmVyIHRoZSB0eXBlIG9mIHRoZSBjYWxsYmFjayBwYXJhbWV0ZXIgaW4gc2VuZE1lc3NhZ2UgYW5kIHJlY2VpdmVNZXNzYWdlLlxyXG4gKiBAcGFyYW0gVCAtIFRoZSBtZXNzYWdlIG5hbWUuXHJcbiAqL1xyXG50eXBlIE1lc3NhZ2VDYWxsYmFjazxUIGV4dGVuZHMgTWVzc2FnZVR5cGVzPiA9IChyZXNwb25zZTogTWVzc2FnZVJlc3BvbnNlVHlwZTxUPikgPT4gdm9pZDtcclxuXHJcbi8qKlxyXG4gKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxyXG4gKlxyXG4gKiBAYXN5bmNcclxuICogQHBhcmFtIG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgbWVzc2FnZSB0byBzZW5kLlxyXG4gKiBAcGFyYW0gcGF5bG9hZCAtIFRoZSBkYXRhIHRvIHNlbmQgaW4gdGhlIG1lc3NhZ2UuXHJcbiAqIEBwYXJhbSBjYWxsYmFjayAtIEEgZnVuY3Rpb24gdGhhdCBwcm9jZXNzZXMgdGhlIHJlc3BvbnNlLlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHNlbmRNZXNzYWdlID0gPFQgZXh0ZW5kcyBNZXNzYWdlVHlwZXM+KFxyXG4gICAgbmFtZTogVCxcclxuICAgIHBheWxvYWQ6IE1lc3NhZ2VQYXlsb2FkPFQ+LFxyXG4gICAgY2FsbGJhY2s6IE1lc3NhZ2VDYWxsYmFjazxUPixcclxuKTogdm9pZCA9PiB7XHJcbiAgICBpZiAoIXBvcnQpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdQb3J0IG5vdCBpbml0aWFsaXplZCcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHBvcnQucG9zdE1lc3NhZ2UoeyBuYW1lLCBwYXlsb2FkIH0pO1xyXG5cclxuICAgIC8vIExpc3RlbiBmb3IgYSBzaW5nbGUgcmVzcG9uc2VcclxuICAgIGNvbnN0IG9uUmVzcG9uc2UgPSAocmVzcG9uc2U6IE1lc3NhZ2VSZXNwb25zZVR5cGU8VD4pID0+IHtcclxuICAgICAgICBjYWxsYmFjayhyZXNwb25zZSk7XHJcbiAgICAgICAgcG9ydD8ub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKG9uUmVzcG9uc2UpO1xyXG4gICAgfVxyXG4gICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIob25SZXNwb25zZSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgY3JlYXRlTWVzc2FnZUhhbmRsZXJzID0gKGhhbmRsZXJzOiB7XHJcbiAgICBbSyBpbiBNZXNzYWdlVHlwZXNdPzogKHBheWxvYWQ6IE1lc3NhZ2VQYXlsb2FkPEs+KSA9PiBQcm9taXNlPE1lc3NhZ2VSZXNwb25zZVR5cGU8Sz4+O1xyXG59KTogdm9pZCA9PiB7XHJcbiAgICBjaHJvbWUucnVudGltZS5vbkNvbm5lY3QuYWRkTGlzdGVuZXIoKHBvcnQpID0+IHtcclxuICAgICAgICBwb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihhc3luYyAobWVzc2FnZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7IG5hbWUsIHBheWxvYWQgfSA9IG1lc3NhZ2U7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gaGFuZGxlcnNbbWVzc2FnZS5uYW1lIGFzIE1lc3NhZ2VUeXBlc107XHJcbiAgICAgICAgICAgIGlmICghaGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgcG9ydC5wb3N0TWVzc2FnZSh7IGVycm9yOiBgTm8gaGFuZGxlciBmb3IgbWVzc2FnZTogJHtuYW1lfWAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGhhbmRsZXIocGF5bG9hZCk7XHJcbiAgICAgICAgICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHBvcnQucG9zdE1lc3NhZ2UoeyBlcnJvciB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07IiwiaW1wb3J0IHsgQW8zX0Jhc2VXb3JrIH0gZnJvbSBcIi4vQW8zX0Jhc2VXb3JrLnRzXCI7XHJcbmltcG9ydCB7IFVzZXJfQmFzZVdvcmsgfSBmcm9tIFwiLi9Vc2VyX0Jhc2VXb3JrLnRzeFwiO1xyXG5pbXBvcnQgeyBXb3JrU3RhdHVzIH0gZnJvbSBcIkAvdXRpbHMvdHlwZXMvZGF0YS50c1wiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VXb3JrIHtcclxuICAgIHdvcmtJZDogbnVtYmVyO1xyXG5cclxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcih3b3JrSWQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMud29ya0lkID0gd29ya0lkO1xyXG4gICAgfVxyXG5cclxuICAgIGFic3RyYWN0IGdldFdvcmsod29ya0lkOiBudW1iZXIpOiBBbzNfQmFzZVdvcmsgfCBVc2VyX0Jhc2VXb3JrO1xyXG59IiwiaW1wb3J0IHsgQmFzZVdvcmsgfSBmcm9tIFwiLi9CYXNlV29yay50c1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFvM19CYXNlV29yayBleHRlbmRzIEJhc2VXb3JrIHtcclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcbiAgICBhdXRob3JzOiBzdHJpbmdbXTtcclxuICAgIGZhbmRvbXM6IHN0cmluZ1tdO1xyXG4gICAgcmVsYXRpb25zaGlwczogc3RyaW5nW107XHJcbiAgICB0YWdzOiBzdHJpbmdbXTtcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgICB3b3JkQ291bnQ6IG51bWJlcjtcclxuICAgIGNoYXB0ZXJDb3VudDogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHdvcmtJZDogbnVtYmVyLCB0aXRsZTogc3RyaW5nLCBhdXRob3JzOiBzdHJpbmdbXSwgZmFuZG9tczogc3RyaW5nW10sIHJlbGF0aW9uc2hpcHM6IHN0cmluZ1tdLCB0YWdzOiBzdHJpbmdbXSwgZGVzY3JpcHRpb246IHN0cmluZywgd29yZENvdW50OiBudW1iZXIsIGNoYXB0ZXJDb3VudDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIod29ya0lkKTtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdGhpcy5hdXRob3JzID0gYXV0aG9ycztcclxuICAgICAgICB0aGlzLmZhbmRvbXMgPSBmYW5kb21zO1xyXG4gICAgICAgIHRoaXMucmVsYXRpb25zaGlwcyA9IHJlbGF0aW9uc2hpcHM7XHJcbiAgICAgICAgdGhpcy50YWdzID0gdGFncztcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICAgICAgdGhpcy53b3JkQ291bnQgPSB3b3JkQ291bnQ7XHJcbiAgICAgICAgdGhpcy5jaGFwdGVyQ291bnQgPSBjaGFwdGVyQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0V29yayh3b3JrSWQ6IG51bWJlcik6IEFvM19CYXNlV29yayB7XHJcbiAgICAgICAgY29uc3Qgd29ya05vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjd29ya18ke3dvcmtJZH1gKTtcclxuXHJcbiAgICAgICAgaWYgKCF3b3JrTm9kZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdvcmsgJHt3b3JrSWR9IG5vdCBmb3VuZCBvbiBwYWdlYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHRpdGxlID0gd29ya05vZGUucXVlcnlTZWxlY3RvcignLmhlYWRpbmcgPiBhJykhLnRleHRDb250ZW50O1xyXG5cclxuICAgICAgICBjb25zdCBhdXRob3JOb2RlcyA9IHdvcmtOb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbcmVsPSdhdXRob3InXVwiKTtcclxuICAgICAgICBjb25zdCBhdXRob3JzID0gQXJyYXkuZnJvbShhdXRob3JOb2RlcykubWFwKFxyXG4gICAgICAgICAgICAoYXV0aG9yTm9kZSkgPT4gYXV0aG9yTm9kZS50ZXh0Q29udGVudFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IGZhbmRvbU5vZGVzID0gd29ya05vZGUucXVlcnlTZWxlY3RvckFsbCgnLmZhbmRvbXMgPiBhJyk7XHJcbiAgICAgICAgY29uc3QgZmFuZG9tcyA9IEFycmF5LmZyb20oZmFuZG9tTm9kZXMpLm1hcChcclxuICAgICAgICAgICAgKGZhbmRvbU5vZGUpID0+IGZhbmRvbU5vZGUudGV4dENvbnRlbnRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBzID0gWydwbGFjZWhvbGRlciddO1xyXG5cclxuICAgICAgICBjb25zdCB0YWdzID0gWydwbGFjZWhvbGRlciddO1xyXG5cclxuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9ICdsb25nZXIgcGxhY2Vob2xkZXInO1xyXG5cclxuICAgICAgICBjb25zdCB3b3JkQ291bnQgPSB3b3JrTm9kZS5xdWVyeVNlbGVjdG9yKCdkZC53b3JkcycpIS50ZXh0Q29udGVudDtcclxuXHJcbiAgICAgICAgbGV0IGNoYXB0ZXJDb3VudCA9XHJcbiAgICAgICAgICAgIHdvcmtOb2RlLnF1ZXJ5U2VsZWN0b3IoJ2RkLmNoYXB0ZXJzID4gYScpPy50ZXh0Q29udGVudDtcclxuICAgICAgICBpZiAoIWNoYXB0ZXJDb3VudCkge1xyXG4gICAgICAgICAgICAvL29uZS1zaG90XHJcbiAgICAgICAgICAgIGNoYXB0ZXJDb3VudCA9ICcxJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgQW8zX0Jhc2VXb3JrKFxyXG4gICAgICAgICAgICB3b3JrSWQsXHJcbiAgICAgICAgICAgIHRpdGxlISxcclxuICAgICAgICAgICAgYXV0aG9ycyBhcyBzdHJpbmdbXSxcclxuICAgICAgICAgICAgZmFuZG9tcyBhcyBzdHJpbmdbXSxcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwcyxcclxuICAgICAgICAgICAgdGFncyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgIHBhcnNlSW50KHdvcmRDb3VudCEucmVwbGFjZSgvLC9nLCAnJykpLFxyXG4gICAgICAgICAgICBwYXJzZUludChjaGFwdGVyQ291bnQhLnJlcGxhY2UoLywvZywgJycpKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNyZWF0ZVdvcmsod29ya05vZGU6IEVsZW1lbnQgfCBudWxsKSB7XHJcbiAgICAgICAgaWYgKCF3b3JrTm9kZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdvcmsgbm90IGZvdW5kIG9uIHBhZ2VgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB3b3JrSWQ7XHJcblxyXG4gICAgICAgIGlmKHdvcmtOb2RlLmlkKSB7XHJcbiAgICAgICAgICAgIHdvcmtJZCA9IHBhcnNlSW50KHdvcmtOb2RlLmlkLnNwbGl0KCdfJylbMV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgd29ya0lkTm9kZSA9IHdvcmtOb2RlLnF1ZXJ5U2VsZWN0b3IoYC53b3JrYCk7XHJcbiAgICAgICAgICAgIGlmICghd29ya0lkTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXb3JrIG5vdCBmb3VuZCBvbiBwYWdlYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd29ya0lkID0gcGFyc2VJbnQod29ya0lkTm9kZS5pZC5zcGxpdCgnXycpWzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRpdGxlID0gd29ya05vZGUucXVlcnlTZWxlY3RvcignLmhlYWRpbmcgPiBhJykhLnRleHRDb250ZW50O1xyXG5cclxuICAgICAgICBjb25zdCBhdXRob3JOb2RlcyA9IHdvcmtOb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbcmVsPSdhdXRob3InXVwiKTtcclxuICAgICAgICBjb25zdCBhdXRob3JzID0gQXJyYXkuZnJvbShhdXRob3JOb2RlcykubWFwKFxyXG4gICAgICAgICAgICAoYXV0aG9yTm9kZSkgPT4gYXV0aG9yTm9kZS50ZXh0Q29udGVudFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IGZhbmRvbU5vZGVzID0gd29ya05vZGUucXVlcnlTZWxlY3RvckFsbCgnLmZhbmRvbXMgPiBhJyk7XHJcbiAgICAgICAgY29uc3QgZmFuZG9tcyA9IEFycmF5LmZyb20oZmFuZG9tTm9kZXMpLm1hcChcclxuICAgICAgICAgICAgKGZhbmRvbU5vZGUpID0+IGZhbmRvbU5vZGUudGV4dENvbnRlbnRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBOb2RlcyA9IHdvcmtOb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZWxhdGlvbnNoaXBzID4gYScpO1xyXG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSBBcnJheS5mcm9tKHJlbGF0aW9uc2hpcE5vZGVzKS5tYXAoXHJcbiAgICAgICAgICAgIChyZWxhdGlvbnNoaXBOb2RlKSA9PiByZWxhdGlvbnNoaXBOb2RlLnRleHRDb250ZW50XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGFnTm9kZXMgPSB3b3JrTm9kZS5xdWVyeVNlbGVjdG9yQWxsKCcud2FybmluZ3MgPiBhLCAuY2hhcmFjdGVycyA+IGEsIC5mcmVlZm9ybXMgPiBhJyk7XHJcbiAgICAgICAgY29uc3QgdGFncyA9IEFycmF5LmZyb20odGFnTm9kZXMpLm1hcChcclxuICAgICAgICAgICAgKHRhZ05vZGUpID0+IHRhZ05vZGUudGV4dENvbnRlbnRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHdvcmtOb2RlLnF1ZXJ5U2VsZWN0b3IoJy5zdW1tYXJ5ID4gcCcpIS50ZXh0Q29udGVudDtcclxuXHJcbiAgICAgICAgY29uc3Qgd29yZENvdW50ID0gd29ya05vZGUucXVlcnlTZWxlY3RvcignZGQud29yZHMnKSEudGV4dENvbnRlbnQ7XHJcblxyXG4gICAgICAgIGxldCBjaGFwdGVyQ291bnQgPVxyXG4gICAgICAgICAgICB3b3JrTm9kZS5xdWVyeVNlbGVjdG9yKCdkZC5jaGFwdGVycyA+IGEnKT8udGV4dENvbnRlbnQ7XHJcbiAgICAgICAgaWYgKCFjaGFwdGVyQ291bnQpIHtcclxuICAgICAgICAgICAgLy9vbmUtc2hvdFxyXG4gICAgICAgICAgICBjaGFwdGVyQ291bnQgPSAnMSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IHRoaXMoXHJcbiAgICAgICAgICAgIHdvcmtJZCxcclxuICAgICAgICAgICAgdGl0bGUhLFxyXG4gICAgICAgICAgICBhdXRob3JzIGFzIHN0cmluZ1tdLFxyXG4gICAgICAgICAgICBmYW5kb21zIGFzIHN0cmluZ1tdLFxyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBzIGFzIHN0cmluZ1tdLFxyXG4gICAgICAgICAgICB0YWdzIGFzIHN0cmluZ1tdLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiEsXHJcbiAgICAgICAgICAgIHBhcnNlSW50KHdvcmRDb3VudCEucmVwbGFjZSgvLC9nLCAnJykpLFxyXG4gICAgICAgICAgICBwYXJzZUludChjaGFwdGVyQ291bnQhLnJlcGxhY2UoLywvZywgJycpKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgV29ya1N0YXR1cyB9IGZyb20gXCJAL3V0aWxzL3R5cGVzL2RhdGEudHNcIjtcclxuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIkAvdXRpbHMvbG9nZ2VyLnRzXCI7XHJcbmltcG9ydCB7IGFkZENvbnRyb2xzLCBhZGRJbmZvLCBhZGRXb3JrQ29udHJvbCwgcmVtb3ZlV29ya0NvbnRyb2wgfSBmcm9tIFwiLi9ibHVyYkNvbnRyb2xzLnRzeFwiO1xyXG5pbXBvcnQgeyByZW1vdmVXb3JrRnJvbVNoZWV0IH0gZnJvbSBcIkAvdXRpbHMvY2hyb21lLXNlcnZpY2VzL3JlbW92ZVdvcmtGcm9tU2hlZXQudHNcIjtcclxuXHJcbmNvbnN0IFNUQVRVU19DTEFTU0VTID0ge1xyXG4gICAgcmVhZGluZzogJ3N0YXR1cy1yZWFkaW5nJyxcclxuICAgIHRvUmVhZDogJ3N0YXR1cy10by1yZWFkJyxcclxuICAgIHNraXBwZWQ6ICdzdGF0dXMtc2tpcHBlZCcsXHJcbiAgICBkcm9wcGVkOiAnc3RhdHVzLWRyb3BwZWQnLFxyXG4gICAgcmVhZDogJ3N0YXR1cy1yZWFkJyxcclxufVxyXG5cclxuLyoqXHJcbiAqIENoYW5nZXMgdGhlIHN0eWxlIG9mIGEgd29yayBlbGVtZW50IGJhc2VkIG9uIGl0cyB3b3JrIHN0YXR1cy5cclxuICpcclxuICogQHBhcmFtIHtXb3JrU3RhdHVzfSB3b3JrU3RhdHVzIC0gVGhlIGN1cnJlbnQgc3RhdHVzIG9mIHRoZSB3b3JrLlxyXG4gKiBAcGFyYW0gd29ya1dyYXBcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VCbHVyYlN0eWxlKHdvcmtTdGF0dXM6IFdvcmtTdGF0dXMsIHdvcmtXcmFwOiBOb2RlKSB7XHJcbiAgICBjb25zdCB3cmFwRWwgPSB3b3JrV3JhcCBhcyBFbGVtZW50O1xyXG4gICAgY29uc3Qgd29yayA9IHdyYXBFbC5xdWVyeVNlbGVjdG9yKCcud29yaycpO1xyXG4gICAgY29uc3Qgd29ya0VsID0gd29yayBhcyBFbGVtZW50O1xyXG4gICAgY29uc3QgdG9nZ2xlRWwgPSB3cmFwRWwucXVlcnlTZWxlY3RvcignLmJsdXJiLXRvZ2dsZScpIGFzIEVsZW1lbnQ7XHJcblxyXG4gICAgbG9nKCd3cmFwRWw6ICcsIHdyYXBFbCk7XHJcbiAgICBsb2coJ3RvZ2dsZUVsOiAnLCB0b2dnbGVFbCk7XHJcbiAgICBsb2coJ3dvcmtFbDogJywgd29ya0VsKTtcclxuXHJcbiAgICBzd2l0Y2ggKHdvcmtTdGF0dXMpIHtcclxuICAgICAgICBjYXNlICdyZWFkaW5nJzpcclxuICAgICAgICAgICAgd29ya0VsLmNsYXNzTGlzdC5hZGQoJ3N0YXR1cycsIFNUQVRVU19DTEFTU0VTLnJlYWRpbmcpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICd0b1JlYWQnOlxyXG4gICAgICAgICAgICB3b3JrRWwuY2xhc3NMaXN0LmFkZCgnc3RhdHVzJywnc3RhdHVzLXRvLXJlYWQnKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnc2tpcHBlZCc6XHJcbiAgICAgICAgICAgIHdvcmtFbC5jbGFzc0xpc3QuYWRkKCdzdGF0dXMnLCdzdGF0dXMtc2tpcHBlZCcpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdkcm9wcGVkJzpcclxuICAgICAgICAgICAgd29ya0VsLmNsYXNzTGlzdC5hZGQoJ3N0YXR1cycsJ3N0YXR1cy1kcm9wcGVkJyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3JlYWQnOlxyXG4gICAgICAgICAgICB3b3JrIS5jbGFzc0xpc3QuYWRkKCdzdGF0dXMnLCdzdGF0dXMtcmVhZCcpO1xyXG4gICAgICAgICAgICAvLyByZW1vdmUgY29udHJvbHMgYW5kIGluZm9cclxuICAgICAgICAgICAgaWYodG9nZ2xlRWwucXVlcnlTZWxlY3RvcignLmJsdXJiLWNvbnRyb2xzJykpIHRvZ2dsZUVsLnJlbW92ZUNoaWxkKHRvZ2dsZUVsLnF1ZXJ5U2VsZWN0b3IoJy5ibHVyYi1jb250cm9scycpISk7XHJcbiAgICAgICAgICAgIGlmKHRvZ2dsZUVsLnF1ZXJ5U2VsZWN0b3IoJy5ibHVyYi1pbmZvJykpIHRvZ2dsZUVsLnJlbW92ZUNoaWxkKHRvZ2dsZUVsLnF1ZXJ5U2VsZWN0b3IoJy5ibHVyYi1pbmZvJykhKTtcclxuICAgICAgICAgICAgLy8gYWRkIGJhY2sgY29udHJvbHMgYW5kIGluZm9cclxuICAgICAgICAgICAgdG9nZ2xlRWwuYXBwZW5kQ2hpbGQoYWRkQ29udHJvbHMod3JhcEVsKSk7XHJcbiAgICAgICAgICAgIHRvZ2dsZUVsLmFwcGVuZENoaWxkKGFkZEluZm8od29ya0VsKSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIChPYmplY3Qua2V5cyhTVEFUVVNfQ0xBU1NFUykgYXMgQXJyYXk8a2V5b2YgdHlwZW9mIFNUQVRVU19DTEFTU0VTPikuZm9yRWFjaCgoc3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3b3JrRWwuY2xhc3NMaXN0LnJlbW92ZShTVEFUVVNfQ0xBU1NFU1tzdGF0dXNdKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHdvcmtFbC5xdWVyeVNlbGVjdG9yQWxsKCcuc3RhdHVzJykuZm9yRWFjaCgoc3RhdHVzRWwpID0+IHsgc3RhdHVzRWwucmVtb3ZlKCkgfSk7XHJcbiAgICAgICAgICAgIHRvZ2dsZUVsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ibHVyYi1pbmZvJykuZm9yRWFjaCgoaW5mb0VsKSA9PiB7IGluZm9FbC5yZW1vdmUoKSB9KTtcclxuICAgICAgICAgICAgdG9nZ2xlRWwucXVlcnlTZWxlY3RvckFsbCgnLnRvZ2dsZScpLmZvckVhY2goKHRvZ2dsZUVsKSA9PiB7IHRvZ2dsZUVsLnJlbW92ZSgpIH0pO1xyXG4gICAgICAgICAgICBpZih0b2dnbGVFbC5xdWVyeVNlbGVjdG9yKCcuYmx1cmItY29udHJvbHMnKSkgdG9nZ2xlRWwucmVtb3ZlQ2hpbGQodG9nZ2xlRWwucXVlcnlTZWxlY3RvcignLmJsdXJiLWNvbnRyb2xzJykhKTtcclxuICAgICAgICAgICAgdG9nZ2xlRWwuYXBwZW5kQ2hpbGQoYWRkQ29udHJvbHMod3JhcEVsKSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgbG9nKCd3b3JrOiAnLCB3b3JrRWwpO1xyXG4gICAgcmV0dXJuIHdvcmtFbDtcclxufSIsImV4cG9ydCBlbnVtIFdvcmtTdGF0dXMge1xyXG4gICAgUmVhZGluZyA9ICdyZWFkaW5nJyxcclxuICAgIFRvUmVhZCA9ICd0b1JlYWQnLFxyXG4gICAgU2tpcHBlZCA9ICdza2lwcGVkJyxcclxuICAgIERyb3BwZWQgPSAnZHJvcHBlZCcsXHJcbiAgICBSZWFkID0gJ3JlYWQnLFxyXG4gICAgRGVmYXVsdCA9ICcnIC8vIGRlZmF1bHRcclxufSIsImltcG9ydCB7IFdvcmtTdGF0dXMgfSBmcm9tIFwiQC91dGlscy90eXBlcy9kYXRhLnRzXCI7XHJcbmltcG9ydCB7IEJhc2VXb3JrIH0gZnJvbSBcIi4vQmFzZVdvcmsudHNcIjtcclxuXHJcbmNvbnN0IGRlZmF1bHRIaXN0b3J5OiBbSGlzdG9yeUVudHJ5XSA9IFt7XHJcbiAgICBhY3Rpb246ICdBZGRlZCcsXHJcbiAgICBkYXRlOiBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKClcclxufV07XHJcblxyXG5pbnRlcmZhY2UgSGlzdG9yeUVudHJ5IHtcclxuICAgIGFjdGlvbjogc3RyaW5nO1xyXG4gICAgZGF0ZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlcl9CYXNlV29yayBleHRlbmRzIEJhc2VXb3JrIHtcclxuICAgIGluZGV4OiBudW1iZXI7XHJcbiAgICBzdGF0dXM6IFdvcmtTdGF0dXM7XHJcbiAgICBoaXN0b3J5OiBbSGlzdG9yeUVudHJ5XTtcclxuICAgIHBlcnNvbmFsVGFncz86IHN0cmluZ1tdO1xyXG4gICAgcmF0aW5nOiBudW1iZXI7XHJcbiAgICByZWFkQ291bnQ6IG51bWJlcjtcclxuICAgIHNraXBSZWFzb24/OiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3Iod29ya0lkOiBudW1iZXIsIGluZGV4PzogbnVtYmVyLCBzdGF0dXM/OiBXb3JrU3RhdHVzLCBoaXN0b3J5PzogW0hpc3RvcnlFbnRyeV0sIHBlcnNvbmFsVGFncz86IHN0cmluZ1tdLCByYXRpbmc/OiBudW1iZXIsIHJlYWRDb3VudD86IG51bWJlciwgc2tpcFJlYXNvbj86IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHdvcmtJZCk7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4ID8/IDA7XHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXMgPz8gV29ya1N0YXR1cy5SZWFkO1xyXG4gICAgICAgIHRoaXMuaGlzdG9yeSA9IGhpc3RvcnkgPz8gZGVmYXVsdEhpc3Rvcnk7XHJcbiAgICAgICAgdGhpcy5wZXJzb25hbFRhZ3MgPSBwZXJzb25hbFRhZ3MgPz8gW107XHJcbiAgICAgICAgdGhpcy5yYXRpbmcgPSByYXRpbmcgPz8gMDtcclxuICAgICAgICB0aGlzLnJlYWRDb3VudCA9IHJlYWRDb3VudCA/PyAxO1xyXG4gICAgICAgIHRoaXMuc2tpcFJlYXNvbiA9IHNraXBSZWFzb24gPz8gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0V29yayh3b3JrSWQ6IG51bWJlcik6IFVzZXJfQmFzZVdvcmsge1xyXG4gICAgICAgIHJldHVybiBuZXcgVXNlcl9CYXNlV29yayhcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgd29ya0lkLFxyXG4gICAgICAgICAgICBXb3JrU3RhdHVzLlJlYWQsXHJcbiAgICAgICAgICAgIGRlZmF1bHRIaXN0b3J5LFxyXG4gICAgICAgICAgICBbXSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgJydcclxuICAgICAgICApO1xyXG5cclxuICAgIH1cclxuICAgIHNhdmVXb3JrVG9TZXNzaW9uKHdvcms6IFVzZXJfQmFzZVdvcmspIHtcclxuXHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZnVuY3Rpb24gd3JhcCh3cmFwZWU6IE5vZGUsIHdyYXBwZXI6IE5vZGUpIHtcclxuICAgIHdyYXBlZS5wYXJlbnROb2RlIS5pbnNlcnRCZWZvcmUod3JhcHBlciwgd3JhcGVlKTtcclxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQod3JhcGVlKTtcclxufSIsImltcG9ydCAnLi4vLi4vc3JjL3N0eWxlcy5jc3MnO1xyXG5pbXBvcnQgeyBBbzNfQmFzZVdvcmsgfSBmcm9tICcuL0FvM19CYXNlV29yay50cyc7XHJcbmltcG9ydCB7IE1lc3NhZ2VOYW1lLCBzZW5kTWVzc2FnZSB9IGZyb20gXCJAL3V0aWxzL2Nocm9tZS1zZXJ2aWNlcy9tZXNzYWdpbmcudHNcIjtcclxuaW1wb3J0IHsgbG9nIH0gZnJvbSAnQC91dGlscy9sb2dnZXIudHMnO1xyXG5pbXBvcnQgeyBNZXNzYWdlUmVzcG9uc2UgfSBmcm9tIFwiQC91dGlscy90eXBlcy9NZXNzYWdlUmVzcG9uc2VcIjtcclxuaW1wb3J0IHsgY2hhbmdlQmx1cmJTdHlsZSB9IGZyb20gXCIuL2NoYW5nZUJsdXJiU3R5bGUudHN4XCI7XHJcbmltcG9ydCB7IFVzZXJfQmFzZVdvcmsgfSBmcm9tIFwiLi9Vc2VyX0Jhc2VXb3JrLnRzeFwiO1xyXG5pbXBvcnQgeyB3cmFwIH0gZnJvbSBcIkAvdXRpbHNcIjtcclxuaW1wb3J0IHsgV29ya1N0YXR1cyB9IGZyb20gXCJAL3V0aWxzL3R5cGVzL2RhdGEudHNcIjtcclxuXHJcbi8qKlxyXG4gKiBUb2dnbGVzIGZvciBhZGRpbmcgYW5kIHJlbW92aW5nIHdvcmtzXHJcbiAqL1xyXG5jb25zdCBUT0dHTEVTID0ge1xyXG4gICAgYWRkOiAnQWRkIFdvcmsnLFxyXG4gICAgcmVtb3ZlOiAnUmVtb3ZlIFdvcmsnXHJcbn07XHJcblxyXG4vKipcclxuICogQWRkIGJsdXJiIGNvbnRyb2xzIHRvIHRoZSB3b3JrcyBvbiB0aGUgcGFnZVxyXG4gKiBAcGFyYW0gd29ya3NPblBhZ2UgLSBMaXN0IG9mIHdvcmtzIG9uIHRoZSBwYWdlXHJcbiAqIEBwYXJhbSBib29sUmVhZCAtIEFycmF5IGluZGljYXRpbmcgaWYgdGhlIHdvcmtzIGFyZSByZWFkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYWRkQmx1cmJDb250cm9scyh3b3Jrc09uUGFnZTogTm9kZUxpc3QsIGJvb2xSZWFkOiBib29sZWFuW10pOiB2b2lkIHtcclxuICAgIHdvcmtzT25QYWdlLmZvckVhY2goKHdvcmssIGluZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3Qgd29ya0VsID0gd29yayBhcyBFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IHdvcmtJZENsYXNzID0gd29ya0VsLmlkLnNwbGl0KCdfJylbMV07XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyBkaXYgdG8gd3JhcCB0aGUgd29yayBlbGVtZW50XHJcbiAgICAgICAgY29uc3Qgd29ya1dyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB3b3JrV3JhcC5jbGFzc0xpc3QuYWRkKCdibHVyYi13aXRoLXRvZ2dsZXMnLCAnYXJjaGl2ZXItY29udHJvbHMnLCB3b3JrSWRDbGFzcyk7XHJcblxyXG4gICAgICAgIHdvcmtXcmFwLnN0eWxlLmNzc1RleHQgPSBKU09OLnN0cmluZ2lmeShnZXRDb21wdXRlZFN0eWxlKHdvcmtFbCkpO1xyXG5cclxuICAgICAgICAvLyBXcmFwIHRoZSB3b3JrIGVsZW1lbnQgaW4gdGhlIG5ldyBkaXZcclxuICAgICAgICB3cmFwKHdvcmssIHdvcmtXcmFwKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIHRoZSB0b2dnbGUgY29udHJvbHMgdG8gdGhlIG5ldyBkaXZcclxuICAgICAgICBjb25zdCBpbmZvQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICBpbmZvQm94LmNsYXNzTGlzdC5hZGQoJ2JsdXJiLXRvZ2dsZScsICdhcmNoaXZlci1jb250cm9scycpO1xyXG4gICAgICAgIHdvcmtXcmFwLmFwcGVuZENoaWxkKGluZm9Cb3gpO1xyXG5cclxuICAgICAgICAvLyBBZGQgdGhlIGNvbnRyb2xzXHJcbiAgICAgICAgaW5mb0JveC5hcHBlbmRDaGlsZChhZGRDb250cm9scyh3b3JrV3JhcCkpO1xyXG5cclxuICAgICAgICAvLyBBZGQgdGhlIGluZm8gYm94XHJcbiAgICAgICAgd29ya1dyYXAuaW5zZXJ0QmVmb3JlKGluZm9Cb3gsIHdvcmspO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQgd29yayBjb250cm9sIHRvIHRoZSB3b3JrIHdyYXBcclxuICogQHBhcmFtIHdvcmtXcmFwIC0gVGhlIHdvcmsgd3JhcCBlbGVtZW50XHJcbiAqIEByZXR1cm5zIFRoZSBjb250cm9sIGVsZW1lbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRXb3JrQ29udHJvbCh3b3JrV3JhcDogRWxlbWVudCk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGlubmVyVG9nZ2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgaW5uZXJUb2dnbGUudGV4dENvbnRlbnQgPSAnQWRkIFdvcmsnO1xyXG4gICAgaW5uZXJUb2dnbGUuY2xhc3NOYW1lID0gJ3RvZ2dsZSc7XHJcblxyXG4gICAgaW5uZXJUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgbG9nKCdhZGRXb3JrIGNsaWNrZWQhOiAnLCB3b3JrV3JhcCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHdvcmtCbHVyYiA9IEFvM19CYXNlV29yay5jcmVhdGVXb3JrKHdvcmtXcmFwKTtcclxuICAgICAgICBsb2coJ3dvcmtCbHVyYjogJywgd29ya0JsdXJiKTtcclxuXHJcbiAgICAgICAgc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgICAgIE1lc3NhZ2VOYW1lLkFkZFdvcmtUb1NoZWV0LFxyXG4gICAgICAgICAgICB7IHdvcms6IHdvcmtCbHVyYiB9LFxyXG4gICAgICAgICAgICAocmVzcG9uc2U6IE1lc3NhZ2VSZXNwb25zZTxVc2VyX0Jhc2VXb3JrPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nKCdhZGRXb3JrIGVycm9yOiAnLCByZXNwb25zZS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvZygnY29udGVudCBzY3JpcHQgcmVzcG9uc2U6ICcsIHJlc3BvbnNlLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VCbHVyYlN0eWxlKFdvcmtTdGF0dXMuUmVhZCwgd29ya1dyYXApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gICAvL2Vsc2UgcG9wdXAgbG9naW5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gaW5uZXJUb2dnbGU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgd29yayBjb250cm9sIGZyb20gdGhlIHdvcmsgd3JhcFxyXG4gKiBAcGFyYW0gd29ya1dyYXAgLSBUaGUgd29yayB3cmFwIGVsZW1lbnRcclxuICogQHJldHVybnMgVGhlIGNvbnRyb2wgZWxlbWVudFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVdvcmtDb250cm9sKHdvcmtXcmFwOiBFbGVtZW50KTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgaW5uZXJUb2dnbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICBpbm5lclRvZ2dsZS50ZXh0Q29udGVudCA9ICdSZW1vdmUgV29yayc7XHJcbiAgICBpbm5lclRvZ2dsZS5jbGFzc05hbWUgPSAndG9nZ2xlJztcclxuXHJcbiAgICBpbm5lclRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBsb2coJ3JlbW92ZVdvcmsgY2xpY2tlZCE6ICcsIHdvcmtXcmFwKTtcclxuXHJcbiAgICAgICAgY29uc3Qgd29ya0JsdXJiID0gQW8zX0Jhc2VXb3JrLmNyZWF0ZVdvcmsod29ya1dyYXApO1xyXG4gICAgICAgIGxvZygnd29ya0JsdXJiLndvcmtJZDogJywgd29ya0JsdXJiKTtcclxuXHJcbiAgICAgICAgc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgICAgIE1lc3NhZ2VOYW1lLlJlbW92ZVdvcmtGcm9tU2hlZXQsXHJcbiAgICAgICAgICAgIHsgd29ya0lkOiB3b3JrQmx1cmIud29ya0lkIH0sXHJcbiAgICAgICAgICAgIChyZXNwb25zZTogTWVzc2FnZVJlc3BvbnNlPGJvb2xlYW4+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2coJ3JlbW92ZVdvcmsgZXJyb3I6ICcsIHJlc3BvbnNlLmVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nKCdjb250ZW50IHNjcmlwdCByZXNwb25zZTogJywgcmVzcG9uc2UucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUJsdXJiU3R5bGUoV29ya1N0YXR1cy5EZWZhdWx0LCB3b3JrV3JhcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGlubmVyVG9nZ2xlO1xyXG59XHJcblxyXG4vKipcclxuICogQWRkIGNvbnRyb2xzIHRvIHRoZSB3b3JrIHdyYXBcclxuICogQHBhcmFtIHdvcmtXcmFwIC0gVGhlIHdvcmsgd3JhcCBlbGVtZW50XHJcbiAqIEByZXR1cm5zIFRoZSBjb250cm9scyBlbGVtZW50XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYWRkQ29udHJvbHMod29ya1dyYXA6IEVsZW1lbnQpOiBOb2RlIHtcclxuXHJcbiAgICBjb25zdCB3b3JrID0gd29ya1dyYXAucXVlcnlTZWxlY3RvcignLndvcmsnKSBhcyBFbGVtZW50O1xyXG4gICAgY29uc3Qgd29ya0lkID0gd29yay5pZC5zcGxpdCgnXycpWzFdO1xyXG5cclxuICAgIGNvbnN0IGNvbnRyb2xzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBjb250cm9scy5jbGFzc05hbWUgPSAnYmx1cmItY29udHJvbHMnO1xyXG4gICAgY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbi5nZXQod29ya0lkLCAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKCFyZXN1bHRbd29ya0lkXSkge1xyXG4gICAgICAgICAgICBjb250cm9scy5hcHBlbmRDaGlsZChhZGRXb3JrQ29udHJvbCh3b3JrV3JhcCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZyhgRW50cnkgZm91bmQgZm9yIHdvcmtJZDogJHt3b3JrSWR9YCwgcmVzdWx0W3dvcmtJZF0pO1xyXG4gICAgICAgICAgICBjb250cm9scy5hcHBlbmRDaGlsZChpbmNyZW1lbnRSZWFkQ291bnRDb250cm9sKHdvcmtXcmFwKSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xzLmFwcGVuZENoaWxkKHJlbW92ZVdvcmtDb250cm9sKHdvcmtXcmFwKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGNvbnRyb2xzIGFzIE5vZGU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQgaW5mbyB0byB0aGUgd29ya1xyXG4gKiBAcGFyYW0gd29yayAtIFRoZSB3b3JrIGVsZW1lbnRcclxuICogQHJldHVybnMgVGhlIGluZm8gZWxlbWVudFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEluZm8od29yazogRWxlbWVudCk6IE5vZGUge1xyXG4gICAgbG9nKCdhZGRpbmcgaW5mbyB0byB3b3JrOiAnLCB3b3JrKTtcclxuXHJcbiAgICBjb25zdCB3b3JrSWQgPSB3b3JrLmlkLnNwbGl0KCdfJylbMV07XHJcbiAgICBsb2coJ3dvcmtJZDogJywgd29ya0lkKTtcclxuXHJcbiAgICBjb25zdCBpbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBpbmZvLmNsYXNzTmFtZSA9ICdibHVyYi1pbmZvJztcclxuXHJcbiAgICBjaHJvbWUuc3RvcmFnZS5zZXNzaW9uLmdldCh3b3JrSWQsIChyZXN1bHQpID0+IHtcclxuICAgICAgICBsb2coJ3Jlc3VsdCBmcm9tIHNlc3Npb24gc3RvcmU6ICcsIHJlc3VsdCk7XHJcbiAgICAgICAgY29uc3QgdXNlcldvcmsgPSByZXN1bHRbd29ya0lkXTtcclxuICAgICAgICBsb2coJ3VzZXJXb3JrOiAnLCB1c2VyV29yayk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhpc3RvcnkgPSB1c2VyV29yay5oaXN0b3J5XHJcbiAgICAgICAgICAgID8gdHlwZW9mIHVzZXJXb3JrLmhpc3RvcnkgPT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICA/IEpTT04ucGFyc2UodXNlcldvcmsuaGlzdG9yeSlcclxuICAgICAgICAgICAgICAgIDogdXNlcldvcmsuaGlzdG9yeVxyXG4gICAgICAgICAgICA6IFtdO1xyXG5cclxuICAgICAgICBsZXQgZGF0ZVN0ciA9ICdwcmUtMjAyNSc7XHJcbiAgICAgICAgaWYgKGhpc3RvcnkubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShoaXN0b3J5W2hpc3RvcnkubGVuZ3RoIC0gMV0uZGF0ZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vbnRocyA9IFtcIkphblwiLCBcIkZlYlwiLCBcIk1hclwiLCBcIkFwclwiLCBcIk1heVwiLCBcIkp1blwiLCBcIkp1bFwiLCBcIkF1Z1wiLCBcIlNlcFwiLCBcIk9jdFwiLCBcIk5vdlwiLCBcIkRlY1wiXTtcclxuICAgICAgICAgICAgZGF0ZVN0ciA9IGAke2RhdGUuZ2V0RGF0ZSgpfSAke21vbnRoc1tkYXRlLmdldE1vbnRoKCldfSAke2RhdGUuZ2V0RnVsbFllYXIoKX1gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbmZvLmNsYXNzTmFtZSA9ICdibHVyYi1pbmZvJztcclxuXHJcbiAgICAgICAgY29uc3QgbGFzdFJlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICAgICAgbGFzdFJlYWQudGV4dENvbnRlbnQgPSBgTGFzdCByZWFkOiAke2RhdGVTdHJ9YDtcclxuICAgICAgICBsYXN0UmVhZC5jbGFzc0xpc3QuYWRkKCdsYXN0LXJlYWQnLCAnZGF0ZXRpbWUnKTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVhZENvdW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgICAgIHJlYWRDb3VudC50ZXh0Q29udGVudCA9IGBSZWFkICR7dXNlcldvcmsucmVhZENvdW50fSB0aW1lKHMpYDtcclxuICAgICAgICByZWFkQ291bnQuY2xhc3NMaXN0LmFkZCgncmVhZC1jb3VudCcsICdkYXRldGltZScpO1xyXG5cclxuICAgICAgICBpbmZvLmFwcGVuZENoaWxkKGxhc3RSZWFkKTtcclxuICAgICAgICBpbmZvLmFwcGVuZENoaWxkKHJlYWRDb3VudCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gaW5mbyBhcyBOb2RlO1xyXG59XHJcblxyXG4vKipcclxuICogSW5jcmVtZW50IHJlYWQgY291bnQgY29udHJvbCBmb3IgdGhlIHdvcmsgd3JhcFxyXG4gKiBAcGFyYW0gd29ya1dyYXAgLSBUaGUgd29yayB3cmFwIGVsZW1lbnRcclxuICogQHJldHVybnMgVGhlIGNvbnRyb2wgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gaW5jcmVtZW50UmVhZENvdW50Q29udHJvbCh3b3JrV3JhcDogRWxlbWVudCk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGlubmVyVG9nZ2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgaW5uZXJUb2dnbGUudGV4dENvbnRlbnQgPSAnKzEnO1xyXG4gICAgaW5uZXJUb2dnbGUuY2xhc3NOYW1lID0gJ3RvZ2dsZSc7XHJcblxyXG4gICAgaW5uZXJUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgbG9nKCdpbmNyZW1lbnRSZWFkQ291bnQgY2xpY2tlZCE6ICcsIHdvcmtXcmFwKTtcclxuXHJcbiAgICAgICAgY29uc3QgYVdvcmsgPSBBbzNfQmFzZVdvcmsuY3JlYXRlV29yayh3b3JrV3JhcCk7XHJcbiAgICAgICAgY29uc3Qgd29ya0lkID0gYCR7YVdvcmsud29ya0lkfWA7XHJcblxyXG4gICAgICAgIGNocm9tZS5zdG9yYWdlLnNlc3Npb24uZ2V0KHdvcmtJZCwgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdFt3b3JrSWRdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgdVdvcmsgPSByZXN1bHRbYVdvcmsud29ya0lkXTtcclxuICAgICAgICAgICAgbG9nKCd1V29yazogJywgdVdvcmspO1xyXG5cclxuICAgICAgICAgICAgdVdvcmsucmVhZENvdW50ICs9IDE7XHJcbiAgICAgICAgICAgIGNvbnN0IGhpc3RvcnkgPSB1V29yay5oaXN0b3J5XHJcbiAgICAgICAgICAgICAgICA/IHR5cGVvZiB1V29yay5oaXN0b3J5ID09PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgID8gSlNPTi5wYXJzZSh1V29yay5oaXN0b3J5KVxyXG4gICAgICAgICAgICAgICAgICAgIDogdVdvcmsuaGlzdG9yeVxyXG4gICAgICAgICAgICAgICAgOiBbeyBhY3Rpb246IFwiYWRkZWRcIiwgZGF0ZTogJ3ByZS0yMDI1JyB9XTtcclxuICAgICAgICAgICAgaGlzdG9yeS5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbjogXCJyZXJlYWRcIixcclxuICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGxvZygnaGlzdCcsIGhpc3RvcnkpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgd29yayA9IG5ldyBVc2VyX0Jhc2VXb3JrKFxyXG4gICAgICAgICAgICAgICAgYVdvcmsud29ya0lkLFxyXG4gICAgICAgICAgICAgICAgdVdvcmsuaW5kZXgsXHJcbiAgICAgICAgICAgICAgICB1V29yay5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICBoaXN0b3J5LFxyXG4gICAgICAgICAgICAgICAgdVdvcmsucGVyc29uYWxUYWdzLFxyXG4gICAgICAgICAgICAgICAgdVdvcmsucmF0aW5nLFxyXG4gICAgICAgICAgICAgICAgdVdvcmsucmVhZENvdW50LFxyXG4gICAgICAgICAgICAgICAgdVdvcmsuc2tpcFJlYXNvblxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlTmFtZS5VcGRhdGVXb3JrSW5TaGVldCxcclxuICAgICAgICAgICAgICAgIHsgd29yazogd29yayB9LFxyXG4gICAgICAgICAgICAgICAgKHJlc3BvbnNlOiBNZXNzYWdlUmVzcG9uc2U8Ym9vbGVhbj4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nKCdpbmNyZW1lbnRSZWFkQ291bnQgZXJyb3I6ICcsIHJlc3BvbnNlLmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2coJ2NvbnRlbnQgc2NyaXB0IHJlc3BvbnNlOiAnLCByZXNwb25zZS5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZUJsdXJiU3R5bGUoV29ya1N0YXR1cy5SZWFkLCB3b3JrV3JhcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGlubmVyVG9nZ2xlO1xyXG59IiwiaW1wb3J0IHsgaW5pdGlhbGl6ZVBvcnQsIE1lc3NhZ2VOYW1lLCBzZW5kTWVzc2FnZSB9IGZyb20gXCJAL3V0aWxzL2Nocm9tZS1zZXJ2aWNlcy9tZXNzYWdpbmcudHNcIjtcclxuaW1wb3J0IHsgbG9nIH0gZnJvbSAnQC91dGlscy9sb2dnZXIudHMnO1xyXG5pbXBvcnQgeyBNZXNzYWdlUmVzcG9uc2UgfSBmcm9tIFwiQC91dGlscy90eXBlcy9NZXNzYWdlUmVzcG9uc2VcIjtcclxuLy8gQHRzLWlnbm9yZVxyXG5pbXBvcnQgeyBhZGRCbHVyYkNvbnRyb2xzIH0gZnJvbSAnLi9ibHVyYkNvbnRyb2xzLnRzeCc7XHJcbmltcG9ydCB7IGNoYW5nZUJsdXJiU3R5bGUgfSBmcm9tICcuL2NoYW5nZUJsdXJiU3R5bGUudHN4JztcclxuaW1wb3J0IHsgV29ya1N0YXR1cyB9IGZyb20gXCJAL3V0aWxzL3R5cGVzL2RhdGEudHNcIjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdGFuZGFyZEJsdXJic1BhZ2UoKSB7XHJcbiAgICAvLyBjaGVjayBpZiBwYWdlIGFscmVhZHkgaGFzIHdvcmsgc3RhdHVzZXNcclxuICAgIGNvbnN0IHdvcmtTdGF0dXNlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ibHVyYi13aXRoLXRvZ2dsZXMnKSBhcyBOb2RlTGlzdDtcclxuICAgIGlmICh3b3JrU3RhdHVzZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGxvZygnV29yayBzdGF0dXNlcyBhbHJlYWR5IGluamVjdGVkLicpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHdvcmtzT25QYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGkud29yaywgbGkuYm9va21hcmsnKSBhcyBOb2RlTGlzdFxyXG5cclxuICAgIGxldCBzZWFyY2hMaXN0OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgd29ya3NPblBhZ2UuZm9yRWFjaCgod29yaykgPT4ge1xyXG4gICAgICAgIGNvbnN0IHdvcmtFbCA9IHdvcmsgYXMgRWxlbWVudDtcclxuICAgICAgICBpZiAod29ya0VsLmNsYXNzTGlzdC5jb250YWlucygnYm9va21hcmsnKSkge1xyXG4gICAgICAgICAgICBzZWFyY2hMaXN0LnB1c2goTnVtYmVyKHdvcmtFbC5jbGFzc0xpc3RbM10uc3BsaXQoJy0nKVsxXSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNlYXJjaExpc3QucHVzaChOdW1iZXIod29ya0VsLmlkLnNwbGl0KCdfJylbMV0pKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBsb2coJ3NlYXJjaExpc3Q6ICcsIHNlYXJjaExpc3QpO1xyXG5cclxuICAgIGluaXRpYWxpemVQb3J0KCk7XHJcblxyXG4gICAgc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgTWVzc2FnZU5hbWUuUXVlcnlTcHJlYWRzaGVldCxcclxuICAgICAgICB7IGxpc3Q6IHNlYXJjaExpc3QgfSxcclxuICAgICAgICBhc3luYyAocmVzcG9uc2U6IE1lc3NhZ2VSZXNwb25zZTxib29sZWFuW10+KSA9PiB7XHJcbiAgICAgICAgICAgIGxvZygnUXVlcnlTcHJlYWRzaGVldCByZXNwb25zZTogJywgcmVzcG9uc2UpXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbG9nKCdObyB3b3JrIHN0YXR1c2VzIHRvIGluamVjdC4nKVxyXG4gICAgICAgICAgICAgICAgYWRkQmx1cmJDb250cm9scyh3b3Jrc09uUGFnZSwgW10pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgbG9nKCdFcnJvciBxdWVyeWluZyBzcHJlYWRzaGVldDogJywgcmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGF3YWl0IGluamVjdFdvcmtTdGF0dXNlcyh3b3Jrc09uUGFnZSwgcmVzcG9uc2UucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBsb2coJ0luamVjdGVkIHdvcmsgc3RhdHVzZXMuJyk7XHJcbiAgICAgICAgICAgIGFkZEJsdXJiQ29udHJvbHMod29ya3NPblBhZ2UsIHJlc3BvbnNlLnJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcbiAgICApXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbmplY3QgdGhlIHJlYWQgc3RhdHVzIG9mIGEgbGlzdCBvZiB3b3JrcyBpbnRvIHRoZSBwYWdlXHJcbiAqIEBwYXJhbSB7IEhUTUxFbGVtZW50W10gfSB3b3Jrc09uUGFnZSAtIHRoZSB3b3JrcyBvbiB0aGUgcGFnZVxyXG4gKiBAcGFyYW0geyBib29sZWFuW10gfSByZXNwb25zZSAtIHRoZSBsaXN0IG9mIHdvcmtzIGZyb20gc2hlZXRcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGluamVjdFdvcmtTdGF0dXNlcyh3b3Jrc09uUGFnZTogTm9kZUxpc3QsIHJlc3BvbnNlOiBib29sZWFuW10pIHtcclxuICAgIGlmKHJlc3BvbnNlID09PSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIEVycm9yO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXNwb25zZS5mb3JFYWNoKCh3b3JrUmVmOiBib29sZWFuLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIGxvZygnd29ya1JlZjogJywgd29ya1JlZilcclxuICAgICAgICAgICAgaWYgKHdvcmtSZWYpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmtJZCA9ICh3b3Jrc09uUGFnZVtpbmRleF0gYXMgRWxlbWVudCkuaWQuc3BsaXQoJ18nKVsxXVxyXG4gICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbi5nZXQod29ya0lkLCAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nKCdzZXNzaW9uIHJlc3VsdDogJywgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0W3dvcmtJZF0uc3RhdHVzID09PSBXb3JrU3RhdHVzLlJlYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlQmx1cmJTdHlsZShXb3JrU3RhdHVzLlJlYWQsICh3b3Jrc09uUGFnZVtpbmRleF0ucGFyZW50Tm9kZSEpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgbG9nIH0gZnJvbSBcIkAvdXRpbHMvbG9nZ2VyLnRzXCI7XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldEFjY2Vzc1Rva2VuQ29va2llKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIC8vbG9nKCdzZXR0aW5nIGNvb2tpZTogJywgdmFsdWUpO1xyXG4vLyBnZXQgY3VycmVudCBkYXRlXHJcbiAgICBsZXQgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgZXhwaXJhdGlvbkRhdGUgPSBuZXcgRGF0ZShjdXJyZW50RGF0ZS5nZXRUaW1lKCkgKyAzNjAwMDAwKTtcclxuICAgIGxvZygnY3VycmVudERhdGU6ICcsIGN1cnJlbnREYXRlKTtcclxuICAgIGxvZygnZXhwaXJhdGlvbkRhdGU6ICcsIGV4cGlyYXRpb25EYXRlKTtcclxuXHJcbiAgICAvL2RvY3VtZW50LmNvb2tpZSA9IGBhY2Nlc3NUb2tlbj0ke3ZhbHVlfTsgZXhwaXJlcz0ke2V4cGlyYXRpb25EYXRlLmdldFRpbWUoKSArIDM2MDB9OyBkb21haW49YXJjaGl2ZW9mb3Vyb3duLm9yZzsgcGF0aD0vYDtcclxuICAgIC8vIFNldCB0aGUgYWNjZXNzIHRva2VuIGNvb2tpZSB3aXRoIGEgMzAtc2Vjb25kIGV4cGlyYXRpb25cclxuY2hyb21lLmNvb2tpZXMuc2V0KHsgdXJsOiAnaHR0cHM6Ly9hcmNoaXZlb2ZvdXJvd24ub3JnJywgbmFtZTogJ2FjY2Vzc1Rva2VuJywgdmFsdWUsIGV4cGlyYXRpb25EYXRlOiBleHBpcmF0aW9uRGF0ZS5nZXRUaW1lKCkgfSlcclxuLnRoZW4oY29va2llID0+IGNvbnNvbGUubG9nKCdjb29raWUgc2V0OiAnLCBjb29raWUpKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFjY2Vzc1Rva2VuQ29va2llKCk6IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPiB7XHJcbiAgICBjb25zdCBjb29raWVzID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7JykubWFwKGNvb2tpZSA9PiBjb29raWUudHJpbSgpLnNwbGl0KCc9JykpO1xyXG4gICAgbG9nKCdjb29raWVzIGZvdW5kOiAnLCBjb29raWVzKTtcclxuICAgIHJldHVybiBjb29raWVzLmZpbmQoY29va2llID0+IGNvb2tpZVswXSA9PT0gJ2FjY2Vzc1Rva2VuJyk/LlsxXTtcclxufSIsImltcG9ydCB7IHN0YW5kYXJkQmx1cmJzUGFnZSB9IGZyb20gJy4vYmx1cmJzUGFnZS50c3gnO1xyXG5pbXBvcnQgeyBnZXRBY2Nlc3NUb2tlbkNvb2tpZSB9IGZyb20gXCJAL3V0aWxzL2Nocm9tZS1zZXJ2aWNlcy9jb29raWVzLnRzXCI7XHJcbmltcG9ydCB7IGNsb3NlUG9ydCwgaW5pdGlhbGl6ZVBvcnQsIE1lc3NhZ2VOYW1lLCBzZW5kTWVzc2FnZSB9IGZyb20gXCJAL3V0aWxzL2Nocm9tZS1zZXJ2aWNlcy9tZXNzYWdpbmcudHNcIjtcclxuaW1wb3J0IHsgbG9nIH0gZnJvbSAnQC91dGlscy9sb2dnZXIudHMnO1xyXG5pbXBvcnQgeyBNZXNzYWdlUmVzcG9uc2UgfSBmcm9tIFwiQC91dGlscy90eXBlcy9NZXNzYWdlUmVzcG9uc2VcIjtcclxuXHJcbi8vIEludGVyZmFjZSBmb3IgbWVzc2FnZSBzdHJ1Y3R1cmVcclxuaW50ZXJmYWNlIE1lc3NhZ2Uge1xyXG4gICAgbWVzc2FnZTogc3RyaW5nO1xyXG59XHJcblxyXG4vLyBMaXN0ZW5lciBmb3IgbWVzc2FnZXMgZnJvbSB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuZXhwb3J0IGNvbnN0IG1lc3NhZ2VMaXN0ZW5lciA9IChtZXNzYWdlOiBNZXNzYWdlLCBzZW5kZXI6IGNocm9tZS5ydW50aW1lLk1lc3NhZ2VTZW5kZXIsIHNlbmRSZXNwb25zZTogKHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpOiB2b2lkID0+IHtcclxuICAgIGxvZygnY29udGVudF9zY3JpcHQnLCAnaGVhcmQgbWVzc2FnZTogJywgbWVzc2FnZSk7XHJcbiAgICBpZiAobWVzc2FnZS5tZXNzYWdlID09PSAndXNlckNoYW5nZWQnKSB7XHJcbiAgICAgICAgbG9nKCd1c2VyQ2hhbmdlZCcpO1xyXG4gICAgICAgIGhhbmRsZVVzZXJDaGFuZ2VkKHNlbmRSZXNwb25zZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBIYW5kbGUgdXNlciBjaGFuZ2UgZXZlbnRcclxuZnVuY3Rpb24gaGFuZGxlVXNlckNoYW5nZWQoc2VuZFJlc3BvbnNlOiAocmVzcG9uc2U6IGFueSkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgZGlzY29ubmVjdENvbnRlbnRTY3JpcHQoKTtcclxuICAgIHNlbmRSZXNwb25zZSh7IHJlc3BvbnNlOiAndXNlckNoYW5nZWQgaGVhcmQnIH0pO1xyXG59XHJcblxyXG4vLyBIYW5kbGUgdmlzaWJpbGl0eSBjaGFuZ2Ugb2YgdGhlIHRhYlxyXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSgpOiB2b2lkIHtcclxuICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICd2aXNpYmxlJykge1xyXG4gICAgICAgIGxvZygndGFiIGlzIG5vdyB2aXNpYmxlJyk7XHJcbiAgICAgICAgaW5pdGlhbGl6ZVBvcnQoKTtcclxuICAgICAgICBjaGVja0FjY2Vzc1Rva2VuKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvZygndGFiIGlzIG5vdyBoaWRkZW4sIGNsb3NpbmcgcG9ydCcpO1xyXG4gICAgICAgIGNsb3NlUG9ydCgpO1xyXG4gICAgICAgIGRpc2Nvbm5lY3RDb250ZW50U2NyaXB0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIENoZWNrIGlmIHRoZSBhY2Nlc3MgdG9rZW4gY29va2llIGlzIHByZXNlbnRcclxuZnVuY3Rpb24gY2hlY2tBY2Nlc3NUb2tlbigpOiB2b2lkIHtcclxuICAgIGdldEFjY2Vzc1Rva2VuQ29va2llKCkudGhlbigoYWNjZXNzVG9rZW46IHN0cmluZyB8IHVuZGVmaW5lZCkgPT4ge1xyXG4gICAgICAgIGlmIChhY2Nlc3NUb2tlbikge1xyXG4gICAgICAgICAgICBsb2coJ2FjY2Vzc1Rva2VuIGNvb2tpZSBmb3VuZCE6ICcsIGFjY2Vzc1Rva2VuKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb2coJ25vIGFjY2Vzc1Rva2VuIGNvb2tpZSBmb3VuZCcpO1xyXG4gICAgICAgICAgICByZWZyZXNoQWNjZXNzVG9rZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuLy8gUmVxdWVzdCB0byByZWZyZXNoIHRoZSBhY2Nlc3MgdG9rZW5cclxuZnVuY3Rpb24gcmVmcmVzaEFjY2Vzc1Rva2VuKCk6IHZvaWQge1xyXG4gICAgc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgTWVzc2FnZU5hbWUuUmVmcmVzaEFjY2Vzc1Rva2VuLFxyXG4gICAgICAgIHt9LFxyXG4gICAgICAgIChyZXNwb25zZTogTWVzc2FnZVJlc3BvbnNlPHN0cmluZz4pID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBsb2coJ3JlZnJlc2hBY2Nlc3NUb2tlbiBlcnJvcjogJywgcmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG9nKCdyZWZyZXNoQWNjZXNzVG9rZW4gcmVzcG9uc2U6ICcsIHJlc3BvbnNlLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIHBhZ2VUeXBlRGV0ZWN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApO1xyXG59XHJcblxyXG4vLyBEZXRlY3QgdGhlIHR5cGUgb2YgcGFnZSBhbmQgaGFuZGxlIGFjY29yZGluZ2x5XHJcbmZ1bmN0aW9uIHBhZ2VUeXBlRGV0ZWN0KCk6IHZvaWQge1xyXG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pbmRleC5ncm91cC53b3JrJykpIHtcclxuICAgICAgICBzdGFuZGFyZEJsdXJic1BhZ2UoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgbG9nKCdzdGFuZGFyZEJsdXJic1BhZ2UgZG9uZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud29yay5tZXRhLmdyb3VwJykpIHtcclxuICAgICAgICBsb2coJ1dvcmsgUGFnZScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsb2coJ1BBTklLOiBVbmtub3duIHBhZ2UnKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gRGlzY29ubmVjdCB0aGUgY29udGVudCBzY3JpcHQgZnJvbSB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuZnVuY3Rpb24gZGlzY29ubmVjdENvbnRlbnRTY3JpcHQoKTogdm9pZCB7XHJcbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIobWVzc2FnZUxpc3RlbmVyKTtcclxuICAgIGNsb3NlUG9ydCgpO1xyXG59XHJcblxyXG4vLyBNYWluIGZ1bmN0aW9uIHRvIGluaXRpYWxpemUgdGhlIGNvbnRlbnQgc2NyaXB0XHJcbmV4cG9ydCBmdW5jdGlvbiBtYWluKCk6IHZvaWQge1xyXG4gICAgbG9nKCdsb2c6IGNvbnRlbnRfc2NyaXB0LnRzeCBsb2FkZWQnKTtcclxuICAgIGluaXRpYWxpemVQb3J0KCk7XHJcbiAgICBzZW5kTWVzc2FnZShcclxuICAgICAgICBNZXNzYWdlTmFtZS5DaGVja0xvZ2luLFxyXG4gICAgICAgIHt9LFxyXG4gICAgICAgIChyZXNwb25zZTogTWVzc2FnZVJlc3BvbnNlPGJvb2xlYW4+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgbG9nKCdjaGVja0xvZ2luIGVycm9yOiAnLCByZXNwb25zZS5lcnJvcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsb2coJ2NoZWNrTG9naW4gcmVzcG9uc2U6ICcsIHJlc3BvbnNlLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5yZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvZygndXNlciBpcyBsb2dnZWQgaW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlVHlwZURldGVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2coJ3VzZXIgaXMgbm90IGxvZ2dlZCBpbicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufVxyXG5cclxuLy8gQWRkIGV2ZW50IGxpc3RlbmVyc1xyXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobWVzc2FnZUxpc3RlbmVyKTtcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UpO1xyXG5cclxuLy8gRXhlY3V0ZSB0aGUgbWFpbiBmdW5jdGlvblxyXG5tYWluKCk7IiwiLy8gQHRzLWlnbm9yZVxyXG5pbXBvcnQgeyBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBtYWluIGFzIGNvbnRlbnRTY3JpcHRNYWluLCBtZXNzYWdlTGlzdGVuZXIgfSBmcm9tIFwiLi9jb250ZW50X3NjcmlwdFwiO1xyXG5cclxuZXhwb3J0ICogZnJvbSBcIi4vQW8zX0Jhc2VXb3JrLnRzXCJcclxuZXhwb3J0ICogZnJvbSBcIi4vQmFzZVdvcmsudHNcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vVXNlcl9CYXNlV29yay50c3hcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbnRlbnRTY3JpcHQoe1xyXG4gICAgbWF0Y2hlczogW1wiKjovLyouYXJjaGl2ZW9mb3Vyb3duLm9yZy8qXCJdLFxyXG4gICAgcnVuQXQ6IFwiZG9jdW1lbnRfZW5kXCIsXHJcbiAgICBhc3luYyBtYWluKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjb250ZW50IHNjcmlwdCBydW5uaW5nJyk7XHJcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKG1lc3NhZ2VMaXN0ZW5lcik7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UpO1xyXG4gICAgICAgIGNvbnRlbnRTY3JpcHRNYWluKCk7XHJcbiAgICB9LFxyXG59KTsiLCJleHBvcnQgY29uc3QgYnJvd3NlciA9IChcbiAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICBnbG9iYWxUaGlzLmJyb3dzZXI/LnJ1bnRpbWU/LmlkID09IG51bGwgPyBnbG9iYWxUaGlzLmNocm9tZSA6IChcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgZ2xvYmFsVGhpcy5icm93c2VyXG4gIClcbik7XG4iLCJmdW5jdGlvbiBwcmludChtZXRob2QsIC4uLmFyZ3MpIHtcbiAgaWYgKGltcG9ydC5tZXRhLmVudi5NT0RFID09PSBcInByb2R1Y3Rpb25cIikgcmV0dXJuO1xuICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09IFwic3RyaW5nXCIpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gYXJncy5zaGlmdCgpO1xuICAgIG1ldGhvZChgW3d4dF0gJHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIG1ldGhvZChcIlt3eHRdXCIsIC4uLmFyZ3MpO1xuICB9XG59XG5leHBvcnQgY29uc3QgbG9nZ2VyID0ge1xuICBkZWJ1ZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZGVidWcsIC4uLmFyZ3MpLFxuICBsb2c6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmxvZywgLi4uYXJncyksXG4gIHdhcm46ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLndhcm4sIC4uLmFyZ3MpLFxuICBlcnJvcjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZXJyb3IsIC4uLmFyZ3MpXG59O1xuIiwiaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuZXhwb3J0IGNsYXNzIFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG4gIGNvbnN0cnVjdG9yKG5ld1VybCwgb2xkVXJsKSB7XG4gICAgc3VwZXIoV3h0TG9jYXRpb25DaGFuZ2VFdmVudC5FVkVOVF9OQU1FLCB7fSk7XG4gICAgdGhpcy5uZXdVcmwgPSBuZXdVcmw7XG4gICAgdGhpcy5vbGRVcmwgPSBvbGRVcmw7XG4gIH1cbiAgc3RhdGljIEVWRU5UX05BTUUgPSBnZXRVbmlxdWVFdmVudE5hbWUoXCJ3eHQ6bG9jYXRpb25jaGFuZ2VcIik7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0VW5pcXVlRXZlbnROYW1lKGV2ZW50TmFtZSkge1xuICByZXR1cm4gYCR7YnJvd3Nlcj8ucnVudGltZT8uaWR9OiR7aW1wb3J0Lm1ldGEuZW52LkVOVFJZUE9JTlR9OiR7ZXZlbnROYW1lfWA7XG59XG4iLCJpbXBvcnQgeyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50IH0gZnJvbSBcIi4vY3VzdG9tLWV2ZW50cy5tanNcIjtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMb2NhdGlvbldhdGNoZXIoY3R4KSB7XG4gIGxldCBpbnRlcnZhbDtcbiAgbGV0IG9sZFVybDtcbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBFbnN1cmUgdGhlIGxvY2F0aW9uIHdhdGNoZXIgaXMgYWN0aXZlbHkgbG9va2luZyBmb3IgVVJMIGNoYW5nZXMuIElmIGl0J3MgYWxyZWFkeSB3YXRjaGluZyxcbiAgICAgKiB0aGlzIGlzIGEgbm9vcC5cbiAgICAgKi9cbiAgICBydW4oKSB7XG4gICAgICBpZiAoaW50ZXJ2YWwgIT0gbnVsbCkgcmV0dXJuO1xuICAgICAgb2xkVXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcbiAgICAgIGludGVydmFsID0gY3R4LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgbGV0IG5ld1VybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG4gICAgICAgIGlmIChuZXdVcmwuaHJlZiAhPT0gb2xkVXJsLmhyZWYpIHtcbiAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgV3h0TG9jYXRpb25DaGFuZ2VFdmVudChuZXdVcmwsIG9sZFVybCkpO1xuICAgICAgICAgIG9sZFVybCA9IG5ld1VybDtcbiAgICAgICAgfVxuICAgICAgfSwgMWUzKTtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBicm93c2VyIH0gZnJvbSBcInd4dC9icm93c2VyXCI7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tIFwiLi4vLi4vc2FuZGJveC91dGlscy9sb2dnZXIubWpzXCI7XG5pbXBvcnQgeyBnZXRVbmlxdWVFdmVudE5hbWUgfSBmcm9tIFwiLi9jdXN0b20tZXZlbnRzLm1qc1wiO1xuaW1wb3J0IHsgY3JlYXRlTG9jYXRpb25XYXRjaGVyIH0gZnJvbSBcIi4vbG9jYXRpb24td2F0Y2hlci5tanNcIjtcbmV4cG9ydCBjbGFzcyBDb250ZW50U2NyaXB0Q29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRlbnRTY3JpcHROYW1lLCBvcHRpb25zKSB7XG4gICAgdGhpcy5jb250ZW50U2NyaXB0TmFtZSA9IGNvbnRlbnRTY3JpcHROYW1lO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5hYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgaWYgKHRoaXMuaXNUb3BGcmFtZSkge1xuICAgICAgdGhpcy5saXN0ZW5Gb3JOZXdlclNjcmlwdHMoeyBpZ25vcmVGaXJzdEV2ZW50OiB0cnVlIH0pO1xuICAgICAgdGhpcy5zdG9wT2xkU2NyaXB0cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxpc3RlbkZvck5ld2VyU2NyaXB0cygpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFID0gZ2V0VW5pcXVlRXZlbnROYW1lKFxuICAgIFwid3h0OmNvbnRlbnQtc2NyaXB0LXN0YXJ0ZWRcIlxuICApO1xuICBpc1RvcEZyYW1lID0gd2luZG93LnNlbGYgPT09IHdpbmRvdy50b3A7XG4gIGFib3J0Q29udHJvbGxlcjtcbiAgbG9jYXRpb25XYXRjaGVyID0gY3JlYXRlTG9jYXRpb25XYXRjaGVyKHRoaXMpO1xuICByZWNlaXZlZE1lc3NhZ2VJZHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICBnZXQgc2lnbmFsKCkge1xuICAgIHJldHVybiB0aGlzLmFib3J0Q29udHJvbGxlci5zaWduYWw7XG4gIH1cbiAgYWJvcnQocmVhc29uKSB7XG4gICAgcmV0dXJuIHRoaXMuYWJvcnRDb250cm9sbGVyLmFib3J0KHJlYXNvbik7XG4gIH1cbiAgZ2V0IGlzSW52YWxpZCgpIHtcbiAgICBpZiAoYnJvd3Nlci5ydW50aW1lLmlkID09IG51bGwpIHtcbiAgICAgIHRoaXMubm90aWZ5SW52YWxpZGF0ZWQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2lnbmFsLmFib3J0ZWQ7XG4gIH1cbiAgZ2V0IGlzVmFsaWQoKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzSW52YWxpZDtcbiAgfVxuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGUgY29udGVudCBzY3JpcHQncyBjb250ZXh0IGlzIGludmFsaWRhdGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoY2IpO1xuICAgKiBjb25zdCByZW1vdmVJbnZhbGlkYXRlZExpc3RlbmVyID0gY3R4Lm9uSW52YWxpZGF0ZWQoKCkgPT4ge1xuICAgKiAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIoY2IpO1xuICAgKiB9KVxuICAgKiAvLyAuLi5cbiAgICogcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lcigpO1xuICAgKi9cbiAgb25JbnZhbGlkYXRlZChjYikge1xuICAgIHRoaXMuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBjYik7XG4gICAgcmV0dXJuICgpID0+IHRoaXMuc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBjYik7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybiBhIHByb21pc2UgdGhhdCBuZXZlciByZXNvbHZlcy4gVXNlZnVsIGlmIHlvdSBoYXZlIGFuIGFzeW5jIGZ1bmN0aW9uIHRoYXQgc2hvdWxkbid0IHJ1blxuICAgKiBhZnRlciB0aGUgY29udGV4dCBpcyBleHBpcmVkLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjb25zdCBnZXRWYWx1ZUZyb21TdG9yYWdlID0gYXN5bmMgKCkgPT4ge1xuICAgKiAgIGlmIChjdHguaXNJbnZhbGlkKSByZXR1cm4gY3R4LmJsb2NrKCk7XG4gICAqXG4gICAqICAgLy8gLi4uXG4gICAqIH1cbiAgICovXG4gIGJsb2NrKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgoKSA9PiB7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0SW50ZXJ2YWxgIHRoYXQgYXV0b21hdGljYWxseSBjbGVhcnMgdGhlIGludGVydmFsIHdoZW4gaW52YWxpZGF0ZWQuXG4gICAqL1xuICBzZXRJbnRlcnZhbChoYW5kbGVyLCB0aW1lb3V0KSB7XG4gICAgY29uc3QgaWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKSBoYW5kbGVyKCk7XG4gICAgfSwgdGltZW91dCk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFySW50ZXJ2YWwoaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbiAgLyoqXG4gICAqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0VGltZW91dGAgdGhhdCBhdXRvbWF0aWNhbGx5IGNsZWFycyB0aGUgaW50ZXJ2YWwgd2hlbiBpbnZhbGlkYXRlZC5cbiAgICovXG4gIHNldFRpbWVvdXQoaGFuZGxlciwgdGltZW91dCkge1xuICAgIGNvbnN0IGlkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKSBoYW5kbGVyKCk7XG4gICAgfSwgdGltZW91dCk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFyVGltZW91dChpZCkpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuICAvKipcbiAgICogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZSByZXF1ZXN0IHdoZW5cbiAgICogaW52YWxpZGF0ZWQuXG4gICAqL1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2FsbGJhY2spIHtcbiAgICBjb25zdCBpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoLi4uYXJncykgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZCkgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgfSk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG4gIC8qKlxuICAgKiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2tgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZSByZXF1ZXN0IHdoZW5cbiAgICogaW52YWxpZGF0ZWQuXG4gICAqL1xuICByZXF1ZXN0SWRsZUNhbGxiYWNrKGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgY29uc3QgaWQgPSByZXF1ZXN0SWRsZUNhbGxiYWNrKCguLi5hcmdzKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc2lnbmFsLmFib3J0ZWQpIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgIH0sIG9wdGlvbnMpO1xuICAgIHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjYW5jZWxJZGxlQ2FsbGJhY2soaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbiAgYWRkRXZlbnRMaXN0ZW5lcih0YXJnZXQsIHR5cGUsIGhhbmRsZXIsIG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZSA9PT0gXCJ3eHQ6bG9jYXRpb25jaGFuZ2VcIikge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZCkgdGhpcy5sb2NhdGlvbldhdGNoZXIucnVuKCk7XG4gICAgfVxuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyPy4oXG4gICAgICB0eXBlLnN0YXJ0c1dpdGgoXCJ3eHQ6XCIpID8gZ2V0VW5pcXVlRXZlbnROYW1lKHR5cGUpIDogdHlwZSxcbiAgICAgIGhhbmRsZXIsXG4gICAgICB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIHNpZ25hbDogdGhpcy5zaWduYWxcbiAgICAgIH1cbiAgICApO1xuICB9XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQWJvcnQgdGhlIGFib3J0IGNvbnRyb2xsZXIgYW5kIGV4ZWN1dGUgYWxsIGBvbkludmFsaWRhdGVkYCBsaXN0ZW5lcnMuXG4gICAqL1xuICBub3RpZnlJbnZhbGlkYXRlZCgpIHtcbiAgICB0aGlzLmFib3J0KFwiQ29udGVudCBzY3JpcHQgY29udGV4dCBpbnZhbGlkYXRlZFwiKTtcbiAgICBsb2dnZXIuZGVidWcoXG4gICAgICBgQ29udGVudCBzY3JpcHQgXCIke3RoaXMuY29udGVudFNjcmlwdE5hbWV9XCIgY29udGV4dCBpbnZhbGlkYXRlZGBcbiAgICApO1xuICB9XG4gIHN0b3BPbGRTY3JpcHRzKCkge1xuICAgIHdpbmRvdy5wb3N0TWVzc2FnZShcbiAgICAgIHtcbiAgICAgICAgdHlwZTogQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLFxuICAgICAgICBjb250ZW50U2NyaXB0TmFtZTogdGhpcy5jb250ZW50U2NyaXB0TmFtZSxcbiAgICAgICAgbWVzc2FnZUlkOiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyKVxuICAgICAgfSxcbiAgICAgIFwiKlwiXG4gICAgKTtcbiAgfVxuICB2ZXJpZnlTY3JpcHRTdGFydGVkRXZlbnQoZXZlbnQpIHtcbiAgICBjb25zdCBpc1NjcmlwdFN0YXJ0ZWRFdmVudCA9IGV2ZW50LmRhdGE/LnR5cGUgPT09IENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRTtcbiAgICBjb25zdCBpc1NhbWVDb250ZW50U2NyaXB0ID0gZXZlbnQuZGF0YT8uY29udGVudFNjcmlwdE5hbWUgPT09IHRoaXMuY29udGVudFNjcmlwdE5hbWU7XG4gICAgY29uc3QgaXNOb3REdXBsaWNhdGUgPSAhdGhpcy5yZWNlaXZlZE1lc3NhZ2VJZHMuaGFzKGV2ZW50LmRhdGE/Lm1lc3NhZ2VJZCk7XG4gICAgcmV0dXJuIGlzU2NyaXB0U3RhcnRlZEV2ZW50ICYmIGlzU2FtZUNvbnRlbnRTY3JpcHQgJiYgaXNOb3REdXBsaWNhdGU7XG4gIH1cbiAgbGlzdGVuRm9yTmV3ZXJTY3JpcHRzKG9wdGlvbnMpIHtcbiAgICBsZXQgaXNGaXJzdCA9IHRydWU7XG4gICAgY29uc3QgY2IgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICh0aGlzLnZlcmlmeVNjcmlwdFN0YXJ0ZWRFdmVudChldmVudCkpIHtcbiAgICAgICAgdGhpcy5yZWNlaXZlZE1lc3NhZ2VJZHMuYWRkKGV2ZW50LmRhdGEubWVzc2FnZUlkKTtcbiAgICAgICAgY29uc3Qgd2FzRmlyc3QgPSBpc0ZpcnN0O1xuICAgICAgICBpc0ZpcnN0ID0gZmFsc2U7XG4gICAgICAgIGlmICh3YXNGaXJzdCAmJiBvcHRpb25zPy5pZ25vcmVGaXJzdEV2ZW50KSByZXR1cm47XG4gICAgICAgIHRoaXMubm90aWZ5SW52YWxpZGF0ZWQoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGNiKTtcbiAgICB0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gcmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgY2IpKTtcbiAgfVxufVxuIiwiY29uc3QgbnVsbEtleSA9IFN5bWJvbCgnbnVsbCcpOyAvLyBgb2JqZWN0SGFzaGVzYCBrZXkgZm9yIG51bGxcblxubGV0IGtleUNvdW50ZXIgPSAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYW55S2V5c01hcCBleHRlbmRzIE1hcCB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl9vYmplY3RIYXNoZXMgPSBuZXcgV2Vha01hcCgpO1xuXHRcdHRoaXMuX3N5bWJvbEhhc2hlcyA9IG5ldyBNYXAoKTsgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvZWNtYTI2Mi9pc3N1ZXMvMTE5NFxuXHRcdHRoaXMuX3B1YmxpY0tleXMgPSBuZXcgTWFwKCk7XG5cblx0XHRjb25zdCBbcGFpcnNdID0gYXJndW1lbnRzOyAvLyBNYXAgY29tcGF0XG5cdFx0aWYgKHBhaXJzID09PSBudWxsIHx8IHBhaXJzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIHBhaXJzW1N5bWJvbC5pdGVyYXRvcl0gIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IodHlwZW9mIHBhaXJzICsgJyBpcyBub3QgaXRlcmFibGUgKGNhbm5vdCByZWFkIHByb3BlcnR5IFN5bWJvbChTeW1ib2wuaXRlcmF0b3IpKScpO1xuXHRcdH1cblxuXHRcdGZvciAoY29uc3QgW2tleXMsIHZhbHVlXSBvZiBwYWlycykge1xuXHRcdFx0dGhpcy5zZXQoa2V5cywgdmFsdWUpO1xuXHRcdH1cblx0fVxuXG5cdF9nZXRQdWJsaWNLZXlzKGtleXMsIGNyZWF0ZSA9IGZhbHNlKSB7XG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KGtleXMpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUga2V5cyBwYXJhbWV0ZXIgbXVzdCBiZSBhbiBhcnJheScpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHByaXZhdGVLZXkgPSB0aGlzLl9nZXRQcml2YXRlS2V5KGtleXMsIGNyZWF0ZSk7XG5cblx0XHRsZXQgcHVibGljS2V5O1xuXHRcdGlmIChwcml2YXRlS2V5ICYmIHRoaXMuX3B1YmxpY0tleXMuaGFzKHByaXZhdGVLZXkpKSB7XG5cdFx0XHRwdWJsaWNLZXkgPSB0aGlzLl9wdWJsaWNLZXlzLmdldChwcml2YXRlS2V5KTtcblx0XHR9IGVsc2UgaWYgKGNyZWF0ZSkge1xuXHRcdFx0cHVibGljS2V5ID0gWy4uLmtleXNdOyAvLyBSZWdlbmVyYXRlIGtleXMgYXJyYXkgdG8gYXZvaWQgZXh0ZXJuYWwgaW50ZXJhY3Rpb25cblx0XHRcdHRoaXMuX3B1YmxpY0tleXMuc2V0KHByaXZhdGVLZXksIHB1YmxpY0tleSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtwcml2YXRlS2V5LCBwdWJsaWNLZXl9O1xuXHR9XG5cblx0X2dldFByaXZhdGVLZXkoa2V5cywgY3JlYXRlID0gZmFsc2UpIHtcblx0XHRjb25zdCBwcml2YXRlS2V5cyA9IFtdO1xuXHRcdGZvciAobGV0IGtleSBvZiBrZXlzKSB7XG5cdFx0XHRpZiAoa2V5ID09PSBudWxsKSB7XG5cdFx0XHRcdGtleSA9IG51bGxLZXk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGhhc2hlcyA9IHR5cGVvZiBrZXkgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBrZXkgPT09ICdmdW5jdGlvbicgPyAnX29iamVjdEhhc2hlcycgOiAodHlwZW9mIGtleSA9PT0gJ3N5bWJvbCcgPyAnX3N5bWJvbEhhc2hlcycgOiBmYWxzZSk7XG5cblx0XHRcdGlmICghaGFzaGVzKSB7XG5cdFx0XHRcdHByaXZhdGVLZXlzLnB1c2goa2V5KTtcblx0XHRcdH0gZWxzZSBpZiAodGhpc1toYXNoZXNdLmhhcyhrZXkpKSB7XG5cdFx0XHRcdHByaXZhdGVLZXlzLnB1c2godGhpc1toYXNoZXNdLmdldChrZXkpKTtcblx0XHRcdH0gZWxzZSBpZiAoY3JlYXRlKSB7XG5cdFx0XHRcdGNvbnN0IHByaXZhdGVLZXkgPSBgQEBta20tcmVmLSR7a2V5Q291bnRlcisrfUBAYDtcblx0XHRcdFx0dGhpc1toYXNoZXNdLnNldChrZXksIHByaXZhdGVLZXkpO1xuXHRcdFx0XHRwcml2YXRlS2V5cy5wdXNoKHByaXZhdGVLZXkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShwcml2YXRlS2V5cyk7XG5cdH1cblxuXHRzZXQoa2V5cywgdmFsdWUpIHtcblx0XHRjb25zdCB7cHVibGljS2V5fSA9IHRoaXMuX2dldFB1YmxpY0tleXMoa2V5cywgdHJ1ZSk7XG5cdFx0cmV0dXJuIHN1cGVyLnNldChwdWJsaWNLZXksIHZhbHVlKTtcblx0fVxuXG5cdGdldChrZXlzKSB7XG5cdFx0Y29uc3Qge3B1YmxpY0tleX0gPSB0aGlzLl9nZXRQdWJsaWNLZXlzKGtleXMpO1xuXHRcdHJldHVybiBzdXBlci5nZXQocHVibGljS2V5KTtcblx0fVxuXG5cdGhhcyhrZXlzKSB7XG5cdFx0Y29uc3Qge3B1YmxpY0tleX0gPSB0aGlzLl9nZXRQdWJsaWNLZXlzKGtleXMpO1xuXHRcdHJldHVybiBzdXBlci5oYXMocHVibGljS2V5KTtcblx0fVxuXG5cdGRlbGV0ZShrZXlzKSB7XG5cdFx0Y29uc3Qge3B1YmxpY0tleSwgcHJpdmF0ZUtleX0gPSB0aGlzLl9nZXRQdWJsaWNLZXlzKGtleXMpO1xuXHRcdHJldHVybiBCb29sZWFuKHB1YmxpY0tleSAmJiBzdXBlci5kZWxldGUocHVibGljS2V5KSAmJiB0aGlzLl9wdWJsaWNLZXlzLmRlbGV0ZShwcml2YXRlS2V5KSk7XG5cdH1cblxuXHRjbGVhcigpIHtcblx0XHRzdXBlci5jbGVhcigpO1xuXHRcdHRoaXMuX3N5bWJvbEhhc2hlcy5jbGVhcigpO1xuXHRcdHRoaXMuX3B1YmxpY0tleXMuY2xlYXIoKTtcblx0fVxuXG5cdGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcblx0XHRyZXR1cm4gJ01hbnlLZXlzTWFwJztcblx0fVxuXG5cdGdldCBzaXplKCkge1xuXHRcdHJldHVybiBzdXBlci5zaXplO1xuXHR9XG59XG4iLCJpbXBvcnQgTWFueUtleXNNYXAgZnJvbSAnbWFueS1rZXlzLW1hcCc7XG5pbXBvcnQgeyBkZWZ1IH0gZnJvbSAnZGVmdSc7XG5pbXBvcnQgeyBpc0V4aXN0IH0gZnJvbSAnLi9kZXRlY3RvcnMubWpzJztcblxuY29uc3QgZ2V0RGVmYXVsdE9wdGlvbnMgPSAoKSA9PiAoe1xuICB0YXJnZXQ6IGdsb2JhbFRoaXMuZG9jdW1lbnQsXG4gIHVuaWZ5UHJvY2VzczogdHJ1ZSxcbiAgZGV0ZWN0b3I6IGlzRXhpc3QsXG4gIG9ic2VydmVDb25maWdzOiB7XG4gICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIHN1YnRyZWU6IHRydWUsXG4gICAgYXR0cmlidXRlczogdHJ1ZVxuICB9LFxuICBzaWduYWw6IHZvaWQgMCxcbiAgY3VzdG9tTWF0Y2hlcjogdm9pZCAwXG59KTtcbmNvbnN0IG1lcmdlT3B0aW9ucyA9ICh1c2VyU2lkZU9wdGlvbnMsIGRlZmF1bHRPcHRpb25zKSA9PiB7XG4gIHJldHVybiBkZWZ1KHVzZXJTaWRlT3B0aW9ucywgZGVmYXVsdE9wdGlvbnMpO1xufTtcblxuY29uc3QgdW5pZnlDYWNoZSA9IG5ldyBNYW55S2V5c01hcCgpO1xuZnVuY3Rpb24gY3JlYXRlV2FpdEVsZW1lbnQoaW5zdGFuY2VPcHRpb25zKSB7XG4gIGNvbnN0IHsgZGVmYXVsdE9wdGlvbnMgfSA9IGluc3RhbmNlT3B0aW9ucztcbiAgcmV0dXJuIChzZWxlY3Rvciwgb3B0aW9ucykgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHRhcmdldCxcbiAgICAgIHVuaWZ5UHJvY2VzcyxcbiAgICAgIG9ic2VydmVDb25maWdzLFxuICAgICAgZGV0ZWN0b3IsXG4gICAgICBzaWduYWwsXG4gICAgICBjdXN0b21NYXRjaGVyXG4gICAgfSA9IG1lcmdlT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0T3B0aW9ucyk7XG4gICAgY29uc3QgdW5pZnlQcm9taXNlS2V5ID0gW1xuICAgICAgc2VsZWN0b3IsXG4gICAgICB0YXJnZXQsXG4gICAgICB1bmlmeVByb2Nlc3MsXG4gICAgICBvYnNlcnZlQ29uZmlncyxcbiAgICAgIGRldGVjdG9yLFxuICAgICAgc2lnbmFsLFxuICAgICAgY3VzdG9tTWF0Y2hlclxuICAgIF07XG4gICAgY29uc3QgY2FjaGVkUHJvbWlzZSA9IHVuaWZ5Q2FjaGUuZ2V0KHVuaWZ5UHJvbWlzZUtleSk7XG4gICAgaWYgKHVuaWZ5UHJvY2VzcyAmJiBjYWNoZWRQcm9taXNlKSB7XG4gICAgICByZXR1cm4gY2FjaGVkUHJvbWlzZTtcbiAgICB9XG4gICAgY29uc3QgZGV0ZWN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKFxuICAgICAgLy8gYmlvbWUtaWdub3JlIGxpbnQvc3VzcGljaW91cy9ub0FzeW5jUHJvbWlzZUV4ZWN1dG9yOiBhdm9pZCBuZXN0aW5nIHByb21pc2VcbiAgICAgIGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKHNpZ25hbD8uYWJvcnRlZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3Qoc2lnbmFsLnJlYXNvbik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihcbiAgICAgICAgICBhc3luYyAobXV0YXRpb25zKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IF8gb2YgbXV0YXRpb25zKSB7XG4gICAgICAgICAgICAgIGlmIChzaWduYWw/LmFib3J0ZWQpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc3QgZGV0ZWN0UmVzdWx0MiA9IGF3YWl0IGRldGVjdEVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIHRhcmdldCxcbiAgICAgICAgICAgICAgICBkZXRlY3RvcixcbiAgICAgICAgICAgICAgICBjdXN0b21NYXRjaGVyXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAoZGV0ZWN0UmVzdWx0Mi5pc0RldGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZGV0ZWN0UmVzdWx0Mi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBzaWduYWw/LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgXCJhYm9ydFwiLFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIHJldHVybiByZWplY3Qoc2lnbmFsLnJlYXNvbik7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IG9uY2U6IHRydWUgfVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBkZXRlY3RSZXN1bHQgPSBhd2FpdCBkZXRlY3RFbGVtZW50KHtcbiAgICAgICAgICBzZWxlY3RvcixcbiAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgZGV0ZWN0b3IsXG4gICAgICAgICAgY3VzdG9tTWF0Y2hlclxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGRldGVjdFJlc3VsdC5pc0RldGVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoZGV0ZWN0UmVzdWx0LnJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXQsIG9ic2VydmVDb25maWdzKTtcbiAgICAgIH1cbiAgICApLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgdW5pZnlDYWNoZS5kZWxldGUodW5pZnlQcm9taXNlS2V5KTtcbiAgICB9KTtcbiAgICB1bmlmeUNhY2hlLnNldCh1bmlmeVByb21pc2VLZXksIGRldGVjdFByb21pc2UpO1xuICAgIHJldHVybiBkZXRlY3RQcm9taXNlO1xuICB9O1xufVxuYXN5bmMgZnVuY3Rpb24gZGV0ZWN0RWxlbWVudCh7XG4gIHRhcmdldCxcbiAgc2VsZWN0b3IsXG4gIGRldGVjdG9yLFxuICBjdXN0b21NYXRjaGVyXG59KSB7XG4gIGNvbnN0IGVsZW1lbnQgPSBjdXN0b21NYXRjaGVyID8gY3VzdG9tTWF0Y2hlcihzZWxlY3RvcikgOiB0YXJnZXQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gIHJldHVybiBhd2FpdCBkZXRlY3RvcihlbGVtZW50KTtcbn1cbmNvbnN0IHdhaXRFbGVtZW50ID0gY3JlYXRlV2FpdEVsZW1lbnQoe1xuICBkZWZhdWx0T3B0aW9uczogZ2V0RGVmYXVsdE9wdGlvbnMoKVxufSk7XG5cbmV4cG9ydCB7IGNyZWF0ZVdhaXRFbGVtZW50LCBnZXREZWZhdWx0T3B0aW9ucywgd2FpdEVsZW1lbnQgfTtcbiJdLCJuYW1lcyI6WyJkZWZpbml0aW9uIiwiTWVzc2FnZU5hbWUiLCJfYSIsInRvZ2dsZUVsIiwiV29ya1N0YXR1cyIsInJlc3VsdCIsImNvbnRlbnRTY3JpcHRNYWluIiwicHJpbnQiLCJsb2dnZXIiLCJfYiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQU8sV0FBUyxvQkFBb0JBLGFBQVk7QUFDOUMsV0FBT0E7QUFBQSxFQUNUO0FDY0EsUUFBTSxNQUFPLHlCQUFVLGFBQWE7QUFJaEMsV0FBTyxJQUFJLFNBQWM7QUFDYixjQUFBLElBQUksR0FBRyxJQUFJO0FBQUEsSUFDdkI7QUFBQSxFQUNKLEVBQXVCOztBQ25CdkIsTUFBSSxPQUFtQztBQU1oQyxRQUFNLGlCQUFpQixNQUFNO0FBQ2hDLFlBQVEsSUFBSSxzQkFBc0I7QUFDbEMsUUFBSSxDQUFDLE1BQU07QUFDUCxhQUFPLE9BQU8sUUFBUSxRQUFRLEVBQUUsTUFBTSxtQkFBbUI7QUFFcEQsV0FBQSxhQUFhLFlBQVksTUFBTTtBQUNoQyxZQUFJLG9CQUFvQjtBQUNqQixlQUFBO0FBQUEsTUFBQSxDQUNWO0FBQUEsSUFBQTtBQUFBLEVBRVQ7QUFFTyxRQUFNLFlBQVksTUFBTTtBQUMzQixRQUFJLE1BQU07QUFDTixXQUFLLFdBQVc7QUFDVCxhQUFBO0FBQUEsSUFBQTtBQUFBLEVBRWY7QUFPWSxNQUFBLGdDQUFBQyxpQkFBTDtBQUNIQSxpQkFBQSxnQkFBaUIsSUFBQTtBQUNqQkEsaUJBQUEsWUFBYSxJQUFBO0FBQ2JBLGlCQUFBLGdCQUFpQixJQUFBO0FBQ2pCQSxpQkFBQSxrQkFBbUIsSUFBQTtBQUNuQkEsaUJBQUEscUJBQXNCLElBQUE7QUFDdEJBLGlCQUFBLG9CQUFxQixJQUFBO0FBQ3JCQSxpQkFBQSxtQkFBb0IsSUFBQTtBQVBaQSxXQUFBQTtBQUFBQSxFQUFBLEdBQUEsZUFBQSxDQUFBLENBQUE7QUE0R0wsUUFBTSxjQUFjLENBQ3ZCLE1BQ0EsU0FDQSxhQUNPO0FBQ1AsUUFBSSxDQUFDLE1BQU07QUFDUCxjQUFRLE1BQU0sc0JBQXNCO0FBQ3BDO0FBQUEsSUFBQTtBQUVKLFNBQUssWUFBWSxFQUFFLE1BQU0sUUFBQSxDQUFTO0FBRzVCLFVBQUEsYUFBYSxDQUFDLGFBQXFDO0FBQ3JELGVBQVMsUUFBUTtBQUNYLG1DQUFBLFVBQVUsZUFBZTtBQUFBLElBQ25DO0FBQ0ssU0FBQSxVQUFVLFlBQVksVUFBVTtBQUFBLEVBQ3pDOztFQzNKTyxNQUFlLFNBQVM7QUFBQSxJQUdqQixZQUFZLFFBQWdCO0FBRnRDO0FBR0ksV0FBSyxTQUFTO0FBQUEsSUFBQTtBQUFBLEVBSXRCOztFQ1ZPLE1BQU0scUJBQXFCLFNBQVM7QUFBQSxJQVV2QyxZQUFZLFFBQWdCLE9BQWUsU0FBbUIsU0FBbUIsZUFBeUIsTUFBZ0IsYUFBcUIsV0FBbUIsY0FBc0I7QUFDcEwsWUFBTSxNQUFNO0FBVmhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJSSxXQUFLLFFBQVE7QUFDYixXQUFLLFVBQVU7QUFDZixXQUFLLFVBQVU7QUFDZixXQUFLLGdCQUFnQjtBQUNyQixXQUFLLE9BQU87QUFDWixXQUFLLGNBQWM7QUFDbkIsV0FBSyxZQUFZO0FBQ2pCLFdBQUssZUFBZTtBQUFBLElBQUE7QUFBQSxJQUd4QixRQUFRLFFBQThCOztBQUNsQyxZQUFNLFdBQVcsU0FBUyxjQUFjLFNBQVMsTUFBTSxFQUFFO0FBRXpELFVBQUksQ0FBQyxVQUFVO0FBQ1gsY0FBTSxJQUFJLE1BQU0sUUFBUSxNQUFNLG9CQUFvQjtBQUFBLE1BQUE7QUFFdEQsWUFBTSxRQUFRLFNBQVMsY0FBYyxjQUFjLEVBQUc7QUFFaEQsWUFBQSxjQUFjLFNBQVMsaUJBQWlCLGdCQUFnQjtBQUM5RCxZQUFNLFVBQVUsTUFBTSxLQUFLLFdBQVcsRUFBRTtBQUFBLFFBQ3BDLENBQUMsZUFBZSxXQUFXO0FBQUEsTUFDL0I7QUFFTSxZQUFBLGNBQWMsU0FBUyxpQkFBaUIsY0FBYztBQUM1RCxZQUFNLFVBQVUsTUFBTSxLQUFLLFdBQVcsRUFBRTtBQUFBLFFBQ3BDLENBQUMsZUFBZSxXQUFXO0FBQUEsTUFDL0I7QUFFTSxZQUFBLGdCQUFnQixDQUFDLGFBQWE7QUFFOUIsWUFBQSxPQUFPLENBQUMsYUFBYTtBQUUzQixZQUFNLGNBQWM7QUFFcEIsWUFBTSxZQUFZLFNBQVMsY0FBYyxVQUFVLEVBQUc7QUFFdEQsVUFBSSxnQkFDQUMsTUFBQSxTQUFTLGNBQWMsaUJBQWlCLE1BQXhDLGdCQUFBQSxJQUEyQztBQUMvQyxVQUFJLENBQUMsY0FBYztBQUVBLHVCQUFBO0FBQUEsTUFBQTtBQUduQixhQUFPLElBQUk7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQSxTQUFTLFVBQVcsUUFBUSxNQUFNLEVBQUUsQ0FBQztBQUFBLFFBQ3JDLFNBQVMsYUFBYyxRQUFRLE1BQU0sRUFBRSxDQUFDO0FBQUEsTUFDNUM7QUFBQSxJQUFBO0FBQUEsSUFHSixPQUFPLFdBQVcsVUFBMEI7O0FBQ3hDLFVBQUksQ0FBQyxVQUFVO0FBQ0wsY0FBQSxJQUFJLE1BQU0sd0JBQXdCO0FBQUEsTUFBQTtBQUd4QyxVQUFBO0FBRUosVUFBRyxTQUFTLElBQUk7QUFDWixpQkFBUyxTQUFTLFNBQVMsR0FBRyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFBQSxNQUFBLE9BRTFDO0FBQ0ssY0FBQSxhQUFhLFNBQVMsY0FBYyxPQUFPO0FBQ2pELFlBQUksQ0FBQyxZQUFZO0FBQ1AsZ0JBQUEsSUFBSSxNQUFNLHdCQUF3QjtBQUFBLFFBQUE7QUFFNUMsaUJBQVMsU0FBUyxXQUFXLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQUEsTUFBQTtBQUdqRCxZQUFNLFFBQVEsU0FBUyxjQUFjLGNBQWMsRUFBRztBQUVoRCxZQUFBLGNBQWMsU0FBUyxpQkFBaUIsZ0JBQWdCO0FBQzlELFlBQU0sVUFBVSxNQUFNLEtBQUssV0FBVyxFQUFFO0FBQUEsUUFDcEMsQ0FBQyxlQUFlLFdBQVc7QUFBQSxNQUMvQjtBQUVNLFlBQUEsY0FBYyxTQUFTLGlCQUFpQixjQUFjO0FBQzVELFlBQU0sVUFBVSxNQUFNLEtBQUssV0FBVyxFQUFFO0FBQUEsUUFDcEMsQ0FBQyxlQUFlLFdBQVc7QUFBQSxNQUMvQjtBQUVNLFlBQUEsb0JBQW9CLFNBQVMsaUJBQWlCLG9CQUFvQjtBQUN4RSxZQUFNLGdCQUFnQixNQUFNLEtBQUssaUJBQWlCLEVBQUU7QUFBQSxRQUNoRCxDQUFDLHFCQUFxQixpQkFBaUI7QUFBQSxNQUMzQztBQUVNLFlBQUEsV0FBVyxTQUFTLGlCQUFpQixnREFBZ0Q7QUFDM0YsWUFBTSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7QUFBQSxRQUM5QixDQUFDLFlBQVksUUFBUTtBQUFBLE1BQ3pCO0FBRUEsWUFBTSxjQUFjLFNBQVMsY0FBYyxjQUFjLEVBQUc7QUFFNUQsWUFBTSxZQUFZLFNBQVMsY0FBYyxVQUFVLEVBQUc7QUFFdEQsVUFBSSxnQkFDQUEsTUFBQSxTQUFTLGNBQWMsaUJBQWlCLE1BQXhDLGdCQUFBQSxJQUEyQztBQUMvQyxVQUFJLENBQUMsY0FBYztBQUVBLHVCQUFBO0FBQUEsTUFBQTtBQUduQixhQUFPLElBQUk7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQSxTQUFTLFVBQVcsUUFBUSxNQUFNLEVBQUUsQ0FBQztBQUFBLFFBQ3JDLFNBQVMsYUFBYyxRQUFRLE1BQU0sRUFBRSxDQUFDO0FBQUEsTUFDNUM7QUFBQSxJQUFBO0FBQUEsRUFHUjs7QUNqSUEsUUFBTSxpQkFBaUI7QUFBQSxJQUNuQixTQUFTO0FBQUEsSUFDVCxRQUFRO0FBQUEsSUFDUixTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxNQUFNO0FBQUEsRUFDVjtBQVFnQixXQUFBLGlCQUFpQixZQUF3QixVQUFnQjtBQUNyRSxVQUFNLFNBQVM7QUFDVCxVQUFBLE9BQU8sT0FBTyxjQUFjLE9BQU87QUFDekMsVUFBTSxTQUFTO0FBQ1QsVUFBQSxXQUFXLE9BQU8sY0FBYyxlQUFlO0FBRXJELFFBQUksWUFBWSxNQUFNO0FBQ3RCLFFBQUksY0FBYyxRQUFRO0FBQzFCLFFBQUksWUFBWSxNQUFNO0FBRXRCLFlBQVEsWUFBWTtBQUFBLE1BQ2hCLEtBQUs7QUFDRCxlQUFPLFVBQVUsSUFBSSxVQUFVLGVBQWUsT0FBTztBQUNyRDtBQUFBLE1BQ0osS0FBSztBQUNNLGVBQUEsVUFBVSxJQUFJLFVBQVMsZ0JBQWdCO0FBQzlDO0FBQUEsTUFDSixLQUFLO0FBQ00sZUFBQSxVQUFVLElBQUksVUFBUyxnQkFBZ0I7QUFDOUM7QUFBQSxNQUNKLEtBQUs7QUFDTSxlQUFBLFVBQVUsSUFBSSxVQUFTLGdCQUFnQjtBQUM5QztBQUFBLE1BQ0osS0FBSztBQUNLLGFBQUEsVUFBVSxJQUFJLFVBQVMsYUFBYTtBQUV2QyxZQUFBLFNBQVMsY0FBYyxpQkFBaUIsWUFBWSxZQUFZLFNBQVMsY0FBYyxpQkFBaUIsQ0FBRTtBQUMxRyxZQUFBLFNBQVMsY0FBYyxhQUFhLFlBQVksWUFBWSxTQUFTLGNBQWMsYUFBYSxDQUFFO0FBRTVGLGlCQUFBLFlBQVksWUFBWSxNQUFNLENBQUM7QUFDL0IsaUJBQUEsWUFBWSxRQUFRLE1BQU0sQ0FBQztBQUNwQztBQUFBLE1BQ0o7QUFDSyxlQUFPLEtBQUssY0FBYyxFQUF5QyxRQUFRLENBQUMsV0FBVztBQUNwRixpQkFBTyxVQUFVLE9BQU8sZUFBZSxNQUFNLENBQUM7QUFBQSxRQUFBLENBQ2pEO0FBQ0QsZUFBTyxpQkFBaUIsU0FBUyxFQUFFLFFBQVEsQ0FBQyxhQUFhO0FBQUUsbUJBQVMsT0FBTztBQUFBLFFBQUEsQ0FBRztBQUM5RSxpQkFBUyxpQkFBaUIsYUFBYSxFQUFFLFFBQVEsQ0FBQyxXQUFXO0FBQUUsaUJBQU8sT0FBTztBQUFBLFFBQUEsQ0FBRztBQUNoRixpQkFBUyxpQkFBaUIsU0FBUyxFQUFFLFFBQVEsQ0FBQ0MsY0FBYTtBQUFFQSxvQkFBUyxPQUFPO0FBQUEsUUFBQSxDQUFHO0FBQzdFLFlBQUEsU0FBUyxjQUFjLGlCQUFpQixZQUFZLFlBQVksU0FBUyxjQUFjLGlCQUFpQixDQUFFO0FBQ3BHLGlCQUFBLFlBQVksWUFBWSxNQUFNLENBQUM7QUFDeEM7QUFBQSxJQUFBO0FBRVIsUUFBSSxVQUFVLE1BQU07QUFDYixXQUFBO0FBQUEsRUFDWDs7QUNoRVksTUFBQSwrQkFBQUMsZ0JBQUw7QUFDSEEsZ0JBQUEsU0FBVSxJQUFBO0FBQ1ZBLGdCQUFBLFFBQVMsSUFBQTtBQUNUQSxnQkFBQSxTQUFVLElBQUE7QUFDVkEsZ0JBQUEsU0FBVSxJQUFBO0FBQ1ZBLGdCQUFBLE1BQU8sSUFBQTtBQUNQQSxnQkFBQSxTQUFVLElBQUE7QUFORkEsV0FBQUE7QUFBQUEsRUFBQSxHQUFBLGNBQUEsQ0FBQSxDQUFBOztBQ0daLFFBQU0saUJBQWlDLENBQUM7QUFBQSxJQUNwQyxRQUFRO0FBQUEsSUFDUixPQUFNLG9CQUFJLEtBQUssR0FBRSxlQUFlO0FBQUEsRUFDcEMsQ0FBQztBQUFBLEVBT00sTUFBTSxzQkFBc0IsU0FBUztBQUFBLElBU3hDLFlBQVksUUFBZ0IsT0FBZ0IsUUFBcUIsU0FBMEIsY0FBeUIsUUFBaUIsV0FBb0IsWUFBcUI7QUFDMUssWUFBTSxNQUFNO0FBVGhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUksV0FBSyxRQUFRLFNBQVM7QUFDakIsV0FBQSxTQUFTLFVBQVUsV0FBVztBQUNuQyxXQUFLLFVBQVUsV0FBVztBQUNyQixXQUFBLGVBQWUsZ0JBQWdCLENBQUM7QUFDckMsV0FBSyxTQUFTLFVBQVU7QUFDeEIsV0FBSyxZQUFZLGFBQWE7QUFDOUIsV0FBSyxhQUFhLGNBQWM7QUFBQSxJQUFBO0FBQUEsSUFHcEMsUUFBUSxRQUErQjtBQUNuQyxhQUFPLElBQUk7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0EsV0FBVztBQUFBLFFBQ1g7QUFBQSxRQUNBLENBQUM7QUFBQSxRQUNEO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFBQTtBQUFBLElBR0osa0JBQWtCLE1BQXFCO0FBQUEsSUFBQTtBQUFBLEVBRzNDOztBQ2pEZ0IsV0FBQSxLQUFLLFFBQWMsU0FBZTtBQUN2QyxXQUFBLFdBQVksYUFBYSxTQUFTLE1BQU07QUFDL0MsWUFBUSxZQUFZLE1BQU07QUFBQSxFQUM5Qjs7O0FDb0JnQixXQUFBLGlCQUFpQixhQUF1QixVQUEyQjtBQUNuRSxnQkFBQSxRQUFRLENBQUMsTUFBTSxVQUFVO0FBQ2pDLFlBQU0sU0FBUztBQUNmLFlBQU0sY0FBYyxPQUFPLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUdwQyxZQUFBLFdBQVcsU0FBUyxjQUFjLEtBQUs7QUFDN0MsZUFBUyxVQUFVLElBQUksc0JBQXNCLHFCQUFxQixXQUFXO0FBRTdFLGVBQVMsTUFBTSxVQUFVLEtBQUssVUFBVSxpQkFBaUIsTUFBTSxDQUFDO0FBR2hFLFdBQUssTUFBTSxRQUFRO0FBR2IsWUFBQSxVQUFVLFNBQVMsY0FBYyxJQUFJO0FBQ25DLGNBQUEsVUFBVSxJQUFJLGdCQUFnQixtQkFBbUI7QUFDekQsZUFBUyxZQUFZLE9BQU87QUFHcEIsY0FBQSxZQUFZLFlBQVksUUFBUSxDQUFDO0FBR2hDLGVBQUEsYUFBYSxTQUFTLElBQUk7QUFBQSxJQUFBLENBQ3RDO0FBQUEsRUFDTDtBQU9PLFdBQVMsZUFBZSxVQUFnQztBQUNyRCxVQUFBLGNBQWMsU0FBUyxjQUFjLEdBQUc7QUFDOUMsZ0JBQVksY0FBYztBQUMxQixnQkFBWSxZQUFZO0FBRVosZ0JBQUEsaUJBQWlCLFNBQVMsT0FBTyxNQUFNO0FBQy9DLFFBQUUsZUFBZTtBQUVqQixVQUFJLHNCQUFzQixRQUFRO0FBRTVCLFlBQUEsWUFBWSxhQUFhLFdBQVcsUUFBUTtBQUNsRCxVQUFJLGVBQWUsU0FBUztBQUU1QjtBQUFBLFFBQ0ksWUFBWTtBQUFBLFFBQ1osRUFBRSxNQUFNLFVBQVU7QUFBQSxRQUNsQixDQUFDLGFBQTZDO0FBQzFDLGNBQUksU0FBUyxPQUFPO0FBQ1osZ0JBQUEsbUJBQW1CLFNBQVMsS0FBSztBQUFBLFVBQUEsT0FDbEM7QUFDQyxnQkFBQSw2QkFBNkIsU0FBUyxRQUFRO0FBQ2pDLDZCQUFBLFdBQVcsTUFBTSxRQUFRO0FBQUEsVUFBQTtBQUFBLFFBRTlDO0FBQUEsTUFFUjtBQUFBLElBQUEsQ0FDSDtBQUVNLFdBQUE7QUFBQSxFQUNYO0FBT08sV0FBUyxrQkFBa0IsVUFBZ0M7QUFDeEQsVUFBQSxjQUFjLFNBQVMsY0FBYyxHQUFHO0FBQzlDLGdCQUFZLGNBQWM7QUFDMUIsZ0JBQVksWUFBWTtBQUVaLGdCQUFBLGlCQUFpQixTQUFTLE9BQU8sTUFBTTtBQUMvQyxRQUFFLGVBQWU7QUFFakIsVUFBSSx5QkFBeUIsUUFBUTtBQUUvQixZQUFBLFlBQVksYUFBYSxXQUFXLFFBQVE7QUFDbEQsVUFBSSxzQkFBc0IsU0FBUztBQUVuQztBQUFBLFFBQ0ksWUFBWTtBQUFBLFFBQ1osRUFBRSxRQUFRLFVBQVUsT0FBTztBQUFBLFFBQzNCLENBQUMsYUFBdUM7QUFDcEMsY0FBSSxTQUFTLE9BQU87QUFDWixnQkFBQSxzQkFBc0IsU0FBUyxLQUFLO0FBQUEsVUFBQSxPQUNyQztBQUNDLGdCQUFBLDZCQUE2QixTQUFTLFFBQVE7QUFDakMsNkJBQUEsV0FBVyxTQUFTLFFBQVE7QUFBQSxVQUFBO0FBQUEsUUFDakQ7QUFBQSxNQUVSO0FBQUEsSUFBQSxDQUNIO0FBRU0sV0FBQTtBQUFBLEVBQ1g7QUFPTyxXQUFTLFlBQVksVUFBeUI7QUFFM0MsVUFBQSxPQUFPLFNBQVMsY0FBYyxPQUFPO0FBQzNDLFVBQU0sU0FBUyxLQUFLLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUU3QixVQUFBLFdBQVcsU0FBUyxjQUFjLEtBQUs7QUFDN0MsYUFBUyxZQUFZO0FBQ3JCLFdBQU8sUUFBUSxRQUFRLElBQUksUUFBUSxDQUFDQyxZQUFXO0FBQ3ZDLFVBQUEsQ0FBQ0EsUUFBTyxNQUFNLEdBQUc7QUFDUixpQkFBQSxZQUFZLGVBQWUsUUFBUSxDQUFDO0FBQUEsTUFBQSxPQUMxQztBQUNILFlBQUksMkJBQTJCLE1BQU0sSUFBSUEsUUFBTyxNQUFNLENBQUM7QUFDOUMsaUJBQUEsWUFBWSwwQkFBMEIsUUFBUSxDQUFDO0FBQy9DLGlCQUFBLFlBQVksa0JBQWtCLFFBQVEsQ0FBQztBQUFBLE1BQUE7QUFBQSxJQUNwRCxDQUNIO0FBRU0sV0FBQTtBQUFBLEVBQ1g7QUFPTyxXQUFTLFFBQVEsTUFBcUI7QUFDekMsUUFBSSx5QkFBeUIsSUFBSTtBQUVqQyxVQUFNLFNBQVMsS0FBSyxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDbkMsUUFBSSxZQUFZLE1BQU07QUFFaEIsVUFBQSxPQUFPLFNBQVMsY0FBYyxLQUFLO0FBQ3pDLFNBQUssWUFBWTtBQUVqQixXQUFPLFFBQVEsUUFBUSxJQUFJLFFBQVEsQ0FBQ0EsWUFBVztBQUMzQyxVQUFJLCtCQUErQkEsT0FBTTtBQUNuQyxZQUFBLFdBQVdBLFFBQU8sTUFBTTtBQUM5QixVQUFJLGNBQWMsUUFBUTtBQUUxQixZQUFNLFVBQVUsU0FBUyxVQUNuQixPQUFPLFNBQVMsWUFBWSxXQUN4QixLQUFLLE1BQU0sU0FBUyxPQUFPLElBQzNCLFNBQVMsVUFDYixDQUFDO0FBRVAsVUFBSSxVQUFVO0FBQ1YsVUFBQSxRQUFRLFdBQVcsR0FBRztBQUNoQixjQUFBLE9BQU8sSUFBSSxLQUFLLFFBQVEsUUFBUSxTQUFTLENBQUMsRUFBRSxJQUFJO0FBQ3RELGNBQU0sU0FBUyxDQUFDLE9BQU8sT0FBTyxPQUFPLE9BQU8sT0FBTyxPQUFPLE9BQU8sT0FBTyxPQUFPLE9BQU8sT0FBTyxLQUFLO0FBQ2xHLGtCQUFVLEdBQUcsS0FBSyxRQUFTLENBQUEsSUFBSSxPQUFPLEtBQUssU0FBVSxDQUFBLENBQUMsSUFBSSxLQUFLLFlBQWEsQ0FBQTtBQUFBLE1BQUE7QUFFaEYsV0FBSyxZQUFZO0FBRVgsWUFBQSxXQUFXLFNBQVMsY0FBYyxHQUFHO0FBQ2xDLGVBQUEsY0FBYyxjQUFjLE9BQU87QUFDbkMsZUFBQSxVQUFVLElBQUksYUFBYSxVQUFVO0FBRXhDLFlBQUEsWUFBWSxTQUFTLGNBQWMsR0FBRztBQUNsQyxnQkFBQSxjQUFjLFFBQVEsU0FBUyxTQUFTO0FBQ3hDLGdCQUFBLFVBQVUsSUFBSSxjQUFjLFVBQVU7QUFFaEQsV0FBSyxZQUFZLFFBQVE7QUFDekIsV0FBSyxZQUFZLFNBQVM7QUFBQSxJQUFBLENBQzdCO0FBRU0sV0FBQTtBQUFBLEVBQ1g7QUFPQSxXQUFTLDBCQUEwQixVQUFnQztBQUN6RCxVQUFBLGNBQWMsU0FBUyxjQUFjLEdBQUc7QUFDOUMsZ0JBQVksY0FBYztBQUMxQixnQkFBWSxZQUFZO0FBRVosZ0JBQUEsaUJBQWlCLFNBQVMsT0FBTyxNQUFNO0FBQy9DLFFBQUUsZUFBZTtBQUVqQixVQUFJLGlDQUFpQyxRQUFRO0FBRXZDLFlBQUEsUUFBUSxhQUFhLFdBQVcsUUFBUTtBQUN4QyxZQUFBLFNBQVMsR0FBRyxNQUFNLE1BQU07QUFFOUIsYUFBTyxRQUFRLFFBQVEsSUFBSSxRQUFRLENBQUNBLFlBQVc7QUFDdkMsWUFBQSxDQUFDQSxRQUFPLE1BQU0sR0FBRztBQUNqQjtBQUFBLFFBQUE7QUFFRSxjQUFBLFFBQVFBLFFBQU8sTUFBTSxNQUFNO0FBQ2pDLFlBQUksV0FBVyxLQUFLO0FBRXBCLGNBQU0sYUFBYTtBQUNiLGNBQUEsVUFBVSxNQUFNLFVBQ2hCLE9BQU8sTUFBTSxZQUFZLFdBQ3JCLEtBQUssTUFBTSxNQUFNLE9BQU8sSUFDeEIsTUFBTSxVQUNWLENBQUMsRUFBRSxRQUFRLFNBQVMsTUFBTSxZQUFZO0FBQzVDLGdCQUFRLEtBQUs7QUFBQSxVQUNULFFBQVE7QUFBQSxVQUNSLE9BQU0sb0JBQUksS0FBSyxHQUFFLGVBQWU7QUFBQSxRQUFBLENBQ25DO0FBQ0QsWUFBSSxRQUFRLE9BQU87QUFFbkIsY0FBTSxPQUFPLElBQUk7QUFBQSxVQUNiLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxVQUNOO0FBQUEsVUFDQSxNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsUUFDVjtBQUVBO0FBQUEsVUFDSSxZQUFZO0FBQUEsVUFDWixFQUFFLEtBQVc7QUFBQSxVQUNiLENBQUMsYUFBdUM7QUFDcEMsZ0JBQUksU0FBUyxPQUFPO0FBQ1osa0JBQUEsOEJBQThCLFNBQVMsS0FBSztBQUFBLFlBQUEsT0FDN0M7QUFDQyxrQkFBQSw2QkFBNkIsU0FBUyxRQUFRO0FBQ2pDLCtCQUFBLFdBQVcsTUFBTSxRQUFRO0FBQUEsWUFBQTtBQUFBLFVBQzlDO0FBQUEsUUFFUjtBQUFBLE1BQUEsQ0FDSDtBQUFBLElBQUEsQ0FDSjtBQUVNLFdBQUE7QUFBQSxFQUNYOztBQzFQQSxpQkFBc0IscUJBQXFCO0FBRWpDLFVBQUEsZUFBZSxTQUFTLGlCQUFpQixxQkFBcUI7QUFDaEUsUUFBQSxhQUFhLFNBQVMsR0FBRztBQUN6QixVQUFJLGlDQUFpQztBQUNyQztBQUFBLElBQUE7QUFHRSxVQUFBLGNBQWMsU0FBUyxpQkFBaUIsc0JBQXNCO0FBRXBFLFFBQUksYUFBdUIsQ0FBQztBQUNoQixnQkFBQSxRQUFRLENBQUMsU0FBUztBQUMxQixZQUFNLFNBQVM7QUFDZixVQUFJLE9BQU8sVUFBVSxTQUFTLFVBQVUsR0FBRztBQUM1QixtQkFBQSxLQUFLLE9BQU8sT0FBTyxVQUFVLENBQUMsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUFBLE1BQUEsT0FDdEQ7QUFDUSxtQkFBQSxLQUFLLE9BQU8sT0FBTyxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQUEsTUFBQTtBQUFBLElBQ25ELENBQ0g7QUFFRCxRQUFJLGdCQUFnQixVQUFVO0FBRWYsbUJBQUE7QUFFZjtBQUFBLE1BQ0ksWUFBWTtBQUFBLE1BQ1osRUFBRSxNQUFNLFdBQVc7QUFBQSxNQUNuQixPQUFPLGFBQXlDO0FBQzVDLFlBQUksK0JBQStCLFFBQVE7QUFDM0MsWUFBSSxhQUFhLE1BQU07QUFDbkIsY0FBSSw2QkFBNkI7QUFDaEIsMkJBQUEsV0FBZTtBQUNoQztBQUFBLFFBQUE7QUFFSixZQUFJLFNBQVMsT0FBTztBQUNaLGNBQUEsZ0NBQWdDLFNBQVMsS0FBSztBQUNsRDtBQUFBLFFBQUE7QUFFRSxjQUFBLG1CQUFtQixhQUFhLFNBQVMsUUFBUTtBQUN2RCxZQUFJLHlCQUF5QjtBQUNaLHlCQUFBLGFBQWEsU0FBUyxRQUFRO0FBQUEsTUFBQTtBQUFBLElBRXZEO0FBQUEsRUFDSjtBQU9BLGlCQUFlLG1CQUFtQixhQUF1QixVQUFxQjtBQUMxRSxRQUFHLGFBQWEsTUFBTTtBQUNYLGFBQUE7QUFBQSxJQUFBLE9BQ0o7QUFDTSxlQUFBLFFBQVEsQ0FBQyxTQUFrQixVQUFrQjtBQUNsRCxZQUFJLGFBQWEsT0FBTztBQUN4QixZQUFJLFNBQVM7QUFDSCxnQkFBQSxTQUFVLFlBQVksS0FBSyxFQUFjLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUM5RCxpQkFBTyxRQUFRLFFBQVEsSUFBSSxRQUFRLENBQUNBLFlBQVc7QUFDM0MsZ0JBQUksb0JBQW9CQSxPQUFNO0FBQzlCLGdCQUFJQSxRQUFPLE1BQU0sRUFBRSxXQUFXLFdBQVcsTUFBTTtBQUMzQywrQkFBaUIsV0FBVyxNQUFPLFlBQVksS0FBSyxFQUFFLFVBQVk7QUFBQSxZQUFBO0FBQUEsVUFDdEUsQ0FDSDtBQUFBLFFBQUE7QUFBQSxNQUNMLENBQ0g7QUFBQSxJQUFBO0FBQUEsRUFFVDs7QUMxREEsaUJBQXNCLHVCQUFvRDs7QUFDdEUsVUFBTSxVQUFVLFNBQVMsT0FBTyxNQUFNLEdBQUcsRUFBRSxJQUFJLENBQUEsV0FBVSxPQUFPLEtBQU8sRUFBQSxNQUFNLEdBQUcsQ0FBQztBQUNqRixRQUFJLG1CQUFtQixPQUFPO0FBQ3ZCLFlBQUFILE1BQUEsUUFBUSxLQUFLLENBQVUsV0FBQSxPQUFPLENBQUMsTUFBTSxhQUFhLE1BQWxELGdCQUFBQSxJQUFzRDtBQUFBLEVBQ2pFOztBQ1RPLFFBQU0sa0JBQWtCLENBQUMsU0FBa0IsUUFBc0MsaUJBQWdEO0FBQ2hJLFFBQUEsa0JBQWtCLG1CQUFtQixPQUFPO0FBQzVDLFFBQUEsUUFBUSxZQUFZLGVBQWU7QUFDbkMsVUFBSSxhQUFhO0FBQ2pCLHdCQUFrQixZQUFZO0FBQUEsSUFBQTtBQUFBLEVBRXRDO0FBR0EsV0FBUyxrQkFBa0IsY0FBNkM7QUFDNUMsNEJBQUE7QUFDWCxpQkFBQSxFQUFFLFVBQVUscUJBQXFCO0FBQUEsRUFDbEQ7QUFHTyxXQUFTLHlCQUErQjtBQUN2QyxRQUFBLFNBQVMsb0JBQW9CLFdBQVc7QUFDeEMsVUFBSSxvQkFBb0I7QUFDVCxxQkFBQTtBQUNFLHVCQUFBO0FBQUEsSUFBQSxPQUNkO0FBQ0gsVUFBSSxpQ0FBaUM7QUFDM0IsZ0JBQUE7QUFDYyw4QkFBQTtBQUFBLElBQUE7QUFBQSxFQUVoQztBQUdBLFdBQVMsbUJBQXlCO0FBQ1QseUJBQUEsRUFBRSxLQUFLLENBQUMsZ0JBQW9DO0FBQzdELFVBQUksYUFBYTtBQUNiLFlBQUksK0JBQStCLFdBQVc7QUFBQSxNQUFBLE9BQzNDO0FBQ0gsWUFBSSw2QkFBNkI7QUFDZCwyQkFBQTtBQUFBLE1BQUE7QUFBQSxJQUN2QixDQUNIO0FBQUEsRUFDTDtBQUdBLFdBQVMscUJBQTJCO0FBQ2hDO0FBQUEsTUFDSSxZQUFZO0FBQUEsTUFDWixDQUFDO0FBQUEsTUFDRCxDQUFDLGFBQXNDO0FBQ25DLFlBQUksU0FBUyxPQUFPO0FBQ1osY0FBQSw4QkFBOEIsU0FBUyxLQUFLO0FBQUEsUUFBQSxPQUM3QztBQUNDLGNBQUEsaUNBQWlDLFNBQVMsUUFBUTtBQUN2Qyx5QkFBQTtBQUFBLFFBQUE7QUFBQSxNQUNuQjtBQUFBLElBRVI7QUFBQSxFQUNKO0FBR0EsV0FBUyxpQkFBdUI7QUFDeEIsUUFBQSxTQUFTLGNBQWMsbUJBQW1CLEdBQUc7QUFDMUIseUJBQUEsRUFBRSxLQUFLLE1BQU07QUFDNUIsWUFBSSx5QkFBeUI7QUFBQSxNQUFBLENBQ2hDO0FBQUEsSUFDTSxXQUFBLFNBQVMsY0FBYyxrQkFBa0IsR0FBRztBQUNuRCxVQUFJLFdBQVc7QUFBQSxJQUFBLE9BQ1o7QUFDSCxVQUFJLHFCQUFxQjtBQUFBLElBQUE7QUFBQSxFQUVqQztBQUdBLFdBQVMsMEJBQWdDO0FBQzlCLFdBQUEsUUFBUSxVQUFVLGVBQWUsZUFBZTtBQUM3QyxjQUFBO0FBQUEsRUFDZDtBQUdPLFdBQVMsT0FBYTtBQUN6QixRQUFJLGdDQUFnQztBQUNyQixtQkFBQTtBQUNmO0FBQUEsTUFDSSxZQUFZO0FBQUEsTUFDWixDQUFDO0FBQUEsTUFDRCxDQUFDLGFBQXVDO0FBQ3BDLFlBQUksU0FBUyxPQUFPO0FBQ1osY0FBQSxzQkFBc0IsU0FBUyxLQUFLO0FBQUEsUUFBQSxPQUNyQztBQUNDLGNBQUEseUJBQXlCLFNBQVMsUUFBUTtBQUM5QyxjQUFJLFNBQVMsVUFBVTtBQUNuQixnQkFBSSxtQkFBbUI7QUFDUiwyQkFBQTtBQUFBLFVBQUEsT0FDWjtBQUNILGdCQUFJLHVCQUF1QjtBQUFBLFVBQUE7QUFBQSxRQUMvQjtBQUFBLE1BQ0o7QUFBQSxJQUVSO0FBQUEsRUFDSjtBQUdBLFNBQU8sUUFBUSxVQUFVLFlBQVksZUFBZTtBQUNwRCxXQUFTLGlCQUFpQixvQkFBb0Isc0JBQXNCO0FBR3BFLE9BQUs7O0FDM0dMLFFBQUEsYUFBZSxvQkFBb0I7QUFBQSxJQUMvQixTQUFTLENBQUMsNkJBQTZCO0FBQUEsSUFDdkMsT0FBTztBQUFBLElBQ1AsTUFBTSxPQUFPO0FBQ1QsY0FBUSxJQUFJLHdCQUF3QjtBQUM3QixhQUFBLFFBQVEsVUFBVSxZQUFZLGVBQWU7QUFDM0MsZUFBQSxpQkFBaUIsb0JBQW9CLHNCQUFzQjtBQUNsREksV0FBQTtBQUFBLElBQUE7QUFBQSxFQUUxQixDQUFDOztBQ2hCTSxRQUFNO0FBQUE7QUFBQSxNQUVYLHNCQUFXLFlBQVgsbUJBQW9CLFlBQXBCLG1CQUE2QixPQUFNLE9BQU8sV0FBVztBQUFBO0FBQUEsTUFFbkQsV0FBVztBQUFBO0FBQUE7QUNKZixXQUFTQyxRQUFNLFdBQVcsTUFBTTtBQUU5QixRQUFJLE9BQU8sS0FBSyxDQUFDLE1BQU0sVUFBVTtBQUN6QixZQUFBLFVBQVUsS0FBSyxNQUFNO0FBQzNCLGFBQU8sU0FBUyxPQUFPLElBQUksR0FBRyxJQUFJO0FBQUEsSUFBQSxPQUM3QjtBQUNFLGFBQUEsU0FBUyxHQUFHLElBQUk7QUFBQSxJQUFBO0FBQUEsRUFFM0I7QUFDTyxRQUFNQyxXQUFTO0FBQUEsSUFDcEIsT0FBTyxJQUFJLFNBQVNELFFBQU0sUUFBUSxPQUFPLEdBQUcsSUFBSTtBQUFBLElBQ2hELEtBQUssSUFBSSxTQUFTQSxRQUFNLFFBQVEsS0FBSyxHQUFHLElBQUk7QUFBQSxJQUM1QyxNQUFNLElBQUksU0FBU0EsUUFBTSxRQUFRLE1BQU0sR0FBRyxJQUFJO0FBQUEsSUFDOUMsT0FBTyxJQUFJLFNBQVNBLFFBQU0sUUFBUSxPQUFPLEdBQUcsSUFBSTtBQUFBLEVBQ2xEO0FDYk8sUUFBTSwwQkFBTixNQUFNLGdDQUErQixNQUFNO0FBQUEsSUFDaEQsWUFBWSxRQUFRLFFBQVE7QUFDcEIsWUFBQSx3QkFBdUIsWUFBWSxFQUFFO0FBQzNDLFdBQUssU0FBUztBQUNkLFdBQUssU0FBUztBQUFBLElBQUE7QUFBQSxFQUdsQjtBQURFLGdCQU5XLHlCQU1KLGNBQWEsbUJBQW1CLG9CQUFvQjtBQU50RCxNQUFNLHlCQUFOO0FBUUEsV0FBUyxtQkFBbUIsV0FBVzs7QUFDNUMsV0FBTyxJQUFHTCxNQUFBLG1DQUFTLFlBQVQsZ0JBQUFBLElBQWtCLEVBQUUsSUFBSSxTQUEwQixJQUFJLFNBQVM7QUFBQSxFQUMzRTtBQ1ZPLFdBQVMsc0JBQXNCLEtBQUs7QUFDekMsUUFBSTtBQUNKLFFBQUk7QUFDSixXQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUtMLE1BQU07QUFDSixZQUFJLFlBQVksS0FBTTtBQUN0QixpQkFBUyxJQUFJLElBQUksU0FBUyxJQUFJO0FBQzlCLG1CQUFXLElBQUksWUFBWSxNQUFNO0FBQy9CLGNBQUksU0FBUyxJQUFJLElBQUksU0FBUyxJQUFJO0FBQ2xDLGNBQUksT0FBTyxTQUFTLE9BQU8sTUFBTTtBQUMvQixtQkFBTyxjQUFjLElBQUksdUJBQXVCLFFBQVEsTUFBTSxDQUFDO0FBQy9ELHFCQUFTO0FBQUEsVUFDbkI7QUFBQSxRQUNPLEdBQUUsR0FBRztBQUFBLE1BQ1o7QUFBQSxJQUNHO0FBQUEsRUFDSDtBQ2pCTyxRQUFNLHdCQUFOLE1BQU0sc0JBQXFCO0FBQUEsSUFDaEMsWUFBWSxtQkFBbUIsU0FBUztBQWN4Qyx3Q0FBYSxPQUFPLFNBQVMsT0FBTztBQUNwQztBQUNBLDZDQUFrQixzQkFBc0IsSUFBSTtBQUM1QyxnREFBcUMsb0JBQUksSUFBSztBQWhCNUMsV0FBSyxvQkFBb0I7QUFDekIsV0FBSyxVQUFVO0FBQ2YsV0FBSyxrQkFBa0IsSUFBSSxnQkFBaUI7QUFDNUMsVUFBSSxLQUFLLFlBQVk7QUFDbkIsYUFBSyxzQkFBc0IsRUFBRSxrQkFBa0IsS0FBSSxDQUFFO0FBQ3JELGFBQUssZUFBZ0I7QUFBQSxNQUMzQixPQUFXO0FBQ0wsYUFBSyxzQkFBdUI7QUFBQSxNQUNsQztBQUFBLElBQ0E7QUFBQSxJQVFFLElBQUksU0FBUztBQUNYLGFBQU8sS0FBSyxnQkFBZ0I7QUFBQSxJQUNoQztBQUFBLElBQ0UsTUFBTSxRQUFRO0FBQ1osYUFBTyxLQUFLLGdCQUFnQixNQUFNLE1BQU07QUFBQSxJQUM1QztBQUFBLElBQ0UsSUFBSSxZQUFZO0FBQ2QsVUFBSSxRQUFRLFFBQVEsTUFBTSxNQUFNO0FBQzlCLGFBQUssa0JBQW1CO0FBQUEsTUFDOUI7QUFDSSxhQUFPLEtBQUssT0FBTztBQUFBLElBQ3ZCO0FBQUEsSUFDRSxJQUFJLFVBQVU7QUFDWixhQUFPLENBQUMsS0FBSztBQUFBLElBQ2pCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQWNFLGNBQWMsSUFBSTtBQUNoQixXQUFLLE9BQU8saUJBQWlCLFNBQVMsRUFBRTtBQUN4QyxhQUFPLE1BQU0sS0FBSyxPQUFPLG9CQUFvQixTQUFTLEVBQUU7QUFBQSxJQUM1RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVlFLFFBQVE7QUFDTixhQUFPLElBQUksUUFBUSxNQUFNO0FBQUEsTUFDN0IsQ0FBSztBQUFBLElBQ0w7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlFLFlBQVksU0FBUyxTQUFTO0FBQzVCLFlBQU0sS0FBSyxZQUFZLE1BQU07QUFDM0IsWUFBSSxLQUFLLFFBQVMsU0FBUztBQUFBLE1BQzVCLEdBQUUsT0FBTztBQUNWLFdBQUssY0FBYyxNQUFNLGNBQWMsRUFBRSxDQUFDO0FBQzFDLGFBQU87QUFBQSxJQUNYO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJRSxXQUFXLFNBQVMsU0FBUztBQUMzQixZQUFNLEtBQUssV0FBVyxNQUFNO0FBQzFCLFlBQUksS0FBSyxRQUFTLFNBQVM7QUFBQSxNQUM1QixHQUFFLE9BQU87QUFDVixXQUFLLGNBQWMsTUFBTSxhQUFhLEVBQUUsQ0FBQztBQUN6QyxhQUFPO0FBQUEsSUFDWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLRSxzQkFBc0IsVUFBVTtBQUM5QixZQUFNLEtBQUssc0JBQXNCLElBQUksU0FBUztBQUM1QyxZQUFJLEtBQUssUUFBUyxVQUFTLEdBQUcsSUFBSTtBQUFBLE1BQ3hDLENBQUs7QUFDRCxXQUFLLGNBQWMsTUFBTSxxQkFBcUIsRUFBRSxDQUFDO0FBQ2pELGFBQU87QUFBQSxJQUNYO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtFLG9CQUFvQixVQUFVLFNBQVM7QUFDckMsWUFBTSxLQUFLLG9CQUFvQixJQUFJLFNBQVM7QUFDMUMsWUFBSSxDQUFDLEtBQUssT0FBTyxRQUFTLFVBQVMsR0FBRyxJQUFJO0FBQUEsTUFDM0MsR0FBRSxPQUFPO0FBQ1YsV0FBSyxjQUFjLE1BQU0sbUJBQW1CLEVBQUUsQ0FBQztBQUMvQyxhQUFPO0FBQUEsSUFDWDtBQUFBLElBQ0UsaUJBQWlCLFFBQVEsTUFBTSxTQUFTLFNBQVM7O0FBQy9DLFVBQUksU0FBUyxzQkFBc0I7QUFDakMsWUFBSSxLQUFLLFFBQVMsTUFBSyxnQkFBZ0IsSUFBSztBQUFBLE1BQ2xEO0FBQ0ksT0FBQUEsTUFBQSxPQUFPLHFCQUFQLGdCQUFBQSxJQUFBO0FBQUE7QUFBQSxRQUNFLEtBQUssV0FBVyxNQUFNLElBQUksbUJBQW1CLElBQUksSUFBSTtBQUFBLFFBQ3JEO0FBQUEsUUFDQTtBQUFBLFVBQ0UsR0FBRztBQUFBLFVBQ0gsUUFBUSxLQUFLO0FBQUEsUUFDckI7QUFBQTtBQUFBLElBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0Usb0JBQW9CO0FBQ2xCLFdBQUssTUFBTSxvQ0FBb0M7QUFDL0NNLGVBQU87QUFBQSxRQUNMLG1CQUFtQixLQUFLLGlCQUFpQjtBQUFBLE1BQzFDO0FBQUEsSUFDTDtBQUFBLElBQ0UsaUJBQWlCO0FBQ2YsYUFBTztBQUFBLFFBQ0w7QUFBQSxVQUNFLE1BQU0sc0JBQXFCO0FBQUEsVUFDM0IsbUJBQW1CLEtBQUs7QUFBQSxVQUN4QixXQUFXLEtBQUssT0FBUSxFQUFDLFNBQVMsRUFBRSxFQUFFLE1BQU0sQ0FBQztBQUFBLFFBQzlDO0FBQUEsUUFDRDtBQUFBLE1BQ0Q7QUFBQSxJQUNMO0FBQUEsSUFDRSx5QkFBeUIsT0FBTzs7QUFDOUIsWUFBTSx5QkFBdUJOLE1BQUEsTUFBTSxTQUFOLGdCQUFBQSxJQUFZLFVBQVMsc0JBQXFCO0FBQ3ZFLFlBQU0sd0JBQXNCTyxNQUFBLE1BQU0sU0FBTixnQkFBQUEsSUFBWSx1QkFBc0IsS0FBSztBQUNuRSxZQUFNLGlCQUFpQixDQUFDLEtBQUssbUJBQW1CLEtBQUksV0FBTSxTQUFOLG1CQUFZLFNBQVM7QUFDekUsYUFBTyx3QkFBd0IsdUJBQXVCO0FBQUEsSUFDMUQ7QUFBQSxJQUNFLHNCQUFzQixTQUFTO0FBQzdCLFVBQUksVUFBVTtBQUNkLFlBQU0sS0FBSyxDQUFDLFVBQVU7QUFDcEIsWUFBSSxLQUFLLHlCQUF5QixLQUFLLEdBQUc7QUFDeEMsZUFBSyxtQkFBbUIsSUFBSSxNQUFNLEtBQUssU0FBUztBQUNoRCxnQkFBTSxXQUFXO0FBQ2pCLG9CQUFVO0FBQ1YsY0FBSSxhQUFZLG1DQUFTLGtCQUFrQjtBQUMzQyxlQUFLLGtCQUFtQjtBQUFBLFFBQ2hDO0FBQUEsTUFDSztBQUNELHVCQUFpQixXQUFXLEVBQUU7QUFDOUIsV0FBSyxjQUFjLE1BQU0sb0JBQW9CLFdBQVcsRUFBRSxDQUFDO0FBQUEsSUFDL0Q7QUFBQSxFQUNBO0FBckpFLGdCQVpXLHVCQVlKLCtCQUE4QjtBQUFBLElBQ25DO0FBQUEsRUFDRDtBQWRJLE1BQU0sdUJBQU47QUNKUCxRQUFNLFVBQVUsT0FBTyxNQUFNO0FBRTdCLE1BQUksYUFBYTtBQUFBLEVBRUYsTUFBTSxvQkFBb0IsSUFBSTtBQUFBLElBQzVDLGNBQWM7QUFDYixZQUFPO0FBRVAsV0FBSyxnQkFBZ0Isb0JBQUksUUFBUztBQUNsQyxXQUFLLGdCQUFnQixvQkFBSTtBQUN6QixXQUFLLGNBQWMsb0JBQUksSUFBSztBQUU1QixZQUFNLENBQUMsS0FBSyxJQUFJO0FBQ2hCLFVBQUksVUFBVSxRQUFRLFVBQVUsUUFBVztBQUMxQztBQUFBLE1BQ0g7QUFFRSxVQUFJLE9BQU8sTUFBTSxPQUFPLFFBQVEsTUFBTSxZQUFZO0FBQ2pELGNBQU0sSUFBSSxVQUFVLE9BQU8sUUFBUSxpRUFBaUU7QUFBQSxNQUN2RztBQUVFLGlCQUFXLENBQUMsTUFBTSxLQUFLLEtBQUssT0FBTztBQUNsQyxhQUFLLElBQUksTUFBTSxLQUFLO0FBQUEsTUFDdkI7QUFBQSxJQUNBO0FBQUEsSUFFQyxlQUFlLE1BQU0sU0FBUyxPQUFPO0FBQ3BDLFVBQUksQ0FBQyxNQUFNLFFBQVEsSUFBSSxHQUFHO0FBQ3pCLGNBQU0sSUFBSSxVQUFVLHFDQUFxQztBQUFBLE1BQzVEO0FBRUUsWUFBTSxhQUFhLEtBQUssZUFBZSxNQUFNLE1BQU07QUFFbkQsVUFBSTtBQUNKLFVBQUksY0FBYyxLQUFLLFlBQVksSUFBSSxVQUFVLEdBQUc7QUFDbkQsb0JBQVksS0FBSyxZQUFZLElBQUksVUFBVTtBQUFBLE1BQzNDLFdBQVUsUUFBUTtBQUNsQixvQkFBWSxDQUFDLEdBQUcsSUFBSTtBQUNwQixhQUFLLFlBQVksSUFBSSxZQUFZLFNBQVM7QUFBQSxNQUM3QztBQUVFLGFBQU8sRUFBQyxZQUFZLFVBQVM7QUFBQSxJQUMvQjtBQUFBLElBRUMsZUFBZSxNQUFNLFNBQVMsT0FBTztBQUNwQyxZQUFNLGNBQWMsQ0FBRTtBQUN0QixlQUFTLE9BQU8sTUFBTTtBQUNyQixZQUFJLFFBQVEsTUFBTTtBQUNqQixnQkFBTTtBQUFBLFFBQ1Y7QUFFRyxjQUFNLFNBQVMsT0FBTyxRQUFRLFlBQVksT0FBTyxRQUFRLGFBQWEsa0JBQW1CLE9BQU8sUUFBUSxXQUFXLGtCQUFrQjtBQUVySSxZQUFJLENBQUMsUUFBUTtBQUNaLHNCQUFZLEtBQUssR0FBRztBQUFBLFFBQ3BCLFdBQVUsS0FBSyxNQUFNLEVBQUUsSUFBSSxHQUFHLEdBQUc7QUFDakMsc0JBQVksS0FBSyxLQUFLLE1BQU0sRUFBRSxJQUFJLEdBQUcsQ0FBQztBQUFBLFFBQ3RDLFdBQVUsUUFBUTtBQUNsQixnQkFBTSxhQUFhLGFBQWEsWUFBWTtBQUM1QyxlQUFLLE1BQU0sRUFBRSxJQUFJLEtBQUssVUFBVTtBQUNoQyxzQkFBWSxLQUFLLFVBQVU7QUFBQSxRQUMvQixPQUFVO0FBQ04saUJBQU87QUFBQSxRQUNYO0FBQUEsTUFDQTtBQUVFLGFBQU8sS0FBSyxVQUFVLFdBQVc7QUFBQSxJQUNuQztBQUFBLElBRUMsSUFBSSxNQUFNLE9BQU87QUFDaEIsWUFBTSxFQUFDLFVBQVMsSUFBSSxLQUFLLGVBQWUsTUFBTSxJQUFJO0FBQ2xELGFBQU8sTUFBTSxJQUFJLFdBQVcsS0FBSztBQUFBLElBQ25DO0FBQUEsSUFFQyxJQUFJLE1BQU07QUFDVCxZQUFNLEVBQUMsVUFBUyxJQUFJLEtBQUssZUFBZSxJQUFJO0FBQzVDLGFBQU8sTUFBTSxJQUFJLFNBQVM7QUFBQSxJQUM1QjtBQUFBLElBRUMsSUFBSSxNQUFNO0FBQ1QsWUFBTSxFQUFDLFVBQVMsSUFBSSxLQUFLLGVBQWUsSUFBSTtBQUM1QyxhQUFPLE1BQU0sSUFBSSxTQUFTO0FBQUEsSUFDNUI7QUFBQSxJQUVDLE9BQU8sTUFBTTtBQUNaLFlBQU0sRUFBQyxXQUFXLFdBQVUsSUFBSSxLQUFLLGVBQWUsSUFBSTtBQUN4RCxhQUFPLFFBQVEsYUFBYSxNQUFNLE9BQU8sU0FBUyxLQUFLLEtBQUssWUFBWSxPQUFPLFVBQVUsQ0FBQztBQUFBLElBQzVGO0FBQUEsSUFFQyxRQUFRO0FBQ1AsWUFBTSxNQUFPO0FBQ2IsV0FBSyxjQUFjLE1BQU87QUFDMUIsV0FBSyxZQUFZLE1BQU87QUFBQSxJQUMxQjtBQUFBLElBRUMsS0FBSyxPQUFPLFdBQVcsSUFBSTtBQUMxQixhQUFPO0FBQUEsSUFDVDtBQUFBLElBRUMsSUFBSSxPQUFPO0FBQ1YsYUFBTyxNQUFNO0FBQUEsSUFDZjtBQUFBLEVBQ0E7QUNsRm1CLE1BQUksWUFBVzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswLDE0LDE1LDE2LDE3LDE4LDE5LDIwXX0=
