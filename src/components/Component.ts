export abstract class Component {
    element: HTMLDivElement;
    parent: HTMLDivElement;
    protected constructor(parent: HTMLDivElement) {
        this.element = document.createElement("div");
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