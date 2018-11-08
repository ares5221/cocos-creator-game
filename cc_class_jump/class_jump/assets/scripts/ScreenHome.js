// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var ScreenMgr = require('ScreenMgr');
var game_scene = require('game_scene');
cc.Class({
    extends: cc.Component,

    properties: {
        screenHomeLeaderboard: {
            default: null,
            type: cc.Node,
        },

        screenLeaderboard: {
            default: null,
            type: require('ScreenLeaderboard'),
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onEnable() {
        game_scene.instance.onGameStart(false, false);
    },

    // update (dt) {},

    onBtnClickPlay: function() {
        this.node.active = false;
        game_scene.instance.showLabelScore(true);
    },

    onBtnClickLeaderboard: function() {
        this.node.active = false;
        this.screenHomeLeaderboard.active = true;
    },

    onBtnClickLeaderboardClose: function() {
        this.screenHomeLeaderboard.active = false;
        this.node.active = true;
    },

    onBtnClickSkinShop: function() {
        ScreenMgr.instance.showScreen('ScreenSkinShop');
        ScreenMgr.instance.closeScreen('ScreenHome');
    },
});
