// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var UserDataMgr = cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    statics: {
        instance: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        UserDataMgr.instance = this;
        this.userData = {};
        this.getDataFromFB();
    },

    start () {
    },

    setData(key, value) {
        this.userData[key] = value;
        this.node.emit('data_change', {'key': key});
    },

    getDataString(key) {
        if (key in this.userData) {
            return this.userData[key];
        }

        return "";
    },

    getDataNumber(key){
        if (key in this.userData) {
            return this.userData[key];
        }

        return 0;
    },

    incrementData(key, value) {
        this.setData(key, this.getDataNumber(key) + value);
    },

    decrementData(key, value) {
        this.setData(key, this.getDataNumber(key) - value);
    },

    getDataFromFB() {
        if (typeof FBInstant === 'undefined') {
            return;
        }

        FBInstant.player
        .getDataAsync(['data'])
        .then(function(data) {
            // console.log('[udm]Data is loaded: ' + JSON.stringify(data));
            if ('data' in data) {
                this.userData = data['data'];
            }
            this.node.emit('data_load');
        }.bind(this));
    },

    setDataToFB() {
        if (typeof FBInstant === 'undefined') {
            return;
        }

        // console.log("[udm]Set data: " + JSON.stringify(this.userData));
        FBInstant.player
        .setDataAsync({
            data: this.userData,
        })
        .then(function() {
            console.log('[udm]Data is set');
        });
    },
});
