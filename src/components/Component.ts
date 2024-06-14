export abstract class Component {
    element: HTMLElement;
    parent: HTMLDivElement;
    protected constructor(parent: HTMLDivElement, elementType:string = "div") {
        this.element = document.createElement(elementType);
        this.element.classList.add("hidden");
        this.parent = parent;
    }
    abstract render(target: HTMLDivElement):void;
    hide(){
        this.element.classList.add("fading");
        setTimeout(()=>{
            this.element.classList.add("hidden");
        }, 500);
    }
    show(){
        this.element.classList.remove("hidden");
        this.element.classList.remove("fading");
    }

}