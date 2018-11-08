var ServerApi = require('ServerApi')
var ClientApi = require('ClientApi')

var appKey = 'ef157e0cad97efcbc7e7c2b48ef9444f'
var appSecret = 'f1fcb5aac3a2'
var defaultToken = 'haha'
var roomid = 500

var serverApi = new ServerApi(appKey, appSecret)
var dID = cc.sys.localStorage.nim_web_sdk_deviceId
console.log('设备ID:', dID);
var teamName = 'defaultTeamName'
var teamID = 8197635

//IO游戏所有的网络逻辑在这个模块实现
var _p = {
    //链接服务器
    connect: function (userName, sucCallback) {
        this.userName = this.userName || userName
        this.sucCallback = this.sucCallback || sucCallback
        this.dealEvent()

        var self = this
        //先登录账号
        this.nim = ClientApi.getNim(dID, defaultToken, function (data) {
            console.log('账号登录成功', data);
            self.loginData = data
            //---------------再加群---------------
            self.enterTeam(self.enterTeamCallback)
        })


    },

    //成功进群的回调
    enterTeamCallback: function (teamData) {
        // console.log('成功进群', data);
        var netData = {
            userData: this.loginData,
            teamData: teamData
        }
        this.sucCallback(netData)
    },

    //创建账号
    createAccid: function (userName) {
        var data = {
            accid: dID,
            name: userName,
            token: defaultToken
        }
        var self = this
        serverApi.createUserId(data, function (err, json) {
            if (json.code == 200) {
                console.log('账号创建成功：', json.info);
                self.connect()
            }
        })
    },

    //进入群
    enterTeam: function () {
        var self = this
        //查询群
        var data = {
            tids: [teamID],
            ope: 0,
        }
        serverApi.queryGroup(data, function (err, data) {
            if (data.code == 414) {//没有这个群
                console.log('没有这个群,创建一个.');
                var data = {
                    tname: teamName,
                    owner: dID,
                    msg: 'rehkjerhkerhjkergjkh',
                    magree: 0,
                    joinmode: 0,
                }
                serverApi.createGroup(data, function (err, data) {
                    if (data.code == 414) {
                        console.log('群创建失败：' + data.desc);
                    }else if (data.code == 200) {
                        console.log('群创建成功：' + data.tid);
                        teamID = data.tid
                        self.enterTeam()
                    }
                })
            }
            else if (data.code == 200) {//有这个群
                var info = data.tinfos[0]
                console.log('有这个群：', info);
                
                if(info.owner == dID){//如果已经是群主了，就直接下一步
                    self.enterTeamCallback(info)
                }
                else{//否则就加群
                    var data = {
                        tid: info.tid,
                        owner: info.owner,
                        members: [dID],
                        msg: 'rehkjerhkerhjkergjkh',
                        magree: 0,
                        joinmode: 0,
                    }
                    serverApi.addIntoGroup(data, function (err, data) {
                        if (data.code == 200) {
                            console.log('加群加入');
                            self.enterTeamCallback(info)
                        }
                        else{
                            console.log('加群失败：', data);
                        }
                    })
                }

            }
            
        })
    },



    //发送游戏同步信息
    sendMsg: function (msgData) {
        var options = {
            scene: 'team',
            to: teamID,
            content: msgData,
            resend: false,
            done: this.sendMsgDone,
        }
        this.nim.sendCustomMsg(options)
    },

    //发送消息完成
    sendMsgDone: function (argument) {
        //console.log('发送消息完成', argument);
    },


    //处理事件
    dealEvent: function () {
        //网络上面的302错误
        cc.director.GlobalEvent.on('302NIMErr', function (data) {
            console.log('没这个账号，重新注册一个');
            this.createAccid(this.userName)
        }, this)

        //玩家登录事件
        cc.director.GlobalEvent.on('Net_login', function (data) {
            //发送同步消息
            console.log('发送登录消息：', data);
            this.sendMsg(data)
        }, this)

        //收到同步消息
        cc.director.GlobalEvent.on('getNetMsg', function (data) {
            //收到同步消息
            console.log('收到同步消息', data);
        }, this)
    },
}

module.exports = _p
