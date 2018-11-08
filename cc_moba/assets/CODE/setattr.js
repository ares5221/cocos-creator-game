cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        attack:{
            default:null,
            type: cc.Node,
        },
        def:{
            default:null,
            type: cc.Node,
        },
        hp:{
            default:null,
            type: cc.Node,
        },
        strong:{
            default:null,
            type: cc.Node,
        },
        minjie:{
            default:null,
            type: cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    setattack : function(p){
        
        this.attack.getComponent("cc.Label").string = " " + p
    },
    setdef : function(p){
        this.def.getComponent("cc.Label").string = " " + p
    },
    sethp : function(p){
        this.hp.getComponent("cc.Label").string = " " + p
    },
    setstrong : function(p){
        this.strong.getComponent("cc.Label").string = " " + p
    },
    setminjie : function(p){
        this.minjie.getComponent("cc.Label").string = " " + p
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
