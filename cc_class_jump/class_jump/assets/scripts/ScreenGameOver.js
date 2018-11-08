// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import * as ConstValue from './ConstValue';

var ScreenMgr = require('ScreenMgr');
var UtilsCommon = require('UtilsCommon');
var UtilsFB = require('UtilsFB');
var game_scene = require('game_scene');
cc.Class({
    extends: cc.Component,

    properties: {
        titleNewScore: {
            default: null,
            type: cc.Node,
        },

        labelScore: {
            default: null,
            type: cc.Label,
        },

        labelScoreMax: {
            default: null,
            type: cc.Label,
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

    // update (dt) {},

    onEnable() {
        let score = game_scene.instance.score;
        let scoreMAx = UtilsFB.getSelfLeaderboardScore(ConstValue.LEADERBOARD_SOCRE_WORLD);
        
        this.titleNewScore.active = score > 0 && score > scoreMAx;
        scoreMAx = Math.max(scoreMAx, score);
        
        this.labelScore.string = "" + score;
        this.labelScoreMax.string = "Max Score: " + scoreMAx;

        this.screenLeaderboard.clearLeaderboard();
        UtilsFB.setLeaderboardAsync(ConstValue.LEADERBOARD_SOCRE_WORLD, this.score)
        .then(function() {
            this.screenLeaderboard.showLeaderboard(ConstValue.LEADERBOARD_SOCRE_WORLD);
        }.bind(this))
        .catch(error => {
            console.log("setleaderboardasync error: " + JSON.stringify(error));
        });
    },

    onBtnClickHome() {
        ScreenMgr.instance.showScreen('ScreenHome');
        this.node.active = false;
    },

    onBtnClickShare() {
        var imageBase64 = UtilsCommon.getScreenshotBase64(UtilsCommon.getCameraMain());
        UtilsFB.chooseAsync(imageBase64).catch(error =>{});
    },

    onBtnClickPlayAgain() {
        game_scene.instance.onGameStart(true, false);
    },

    onBtnClickContinue() {
        var imageBase64 = UtilsCommon.getScreenshotBase64(UtilsCommon.getCameraMain());
        UtilsFB.chooseAsync(imageBase64)
        .then(function() {
            game_scene.instance.onGameStart(true, true);
        })
        .catch(error => {});
    }
});
