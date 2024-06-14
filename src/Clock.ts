import {SignalProvider} from "./SignalProvider.ts";
import {ReactiveComponent} from "./components/ReactiveComponent.ts";


export abstract class Clock<T> extends ReactiveComponent<T>{
    name: string;
    timeSource: SignalProvider<T>;

    protected constructor(name: string, parent: HTMLDivElement, timeSource: SignalProvider<T>) {
        super(parent);
        this.name = name;
        this.timeSource = timeSource;
        this.element.classList.add("hidden");
    }
}