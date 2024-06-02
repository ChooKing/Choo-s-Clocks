import {timeObj} from "./global.ts";

export function date2Time(time: Date, hr24 = false) {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    return {
        hours: hr24 ? String(hours).padStart(2,"0") : String(hours % 12).padStart(2,"0"),
        minutes:String(minutes).padStart(2,"0"),
        seconds:String(seconds).padStart(2,"0")
    };
}
export function sec2Time(time: number):timeObj{
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return {
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0")
    };
}
export function time2Sec(time: timeObj){
    const hours = parseInt(time.hours);
    const minutes = parseInt(time.minutes);
    const seconds = parseInt(time.seconds);
    return hours * 3600 + minutes * 60 + seconds;
}