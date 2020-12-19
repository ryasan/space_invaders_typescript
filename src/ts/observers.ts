type Fn = (args: any) => any;

export default class Observer {
    observerList: Fn[] = [];

    subscribe = (...fn: Fn[]): void => {
        this.observerList.push(...fn);
    };

    unsubscribe = (fnToRemove: Fn): void => {
        this.observerList.filter(fn => fn !== fnToRemove);
    };

    notify = (context?: any): void => {
        this.observerList.forEach((fn: Fn) => fn(context));
    };
}
