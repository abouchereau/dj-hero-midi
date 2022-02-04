const readline = require('readline');
const MidiNode = require("./lib/MidiNode");
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

if (typeof argv.midiOutputName == "string") {
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

function start(midiOutName) {
    midiNode.openFromName(midiOutName);
    let deviceDJHero = new DeviceDJHeroPS(volca);
    deviceDJHero.init();
    deviceArcadeJoystick.init();
    let midiPlayer = new MidiPlayer(volca);
    let tryNextMidiDevice = true;
    while(tryNextMidiDevice) {
        let midiInput = new MidiInput(volca);
        tryNextMidiDevice = midiInput.openNextDevice();
    }
    //
}