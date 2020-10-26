import { TeamSpeakService } from "./service/teamspeakService";
import { TeamSpeak, ConnectionParams } from "ts3-nodejs-library";
import * as fs from "fs";
import * as config from "./config.json";

const teamSpeakService = TeamSpeakService.getInstance();

TeamSpeak.connect(config).then(teamspeak => {
    teamSpeakService.setTeamSpeak(teamspeak);

    teamspeak.on("textmessage", ev => {
        teamSpeakService.handleMessage(ev);
    })
}).catch(e => {
    console.error("Catched an error!", e);
});