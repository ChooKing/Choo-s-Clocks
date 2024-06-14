import "./styles.css";
import {LEDTime} from "../LEDTime/LEDTime.ts";
import {Clock} from "../../Clock.ts";
import {timeObj} from "../../util.ts";
import {SignalProvider} from "../../SignalProvider.ts";
import {Toggle} from "../Input/toggle/toggle.ts";
import {PMView} from "../ampm/pmView.ts";

export class DigitalClock extends Clock<timeObj>{
    timeView!: LEDTime;
    pmToggle!: Toggle;
    pmView!: PMView;
    constructor(parent: HTMLDivElement, timeSource: SignalProvider<timeObj>) {
        super("digital", parent, timeSource);
        this.render(parent);
    }
    render(target: HTMLDivElement) {
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

    update(time: timeObj): void {
        this.timeView.update(time);
    }
    show(){
        super.show();
        this.element.classList.add("flex");
        this.timeSource.subscribe(this.name, (time)=>{
            this.update(time);
        })
    }
    hide(){
        super.hide();
        this.element.classList.remove("flex");
        this.timeSource.unsubscribe(this.name);
    }
}
