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
        animation: {
            default: null,
            type: cc.Animation,
        },

        scoreLabel: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad: function() {
        this.animation.on('finished', this.onPlayFinished, this);
    },

    init: function(mgr) {
        this.mgr = mgr;
    },

    play: function() {
        this.animation.play('score_pop');
    },

    setScore: function(score) {
        this.scoreLabel.string = "+" + score;
    },

    onPlayFinished: function(type, state) {
        this.mgr.despawnScoreFX(this);
    },
});
