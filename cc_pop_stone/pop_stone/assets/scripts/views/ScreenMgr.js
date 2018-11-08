// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var ScreenMgr = cc.Class({
    extends: cc.Component,

    properties: {
        layerScreen: {
            default: null,
            type: cc.Node,
        },

        layerDialog: {
            default: null,
            type: cc.Node,
        },

        layerMessage: {
            default: null,
            type: cc.Node,
        },

        prefabMessage: {
            default: null,
            type: cc.Prefab,
        },
    },

    statics: {
        instance: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ScreenMgr.instance = this;

        this.screensMap = new Map();
        this.screenCurrent = "ScreenHome";
        for (let i = 0; i < this.layerScreen.childrenCount; i++) {
            let screen = this.layerScreen.children[i];
            this.screensMap.set(screen.name, screen);
        }

        this.dialogsMap = new Map();
        for (let i = 0; i < this.layerDialog.childrenCount; i++) {
            let dialog = this.layerDialog.children[i];
            this.dialogsMap.set(dialog.name, dialog);
        }

        this.messagePool = new cc.NodePool('MessageView');
    },

    gotoScreen(screenName, args) {
        if (this.screensMap.has(screenName)) {
            args = args || {};

            if (this.screensMap.has(this.screenCurrent)) {
                args.screenFrom = this.screenCurrent;

                let lastScreen = this.screensMap.get(this.screenCurrent);
                let argsExit = {'screenTo': screenName};
                lastScreen.getComponent('ScreenView').onExitBegin(argsExit);
                lastScreen.active = false;
            }

            this.screenCurrent = screenName;
            let screen = this.screensMap.get(screenName);
            screen.active = true;

            screen.getComponent('ScreenView').onEnterBegin(args);
        }
    },

    showDialog(dialogName, args) {
        if (this.dialogsMap.has(dialogName)) {
            args = args || {};

            let dialog = this.dialogsMap.get(dialogName);
            dialog.active = true;

            dialog.getComponent('DialogView').onEnterBegin(args);
        }
    },

    closeAllDialog(args) {
        args = args || {};
        for (let dialog of this.dialogsMap.values()) {
            if (dialog.active) {
                dialog.active = false;
            }
        }
    },

    showMessage(message) {
        let messageNode = null;
        if (this.messagePool.size() > 0) {
            messageNode = this.messagePool.get();
        } else {
            messageNode = cc.instantiate(this.prefabMessage);
        }

        messageNode.setParent(this.layerMessage);

        let messageView = messageNode.getComponent('MessageView');
        messageView.despawnAction = this.despawnMessage.bind(this);

        let args = {"message": message};
        messageView.onEnterBegin(args);
    },

    despawnMessage(messageView) {
        this.messagePool.put(messageView.node);
    },
});
