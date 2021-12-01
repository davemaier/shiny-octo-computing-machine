import { useEffect } from "react";
import { SubscriptionsActionType, useSubscriptions, } from "../SubscriptionsProvider";
export function useStups(event, cb, name) {
    var _a = useSubscriptions(), dispatch = _a.dispatch, status = _a.status;
    useEffect(function () {
        dispatch({
            payload: { event: event, name: name },
            type: SubscriptionsActionType.REMOVE,
        });
        dispatch({
            payload: { cb: cb, event: event, name: name },
            type: SubscriptionsActionType.ADD,
        });
    }, [cb, dispatch, event, name]);
    return {
        status: status,
        unsubscribe: function () {
            dispatch({
                payload: { event: event, name: name },
                type: SubscriptionsActionType.REMOVE,
            });
        },
    };
}
