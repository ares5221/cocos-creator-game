cc.Class({
    extends: cc.Component,

    properties: {
        WinLabel: {
            default: null,
            type: cc.Label
        },
        Buttons: {
            default: null,
            type: cc.Node
        }
    },


    onLoad: function () {
        var action = cc.moveTo(0.4,this.WinLabel.node.getPositionX(),300);
        this.WinLabel.node.runAction(action);
        var action2 = cc.moveTo(0.4,this.Buttons.getPositionX(),0);
        this.Buttons.runAction(action2);
    },
    ButtonClick: function (event,coutomData) {
        cc.log('customData=' + coutomData);
    }
});
