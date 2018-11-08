/**
 * Created by chu on 2016/12/4 0004.
 */
let Defines = ()=> {
    var that = {};

    that.ConfigUrl = {
        gong: 'resources/config/gongConfig.json',
        dapao: 'resources/config/dapaoConfig.json',
        jindapao: 'resources/config/jindapaoConfig.json',
        kehuanpao: 'resources/config/kehuanpaoConfig.json'
    };
    that.ScreenConfie = {
        width: 1920,
        height: 1080
    };
    that.ExpressToGold = 80;
    let screctData = function (value) {
        //todo加密算法
        return value;
    };
    let unScrectData = function (value) {
        //todo 解密算法
        return value;
    }
    that.TowerNameConfig = ['gong','dapao','jindapao','kehuanpao'];
    that.saveGameInfo = function (key,value) {
        let data = screctData(value);
        cc.sys.localStorage.setItem(key,data);
    };
    that.getGameInfo = function (key) {
        let data = cc.sys.localStorage.getItem(key);
        let d = unScrectData(data);
        return JSON.parse(d);
    };
    that.getTowerLevel = function (index) {
         return that.getGameInfo(that.TowerNameConfig[index] + 'Level');
    };
    that.getTowerExpress = function (index) {
        return that.getGameInfo(that.TowerNameConfig[index] + 'Express');
    };
    that.getTowerLevelExpress = function (index,level,config) {
        let info = config[level - 1];
        return info['express'];
    };
    that.getTowerDamage = function (index,level,config) {
        let damge = config[level - 1]['attack'];
        return damge;
    };
    that.getTowerAttackSpeed = function (index,level,config) {
        let speed = config[level - 1]['attackspeed'];
        return speed
    };
    that.getTowerRange = function (index,level,config) {
        let range = config[level - 1]['range'];
        return range;
    };
    that.getRequirePower = function (index,level,config) {
        let rp = config[level - 1]['requirepower'];
        return rp;
    };
    that.getUserInfo = function (key) {
        return that.getGameInfo(key);
    };
    


    return that;
};
let defines = Defines();
export default defines;