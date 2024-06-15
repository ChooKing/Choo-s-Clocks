import "./styles.css";
import {Clock} from "../../Clock.ts";
import {str2Time, timeNumObj, timeStrObj} from "../../util.ts";
import {LEDTime} from "../LEDTime/LEDTime.ts";
import {blankTime, clockSettings} from "../../global.ts";
import {TimeInput} from "../Input/timeInput.ts";
import {SignalMap} from "../../SignalMap.ts";
import {Toggle} from "../Input/toggle/toggle.ts";



export class AlarmClock extends Clock{
    setButton! : HTMLButtonElement;
    timeView!: LEDTime;
    input!: TimeInput;
    h24Toggle!: Toggle;
    pmToggle!: Toggle;
    rawTime: SignalMap<timeNumObj, timeStrObj>;
    constructor(parent: HTMLDivElement, timeSource: SignalMap<timeNumObj, timeStrObj>) {
        super("alarm", parent);
        this.render(parent);
        this.rawTime = timeSource;
    }
    render(target: HTMLDivElement): void {
        this.element.classList.add("alarm-clock");
        const timeContainer = document.createElement("div");
        timeContainer.classList.add("time-container");
        this.pmToggle = new Toggle(timeContainer, "alarm-pm", ()=>{}, "AM", "PM");
        this.pmToggle.show();
        this.pmToggle.element.classList.add("pm-view");





        this.timeView = new LEDTime(timeContainer);
        this.timeView.update({hours: ["1","2"], minutes:["0","0"], seconds:["0","0"]});
        this.timeView.show();
        this.input = new TimeInput(timeContainer, (value: string)=>{this.showAlarmTime(value)});
        this.input.show();



        this.element.appendChild(timeContainer);

        const controls = document.createElement("div");
        controls.classList.add("controls");
        this.h24Toggle = new Toggle(controls,"alarm-24", ()=>{
            clockSettings.hr24 = !clockSettings.hr24;
        }, "12H", "24H");
        this.h24Toggle.update(clockSettings.hr24);
        this.h24Toggle.show();
        controls.appendChild(this.h24Toggle.element);
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
        this.h24Toggle.update(clockSettings.hr24);
        if(clockSettings.hr24){
            this.pmToggle.element.classList.add("h24");
            this.pmToggle.element.classList.remove("am");
            this.pmToggle.element.classList.remove("pm");
        }
        else{
            this.pmToggle.element.classList.add("am");
            this.pmToggle.element.classList.remove("pm");
            this.pmToggle.element.classList.remove("h24");
        }
    }
    hide(){
        super.hide();
        setTimeout(()=>{this.element.classList.remove("visible");}, 500);

    }
    showAlarmTime(value: string){
        this.timeView?.update(str2Time(value));
    }
    update(value: timeStrObj): void {
        console.log(value);
    }

}