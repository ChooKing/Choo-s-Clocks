import {renderTime} from "../LEDTime/LEDTime.ts";
export function renderDigitalClock(target: HTMLDivElement) {
    const container = document.createElement("div");
    container.classList.add("digital-clock");
    renderTime({hours: "01", minutes:"23", seconds:"45"}, container);
    target.appendChild(container);
}