const xbox = require('node-xboxdrv');


module.exports =  class DeviceDJHeroXbox {

    static get VENDOR_ID() {
        return 1118;
    }

    static get PRODUCT_ID() {
        return 657;
    }

    name = "DJ Hero Xbox";
    controller = null;

    constructor() {
        console.log("YO");
        this.controller = new xbox(this.constructor.VENDOR_ID.toString(16), this.constructor.PRODUCT_ID.toString(16), {});
        console.log("XBOX", this.controller);
    }

//X1:     0 Y1:     0  X2:-11735 Y2:-32768  du:0 dd:0 dl:0 dr:0  back:0 guide:0 start:0  TL:0 TR:0  A:0 B:0 X:0 Y:0  LB:0 RB:0  LT:  0 RT:  0
    init() {
          this.controller.on('leftY',(a)=>{console.log('leftY',a)});
          this.controller.on('rightX',(a)=>{console.log('rightX',a)});
          this.controller.on('rightY',(a)=>{console.log('rightY',a)});
          this.controller.on('leftTrigger',(a)=>{console.log('leftTrigger',a)});
          this.controller.on('rightTrigger',(a)=>{console.log('rightTrigger',a)});
          this.controller.on('dUp',(a)=>{console.log('dUp',a)});
          this.controller.on('dDown',(a)=>{console.log('dDown',a)});
          this.controller.on('dLeft',(a)=>{console.log('dLeft',a)});
          this.controller.on('dRight',(a)=>{console.log('dRight',a)});
          this.controller.on('back',(a)=>{console.log('back',a)});
          this.controller.on('home',(a)=>{console.log('home',a)});
          this.controller.on('start',(a)=>{console.log('start',a)});
          this.controller.on('a',(a)=>{console.log('a',a)});
          this.controller.on('b',(a)=>{console.log('b',a)});
          this.controller.on('x',(a)=>{console.log('x',a)});
          this.controller.on('y',(a)=>{console.log('y',a)});
          this.controller.on('leftBumper',(a)=>{console.log('leftBumper',a)});
          this.controller.on('rightBumper',(a)=>{console.log('rightBumper',a)});
        this.controller.on('leftX',(a)=>{console.log('leftX',a)});
    }

}
