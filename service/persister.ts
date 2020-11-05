import * as fs from "fs";
import { TeamSpeakChannel, TeamSpeakClient } from "ts3-nodejs-library";
import { Logger } from "../logger/logger";
import { Monitor } from "../models/monitor";
import { MonitorService } from "./monitorService";
import { TeamSpeakService} from "./teamspeakService";
import * as data from "../settings.json";

export class Persister{
    private static instance: Persister;

    private path: string = "./settings.json";
    private monitors: Array<Monitor>;
    private channel: TeamSpeakChannel;
    private clients: Array<TeamSpeakClient>;

    private constructor() {}

    public static getInstance(): Persister {
        if(!Persister.instance){
            Persister.instance = new Persister();
        }

        return Persister.instance;
    }

    public setMonitors(monitors: Array<Monitor>): void {
        this.monitors = monitors;
        this.safeAll();
    }

    public setMonitoringChannel(channel: TeamSpeakChannel): void {
        this.channel = channel;
        this.safeAll();
    }

    public setNotifySubscribers(clients: Array<TeamSpeakClient>): void {
        this.clients = clients;
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
        teamSpeakService.setMonitoringChannelWithId(data.channel.cid);
    }

    private setUpNotifySubscribers(): void {
        const teamSpeakService: TeamSpeakService = TeamSpeakService.getInstance();
        data.clients.forEach(client => {
            teamSpeakService.addUsersToNotifyById(client.cid);
        });
    }

    public setUpAll() {
        this.setUpMonitoringChannel();
        this.setUpMonitors();
        this.setUpNotifySubscribers();
    }

    private safeAll(): void {
        const logger: Logger = Logger.getInstance();
        const data = "{ \"monitors\":" + JSON.stringify(this.monitors)+"\n, \"monitoringChannel\":"+JSON.stringify(this.channel)+"\n, \"notifySubscribers\":"+JSON.stringify(this.clients) + "}";
        fs.writeFile(this.path, data, () => {
            logger.Info("Data has been persisted");
        })
    }
}