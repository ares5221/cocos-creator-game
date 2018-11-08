

cc.Class({
    extends: cc.Component,

    properties: {
        gridView: {
            default: null,
            type: require('GridView'),
        },
    },

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },

    onTouchStart: function(event) {
        let touches = event.getTouches();
        let touchPosition = touches[0].getLocation();
        this.gridView.onTouchStart(touchPosition);
    },

    onTouchEnd: function(event) {
        let touches = event.getTouches();
        let touchPosition = touches[0].getLocation();
        this.gridView.onTouchEnd(touchPosition);
    }
});
