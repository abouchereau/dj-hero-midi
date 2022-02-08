const InputDevice = require("./InputDevice");
const Utils = require("./Utils");

module.exports =  class DeviceDJHero extends InputDevice {//abstract

    lastFader = 0;
    discValues = {};
    discKeys = {
        "BLUE": "SQUARE",
        "GREEN": "CROSS",
        "RED": "CIRCLE"
    };
    DISC_FACTOR = 0.5;
    knob = 1;
    manager = null;

    byteButtons = null;
    byteStart = null;
    bytePad = null;
    byteDisc = null;
    byteKnob = null;
    byteFader1 = null;
    byteFader2 = null;

    constructor(a) {
        super();
        this.manager = a;
        this.mappingWatchBytes = [this.byteButtons, this.byteStart, this.bytePad, this.byteDisc, this.byteKnob, this.byteFader1];
        console.log(this.constructor.name, this.mappingWatchBytes );
        this.keyPressed = {
            "HOME": false,
            "START": false,
            "SELECT": false,
            "UP": false,
            "DOWN": false,
            "LEFT": false,
            "RIGHT": false,
            "SQUARE": false,//==bleu
            "TRIANGLE": false,// == gros bouton
            "CIRCLE": false,//==rouge
            "CROSS": false,//==vert
        };
    }

    mapping(key, value) {
        //boutons
        let newKeyPressed = {};
        if (key == this.byteButtons) {
            newKeyPressed["SQUARE"] = false;
            newKeyPressed["CROSS"] = false;
            newKeyPressed["CIRCLE"] = false;
            newKeyPressed["TRIANGLE"] = false;
            if ((value >> 0 & 0x1) == 1) {
                newKeyPressed["SQUARE"] = true;
            }
            if ((value >> 1 & 0x1) == 1) {
                newKeyPressed["CROSS"] = true;
            }
            if ((value >> 2 & 0x1) == 1) {
                newKeyPressed["CIRCLE"] = true;
            }
            if ((value >> 3 & 0x1) == 1) {
                newKeyPressed["TRIANGLE"] = true;
            }
        }
        if (key == this.byteStart) {
            newKeyPressed["START"] = false;
            newKeyPressed["SELECT"] = false;
            newKeyPressed["HOME"] = false;
            if ((value >> 0 & 0x1) == 1) {
                newKeyPressed["SELECT"] = true;
            }
            if ((value >> 1 & 0x1) == 1) {
                newKeyPressed["START"] = true;
            }
            if ((value >> 4 & 0x1) == 1) {
                newKeyPressed["HOME"] = true;
            }
        }
        if (key == this.bytePad) {
            newKeyPressed["UP"] = false;
            newKeyPressed["DOWN"] = false;
            newKeyPressed["LEFT"] = false;
            newKeyPressed["RIGHT"] = false;
            switch (value) {
                case 15: break;
                case 0: newKeyPressed["UP"] = true; break
                case 4: newKeyPressed["DOWN"] = true; break
                case 6: newKeyPressed["LEFT"] = true; break
                case 2: newKeyPressed["RIGHT"] = true; break
                case 7: newKeyPressed["UP"] = true; newKeyPressed["LEFT"] = true; break
                case 1: newKeyPressed["UP"] = true; newKeyPressed["RIGHT"] = true; break
                case 5: newKeyPressed["DOWN"] = true; newKeyPressed["LEFT"] = true; break
                case 3: newKeyPressed["DOWN"] = true; newKeyPressed["RIGHT"] = true; break
            }
        }
        for (let key in newKeyPressed) {
            if (newKeyPressed[key] != this.keyPressed[key]) {
                this.keyPressed[key] = newKeyPressed[key];
                if (this.keyPressed[key]) {
                    this.onPress(key);
                }
                else {
                    this.onRelease(key);
                }
            }
        }
        //analogiques
        if (key == this.byteFader1) {
            this.onFaderChange(this.tab[this.byteFader2]*256+value);
        }
        if (key == this.byteDisc) {
            this.onDiscChange(-1*(128-value));
        }
        if (key == this.byteKnob) {
            this.onKnobChange(value);
        }
    }

    onPress(a) {
        super.onPress(a);
        if (["TRIANGLE","CROSS","SQUARE","CIRCLE","START","SELECT"].includes(a)) {
            this._manageCommands(a+"_PRESS");
        }
        else if (a == "HOME") {
            this._manageCommands("HOME"+this.knob+"_PRESS");

        }
    }

    _manageCommands(key) {
        if (this.manager.curMapping[key] != null) {
            for (let cmd of this.manager.curMapping[key]) {
                this.manager.sendMidi(cmd);
            }
        }
    }

    onRelease(a) {
        super.onRelease(a);
        if (["TRIANGLE","CROSS","SQUARE","CIRCLE","START","SELECT"].includes(a)) {
            this._manageCommands(a+"_RELEASE");
        }
        else if (a == "HOME") {
            this._manageCommands("HOME"+this.knob+"_RELEASE");

        }
    }

    onFaderChange(a) {
        if(Math.abs(a-this.lastFader)<9) {//éviter les "tremblements" de valeurs du fader
            return;
        }
        this.lastFader = a;
        for (let cmd of this.manager.curMapping["FADER"]) {
            let midiValue = this.computeMidiValueFader(a, cmd["param2min"], cmd["param2max"]);
            let cmdOut = {"message":cmd.message, "param1": cmd.param1, "param2": midiValue};
            if(cmd["channel"] != null) {
                cmdOut["channel"] = cmd["channel"];
            }
            this.manager.sendMidi(cmdOut);
        }
    }

    onDiscChange(a) {
        let hasKeyPressed = false;
        let settings = null;
        for (let btn of ["BLUE", "RED", "GREEN"]) {
            if (this.keyPressed[this.discKeys[btn]] && this.manager.curMapping["DISC_" + btn] != null) {
                hasKeyPressed = true;
                settings = this.manager.curMapping["DISC_" + btn];
            }
        }
        if (!hasKeyPressed) {
            settings = this.manager.curMapping["DISC_ONLY"];
        }
        if (settings != null) {
            for (let cmd of settings) {
                let channel = this.manager.currentMIDIChannel;
                if (cmd["channel"] != null) {
                    channel = cmd["channel"];
                }
                let midiValue = this.computeMidiValueDisc(a, channel, cmd.param1, cmd["param2min"], cmd["param2max"]);
                let cmdOut = {"message": cmd.message, "param1": cmd.param1, "param2": midiValue};
                this.manager.sendMidi(cmdOut);
            }
        }
    }

    computeMidiValueDisc(a, channel, param1, param2min, param2max) {
        let min = 0;
        let max = 127;
        if (param2min != null && param2min > 0) {
            min = param2min;
        }
        if (param2max != null && param2max <127) {
            max = param2max;
        }
        if (this.discValues[channel] == null) {
            this.discValues[channel] = {};
        }
        if (this.discValues[channel][param1] == null) {
            this.discValues[channel][param1] = Math.round((param2max-param2min)/2);
        }
        let gapFactor = (max - min)/127;
        this.discValues[channel][param1]  += a * this.DISC_FACTOR * gapFactor;
        if ( this.discValues[channel][param1] > max) {
            this.discValues[channel][param1]  = max;
        }
        if (this.discValues[channel][param1] < min) {
            this.discValues[channel][param1]  = min;
        }
        return Math.round(this.discValues[channel][param1]);
    }

    computeMidiValueFader(a, paramMin = null, paramMax = null) {
        let min = 0;
        let max = 127;
        if (paramMin!= null) {
            min = paramMin;
        }
        if (paramMax != null) {
            max = paramMax;
        }
        return Math.floor(Utils.transposeValue(a/8, 0, 127, min, max));
    }

    onKnobChange(a) {//values = 0,1,2,3
        this.knob = a+1;
    }
}
