/**
 * Created by chu on 2016/12/4 0004.
 */
let Manager = ()=> {
    let that = {};
    let load = function (url,cb) {
        if (that[url] === undefined){
            cc.loader.load(cc.url.raw(url),function (err,res) {
                if (err){
                    cc.log('load:' + url + 'failed');
                }else {
                    cc.log('load:' + url + 'success');
                    that[url] = res;
                    if (cb){
                        cb.call(null,that[url]);
                    }
                }
            })
        }else {
            if (cb){
                cb.call(null,that[url]);
            }
        }
    }
    that.load = function (url,cb) {
        load(url,cb);
    };
    return that;
}
let resourcesManager = Manager();
export default resourcesManager;