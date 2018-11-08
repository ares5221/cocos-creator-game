/**
 * Created by chu on 2016/12/6 0006.
 */
import defines from './Defines'
let PlayerData = ()=>{
    let that = {};
    that.GoldCount = defines.getUserInfo('GoldCount');
    cc.log('Player GoldCount =' + that.GoldCount);


    return that;
};
export default PlayerData;