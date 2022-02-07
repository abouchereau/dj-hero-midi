const midi = require('midi');

// Set up a new input.
const output = new midi.Output();



let nbMidiDevices = output.getPortCount();
let devices = [];
for(let i=0;i<nbMidiDevices;i++) {
    devices[i] = output.getPortName(i);
}
output.openPort(0);

// Configure a callback.

// Create a virtual input port.
//output.openVirtualPort("Test Output");
let i = 0;
setInterval(()=>{
    let channel = 1;
    let param1 = 1;
    let param2 = i%128;
    let msg = [11 * 16 + channel, param1, param2];
    i++;
    console.log(msg);
    output.sendMessage(msg);
},100);

// A midi device "Test Input" is now available for other
// software to send messages to.

// ... receive MIDI messages ...

// Close the port when done.
//input.closePort();