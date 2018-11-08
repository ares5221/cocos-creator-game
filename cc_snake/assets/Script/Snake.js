var SnakeStatus = cc.Enum({
    init: 0,
    run: 1,
    death: 2,
});

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 10,
        bodyLen: 5,
        rate: 5,
        player: cc.Node,
        status: SnakeStatus.init,
        bodyPrefab: cc.Prefab,
        body: []
    },
    // use this for initialization
    onLoad: function() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.moveDirection = cc.KEY.space;
    },
    init: function(properties) {
        let self = this;

        cc.js.mixin(this, properties);
        this.player.getComponent(cc.Label).string = properties.playerName;
        if (self.myWilddog) {
            self.myWilddog.set({
                posX: self.node.x,
                posY: self.node.y,
                moveDirection: cc.KEY.space,
                status: 0,
                skinNum:self.skinNum
            });
        }
        if (self.skin) {
            self.getComponent(cc.Sprite).spriteFrame = self.skin;
        }
        //根据长度先生成身体，初始时都在一个点
        for (var i = 0; i < self.bodyLen; i++) {
            let body_ = cc.instantiate(self.bodyPrefab);
            body_.setPosition(self.node.getPosition());
            if (!properties.isMyself) {
                //设置碰撞系
                body_.group = 'othersnake';
            }
            if (self.skin) {
                body_.getComponent(cc.Sprite).spriteFrame = self.skin;
            }
            body_.parent = cc.find('Canvas'); //self.node.parent;
            self.body.unshift(body_);
        }
        //长度数组
        self.positions = [];
        self.node.zIndex = 999;


    },
    destroy() {
        //此处有1.3.2的BUG，等新版本修复吧
        // cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        // cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    onKeyDown: function(event) {
        let self = this;
        if (self.isMyself) {
            //只控制自己
            self.status = SnakeStatus.run;
            self.moveDirection = event.keyCode;
            if (self.myWilddog) {
                self.myWilddog.set({
                    posX: self.node.x,
                    posY: self.node.y,
                    moveDirection: self.moveDirection,
                    status: self.status,
                    skinNum:self.skinNum
                });
            }
        }
    },
    onKeyUp: function(event) {
        //这个不用
        // if (event.keyCode === this.moveDirection) {
        //     this.moveDirection = null;
        // }
    },
    getRandomPosition: function() {
        let y = -cc.winSize.height / 2 + (cc.winSize.height - 100) * Math.random();
        let x = -cc.winSize.width / 2 + cc.winSize.width * Math.random();
        return cc.p(x, y);
    },
    eatLure: function() {
        let self = this;
        self.bodyLen++;
        let body_ = cc.instantiate(self.bodyPrefab);
        body_.setPosition(self.node.getPosition());
        body_.parent = cc.find('Canvas'); //self.node.parent;
        if (!self.isMyself) {
            body_.group = 'othersnake';
        }
        if (self.skin) {
            body_.getComponent(cc.Sprite).spriteFrame = self.skin;
        }
        self.body.unshift(body_);

    },
    die: function() {
        //1.记录状态，不再更新update
        //2.身体各个部分化为lure，动画
        //3.发送事件，通知总控处理
        let self = this;
        self.status = SnakeStatus.death;
        self.destroy();
        for (var i = 0; i < self.body.length; i++) {
            let retain = false;
            if (i % self.rate === 0) {
                retain = true;
            }
            self.body[i].getComponent('Body').destroy(retain);
        }
        if (self.isMyself) {
            //如果是自己，发出事件通知，从wilddog中去掉自己

            if (self.myWilddog) {
                self.myWilddog.remove();
            }

        } else {
            //如果是其它snake，只要把自己消失，从otherSnakes取消
        }
        let event = new cc.Event.EventCustom('die', true);
        event.setUserData(self);
        self.node.dispatchEvent(event);
        self.node.destroy();
    },
    onCollisionEnter: function(other, self) {

        if (other.node.group === 'lure') {
            this.eatLure();
        }
        if (other.node.group === 'othersnake') {
            //如果自己碰撞到其它snake时，自己die
            //只需要头部的测试，其它部分不需要---->在某种时候可能是body
            this.die();
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function(dt) {
        let self = this;
        if (self.status == SnakeStatus.run) {
            //在运动前的位置 加入到数组头部
            //与速度进行一下转换
            self.positions.unshift(self.node.getPosition());
            if (self.positions.length > self.bodyLen * self.rate) {
                //数组变长
                self.positions.pop();
            }

            for (var i = 0; i < self.bodyLen; i++) {
                if (self.positions[i * self.rate]) {
                    self.body[i].setPosition(self.positions[i * self.rate]);
                }
            }


            switch (this.moveDirection) {

                case cc.KEY.left:
                    this.node.x -= this.speed;
                    break;
                case cc.KEY.right:
                    this.node.x += this.speed;
                    break;
                case cc.KEY.up:

                    this.node.y += this.speed;
                    break;
                case cc.KEY.down:
                    this.node.y -= this.speed;
                    break;

            }
        }

        if (Math.abs(this.node.x) > (cc.winSize.width - 50) / 2) {
            // this.node.x = (cc.winSize.width - 50) / 2 * this.node.x / Math.abs(this.node.x);
            self.die();
        }
        //cc.log(this.node.x + " " + this.node.x);
        if (Math.abs(this.node.y) > (cc.winSize.height - 50) / 2) {
            //this.node.y = (cc.winSize.height - 50) / 2 * this.node.y / Math.abs(this.node.y);
            self.die();
        }
    },
});