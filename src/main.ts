import {clockNameType, clockSettings, clockNames} from "./global.ts";
function renderClock(name: clockNameType){
    const clockContainer = document.querySelector('.clock-container') as HTMLDivElement;
    clockContainer.innerText = name;
}
export function setCurrentClock(name: clockNameType){
    const textRing = document.querySelector(".text-ring") as HTMLDivElement;
    textRing.style.setProperty("--rotation", String(clockNames.findIndex(item=>item === name) * (-360 / clockNames.length) + 90)+"deg");
    clockSettings.currentClock = name;
    renderClock(name);
}
setCurrentClock("analog");