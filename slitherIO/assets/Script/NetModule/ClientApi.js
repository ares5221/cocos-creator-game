


//客户端API
var _p = {
    data: {},
    appKey:'ef157e0cad97efcbc7e7c2b48ef9444f',//这是我申请的key，展示用

    getNim: function (account, token, callback) {
        this.account = account
        this.token = token
        this.loginCallback = callback

        return NIM.getInstance(this)
    },

    // onconnect账号登录
    // 连接建立后的回调, 会传入一个对象, 包含登录的信息, 有以下字段
    // lastLoginDeviceId: 上次登录的设备的设备号
    // connectionId: 本次登录的连接号
    // ip: 客户端IP
    // port: 客户端端口
    // country: 本次登录的国家
    onconnect: function (argument) {
        this.loginCallback(argument)
    },

    // ondisconnect    function        optional
    // 断开连接后的回调
    // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
    // 此回调会收到一个对象, 包含错误的信息, 有以下字段
    // code: 出错时的错误码, 可能为空
    // 302: 账号或者密码错误
    // 'kicked': 被踢
    // 当code为'kicked'的时候, 此对象会有以下字段
    // reason: 被踢的原因
    // samePlatformKick: 不允许同一个帐号在多个地方同时登录
    // serverKick: 被服务器踢了
    // otherPlatformKick: 被其它端踢了
    // message: 文字描述的被踢的原因
    ondisconnect: function (data) {
        if (data.code == 302) {
            cc.director.GlobalEvent.emit('302NIMErr', data)
        }
    },

    onerror: function (argument) {
        console.log('发生的错误：', argument);
    },

    onmsg: function (msg) {
        // console.log('收到消息', msg.scene, msg.type, msg);
        cc.director.GlobalEvent.emit('getNetMsg',  msg.content)
    },

    

}

module.exports = _p