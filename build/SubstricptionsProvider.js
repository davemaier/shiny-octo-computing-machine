"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsProvider = exports.useSubscriptions = exports.SubscriptionsActionType = void 0;
const react_1 = require("react");
const useOnlineStatus_1 = require("./hooks/useOnlineStatus");
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
const SubscriptionsContext = (0, react_1.createContext)(undefined);
function useSubscriptions() {
    const context = (0, react_1.useContext)(SubscriptionsContext);
    if (!context) {
        throw new Error("Missing subscriptions context");
    }
    return context;
}
exports.useSubscriptions = useSubscriptions;
function SubscriptionsProvider({ children, endpointUrl, }) {
    const [state, dispatch] = (0, react_1.useReducer)(subscriptionsReducer, {
        subscriptions: [],
    });
    const [token, setToken] = (0, react_1.useState)("");
    const ws = (0, react_1.useRef)();
    const [status, setStatus] = (0, react_1.useState)(SubscriptionsStatus.CLOSED);
    const isOnline = (0, useOnlineStatus_1.useOnlineStatus)();
    const connect = (0, react_1.useCallback)(() => {
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
    (0, react_1.useEffect)(() => {
        (async () => {
            const token = (await (await fetch("/api/auth/token")).json()).accessToken;
            if (token) {
                setToken(`Bearer ${token}`);
            }
        })();
    }, []);
    (0, react_1.useEffect)(() => {
        if (isOnline &&
            status === SubscriptionsStatus.CLOSED &&
            token !== "" &&
            token !== "Bearer undefined") {
            connect();
        }
    }, [isOnline, status, token, connect]);
    (0, react_1.useEffect)(() => {
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
exports.SubscriptionsProvider = SubscriptionsProvider;
//# sourceMappingURL=SubstricptionsProvider.js.map