import {Input} from "./input.ts";
import {str2Secs} from "../../util.ts";

export class TimeInput extends Input<string>{
    _value: string;
    constructor(parent: HTMLDivElement, callback: (value: string) => void) {
        super(parent, callback);
        this._value = "";
    }

    render(target: HTMLDivElement): void {
        this.element.classList.add("time-input");
        this.element.classList.add("invisible");
        this.element.setAttribute("type","number");
        this.element.addEventListener("input",(e)=>{this.handleInput(e)});
        this.element.addEventListener("keydown",(e)=>{
           if(e.key === "Enter") (e.target as HTMLInputElement).blur();
        });

        target.appendChild(this.element);
    }
    reset(){
        this._value = "";
    }
    handleInput(e:Event){
        const key = (e as InputEvent).data;
        if(!key){
            if(this._value.length > 0){
                if(/\d/.test(key!)) this._value = this._value.substring(0,this._value.length-1);
            }
        }
        else if(this._value.length < 6){
            this._value += key;
        }
        this.callback(this._value);

    }
    get time(){
        return str2Secs(this._value);
    }
}