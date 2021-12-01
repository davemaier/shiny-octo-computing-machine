export declare function useStups(event: string, cb: Function, name?: string): {
    status: import("../SubscriptionsProvider").SubscriptionsStatus;
    unsubscribe(): void;
};
