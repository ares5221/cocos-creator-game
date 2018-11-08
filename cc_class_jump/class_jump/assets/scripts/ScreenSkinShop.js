// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var SkinMgr = require('SkinMgr');
var game_scene = require('game_scene');
var ScreenMgr = require('ScreenMgr');
var UtilsFB = require('UtilsFB');
var UtilsCommon = require('UtilsCommon');
var ScreenSkinShop = cc.Class({
    extends: cc.Component,

    properties: {
        skinItemPrefab: {
            default: null,
            type: cc.Prefab,
        },

        content: {
            default: null,
            type: cc.Node,
        },

        processBar: {
            default: null,
            type: cc.Node,
        },

        processTitle: {
            default: null,
            type: cc.Label,
        },
    },

    statics: {
        instance: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ScreenSkinShop.instance = this;
        this.skinItemPool = new cc.NodePool('SkinItem');
    },

    start () {
        let unlockCountArray = [0, 1, 2, 5];
        for (let i = 0; i < SkinMgr.instance.getSkinSpriteFrameCount(); i++) {
            let skinSpriteFrame = SkinMgr.instance.getSkinSpriteFrame(i);
            let skinItem = this.spawnSkinItem();
            skinItem.node.setParent(this.content);
            let choosed = i == game_scene.instance.currentSkinIndex;

            let unlockCount = 0;
            if (i < unlockCountArray.length) {
                unlockCount = unlockCountArray[i];
            } else {
                unlockCount = unlockCountArray[unlockCountArray.length - 1] + (i - unlockCountArray.length + 1) * 5;
            }
            skinItem.init(skinSpriteFrame, choosed, unlockCount);
        }

        this.updateLockState();
    },

    onEnable() {
        this.updateLockState();
    },

    onChoose: function(index) {
        game_scene.instance.onSkinChange(index);

        for (let i = 0; i < this.content.childrenCount; i++) {
            let skinItem = this.content.children[i].getComponent('SkinItem');
            if (i != index) {
                skinItem.onUnchoose();
            }
        }
    },

    spawnSkinItem: function() {
        let skinItemNode = null;
        if (this.skinItemPool.size() > 0) {
            skinItemNode = this.skinItemPool.get();
        } else {
            skinItemNode = cc.instantiate(this.skinItemPrefab);
        }

        return skinItemNode.getComponent('SkinItem');
    },

    despawnSkinItem: function(item) {
        this.skinItemPool.put(item.node);
    },

    onBtnClickHome: function() {
        ScreenMgr.instance.showScreen('ScreenHome');
        ScreenMgr.instance.closeScreen('ScreenSkinShop');
    },

    onBtnClickInvite() {
        var imageBase64 = UtilsCommon.getScreenshotBase64(UtilsCommon.getCameraMain());
        UtilsFB.chooseAsync(imageBase64, ['NEW_CONTEXT_ONLY'])
        .then(function() {
            SkinMgr.instance.incrementInvitedCount();
            this.updateLockState();
        }.bind(this))
        .catch(error =>{});
    },

    updateLockState() {
        let unlockCount = 0;
        let totalCount = this.content.childrenCount;
        for (let i = 0; i < this.content.childrenCount; i++) {
            let skinItem = this.content.children[i].getComponent('SkinItem');
            if (skinItem.updateLockState()) {
                unlockCount += 1;
            }
        }

        let processBarWidth = this.processBar.width;
        this.processBar.position = cc.v2(-processBarWidth + processBarWidth * unlockCount / totalCount, 0);
        this.processTitle.string = unlockCount + "/" + totalCount;
    },
});
