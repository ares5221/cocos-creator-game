var SnakeSkins = ["face", "png-0430", "png-0433", "png-0435", "png-0441"];
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
        login: cc.Node,
        emailInput: cc.Node,
        passwordInput: cc.Node,
        scoreBoard: cc.Node,
        scoreLabel: cc.Node,
        scoreContent: cc.Node,
        scoreItemPrefab: cc.Prefab,
        snakePrefab: cc.Prefab,
        lurePrefab: cc.Prefab,
        lureRate: 5,
        luresLimit: 5,
        skins: [cc.SpriteFrame]
    },

    // use this for initialization
    onLoad: function() {
        let self = this;

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        self.score = 0;
        self.scoreLabel = self.scoreLabel.getComponent(cc.Label);

        self.wildInit();
    },
    reload: function() {
        let self = this;
        self.scoreBoard.active = false;
        self.scoreLabel.string = 0;
        self.score = 0;
        let mySnake = cc.instantiate(self.snakePrefab);
        //传过去吧
        mySnake.getComponent('Snake').myWilddog = self.myWilddog;
        mySnake.setPosition(self.getRandomPosition());
        let skinNum = Math.round(Math.random() * 5);
        mySnake.getComponent('Snake').skin = self.skins[skinNum];
        mySnake.getComponent('Snake').init({
            playerName: self.playerName,
            isMyself: true,
            skinNum: skinNum
        });

        mySnake.parent = self.node;
    },

    wildInit: function() {
        let self = this;
        cc.loader.loadRes('config.json', function(err, res) {
            // var config = {
            //     authDomain: "XXX.wilddog.com",
            //     syncURL: "https://XXX.wilddogio.com"
            // };
            cc.log(res);
            wilddog.initializeApp(res);
            self.wilddog = wilddog;
            self.ref = wilddog.sync().ref('/snake/players');
            self.lureRef = wilddog.sync().ref('/snake/lures');
            self.scoreRef = wilddog.sync().ref('/snake/score');

            self.login.setPosition(cc.p(0, 0));
            self.scoreBoard.active = false;
            //temp
            self.emailInput.getComponent(cc.EditBox).string = 'xxx@xx.com';
            self.passwordInput.getComponent(cc.EditBox).string = 'xxxx';
        });

    },
    gameStart: function() {
        let self = this;
        let userName = self.emailInput.getComponent(cc.EditBox).string;
        let password = self.passwordInput.getComponent(cc.EditBox).string;
        let playerName_ = userName.split('@')[0];
        //如何处理重复登录问题？

        self.ref.child(playerName_).once("value").then(function(snapshot) {
            if (!snapshot.exists()) {
                //没有登录过了
                wilddog.auth().signInWithEmailAndPassword(userName, password).then(function(user) {
                    //cc.log(user);
                    //生成自己
                    self.login.active = false;
                    let playerName = user.email;
                    playerName = playerName.split('@')[0];
                    self.playerName = playerName;
                    //player自己
                    self.myWilddog = self.ref.child(playerName);
                    let mySnake = cc.instantiate(self.snakePrefab);
                    mySnake.getComponent('Snake').myWilddog = self.myWilddog; //传过去吧
                    mySnake.setPosition(self.getRandomPosition());
                    let skinNum = Math.round(Math.random() * 5);
                    mySnake.getComponent('Snake').skin = self.skins[skinNum];
                    mySnake.getComponent('Snake').init({
                        playerName: playerName,
                        isMyself: true,
                        skinNum: skinNum
                    });

                    mySnake.parent = self.node;
                    self.lures = [];
                    self.otherSnakes = [];
                    //控制wilddog

                    //当离线时自己删除自己，事件注册到了wilddog上
                    self.myWilddog.onDisconnect().remove();

                    //wilddog事件集中处理
                    self.ref.on('child_added', function(snapshot) {
                        //加了玩家
                        //--->得到玩家名字snapshot.key()
                        //---》他的位置
                        //---》在本机生成其它玩家snake
                        //如果是自己不处理
                        if (snapshot.key() === playerName) return;
                        let value = snapshot.val();
                        let otherSnake = cc.instantiate(self.snakePrefab);
                        let script = otherSnake.getComponent('Snake');

                        script.skin = self.skins[value.skinNum];
                        script.init({
                            playerName: snapshot.key(),
                            isMyself: false,
                            skinNum: value.skinNum
                        });
                        script.status = value.status;
                        script.moveDirection = value.moveDirection;
                        otherSnake.setPosition(value.posX, value.posY);
                        //设置碰撞系
                        otherSnake.group = 'othersnake';
                        otherSnake.parent = self.node;
                        //放到变更中
                        self.otherSnakes.push(otherSnake);
                    });
                    self.ref.on('child_changed', function(snapshot) {
                        //变了方向，是不是需要修正一下位置
                        //先找到snake//用循环的方式可能性能不好
                        //如果是自己不处理
                        if (snapshot.key() === playerName) return;
                        let value = snapshot.val();
                        for (var i = 0; i < self.otherSnakes.length; i++) {
                            let script = self.otherSnakes[i].getComponent('Snake');

                            if (script.playerName === snapshot.key()) {
                                script.status = value.status;
                                script.moveDirection = value.moveDirection;
                                self.otherSnakes[i].setPosition(value.posX, value.posY);
                                break;
                            }
                            if (script == null) {
                                cc.log('ee');
                            }
                        }
                    });
                    self.ref.on('child_removed', function(snapshot) {
                        //如果是自己不处理
                        if (snapshot.key() === playerName) return;
                        //用户下线，相当于死了//是由本地判断还是由wilddog进行判断呢
                        for (var i = 0; i < self.otherSnakes.length; i++) {
                            let script = self.otherSnakes[i].getComponent('Snake');
                            if (script.playerName === snapshot.key()) {
                                script.die();
                            }
                        }

                    });
                    //lures部分的处理
                    self.lureRef.on('child_added', function(snapshot) {
                        if (!self.isServer) {
                            // 只要自己不是服务器，则需要生成
                            self.generateLure(cc.p(snapshot.val().posX, snapshot.val().posY));
                        }
                    });

                    //child_removed还需要吗，同步处理后结果应该一样

                    //server部分处理
                    //这个不能在每个客户端都启动，那样会太多，要判断一下
                    let server = self.wilddog.sync().ref('snake/server');
                    self.isServer = false;
                    let temp = null;
                    server.push(playerName).then(function(ref) {
                        temp = ref.key();
                        return server.once("value");
                    }).then(function(snapshot) {
                        cc.log('current server number:' + snapshot.numChildren());
                        if (snapshot.numChildren() > 1) {
                            //如果多于一个
                            server.child(temp).remove(); //把自己去掉
                        } else {
                            //如果只有一个,这个不能死，不然没有生成lure的了
                            //其实场地，lure等非个性化公共元素应该由服务器自己控制，而不是
                            //由某一个客户端来控制
                            server.child(temp).onDisconnect().remove();
                            self.isServer = true;
                            //先放这里吧
                            self.schedule(function() {
                                //保证总数一定，不会太密
                                if (self.lures.length < self.luresLimit) {
                                    let pos = self.getRandomPosition(); //如何保证不生成到已有东西的里面？
                                    self.generateLure(pos);
                                }
                            }, self.lureRate);
                        }
                    }).catch(function(err) {
                        cc.error('operation is failed ', err);
                    });
                    //score部分
                    //wilddog规则表达式如下：
                    // {
                    //     "rules": {
                    //         ".read": true,
                    //         ".write": true,
                    //         "snake": {
                    //             "score": {
                    //                 ".indexOn": ".value"
                    //             }
                    //         }
                    //     }
                    // }
                    self.scoreRef.orderByValue().limitToLast(10).on('value', function(snapshot) {
                        self.scoreContent.removeAllChildren(true);
                        let i = 10;
                        snapshot.forEach(function(data) {
                            //此处wilddog不提供反向排序功能，得自己处理
                            let scoreItem = cc.instantiate(self.scoreItemPrefab);
                            scoreItem.getComponent(cc.Label).string = data.key() + '(' + data.val() + ')';
                            self.scoreContent.addChild(scoreItem, i);
                            i--;
                            // scoreItem.parent = self.scoreContent;
                        });
                    });


                    //CC事件集中处理
                    self.node.on('lure_eated', function(event) {
                        for (var i = 0; i < self.lures.length; i++) {
                            if (self.lures[i].uuid === event.getUserData().lure) {
                                if (event.getUserData().isMyself) {
                                    self.score++; //加一分
                                    self.scoreLabel.string = self.score;
                                }
                                //要从wilddog中去掉，只有自己当服务器生成的
                                if (self.isServer) {
                                    if (self.lures[i].key) {
                                        self.lureRef.child(self.lures[i].key).remove();
                                    }
                                }
                                self.lures[i].destroy();
                                self.lures.splice(i, 1);
                                break;
                            }
                        }
                    });
                    //死后身体部分转换成lure
                    self.node.on('translate', function(event) {
                        self.generateLure(event.getUserData());
                    });
                    //只有自己死了才会出现重玩
                    self.node.on('die', function(event) {
                        let snake = event.getUserData();
                        if (!snake.getComponent('Snake').isMyself) {
                            for (var i = self.otherSnakes.length - 1; i >= 0; i--) {
                                if (self.otherSnakes[i].getComponent('Snake').playerName === snake.getComponent('Snake').playerName) {
                                    self.otherSnakes.splice(i, 1);
                                    break;
                                }
                            }
                        } else {
                            //更新自己的纪录
                            self.scoreRef.child(self.playerName).once("value").then(function(snapshot) {
                                if (snapshot.exists()) {

                                    let maxScore = parseInt(snapshot.val());
                                    let currScore = parseInt(self.scoreLabel.string);
                                    if (maxScore < currScore) {
                                        self.scoreRef.child(self.playerName).set(self.scoreLabel.string);
                                    }
                                } else {
                                    self.scoreRef.child(self.playerName).set(parseInt(self.scoreLabel.string));
                                }


                            });
                            //排行榜也可以放到这里，显示的时候once一下


                            //弹出重玩
                            self.scoreBoard.active = true;
                            self.scoreBoard.setPosition(0, 0);
                        }

                    });
                }).catch(function(error) {
                    // 错误处理
                    cc.log(error);
                });

            }
        });



    },
    getRandomPosition: function() {
        let y = -cc.winSize.height / 2 + 50 + (cc.winSize.height - 100) * Math.random();
        let x = -cc.winSize.width / 2 + 50 + (cc.winSize.width - 100) * Math.random();
        return cc.p(x, y);
    },
    generateLure: function(pos) {
        let self = this;
        let lure = cc.instantiate(self.lurePrefab);
        lure.setPosition(pos);
        lure.parent = self.node;


        //怎么保存只在一个主服务器上生成lure呢，这样不会由于玩家太多之后，生成速度太快、、
        //暂时先用一个，以后再想
        if (self.isServer) {
            //只有自己是服务器才往wilddog上放lure数据，其它客户端只接收数据
            if (self.lureRef) {
                self.lureRef.push({
                    posX: pos.x,
                    posY: pos.y
                }).then(function(ref) {
                    //得记录这个，以备后面删除
                    //用了PUSH之后，会生成临时KEY
                    //lure现在是一个NODE
                    lure.key = ref.key();
                    ref.onDisconnect().remove();
                });
            }
        }
        self.lures.push(lure);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});