import { Logger } from "./logger";
import { LoggerStyle } from "./LoggerStyle";

export class LoggerBuilder {

    private path: string;
    private errorStyle: string;

    public setPath(path: string): LoggerBuilder {
        this.path = path;
        return this;
    }

    public setErrorStyle(val: number): LoggerBuilder {
        this.errorStyle += `\\e[${val}m`; 
        return this;
    }

    public build(): Logger {
        return new Logger();
    }
}