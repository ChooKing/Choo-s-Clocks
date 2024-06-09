import {Component} from "./components/Component.ts";
import {SignalProvider} from "./SignalProvider.ts";


export abstract class Clock<T> extends Component<T>{
    name: string;
    timeSource: SignalProvider<T>;

    protected constructor(name: string, parent: HTMLDivElement, timeSource: SignalProvider<T>) {
        super(parent);
        this.name = name;
        this.timeSource = timeSource;
    }
}