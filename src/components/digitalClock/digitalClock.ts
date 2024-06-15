import "./styles.css";
import {LEDTime} from "../LEDTime/LEDTime.ts";
import {Clock} from "../../Clock.ts";
import {timeNumObj, timeStrObj} from "../../util.ts";
import {Toggle} from "../Input/toggle/toggle.ts";
import {PMView} from "../ampm/pmView.ts";
import {SignalMap} from "../../SignalMap.ts";
import {clockSettings} from "../../global.ts";

export class DigitalClock extends Clock{
    timeView!: LEDTime;
    pmToggle!: Toggle;
    pmView!: PMView;
    formattedTime: SignalMap<timeNumObj, timeStrObj>;
    constructor(parent: HTMLDivElement, timeSource: SignalMap<timeNumObj, timeStrObj>) {
        super("digital", parent);
        this.render(parent);
        this.formattedTime = timeSource;
    }
    render(target: HTMLDivElement){
        this.element.classList.add("digital-clock");
        const timeContainer = document.createElement("div");
        timeContainer.classList.add("time-container");
        this.pmView = new PMView(timeContainer);
        this.pmView.show();
        this.timeView = new LEDTime(timeContainer);
        this.timeView.show();
        this.element.appendChild(timeContainer);

        const controls = document.createElement("div");
        controls.classList.add("controls");
        this.pmToggle = new Toggle(controls, ()=>{
            clockSettings.hr24 = !clockSettings.hr24;
        }, "12H", "24H");
        this.pmToggle.update(clockSettings.hr24);
        this.pmToggle.show();
        controls.appendChild(this.pmToggle.element);

        this.element.appendChild(controls);
        target.appendChild(this.element);
    }

    update(time: timeStrObj): void {
        this.timeView.update(time);
        if(clockSettings.hr24){
            this.pmView.update("h24");
        }
        else if(time.pm){
            this.pmView.update("pm");
        }
        else{
            this.pmView.update("am");
        }
    }
    show(){
        super.show();
        this.element.classList.add("flex");
        this.formattedTime.subscribe(this.name, (time)=>{
            this.update(time);
        })
    }
    hide(){
        super.hide();
        this.element.classList.remove("flex");
        this.formattedTime.unsubscribe(this.name);
    }
}
