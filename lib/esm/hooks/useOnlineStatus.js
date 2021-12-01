import { useEffect, useState } from "react";
function getOnlineStatus() {
    return typeof navigator !== "undefined" &&
        typeof navigator.onLine === "boolean"
        ? navigator.onLine
        : true;
}
export function useOnlineStatus() {
    var _a = useState(getOnlineStatus()), onlineStatus = _a[0], setOnlineStatus = _a[1];
    //useEffect(() => setOnlineStatus(getOnlineStatus()), [getOnlineStatus()]);
    useEffect(function () {
        window.addEventListener("online", function () { return setOnlineStatus(true); });
        window.addEventListener("offline", function () { return setOnlineStatus(false); });
        return function () {
            window.removeEventListener("online", function () { return setOnlineStatus(true); });
            window.removeEventListener("offline", function () { return setOnlineStatus(false); });
        };
    }, []);
    return onlineStatus;
}
