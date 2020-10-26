import { describe, it} from "mocha";
import * as assert from "assert";

import { MonitorService } from "../monitor/monitorService";
import { Monitor, MonitorConstructorOptions } from "../monitor/monitor";

describe('Testing MonitorService', () => {
    it('Should received same instance', () => {
        const monitorService = MonitorService.getInstance();
        assert.strictEqual(monitorService, MonitorService.getInstance());
    })

    it('Shouldn\'t assign Monitors the same id', () => {
        const monitorService = MonitorService.getInstance();
        const options: MonitorConstructorOptions = {
            port: 0,
            ip: "localhost",
            name: "Test"
        }
        const monitor = new Monitor(options);

        monitorService.addMonitor(monitor);
        monitorService.addMonitor(monitor)
        monitorService.removeMonitorById(1);
        monitorService.addMonitor(monitor);

        const monitors = monitorService.getAllMonitors();
        monitorService.shutDownPingTask();
        assert.notStrictEqual(monitors[0].getId(), monitors[1].getId());
    })
});