/**
 * Created by chu on 2016/12/22 0022.
 */
const EventController = function (object) {
    let that = object;
    let regisity = {};
    that.on = function(type,methond){
        cc.log('on' + type);
        if (regisity[type] === undefined){
            regisity[type] = [];
        }
        regisity[type].push(methond);
    };
    that.fire = function () {
        let pararmList = [];
        for (let i = 1; i < arguments.length ; i ++){
            pararmList.push(arguments[i]);
        }
        let type = arguments[0];
        if (regisity[type] !== undefined){
            cc.log('run' + type);
            let MethodList = regisity[type];
            for (let i = 0 ; i < MethodList.length ; i ++){
                // regisity[type].apply(null,pararmList);
                MethodList[i].apply(null,pararmList);
            }
        }

    };
    return that;
}
export default  EventController;