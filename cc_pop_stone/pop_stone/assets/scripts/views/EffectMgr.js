// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var EffectMgr = cc.Class({
    extends: cc.Component,

    properties: {
        effectPrefabs: {
            default: [],
            type: [cc.Prefab],
        },
    },

    statics: {
        instance: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        EffectMgr.instance = this;
        this.effectMap = {};

        for (let i = 0; i < this.effectPrefabs.length; i++) {
            this.initEffect(this.effectPrefabs[i]);
        }
    },

    playEffect: function(effectName, position) {
        let effectNode = null;
        if (effectName in this.effectMap) {
            let effect = this.effectMap[effectName];
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

    initEffect: function(effectPrefab) {
        let effectName = effectPrefab.name;
        let effect = {};
        effect.effectPrefab = effectPrefab;
        effect.effectParent = this.generateEffectParent(effectName);
        effect.prefabPool = new cc.NodePool(effectName);
        this.effectMap[effectName] = effect;
    },

    generateEffectParent(effectName) {
        let effectParent = new cc.Node(effectName);
        effectParent.setParent(this.node);
        effectParent.position = cc.v2(0, 0);
        return effectParent;
    },
});
