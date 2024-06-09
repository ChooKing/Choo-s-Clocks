import {DigitType} from "./components/LEDTime/LEDDigit/LEDDigit.ts";

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
export type timeObj={
    hours: DigitType[];
    minutes: DigitType[];
    seconds: DigitType[];
}
export function sec2Time(time: number):timeObj{
    const hours = String(Math.floor(time / 3600)).padStart(2,"0");
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2,"0");
    const seconds = String(time % 60).padStart(2,"0");
    return {
        hours: [hours[0] as DigitType, hours[1] as DigitType],
        minutes: [minutes[0] as DigitType,minutes[1] as DigitType],
        seconds: [seconds[0] as DigitType,seconds[1] as DigitType]
    };
}
