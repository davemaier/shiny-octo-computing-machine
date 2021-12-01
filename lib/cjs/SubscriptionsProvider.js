"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsProvider = exports.useSubscriptions = exports.SubscriptionsStatus = exports.SubscriptionsActionType = void 0;
var react_1 = require("react");
var react_2 = __importDefault(require("react"));
var useOnlineStatus_1 = require("./hooks/useOnlineStatus");
var SubscriptionsActionType;
(function (SubscriptionsActionType) {
    SubscriptionsActionType["ADD"] = "ADD";
    SubscriptionsActionType["REMOVE"] = "REMOVE";
})(SubscriptionsActionType = exports.SubscriptionsActionType || (exports.SubscriptionsActionType = {}));
var SubscriptionsStatus;
(function (SubscriptionsStatus) {
    SubscriptionsStatus[SubscriptionsStatus["CONNECTING"] = 0] = "CONNECTING";
    SubscriptionsStatus[SubscriptionsStatus["OPEN"] = 1] = "OPEN";
    SubscriptionsStatus[SubscriptionsStatus["CLOSING"] = 2] = "CLOSING";
    SubscriptionsStatus[SubscriptionsStatus["CLOSED"] = 3] = "CLOSED";
})(SubscriptionsStatus = exports.SubscriptionsStatus || (exports.SubscriptionsStatus = {}));
function subscriptionsReducer(state, action) {
    switch (action.type) {
        case SubscriptionsActionType.ADD: {
            return { subscriptions: __spreadArray(__spreadArray([], state.subscriptions, true), [action.payload], false) };
        }
        case SubscriptionsActionType.REMOVE: {
            return {
                subscriptions: state.subscriptions.filter(function (subscription) {
                    return !((!action.payload.name &&
                        subscription.event === action.payload.event) ||
                        (action.payload.name &&
                            subscription.event === action.payload.event &&
                            subscription.name === action.payload.name));
                }),
            };
        }
    }
}
var SubscriptionsContext = (0, react_1.createContext)(undefined);
function useSubscriptions() {
    var context = (0, react_1.useContext)(SubscriptionsContext);
    if (!context) {
        throw new Error("Missing subscriptions context");
    }
    return context;
}
exports.useSubscriptions = useSubscriptions;
function SubscriptionsProvider(_a) {
    var _this = this;
    var children = _a.children, endpointUrl = _a.endpointUrl;
    var _b = (0, react_1.useReducer)(subscriptionsReducer, {
        subscriptions: [],
    }), state = _b[0], dispatch = _b[1];
    var _c = (0, react_1.useState)(""), token = _c[0], setToken = _c[1];
    var ws = (0, react_1.useRef)();
    var _d = (0, react_1.useState)(SubscriptionsStatus.CLOSED), status = _d[0], setStatus = _d[1];
    var isOnline = (0, useOnlineStatus_1.useOnlineStatus)();
    var connect = (0, react_1.useCallback)(function () {
        ws.current = new WebSocket(endpointUrl);
        setStatus(ws.current.readyState);
        ws.current.onopen = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                setStatus((_b = (_a = ws.current) === null || _a === void 0 ? void 0 : _a.readyState) !== null && _b !== void 0 ? _b : SubscriptionsStatus.CLOSED);
                (_c = ws.current) === null || _c === void 0 ? void 0 : _c.send(token);
                return [2 /*return*/];
            });
        }); };
        ws.current.onclose = function () {
            var _a, _b;
            setStatus((_b = (_a = ws.current) === null || _a === void 0 ? void 0 : _a.readyState) !== null && _b !== void 0 ? _b : SubscriptionsStatus.CLOSED);
        };
    }, [token]);
    (0, react_1.useEffect)(function () {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/auth/token")];
                    case 1: return [4 /*yield*/, (_a.sent()).json()];
                    case 2:
                        token = (_a.sent()).accessToken;
                        if (token) {
                            setToken("Bearer ".concat(token));
                        }
                        return [2 /*return*/];
                }
            });
        }); })();
    }, []);
    (0, react_1.useEffect)(function () {
        if (isOnline &&
            status === SubscriptionsStatus.CLOSED &&
            token !== "" &&
            token !== "Bearer undefined") {
            connect();
        }
    }, [isOnline, status, token, connect]);
    (0, react_1.useEffect)(function () {
        if (!ws.current)
            return;
        ws.current.onmessage = function (e) {
            state.subscriptions
                .filter(function (subscription) {
                return subscription.event === e.data ||
                    subscription.event.split("*")[0] ===
                        e.data.substr(0, subscription.event.split("*")[0].length);
            })
                .forEach(function (subscription) {
                return e.data.includes(":")
                    ? subscription.cb(e.data.split(":")[1])
                    : subscription.cb();
            });
        };
        // We need ws.current as a dependency here, I don't really know why its not valid because if its there,
        // everything works as expected.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, ws.current]);
    var value = { dispatch: dispatch, status: status };
    return (react_2.default.createElement(SubscriptionsContext.Provider, { value: value }, children));
}
exports.SubscriptionsProvider = SubscriptionsProvider;
