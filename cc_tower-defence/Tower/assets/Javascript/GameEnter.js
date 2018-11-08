import defines from './Defines'
import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad: function () {

        // global.SDKManager.getOSType();

        cc.sys.localStorage.clear();
        if (defines.getGameInfo('Game5') === null){
            for (let i in defines.TowerNameConfig){
                defines.saveGameInfo(defines.TowerNameConfig[i] + 'Level',1);
                defines.saveGameInfo(defines.TowerNameConfig[i] + 'Express',0);
            }
            defines.saveGameInfo('GoldCount',1000);
            defines.saveGameInfo('Game5',1);
        }else {
            cc.log('不是第一次进入游戏的');
        }




    },
    

});
