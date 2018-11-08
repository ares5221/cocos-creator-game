// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var screenSkinShop = require('ScreenSkinShop');
var SkinMgr = require('SkinMgr');
cc.Class({
    extends: cc.Component,

    properties: {
        skin: {
            default: null,
            type: cc.Sprite,
        },

        spriteChoose: {
            default: null,
            type: cc.Sprite,
        },

        spriteFrameChoose: {
            default: null,
            type: cc.SpriteFrame,
        },

        spriteFrameUnchoose: {
            default: null,
            type: cc.SpriteFrame,
        },

        labelInviteCount: {
            default: null,
            type: cc.Label,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on('click', this.onBtnClick, this);
        this.unlockCount = 0;
        this.unlocked = true;
    },

    start () {

    },

    // update (dt) {},
    init: function(skinSpriteFrame, choosed, unlockCount) {
        this.skin.spriteFrame = skinSpriteFrame;
        this.spriteChoose.spriteFrame = choosed ? this.spriteFrameChoose : this.spriteFrameUnchoose;
        this.unlockCount = unlockCount;
    },

    onBtnClick: function() {
        if (this.unlocked) {
            this.onChoose();
        } else {
            screenSkinShop.instance.onBtnClickInvite();
        }
    },

    onChoose: function() {
        this.spriteChoose.spriteFrame = this.spriteFrameChoose;
        screenSkinShop.instance.onChoose(this.node.getSiblingIndex());
    },

    onUnchoose: function() {
        this.spriteChoose.spriteFrame = this.spriteFrameUnchoose;
    },

    updateLockState() {
        let invitedCount = SkinMgr.instance.getInvitedCount()

        if (invitedCount >= this.unlockCount) {
            this.unlocked = true;
            this.labelInviteCount.node.active = false;
        } else {
            this.unlocked = false;
            this.labelInviteCount.node.active = true;
            this.labelInviteCount.string = invitedCount + "/" + this.unlockCount;
        }

        return this.unlocked;
    },
});
