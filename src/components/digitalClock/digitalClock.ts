import "./styles.css";
import {LEDTime} from "../LEDTime/LEDTime.ts";
import {Clock} from "../../Clock.ts";
import {timeNumObj, timeStrObj} from "../../util.ts";
import {Toggle} from "../Input/toggle/toggle.ts";
import {PMView} from "../ampm/pmView.ts";
import {SignalMap} from "../../SignalMap.ts";

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
        this.pmView.update("h24");

        this.timeView = new LEDTime(timeContainer);
        this.timeView.show();
        this.element.appendChild(timeContainer);

        const controls = document.createElement("div");
        controls.classList.add("controls");
        this.pmToggle = new Toggle(controls, ()=>{}, "12H", "24H");
        this.pmToggle.show();
        controls.appendChild(this.pmToggle.element);

        this.element.appendChild(controls);
        target.appendChild(this.element);
    }

    update(time: timeStrObj): void {
        this.timeView.update(time);
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
