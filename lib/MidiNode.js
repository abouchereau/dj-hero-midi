const Utils = require("./Utils");
const midi = require('midi');
const NanoTimer = require('nanotimer');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

module.exports = class MidiNode {
    static get NOTE_OFF() {return 8;}
    static get NOTE_ON() {return 9;}
    static get CC() {return 11;}
    static get PC() {return 12;}

    MIDI_MSG_GAP = "3500u";//cf NanoTimer /

    DEFAULT_MIDI_INDEX = 0;
    midiOutIndex = 0;
    nbMidiDevices = 0;
    midiOutput = null;
    midiCmdStack = [];
    stackIsEmpty = true;
    timer = null;
    lastCmd = null;
    devices = [];


    constructor() {
        this.timer = new NanoTimer();
        this.timer.setInterval(() => {
            if (!this.stackIsEmpty) {
                let midiCmd = this.midiCmdStack.shift();
                this.midiOutput.send(midiCmd);
                console.log(midiCmd);
                if (this.midiCmdStack.length == 0) {
                    this.stackIsEmpty = true;
                }
            }
        }, '', this.MIDI_MSG_GAP);

    }

    scanOutput() {
        this.midiOutput = new midi.Output();
        this.nbMidiDevices = this.midiOutput.getPortCount();
        if (this.nbMidiDevices == 0) {
            rl.question("No MIDI Output found", a => {
                process.exit();
            });
        }
        for(let i=0;i<this.nbMidiDevices;i++) {
            this.devices[i] = this.midiOutput.getPortName(i);
        }
    }

    openFromIndex(index) {
        this.midiOutIndex = index;
        this.openOutput();
    }

    openFromName(namePart) {
        let found = false;
        for(let i in this.devices) {
            if (this.devices[i].indexOf(namePart)>-1) {
                this.midiOutIndex = parseInt(i);
                found = true;
                break;
            }
        }
        if (found) {
            this.openOutput();
        }
    }

    openOutput() {
        this.midiOutput.openPort(this.midiOutIndex);
        console.log("Open MIDI Output : "+this.midiOutput.getPortName(this.midiOutIndex));
    }

    send(cmd) {
        this.midiCmdStack.push(cmd);
        this.stackIsEmpty = false;
        this.lastCmd = Utils.cloneArray(cmd);
    }

}
