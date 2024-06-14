import {Component} from "./Component.ts";

export abstract class ReactiveComponent<U, T extends HTMLElement> extends Component<T>{
    abstract update(value: U):void;
}