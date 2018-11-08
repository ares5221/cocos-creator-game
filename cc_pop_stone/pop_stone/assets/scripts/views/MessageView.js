// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
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

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.getChildByName("BtnClose").on("click", this.onBtnClickClose, this);
    },

    onEnterBegin(args) {
        args = args || {};
        this.onCloseActionArray = [];
        if ('onClose' in args) {
            this.onCloseActionArray = args['onClose'];
        }

        if ('message' in args) {
            this.setMessage(args['message']);
        }
    },

    onExitBegin(args) {
        for (let i = 0; i < this.onCloseActionArray.length; i++) {
            this.onCloseActionArray[i]();
        }

        if (this.despawnAction) {
            this.despawnAction(this);
        }
    },

    setMessage(message) {
        this.node.getChildByName("Bg")
        .getChildByName("Message")
        .getComponent(cc.Label).string = message;
    },

    onBtnClickClose() {
        this.onExitBegin();
    },
});
