const fs = require('fs');

module.exports = class Manager {

    currentMIDIChannel = 0;
    mappings = [];
    mappingKey = 0;
    midiNode = null;

    constructor(a, b) {
        this.midiNode = a;
        this.currentMIDIChannel = b;
        this.loadMappings();
    }

    get curMapping() {
        return this.mappings[this.mappingKey];
    }

    //Json object from mappings.json to midi message
    sendMidi(cmd) {
        let channel = this.currentMIDIChannel;
        if (cmd["channel"] != null) {
            channel = cmd["channel"];
        }
        this.midiNode.send([cmd.message * 16 + channel, cmd.param1, cmd.param2]);
    }

    loadMappings() {
        try {
            this.mappings = JSON.parse(fs.readFileSync(__dirname+'/../mappings.json', 'utf8'));
        } catch (err) {
            console.error(err);
            process.exit();
        }
    }

}