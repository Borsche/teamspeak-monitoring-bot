import { Logger } from "./logger";
import { LoggerStyle } from "./LoggerStyle";

export class LoggerBuilder {

    private path: string;
    private errorStyle: string;
    private normalStyle: string;

    public setPath(path: string): LoggerBuilder {
        this.path = "../" + path;
        return this;
    }

    public setErrorStyle(val: number): LoggerBuilder {
        this.errorStyle += `\\e[${val}m`; 
        return this;
    }

    public setNormalStyle(val: number): LoggerBuilder {
        this.normalStyle += `\\e[${val}m`;
        return this;
    }

    public build(): Logger {
        return Logger.getInstance(this.path, this.errorStyle, this.normalStyle);
    }

    public getLoggerInstance(): Logger {
        return Logger.getInstance();
    }
}