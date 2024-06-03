import {Clock} from "../../Clock.ts";
import {timeObj} from "../../global.ts";
import {renderTime} from "../LEDTime/LEDTime.ts";

export class AnalogClock extends Clock{
    constructor(parent: HTMLDivElement) {
        super("analog", parent);
        this.render(parent);
    }
    update(time: timeObj, target: HTMLDivElement) {
    }
    show() {
        super.show();
    }
    hide() {
        super.hide();
    }

    render(target: HTMLDivElement): void {
        this.element.classList.add("analog-clock");
        target.appendChild(this.element);
    }
}