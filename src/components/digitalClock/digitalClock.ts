import "./styles.css";
import {renderTime, updateTime} from "../LEDTime/LEDTime.ts";
import {Clock} from "../../Clock.ts";
import {timeObj} from "../../util.ts";
import {SignalProvider} from "../../SignalProvider.ts";

export class DigitalClock extends Clock<timeObj>{
    constructor(parent: HTMLDivElement, timeSource: SignalProvider<timeObj>) {
        super("digital", parent, timeSource);
        this.render(parent);
    }
    render(target: HTMLDivElement) {
        this.element.classList.add("digital-clock");
        renderTime({hours: ["0","0"], minutes:["0","0"], seconds:["0","0"]}, this.element);
        target.appendChild(this.element);
    }

    update(time: timeObj): void {
        updateTime(time, this.element.querySelector(".led-time") as HTMLDivElement);
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
