import { TeamSpeakService } from "./service/teamspeakService";
import { TeamSpeak } from "ts3-nodejs-library";
import * as fs from "fs";
import * as config from "./config.json";
import { LoggerBuilder } from "./logger/loggerBuilder";
import { LoggerStyle } from "./logger/LoggerStyle";
import { Persister } from "./service/persister";

const teamSpeakService = TeamSpeakService.getInstance();
const persister = Persister.getInstance();
const logger = new LoggerBuilder().setPath("./logs").setErrorStyle(LoggerStyle.ColorRed).setNormalStyle(LoggerStyle.ColorWhite).build();

TeamSpeak.connect(config).then(teamspeak => {
    teamSpeakService.setTeamSpeak(teamspeak);

    persister.setUpAll();

    teamspeak.on("textmessage", ev => {
        teamSpeakService.handleMessage(ev);
    })
}).catch(e => {
    logger.Error(e);
});