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

var UserDataMgr = require('UserDataMgr');
var ScreenMgr = require('ScreenMgr');

var ScreenGame = cc.Class({
    extends: require('ScreenView'),

    properties: {
        gridView: {
            default: null,
            type: require('GridView'),
        },

        dialogPause: {
            default: null,
            type: cc.Node,
        },

        btnBrush: {
            default: null,
            type: cc.Node,
        },

        btnLoop: {
            default: null,
            type: cc.Node,
        },

        btnHammer: {
            default: null,
            type: cc.Node,
        },

        labelDiamond: {
            default: null,
            type: cc.Node,
        },
    },

    statics: {
        instance: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ScreenGame.instance = this;
        this.btnBrush.getChildByName('Button').on("click", this.onBtnClickBrush, this);
        this.btnLoop.getChildByName('Button').on("click", this.onBtnClickLoop, this);
        this.btnHammer.getChildByName('Button').on("click", this.onBtnClickHammer, this);
        this.labelDiamond.getChildByName('Button').on("click", this.onBtnClickAddDiamond, this);
    },

    start () {
        UserDataMgr.instance.node.on('data_change', this.onDataChange, this);
    },

    onDataChange(event) {
        if (this.node.active) {
            let key = event.key;
            if (key == ConstValue.ITEM_BRUSH
                || key == ConstValue.ITEM_HAMMER
                || key == ConstValue.ITEM_SHUFFLE
                || key == ConstValue.ITEM_DIAMOND
            ) {
                this.updateItemInfo();
            }
        }
    },

    onEnterBegin(args) {
        this.gridView.initWithLevelInfo(args.levelInfo);
        this.updateItemInfo();
    },

    onExitBegin(args) {
        this.gridView.clearOnExit();
    },

    onBtnClickPause() {
        if (this.gridView.busying) {
            return;
        }

        this.cancelBtnBrush();
        this.cancelBtnHammer();

        this.dialogPause.active = true;
    },

    onBtnClickBrush() {
        if (this.gridView.busying) {
            return;
        }

        this.cancelBtnHammer();

        if (this.gridView.brushSelected) {
            this.cancelBtnBrush();
        } else {
            if (this.checkLeftItemCount(ConstValue.ITEM_BRUSH, ConstValue.PRICE_BRUSH)) {
                this.btnBrush.getChildByName('Button').getComponent('SpriteSwitch').switchSprite();
                this.gridView.brushSelected = !this.gridView.brushSelected;
            }
        }
    },

    cancelBtnBrush() {
        if (this.gridView.brushSelected) {
            this.gridView.brushSelected = false;
            this.btnBrush.getChildByName('Button').getComponent('SpriteSwitch').switchSprite();
        }
    },

    onBtnClickLoop() {
        if (this.gridView.busying) {
            return;
        }

        this.cancelBtnBrush();
        this.cancelBtnHammer();

        if (this.checkLeftItemCount(ConstValue.ITEM_SHUFFLE, ConstValue.PRICE_SHUFFLE)) {
            this.gridView.onShuffle();
        }
    },

    onBtnClickHammer() {
        if (this.gridView.busying) {
            return;
        }

        this.cancelBtnBrush();

        if (this.gridView.hammerSelected) {
            this.cancelBtnHammer();
        } else {
            if (this.checkLeftItemCount(ConstValue.ITEM_HAMMER, ConstValue.PRICE_HAMMER)) {
                this.btnHammer.getChildByName('Button').getComponent('SpriteSwitch').switchSprite();
                this.gridView.hammerSelected = !this.gridView.hammerSelected;
            }
        }
    },

    cancelBtnHammer() {
        if (this.gridView.hammerSelected) {
            this.gridView.hammerSelected = false;
            this.btnHammer.getChildByName('Button').getComponent('SpriteSwitch').switchSprite();
        }
    },

    //检车剩余道具数量是否够用
    checkLeftItemCount(itemName, itemPrice) {
        let itemCount = UserDataMgr.instance.getDataNumber(itemName);
        if (itemCount > 0) {
            return true;
        }

        let diamondCount = UserDataMgr.instance.getDataNumber(ConstValue.ITEM_DIAMOND);
        if (diamondCount >= itemPrice) {
            return true;
        }

        this.onBtnClickAddDiamond();

        return false;
    },

    onBtnClickAddDiamond() {
        if (this.gridView.busying) {
            return;
        }

        ScreenMgr.instance.showDialog('DialogGetDiamond');
    },

    updateItemInfo() {
        this.updateDiamond();
        this.updateItemButton(this.btnBrush, ConstValue.ITEM_BRUSH, ConstValue.PRICE_BRUSH);
        this.updateItemButton(this.btnLoop, ConstValue.ITEM_SHUFFLE, ConstValue.PRICE_SHUFFLE);
        this.updateItemButton(this.btnHammer, ConstValue.ITEM_HAMMER, ConstValue.PRICE_HAMMER);
    },

    updateDiamond() {
        this.labelDiamond.getComponentInChildren(cc.Label).string = UserDataMgr.instance.getDataNumber(ConstValue.ITEM_DIAMOND).toString();
    },

    updateItemButton(btnNode, itemName, itemPrice) {
        let itemCount = UserDataMgr.instance.getDataNumber(itemName);

        let spriteCount = btnNode.getChildByName("SpriteCount");
        let spriteDiamond = btnNode.getChildByName("SpriteDiamond");
        let labelCount = btnNode.getChildByName("Label");

        spriteCount.active = itemCount > 0;
        spriteDiamond.active = !(itemCount > 0);
        let labelString = "";
        if (itemCount > 0) {
            spriteCount.active = true;
            spriteDiamond.active = false;
            labelString = itemCount.toString();
        } else {
            spriteCount.active = false;
            spriteDiamond.active = true;
            labelString = itemPrice.toString();
        }

        labelCount.getComponent(cc.Label).string = labelString;
    }
});
