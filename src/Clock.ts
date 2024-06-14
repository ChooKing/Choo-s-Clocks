import {SignalProvider} from "./SignalProvider.ts";
import {ReactiveComponent} from "./components/ReactiveComponent.ts";


export abstract class Clock<U> extends ReactiveComponent<U, HTMLDivElement>{
    name: string;
    timeSource: SignalProvider<U>;

    protected constructor(name: string, parent: HTMLDivElement, timeSource: SignalProvider<U>) {
        super(parent);
        this.name = name;
        this.timeSource = timeSource;
        this.element.classList.add("hidden");
    }
}