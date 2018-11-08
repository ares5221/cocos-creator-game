"use strict";
cc._RFpush(module, 'ad41c/xVbdPkbW3QvzF211v', 'background');
// src/layer/background.js

cc.Class({
    "extends": cc.Component,

    properties: {
        near_bg: [cc.Node],
        far_bg: [cc.Node],

        near_speed: 5,
        far_speed: 0.5
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.fixBgPos(this.far_bg[0], this.far_bg[1]);
        this.fixBgPos(this.near_bg[0], this.near_bg[1]);
    },

    fixBgPos: function fixBgPos(bg1, bg2) {
        bg1.x = 0;
        var bg1BoundingBox = bg1.getBoundingBox();
        bg2.setPosition(bg1BoundingBox.xMax, bg1BoundingBox.yMin);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        this.bgMove(this.far_bg, this.far_speed);
        this.bgMove(this.near_bg, this.near_speed);

        this.checkBgReset(this.far_bg);
        this.checkBgReset(this.near_bg);
    },

    bgMove: function bgMove(bgList, speed) {
        for (var index = 0; index < bgList.length; index++) {
            var element = bgList[index];
            element.x -= speed;
        }
    },

    /***
     * 检查背景是否要重置位置
     */
    checkBgReset: function checkBgReset(bgList) {
        var winSize = cc.director.getWinSize();
        var first_xMax = bgList[0].getBoundingBox().xMax;
        if (first_xMax <= 0) {
            var preFirstBg = bgList.shift();
            bgList.push(preFirstBg);

            var curFirstBg = bgList[0];
            preFirstBg.x = curFirstBg.getBoundingBox().xMax;
        }
    }
});

cc._RFpop();