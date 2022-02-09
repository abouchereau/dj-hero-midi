const DeviceDJHero = require("./DeviceDJHero");


module.exports =  class DeviceDJHeroPS extends DeviceDJHero {

    static get VENDOR_ID() {return 4794;}
    static get PRODUCT_ID() {return 320;}


    constructor(a) {
        super(a);
        this.byteButtons = 0;
        this.byteStart = 1;
        this.bytePad = 2;
        this.byteDisc = 6;
        this.byteKnob = 20;
        this.byteFader1 = 21;
        this.byteFader2 = 22;
        this.name = "DJ Hero PS";
    }
}
