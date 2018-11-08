cc.Class({
    extends: cc.Component,

    properties: {
        topScore: cc.Label,
        currentScore: cc.Label
    },

    // use this for initialization
    onLoad: function () {
        //读取最高分和这次的得分
        var _topScore = cc.sys.localStorage.getItem('topScore');
        this.topScore.string = _topScore;
        var _currentScore = cc.sys.localStorage.getItem('currentScore');
        this.currentScore.string = _currentScore;
        //历史得分
        cc.director.preloadScene('historyScore');
    },
    //游戏重新运行
    gameRestart: function(){ 
        cc.director.loadScene('main');
        //cc.director.resume();
    },
    // 退出游戏
    gameExit: function(){
        cc.director.loadScene('start');
    },
    //历史得分
    gotoHistoryScore: function() {
        cc.director.loadScene('historyScore');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
