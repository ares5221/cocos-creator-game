import * as ConstValue from "../models/ConstValue";

var ScreenMgr = require("ScreenMgr");

cc.Class({
    extends: require('ScreenView'),

    properties: {
        labelScore: {
            default: null,
            type: cc.Label,
        },
        labelDiamond: {
            default: null,
            type: cc.Label,
        },
        leaderboardView: {
            default: null,
            type: require("LeaderboardView"),
        }
    },

    onEnterBegin(args) {
        this.labelScore.string = args.score.toString();
        this.labelDiamond.string = "+" + args.diamond;
        this.leaderboardView.showLeaderboard(ConstValue.LEADERBOARD_SCORE_WORLD);
    },

    onBtnClickClose() {
        ScreenMgr.instance.gotoScreen("ScreenHome");
    },
});
