import {Input} from "./input.ts";
import {str2Secs} from "../../util.ts";

export class TimeInput extends Input<string>{
    constructor(parent: HTMLDivElement, callback: (value: string) => void) {
        super(parent, callback);
        this._value = "";
    }

    render(target: HTMLDivElement): void {
        this.element.classList.add("time-input");
        this.element.classList.add("invisible");
        this.element.setAttribute("type","number");
        this.element.addEventListener("input",(e)=>{this.handleInput(e)});


        target.appendChild(this.element);
    }
    reset(){
        this._value = "";
    }
    handleInput(e:Event){
        const key = (e as InputEvent).data;
        if(!key){
            if(this._value.length > 0){
                this._value = this._value.substring(0,this._value.length-1);
            }
        }
        else if(this._value.length < 6){
            this._value += key;
        }
        this.callback(this._value);
        console.log(this._value);
    }
    get time(){
        return str2Secs(this._value);
    }
}