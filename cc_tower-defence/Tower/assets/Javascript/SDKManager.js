/**
 * Created by chuhaoyuan on 2016/12/12.
 */
const OSType = {
  OSX: 1,
  iOS: 2,
  Android: 3,
  Windows: 4
};

const SDKManager = function () {
  let that = {};

  let _osType = 'none';
  let _adsPlugin = null;
  that.getOSType = function () {
    cc.log('os type = ' + cc.sys.os);
    if (cc.sys.os === 'Windows' || cc.sys.os === 'OS X'){

    }else {

      const appKey = '2CB32980-99D6-0311-CBE4-C0BAEE7E5725';
      const appSecret = '12340c7ced4c1b4c1fb5ac8f5c29f0bc';
      const privateKey = '2FB939B8CDA0B9599D8E13411CF6E01E';
      const oauthLoginServer = "http://oauth.anysdk.com/api/OauthLoginDemo/Login.php";
      cc.log('加载anysdk');
      let agent = anysdk.agentManager;
      cc.log('get agetn');
      agent.init(appKey,appSecret,privateKey,oauthLoginServer);
      cc.log('agent init');
      agent.loadAllPlugins();
      cc.log('agent load plugin');
      _adsPlugin =  agent.getAdsPlugin();
      cc.log('get adsplugin');
    }
  };
  // getOSType();
  that.showBanner = function () {
    cc.log('显示广告条');
    showAds(anysdk.AdsType.AD_TYPE_BANNER);
  };

  that.showFullScreen = function(){
    cc.log('显示插屏广告');
    showAds(anysdk.AdsType.AD_TYPE_FULLSCREEN);
  };

  that.preloadBanner = function(){
    cc.log('加载广告条');
    preloadAds(anysdk.AdsType.AD_TYPE_BANNER);
  };
  that.preloadFullScreen = function(){
    cc.log('加载全屏广告');
    preloadAds(anysdk.AdsType.AD_TYPE_FULLSCREEN);
  };
  const showAds = function (type) {
    if (_adsPlugin && _adsPlugin.isAdTypeSupported(type)){
      cc.log('显示广告');
        _adsPlugin.showAds(type);
    }
  };


  const preloadAds = function(type){
    if(_adsPlugin && _adsPlugin.isAdTypeSupported(type)){
      cc.log('加载广告' + type);
      _adsPlugin.preloadAds(type);
    }
  };




  return that;
};
export default SDKManager;