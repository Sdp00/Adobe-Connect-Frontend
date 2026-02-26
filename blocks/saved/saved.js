/******/ var __webpack_modules__ = ({

/***/ "./react-app/app/saved/components/saved.jsx":
/*!**************************************************!*\
  !*** ./react-app/app/saved/components/saved.jsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Saved)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");


function SavedCard({
  item,
  onRemove
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "saved-card",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("img", {
      src: item.image,
      alt: item.title,
      className: "saved-card-img"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "saved-card-content",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
        className: "saved-card-title",
        children: item.title
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
        className: "saved-card-desc",
        children: item.description || item.location
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "saved-card-actions",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("button", {
          type: "button",
          className: "saved-btn saved-btn--remove",
          onClick: () => onRemove(item.id),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("polyline", {
              points: "3 6 5 6 21 6"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
              d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            })]
          }), "Remove"]
        })
      })]
    })]
  });
}
function Saved() {
  const [savedItems, setSavedItems] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // Mock saved data - in real app, fetch from localStorage or API
    const mockSaved = [{
      id: 'saved-1',
      title: 'Design System Workshop',
      description: 'Learn the fundamentals of building scalable design systems',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      type: 'event'
    }, {
      id: 'saved-2',
      title: 'Adobe Monthly - New Year Edition',
      description: 'Kickstart 2026 with insights on new features and updates',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
      type: 'newsletter'
    }];
    setSavedItems(mockSaved);
  }, []);
  const handleRemove = id => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "saved-page",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "saved-header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("svg", {
        width: "32",
        height: "32",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "#eb5146",
        strokeWidth: "2",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
          d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h1", {
        children: "Saved"
      })]
    }), savedItems.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "saved-empty",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("svg", {
        width: "64",
        height: "64",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "#d1d5db",
        strokeWidth: "2",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
          d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
        children: "No saved items yet"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
        children: "Save events, newsletters, and trainings to find them here"
      })]
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "saved-grid",
      children: savedItems.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SavedCard, {
        item: item,
        onRemove: handleRemove
      }, item.id))
    })]
  });
}

/***/ }),

/***/ "./react-app/app/saved/index.jsx":
/*!***************************************!*\
  !*** ./react-app/app/saved/index.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decorateBlock: () => (/* binding */ decorateBlock),
/* harmony export */   "default": () => (/* binding */ decorate)
/* harmony export */ });
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _components_saved__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/saved */ "./react-app/app/saved/components/saved.jsx");
/* harmony import */ var _styles_saved_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles/saved.css */ "./react-app/app/saved/styles/saved.css");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
// eslint-disable-next-line import/extensions

// eslint-disable-next-line no-unused-vars



async function decorateBlock(block) {
  const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_0__.createRoot)(block);
  root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_saved__WEBPACK_IMPORTED_MODULE_1__["default"], {}));
}
async function decorate(block) {
  decorateBlock(block);
}

/***/ }),

/***/ "./react-app/app/saved/styles/saved.css":
/*!**********************************************!*\
  !*** ./react-app/app/saved/styles/saved.css ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		id: moduleId,
/******/ 		loaded: false,
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Flag the module as loaded
/******/ 	module.loaded = true;
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/******/ // expose the modules object (__webpack_modules__)
/******/ __webpack_require__.m = __webpack_modules__;
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/chunk loaded */
/******/ (() => {
/******/ 	var deferred = [];
/******/ 	__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 		if(chunkIds) {
/******/ 			priority = priority || 0;
/******/ 			for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 			deferred[i] = [chunkIds, fn, priority];
/******/ 			return;
/******/ 		}
/******/ 		var notFulfilled = Infinity;
/******/ 		for (var i = 0; i < deferred.length; i++) {
/******/ 			var [chunkIds, fn, priority] = deferred[i];
/******/ 			var fulfilled = true;
/******/ 			for (var j = 0; j < chunkIds.length; j++) {
/******/ 				if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 					chunkIds.splice(j--, 1);
/******/ 				} else {
/******/ 					fulfilled = false;
/******/ 					if(priority < notFulfilled) notFulfilled = priority;
/******/ 				}
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferred.splice(i--, 1)
/******/ 				var r = fn();
/******/ 				if (r !== undefined) result = r;
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("7173ea6fcf8548846119")
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/node module decorator */
/******/ (() => {
/******/ 	__webpack_require__.nmd = (module) => {
/******/ 		module.paths = [];
/******/ 		if (!module.children) module.children = [];
/******/ 		return module;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/jsonp chunk loading */
/******/ (() => {
/******/ 	// no baseURI
/******/ 	
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"saved": 0
/******/ 	};
/******/ 	
/******/ 	// no chunk on demand loading
/******/ 	
/******/ 	// no prefetching
/******/ 	
/******/ 	// no preloaded
/******/ 	
/******/ 	// no HMR
/******/ 	
/******/ 	// no HMR manifest
/******/ 	
/******/ 	__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 	
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 		var [chunkIds, moreModules, runtime] = data;
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0;
/******/ 		if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) var result = runtime(__webpack_require__);
/******/ 		}
/******/ 		if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				installedChunks[chunkId][0]();
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		return __webpack_require__.O(result);
/******/ 	}
/******/ 	
/******/ 	var chunkLoadingGlobal = self["webpackChunk_adobe_aem_boilerplate"] = self["webpackChunk_adobe_aem_boilerplate"] || [];
/******/ 	chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 	chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module depends on other loaded chunks and execution need to be delayed
/******/ __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=localhost&port=4200&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=false&live-reload=true")))
/******/ var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./react-app/app/saved/index.jsx")))
/******/ __webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ var __webpack_exports__decorateBlock = __webpack_exports__.decorateBlock;
/******/ var __webpack_exports__default = __webpack_exports__["default"];
/******/ export { __webpack_exports__decorateBlock as decorateBlock, __webpack_exports__default as default };
/******/ 
