import "./style.css";
import {App} from "@capacitor/app";
import {LocalNotifications} from "@capacitor/local-notifications";
import {clockNameType, clockNames, clocks, dateTimeSignal, beep} from "./global.ts";

LocalNotifications.requestPermissions();
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
setCurrentClock("digital");
setInterval(()=>{
    const now = new Date();
    dateTimeSignal.setValue(now);
}, 115);

const textRing = document.querySelector(".text-ring") as HTMLDivElement;
textRing.addEventListener("click", (e)=>{
    beep.play(10);//This is primarily a workaround for Safari's time limit on last interaction before audio plays.
    const target = e.target as HTMLDivElement;
    if(target.tagName === "textPath"){
        setCurrentClock(target.textContent!.toLowerCase() as clockNameType);
    }
});


App.addListener("resume",()=>{

});