"use strict";
cc._RFpush(module, '68c90r5ql1P0ppR4qeTEULM', 'uiLayer');
// src/layer/uiLayer.js

cc.Class({
    "extends": cc.Component,

    properties: {
        gold_label: cc.Label,
        goldNum: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},

    addGold: function addGold() {
        this.goldNum++;
        this.gold_label.string = this.goldNum + "";
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();