const readline = require('readline');
const MidiNode = require("./lib/MidiNode");
const Manager = require("./lib/Manager");
const DeviceDJHeroPS = require("./lib/DeviceDJHeroPS");
const yargs = require('yargs');

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
    .option("defaultSettingIndex", {
        alias: "s",
        describe: "Default Setting Index. Default : 0",
        type:'number'
    }).argv;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let midiNode = new MidiNode();
midiNode.scanOutput();

if (typeof argv.midiOutputName == "string") {
    midiNode.openFromName(midiOutName);
    start(argv.midiOutputName);
}
else {
    rl.question("=> Choose MIDI Output (default: " + midiNode.DEFAULT_MIDI_INDEX + ") : ", paramMidiIndex => {
        let midiOutIndex = midiNode.DEFAULT_MIDI_INDEX;
        if (paramMidiIndex == null || paramMidiIndex == "" || parseInt(paramMidiIndex) > (midiNode.nbMidiDevices - 1)) {
            rl.question("=> Bad index for MIDI Output", a => process.exit());
        }
        midiOutIndex = parseInt(paramMidiIndex);
        start(midiOutIndex);
    });
}

function start() {
    let defaultChannel = 0;
    if (typeof argv.defaultMidiChannel == "number") {
        defaultChannel = argv.defaultMidiChannel;
    }
    let manager = new Manager(defaultChannel);
    let deviceDJHero = new DeviceDJHeroPS(manager);
    deviceDJHero.init();
}