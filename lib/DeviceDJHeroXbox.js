const DeviceDJHero = require("./DeviceDJHero");

module.exports =  class DeviceDJHeroPS extends DeviceDJHero {

    static get VENDOR_ID() {return 999;}
    static get PRODUCT_ID() {return 888;}

    byteButtons = 0;
    byteStart = 1;
    bytePad = 2;
    byteDisc = 6;
    byteKnob = 20;
    byteFader1 = 21;
    byteFader1 = 22;
    name = "DJ Hero Xbox";

}
