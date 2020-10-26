import * as fs from "fs";

export class Logger {

    private path: string;
    private errorStyle: string;
    private normalStyle: string;

    constructor(path?: string, errorStyle?: string, normalStyle?: string){
        this.path = path;
        this.errorStyle = errorStyle;
        this.normalStyle = normalStyle;
    }

    public Error(): void {
        
    }
}