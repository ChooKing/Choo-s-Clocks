import {Component} from "../Component.ts";

export abstract class Input<T> extends Component<HTMLInputElement>{
    _value: T | null = null;
    callback: (value: T) => void;
    constructor(parent: HTMLDivElement, callback: (value: T) => void) {
        super(parent, "input");
        this.callback = callback;
        this.render(parent);
    }
    focus(){
        this.element.focus();
    }
    setValue(value: T){
        this.element.value = String(value);
        this._value = value;
    }
    get value(){
        return this._value;
    }
}