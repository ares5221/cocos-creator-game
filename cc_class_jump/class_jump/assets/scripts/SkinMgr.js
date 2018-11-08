// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var SkinMgr = cc.Class({
    extends: cc.Component,

    properties: {
        skinSpriteFrames: {
            default: [],
            type: [cc.SpriteFrame],
        },
    },

    statics: {
        instance: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        SkinMgr.instance = this;
        this.invitedCount = 0;
    },

    start() {
        if (typeof FBInstant != 'undefined') {
            FBInstant.player.getStatsAsync(['invitedCount'])
            .then(function(stats) {
                this.invitedCount = stats['invitedCount'];
                console.log("getStatsAsync success: " + JSON.stringify(stats) + " invitedCount: " + this.invitedCount);
            }.bind(this))
            .catch(function(error) {
                console.log("getStatsAsync error: " + JSON.stringify(error));
            });
        }
    },

    getSkinSpriteFrame: function(index) {
        return this.skinSpriteFrames[index];
    },

    getSkinSpriteFrameCount: function() {
        return this.skinSpriteFrames.length;
    },

    getInvitedCount() {
        return this.invitedCount;
    },

    incrementInvitedCount() {
        this.invitedCount += 1;

        if (typeof FBInstant != 'undefined') {
            FBInstant.player
            .incrementStatsAsync({
                invitedCount: 1,
            })
            .then(function(stats) {
                console.log("incrementStatsAsync success: " + JSON.stringify(stats));
                this.invitedCount = stats['invitedCount'];
            }.bind(this))
            .catch(function(error) {
                console.log("incrementStatsAsync error: " + JSON.stringify(error));
            });
        }
    },
});
