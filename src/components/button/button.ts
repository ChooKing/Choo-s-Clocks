import {Component} from "../Component.ts";

export class Button extends Component<HTMLButtonElement>{
    _text: string;
    constructor(parent: HTMLDivElement, text: string, hidden: boolean = false) {
        super(parent, "button", hidden);
        this._text = text;
        this.render(parent);
    }
    render(target: HTMLDivElement): void {
        this.element.innerText = this._text;
        target.appendChild(this.element);
    }
    setHandler(callback: () => void){
        this.element.addEventListener("click", callback);
    }
    disable(){
        this.element.disabled = true;
    }
    enable(){
        this.element.disabled = false;
    }
    update(value: string){
        this._text = value;
    }

}