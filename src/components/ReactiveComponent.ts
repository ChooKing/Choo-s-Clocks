import {Component} from "./Component.ts";

export abstract class ReactiveComponent<T> extends Component{
    abstract update(value: T):void;
}