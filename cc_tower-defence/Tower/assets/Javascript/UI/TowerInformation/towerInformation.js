import defines from './../../Defines'
import ResourcesManager from './../../ResourcesManager'
import global from './../../global'
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
        TowerAnimationList: {
            default: [],
            type: cc.Prefab
        },
        AnimateLayer: {
            default: null,
            type: cc.Node
        },
        LevelLabel: {
            default: null,
            type: cc.Label
        },
        ExpressLabel: {
            default: null,
            type: cc.Label
        },
        DamageLabel: {
            default: null,
            type: cc.Label
        },
        AttackSpeed: {
            default: null,
            type: cc.Label
        },
        RangeLabel: {
            default: null,
            type: cc.Label
        },
        RequirePowerLabel: {
            default: null,
            type: cc.Label
        },
        DmgSubLabel:{
            default: null,
            type: cc.Label
        },
        AttSedSubLabel:{
            default: null,
            type: cc.Label
        },
        RangeSubLabel: {
            default: null,
            type: cc.Label
        },
        EnCostSubLabel: {
            default: null,
            type: cc.Label
        },
        UPLevelCostGoldLabel: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {
        this.AnimationList = [];
    },
    update:function(dt){

    },

    showTowerInformationAnimation: function (index) {




        this.index = index;
        this.referUIShow(index);


    },
    closeButton: function (event,customData) {
        cc.log('close button');
        this.node.destroy();
    },
    referUIShow: function (index) {


        this.AnimateLayer.removeAllChildren(true);
        let node = cc.instantiate(this.TowerAnimationList[index]);
        this.AnimateLayer.addChild(node);

        ///得到当前塔的等级
        let level = defines.getTowerLevel(index);
        cc.log('tower level+' + level);

        let self = this;
        let loadUrl = defines.ConfigUrl[defines.TowerNameConfig[index]];
        cc.log('loadUrl=' + loadUrl);
        ResourcesManager.load(loadUrl,(res)=>{




            ///取出相对应的级数的数据
            cc.log('Tower Config' + JSON.stringify(res));
            self.LevelLabel.string = 'Level:' + level;
            let levelExpress = defines.getTowerLevelExpress(index,level,res);
            let express = defines.getTowerExpress(index);
            cc.log('levelExpress' + levelExpress);
            cc.log('now Express' + express);
            self.ExpressLabel.string = 'Exp:' + express + '/' + levelExpress;
            let damage = defines.getTowerDamage(index,level,res);
            self.DamageLabel.string = 'Dmg:' + damage;

            let attackSpeed = defines.getTowerAttackSpeed(index,level,res);
            self.AttackSpeed.string = 'AttSped:' + attackSpeed;

            let range = defines.getTowerRange(index,level,res);
            self.RangeLabel.string = 'Range:' + range;

            let reqPower = defines.getRequirePower(index,level,res);
            self.RequirePowerLabel.string = 'EnCost:' + reqPower;

            if (level === res.length){
                self.LevelLabel.string = 'Max';
                self.DmgSubLabel.string = '+0';
                self.AttSedSubLabel.string = '+0';
                self.RangeSubLabel.string = '+0';
                self.EnCostSubLabel.string = '+0';
                self.UPLevelCostGoldLabel.string = '0';
            }else {
                //得到当前Tower升级所需要的经验值



                let AddDamage = defines.getTowerDamage(index,level + 1,res) - damage;
                cc.log('damage=' + damage);

                self.DmgSubLabel.string = '+' + AddDamage;



                let addSpeed = defines.getTowerAttackSpeed(index,level + 1,res) - attackSpeed;
                self.AttSedSubLabel.string = '+' + addSpeed;


                let addRang = defines.getTowerRange(index,level + 1,res) - range;
                self.RangeSubLabel.string = '+' + addRang;


                let addPower = defines.getRequirePower(index,level + 1,res) - reqPower;
                self.EnCostSubLabel.string = '+' + addPower;

                //
                let requireExpress = levelExpress - express;
                cc.log('升级所需要的经验值' + requireExpress);
                let requireGold = Math.ceil(requireExpress/defines.ExpressToGold);
                cc.log('升级所需要的金币值' + requireGold);
                self.UPLevelCostGoldLabel.string = requireGold + '';
            }


        });
    },
    buttonClick: function (event, customData) {
        cc.log('customData' + customData);
        let self = this;
        // this.TowerObject = event
        switch (customData){
            case 'update':
                cc.log('up level tower');
                let loadUrl = defines.ConfigUrl[defines.TowerNameConfig[self.index]];
                cc.log('loadUrl=' + loadUrl);
                ResourcesManager.load(loadUrl,(res)=>{
                    let  level = defines.getTowerLevel(self.index);
                    let levelExpress = defines.getTowerLevelExpress(self.index,level,res);
                    let nowExpress = defines.getTowerExpress(self.index);
                    let reqExpress = levelExpress - nowExpress;
                    let reqGoldCount  = Math.ceil(reqExpress/defines.ExpressToGold);
                    if (reqGoldCount > global.playerData.GoldCount){
                        cc.log('金币不够');
                        return
                    }


                    if (level >= (res.length)){
                        ///满级不用升级
                        return;
                    }else {
                        level ++;
                        defines.saveGameInfo(defines.TowerNameConfig[self.index] + 'Level',level);
                        global.playerData.GoldCount -= reqGoldCount;
                        defines.saveGameInfo('GoldCount',global.playerData.GoldCount);
                        self.referUIShow(self.index);

                    }

                });
                break;
            case 'use':
                cc.log('装备大炮');


                global.EventController.fire('useTowerWithInfo',{
                    towerIndex: this.index,
                });


                break;
            default:
                break;
        }
    }
});
