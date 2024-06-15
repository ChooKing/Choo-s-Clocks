import {Component} from "./components/Component.ts";

export abstract class Clock extends Component<HTMLDivElement>{
    name: string;

    protected constructor(name: string, parent: HTMLDivElement) {
        super(parent);
        this.name = name;
        this.element.classList.add("hidden");
    }
}