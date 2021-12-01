import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState, } from "react";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
export var SubscriptionsActionType;
(function (SubscriptionsActionType) {
    SubscriptionsActionType["ADD"] = "ADD";
    SubscriptionsActionType["REMOVE"] = "REMOVE";
})(SubscriptionsActionType || (SubscriptionsActionType = {}));
export var SubscriptionsStatus;
(function (SubscriptionsStatus) {
    SubscriptionsStatus[SubscriptionsStatus["CONNECTING"] = 0] = "CONNECTING";
    SubscriptionsStatus[SubscriptionsStatus["OPEN"] = 1] = "OPEN";
    SubscriptionsStatus[SubscriptionsStatus["CLOSING"] = 2] = "CLOSING";
    SubscriptionsStatus[SubscriptionsStatus["CLOSED"] = 3] = "CLOSED";
})(SubscriptionsStatus || (SubscriptionsStatus = {}));
function subscriptionsReducer(state, action) {
    switch (action.type) {
        case SubscriptionsActionType.ADD: {
            return { subscriptions: [...state.subscriptions, action.payload] };
        }
        case SubscriptionsActionType.REMOVE: {
            return {
                subscriptions: state.subscriptions.filter((subscription) => !((!action.payload.name &&
                    subscription.event === action.payload.event) ||
                    (action.payload.name &&
                        subscription.event === action.payload.event &&
                        subscription.name === action.payload.name))),
            };
        }
    }
}
const SubscriptionsContext = createContext(undefined);
export function useSubscriptions() {
    const context = useContext(SubscriptionsContext);
    if (!context) {
        throw new Error("Missing subscriptions context");
    }
    return context;
}
export function SubscriptionsProvider({ children, endpointUrl, }) {
    const [state, dispatch] = useReducer(subscriptionsReducer, {
        subscriptions: [],
    });
    const [token, setToken] = useState("");
    const ws = useRef();
    const [status, setStatus] = useState(SubscriptionsStatus.CLOSED);
    const isOnline = useOnlineStatus();
    const connect = useCallback(() => {
        ws.current = new WebSocket(endpointUrl);
        setStatus(ws.current.readyState);
        ws.current.onopen = async () => {
            setStatus(ws.current?.readyState ?? SubscriptionsStatus.CLOSED);
            ws.current?.send(token);
        };
        ws.current.onclose = () => {
            setStatus(ws.current?.readyState ?? SubscriptionsStatus.CLOSED);
        };
    }, [token]);
    useEffect(() => {
        (async () => {
            const token = (await (await fetch("/api/auth/token")).json()).accessToken;
            if (token) {
                setToken(`Bearer ${token}`);
            }
        })();
    }, []);
    useEffect(() => {
        if (isOnline &&
            status === SubscriptionsStatus.CLOSED &&
            token !== "" &&
            token !== "Bearer undefined") {
            connect();
        }
    }, [isOnline, status, token, connect]);
    useEffect(() => {
        if (!ws.current)
            return;
        ws.current.onmessage = (e) => {
            state.subscriptions
                .filter((subscription) => subscription.event === e.data ||
                subscription.event.split("*")[0] ===
                    e.data.substr(0, subscription.event.split("*")[0].length))
                .forEach((subscription) => e.data.includes(":")
                ? subscription.cb(e.data.split(":")[1])
                : subscription.cb());
        };
        // We need ws.current as a dependency here, I don't really know why its not valid because if its there,
        // everything works as expected.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, ws.current]);
    const value = { dispatch, status };
    return (<SubscriptionsContext.Provider value={value}>
      {children}
    </SubscriptionsContext.Provider>);
}
