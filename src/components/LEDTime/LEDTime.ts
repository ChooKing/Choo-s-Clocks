import "./styles.css";
import {renderPair} from "./DigitPair/digitPair.ts";
import {timeObj} from "../../global.ts";
import {setDigit} from "./LEDDigit/LEDDigit.ts";
function renderColon(container:HTMLDivElement){
    const colon = document.createElement("div");
    colon.classList.add("colon");
    container.appendChild(colon);
}
export function renderTime(time: timeObj, target: HTMLDivElement){
    const container = document.createElement("div");
    container.classList.add("led-time");
    renderPair(time.hours, container);
    renderColon(container);
    renderPair(time.minutes, container);
    renderColon(container);
    renderPair(time.seconds, container);
    target.appendChild(container);
}
export function updateTime(time: timeObj, target: HTMLDivElement){
    const digits = target.querySelectorAll(".digit") as NodeListOf<HTMLDivElement>;
    setDigit(Number(time.hours[0]), digits[0]);
    setDigit(Number(time.hours[1]), digits[1]);
    setDigit(Number(time.minutes[0]), digits[2]);
    setDigit(Number(time.minutes[1]), digits[3]);
    setDigit(Number(time.seconds[0]), digits[4]);
    setDigit(Number(time.seconds[1]), digits[5]);
}