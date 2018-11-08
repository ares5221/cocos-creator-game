cc.Class({
    extends: cc.Component,

    properties: {
        game_loading: cc.Node
    },
    
    // use this for initialization
    onLoad: function () {
        
        var gameloading = this.game_loading.getComponent(cc.Animation);
        gameloading.play();
        cc.director.preloadScene('main');
    },
    
    //开始游戏
    startGame: function(){
        cc.director.loadScene ('main',function(){
            console.log('main is loaded');
        }) 
    },
    // called every frame
    //update: function (dt) {
    //},
});
