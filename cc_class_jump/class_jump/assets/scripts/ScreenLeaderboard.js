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
cc.Class({
    extends: cc.Component,

    properties: {
        playerItemPrefab: {
            default: null,
            type: cc.Prefab,
        },

        content: {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.playerItemPool = new cc.NodePool("playerItem");
        this.canvasNode = cc.find('Canvas');
    },

    showLeaderboard: function(leaderboardName) {
        if (typeof FBInstant === 'undefined') {
            this.showLeaderboardDebug();
        }

        UtilsFB.getLeaderboardAsync(leaderboardName)
        .then(function(playerArray) {
            this.showLeaderboardInternal(playerArray);
        }.bind(this))
        .catch(function(error) {
        });
    },

    showLeaderboardInternal: function(playerArray) {
        this.node.active = true;
        this.updateLeaderboard(playerArray);
        // this.show();
    },

    showLeaderboardDebug: function() {
        let playerArray = new Array();
        for (let i = 0; i < 15; i++) {
            var playerInfo = {};
            playerInfo.id = "2127737910604444";
            playerInfo.playerName = "player " + i;
            playerInfo.score = 10 + i * 2;
            playerInfo.rank = i + 1;

            if (i % 2 == 0) {
                playerInfo.portraitUrl = "https://platform-lookaside.fbsbx.com/platform/instantgames/profile_pic.jpg?igpid=2127737910604444&height=256&width=256&ext=1542184412&hash=AeRpQBaamgXpc3fM";
            } else {
                playerInfo.portraitUrl = "https://platform-lookaside.fbsbx.com/platform/instantgames/profile_pic.jpg?igpid=2445785048770311&height=256&width=256&ext=1542255362&hash=AeQ_-nxXrs2f6OE4";
            }

            playerArray.push(playerInfo);
        }

        this.showLeaderboardInternal(playerArray);
    },

    show: function() {
        var beginPos = cc.v2(0, -(this.canvasNode.height + this.node.height) / 2);
        var endPos = cc.v2(0, 0);
        var showAction = cc.moveTo(0.5, endPos).easing(cc.easeCubicActionOut());

        this.node.position = beginPos;
        this.node.runAction(showAction);
    },

    hide: function() {
        var endPos = cc.v2(0, -(this.canvasNode.height + this.node.height) / 2); 
        var hideAction = cc.moveTo(0.5, endPos).easing(cc.easeCubicActionIn());
        this.node.runAction(hideAction);
    },

    updateLeaderboard: function(playerArray) {
        this.clearLeaderboard();
        for (let i = 0; i < playerArray.length; i++) {
            var playerItemNode = this.spawnPlayerItem();
            playerItemNode.getComponent('PlayerItem').updatePlayerInfo(playerArray[i]);
            playerItemNode.setParent(this.content);
        }
    },

    clearLeaderboard: function() {
        for (let i = this.content.childrenCount - 1; i >= 0; i--) {
            this.despawnPlayerItem(this.content.children[i]);
        }
    },

    spawnPlayerItem: function() {
        if (this.playerItemPool.size() > 0) {
            return this.playerItemPool.get(this);
        } else {
            return cc.instantiate(this.playerItemPrefab);
        }
    },

    despawnPlayerItem: function(playerItemNode) {
        this.playerItemPool.put(playerItemNode);
    },
});
