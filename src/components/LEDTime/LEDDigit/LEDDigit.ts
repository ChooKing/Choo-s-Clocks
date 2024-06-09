import "./styles.css";

const segments = {
    " ": [false, false, false, false, false, false, false],
    "0": [true, true, true, true, true, true, false],
    "1": [false, true, true, false, false, false, false],
    "2": [true, true, false, true, true, false, true],
    "3": [true, true, true, true, false, false, true],
    "4": [false, true, true, false, false, true, true],
    "5": [true, false, true, true, false, true, true],
    "6": [true, false, true, true, true, true, true],
    "7": [true, true, true, false, false, false, false],
    "8": [true, true, true, true, true, true, true],
    "9": [true, true, true, true, false, true, true]
};
export type DigitType = keyof typeof segments;

export function renderDigit(num: DigitType, target: HTMLElement) {
    const container = document.createElement("div");
    container.classList.add("digit");
    segments[num].forEach((segment) => {
        const led = document.createElement("div");
        led.classList.add("segment");
        if (segment) {
            led.classList.add("lit");
        }
        container.appendChild(led);
    });
    target.appendChild(container);
}

export function setDigit(num: DigitType, digitGroup: HTMLElement) {
    digitGroup.querySelectorAll(".segment").forEach((segment, index) => {
        if (segments[num][index]) {
            segment.classList.add("lit");
        } else segment.classList.remove("lit");
    });
}