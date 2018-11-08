var TowerBasicState = {
    Inavilde: -1,
    Waitting: 1,
    BuildMenu: 2,
    Tower: 3,
    UpdateMenu: 4,
    UpdateTower: 5
}
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
        UpdateMenu: {
            default: null,
            type: cc.Prefab
        },
        BuildMenu: {
            default: null,
            type: cc.Prefab
        },
        State: TowerBasicState.Inavilde,
        Game: {
            default: null,
            type: cc.Node
        }
    },
    setState: function (state) {
        if (state === this.State){
            return
        }
        this.State = state;
        switch (this.State){
            case TowerBasicState.Waitting:
                this.Tower = undefined;
                this.Menu = undefined;
                ///tower 是空的，菜单也是空的

                break;
            case TowerBasicState.BuildMenu:
                cc.log('Build Menu');
                this.Game.getComponent('Game').removeAllMenu();
                this.Menu = cc.instantiate(this.BuildMenu);
                this.Game.getComponent('Game').UILayer.addChild(this.Menu);
                this.Menu.setPosition(this.node.getPosition());
                this.Menu.getComponent('BuildMenu').initMenu(this.Game,this);

                break;
            case TowerBasicState.UpdateMenu:
                cc.log('Update Menu');
                this.Game.getComponent('Game').removeAllMenu();
                this.Menu = cc.instantiate(this.UpdateMenu);
                this.Game.getComponent('Game').UILayer.addChild(this.Menu);
                this.Menu.setPosition(this.node.getPosition());
                this.Menu.getComponent('UpdateMenu').initMenu(this.Game,this);
                break;
            case TowerBasicState.UpdateTower:
                cc.log('升级Tower');
                ///tower升级完成将状态设置成Tower 状态
                this.setState(TowerBasicState.Tower);
                break;
            default:
                break;
        }
    },
    closeMenu: function () {
        cc.log('close Menu');
        if (this.Menu){
            this.Game.getComponent('Game').UILayer.removeChild(this.Menu);
            if (this.State === TowerBasicState.BuildMenu){
                this.setState(TowerBasicState.Waitting);
            }else if (this.State === TowerBasicState.UpdateMenu){
                this.setState(TowerBasicState.Tower);
            }
            this.Menu = undefined;
        }
    },
    onClick: function () {
      console.log('onclick' + this.State);
        if (this.State === TowerBasicState.Waitting){
            this.setState(TowerBasicState.BuildMenu);
        }else if (this.State === TowerBasicState.Tower){
            console.log('UpdateMenu');
            this.setState(TowerBasicState.UpdateMenu);
        }

    },
    // use this for initialization
    onLoad: function () {
        this.setState(TowerBasicState.Waitting);
    },

    buildTower: function (index) {
        ////首先判断金币是否足够
        var ownGold = this.Game.getComponent('Game').GoldCount;



        ///首先 删掉自己的 建造菜单
        this.Game.getComponent('Game').removeAllMenu();////删掉所有的菜单
        ///然后建造一个 tower
        this.Tower = cc.instantiate(this.Game.getComponent('Game').Towers[index]);
        var cost = this.Tower.getComponent('Tower').BuildCost;

        if (cost > ownGold){
            this.Tower = undefined;
            ///金币不够
            this.Game.getComponent('Game').showMessage('gold is not enough');
            return
        }
        this.Game.getComponent('Game').GoldCount -= cost;
        this.Game.getComponent('Game').GameLayer.addChild(this.Tower);
        this.Tower.setPosition(this.node.getPosition());
        this.Tower.getComponent('Tower').Game = this.Game;
        this.setState(TowerBasicState.Tower);
    },
    updateTower: function () {
        cc.log('updateTower');
        this.Game.getComponent('Game').removeAllMenu();
        this.setState(TowerBasicState.UpdateTower);
    },
    sellTower: function () {
        cc.log('sellTower');
        ///卖掉塔 ，直接将twoer 删掉。
        this.Game.getComponent('Game').removeAllMenu();//关闭菜单
        var cast = this.Tower.getComponent('Tower').BuildCost;
        var sellCast = cast * this.Tower.getComponent('Tower').SellRate;
        this.Game.getComponent('Game').GoldCount += sellCast;
        this.Game.getComponent('Game').GameLayer.removeChild(this.Tower);
        this.setState(TowerBasicState.Waitting);

    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
