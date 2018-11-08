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
        cc.log('create lure');
    },
    onCollisionEnter: function(other, self) {

        if (other.node.group === 'snake' || other.node.group === 'othersnake') {
            cc.log('eat lure');
            let snakeScript=other.node.getComponent('Snake');
            if(snakeScript==null) return;
            //简单地先消失
            let event = new cc.Event.EventCustom('lure_eated', true);

            event.setUserData({
                lure: self.node.uuid,
                isMyself: other.node.getComponent('Snake').isMyself
            });
            this.node.dispatchEvent(event);
        }


    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});