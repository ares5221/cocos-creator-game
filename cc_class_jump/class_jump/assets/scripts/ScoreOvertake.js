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

        overtakeLabel: {
            default: null,
            type: cc.Label,
        },

        photo: {
            default: null,
            type: cc.Sprite,
        },

        animation: {
            default: null,
            type: cc.Animation,
        },
    },

    onLoad: function() {
        this.animation.on('finished', this.onPlayFinished, this);
    },

    init: function(mgr) {
        this.mgr = mgr;
    },

    play: function() {
        this.animation.play('overtake_fade');
    },

    setPlayerInfo: function(playerInfo) {
        if (playerInfo.isSelf) {
            this.overtakeLabel.string = "New revord!";
        } else {
            this.overtakeLabel.string = "Overtake " + playerInfo.playerName;
        }

        UtilsFB.getPlayerPhotoAsync(playerInfo)
        .then(function() {
            if (playerInfo.photoTexture != null) {
                this.photo.spriteFrame = new cc.SpriteFrame();
                this.photo.spriteFrame.setTexture(playerInfo.photoTexture);
            }
        }.bind(this))
        .catch(error => {});

    },

    onPlayFinished: function(type, state) {
        this.mgr.despawn(this);
    },
});
