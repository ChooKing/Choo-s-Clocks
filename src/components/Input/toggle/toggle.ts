import "./styles.css";
import {Component} from "../../Component.ts";

export class Toggle extends Component<HTMLDivElement>{
    option1: string;
    option2: string;
    _checkbox!: HTMLInputElement;
    callback: ()=>void;
    id: string;
    constructor(parent: HTMLDivElement, id: string, callback: ()=>void, label1: string, label2: string){
        super(parent);
        this.option1 = label1;
        this.option2 = label2;
        this.callback = callback;
        this.id = id;
        this.render(parent);
    }
    render(target: HTMLDivElement): void {
        this.element.classList.add("toggle");
        this._checkbox = document.createElement("input");
        this._checkbox.setAttribute("type", "checkbox");
        this._checkbox.setAttribute("id", this.id);
        this._checkbox.addEventListener("input", ()=>{this.callback()});
        this.element.appendChild(this._checkbox);




        const label1 = document.createElement("label");
        label1.setAttribute("for", this.id);
        label1.innerText = this.option1;
        this.element.appendChild(label1);


        const label2 = document.createElement("label");
        label2.setAttribute("for", this.id);
        label2.innerText = this.option2;
        this.element.appendChild(label2);


        target.appendChild(this.element);
    }
    update(value: boolean){
        this._checkbox.checked = value;
    }
    get value(){
        return !this._checkbox.checked? this.option1 : this.option2;
    }
}