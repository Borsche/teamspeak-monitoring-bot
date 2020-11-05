import { TeamSpeak, TeamSpeakChannel, TeamSpeakClient } from "ts3-nodejs-library";
import { Monitor } from "../models/monitor";
import { MonitorService } from "./monitorService";
import { commands } from "../models/command";
import { Logger } from "../logger/logger";
import { Persister } from "./persister";

const cmdPrefix = "!";
const allowedGroupId = "6";
let allowedUser: Array<string> = []     // list of allowed users to perfom commands

export class TeamSpeakService {

    private static instance: TeamSpeakService;
    private teamspeak: TeamSpeak;
    private activeChannel: TeamSpeakChannel;
    private usersToNotify: Array<TeamSpeakClient> = [];

    private constructor() {}

    public static getInstance() {
        if(!TeamSpeakService.instance) {
            TeamSpeakService.instance = new TeamSpeakService();
        }

        return TeamSpeakService.instance;
    }

    getTeamSpeak(): TeamSpeak {
        return this.teamspeak;
    }

    setTeamSpeak(teamspeak: TeamSpeak) {
        this.teamspeak = teamspeak;
    }

    getMonitoringChannel(): TeamSpeakChannel {
        return this.activeChannel;
    }

    setMonitoringChannelWithId(id): string {
        const persister: Persister = Persister.getInstance();

        this.teamspeak.getChannelById(id).then(channel => {
            if(channel) {
                this.activeChannel = channel;
                persister.setMonitoringChannel(channel);

                return `Active monitoring channel changed to ${channel.name}`;
            } else {
                return `Could not add channel "${id}".`;    
            }
        }).catch(e => {
            return `No Channel with name "${id}" exists.`;
        });

        return "";
    }

    addUsersToNotifyById(uid): void {
        this.teamspeak.getClientByUid(uid).then(user => {
            this.usersToNotify.push(user);
        }).catch(e => {
            const logger = Logger.getInstance();
            logger.Error(e);
        })
    }

    handleMessage(ev) {
        if(isCommand(ev.msg)) {
            if(clientIsAdmin(ev.invoker) || clientIsAllowed(ev.invoker)) {

                this.handleCommand(ev);

            } else {
                ev.invoker.message("Permission denied.");
            }
        }   
    }

    private handleCommand(ev) {
        const command = ev.msg.replace(cmdPrefix, '').split(" ");
                
        const monitorService = MonitorService.getInstance();
        const persister: Persister = Persister.getInstance();

        switch(command[0]) {
            case commands.ADDSERVICE:

                const ipPort = command[1].split(":");

                const monitor = new Monitor({
                    ip: ipPort[0],
                    port: parseInt(ipPort[1]),
                    name: command[2]
                })

                monitorService.addMonitor(monitor);

                persister.setMonitors(monitorService.getAllMonitors());

                ev.invoker.message(`Service added`);
                break;
            case commands.REMOVESERVICE:
                monitorService.removeMonitorById(parseInt(command[1]));
                ev.invoker.message(`Service removed`);
                break;
            case commands.SETMONITORCHANNEL:    
                ev.invoker.message(this.setMonitoringChannelWithId(command[1]));
                break;
            case commands.GETCHANNELID:
                this.teamspeak.getChannelByName(command[1]).then(channel => {
                    
                    if(channel) {
                        ev.invoker.message(`The channel ${channel.name} has the id ${channel.cid}`);
                    } else {
                        ev.invoker.message(`Could not add channel "${command[1]}".`);    
                    }
                }).catch(e => {
                    ev.invoker.message(`No Channel with name "${command[1]}" exists.`);
                })
                break;
            case commands.NOTIFYME:
                this.usersToNotify.push(ev.invoker);
                persister.setNotifySubscribers(this.usersToNotify);
                ev.invoker.message("You subscribed to the notifications");
                break;
            case commands.HELP:
                ev.invoker.message(getHelpMessage());
                break;
            //case commands.REMOVEUSER:
            //    break;
            //case commands.ADDUSER:
            //    break;
            default:
                ev.invoker.message(`Unknown command: ${command[0]}`);
        }
    }

    public notifyPoke(monitor: Monitor) {
        this.usersToNotify.forEach(user => {
            user.poke(`ALERT: ${monitor.getName()} is down!`).catch((e) => {
                const logger = Logger.getInstance();
                logger.Error(e);
            });
        })
    }
}

/**
 * 
 * Helper Functions
 * 
 */

function clientIsAdmin(client: TeamSpeakClient): boolean {
    return client.servergroups.includes(allowedGroupId);
}

function clientIsAllowed(client): boolean {
    return allowedUser.includes(client.uniqueIdentifier);
}

function isCommand(message: string) {
    return message.startsWith(cmdPrefix);
}
 
function getHelpMessage(): string {
    return "Here is a list of all commands: \n"+
    "Service: \n"+
    "   addService {ip}:{port} {name}   | adds a service\n"+
    "   rmService {ip}                  | removes a service\n"+
    "User: \n"+
    "   addUser {username}              | allows a user to use all commands\n"+
    "   rmUser {username}               | revokes rights from a user\n"+
    "Channel: \n"+
    "   setChannel {id}            | sets a channel for monitoring\n"+
    "   getChannelId {name}        | retrieves the channel id\n"
}