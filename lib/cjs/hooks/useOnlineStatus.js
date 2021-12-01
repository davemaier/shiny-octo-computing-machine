"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOnlineStatus = void 0;
var react_1 = require("react");
function getOnlineStatus() {
    return typeof navigator !== "undefined" &&
        typeof navigator.onLine === "boolean"
        ? navigator.onLine
        : true;
}
function useOnlineStatus() {
    var _a = (0, react_1.useState)(getOnlineStatus()), onlineStatus = _a[0], setOnlineStatus = _a[1];
    //useEffect(() => setOnlineStatus(getOnlineStatus()), [getOnlineStatus()]);
    (0, react_1.useEffect)(function () {
        window.addEventListener("online", function () { return setOnlineStatus(true); });
        window.addEventListener("offline", function () { return setOnlineStatus(false); });
        return function () {
            window.removeEventListener("online", function () { return setOnlineStatus(true); });
            window.removeEventListener("offline", function () { return setOnlineStatus(false); });
        };
    }, []);
    return onlineStatus;
}
exports.useOnlineStatus = useOnlineStatus;
