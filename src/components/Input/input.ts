import {Component} from "../Component.ts";

export abstract class Input<T> extends Component<HTMLInputElement>{
    _value!: T;
    callback: (value: T) => void;
    constructor(parent: HTMLDivElement, callback: (value: T) => void) {
        super(parent, "input");
        this.callback = callback;
        this.render(parent);
    }
}