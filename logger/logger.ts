import * as fs from "fs";
import { LoggerStyle } from "./LoggerStyle";

export class Logger {

    private static instance: Logger;

    private path: string;
    private errorStyle: string;
    private normalStyle: string;

    private constructor(path?: string, errorStyle?: string, normalStyle?: string){
        this.path = path;
        this.errorStyle = errorStyle;
        this.normalStyle = normalStyle;
    }

    public static getInstance(path?: string, errorStyle?: string, normalStyle?: string) {
        if(!Logger.instance) {
            Logger.instance = new Logger(path, errorStyle, normalStyle);
        }
        return Logger.instance;
    }

    public Error(msg: string): void {
        const date = new Date();
        fs.appendFile(this.path + "/error.txt",`${this.errorStyle}${this.getTimestamp()} ${msg} \\e[${LoggerStyle.ResetAll}m`, () => {})
    }

    public Info(msg: string): void {
        fs.appendFile(this.path + "/log.txt", `${this.normalStyle}${this.getTimestamp()} ${msg} \\e[${LoggerStyle.ResetAll}m`, () => {})
    }

    private getTimestamp(): string {
        const date = new Date();
        return `[${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`;
    }
}