import "./styles.css";
import {LEDTime} from "../LEDTime/LEDTime.ts";
import {Clock} from "../../Clock.ts";
import {timeObj} from "../../util.ts";
import {SignalProvider} from "../../SignalProvider.ts";

export class DigitalClock extends Clock<timeObj>{
    timeView?: LEDTime;
    constructor(parent: HTMLDivElement, timeSource: SignalProvider<timeObj>) {
        super("digital", parent, timeSource);
        this.render(parent);
    }
    render(target: HTMLDivElement) {
        this.element.classList.add("digital-clock");

        this.timeView = new LEDTime(this.element);
        this.timeView.show();
        target.appendChild(this.element);
    }

    update(time: timeObj): void {
        this.timeView!.update(time);
        //updateTime(time, this.element.querySelector(".led-time") as HTMLDivElement);
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
