// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import * as LevelModel from "../models/LevelModel";
import * as ConstValue from "../models/ConstValue";

var ScreenMgr = require('ScreenMgr');
var UserDataMgr = require('UserDataMgr');

cc.Class({
    extends: require('ScreenView'),

    properties: {
        btnContinue: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad() {

    },

    start() {
        UserDataMgr.instance.node.on('data_load', this.onDataLoad, this);
    },

    onEnterBegin(args) {
        this.updateBtnContinue();
    },

    onBtnNew() {
        let levelInfo = LevelModel.generateLevelInfo(1);
        let args = {'levelInfo': levelInfo};
        ScreenMgr.instance.gotoScreen('ScreenGame', args);
    },

    onBtnClickContinue() {
        let levelInfoStr = UserDataMgr.instance.getDataString(ConstValue.DATA_LEVEL_INFO);
        if (levelInfoStr != "") {
            let levelInfo = LevelModel.generateLevelInfoFromJson(levelInfoStr);
            let args = {'levelInfo': levelInfo};
            ScreenMgr.instance.gotoScreen('ScreenGame', args);
        }
    },

    onBtnClickGift() {
        ScreenMgr.instance.showDialog("DialogDailyGift");
    },

    onBtnClickRank() {
        ScreenMgr.instance.showDialog("DialogLeaderboard");
    },

    onDataLoad() {
        this.updateBtnContinue();
    },

    updateBtnContinue() {
        let levelInfoStr = UserDataMgr.instance.getDataString(ConstValue.DATA_LEVEL_INFO);
        let spriteIndex = levelInfoStr == "" ? 0 : 1;
        this.btnContinue.getComponent("SpriteSwitch").switchSpriteTo(spriteIndex);
    },
});
