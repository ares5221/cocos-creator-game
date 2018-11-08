import CellModel from "../models/CellModel";
import * as ConstValue from "../models/ConstValue";

var EffectView = require('EffectView');
cc.Class({
    extends: cc.Component,

    properties: {
        baseTypeSprites: {
            default: [],
            type: [cc.SpriteFrame],
        },

        colorlessSprites: {
            default: [],
            type: [cc.SpriteFrame],
        },

        featureTypeColorSprite: {
            default: null,
            type: cc.SpriteFrame,
        },

        featureTypeClearSprite: {
            default: null,
            type: cc.SpriteFrame,
        },

        baseTypeSprite: {
            default: null,
            type: cc.Sprite,
        },
    },

    initWithCellModel: function(cellModel) {
        this.cellModel = cellModel;

        this.effectName = null;
        this.effectNode = null;

        let spriteFrame = null;
        if (this.cellModel.featureType == ConstValue.FEATURE_TYPE.Color) {
            spriteFrame = this.featureTypeColorSprite;
            this.effectName = ConstValue.EFFECT_COLOR;
        } else if (this.cellModel.featureType == ConstValue.FEATURE_TYPE.Colorless) {
            spriteFrame = this.colorlessSprites[this.cellModel.baseType - 1];
            this.effectName = ConstValue.EFFECT_COLORLESS;
        } else if (this.cellModel.featureType == ConstValue.FEATURE_TYPE.Clear) {
            spriteFrame = this.featureTypeClearSprite;
        } else {
            spriteFrame = this.baseTypeSprites[this.cellModel.baseType - 1];
        }

        this.baseTypeSprite.spriteFrame = spriteFrame;
        this.addEffect();
    },

    changeBaseType: function(baseType) {
        if (this.cellModel.featureType == ConstValue.FEATURE_TYPE.Colorless) {
            EffectView.instance.playEffectNormal(ConstValue.EFFECT_COLORLESS_CHANGE, this.node.position);
            this.baseTypeSprite.spriteFrame = this.colorlessSprites[this.cellModel.baseType - 1];
        } 
    },

    addEffect: function() {
        if (this.effectName) {
            this.effectNode = EffectView.instance.spawnEffectLoop(this.effectName);
            this.effectNode.position = this.node.position;
            this.effectNode.getComponent(cc.Animation).play();
        }
    },

    unuse: function() {
        this.resetEffect();
    },

    resetEffect: function() {
        if (this.effectNode != null) {
            EffectView.instance.despawnEffectLoop(this.effectName, this.effectNode);
            this.effectName = null;
            this.effectNode = null;
        }
    },

    runActionMove: function(action) {
        this.node.runAction(action);
        if (this.effectNode != null) {
            this.effectNode.runAction(action.clone());
        }
    },

    setScale: function(scale) {
        this.node.scale = scale;
        if (this.effectNode != null) {
            this.effectNode.scale = scale;
        }
    },

    setOpacity: function(opacity) {
        this.node.opacity = opacity;
        if (this.effectNode != null) {
            this.effectNode.opacity = opacity;
        }
    },

    setPosition: function(position) {
        this.node.position = position;
        if (this.effectNode != null) {
            this.effectNode.position = position;
        }
    }
});
