// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

import * as ConstValue from "../models/ConstValue";

cc.Class({
    extends: require('DialogView'),

    properties: {
        leaderboardView: {
            default: null,
            type: require("LeaderboardView"),
        }
    },

    onEnterBegin(args) {
        this.leaderboardView.showLeaderboard(ConstValue.LEADERBOARD_SCORE_WORLD);
    },
});
