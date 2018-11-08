var math;
var view;

cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Node,
        offset: cc.Vec2
    },

    // use this for initialization
    onLoad: function () {
        math = cc.math;
        view = cc.view;

        this._tracking = false;
        var targetTrans = this.target.getNodeToWorldTransform();
        this._prevPos = cc.v2(0, 0);
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        if (!this.target) {
            return;
        }
        var targetX = this.target.x,
            targetY = this.target.y,
            winW = cc.winSize.width,
            winH = cc.winSize.height,
            mapW = this.node.width,
            mapH = this.node.height;

        if (this._prevPos.x !== targetX || this._prevPos.y !== targetY) {
            var appx = this.node._anchorPoint.x * mapW;
            var appy = this.node._anchorPoint.y * mapH;

            var worldx = winW / 2 - (appx + targetX + this.offset.x);
            var worldy = winH / 2 - (appy + targetY + this.offset.y);

            if (worldx > 0) {
                worldx = 0;
            }
            if (winW - worldx > mapW) {
                worldx = winW - mapW;
            }
            if (worldy > 0) {
                worldy = 0;
            }
            if (winH - worldy > mapH) {
                worldy = winH - mapH;
            }
            var parentTrans = this.node.parent.getNodeToWorldTransformAR();
            this.node.x = worldx + appx - parentTrans.tx;
            this.node.y = worldy + appy - parentTrans.ty;

            this._prevPos.x = targetX;
            this._prevPos.y = targetY;
        }
    },
});
