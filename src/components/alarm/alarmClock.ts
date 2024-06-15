import "./styles.css";
import {Clock} from "../../Clock.ts";
import {str2Time, timeObj} from "../../util.ts";
import {SignalProvider} from "../../SignalProvider.ts";
import {LEDTime} from "../LEDTime/LEDTime.ts";
import {blankTime} from "../../global.ts";
import {TimeInput} from "../Input/timeInput.ts";



export class AlarmClock extends Clock{
    setButton? : HTMLButtonElement;
    timeView?: LEDTime;
    input?: TimeInput;
    rawTime: SignalProvider<timeObj>;
    constructor(parent: HTMLDivElement, timeSource: SignalProvider<timeObj>) {
        super("alarm", parent);
        this.render(parent);
        this.rawTime = timeSource;
    }
    render(target: HTMLDivElement): void {
        this.element.classList.add("alarm-clock");
        const timeContainer = document.createElement("div");
        timeContainer.classList.add("time-container");
        this.timeView = new LEDTime(timeContainer);
        this.timeView.update({hours: ["1","2"], minutes:["0","0"], seconds:["0","0"]});
        this.timeView.show();
        this.input = new TimeInput(timeContainer, (value: string)=>{this.showAlarmTime(value)});
        this.input.show();



        this.element.appendChild(timeContainer);

        const controls = document.createElement("div");
        controls.classList.add("controls");
        this.setButton = document.createElement("button");
        this.setButton.innerText = "set";
        controls.appendChild(this.setButton);
        this.setButton.addEventListener("click", ()=>{this.set()});
        this.element.appendChild(controls);
        target.appendChild(this.element);
    }
    set(){
        this.timeView?.update(blankTime);
        this.input?.element.focus();
    }
    show(){
        super.show();
        this.element.classList.add("visible");
    }
    hide(){
        super.hide();
        setTimeout(()=>{this.element.classList.remove("visible");}, 500);

    }
    showAlarmTime(value: string){
        this.timeView?.update(str2Time(value));
    }
    update(value: timeObj): void {
        console.log(value);
    }

}