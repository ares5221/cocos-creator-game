cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        if (cc.sys.os === 'Android' || cc.sys.os === 'iOS'){
            let agent = anysdk.agentManager;
            let appKey = '2CB32980-99D6-0311-CBE4-C0BAEE7E5725';
            let appSecret = '12340c7ced4c1b4c1fb5ac8f5c29f0bc';
            let privateKey = '2FB939B8CDA0B9599D8E13411CF6E01E';
            let authUrl = 'http://pay.anysdk.com/v5/Order/getOrderId/';
            agent.init(appKey,appSecret,privateKey,authUrl);
            this.AdsPlugin = agent.getAdsPlugin();
        }
    },
    loadAds : function (type) {
        cc.log('load ads');
        if (this.AdsPlugin){
            this.AdsPlugin.preloadAds(type);
        }
    },
    showAds : function (type) {
        cc.log('show ads');
        if(this.AdsPlugin){
            this.AdsPlugin.showAds(type);
        }
    },
    ButtonClick: function (event,coustomData) {
        switch (coustomData){
            case "load":
                cc.log('load ads s');
                this.loadAds(anysdk.AdsType.AD_TYPE_BANNER);
                break;
            case "show":
                cc.log('show ads s');
                this.showAds(anysdk.AdsType.AD_TYPE_BANNER);
                break;
        }
    },
    ButtonClickFullScreenAds: function (event,coustomData) {
        switch (coustomData){
            case "load":
                this.loadAds(anysdk.AdsType.AD_TYPE_FULLSCREEN);
                break;
            case "show":
                this.showAds(anysdk.AdsType.AD_TYPE_FULLSCREEN);
                break;
            default:
                break;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
