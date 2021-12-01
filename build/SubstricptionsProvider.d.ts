/// <reference types="react" />
interface Subscription {
    event: string;
    cb: Function;
    name?: string;
}
export declare enum SubscriptionsActionType {
    ADD = "ADD",
    REMOVE = "REMOVE"
}
declare type SubscriptionsAction = {
    type: SubscriptionsActionType.ADD;
    payload: Subscription;
} | {
    type: SubscriptionsActionType.REMOVE;
    payload: Pick<Subscription, "event" | "name">;
};
export declare enum SubscriptionsStatus {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3
}
interface SubscriptionsContextValues {
    dispatch: (action: SubscriptionsAction) => void;
    status: SubscriptionsStatus;
}
export declare function useSubscriptions(): SubscriptionsContextValues;
interface SubscriptionsProviderProps {
    endpointUrl: string;
    children: React.ReactNode;
}
export declare function SubscriptionsProvider({ children, endpointUrl, }: SubscriptionsProviderProps): JSX.Element;
export {};
