import {clockNameType, clockSettings, clockNames} from "./global.ts";
import {renderDigitalClock} from "./components/digitalClock/digitalClock.ts";
import {updateTime} from "./components/LEDTime/LEDTime.ts";
import {sec2Time} from "./util.ts";
function renderClock(name: clockNameType){



    switch (name) {
        case "digital":
            renderDigitalClock(clockSettings.clockContainer);
    }
}
export function setCurrentClock(name: clockNameType){
    const textRing = document.querySelector(".text-ring") as HTMLDivElement;
    textRing.style.setProperty("--rotation", String(clockNames.findIndex(item=>item === name) * (-360 / clockNames.length) + 90)+"deg");
    clockSettings.currentClock = name;
    renderClock(name);
}

setInterval(()=>{
    const now = new Date();
    clockSettings.time = (now.getHours()*3600 + now.getMinutes()* 60 + now.getSeconds()) * 1000 + now.getMilliseconds();
    if(clockSettings.currentClock==="digital"){
        updateTime(sec2Time(clockSettings.time/1000),document.querySelector(".led-time") as HTMLDivElement);
    }
}, 115);
setCurrentClock("digital");