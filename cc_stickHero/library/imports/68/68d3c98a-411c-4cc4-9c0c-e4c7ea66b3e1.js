cc.Class({
    "extends": cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        this.anim = this.node.getComponent(cc.Animation);
        this.label = this.node.getComponent(cc.Label);
    },
    showPerfect: function showPerfect(count) {
        this.label.string = "Perfect x" + count;
        var fadeInAction = cc.fadeIn(0.1);
        var moveAction = cc.moveBy(1, cc.p(0, 0));
        var fadeOutAction = cc.fadeOut(0);
        var seq = cc.sequence(fadeInAction, moveAction, fadeOutAction);
        this.node.runAction(seq);
        //has bug.  web will 花屏...
        // this.anim.play("perfect_anim");
    },
    removeLabel: function removeLabel() {
        // this.node.x = -100;
        // this.node.y = -100;
        cc.log("removeLabel");
    },
    showLabel: function showLabel() {
        // this.node.x = cc.director.getWinSize().width/2;
        // this.node.y = cc.director.getWinSize().height/2;
        cc.log("showLabel");
    }
});