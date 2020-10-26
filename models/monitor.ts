export class Monitor {

    private port : number;
    private ip : string;
    private name : string;
    private id : number;
    private reachable : boolean = false;

    constructor(options: MonitorConstructorOptions) {
        this.port = options.port;
        this.ip = options.ip;
        this.name = options.name;
        console.log(`new monitoring class for service ${this.ip}:${this.port}`);
    }

    setId(id : number) {
        this.id = id;
    }

    getId() : number {
        return this.id;
    }

    setReachable(reachable : boolean) {
        this.reachable = reachable;
    }

    isReachable() : boolean {
        return this.reachable;
    }

    getPort(): number {
        return this.port;
    }

    getName(): string {
        return this.name;
    }

    getIp(): string {
        return this.ip;
    }
    
}

export interface MonitorConstructorOptions {
    port: number,
    ip: string,
    name: string
}