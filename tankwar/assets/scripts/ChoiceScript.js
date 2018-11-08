cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        curLevelLabel:cc.Label,

    },

    // use this for initialization
    onLoad: function () {
        cc.gameData = {};
        cc.gameData.curLevel = 1;
        this.updateLevelLabel();
    },

    
    onPlay: function () {
        var self = this;
        cc.loader.onProgress = function (completedCount, totalCount, item){
            console.log(completedCount+"/"+totalCount);
        };
        cc.director.preloadScene("CityScene"+ cc.gameData.curLevel, function (assets, error){
            //跳转到游戏界面
            cc.director.loadScene("CityScene"+ cc.gameData.curLevel);
        });
    },

    onUp: function () {
        if(cc.gameData.curLevel-1 <= 0){
            return;
        }
        cc.gameData.curLevel -= 1; 
        this.updateLevelLabel();
    },

    onNext: function () {
        if(cc.gameData.curLevel+1 > 20){
            return;
        }
        cc.gameData.curLevel += 1; 
        this.updateLevelLabel();
    },

    updateLevelLabel: function () {
        this.curLevelLabel.string = "Round "+cc.gameData.curLevel;
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
