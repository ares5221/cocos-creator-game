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
        socket: {
            default:null,
            type: cc.Node,
        },
        namelabel: {
            default:null,
            type: cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {
      this.namelabel = this.node.getChildByName("name");
    },

    reset: function(){
        var startbutton = this.node.getChildByName("start")
        startbutton.active = true
        startbutton.getChildByName("Label").getComponent("cc.Label").string = "信春哥"
        this.node.getChildByName("loading").active = false
        this.namelabel.active = false
    },

    load: function(){ 
        var name = this.namelabel.getComponent("cc.EditBox").string
        this.socket.getComponent("socket_l").sendmsg(JSON.stringify({"type":"login", "name":name}));
        this.node.getChildByName("loading").active = true
        this.node.getChildByName("start").active = false
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
