"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStups = void 0;
var react_1 = require("react");
var SubscriptionsProvider_1 = require("../SubscriptionsProvider");
function useStups(event, cb, name) {
    var _a = (0, SubscriptionsProvider_1.useSubscriptions)(), dispatch = _a.dispatch, status = _a.status;
    (0, react_1.useEffect)(function () {
        dispatch({
            payload: { event: event, name: name },
            type: SubscriptionsProvider_1.SubscriptionsActionType.REMOVE,
        });
        dispatch({
            payload: { cb: cb, event: event, name: name },
            type: SubscriptionsProvider_1.SubscriptionsActionType.ADD,
        });
    }, [cb, dispatch, event, name]);
    return {
        status: status,
        unsubscribe: function () {
            dispatch({
                payload: { event: event, name: name },
                type: SubscriptionsProvider_1.SubscriptionsActionType.REMOVE,
            });
        },
    };
}
exports.useStups = useStups;
