cc.Class({
    extends: cc.Component,

    properties: {
        gold_label: cc.Label,
        goldNum: 0,
    },

    // use this for initialization
    onLoad: function () {

    },

    addGold: function() {
        this.goldNum++;
        this.gold_label.string = this.goldNum + "";
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
