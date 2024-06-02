import {renderDigit} from "../LEDDigit/LEDDigit.ts";
export function renderPair(digits: string, target: HTMLDivElement){
    renderDigit(digits[0], target);
    renderDigit(digits[1], target);
}
