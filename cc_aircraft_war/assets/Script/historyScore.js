cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: cc.Prefab,
        scrollContent: cc.Node,
        backGame: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        var infoData = JSON.parse(cc.sys.localStorage.getItem('score'));
        
        for (var i = 0; i < infoData.length; ++i) {
            
            var item = cc.instantiate(this.itemPrefab);
            
            var data = infoData[i];
            
            this.scrollContent.addChild(item);
            
            item.getComponent('scoreItemTemplate').init({
                
                score: data.score,
                time: data.time,
                
            });
        }
        this.backGame.on('touchstart',this.backGameO,this);
        
        
    },
    backGameO: function() {
        cc.director.loadScene('end');
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
