type Fn = (...args: any) => any;

class Observer {
    observerList: Fn[] = [];

    subscribe = (...fn: Fn[]): void => {
        this.observerList.push(...fn);
    };

    unsubscribe = (fnToRemove: Fn): void => {
        this.observerList.filter(fn => fn !== fnToRemove);
    };

    unsubscribeAll = (): void => {
        this.observerList = [];
    };

    notify = (props?: any): void => {
        this.observerList.forEach((fn: Fn) => fn(props));
    };
}

export default class Subject {
    observer = new Observer();

    observerList = this.observer.observerList;
    subscribe = this.observer.subscribe;
    unsubscribe = this.observer.unsubscribe;
    unsubscribeAll = this.observer.unsubscribeAll;
    notify = this.observer.notify;
}
