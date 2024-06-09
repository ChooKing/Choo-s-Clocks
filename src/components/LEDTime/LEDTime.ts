import "./styles.css";

import {DigitType, renderDigit, setDigit} from "./LEDDigit/LEDDigit.ts";
import {timeObj} from "../../util.ts";
function renderColon(container:HTMLDivElement){
    const colon = document.createElement("div");
    colon.classList.add("colon");
    container.appendChild(colon);
}
export function renderTime(time: timeObj, target: HTMLDivElement){
    const container = document.createElement("div");
    container.classList.add("led-time");
    renderDigit(time.hours[0], container);
    renderDigit(time.hours[1], container);
    renderColon(container);
    renderDigit(time.minutes[0], container);
    renderDigit(time.minutes[1], container);
    renderColon(container);
    renderDigit(time.seconds[0], container);
    renderDigit(time.seconds[1], container);
    target.appendChild(container);
}
export function updateTime(time: timeObj, target: HTMLDivElement){
    const digits = target.querySelectorAll(".digit") as NodeListOf<HTMLDivElement>;
    setDigit(time.hours[0] as DigitType, digits[0]);
    setDigit(time.hours[1] as DigitType, digits[1]);
    setDigit(time.minutes[0] as DigitType, digits[2]);
    setDigit(time.minutes[1] as DigitType, digits[3]);
    setDigit(time.seconds[0] as DigitType, digits[4]);
    setDigit(time.seconds[1] as DigitType, digits[5]);
}