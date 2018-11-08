"use strict";
cc._RFpush(module, 'facf018is5ERKFkFWa/fWq7', 'game-scene');
// src/scene/game-scene.js

cc.Class({
    "extends": cc.Component,

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

        platform_generator: null,
        platform_default_0: cc.Node,
        platform_default_1: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        var platform_generator_node = cc.find("platform-generator");
        this.platform_generator = platform_generator_node.getComponent("platform-generator");
        this.platform_generator.initPlatforms([this.platform_default_0, this.platform_default_1]);
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();