import { describe, it} from "mocha";
import * as assert from "assert";

import { MonitorService } from "../service/monitorService";
import { Monitor, MonitorConstructorOptions } from "../models/monitor";

describe('Testing MonitorService', () => {
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
    monitorService.addMonitor(monitor2);
    monitorService.addMonitor(monitor3);

    it('Should received same instance', () => {
        assert.strictEqual(monitorService, MonitorService.getInstance());
    });

    it('Should return all Monitors', () => {
        const monitors = monitorService.getAllMonitors();

        assert.strictEqual(monitors.length, 3);
    })

    it('Should return Monitor with id 2', () => {
        assert.strictEqual(monitorService.getMonitorById(2).getId(), monitor2.getId());
    })

    it('Should remove Monitor with Id 1', () => {
        monitorService.removeMonitorById(1);

        assert.strictEqual(monitorService.getMonitorById(1), undefined);
    })

    it('Shouldn\'t assign Monitors the same id', (done) => {
        const monitor4 = new Monitor(options);

        monitorService.addMonitor(monitor4);

        const monitors = monitorService.getAllMonitors();
        monitorService.shutDownPingTask();
        assert.notStrictEqual(monitors[monitors.length - 1].getId(), monitors[monitors.length - 2].getId())
        done();
    })
});