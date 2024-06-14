import "./styles.css";
import {ReactiveComponent} from "../../ReactiveComponent.ts";

const segmentDefs = {
    " ": [false, false, false, false, false, false, false],
    "0": [true, true, true, true, true, true, false],
    "1": [false, true, true, false, false, false, false],
    "2": [true, true, false, true, true, false, true],
    "3": [true, true, true, true, false, false, true],
    "4": [false, true, true, false, false, true, true],
    "5": [true, false, true, true, false, true, true],
    "6": [true, false, true, true, true, true, true],
    "7": [true, true, true, false, false, false, false],
    "8": [true, true, true, true, true, true, true],
    "9": [true, true, true, true, false, true, true]
};
export type DigitType = keyof typeof segmentDefs;

export class LEDDigit extends ReactiveComponent<DigitType>{
    segments: HTMLDivElement[] = [];
    constructor(parent: HTMLDivElement) {
        super(parent);
        this.render(parent);
    }
    render(target: HTMLDivElement): void {
        this.element.classList.add("digit");
        for(let i = 0; i < 7; i++) {
            const led = document.createElement("div");
            led.classList.add("segment");
            this.segments.push(led);
            this.element.appendChild(led);
        }
        target.appendChild(this.element);
    }

    update(value: DigitType): void {
        this.segments.forEach((segment, index)=>{
            if (segmentDefs[value][index]) {
                segment.classList.add("lit");
            } else {
                segment.classList.remove("lit");
            }
        })
    }

}