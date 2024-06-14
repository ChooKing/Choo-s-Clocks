import "./styles.css";
import {Component} from "../../Component.ts";

export class Toggle extends Component<HTMLDivElement>{
    option1: string;
    option2: string;
    callback: (value: boolean)=>void;
    constructor(parent: HTMLDivElement, callback: (value: boolean)=>void, label1: string, label2: string){
        super(parent);
        this.option1 = label1;
        this.option2 = label2;
        this.callback = callback;
        this.render(parent);
    }
    render(target: HTMLDivElement): void {
        this.element.classList.add("toggle");
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", "pm-toggle");
        this.element.appendChild(checkbox);
        const label = document.createElement("label");
        label.setAttribute("for", "pm-toggle");
        const option1Label = document.createElement("span");
        option1Label.innerText = this.option1;
        label.appendChild(option1Label);

        const option2Label = document.createElement("span");
        option2Label.innerText = this.option2;
        label.appendChild(option2Label);
        this.element.appendChild(label);
        target.appendChild(this.element);
    }

}