import { useEffect } from "react";
import { SubscriptionsActionType, useSubscriptions, } from "../SubstricptionsProvider";
export function useStups(event, cb, name) {
    const { dispatch, status } = useSubscriptions();
    useEffect(() => {
        dispatch({
            payload: { event, name },
            type: SubscriptionsActionType.REMOVE,
        });
        dispatch({
            payload: { cb, event, name },
            type: SubscriptionsActionType.ADD,
        });
    }, [cb, dispatch, event, name]);
    return {
        status,
        unsubscribe() {
            dispatch({
                payload: { event, name },
                type: SubscriptionsActionType.REMOVE,
            });
        },
    };
}
