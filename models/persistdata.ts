import { Logger } from "../logger/logger";
import { Monitor } from "../models/monitor";
import { TeamSpeakChannel, TeamSpeakClient } from "ts3-nodejs-library";

export class Persistdata {
    private monitors: Array<Monitor>;
    private monitoringChannel: TeamSpeakChannel;
    private notifySubscribers: Array<TeamSpeakClient>;

    public setMonitors(monitors: Array<Monitor>): void {
        this.monitors = monitors;
    }

    public setMonitoringChannel(channel: TeamSpeakChannel): void {
        this.monitoringChannel = channel;
    }

    public setNotifySubscribers(clients: Array<TeamSpeakClient>): void {
        this.notifySubscribers = clients;
    }

    public getMonitors(): Array<Monitor> {
        return this.monitors;
    }

    public getMonitoringChannel(): TeamSpeakChannel{
        return this.monitoringChannel;
    }

    public getNotifySubscribers(): Array<TeamSpeakClient> {
        return this.notifySubscribers;
    }
}