import { TeamSpeakService } from "./teamspeakService";
import { TeamSpeak } from "ts3-nodejs-library";
import { Image } from './image';

const config = {
    host: "ts.syrucx.net",
    username: "monitoring_bot",
    password: "ztwgTWVW",
    nickname: "monitoring_bot",
    queryport: 10011,
    serverport: 9987,
}

const teamSpeakService = TeamSpeakService.getInstance();

TeamSpeak.connect(config).then(teamspeak => {
    teamSpeakService.setTeamSpeak(teamspeak);

    teamspeak.on("textmessage", ev => {
        teamSpeakService.handleMessage(ev);
    })
}).catch(e => {
    console.error("Catched an error!", e);
});