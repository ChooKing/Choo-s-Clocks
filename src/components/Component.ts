export type Children<T extends Component<any>> = {[key: string]: T;}
export abstract class Component<T extends HTMLElement> {
    element: T;
    parent: HTMLDivElement;
    //children = {} as {[key: string]: HTMLElement|Component<any>;};
    protected constructor(parent: HTMLDivElement, elementType:string = "div", hidden = false) {
        this.element = document.createElement(elementType) as T;
        if(hidden) this.element.classList.add("hidden");
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