import {timeObj} from "./global.ts";

export abstract class Clock {
    name: string;
    element: HTMLDivElement;
    parent: HTMLDivElement;
    constructor(name: string, parent: HTMLDivElement) {
        this.name = name;
        this.element = document.createElement("div");
        this.parent = parent;
    }
    abstract render(target: HTMLDivElement):void;
    abstract update(time: timeObj, target: HTMLDivElement):void;

}