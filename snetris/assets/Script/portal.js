var col = require("collideManager");
cc.Class({
    extends: cc.Component,

    properties: {
        a: {
            default: null,
            type: cc.Node
        },
        b: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function() {

    },
    createPort: function() {
        let me = this;
        let apos = col.randomEmptyPos();
        col.setCollide(apos[0], apos[1], { name: "portala", type: "portal", link: [] });
        let bpos = col.randomEmptyPos();
        col.setCollide(bpos[0], bpos[1], { name: "portalb", type: "portal", link: apos.slice(0, 2) });
        let eventa = col.getEventByKey(apos[0], apos[1])
        eventa.link = bpos.slice(0, 2);
        me.setPortPosition(me.a, apos);
        me.setPortPosition(me.b, bpos);

    },
    setPortPosition(node, pos) {
        node.setPosition(pos[0] * cGridSize, pos[1] * cGridSize);
        node.opacity = 255;
    },
});