cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _status:null,
    },

    // use this for initialization
    start: function () {
        this._status = cc.find('Canvas/status');

        this.red = new cc.Color(205,0,0);
        this.green = new cc.Color(0,205,0);
        this.yellow = new cc.Color(255,200,0);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var delay = this._status.getChildByName('delay');
        if(cc.vv.net.delayMS != null){
            delay.getComponent(cc.Label).string = cc.vv.net.delayMS + 'ms';
            if(cc.vv.net.delayMS > 800){
                delay.color = this.red;
            }
            else if(cc.vv.net.delayMS > 300){
                delay.color = this.yellow;
            }
            else{
                delay.color = this.green;
            }
        }
        else{
            delay.getComponent(cc.Label).string = 'N/A';
            delay.color = this.red;
        }
        
        var power = this._status.getChildByName('power');
        power.scaleX = cc.vv.anysdkMgr.getBatteryPercent();
    },
});
