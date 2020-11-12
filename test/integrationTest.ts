import { describe, it} from "mocha";
import * as assert from "assert";

import { TeamSpeak, TextMessageTargetMode } from "ts3-nodejs-library";
import { TeamSpeakService } from '../service/teamspeakService';
import { MonitorService } from '../service/monitorService';
import * as config from "../config.json";

describe('Integration Test', () => {
    const teamspeakService = TeamSpeakService.getInstance();
    const teamspeak = teamspeakService.getTeamSpeak();

    const testerConfig = {
        host: config.host,
        nickname: config.nickname,
        username: "tester",
        password: config.password,
        queryport: config.queryport,
        serverport: config.serverport
    }

    TeamSpeak.connect(testerConfig).then(tester => {

        const monitorService = MonitorService.getInstance();
        const monitorLenght = monitorService.getAllMonitors().length;

        teamspeak.on("textmessage", ev => {
            it('Should add a new monitor and respond', () => {
                assert.strictEqual(ev.msg, "Service added");
                assert.strictEqual(monitorLenght + 1, monitorService.getAllMonitors().length);
            })
        })

        teamspeak.whoami().then(me=>{
            const msg = "!addService localhost:0 TEST"
            tester.sendTextMessage(me.clientId, TextMessageTargetMode.CLIENT, msg);
        }).catch(e => {
            console.log(e);
        })
    }).catch(e => {
        console.log(e);
    });
})