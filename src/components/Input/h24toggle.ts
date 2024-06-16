import {Toggle} from "./toggle/toggle.ts";

export class H24Toggle extends Toggle{
    constructor(parent: HTMLDivElement, id: string, callback: ()=>void) {
        super(parent, id, callback, "12H", "24H");
    }
}