import {timeObj} from "./global.ts";

export abstract class Clock {
    name: string;
    element: HTMLDivElement;
    parent: HTMLDivElement;
    constructor(name: string, parent: HTMLDivElement) {
        this.name = name;
        this.element = document.createElement("div");
        this.element.classList.add("hidden");
        this.parent = parent;
    }
    abstract render(target: HTMLDivElement):void;
    abstract update(time: timeObj|Date, target: HTMLDivElement):void;

    hide(){
        this.element.classList.add("fading");
        setTimeout(()=>{
            this.element.classList.add("hidden");
        }, 500);
    }
    show(){
        this.element.classList.remove("hidden");
        this.element.classList.remove("fading");
    }
}