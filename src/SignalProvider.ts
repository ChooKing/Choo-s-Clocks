export class SignalProvider<T> {
    callbacks: {name:string, callback: (value:T)=>void}[];
    constructor() {
        this.callbacks = [];
    }
    notify(value: T){
        Object.values(this.callbacks).forEach(item=>{
            item.callback(value);
        })
    }
    subscribe(name: string, callback: (value: T) => void){
        this.callbacks.push({name, callback});
    }
    unsubscribe(name: string){
        this.callbacks = this.callbacks.filter(item => item.name !== name);
    }
}