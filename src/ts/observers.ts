type Fn = (...args: any) => any;

class Observer {
    observerList: Fn[] = [];

    subscribe = (...fns: Fn[]): void => {
        this.observerList.push(...fns);
    };

    unsubscribe = (fnToRemove: Fn): void => {
        this.observerList.filter(fn => fn !== fnToRemove);
    };

    notify = (props: any): void => {
        this.observerList.forEach((fn: Fn) => fn(props));
    };
}

export default class Subject {
    observer = new Observer();

    subscribe = this.observer.subscribe;
    unsubscribe = this.observer.unsubscribe;
    notify = this.observer.notify;
}
