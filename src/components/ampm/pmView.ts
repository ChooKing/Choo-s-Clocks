import {Component} from "../Component.ts";

export class PMView extends Component<HTMLDivElement>{
    constructor(parent: HTMLDivElement) {
        super(parent);
        this.render(parent);
    }
    render(target: HTMLDivElement): void {
        this.element.classList.add("pm-view");
        const am = document.createElement('div');
        am.innerText="AM";
        this.element.appendChild(am);
        const pm = document.createElement("div");
        pm.innerText="PM";
        this.element.appendChild(pm);
        target.appendChild(this.element);
    }
    update(mode: "am"|"pm"|"h24"){
        this.element.className = "pm-view "+ mode;
    }
}