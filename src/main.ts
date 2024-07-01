import "./style.css";
import {App} from "@capacitor/app";
import {LocalNotifications} from "@capacitor/local-notifications";
import {clockNameType, clockNames, clocks, dateTimeSignal, beep} from "./global.ts";

let permissionRequested = false;
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

const clockButtons = document.querySelectorAll(".curved-text-container");
clockButtons.forEach(button=>{
    button.addEventListener("click", (e)=>{
        const target = e.currentTarget as HTMLDivElement;
        setCurrentClock(target.children[0].children[0].textContent!.toLowerCase().trim() as clockNameType);
        if(!permissionRequested){
            LocalNotifications.requestPermissions();
            permissionRequested = true;
        }
        beep.play(10);//This is primarily a workaround for Safari's time limit on last interaction before audio plays.
    });
})
App.addListener("pause",()=>{
    Object.values(clocks).forEach(clock=>{
        clock.wake();
    });
});

App.addListener("resume",()=>{
    Object.values(clocks).forEach(clock=>{
        clock.wake();
    });
});