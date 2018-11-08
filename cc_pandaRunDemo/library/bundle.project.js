require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"background":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ad41c/xVbdPkbW3QvzF211v', 'background');
// src/layer/background.js

cc.Class({
    "extends": cc.Component,

    properties: {
        near_bg: [cc.Node],
        far_bg: [cc.Node],

        near_speed: 5,
        far_speed: 0.5
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.fixBgPos(this.far_bg[0], this.far_bg[1]);
        this.fixBgPos(this.near_bg[0], this.near_bg[1]);
    },

    fixBgPos: function fixBgPos(bg1, bg2) {
        bg1.x = 0;
        var bg1BoundingBox = bg1.getBoundingBox();
        bg2.setPosition(bg1BoundingBox.xMax, bg1BoundingBox.yMin);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        this.bgMove(this.far_bg, this.far_speed);
        this.bgMove(this.near_bg, this.near_speed);

        this.checkBgReset(this.far_bg);
        this.checkBgReset(this.near_bg);
    },

    bgMove: function bgMove(bgList, speed) {
        for (var index = 0; index < bgList.length; index++) {
            var element = bgList[index];
            element.x -= speed;
        }
    },

    /***
     * 检查背景是否要重置位置
     */
    checkBgReset: function checkBgReset(bgList) {
        var winSize = cc.director.getWinSize();
        var first_xMax = bgList[0].getBoundingBox().xMax;
        if (first_xMax <= 0) {
            var preFirstBg = bgList.shift();
            bgList.push(preFirstBg);

            var curFirstBg = bgList[0];
            preFirstBg.x = curFirstBg.getBoundingBox().xMax;
        }
    }
});

cc._RFpop();
},{}],"game-scene":[function(require,module,exports){
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
},{}],"panda-control":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd5100S4m6ROAJ4FE6j+WaBp', 'panda-control');
// src/role/panda-control.js


cc.Class({
    "extends": cc.Component,

    properties: {
        speed: cc.v2(0, 0),
        addSpeed: 600,
        maxSpeed: cc.v2(10, 1000),
        gravity: -1000,
        jumpSpeed: 300,
        collisionX: 0,
        collisionY: 0,
        direction: 0, //控制的方向，只有左右
        jumping: false,
        jumpCount: 0, //跳跃次数
        drag: 1000,
        prePosition: cc.v2(0, 0), //上一帧的坐标
        player: null, // 动画播放器

        // //外部组件
        uiLayer: cc.Node,
        uiLayerComonent: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.prePosition.x = this.node.x;
        this.prePosition.y = this.node.y;

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //    manager.enabledDebugDraw = true;

        this.player = this.node.getComponent(cc.Animation);

        //UI组件
        this.uiLayerComonent = this.uiLayer.getComponent("uiLayer");

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.onKeyPressed.bind(this),
            onKeyReleased: this.onKeyReleased.bind(this)
        }, this.node);
    },

    onDestroy: function onDisabled() {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },

    onKeyPressed: function onKeyPressed(keyCode, event) {
        switch (keyCode) {
            case cc.KEY.d:
                this.direction = 1;

                if (!this.jumping) this.player.play("run");
                break;
            case cc.KEY.a:
                this.direction = -1;
                if (!this.jumping) this.player.play("run");

                break;
            case cc.KEY.j:
                if (!this.jumping || this.jumpCount < 2) {
                    this.jumping = true;
                    this.speed.y = this.jumpSpeed;

                    this.jumpCount++;
                    this.jumpCount < 2 ? this.player.play("jump") : this.player.play("twiceJump");
                }
                break;
        }
    },

    onKeyReleased: function onKeyReleased(keyCode, event) {
        switch (keyCode) {
            case cc.KEY.d:
                if (this.direction == 1) {
                    this.direction = 0;
                }
                break;
            case cc.KEY.a:
                if (this.direction == -1) {
                    this.direction = 0;
                }
                break;
        }
    },

    collisionGoldEnter: function collisionGoldEnter(other, self) {
        other.node.removeFromParent();

        this.uiLayerComonent.addGold();
    },

    collisionPlatformEnter: function collisionPlatformEnter(other, self) {
        var selfAabb = self.world.aabb.clone();
        var otherAabb = other.world.aabb;
        var preAabb = self.world.preAabb;

        selfAabb.x = preAabb.x;
        selfAabb.y = preAabb.y;

        //检查X是否发生碰撞
        selfAabb.x = self.world.aabb.x;
        if (cc.Intersection.rectRect(selfAabb, otherAabb)) {
            if (this.speed.x < 0 && selfAabb.xMax > otherAabb.xMax) {
                this.node.x = otherAabb.xMax;
                this.collisionX = -1;
            } else if (this.speed.x > 0 && selfAabb.xMin < otherAabb.xMin) {
                this.node.x = otherAabb.xMin - selfAabb.width;
                this.collisionX = 1;
            }

            this.speed.x = 0;
            return;
        }

        //检查Y是否发生碰撞
        selfAabb.y = self.world.aabb.y;
        if (cc.Intersection.rectRect(selfAabb, otherAabb)) {
            if (this.speed.y < 0 && selfAabb.yMax > otherAabb.yMax) {
                this.node.y = otherAabb.yMax;
                this.jumping = false;
                this.player.play("run");
                this.jumpCount = 0;
                this.collisionY = -1;
            } else if (this.speed.y > 0 && selfAabb.yMin < otherAabb.yMin) {
                this.node.y = otherAabb.yMin - selfAabb.height;
                this.collisionY = 1;
            }

            this.speed.y = 0;
        }
    },

    onCollisionEnter: function onCollisionEnter(other, self) {
        console.log('on collision enter');
        cc.log("coll tag = " + other.tag);

        if (other.tag == 1) {
            this.collisionGoldEnter(other, self);
        } else {
            this.collisionPlatformEnter(other, self);
        }
    },

    onCollisionStay: function onCollisionStay(other, self) {
        // console.log('on collision stay');

        if (other.tag != 0) return;
        if (this.collisionY === -1) {
            var offset = cc.v2(other.world.aabb.x - other.world.preAabb.x, 0);

            // var temp = cc.affineTransformClone(self.world.transform);
            // temp.tx = temp.ty = 0;

            // offset = cc.pointApplyAffineTransform(offset, temp);
            this.node.x += offset.x;
        }
    },

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function onCollisionExit(other, self) {
        console.log('on collision exit');
        if (other.tag != 0) return;

        this.collisionX = 0;
        this.collisionY = 0;
        this.jumping = true;
        this.jumpCount = 1;
        this.player.play("jump");
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        /**
         * Y轴变化
         *  */
        if (this.collisionY === 0) //没任何碰撞，计算重力
            {
                this.speed.y += this.gravity * dt;
                if (Math.abs(this.speed.y) > this.maxSpeed.y) {
                    this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
                }
            }

        if (this.direction === 0) {
            //停下的时候，计算摩擦力
            if (this.speed.x > 0) {
                this.speed.x -= this.drag * dt;
                if (this.speed.x <= 0) this.speed.x = 0;
            } else if (this.speed.x < 0) {
                this.speed.x += this.drag * dt;
                if (this.speed.x >= 0) this.speed.x = 0;
            }
        } else {
            //左右速度行走,如果反方向，速度用更大的摩擦力，令方向更快改变
            var trueDir = this.speed.x > 0 ? 1 : -1;
            if (this.speed.x == 0) trueDir = 0;
            var speed = trueDir == this.direction ? this.addSpeed : 3000;

            this.speed.x += (this.direction > 0 ? 1 : -1) * speed * dt;
            if (Math.abs(this.speed.x) > this.maxSpeed.x) {
                this.speed.x = this.speed.x > 0 ? this.maxSpeed.x : -this.maxSpeed.x;
            }
        }

        //左右有碰撞,X立刻停下
        if (this.speed.x * this.collisionX > 0) {
            this.speed.x = 0;
        }

        this.prePosition.x = this.node.x;
        this.prePosition.y = this.node.y;

        this.node.x += this.speed.x * dt;
        this.node.y += this.speed.y * dt;
    }
});

cc._RFpop();
},{}],"platform-generator":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a5b85M16A9GbZoyKP97bDi4', 'platform-generator');
// src/role/platform-generator.js

cc.Class({
    "extends": cc.Component,

    properties: {
        platform_list: [],
        move_speed: 0.1,
        platform_prafab: [cc.Prefab],
        platform_layer: cc.Node,
        gold_group_list: [cc.Prefab],
        maxMoveSpeed: 8 },

    //平台最大移动速度
    initPlatforms: function initPlatforms(list) {
        this.platform_list = list;

        list.forEach(function (element) {
            element.setAnchorPoint(0, 0);
        }, this);
    },

    generate: function generate(last_platform) {
        //随机N种平台
        var random_num = Math.random() * 4;
        random_num = Math.floor(random_num);

        var platform_temp = cc.instantiate(this.platform_prafab[random_num]);
        platform_temp.setAnchorPoint(0, 0);

        /**
         *设置坐标 
         */

        //x
        var layer_size = this.platform_layer.getContentSize();
        platform_temp.x = layer_size.width;

        //随机Y值(不能太高，所以-100)
        platform_temp.y = Math.random() * (layer_size.height - 100);
        cc.log(platform_temp.y);

        //防止Y对于前面的平台过高，跳不上去
        var max_offy = 100;
        if (platform_temp.y > last_platform.y + max_offy) {
            platform_temp.y = last_platform.y + max_offy;
        }

        //添加到节点
        this.platform_list.push(platform_temp);
        this.platform_layer.addChild(platform_temp);

        //一定的几率平台添加金币
        // if (Math.random() >= 0.5) {
        var index = Math.random() * 3;
        index = Math.floor(index);
        var gold_group = cc.instantiate(this.gold_group_list[index]);
        var platform_size = platform_temp.getContentSize();
        gold_group.setPosition(platform_size.width / 2, platform_size.height);
        platform_temp.addChild(gold_group);
        // }

        cc.log("产出一个平台,平台数=", this.platform_list.length);
    },

    // // use this for initialization
    // onLoad: function () {
    //     this.schedule(this.onAddSpeed,10);
    // },

    // onAddSpeed:function(){
    //     this.move_speed += 0.1;
    // },

    // onDestroy: function onDisabled() {
    //      this.unschedule(this.onAddSpeed);
    // },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {

        var platform;
        var remove_count = 0;
        var list_new = [];
        for (var index = 0; index < this.platform_list.length; index++) {
            platform = this.platform_list[index];
            platform.x -= this.move_speed;

            if (platform.getBoundingBox().xMax > 0) {
                list_new.push(platform);
            } else {
                platform.removeFromParent();
            }
        }

        this.platform_list = list_new;

        if (!platform) {
            return;
        }

        var winSize = cc.director.getWinSize();
        var last_platform_bounding_box = platform.getBoundingBox();
        var right_x = last_platform_bounding_box.x + last_platform_bounding_box.width;

        if (right_x < winSize.width * 0.8) {
            this.generate(platform);
        }

        //平台移动速度变更
        if (this.move_speed < this.maxMoveSpeed) {
            this.move_speed += 0.001;
        }
    }
});

cc._RFpop();
},{}],"uiLayer":[function(require,module,exports){
"use strict";
cc._RFpush(module, '68c90r5ql1P0ppR4qeTEULM', 'uiLayer');
// src/layer/uiLayer.js

cc.Class({
    "extends": cc.Component,

    properties: {
        gold_label: cc.Label,
        goldNum: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},

    addGold: function addGold() {
        this.goldNum++;
        this.gold_label.string = this.goldNum + "";
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}]},{},["uiLayer","platform-generator","background","panda-control","game-scene"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL3NyYy9sYXllci9iYWNrZ3JvdW5kLmpzIiwiYXNzZXRzL3NyYy9zY2VuZS9nYW1lLXNjZW5lLmpzIiwiYXNzZXRzL3NyYy9yb2xlL3BhbmRhLWNvbnRyb2wuanMiLCJhc3NldHMvc3JjL3JvbGUvcGxhdGZvcm0tZ2VuZXJhdG9yLmpzIiwiYXNzZXRzL3NyYy9sYXllci91aUxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2FkNDFjL3hWYmRQa2JXM1F2ekYyMTF2JywgJ2JhY2tncm91bmQnKTtcbi8vIHNyYy9sYXllci9iYWNrZ3JvdW5kLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBuZWFyX2JnOiBbY2MuTm9kZV0sXG4gICAgICAgIGZhcl9iZzogW2NjLk5vZGVdLFxuXG4gICAgICAgIG5lYXJfc3BlZWQ6IDUsXG4gICAgICAgIGZhcl9zcGVlZDogMC41XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmZpeEJnUG9zKHRoaXMuZmFyX2JnWzBdLCB0aGlzLmZhcl9iZ1sxXSk7XG4gICAgICAgIHRoaXMuZml4QmdQb3ModGhpcy5uZWFyX2JnWzBdLCB0aGlzLm5lYXJfYmdbMV0pO1xuICAgIH0sXG5cbiAgICBmaXhCZ1BvczogZnVuY3Rpb24gZml4QmdQb3MoYmcxLCBiZzIpIHtcbiAgICAgICAgYmcxLnggPSAwO1xuICAgICAgICB2YXIgYmcxQm91bmRpbmdCb3ggPSBiZzEuZ2V0Qm91bmRpbmdCb3goKTtcbiAgICAgICAgYmcyLnNldFBvc2l0aW9uKGJnMUJvdW5kaW5nQm94LnhNYXgsIGJnMUJvdW5kaW5nQm94LnlNaW4pO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIHRoaXMuYmdNb3ZlKHRoaXMuZmFyX2JnLCB0aGlzLmZhcl9zcGVlZCk7XG4gICAgICAgIHRoaXMuYmdNb3ZlKHRoaXMubmVhcl9iZywgdGhpcy5uZWFyX3NwZWVkKTtcblxuICAgICAgICB0aGlzLmNoZWNrQmdSZXNldCh0aGlzLmZhcl9iZyk7XG4gICAgICAgIHRoaXMuY2hlY2tCZ1Jlc2V0KHRoaXMubmVhcl9iZyk7XG4gICAgfSxcblxuICAgIGJnTW92ZTogZnVuY3Rpb24gYmdNb3ZlKGJnTGlzdCwgc3BlZWQpIHtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGJnTGlzdC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gYmdMaXN0W2luZGV4XTtcbiAgICAgICAgICAgIGVsZW1lbnQueCAtPSBzcGVlZDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKioqXG4gICAgICog5qOA5p+l6IOM5pmv5piv5ZCm6KaB6YeN572u5L2N572uXG4gICAgICovXG4gICAgY2hlY2tCZ1Jlc2V0OiBmdW5jdGlvbiBjaGVja0JnUmVzZXQoYmdMaXN0KSB7XG4gICAgICAgIHZhciB3aW5TaXplID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpO1xuICAgICAgICB2YXIgZmlyc3RfeE1heCA9IGJnTGlzdFswXS5nZXRCb3VuZGluZ0JveCgpLnhNYXg7XG4gICAgICAgIGlmIChmaXJzdF94TWF4IDw9IDApIHtcbiAgICAgICAgICAgIHZhciBwcmVGaXJzdEJnID0gYmdMaXN0LnNoaWZ0KCk7XG4gICAgICAgICAgICBiZ0xpc3QucHVzaChwcmVGaXJzdEJnKTtcblxuICAgICAgICAgICAgdmFyIGN1ckZpcnN0QmcgPSBiZ0xpc3RbMF07XG4gICAgICAgICAgICBwcmVGaXJzdEJnLnggPSBjdXJGaXJzdEJnLmdldEJvdW5kaW5nQm94KCkueE1heDtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZmFjZjAxOGlzNUVSS0ZrRldhL2ZXcTcnLCAnZ2FtZS1zY2VuZScpO1xuLy8gc3JjL3NjZW5lL2dhbWUtc2NlbmUuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG5cbiAgICAgICAgcGxhdGZvcm1fZ2VuZXJhdG9yOiBudWxsLFxuICAgICAgICBwbGF0Zm9ybV9kZWZhdWx0XzA6IGNjLk5vZGUsXG4gICAgICAgIHBsYXRmb3JtX2RlZmF1bHRfMTogY2MuTm9kZVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIHBsYXRmb3JtX2dlbmVyYXRvcl9ub2RlID0gY2MuZmluZChcInBsYXRmb3JtLWdlbmVyYXRvclwiKTtcbiAgICAgICAgdGhpcy5wbGF0Zm9ybV9nZW5lcmF0b3IgPSBwbGF0Zm9ybV9nZW5lcmF0b3Jfbm9kZS5nZXRDb21wb25lbnQoXCJwbGF0Zm9ybS1nZW5lcmF0b3JcIik7XG4gICAgICAgIHRoaXMucGxhdGZvcm1fZ2VuZXJhdG9yLmluaXRQbGF0Zm9ybXMoW3RoaXMucGxhdGZvcm1fZGVmYXVsdF8wLCB0aGlzLnBsYXRmb3JtX2RlZmF1bHRfMV0pO1xuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2Q1MTAwUzRtNlJPQUo0RkU2aitXYUJwJywgJ3BhbmRhLWNvbnRyb2wnKTtcbi8vIHNyYy9yb2xlL3BhbmRhLWNvbnRyb2wuanNcblxuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc3BlZWQ6IGNjLnYyKDAsIDApLFxuICAgICAgICBhZGRTcGVlZDogNjAwLFxuICAgICAgICBtYXhTcGVlZDogY2MudjIoMTAsIDEwMDApLFxuICAgICAgICBncmF2aXR5OiAtMTAwMCxcbiAgICAgICAganVtcFNwZWVkOiAzMDAsXG4gICAgICAgIGNvbGxpc2lvblg6IDAsXG4gICAgICAgIGNvbGxpc2lvblk6IDAsXG4gICAgICAgIGRpcmVjdGlvbjogMCwgLy/mjqfliLbnmoTmlrnlkJHvvIzlj6rmnInlt6blj7NcbiAgICAgICAganVtcGluZzogZmFsc2UsXG4gICAgICAgIGp1bXBDb3VudDogMCwgLy/ot7Pot4PmrKHmlbBcbiAgICAgICAgZHJhZzogMTAwMCxcbiAgICAgICAgcHJlUG9zaXRpb246IGNjLnYyKDAsIDApLCAvL+S4iuS4gOW4p+eahOWdkOagh1xuICAgICAgICBwbGF5ZXI6IG51bGwsIC8vIOWKqOeUu+aSreaUvuWZqFxuXG4gICAgICAgIC8vIC8v5aSW6YOo57uE5Lu2XG4gICAgICAgIHVpTGF5ZXI6IGNjLk5vZGUsXG4gICAgICAgIHVpTGF5ZXJDb21vbmVudDogbnVsbFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wcmVQb3NpdGlvbi54ID0gdGhpcy5ub2RlLng7XG4gICAgICAgIHRoaXMucHJlUG9zaXRpb24ueSA9IHRoaXMubm9kZS55O1xuXG4gICAgICAgIHZhciBtYW5hZ2VyID0gY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpO1xuICAgICAgICBtYW5hZ2VyLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAvLyAgICBtYW5hZ2VyLmVuYWJsZWREZWJ1Z0RyYXcgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMucGxheWVyID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuXG4gICAgICAgIC8vVUnnu4Tku7ZcbiAgICAgICAgdGhpcy51aUxheWVyQ29tb25lbnQgPSB0aGlzLnVpTGF5ZXIuZ2V0Q29tcG9uZW50KFwidWlMYXllclwiKTtcblxuICAgICAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoe1xuICAgICAgICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuS0VZQk9BUkQsXG4gICAgICAgICAgICBvbktleVByZXNzZWQ6IHRoaXMub25LZXlQcmVzc2VkLmJpbmQodGhpcyksXG4gICAgICAgICAgICBvbktleVJlbGVhc2VkOiB0aGlzLm9uS2V5UmVsZWFzZWQuYmluZCh0aGlzKVxuICAgICAgICB9LCB0aGlzLm5vZGUpO1xuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uIG9uRGlzYWJsZWQoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldENvbGxpc2lvbk1hbmFnZXIoKS5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldENvbGxpc2lvbk1hbmFnZXIoKS5lbmFibGVkRGVidWdEcmF3ID0gZmFsc2U7XG4gICAgfSxcblxuICAgIG9uS2V5UHJlc3NlZDogZnVuY3Rpb24gb25LZXlQcmVzc2VkKGtleUNvZGUsIGV2ZW50KSB7XG4gICAgICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgICAgICAgY2FzZSBjYy5LRVkuZDpcbiAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IDE7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuanVtcGluZykgdGhpcy5wbGF5ZXIucGxheShcInJ1blwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLmE6XG4gICAgICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSAtMTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuanVtcGluZykgdGhpcy5wbGF5ZXIucGxheShcInJ1blwiKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5LRVkuajpcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuanVtcGluZyB8fCB0aGlzLmp1bXBDb3VudCA8IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qdW1waW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGVlZC55ID0gdGhpcy5qdW1wU3BlZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qdW1wQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qdW1wQ291bnQgPCAyID8gdGhpcy5wbGF5ZXIucGxheShcImp1bXBcIikgOiB0aGlzLnBsYXllci5wbGF5KFwidHdpY2VKdW1wXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbktleVJlbGVhc2VkOiBmdW5jdGlvbiBvbktleVJlbGVhc2VkKGtleUNvZGUsIGV2ZW50KSB7XG4gICAgICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgICAgICAgY2FzZSBjYy5LRVkuZDpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5LRVkuYTpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjb2xsaXNpb25Hb2xkRW50ZXI6IGZ1bmN0aW9uIGNvbGxpc2lvbkdvbGRFbnRlcihvdGhlciwgc2VsZikge1xuICAgICAgICBvdGhlci5ub2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcblxuICAgICAgICB0aGlzLnVpTGF5ZXJDb21vbmVudC5hZGRHb2xkKCk7XG4gICAgfSxcblxuICAgIGNvbGxpc2lvblBsYXRmb3JtRW50ZXI6IGZ1bmN0aW9uIGNvbGxpc2lvblBsYXRmb3JtRW50ZXIob3RoZXIsIHNlbGYpIHtcbiAgICAgICAgdmFyIHNlbGZBYWJiID0gc2VsZi53b3JsZC5hYWJiLmNsb25lKCk7XG4gICAgICAgIHZhciBvdGhlckFhYmIgPSBvdGhlci53b3JsZC5hYWJiO1xuICAgICAgICB2YXIgcHJlQWFiYiA9IHNlbGYud29ybGQucHJlQWFiYjtcblxuICAgICAgICBzZWxmQWFiYi54ID0gcHJlQWFiYi54O1xuICAgICAgICBzZWxmQWFiYi55ID0gcHJlQWFiYi55O1xuXG4gICAgICAgIC8v5qOA5p+lWOaYr+WQpuWPkeeUn+eisOaSnlxuICAgICAgICBzZWxmQWFiYi54ID0gc2VsZi53b3JsZC5hYWJiLng7XG4gICAgICAgIGlmIChjYy5JbnRlcnNlY3Rpb24ucmVjdFJlY3Qoc2VsZkFhYmIsIG90aGVyQWFiYikpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwZWVkLnggPCAwICYmIHNlbGZBYWJiLnhNYXggPiBvdGhlckFhYmIueE1heCkge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS54ID0gb3RoZXJBYWJiLnhNYXg7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25YID0gLTE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3BlZWQueCA+IDAgJiYgc2VsZkFhYmIueE1pbiA8IG90aGVyQWFiYi54TWluKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnggPSBvdGhlckFhYmIueE1pbiAtIHNlbGZBYWJiLndpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uWCA9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc3BlZWQueCA9IDA7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvL+ajgOafpVnmmK/lkKblj5HnlJ/norDmkp5cbiAgICAgICAgc2VsZkFhYmIueSA9IHNlbGYud29ybGQuYWFiYi55O1xuICAgICAgICBpZiAoY2MuSW50ZXJzZWN0aW9uLnJlY3RSZWN0KHNlbGZBYWJiLCBvdGhlckFhYmIpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zcGVlZC55IDwgMCAmJiBzZWxmQWFiYi55TWF4ID4gb3RoZXJBYWJiLnlNYXgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSA9IG90aGVyQWFiYi55TWF4O1xuICAgICAgICAgICAgICAgIHRoaXMuanVtcGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLnBsYXkoXCJydW5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy5qdW1wQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uWSA9IC0xO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNwZWVkLnkgPiAwICYmIHNlbGZBYWJiLnlNaW4gPCBvdGhlckFhYmIueU1pbikge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS55ID0gb3RoZXJBYWJiLnlNaW4gLSBzZWxmQWFiYi5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25ZID0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zcGVlZC55ID0gMDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkNvbGxpc2lvbkVudGVyOiBmdW5jdGlvbiBvbkNvbGxpc2lvbkVudGVyKG90aGVyLCBzZWxmKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdvbiBjb2xsaXNpb24gZW50ZXInKTtcbiAgICAgICAgY2MubG9nKFwiY29sbCB0YWcgPSBcIiArIG90aGVyLnRhZyk7XG5cbiAgICAgICAgaWYgKG90aGVyLnRhZyA9PSAxKSB7XG4gICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkdvbGRFbnRlcihvdGhlciwgc2VsZik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbGxpc2lvblBsYXRmb3JtRW50ZXIob3RoZXIsIHNlbGYpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uQ29sbGlzaW9uU3RheTogZnVuY3Rpb24gb25Db2xsaXNpb25TdGF5KG90aGVyLCBzZWxmKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvbiBjb2xsaXNpb24gc3RheScpO1xuXG4gICAgICAgIGlmIChvdGhlci50YWcgIT0gMCkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5jb2xsaXNpb25ZID09PSAtMSkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IGNjLnYyKG90aGVyLndvcmxkLmFhYmIueCAtIG90aGVyLndvcmxkLnByZUFhYmIueCwgMCk7XG5cbiAgICAgICAgICAgIC8vIHZhciB0ZW1wID0gY2MuYWZmaW5lVHJhbnNmb3JtQ2xvbmUoc2VsZi53b3JsZC50cmFuc2Zvcm0pO1xuICAgICAgICAgICAgLy8gdGVtcC50eCA9IHRlbXAudHkgPSAwO1xuXG4gICAgICAgICAgICAvLyBvZmZzZXQgPSBjYy5wb2ludEFwcGx5QWZmaW5lVHJhbnNmb3JtKG9mZnNldCwgdGVtcCk7XG4gICAgICAgICAgICB0aGlzLm5vZGUueCArPSBvZmZzZXQueDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlvZPnorDmkp7nu5PmnZ/lkI7osIPnlKhcbiAgICAgKiBAcGFyYW0gIHtDb2xsaWRlcn0gb3RoZXIg5Lqn55Sf56Kw5pKe55qE5Y+m5LiA5Liq56Kw5pKe57uE5Lu2XG4gICAgICogQHBhcmFtICB7Q29sbGlkZXJ9IHNlbGYgIOS6p+eUn+eisOaSnueahOiHqui6q+eahOeisOaSnue7hOS7tlxuICAgICAqL1xuICAgIG9uQ29sbGlzaW9uRXhpdDogZnVuY3Rpb24gb25Db2xsaXNpb25FeGl0KG90aGVyLCBzZWxmKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdvbiBjb2xsaXNpb24gZXhpdCcpO1xuICAgICAgICBpZiAob3RoZXIudGFnICE9IDApIHJldHVybjtcblxuICAgICAgICB0aGlzLmNvbGxpc2lvblggPSAwO1xuICAgICAgICB0aGlzLmNvbGxpc2lvblkgPSAwO1xuICAgICAgICB0aGlzLmp1bXBpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmp1bXBDb3VudCA9IDE7XG4gICAgICAgIHRoaXMucGxheWVyLnBsYXkoXCJqdW1wXCIpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBZ6L205Y+Y5YyWXG4gICAgICAgICAqICAqL1xuICAgICAgICBpZiAodGhpcy5jb2xsaXNpb25ZID09PSAwKSAvL+ayoeS7u+S9leeisOaSnu+8jOiuoeeul+mHjeWKm1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuc3BlZWQueSArPSB0aGlzLmdyYXZpdHkgKiBkdDtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnModGhpcy5zcGVlZC55KSA+IHRoaXMubWF4U3BlZWQueSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwZWVkLnkgPSB0aGlzLnNwZWVkLnkgPiAwID8gdGhpcy5tYXhTcGVlZC55IDogLXRoaXMubWF4U3BlZWQueTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSAwKSB7XG4gICAgICAgICAgICAvL+WBnOS4i+eahOaXtuWAme+8jOiuoeeul+aRqeaTpuWKm1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BlZWQueCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNwZWVkLnggLT0gdGhpcy5kcmFnICogZHQ7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3BlZWQueCA8PSAwKSB0aGlzLnNwZWVkLnggPSAwO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNwZWVkLnggPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zcGVlZC54ICs9IHRoaXMuZHJhZyAqIGR0O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNwZWVkLnggPj0gMCkgdGhpcy5zcGVlZC54ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5bem5Y+z6YCf5bqm6KGM6LWwLOWmguaenOWPjeaWueWQke+8jOmAn+W6pueUqOabtOWkp+eahOaRqeaTpuWKm++8jOS7pOaWueWQkeabtOW/q+aUueWPmFxuICAgICAgICAgICAgdmFyIHRydWVEaXIgPSB0aGlzLnNwZWVkLnggPiAwID8gMSA6IC0xO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BlZWQueCA9PSAwKSB0cnVlRGlyID0gMDtcbiAgICAgICAgICAgIHZhciBzcGVlZCA9IHRydWVEaXIgPT0gdGhpcy5kaXJlY3Rpb24gPyB0aGlzLmFkZFNwZWVkIDogMzAwMDtcblxuICAgICAgICAgICAgdGhpcy5zcGVlZC54ICs9ICh0aGlzLmRpcmVjdGlvbiA+IDAgPyAxIDogLTEpICogc3BlZWQgKiBkdDtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh0aGlzLnNwZWVkLngpID4gdGhpcy5tYXhTcGVlZC54KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zcGVlZC54ID0gdGhpcy5zcGVlZC54ID4gMCA/IHRoaXMubWF4U3BlZWQueCA6IC10aGlzLm1heFNwZWVkLng7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL+W3puWPs+acieeisOaSnixY56uL5Yi75YGc5LiLXG4gICAgICAgIGlmICh0aGlzLnNwZWVkLnggKiB0aGlzLmNvbGxpc2lvblggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnNwZWVkLnggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcmVQb3NpdGlvbi54ID0gdGhpcy5ub2RlLng7XG4gICAgICAgIHRoaXMucHJlUG9zaXRpb24ueSA9IHRoaXMubm9kZS55O1xuXG4gICAgICAgIHRoaXMubm9kZS54ICs9IHRoaXMuc3BlZWQueCAqIGR0O1xuICAgICAgICB0aGlzLm5vZGUueSArPSB0aGlzLnNwZWVkLnkgKiBkdDtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2E1Yjg1TTE2QTlHYlpveUtQOTdiRGk0JywgJ3BsYXRmb3JtLWdlbmVyYXRvcicpO1xuLy8gc3JjL3JvbGUvcGxhdGZvcm0tZ2VuZXJhdG9yLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBwbGF0Zm9ybV9saXN0OiBbXSxcbiAgICAgICAgbW92ZV9zcGVlZDogMC4xLFxuICAgICAgICBwbGF0Zm9ybV9wcmFmYWI6IFtjYy5QcmVmYWJdLFxuICAgICAgICBwbGF0Zm9ybV9sYXllcjogY2MuTm9kZSxcbiAgICAgICAgZ29sZF9ncm91cF9saXN0OiBbY2MuUHJlZmFiXSxcbiAgICAgICAgbWF4TW92ZVNwZWVkOiA4IH0sXG5cbiAgICAvL+W5s+WPsOacgOWkp+enu+WKqOmAn+W6plxuICAgIGluaXRQbGF0Zm9ybXM6IGZ1bmN0aW9uIGluaXRQbGF0Zm9ybXMobGlzdCkge1xuICAgICAgICB0aGlzLnBsYXRmb3JtX2xpc3QgPSBsaXN0O1xuXG4gICAgICAgIGxpc3QuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5zZXRBbmNob3JQb2ludCgwLCAwKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIGdlbmVyYXRlOiBmdW5jdGlvbiBnZW5lcmF0ZShsYXN0X3BsYXRmb3JtKSB7XG4gICAgICAgIC8v6ZqP5py6TuenjeW5s+WPsFxuICAgICAgICB2YXIgcmFuZG9tX251bSA9IE1hdGgucmFuZG9tKCkgKiA0O1xuICAgICAgICByYW5kb21fbnVtID0gTWF0aC5mbG9vcihyYW5kb21fbnVtKTtcblxuICAgICAgICB2YXIgcGxhdGZvcm1fdGVtcCA9IGNjLmluc3RhbnRpYXRlKHRoaXMucGxhdGZvcm1fcHJhZmFiW3JhbmRvbV9udW1dKTtcbiAgICAgICAgcGxhdGZvcm1fdGVtcC5zZXRBbmNob3JQb2ludCgwLCAwKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICrorr7nva7lnZDmoIcgXG4gICAgICAgICAqL1xuXG4gICAgICAgIC8veFxuICAgICAgICB2YXIgbGF5ZXJfc2l6ZSA9IHRoaXMucGxhdGZvcm1fbGF5ZXIuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgcGxhdGZvcm1fdGVtcC54ID0gbGF5ZXJfc2l6ZS53aWR0aDtcblxuICAgICAgICAvL+maj+aculnlgLwo5LiN6IO95aSq6auY77yM5omA5LulLTEwMClcbiAgICAgICAgcGxhdGZvcm1fdGVtcC55ID0gTWF0aC5yYW5kb20oKSAqIChsYXllcl9zaXplLmhlaWdodCAtIDEwMCk7XG4gICAgICAgIGNjLmxvZyhwbGF0Zm9ybV90ZW1wLnkpO1xuXG4gICAgICAgIC8v6Ziy5q2iWeWvueS6juWJjemdoueahOW5s+WPsOi/h+mrmO+8jOi3s+S4jeS4iuWOu1xuICAgICAgICB2YXIgbWF4X29mZnkgPSAxMDA7XG4gICAgICAgIGlmIChwbGF0Zm9ybV90ZW1wLnkgPiBsYXN0X3BsYXRmb3JtLnkgKyBtYXhfb2ZmeSkge1xuICAgICAgICAgICAgcGxhdGZvcm1fdGVtcC55ID0gbGFzdF9wbGF0Zm9ybS55ICsgbWF4X29mZnk7XG4gICAgICAgIH1cblxuICAgICAgICAvL+a3u+WKoOWIsOiKgueCuVxuICAgICAgICB0aGlzLnBsYXRmb3JtX2xpc3QucHVzaChwbGF0Zm9ybV90ZW1wKTtcbiAgICAgICAgdGhpcy5wbGF0Zm9ybV9sYXllci5hZGRDaGlsZChwbGF0Zm9ybV90ZW1wKTtcblxuICAgICAgICAvL+S4gOWumueahOWHoOeOh+W5s+WPsOa3u+WKoOmHkeW4gVxuICAgICAgICAvLyBpZiAoTWF0aC5yYW5kb20oKSA+PSAwLjUpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gTWF0aC5yYW5kb20oKSAqIDM7XG4gICAgICAgIGluZGV4ID0gTWF0aC5mbG9vcihpbmRleCk7XG4gICAgICAgIHZhciBnb2xkX2dyb3VwID0gY2MuaW5zdGFudGlhdGUodGhpcy5nb2xkX2dyb3VwX2xpc3RbaW5kZXhdKTtcbiAgICAgICAgdmFyIHBsYXRmb3JtX3NpemUgPSBwbGF0Zm9ybV90ZW1wLmdldENvbnRlbnRTaXplKCk7XG4gICAgICAgIGdvbGRfZ3JvdXAuc2V0UG9zaXRpb24ocGxhdGZvcm1fc2l6ZS53aWR0aCAvIDIsIHBsYXRmb3JtX3NpemUuaGVpZ2h0KTtcbiAgICAgICAgcGxhdGZvcm1fdGVtcC5hZGRDaGlsZChnb2xkX2dyb3VwKTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGNjLmxvZyhcIuS6p+WHuuS4gOS4quW5s+WPsCzlubPlj7DmlbA9XCIsIHRoaXMucGxhdGZvcm1fbGlzdC5sZW5ndGgpO1xuICAgIH0sXG5cbiAgICAvLyAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICAvLyBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyAgICAgdGhpcy5zY2hlZHVsZSh0aGlzLm9uQWRkU3BlZWQsMTApO1xuICAgIC8vIH0sXG5cbiAgICAvLyBvbkFkZFNwZWVkOmZ1bmN0aW9uKCl7XG4gICAgLy8gICAgIHRoaXMubW92ZV9zcGVlZCArPSAwLjE7XG4gICAgLy8gfSxcblxuICAgIC8vIG9uRGVzdHJveTogZnVuY3Rpb24gb25EaXNhYmxlZCgpIHtcbiAgICAvLyAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLm9uQWRkU3BlZWQpO1xuICAgIC8vIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG5cbiAgICAgICAgdmFyIHBsYXRmb3JtO1xuICAgICAgICB2YXIgcmVtb3ZlX2NvdW50ID0gMDtcbiAgICAgICAgdmFyIGxpc3RfbmV3ID0gW107XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnBsYXRmb3JtX2xpc3QubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBwbGF0Zm9ybSA9IHRoaXMucGxhdGZvcm1fbGlzdFtpbmRleF07XG4gICAgICAgICAgICBwbGF0Zm9ybS54IC09IHRoaXMubW92ZV9zcGVlZDtcblxuICAgICAgICAgICAgaWYgKHBsYXRmb3JtLmdldEJvdW5kaW5nQm94KCkueE1heCA+IDApIHtcbiAgICAgICAgICAgICAgICBsaXN0X25ldy5wdXNoKHBsYXRmb3JtKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGxhdGZvcm0ucmVtb3ZlRnJvbVBhcmVudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wbGF0Zm9ybV9saXN0ID0gbGlzdF9uZXc7XG5cbiAgICAgICAgaWYgKCFwbGF0Zm9ybSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHdpblNpemUgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCk7XG4gICAgICAgIHZhciBsYXN0X3BsYXRmb3JtX2JvdW5kaW5nX2JveCA9IHBsYXRmb3JtLmdldEJvdW5kaW5nQm94KCk7XG4gICAgICAgIHZhciByaWdodF94ID0gbGFzdF9wbGF0Zm9ybV9ib3VuZGluZ19ib3gueCArIGxhc3RfcGxhdGZvcm1fYm91bmRpbmdfYm94LndpZHRoO1xuXG4gICAgICAgIGlmIChyaWdodF94IDwgd2luU2l6ZS53aWR0aCAqIDAuOCkge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZShwbGF0Zm9ybSk7XG4gICAgICAgIH1cblxuICAgICAgICAvL+W5s+WPsOenu+WKqOmAn+W6puWPmOabtFxuICAgICAgICBpZiAodGhpcy5tb3ZlX3NwZWVkIDwgdGhpcy5tYXhNb3ZlU3BlZWQpIHtcbiAgICAgICAgICAgIHRoaXMubW92ZV9zcGVlZCArPSAwLjAwMTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNjhjOTByNXFsMVAwcHBSNHFlVEVVTE0nLCAndWlMYXllcicpO1xuLy8gc3JjL2xheWVyL3VpTGF5ZXIuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdvbGRfbGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICBnb2xkTnVtOiAwXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG5cbiAgICBhZGRHb2xkOiBmdW5jdGlvbiBhZGRHb2xkKCkge1xuICAgICAgICB0aGlzLmdvbGROdW0rKztcbiAgICAgICAgdGhpcy5nb2xkX2xhYmVsLnN0cmluZyA9IHRoaXMuZ29sZE51bSArIFwiXCI7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiXX0=
