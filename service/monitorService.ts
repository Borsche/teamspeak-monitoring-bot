import { Monitor } from '../models/monitor';
import * as isPortReachable from 'is-port-reachable';
import { Image } from '../models/image';
import { TeamSpeakService } from "./teamspeakService";
import { Logger } from '../logger/logger';

export class MonitorService {
    private static instance: MonitorService;

    private monitors : Array<Monitor> = [];
    private teamSpeakService: TeamSpeakService;
    private pingTaskInterval;

    private constructor() { 
        this.teamSpeakService = TeamSpeakService.getInstance();
        this.pingTaskInterval = setInterval(() => { this.doPingTask() }, 10000); // start the ping task interval
    }

    public static getInstance(): MonitorService {
        if(!MonitorService.instance) {
            MonitorService.instance = new MonitorService();
        }

        return MonitorService.instance;
    }

    public addMonitor(monitor: Monitor) {

        const id: number = this.getHighestId();

        monitor.setId(id+1);
        this.monitors.push(monitor);

        this.doPingTask();
    }

    public getAllMonitors() : Array<Monitor> {
        return this.monitors;
    }

    public getMonitorById(id : number) : Monitor {
        return this.monitors.find(monitor => {monitor.getId() == id});
    }

    public removeMonitorById(id: number) {
        let foundMonitor;
        this.monitors.filter(monitor=> {
            monitor.getId() == id;
            foundMonitor = monitor;
        });

        const index = this.monitors.indexOf(foundMonitor);
        if(index > -1) {
            this.monitors.splice(index, 1);
        }
    }

    private getHighestId(): number {
        let id: number = 0;
        this.monitors.forEach((monitor) => {
            id = monitor.getId() > id ? monitor.getId() : id;
        })

        return id;
    }

    private doPingTask() {
        const logger = Logger.getInstance();
        let checkedMonitors: number = 0;
        let imageUpdateRequired: boolean = false;

        if(!this.monitors) return; // if for some reason monitors is undefined

        logger.Info("Pinging Services..");
        this.monitors.forEach(async monitor => {
            logger.Info(`   Pinging Service ${monitor.getName()}`);
            await isPortReachable(monitor.getPort(), {host:monitor.getIp()}).then(result => {
                if(result != monitor.isReachable()) {
                    imageUpdateRequired = true; // if the result differs from the previous result update the image
                    if(result == false) { // if the result just changed to false notify the users
                        this.teamSpeakService.notifyPoke(monitor);
                    }
                }
                logger.Info(`   ${result}`);
                monitor.setReachable(result);

                checkedMonitors++;

                if(checkedMonitors == this.monitors.length && imageUpdateRequired) {
                    logger.Info(`Updating image`);
                    this.updateImage();
                }
            })
        })
    }

    private updateImage() {
        
        const img = new Image(300, 300);

        this.monitors.forEach(monitor => {
            img.applyTextFromMonitor(monitor);
        })

        const buffer = img.getImage();

        const teamSpeak = this.teamSpeakService.getTeamSpeak();
        const channel = this.teamSpeakService.getMonitoringChannel();
        teamSpeak.uploadFile("/monImage.png", buffer, channel);
        teamSpeak.channelEdit(channel, {channelDescription: `[IMG]ts3image://monImage.png?channel=${channel.cid}&path=/[/IMG]`});

        //fs.writeFileSync('./test_image/image.png', buffer); //use this for debuggin
    }

    public shutDownPingTask(): void {
        clearInterval(this.pingTaskInterval);
    }
}