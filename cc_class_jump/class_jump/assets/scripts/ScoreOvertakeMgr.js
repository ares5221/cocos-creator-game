// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        scoreOvertakePrefab: {
            default: null,
            type: cc.Prefab,
        },
    },

    onLoad () {
        this.scoreOvertakePool = new cc.NodePool("scoreOvertake");
    },

    play: function(posWorld, playerArray) {
        if (playerArray.length > 0) {
            let scoreOvertake = this.spawn();
            let posLocal = this.node.convertToNodeSpaceAR(posWorld);
            scoreOvertake.node.position = posLocal;
            scoreOvertake.setPlayerInfo(playerArray[0]);
            scoreOvertake.play();
        }
    },

    spawn: function() {
        let scoreOvertakeNode = null;
        if (this.scoreOvertakePool.size() > 0) {
            scoreOvertakeNode = this.scoreOvertakePool.get();
        } else {
            scoreOvertakeNode = cc.instantiate(this.scoreOvertakePrefab);
        }

        this.node.addChild(scoreOvertakeNode);
        var scoreOvertake = scoreOvertakeNode.getComponent('ScoreOvertake');
        scoreOvertake.init(this);

        return scoreOvertake;
    },

    despawn: function(scoreOvertake) {
        this.scoreOvertakePool.put(scoreOvertake.node);
    },
});
