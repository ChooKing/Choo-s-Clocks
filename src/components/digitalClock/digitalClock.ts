import {renderTime, updateTime} from "../LEDTime/LEDTime.ts";
import {Clock} from "../../Clock.ts";
import {timeObj} from "../../global.ts";

export class DigitalClock extends Clock{
    constructor(parent: HTMLDivElement) {
        super("digital", parent);
        this.render(parent);
    }
    render(target: HTMLDivElement) {
        this.element.classList.add("digital-clock");
        renderTime({hours: "00", minutes:"00", seconds:"00"}, this.element);
        target.appendChild(this.element);
    }

    update(time: timeObj, target: HTMLDivElement): void {
        updateTime(time, target.querySelector(".led-time") as HTMLDivElement);
    }
}
