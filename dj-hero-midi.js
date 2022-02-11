const readline = require('readline');
const MidiNode = require("./lib/MidiNode");
const Manager = require("./lib/Manager");
const DeviceDJHeroPS = require("./lib/DeviceDJHeroPS");
const DeviceDJHeroXbox = require("./lib/DeviceDJHeroXbox");
const yargs = require('yargs');
const HID = require('node-hid');

const argv = yargs
    .option("midiOutputName", {
        alias: "o",
        describe: "A name part of the Midi Output",
        type: 'string',
    })
    .option("defaultMidiChannel", {
        alias: "c",
        describe: "Default Midi Channel (0-15). Default : 0",
        type:'number'})
    .argv;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let midiNode = new MidiNode();
midiNode.scanOutput();

if (typeof argv.midiOutputName == "string") {
    midiNode.openFromName(midiOutName);
    start();
}
else {
    rl.question("=> Choose MIDI Output (default: " + midiNode.DEFAULT_MIDI_INDEX + ") : ", paramMidiIndex => {
        if (paramMidiIndex == null || paramMidiIndex == "" || parseInt(paramMidiIndex) > (midiNode.nbMidiDevices - 1)) {
            rl.question("=> Bad index for MIDI Output", process.exit);
        }
        midiNode.openFromIndex(parseInt(paramMidiIndex));
        start();
    });
}

function start() {
    let defaultChannel = 0;
    if (typeof argv.defaultMidiChannel == "number") {
        defaultChannel = argv.defaultMidiChannel;
    }
    let manager = new Manager(midiNode, defaultChannel);
/*
    //automatic detection
    let devices = HID.devices();
    let oneConnected = false;
    for (let device of devices) {
        if (device.vendorId == DeviceDJHeroPS.VENDOR_ID && device.productId == DeviceDJHeroPS.PRODUCT_ID) {
            let deviceDJHeroPS = new DeviceDJHeroPS(manager);
            deviceDJHeroPS.init();
            oneConnected = true;
        }
        if (device.vendorId == DeviceDJHeroXbox.VENDOR_ID && device.productId == DeviceDJHeroXbox.PRODUCT_ID) {

        }
    }*/
    let deviceDJHeroXbox = new DeviceDJHeroXbox(manager);
    deviceDJHeroXbox.init();
 /*   oneConnected = true;
    if (!oneConnected) {
        console.log("No DJ Hero detected :(");
    }*/
}