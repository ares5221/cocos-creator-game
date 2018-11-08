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
    },

    // use this for initialization
    onLoad: function() {

    },
    destroy: function(isRetain) {
            let self=this;
            let finished = cc.callFunc(function(target, ind) {
                cc.log('translate');
                if (isRetain) {
                    //采用发事件在传
                    let event = new cc.Event.EventCustom('translate', true);
                    //将坐标传回去
                    event.setUserData(target.getPosition());
                    target.dispatchEvent(event);
                }
                target.destroy();

            }, this, 0);
            this.node.runAction(cc.sequence(cc.scaleTo(0.5, 0.1), finished));
        }
        // called every frame, uncomment this function to activate update callback
        // update: function (dt) {

    // },
});