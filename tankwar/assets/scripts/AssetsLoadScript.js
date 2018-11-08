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
        numLabel: cc.Label,

    },

    // use this for initialization
    onLoad: function () {

        var self = this;

        var urls = [
            {
                id: "tank",
                url: cc.url.raw("resources/tank.plist")
            }
        ];

        cc.LoadingItems.create(cc.loader, urls, function (completedCount, totalCount, item) {
            var progress = (100 * completedCount / totalCount).toFixed(2);
            cc.log(progress + '%');
            self.numLabel.string = Math.abs(progress) + '%';
            console.log("=========="+item.url);

        }, function (errors, items) {
            if (errors) {
                for (var i = 0; i < errors.length; ++i) {
                    cc.log('Error url: ' + errors[i] + ', error: ' + items.getError(errors[i]));
                }
            }
            else {
                console.log(items.totalCount);
                
            }
        })


    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
