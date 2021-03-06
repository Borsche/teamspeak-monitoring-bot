export class Persistdata {
    public monitors: Array<PersistMonitor> = [];
    public monitoringChannelCid: string = "";
    public notifySubscribers: Array<string> = [];
}

export class PersistMonitor {
    public name: string;
    public ip: string;
    public port: number;
}