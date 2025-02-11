import "./styles.css";
import {LEDTime} from "../LEDTime/LEDTime.ts";
import {Clock} from "../../Clock.ts";
import {timeNumObj, timeStrObj} from "../../util.ts";
import {Toggle} from "../Input/toggle/toggle.ts";
import {PMView} from "../ampm/pmView.ts";
import {SignalMap} from "../../SignalMap.ts";
import {clockSettings} from "../../global.ts";
import {H24Toggle} from "../Input/h24toggle.ts";
import {DateView} from "./dateView/dateView.ts";

export class DigitalClock extends Clock{
    timeView!: LEDTime;
    pmToggle!: Toggle;
    pmView!: PMView;
    dateView!: DateView;
    formattedTime: SignalMap<timeNumObj, timeStrObj>;
    formattedTimeSymbol?: symbol;
    constructor(parent: HTMLDivElement, timeSource: SignalMap<timeNumObj, timeStrObj>) {
        super("digital", parent);
        this.render(parent);
        this.formattedTime = timeSource;
    }
    render(target: HTMLDivElement){
        this.element.classList.add("digital-clock");
        this.dateView = new DateView(this.element);
        const timeContainer = document.createElement("div");
        timeContainer.classList.add("time-container");
        this.pmView = new PMView(timeContainer);
        this.pmView.show();
        this.timeView = new LEDTime(timeContainer);
        this.timeView.show();
        this.element.appendChild(timeContainer);

        const controls = document.createElement("div");
        controls.classList.add("controls");
        this.pmToggle = new H24Toggle(controls, "digital-24", ()=>{
            clockSettings.hr24 = !clockSettings.hr24;
        });
        this.pmToggle.update(clockSettings.hr24);
        this.pmToggle.show();


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
        this.formattedTimeSymbol = this.formattedTime.subscribe((time)=>{
            this.update(time);
        });
        this.pmToggle.update(clockSettings.hr24);
    }
    hide(){
        super.hide();
        this.element.classList.remove("flex");
        if(this.formattedTimeSymbol) this.formattedTime.unsubscribe(this.formattedTimeSymbol);
    }

    sleep(): void {
        if(this.formattedTimeSymbol) this.formattedTime.unsubscribe(this.formattedTimeSymbol);
    }

    wake(): void {
        this.formattedTimeSymbol = this.formattedTime.subscribe((time)=>{
            this.update(time);
        });
    }
}
