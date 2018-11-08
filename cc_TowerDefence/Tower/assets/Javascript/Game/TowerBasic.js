var TOWERBASESTATE = {
    Invalide: -1,
    Null: 1,
    Menu: 2,
    Build: 3,
    Update: 4,
    ToBuild: 5
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
        TowerBaseState: TOWERBASESTATE.Invalide,
        BuildMenu: {
            default: null,
            type: cc.Prefab
        },
        UpdateMenu: {
            default: null,
            type: cc.Prefab
        }
    },
    setInputControl: function () {
        var self = this;
        var logic = function () {
            if (self.TowerBaseState === TOWERBASESTATE.Null){
                console.log('打开建造菜单');
                self.setState(TOWERBASESTATE.Menu);
            }
            if (self.TowerBaseState === TOWERBASESTATE.Build){
                console.log('打开升级菜单');
                self.setState(TOWERBASESTATE.Update);
            }
        }
        this.node.on(cc.Node.EventType.TOUCH_START,function () {
            console.log('on touch begin');


        });
        this.node.on(cc.Node.EventType.TOUCH_END,function () {
            console.log('on touch end');
            logic();
        });
    },
    setState: function (state) {
        console.log('设置塔的基座状态');
        if (this.TowerBaseState === state){
            return;
        }
        switch (state){
            case TOWERBASESTATE.Null:
                console.log('塔的基座状态是空的');
                break;
            case TOWERBASESTATE.ToBuild:
                console.log('去建造');
                break;
            case TOWERBASESTATE.Build:
                console.log('塔的基座的状态是建造中');
                break;
            case TOWERBASESTATE.Menu:
                ///打开建造菜单

                // console.log('塔的基座的状态是建造菜单中');
                this.Game.removeAllMenu();
                var menu = cc.instantiate(this.BuildMenu);
                this.node.addChild(menu);
                menu.setPosition(0,0);
                menu.getComponent('BuildMenu').Target = this;
                this.menu = menu;



                break;
            case TOWERBASESTATE.Update:
                // console.log('塔的基座的状态是升级菜单中');
                // this.Game.getComponent('Game').removeAllMenu();
                this.Game.removeAllMenu();
                var updateMenu = cc.instantiate(this.UpdateMenu);
                updateMenu.getComponent('BuildMenu').Tower = this.Tower;
                updateMenu.setPosition(0,0);
                updateMenu.getComponent('BuildMenu').Target = this;
                this.menu = updateMenu;
                this.node.addChild(updateMenu);

                break;
            default:
                break;
        }
        this.TowerBaseState = state;


    },
    closeMenu: function () {
        console.log('close menu' + this.TowerBaseState);
        if (this.TowerBaseState === TOWERBASESTATE.Menu || this.TowerBaseState === TOWERBASESTATE.Update){
            console.log('close menu');
            this.node.removeChild(this.menu);
            if (this.TowerBaseState === TOWERBASESTATE.Menu){
                this.setState(TOWERBASESTATE.Null);
            }else {
                this.setState(TOWERBASESTATE.Build);
            }
        }

    },
    // use this for initialization
    onLoad: function () {
        var self = this;
        self.setState(TOWERBASESTATE.Null);
        self.setInputControl();
        ////画一个范围


    },
    updateTower: function () {
        this.closeMenu();
        this.setState(TOWERBASESTATE.Build);
        this.Tower.getComponent('Tower').updateTower();
    },
    sellTower: function () {
        this.closeMenu();
        this.setState(TOWERBASESTATE.Null);
        this.node.removeChild(this.Tower);
        this.Game.GoldCount += this.Tower.getComponent('Tower').getSellGoldCount();//将金额加回来
        this.Tower = undefined;
    },
    buildTower: function (index) {
        if (index === 'update'){
            this.updateTower();
            return;
        }
        if (index === 'sell'){
            this.sellTower();
            return;
        }
        var tower = cc.instantiate(this['Tower' + index]);
        if (tower.getComponent('Tower').BuildCast > this.Game.GoldCount){

            return
        }else {
            this.Game.GoldCount -= tower.getComponent('Tower').BuildCast;
            tower.getComponent('Tower').Game =  this.Game;
            this.node.addChild(tower);
            tower.setPosition(0,0);
            this.Tower = tower;
            this.closeMenu();
            this.setState(TOWERBASESTATE.Build);

        }
    },
    setEnemyTarget: function (enemy) {
      if (cc.pDistance(this.node.getPosition(),enemy.getPosition()) > this.Range){
          this.Enemy = undefined;
          //
          cc.log('这个敌人移除攻击范围之外了');
          if (this.Tower){
              // this.Tower.setPosition(0,0);
          }
      }else {
          ///敌人 在范围之内 ,tower  应该旋转一下
          if (this.Tower){
              //旋转Tower
              //设置旋转角度
              var angle = cc.pAngleSigned(cc.p(0,1),
                cc.pSub(enemy.getPosition(),this.node.getPosition()));
              this.Tower.rotation =  -angle * 180/ Math.PI;

          }
      }
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        ///旋转角度
        if (this.Game.Enemys){

           if (this.Enemy === undefined){
               var maxDis = 10000;
               for (var i = 0 ; i < this.Game.Enemys.length ; i ++){
                   if (cc.pDistance(this.Game.Enemys[i].getPosition(),this.node.getPosition()) < maxDis){
                       maxDis = cc.pDistance(this.Game.Enemys[i].getPosition(),this.node.getPosition());
                       this.Enemy = this.Game.Enemys[i];
                   }
               }
           }
        }

        if (this.Enemy){
            this.setEnemyTarget(this.Enemy);
        }
    },
});
