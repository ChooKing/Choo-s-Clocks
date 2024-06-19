import {Component} from "./components/Component.ts";

export abstract class Clock extends Component<HTMLDivElement>{
    name: string;

    protected constructor(name: string, parent: HTMLDivElement) {
        super(parent, "div", true);
        this.name = name;
    }
    hide(){
        this.element.classList.add("fading");
        setTimeout(()=>{
            this.element.classList.add("hidden");
        }, 500);
    }
    show(){
        super.show();
        this.element.classList.remove("fading");
    }
}