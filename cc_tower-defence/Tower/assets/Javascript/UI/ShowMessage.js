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
        ShowLabel: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {

    },
    ShowMessage: function (message) {
        this.ShowLabel.string = message;
        var self = this;
        this.node.setPosition(0,100);
        var action = cc.moveBy(0.4,0,60);
        var action1 = cc.fadeTo(0.4,0);
        var delayTime = cc.delayTime(1);
        var seq = cc.sequence(delayTime,cc.callFunc(function () {
            self.node.runAction(action);
            self.node.runAction(action1);
            var s1 = cc.sequence(cc.delayTime(0.4),cc.callFunc(
                function () {
                    self.parent.removeChild(this.node);
                }
            ))
        }));
        this.node.runAction(seq)
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
