import "./styles.css";
const segments = [
    [true, true, true,true, true, true, false],
    [false, true, true,false, false, false, false],
    [true, true, false,true, true, false, true],
    [true, true, true,true, false, false, true],
    [false, true, true,false, false, true, true],
    [true, false, true,true, false, true, true],
    [true, false, true,true, true, true, true],
    [true, true, true,false, false, false, false],
    [true, true, true,true, true, true, true],
    [true, true, true,true, false, true, true]
];
export function renderDigit(num: string, target: HTMLElement){
    const container = document.createElement("div");
    container.classList.add("digit");
    segments[Number(num)].forEach((segment) => {
        const led = document.createElement("div");
        led.classList.add("segment");
        if(segment){
            led.classList.add("lit");
        }
        container.appendChild(led);
    });
    target.appendChild(container);
}
export function setDigit(num: number, digitGroup: HTMLElement){
    digitGroup.querySelectorAll(".segment").forEach((segment,index) => {
        if(segments[num][index]){
            segment.classList.add("lit");
        }
        else segment.classList.remove("lit");
    });
}