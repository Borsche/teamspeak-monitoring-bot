import * as fs from "fs";
import { TeamSpeakChannel, TeamSpeakClient } from "ts3-nodejs-library";
import { Logger } from "../logger/logger";
import { Monitor } from "../models/monitor";
import { MonitorService } from "./monitorService";
import { TeamSpeakService} from "./teamspeakService";
import * as data from "../settings.json";
import { Persistdata, PersistMonitor } from "../models/persistdata";

export class Persister{
    private static instance: Persister;

    private path: string = "./settings.json";
    private data: Persistdata;

    private constructor() {
        this.data = new Persistdata();
    }

    public static getInstance(): Persister {
        if(!Persister.instance){
            Persister.instance = new Persister();
        }

        return Persister.instance;
    }

    public setMonitors(monitors: Array<Monitor>): void {
        this.data.monitors = [];
        monitors.forEach(monitor => {
            const persistMonitor = new PersistMonitor();
            persistMonitor.ip = monitor.getIp();
            persistMonitor.name = monitor.getName();
            persistMonitor.port = monitor.getPort();
            this.data.monitors.push(persistMonitor);
        })
        this.safeAll();
    }

    public setMonitoringChannel(channel: TeamSpeakChannel): void {
        this.data.monitoringChannelCid = channel.cid;
        this.safeAll();
    }

    public setNotifySubscribers(clients: Array<TeamSpeakClient>): void {
        this.data.notifySubscribers = [];
        clients.forEach(client => {
            this.data.notifySubscribers.push(client.cid);
        })
        this.safeAll();
    }

    private setUpMonitors(): void {
        const monitorService: MonitorService = MonitorService.getInstance();

        data.monitors.forEach(monitor => {
            const mon: Monitor = new Monitor({port: monitor.port, ip: monitor.ip, name: monitor.name});
            monitorService.addMonitor(mon);
        });
    }

    private setUpMonitoringChannel(): void {
        const teamSpeakService: TeamSpeakService = TeamSpeakService.getInstance();
        teamSpeakService.setMonitoringChannelWithId(data.monitoringChannelCid);
    }

    // private setUpNotifySubscribers(): void {
    //     const teamSpeakService: TeamSpeakService = TeamSpeakService.getInstance();
    //     data.notifySubscribers.forEach(cid => {
    //         teamSpeakService.addUsersToNotifyById(cid);
    //     });
    // }

    public setUpAll() {
        this.setUpMonitoringChannel();
        this.setUpMonitors();
        //this.setUpNotifySubscribers();
    }

    private safeAll(): void {
        const logger: Logger = Logger.getInstance(); // TO DO dont allow undefined!
        const data = JSON.stringify(this.data);
        fs.writeFile(this.path, data, () => {
            logger.Info("Data has been persisted");
        })
    }
}