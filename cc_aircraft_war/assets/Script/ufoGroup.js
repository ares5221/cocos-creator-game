
//ufo组
var ufoG = cc.Class({
    name:'ufoG', 
    properties: {
        name:'',
        freqTime:0,
        prefab:cc.Prefab,
        initPoolCount:0,
        minDelay:{
            default:0,
            tooltip: '最小延迟',
        },
        maxDelay:{
            default:0,
            tooltip: '最大延迟',
        },
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        ufoG: {
            default:[],
            type: ufoG
        },
    },

    // use this for initialization
    onLoad: function () {
        this.eState = D.commonInfo.gameState.none;
        //console.log(this.ufoG);
        D.common.batchInitObjPool(this,this.ufoG);        
        
    },
    startAction(){
        // ufo 
        this.eState = D.commonInfo.gameState.start;
        //定时生成敌机
        for (var ui=0; ui< this.ufoG.length; ++ui){
            var freqTime = this.ufoG[ui].freqTime;
            var fName = 'callback_'+ui;
            this[fName] = function(e){ this.randNewUfo(this.ufoG[e]); }.bind(this, ui);
            this.schedule(this[fName], freqTime);
        }
    },
    //随机时间生成敌机
    randNewUfo: function(ufoInfo){
        var delay = Math.random()*(ufoInfo.maxDelay-ufoInfo.minDelay) + ufoInfo.minDelay;
        this.scheduleOnce(function(e) {this.getNewUfo(e);}.bind(this, ufoInfo), delay);
    },
    //生成敌机
    getNewUfo: function(ufoInfo) {
        var poolName = ufoInfo.name + 'Pool';
        var newNode = D.common.genNewNode(this[poolName],ufoInfo.prefab,this.node);
        var newV2 = this.getNewUfoPositon(newNode);
        newNode.setPosition(newV2);
    },
    //敌机随机生成的位置
    getNewUfoPositon: function(newUfo) {
        //位于上方，先不可见
        var randx = cc.randomMinus1To1()*(this.node.parent.width/2-newUfo.width/2);
        var randy = this.node.parent.height/2+newUfo.height/2;
        return cc.v2(randx,randy);
    },
    //重新开始
    resumeAction: function(){
        this.enabled = true;
        this.eState = D.commonInfo.gameState.start;
    },
    //暂停
    pauseAction: function(){
        this.enabled = false;
        this.eState = D.commonInfo.gameState.pause;
        
    },
    ufoDied: function(nodeinfo){
        //回收节点
        D.common.backObjPool(this,nodeinfo);
    },
});
