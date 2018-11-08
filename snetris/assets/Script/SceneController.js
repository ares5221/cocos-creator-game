cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function() {

    },
    gamescene: function() {
        cc.director.loadScene("Game");
    },
    startScene: function() {
        cc.director.loadScene("Start");
        Pos2EventMap = {}; //清空障碍
    },
    helperScene: function() {
        cc.director.loadScene("Helper");
    },
    EditorScene: function() {
        cc.director.loadScene("Editor");
    }
});