import { createCanvas } from 'canvas';
import { Monitor } from './monitor';
import { colors } from './color';

export class Image {

    private canvas;

    private mainFont = 'bold 10pt Menlo';
    private subFont = '7pt Menlo';
    private textAlign = 'left';
    private fillStyle = '#000';

    constructor(width, height) {
        this.canvas = createCanvas(width, height);
    }

    applyTextFromMonitor(monitor: Monitor) {
        const context = this.canvas.getContext('2d');

        /**
         * MAIN TEXT
         */
        context.font = this.mainFont;
        context.textAlign = this.textAlign;
        context.fillStyle = this.fillStyle;

        const mainHeight = (30 * (monitor.getId())) + 20//calculate the height for the main text;

        context.fillText(`[${monitor.getId()}]${monitor.getName()}`, 10, mainHeight);

        /**
         * SUB TEXT
         */
        context.font = this.subFont;
        
        const subHeight = mainHeight - 10;
        
        context.fillText(`${monitor.getIp()}:${monitor.getPort()}`, 10, subHeight);

        /**
         * Reachable Circle
         */

        let fillColor = monitor.isReachable ? colors.GREEN : colors.RED;
        
        context.beginPath();
        context.arc(0,mainHeight - 5,5,0,2*Math.PI);
        context.fillStyle = fillColor;
        context.fill();
        context.stroke();
    }

    getImage() {
        return this.canvas.toBuffer('image/png');
    }
}