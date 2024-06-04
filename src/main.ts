import "./style.css";
import {clockNameType, clockSettings, clockNames, clocks} from "./global.ts";
import {sec2Time} from "./util.ts";


export function setCurrentClock(name: clockNameType){
    const textRing = document.querySelector(".text-ring") as HTMLDivElement;
    textRing.style.setProperty("--rotation", String(clockNames.findIndex(item=>item === name) * (-360 / clockNames.length) + 90)+"deg");
    if(clockSettings.currentClock){
        clockSettings.currentClock.hide();
    }
    clockSettings.currentClock = clocks[name];
    console.log(clocks[name]);
    setTimeout(()=>{
        clocks[name].show();
    },750);
}

setInterval(()=>{
    const now = new Date();
    const rawTime = (now.getHours()*3600 + now.getMinutes()* 60 + now.getSeconds()) * 1000 + now.getMilliseconds();
    clockSettings.rawTimeSignal.notify(rawTime);
    clockSettings.dateTimeSignal.notify(now);
    clockSettings.formattedTimeSignal.notify(sec2Time(Math.round(rawTime/1000)));
}, 115);
setCurrentClock("countdown");

const textRing = document.querySelector(".text-ring") as HTMLDivElement;
textRing.addEventListener("click", (e)=>{
    const target = e.target as HTMLDivElement;
    if(target.tagName === "textPath"){
        setCurrentClock(target.textContent!.toLowerCase() as clockNameType);
    }

})