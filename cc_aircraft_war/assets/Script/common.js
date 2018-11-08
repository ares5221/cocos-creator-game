var gameState = cc.Enum({
    none: 0,
    start: 1,
    stop: 2,
});

var common = cc.Class({
    
    extends: cc.Component,

    properties: {
        
    },
    statics: {
        gameState
    },
    // use this for initialization
    onLoad: function () {
        D.commonInfo = common;
        D.common = this;
    },
    //批量初始化对象池 
    batchInitObjPool: function(thisO, objArray){
        
        for(var i=0; i< objArray.length; i++) {
            var objinfo = objArray[i];
            this.initObjPool(thisO, objinfo);
        }
    },
    
    //初始化对象池
    initObjPool: function(thisO,objInfo){
        
            var name = objInfo.name;
            var poolName = name+'Pool';
            thisO[poolName] = new cc.NodePool();
            
            let initPollCount = objInfo.initPollCount;

            for (let ii = 0; ii < initPollCount; ++ii) {
                let nodeO = cc.instantiate(objInfo.prefab); // 创建节点
                thisO[poolName].put(nodeO); // 通过 putInPool 接口放入对象池
            }
    },
    
    //生成节点
    genNewNode: function(pool,prefab,nodeParent){

        let newNode = null;
        if (pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            newNode = pool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            newNode = cc.instantiate(prefab);
        }
        nodeParent.addChild(newNode);
        return newNode;
    },
    //放回对象池
    backObjPool: function(thisO,nodeinfo){
        var poolName = nodeinfo.name + 'Pool';
        thisO[poolName].put(nodeinfo); 
    },
    //时间格式化
    timeFmt: function (time,fmt) { //author: meizz 
        var o = {
            "M+": time.getMonth() + 1, //月份 
            "d+": time.getDate(), //日 
            "h+": time.getHours(), //小时 
            "m+": time.getMinutes(), //分 
            "s+": time.getSeconds(), //秒 
            "q+": Math.floor((time.getMonth() + 3) / 3), //季度 
            "S": time.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    
});
