module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../../../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("cha2");


/***/ }),

/***/ "2FBn":
/***/ (function(module, exports) {

module.exports = require("logrocket");

/***/ }),

/***/ "8Bbg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("B5Ud")


/***/ }),

/***/ "B5Ud":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__("KI45");

exports.__esModule = true;
exports.Container = Container;
exports.createUrl = createUrl;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__("cDcd"));

var _utils = __webpack_require__("g/15");

exports.AppInitialProps = _utils.AppInitialProps;
/**
* `App` component is used for initialize of pages. It allows for overwriting and full control of the `page` initialization.
* This allows for keeping state between navigation, custom error handling, injecting additional data.
*/

async function appGetInitialProps(_ref) {
  var {
    Component,
    ctx
  } = _ref;
  var pageProps = await (0, _utils.loadGetInitialProps)(Component, ctx);
  return {
    pageProps
  };
}

class App extends _react.default.Component {
  // Kept here for backwards compatibility.
  // When someone ended App they could call `super.componentDidCatch`.
  // @deprecated This method is no longer needed. Errors are caught at the top level
  componentDidCatch(error, _errorInfo) {
    throw error;
  }

  render() {
    var {
      router,
      Component,
      pageProps
    } = this.props;
    var url = createUrl(router);
    return _react.default.createElement(Component, Object.assign({}, pageProps, {
      url: url
    }));
  }

}

exports.default = App;
App.origGetInitialProps = appGetInitialProps;
App.getInitialProps = appGetInitialProps;
var warnContainer;
var warnUrl;

if (false) {} // @deprecated noop for now until removal


function Container(p) {
  if (false) {}
  return p.children;
}

function createUrl(router) {
  // This is to make sure we don't references the router object at call time
  var {
    pathname,
    asPath,
    query
  } = router;
  return {
    get query() {
      if (false) {}
      return query;
    },

    get pathname() {
      if (false) {}
      return pathname;
    },

    get asPath() {
      if (false) {}
      return asPath;
    },

    back: () => {
      if (false) {}
      router.back();
    },
    push: (url, as) => {
      if (false) {}
      return router.push(url, as);
    },
    pushTo: (href, as) => {
      if (false) {}
      var pushRoute = as ? href : '';
      var pushUrl = as || href;
      return router.push(pushRoute, pushUrl);
    },
    replace: (url, as) => {
      if (false) {}
      return router.replace(url, as);
    },
    replaceTo: (href, as) => {
      if (false) {}
      var replaceRoute = as ? href : '';
      var replaceUrl = as || href;
      return router.replace(replaceRoute, replaceUrl);
    }
  };
}

/***/ }),

/***/ "CKwI":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export gtag */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return trackPageView; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GoogleAnalytics; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("YyUk");
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;


let definedDataLayer = false;
let definedGtag = false;
const gtag = (...args) => {
  if (_lib_constants__WEBPACK_IMPORTED_MODULE_1__[/* USING_GA */ "f"]) {
    if (definedDataLayer === false) {
      definedDataLayer = true;

      if (Array.isArray(window['dataLayer']) === false) {
        window['dataLayer'] = window['dataLayer'] || [];
      }
    }

    if (definedGtag === false) {
      definedGtag = true;

      if (typeof window['gtag'] !== 'function') {
        window['gtag'] = (...args) => {
          window['dataLayer'].push(...args);
        };
      }
    }

    window['gtag'](...args);
  }
};
function trackPageView({
  title,
  location,
  path
} = {}) {
  if (_lib_constants__WEBPACK_IMPORTED_MODULE_1__[/* USING_GA */ "f"]) {
    var _window, _window$document, _window2, _window2$location, _window3, _window3$location;

    gtag('config', _lib_constants__WEBPACK_IMPORTED_MODULE_1__[/* GA_ID */ "a"], {
      ['page_title']: title !== null && title !== void 0 ? title : (_window = window) === null || _window === void 0 ? void 0 : (_window$document = _window.document) === null || _window$document === void 0 ? void 0 : _window$document.title,
      ['page_location']: location !== null && location !== void 0 ? location : (_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$location = _window2.location) === null || _window2$location === void 0 ? void 0 : _window2$location.href,
      ['page_path']: path !== null && path !== void 0 ? path : (_window3 = window) === null || _window3 === void 0 ? void 0 : (_window3$location = _window3.location) === null || _window3$location === void 0 ? void 0 : _window3$location.pathname
    });
  }
}
const GoogleAnalytics = () => {
  const setGoogleTags = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(() => {
    return {
      __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${_lib_constants__WEBPACK_IMPORTED_MODULE_1__[/* GA_ID */ "a"]}');
            `
    };
  }, []);

  if (_lib_constants__WEBPACK_IMPORTED_MODULE_1__[/* USING_GA */ "f"]) {
    return __jsx(react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, __jsx("script", {
      async: true,
      src: `https://www.googletagmanager.com/gtag/js?id=${_lib_constants__WEBPACK_IMPORTED_MODULE_1__[/* GA_ID */ "a"]}`
    }), __jsx("script", {
      dangerouslySetInnerHTML: setGoogleTags()
    }));
  }

  return null;
};

/***/ }),

/***/ "KI45":
/***/ (function(module, exports) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;

/***/ }),

/***/ "NIEw":
/***/ (function(module, exports) {

module.exports = require("logrocket-react");

/***/ }),

/***/ "YyUk":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return NODE_ENV; });
/* unused harmony export IS_PRODUCTION */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return LADDER_VERSION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return SENTRY_DSN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return USING_SENTRY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return LOGROCKET_ID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return USING_LOGROCKET; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GA_ID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return USING_GA; });
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("kiQV");
var _package_json__WEBPACK_IMPORTED_MODULE_0___namespace = /*#__PURE__*/__webpack_require__.t("kiQV", 1);
var _process$env$NODE_ENV, _process$env$LADDER_P, _process$env$LADDER_P2, _process$env$LADDER_P3;


const NODE_ENV = (_process$env$NODE_ENV = "production") !== null && _process$env$NODE_ENV !== void 0 ? _process$env$NODE_ENV : 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const LADDER_VERSION = _package_json__WEBPACK_IMPORTED_MODULE_0__[/* version */ "a"] !== null && _package_json__WEBPACK_IMPORTED_MODULE_0__[/* version */ "a"] !== void 0 ? _package_json__WEBPACK_IMPORTED_MODULE_0__[/* version */ "a"] : '0.1.0';
/*
 * plugins
 */

const SENTRY_DSN = (_process$env$LADDER_P = "https://97a415ab381141079079160d82fcbdd7@sentry.io/2451725") !== null && _process$env$LADDER_P !== void 0 ? _process$env$LADDER_P : '';
const USING_SENTRY = SENTRY_DSN && IS_PRODUCTION;
const LOGROCKET_ID = (_process$env$LADDER_P2 = "c2d8wp/ladder-game") !== null && _process$env$LADDER_P2 !== void 0 ? _process$env$LADDER_P2 : '';
const USING_LOGROCKET = LOGROCKET_ID && IS_PRODUCTION;
const GA_ID = (_process$env$LADDER_P3 = "G-SRX5FGDEKJ") !== null && _process$env$LADDER_P3 !== void 0 ? _process$env$LADDER_P3 : '';
const USING_GA = GA_ID && IS_PRODUCTION;

/***/ }),

/***/ "bzos":
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "cDcd":
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "cha2":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__("cDcd");
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);

// EXTERNAL MODULE: ./node_modules/next/app.js
var app = __webpack_require__("8Bbg");
var app_default = /*#__PURE__*/__webpack_require__.n(app);

// EXTERNAL MODULE: external "react-app-polyfill/ie11"
var ie11_ = __webpack_require__("jdA4");

// EXTERNAL MODULE: external "react-app-polyfill/stable"
var stable_ = __webpack_require__("xoQe");

// EXTERNAL MODULE: ./plugins/sentry.ts
var sentry = __webpack_require__("wBnB");

// EXTERNAL MODULE: external "logrocket"
var external_logrocket_ = __webpack_require__("2FBn");

// EXTERNAL MODULE: external "logrocket-react"
var external_logrocket_react_ = __webpack_require__("NIEw");
var external_logrocket_react_default = /*#__PURE__*/__webpack_require__.n(external_logrocket_react_);

// EXTERNAL MODULE: ./lib/constants.ts
var constants = __webpack_require__("YyUk");

// CONCATENATED MODULE: ./plugins/logrocket.ts



const initLogRocket = () => {
  if (constants["g" /* USING_LOGROCKET */]) {
    external_logrocket_["init"](constants["c" /* LOGROCKET_ID */], {
      release: `${constants["d" /* NODE_ENV */]}@${constants["b" /* LADDER_VERSION */]}`
    });
    external_logrocket_react_default()(external_logrocket_);
  }

  return {
    withSentry
  };
};
const withSentry = Sentry => {
  if (constants["g" /* USING_LOGROCKET */] && constants["h" /* USING_SENTRY */]) {
    external_logrocket_["getSessionURL"](sessionURL => {
      Sentry.configureScope(scope => {
        scope.setExtra('sessionURL', sessionURL);
      });
    });
  }
};
// EXTERNAL MODULE: ./plugins/google-analytics.tsx
var google_analytics = __webpack_require__("CKwI");

// CONCATENATED MODULE: ./pages/_app.tsx
var __jsx = external_react_default.a.createElement;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








sentry["init"]();
initLogRocket().withSentry(sentry);

class _app_MyApp extends app_default.a {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "getInitialProps", async appContext => {
      const appProps = await app_default.a.getInitialProps(appContext);
      return _objectSpread({}, appProps);
    });
  }

  componentDidMount() {
    Object(google_analytics["b" /* trackPageView */])();
  }

  componentDidCatch(error, errorInfo) {
    sentry["withScope"](scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      sentry["captureException"](error);
    });
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const {
      Component,
      pageProps
    } = this.props;
    return __jsx(Component, pageProps);
  }

}

_app_MyApp.displayName = "MyApp";
/* harmony default export */ var _app = __webpack_exports__["default"] = (_app_MyApp);

/***/ }),

/***/ "g/15":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const url_1 = __webpack_require__("bzos");
/**
 * Utils
 */


function execOnce(fn) {
  let used = false;
  let result = null;
  return (...args) => {
    if (!used) {
      used = true;
      result = fn.apply(this, args);
    }

    return result;
  };
}

exports.execOnce = execOnce;

function getLocationOrigin() {
  const {
    protocol,
    hostname,
    port
  } = window.location;
  return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}

exports.getLocationOrigin = getLocationOrigin;

function getURL() {
  const {
    href
  } = window.location;
  const origin = getLocationOrigin();
  return href.substring(origin.length);
}

exports.getURL = getURL;

function getDisplayName(Component) {
  return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Unknown';
}

exports.getDisplayName = getDisplayName;

function isResSent(res) {
  return res.finished || res.headersSent;
}

exports.isResSent = isResSent;

async function loadGetInitialProps(App, ctx) {
  var _a;

  if (false) {} // when called from _app `ctx` is nested in `ctx`


  const res = ctx.res || ctx.ctx && ctx.ctx.res;

  if (!App.getInitialProps) {
    if (ctx.ctx && ctx.Component) {
      // @ts-ignore pageProps default
      return {
        pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
      };
    }

    return {};
  }

  const props = await App.getInitialProps(ctx);

  if (res && isResSent(res)) {
    return props;
  }

  if (!props) {
    const message = `"${getDisplayName(App)}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
    throw new Error(message);
  }

  if (false) {}

  return props;
}

exports.loadGetInitialProps = loadGetInitialProps;
exports.urlObjectKeys = ['auth', 'hash', 'host', 'hostname', 'href', 'path', 'pathname', 'port', 'protocol', 'query', 'search', 'slashes'];

function formatWithValidation(url, options) {
  if (false) {}

  return url_1.format(url, options);
}

exports.formatWithValidation = formatWithValidation;
exports.SP = typeof performance !== 'undefined';
exports.ST = exports.SP && typeof performance.mark === 'function' && typeof performance.measure === 'function';

/***/ }),

/***/ "jdA4":
/***/ (function(module, exports) {

module.exports = require("react-app-polyfill/ie11");

/***/ }),

/***/ "kiQV":
/***/ (function(module) {

module.exports = JSON.parse("{\"a\":\"0.1.0\"}");

/***/ }),

/***/ "wBnB":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withScope", function() { return withScope; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "captureException", function() { return captureException; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "configureScope", function() { return configureScope; });
/* harmony import */ var _sentry_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("xJD9");
/* harmony import */ var _sentry_browser__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sentry_browser__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("YyUk");


const init = () => {
  if (_lib_constants__WEBPACK_IMPORTED_MODULE_1__[/* USING_SENTRY */ "h"]) {
    _sentry_browser__WEBPACK_IMPORTED_MODULE_0__["init"]({
      dsn: _lib_constants__WEBPACK_IMPORTED_MODULE_1__[/* SENTRY_DSN */ "e"],
      environment: _lib_constants__WEBPACK_IMPORTED_MODULE_1__[/* NODE_ENV */ "d"],
      release: _lib_constants__WEBPACK_IMPORTED_MODULE_1__[/* LADDER_VERSION */ "b"]
    });
  }
};
const withScope = callback => {
  if (_lib_constants__WEBPACK_IMPORTED_MODULE_1__[/* USING_SENTRY */ "h"]) _sentry_browser__WEBPACK_IMPORTED_MODULE_0__["withScope"](callback);
};
const captureException = error => {
  return _lib_constants__WEBPACK_IMPORTED_MODULE_1__[/* USING_SENTRY */ "h"] ? _sentry_browser__WEBPACK_IMPORTED_MODULE_0__["captureException"](error) : '';
};
const configureScope = callback => {
  if (_lib_constants__WEBPACK_IMPORTED_MODULE_1__[/* USING_SENTRY */ "h"]) _sentry_browser__WEBPACK_IMPORTED_MODULE_0__["configureScope"](callback);
};

/***/ }),

/***/ "xJD9":
/***/ (function(module, exports) {

module.exports = require("@sentry/browser");

/***/ }),

/***/ "xoQe":
/***/ (function(module, exports) {

module.exports = require("react-app-polyfill/stable");

/***/ })

/******/ });
//# sourceMappingURL=_app.js.map