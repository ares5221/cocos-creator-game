var storageManager = (function (){
    var spriteFrameCache = null;
    if(!cc.sys.localStorage.highestScore)
    {
        cc.sys.localStorage.highestScore = 0;
    }
    return {
        getHighestScore:function(){
            return cc.sys.localStorage.highestScore;
        },
        setHighestScore:function(score){
            cc.sys.localStorage.highestScore = score;
        }
    };
})();
module.exports = storageManager;