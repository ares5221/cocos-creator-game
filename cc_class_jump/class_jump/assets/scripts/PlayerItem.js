// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var UtilsFB = require("UtilsFB");
var UtilsCommon = require("UtilsCommon");
var game_scene = require('game_scene');
var ScreenMgr = require('ScreenMgr');
cc.Class({
    extends: cc.Component,

    properties: {
        rank: {
            default: null,
            type: cc.Label,
        },
        portrait: {
            default: null,
            type: cc.Sprite,
        },
        playerName: {
            default: null,
            type: cc.Label,
        },
        score: {
            default: null,
            type: cc.Label,
        },

        btnPlay: {
            default: null,
            type: cc.Node,
        },

        btnPlayLabel: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad: function() {
        this.node.on('click', this.onBtnClick, this);
        this.defaultPortraitSprite = this.portrait.spriteFrame;
    },

    onBtnClick: function() {
        var imageBase64 = UtilsCommon.getScreenshotBase64(UtilsCommon.getCameraMain());
        if (this.playerData.isSelf) {
            UtilsFB.chooseAsync(imageBase64).catch(error =>{});
        } else {
            UtilsFB.invitePlayerAsync(this.playerData.id, imageBase64)
            .then(function() {
                this.playGame();   
            }.bind(this))
            .catch(function(error) {
                this.playGame();
            }.bind(this));
        }
    },

    playGame: function() {
        ScreenMgr.instance.closeScreen('ScreenHomeLeaderboard');
        ScreenMgr.instance.closeScreen('ScreenGameOver');
        game_scene.instance.onGameStart(true, false);
    },

    updatePlayerInfo: function(playerData) {
        // console.log("update player info: " + JSON.stringify(playerData));
        this.playerData = playerData;
        this.rank.string = playerData.rank;
        this.playerName.string = playerData.playerName;
        this.score.string = playerData.score;

        // this.portrait.spriteFrame = this.defaultPortraitSprite;
        UtilsFB.getPlayerPhotoAsync(playerData)
        .then(function() {
            if (playerData.photoTexture != null) {
                this.portrait.spriteFrame = new cc.SpriteFrame();
                this.portrait.spriteFrame.setTexture(playerData.photoTexture);
            }
        }.bind(this))
        .catch(error => {});

        this.btnPlayLabel.string = this.playerData.isSelf ? 'Share' : 'Play';
    },
});
