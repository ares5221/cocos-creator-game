var GameState = {
    Invalide: -1,
    Waiting: 1,
    Running: 2,
    EnemyNull: 3,
    GameOver: 4,
    GameWinLayer: 5
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
        GoldLabel: {
            default: null,
            type: cc.Label
        },
        GoldCount: 100,
        State: GameState.Invalide,
        GameWinLayer: {
            default: null,
            type: cc.Node
        },
        EnemyPrefabs: {
            default: [],
            type: cc.Prefab
        },
        PathObject: {
            default: null,
            type: cc.Node
        },
        GameLayer: {
            default: null,
            type: cc.Node
        },
        UILayer: {
            default: null,
            type: cc.Node
        },
        IconTowers: {
            default: [],
            type: cc.SpriteFrame
        },
        Towers: {
            default: [],
            type: cc.Prefab
        },
        ShowMessageLabel: {
            default: null,
            type: cc.Prefab
        },
        EnemyEnterConfig: {
            default: [],
            type: cc.Integer
        },
        EnemyWaveIndex: 0,
        EnemyEnterSpeed: 0

    },
    removeAllMenu: function () {
        console.log('remove all menu' + this.node.children.length);
        for (var i = 0 ; i < this.GameLayer.children.length ; i ++){
            if (this.GameLayer.children[i].getComponent('TowerBase')){
                cc.log('Tower Base closeMenu');
                this.GameLayer.children[i].getComponent('TowerBase').closeMenu();
            }
            ///else 子节点没有TowerBasic属性


        }
    },
    // use this for initialization
    setInputControl: function () {
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END,function () {
           ///console.log('touch end');
        });
    }
    ,
    onLoad: function () {

        this.setState(GameState.Waiting);


        this.setInputControl();
        ///将this传给子节点
        this.NowTime = 0;
        this.Enemys = [];
    },

    addEnemy: function () {
        var enemy = cc.instantiate(this.EnemyPrefabs[this.EnemyWaveIndex]);
        enemy.getComponent('Enemy').Game = this;
        enemy.getComponent('Enemy').initEnemy(this.PathObject);
        // this.EnemyLayer.addChild(enemy);
        this.GameLayer.addChild(enemy);
        this.Enemys.push(enemy);
        this.EnemyEnterConfig[this.EnemyWaveIndex]--;
        if (this.EnemyEnterConfig[this.EnemyWaveIndex] <= 0){
            this.EnemyWaveIndex ++;
            if (this.EnemyWaveIndex >= this.EnemyEnterConfig.length){
                cc.log('敌人增加结束');
                this.setState(GameState.EnemyNull);
            }
        }
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.State === GameState.Running) {
            this.GoldLabel.string = this.GoldCount.toString();
            if (this.NowTime > this.EnemyEnterSpeed) {
                // console.log('加一个敌人');
                this.NowTime = 0;
                this.addEnemy();
            } else {
                this.NowTime += dt * 1000;
            }
        }
        if (this.State === GameState.EnemyNull){
            if (this.Enemys.length === 0){
                cc.log('Game over');
                this.setState(GameState.GameOver);
            }
        }
    },
    enemyMoveOver : function (object) {
        // this.EnemyLayer.removeChild(object.node);
        this.GameLayer.removeChild(object.node);
        for (var i = 0 ; i < this.Enemys.length; i ++){
            if (this.Enemys[i] === object.node){
                this.Enemys.splice(i,1);
                // console.log('删掉一个 敌人');
            }
        }
    },
    ScaleToGameMapSize: function (slider,coustomEventData) {
        // console.log('ScaleToGameMapSize');
        var value = slider.progress;
        this.node.setScale(1 + value * 3,1 + value * 3);
        // console.log('ScaleToGameMapSize' + value);
    },
    setState: function (state) {
        if (this.State === state){
            return;
        }
        this.State = state;
        switch (state){
            case GameState.Waiting:
                break;
            case GameState.Running:


                break;
            case GameState.GameOver:
                this.setState(GameState.GameWinLayer);
                break;
            case GameState.GameWinLayer:
                this.GameWinLayer.active = true;
                break;
            default:
                break;
        }
     },
    startGame: function (selectedTowers) {
        this.SelectedTowerList = selectedTowers;
        cc.log('selected towers length' + selectedTowers.length);
        this.setState(GameState.Running);
    },
    showMessage: function (str) {
        // cc.log('show message' + str);
        var showMessage = cc.instantiate(this.ShowMessageLabel);
        showMessage.setPosition(cc.p(0,0));
        showMessage.getComponent('ShowMessage').ShowMessage(str);
        this.node.addChild(showMessage);
    },
    removeEnemy: function (enemy) {
        for (var i = 0 ; i < this.Enemys.length; i ++){
            if (this.Enemys[i] === enemy.node){
                this.Enemys.splice(i,1);
            }
        }
        this.GameLayer.removeChild(enemy.node);
        this.GoldCount += enemy.GoldCount;

    },
    updateEnemyCount: function () {
        if (this.EnemyEnterConfig[this.EnemyWaveIndex] <= 0){
            this.EnemyWaveIndex ++;
            if (this.EnemyWaveIndex >= this.EnemyEnterConfig.length){
                this.setState(GameState.GameOver);
                cc.log('游戏结束');
                return;
            }
        }
    }

});
