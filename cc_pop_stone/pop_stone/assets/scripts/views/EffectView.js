import * as ConstValue from "../models/ConstValue";

var EffectView = cc.Class({
    extends: cc.Component,

    properties: {
        effectSelectedPrefab: {
            default: null,
            type: cc.Prefab,
        },

        effectColorPrefab: {
            default: null,
            type: cc.Prefab,   
        },

        effectColorlessPrefab: {
            default: null,
            type: cc.Prefab,
        },

        effectColorlessChangePrefab: {
            default: null,
            type: cc.Prefab,
        },

        effectExplodPrefabs: {
            default: [],
            type: [cc.Prefab],
        },

        effectExplodColor: {
            default: null,
            type: cc.Prefab,
        },

        effectBrush: {
            default: null,
            type: cc.Prefab,
        },

        effectHammer: {
            default: null,
            type: cc.Prefab,
        },
    },

    statics: {
        instance: null,
    },

    onLoad: function() {
        EffectView.instance = this;

        this.effectLoopMap = {};
        this.effectNormalMap = {};

        this.initEffectLoop(ConstValue.EFFECT_COLOR, this.effectColorPrefab);
        this.initEffectLoop(ConstValue.EFFECT_COLORLESS, this.effectColorlessPrefab);
        this.initEffectNormal(ConstValue.EFFECT_COLORLESS_CHANGE, this.effectColorlessChangePrefab);
        this.initEffectLoop(ConstValue.EFFECT_SELECTED, this.effectSelectedPrefab);

        this.initEffectExplod();
        this.initEffectNormal(ConstValue.EFFECT_EXPLOD_COLOR, this.effectExplodColor);
        this.initEffectNormal(ConstValue.EFFECT_BRUSH, this.effectBrush);
        this.initEffectNormal(ConstValue.EFFECT_HAMMER, this.effectHammer);
    },

    initEffectExplod: function() {
        this.effectExplodArray = [];
        let effectExplodParent = this.generateEffectParent("EffectExplod");
        for (let i = 0; i < this.effectExplodPrefabs.length; i++) {
            let effectExplodName ="EffectExplod_" + i;
            
            let effect = {};
            effect.effectPrefab = this.effectExplodPrefabs[i];
            effect.effectParent = effectExplodParent;
            effect.prefabPool = new cc.NodePool(effectExplodName);
            this.effectExplodArray.push(effect);
        }
    },

    initEffectNormal: function(effectName, effectPrefab) {
        let effect = {};
        effect.effectPrefab = effectPrefab;

        effect.effectParent = this.generateEffectParent(effectName);

        effect.prefabPool = new cc.NodePool(effectName);
        this.effectNormalMap[effectName] = effect;
    },

    initEffectLoop: function(effectName, effectPrefab) {
        let effect = {};
        effect.effectPrefab = effectPrefab;

        effect.effectParent = new cc.Node(effectName);
        effect.effectParent.setParent(this.node);
        effect.effectParent.position = cc.v2(0, 0);

        effect.prefabPool = new cc.NodePool(effectName);
        effect.playing = false;
        this.effectLoopMap[effectName] = effect;
    },

    generateEffectParent(effectName) {
        let effectParent = new cc.Node(effectName);
        effectParent.setParent(this.node);
        effectParent.position = cc.v2(0, 0);
        return effectParent;
    },

    playEffectNormal: function(effectName, position) {
        let effectNode = null;
        if (effectName in this.effectNormalMap) {
            let effect = this.effectNormalMap[effectName];
            if (effect.prefabPool.size() > 0) {
                effectNode = effect.prefabPool.get();
            } else {
                effectNode = cc.instantiate(effect.effectPrefab);
                effectNode.getComponent(cc.Animation).on('finished', function(type, state){
                    effect.prefabPool.put(effectNode);
                }, this);
            }

            effectNode.setParent(effect.effectParent);
            effectNode.position = position;
            effectNode.getComponent(cc.Animation).play();
        }

        return effectNode;
    },

    playEffectExplod: function(index, position) {
        if (index < this.effectExplodArray.length) {
            let effect = this.effectExplodArray[index];
            let effectNode = null;
            if (effect.prefabPool.size() > 0) {
                effectNode = effect.prefabPool.get();
            } else {
                effectNode = cc.instantiate(effect.effectPrefab);
                effectNode.getComponent(cc.Animation).on('finished', function(type, state){
                    effect.prefabPool.put(effectNode);
                }, this);
            }

            effectNode.setParent(effect.effectParent);
            effectNode.position = position;
            effectNode.getComponent(cc.Animation).play();
        }
    },

    spawnEffectLoop: function(effectName) {
        let effectNode = null;
        if (effectName in this.effectLoopMap) {
            let effect = this.effectLoopMap[effectName];
            if (effect.prefabPool.size() > 0) {
                effectNode = effect.prefabPool.get();
            } else {
                effectNode = cc.instantiate(effect.effectPrefab);
            }

            effectNode.setParent(effect.effectParent);
        } 

        return effectNode;
    },

    despawnEffectLoop: function(effectName, effectNode) {
        if (effectName in this.effectLoopMap) {
            let effect = this.effectLoopMap[effectName];
            effect.prefabPool.put(effectNode);
        }
    },

    playEffectLoop: function(effectName, positionArray) {
        if (positionArray.length > 0 && effectName in this.effectLoopMap) {
            let effect = this.effectLoopMap[effectName];
            for (let i = 0; i < positionArray.length; i++) {
                let effectNode = this.spawnEffectLoop(effectName);
                effectNode.position = positionArray[i];
                effectNode.getComponent(cc.Animation).play();
            }

            effect.playing = true;
        }
    },

    stopEffectLoop: function(effectName) {
        if (effectName in this.effectLoopMap) {
            let effect = this.effectLoopMap[effectName];
            for (let i = effect.effectParent.childrenCount - 1; i >= 0; i--) {
                let effectNode = effect.effectParent.children[i];
                effectNode.getComponent(cc.Animation).stop();
                effect.prefabPool.put(effectNode);
            }

            effect.playing = false;
        }
    },
});
