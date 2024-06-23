import "./styles.css";
import {Component} from "../../Component.ts";

export class LEDHyphen extends Component<HTMLDivElement>{
    constructor(parent: HTMLDivElement) {
        super(parent);
        this.render(parent);
    }

    render(target: HTMLDivElement): void {
        this.element.classList.add("hyphen");
        const segment = document.createElement("div");
        segment.classList.add("segment");
        segment.classList.add("lit");
        this.element.appendChild(segment);
        target.appendChild(this.element);
    }
}