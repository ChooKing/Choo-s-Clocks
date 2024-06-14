import "./styles.css";

import {LEDDigit} from "./LEDDigit/LEDDigit.ts";
import {timeObj} from "../../util.ts";
import {ReactiveComponent} from "../ReactiveComponent.ts";

export class LEDTime extends ReactiveComponent<timeObj, HTMLDivElement>{
    digits = {} as Record<"hours"|"minutes"|"seconds", LEDDigit[]>;
    constructor(parent: HTMLDivElement) {
        super(parent);
        this.element.classList.add("led-time");
        this.render(parent);
    }
    render(target: HTMLDivElement): void {
        this.digits.hours = [new LEDDigit(this.element), new LEDDigit(this.element)];
        this.renderColon();
        this.digits.minutes = [new LEDDigit(this.element), new LEDDigit(this.element)];
        this.renderColon();
        this.digits.seconds = [new LEDDigit(this.element), new LEDDigit(this.element)];
        target.appendChild(this.element);
        this.digits.hours[0].show();
        this.digits.hours[1].show();
        this.digits.minutes[0].show();
        this.digits.minutes[1].show();
        this.digits.seconds[0].show();
        this.digits.seconds[1].show();
    }
    renderColon(){
        const colon = document.createElement("div");
        colon.classList.add("colon");
        this.element.appendChild(colon);
    }

    update(value: timeObj): void {
        this.digits.hours[0].update(value.hours[0]);
        this.digits.hours[1].update(value.hours[1]);
        this.digits.minutes[0].update(value.minutes[0]);
        this.digits.minutes[1].update(value.minutes[1]);
        this.digits.seconds[0].update(value.seconds[0]);
        this.digits.seconds[1].update(value.seconds[1]);
    }

}