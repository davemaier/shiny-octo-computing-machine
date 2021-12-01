import { useEffect, useState } from "react";
function getOnlineStatus() {
    return typeof navigator !== "undefined" &&
        typeof navigator.onLine === "boolean"
        ? navigator.onLine
        : true;
}
export function useOnlineStatus() {
    const [onlineStatus, setOnlineStatus] = useState(getOnlineStatus());
    //useEffect(() => setOnlineStatus(getOnlineStatus()), [getOnlineStatus()]);
    useEffect(() => {
        window.addEventListener("online", () => setOnlineStatus(true));
        window.addEventListener("offline", () => setOnlineStatus(false));
        return () => {
            window.removeEventListener("online", () => setOnlineStatus(true));
            window.removeEventListener("offline", () => setOnlineStatus(false));
        };
    }, []);
    return onlineStatus;
}
