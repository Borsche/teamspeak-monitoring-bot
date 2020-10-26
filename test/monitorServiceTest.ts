import { describe, it} from "mocha";
import * as assert from "assert";

import { MonitorService } from "../service/monitorService";
import { Monitor, MonitorConstructorOptions } from "../models/monitor";

describe('Testing MonitorService', () => {
    it('Should received same instance', () => {
        const monitorService = MonitorService.getInstance();
        assert.strictEqual(monitorService, MonitorService.getInstance());
    })

    it('Shouldn\'t assign Monitors the same id', (done) => {
        const monitorService = MonitorService.getInstance();
        const options: MonitorConstructorOptions = {
            port: 0,
            ip: "localhost",
            name: "Test"
        }
        const monitor1 = new Monitor(options);
        const monitor2 = new Monitor(options);
        const monitor3 = new Monitor(options);

        monitorService.addMonitor(monitor1);
        monitorService.addMonitor(monitor2)
        monitorService.removeMonitorById(0);
        monitorService.addMonitor(monitor3);

        const monitors = monitorService.getAllMonitors();
        monitorService.shutDownPingTask();
        assert.notStrictEqual(monitors[0].getId(), monitors[1].getId())
        done();
    })
});