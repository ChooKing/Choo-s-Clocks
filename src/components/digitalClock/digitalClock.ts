import "./styles.css";
import {renderTime, updateTime} from "../LEDTime/LEDTime.ts";
import {Clock} from "../../Clock.ts";
import {clockSettings} from "../../global.ts";
import {timeObj} from "../../util.ts";

export class DigitalClock extends Clock{
    constructor(parent: HTMLDivElement) {
        super("digital", parent);
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
        clockSettings.formattedTimeSignal.subscribe(this.name, (time)=>{
            this.update(time);
        })
    }
    hide(){
        super.hide();
        this.element.classList.remove("flex");
        clockSettings.formattedTimeSignal.unsubscribe(this.name);
    }
}
