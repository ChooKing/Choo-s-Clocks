import "./style.css";
import {clockNameType, clockNames, clocks, dateTimeSignal} from "./global.ts";

let currentClock: clockNameType = "digital";

export function setCurrentClock(name: clockNameType){
    const textRing = document.querySelector(".text-ring") as HTMLDivElement;
    textRing.style.setProperty("--rotation", String(clockNames.findIndex(item=>item === name) * (-360 / clockNames.length) + 90)+"deg");
    clocks[currentClock].hide();
    currentClock = name;
    setTimeout(()=>{
        clocks[name].show();
    },750);
}

setInterval(()=>{
    const now = new Date();
    dateTimeSignal.setValue(now);
}, 115);
setCurrentClock("analog");

const textRing = document.querySelector(".text-ring") as HTMLDivElement;
textRing.addEventListener("click", (e)=>{
    const target = e.target as HTMLDivElement;
    if(target.tagName === "textPath"){
        setCurrentClock(target.textContent!.toLowerCase() as clockNameType);
    }

});


