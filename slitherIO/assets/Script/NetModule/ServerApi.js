/**
 * 网易云信server API 接口 1.0
 * Class ServerAPI
 * @author  hzchensheng15@corp.netease.com
 * @date    2015-10-28  13:00
 * 
***/

var crypto = require('crypto');
var https  = require('https');
var http   = require('http');
var urlParser = require('url');
var querystring = require('querystring');

module.exports = ServerApi;

/**
 * 参数初始化
 * @param $AppKey
 * @param $AppSecret
 */
function ServerApi(AppKey,AppSecret){
    this.AppKey = AppKey;                     //开发者平台分配的AppKey
    this.AppSecret=AppSecret;                 //开发者平台分配的AppSecret,可刷新
}

/**
 * API checksum校验生成
 * @param  void
 * @return CheckSum(对象私有属性)
 */
ServerApi.prototype.checkSumBuilder = function(){
    //此部分生成随机字符串
    var charHex = '0123456789abcdef';
    this.Nonce = '';                  //随机数（最大长度128个字符）
    for(var i=0;i<128;i++){         //随机字符串最大128个字符，也可以小于该数
        this.Nonce += charHex.charAt(Math.round(15*Math.random()));
    }
    this.CurTime = Date.parse(new Date())/1000;     //当前UTC时间戳，从1970年1月1日0点0 分0 秒开始到现在的秒数(String)
    var join_string = this.AppSecret + this.Nonce + this.CurTime
    
    var sha1 = crypto.createHash('sha1');
    sha1.update(join_string);
    this.CheckSum = sha1.digest('hex');       //SHA1(AppSecret + Nonce + CurTime),三个参数拼接的字符串，进行SHA1哈希计算，转化成16进制字符(String，小写)

}

/**
 * 使用发送post请求
 * @param  url          [请求地址]
 * @param  data         [json格式数据]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.postDataHttps = function(url,data,callback){
    this.checkSumBuilder();

    var urlObj = urlParser.parse(url);
    var httpHeader = {
        'AppKey'        : this.AppKey,
        'Nonce'         : this.Nonce,
        'CurTime'       : this.CurTime,
        'CheckSum'      : this.CheckSum,
        'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8',
    };
    var options = {
        hostname: urlObj.hostname,
        port    : 80,
        path    : urlObj.path,
        method  : 'POST',
        headers : httpHeader
    };

    var that = this;
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        // console.log("statusCode: ", res.statusCode);
        // console.log("headers: ", res.headers);

        res.on('data', function(chunk){
            if(Object.prototype.toString.call(callback)==='[object Function]'){
                var result = JSON.parse(chunk);
                callback.call(that,null,result);
            }   
        });
    });
    
    var postData = querystring.stringify(data);
    req.write(postData);
    req.end();

    req.on('error', function(err) {
        if(Object.prototype.toString.call(callback)==='[object Function]'){
            callback.call(that,err,null);
        }
    });
}

/**
 * 创建云信ID
 * 1.第三方帐号导入到云信平台；
 * 2.注意accid，name长度以及考虑管理秘钥token
 * @param data 包含：
 *     -  accid     [云信ID，最大长度32字节，必须保证一个APP内唯一（只允许字母、数字、半角下划线_、@、半角点以及半角-组成，不区分大小写，会统一小写处理）]
 *     -  name      [云信ID昵称，最大长度64字节，用来PUSH推送时显示的昵称]
 *     -  props     [json属性，第三方可选填，最大长度1024字节]
 *     -  icon      [云信ID头像URL，第三方可选填，最大长度1024]
 *     -  token     [云信ID可以指定登录token值，最大长度128字节，并更新，如果未指定，会自动生成token，并在创建成功后返回]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.createUserId = function(data,callback){
    var url = 'https://api.netease.im/nimserver/user/create.action';
    var postData = {
        'accid' : data['accid']||'',
        'name'  : data['name']||'',
        'props' : data['props']||'',
        'icon'  : data['icon']||'',
        'token' : data['token']||''     
    };
    this.postDataHttps(url,postData,callback);
}


/**
 * 更新云信ID
 * @param data 包含：
 *     -  accid     [云信ID，最大长度32字节，必须保证一个APP内唯一（只允许字母、数字、半角下划线_、@、半角点以及半角-组成，不区分大小写，会统一小写处理）]
 *     -  name      [云信ID昵称，最大长度64字节，用来PUSH推送时显示的昵称]
 *     -  props     [json属性，第三方可选填，最大长度1024字节]
 *     -  token     [云信ID可以指定登录token值，最大长度128字节，并更新，如果未指定，会自动生成token，并在创建成功后返回]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.updateUserId = function(data,callback){
    var url = 'https://api.netease.im/nimserver/user/update.action';
    var postData = {
        'accid' : data['accid']||'',
        'name'  : data['name']||'',
        'props' : data['props']||'',
        'token' : data['token']||'' 
    };
    this.postDataHttps(url,postData,callback);
}


/**
 * 更新并获取新token
 * @param data 包含：
 *     -  accid     [云信ID，最大长度32字节，必须保证一个APP内唯一（只允许字母、数字、半角下划线_、@、半角点以及半角-组成，不区分大小写，会统一小写处理）]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.updateUserToken = function(data,callback){
    var url = 'https://api.netease.im/nimserver/user/refreshToken.action';
    var postData = {
        'accid' : data['accid']||''
    };
    this.postDataHttps(url,postData,callback);
}

/**
 * 封禁云信ID
 * 第三方禁用某个云信ID的IM功能,封禁云信ID后，此ID将不能登陆云信imserver
 * @param data 包含：
 *     -  accid     [云信ID，最大长度32字节，必须保证一个APP内唯一（只允许字母、数字、半角下划线_、@、半角点以及半角-组成，不区分大小写，会统一小写处理）]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */ 
ServerApi.prototype.blockUserId = function(data,callback){
    var url = 'https://api.netease.im/nimserver/user/block.action';
    var postData = {
        'accid' : data['accid']||''
    };
    this.postDataHttps(url,postData,callback);
}

/**
 * 解禁云信ID
 * 第三方禁用某个云信ID的IM功能,封禁云信ID后，此ID将不能登陆云信imserver
 * @param data 包含：
 *     -  accid     [云信ID，最大长度32字节，必须保证一个APP内唯一（只允许字母、数字、半角下划线_、@、半角点以及半角-组成，不区分大小写，会统一小写处理）]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.unblockUserId = function(data,callback){
    var url = 'https://api.netease.im/nimserver/user/unblock.action';
    var postData = {
        'accid' : data['accid']||''
    };
    this.postDataHttps(url,postData,callback);
}

/**
 * 更新用户名片
 * @param data 包含：
 *     -  accid       [云信ID，最大长度32字节，必须保证一个APP内唯一（只允许字母、数字、半角下划线_、@、半角点以及半角-组成，不区分大小写，会统一小写处理）]
 *     -  name        [云信ID昵称，最大长度64字节，用来PUSH推送时显示的昵称]
 *     -  icon        [用户icon，最大长度256字节]
 *     -  sign        [用户签名，最大长度256字节]
 *     -  email       [用户email，最大长度64字节]
 *     -  birth       [用户生日，最大长度16字节]
 *     -  mobile      [用户mobile，最大长度32字节]
 *     -  ex          [用户名片扩展字段，最大长度1024字节，用户可自行扩展，建议封装成JSON字符串]
 *     -  gender      [用户性别，0表示未知，1表示男，2女表示女，其它会报参数错误]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.updateUinfo = function(data,callback){
    var url = 'https://api.netease.im/nimserver/user/updateUinfo.action';
    var postData = {
        'accid' : data['accid']||'',
        'name'  : data['name']||'',
        'icon'  : data['icon']||'',
        'sign'  : data['sign']||'',
        'email' : data['email']||'',
        'birth' : data['birth']||'',
        'mobile': data['mobile']||'',
        'gender': data['gender']||'',
        'ex'    : data['ex']||''
    };
    this.postDataHttps(url,postData,callback);
}

/**
 * 获取用户名片，可批量
 * @param data 包含：
 *     -  accids    [用户帐号（例如：JSONArray对应的accid串，如："zhangsan"，如果解析出错，会报414）（一次查询最多为200）]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.getUinfos = function(data,callback){
    var url = 'https://api.netease.im/nimserver/user/getUinfos.action';
    var postData = {
        'accids'    : JSON.stringify(data['accids']||[])
    };
    this.postDataHttps(url,postData,callback);
}       

/**
 * 好友关系-加好友
 * @param data 包含：
 *     -  accid       [云信ID，最大长度32字节，必须保证一个APP内唯一（只允许字母、数字、半角下划线_、@、半角点以及半角-组成，不区分大小写，会统一小写处理）]
 *     -  faccid        [云信ID昵称，最大长度64字节，用来PUSH推送时显示的昵称]
 *     -  type        [用户type，最大长度256字节]
 *     -  msg        [用户签名，最大长度256字节]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.addFriend = function(data,callback){
    var url = 'https://api.netease.im/nimserver/friend/add.action';
    var postData = {
        'accid' : data['accid']||'',
        'faccid' : data['faccid']||'',
        'type' : data['type']||'1',
        'msg' : data['msg']||''
    };
    this.postDataHttps(url,postData,callback);
}       

/**
 * 好友关系-更新好友信息
 * @param data 包含：
 *     -  accid       [云信ID，最大长度32字节，必须保证一个APP内唯一（只允许字母、数字、半角下划线_、@、半角点以及半角-组成，不区分大小写，会统一小写处理）]
 *     -  faccid        [要修改朋友的accid]
 *     -  alias        [给好友增加备注名]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.updateFriend = function(data,callback){
    var url = 'https://api.netease.im/nimserver/friend/update.action';
    var postData = {
        'accid' : data['accid']||'',
        'faccid' : data['faccid']||'',
        'alias' : data['alias']||''
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 好友关系-获取好友关系
 * @param data 包含：
 *     -  accid       [云信ID，最大长度32字节，必须保证一个APP内唯一（只允许字母、数字、半角下划线_、@、半角点以及半角-组成，不区分大小写，会统一小写处理）]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.getFriend = function(data,callback){
    var url = 'https://api.netease.im/nimserver/friend/get.action';
    var postData = {
        'accid' : data['accid']||'',
        'createtime' : Date.parse(new Date())/1000 + ''
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 好友关系-删除好友信息
 * @param data 包含：
 *     -  accid       [云信ID，最大长度32字节，必须保证一个APP内唯一（只允许字母、数字、半角下划线_、@、半角点以及半角-组成，不区分大小写，会统一小写处理）]
 *     -  faccid        [要修改朋友的accid]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.deleteFriend = function(data,callback){
    var url = 'https://api.netease.im/nimserver/friend/delete.action';
    var postData = {
        'accid' : data['accid']||'',
        'faccid' : data['faccid']||''
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 好友关系-设置黑名单
 * @param data 包含：
 *     -  accid       [云信ID，最大长度32字节，必须保证一个APP内唯一（只允许字母、数字、半角下划线_、@、半角点以及半角-组成，不区分大小写，会统一小写处理）]
 *     -  targetAcc        [被加黑或加静音的帐号]
 *     -  relationType        [本次操作的关系类型,1:黑名单操作，2:静音列表操作]
 *     -  value        [操作值，0:取消黑名单或静音；1:加入黑名单或静音]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.specializeFriend = function(data,callback){
    var url = 'https://api.netease.im/nimserver/user/setSpecialRelation.action';
    var postData = {
        'accid' : data['accid']||'',
        'targetAcc' : data['targetAcc']||'',
        'relationType' : data['relationType']||'1',
        'value' : data['value']||'1'
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 好友关系-查看黑名单列表
 * @param data 包含：
 *     -  accid       [云信ID，最大长度32字节，必须保证一个APP内唯一（只允许字母、数字、半角下划线_、@、半角点以及半角-组成，不区分大小写，会统一小写处理）]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.listBlackFriend = function(data,callback){
    var url = 'https://api.netease.im/nimserver/user/listBlackAndMuteList.action';
    var postData = {
        'accid' : data['accid']||''
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 消息功能-发送普通消息
 * @param data 包含：
 *     -  from       [发送者accid，用户帐号，最大32字节，APP内唯一]
 *     -  ope        [0：点对点个人消息，1：群消息，其他返回414]
 *     -  to        [ope==0是表示accid，ope==1表示tid]
 *     -  type        [0 表示文本消息,1 表示图片，2 表示语音，3 表示视频，4 表示地理位置信息，6 表示文件，100 自定义消息类型]
 *     -  body       [请参考下方消息示例说明中对应消息的body字段。最大长度5000字节，为一个json字段。]
 *     -  option       [发消息时特殊指定的行为选项,Json格式，可用于指定消息的漫游，存云端历史，发送方多端同步，推送，消息抄送等特殊行为;option中字段不填时表示默认值]
 *     -  pushcontent      [推送内容，发送消息（文本消息除外，type=0），option选项中允许推送（push=true），此字段可以指定推送内容。 最长200字节]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */ 
ServerApi.prototype.sendMsg = function(data,callback){
    var url = 'https://api.netease.im/nimserver/msg/sendMsg.action';
    var postData = {
        'from' : data['from']||'',
        'ope' : data['ope']||'',
        'to' : data['to']||'',
        'type' : data['type']||'0',
        'body' : JSON.stringify(data['body'])||'{}',
        'option' : JSON.stringify(data['option'])||'{"push":false,"roam":true,"history":true,"sendersync":true, "route":false}',
        'pushcontent' : data['pushcontent']||''
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 消息功能-发送自定义系统消息
 * 1.自定义系统通知区别于普通消息，方便开发者进行业务逻辑的通知。
 * 2.目前支持两种类型：点对点类型和群类型（仅限高级群），根据msgType有所区别。
 * @param data 包含：
 *     -  from       [发送者accid，用户帐号，最大32字节，APP内唯一]
 *     -  msgtype        [0：点对点个人消息，1：群消息，其他返回414]
 *     -  to        [msgtype==0是表示accid，msgtype==1表示tid]
 *     -  attach        [自定义通知内容，第三方组装的字符串，建议是JSON串，最大长度1024字节]
 *     -  pushcontent       [ios推送内容，第三方自己组装的推送内容，如果此属性为空串，自定义通知将不会有推送（pushcontent + payload不能超过200字节）]
 *     -  payload       [ios 推送对应的payload,必须是JSON（pushcontent + payload不能超过200字节）]
 *     -  sound      [如果有指定推送，此属性指定为客户端本地的声音文件名，长度不要超过30个字节，如果不指定，会使用默认声音]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.sendAttachMsg = function(data,callback){
    var url = 'https://api.netease.im/nimserver/msg/sendAttachMsg.action';
    var postData = {
        'from' : data['from']||'',
        'msgtype' : data['msgtype']||'0',
        'to' : data['to']||'',
        'attach' : data['attach']||'',
        'pushcontent' : data['pushcontent']||'',
        'payload' : JSON.stringify(data['payload'])||'{}',
        'sound' : data['sound']||''
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 消息功能-文件上传
 * @param data 包含：
 *     -  content       [字节流base64串(Base64.encode(bytes)) ，最大15M的字节流]
 *     -  type        [上传文件类型]       
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.uploadMsg = function(data,callback){
    var url = 'https://api.netease.im/nimserver/msg/upload.action';
    var postData = {
        'content' : data['content']||'',
        'type' : data['type']||'0'
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 消息功能-文件上传（multipart方式）
 * @param data 包含：
 *     -  content       [字节流base64串(Base64.encode(bytes)) ，最大15M的字节流]
 *     -  type        [上传文件类型]       
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.uploadMultiMsg = function(data,callback){
    var url = 'https://api.netease.im/nimserver/msg/fileUpload.action';
    var postData = {
        'content' : data['content']||'',
        'type' : data['type']||'0'
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 群组功能（高级群）-创建群
 * @param data 包含：
 *     -  tname       [群名称，最大长度64字节]
 *     -  owner       [群主用户帐号，最大长度32字节]
 *     -  members     [["aaa","bbb"](JsonArray对应的accid，如果解析出错会报414)，长度最大1024字节]
 *     -  announcement [群公告，最大长度1024字节]
 *     -  intro       [群描述，最大长度512字节]
 *     -  msg       [邀请发送的文字，最大长度150字节]
 *     -  magree      [管理后台建群时，0不需要被邀请人同意加入群，1需要被邀请人同意才可以加入群。其它会返回414。]
 *     -  joinmode    [群建好后，sdk操作时，0不用验证，1需要验证,2不允许任何人加入。其它返回414]
 *     -  custom      [自定义高级群扩展属性，第三方可以跟据此属性自定义扩展自己的群属性。（建议为json）,最大长度1024字节.]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.createGroup = function(data,callback){
    var url = 'https://api.netease.im/nimserver/team/create.action';
    var postData = {
        'tname' : data['tname']||'',
        'owner' : data['owner']||'0',
        'members' : JSON.stringify(data['members']||[]),
        'announcement' : data['announcement']||'',
        'intro' : data['intro']||'',
        'msg' : data['msg']||'',
        'magree' : data['magree']||'0',
        'joinmode' : data['joinmode']||'0',
        'custom' : data['custom']||'0'
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 群组功能（高级群）-拉人入群
 * @param data 包含：
 *     -  tid       [云信服务器产生，群唯一标识，创建群时会返回，最大长度128字节]
 *     -  owner       [群主用户帐号，最大长度32字节]
 *     -  members     [["aaa","bbb"](JsonArray对应的accid，如果解析出错会报414)，长度最大1024字节]
 *     -  magree      [管理后台建群时，0不需要被邀请人同意加入群，1需要被邀请人同意才可以加入群。其它会返回414。]
 *     -  joinmode    [群建好后，sdk操作时，0不用验证，1需要验证,2不允许任何人加入。其它返回414]
 *     -  custom      [自定义高级群扩展属性，第三方可以跟据此属性自定义扩展自己的群属性。（建议为json）,最大长度1024字节.]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.addIntoGroup = function(data,callback){
    var url = 'https://api.netease.im/nimserver/team/add.action';
    var postData = {
        'tid' : data['tid']||'',
        'owner' : data['owner']||'0',
        'members' : JSON.stringify(data['members']||[]),
        'magree' : data['magree']||'0',
        'msg' : data['msg']||''
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 群组功能（高级群）-踢人出群
 * @param data 包含：
 *     -  tid       [云信服务器产生，群唯一标识，创建群时会返回，最大长度128字节]
 *     -  owner       [群主用户帐号，最大长度32字节]
 *     -  member     [被移除人得accid，用户账号，最大长度字节]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.kickFromGroup = function(data,callback){
    var url = 'https://api.netease.im/nimserver/team/kick.action';
    var postData = {
        'tid' : data['tid']||'',
        'owner' : data['owner']||'',
        'member' : data['member']||''
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 群组功能（高级群）-解散群
 * @param data 包含：
 *     -  tid       [云信服务器产生，群唯一标识，创建群时会返回，最大长度128字节]
 *     -  owner       [群主用户帐号，最大长度32字节]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.removeGroup = function(data,callback){
    var url = 'https://api.netease.im/nimserver/team/remove.action';
    var postData = {
        'tid' : data['tid']||'',
        'owner' : data['owner']||''
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 群组功能（高级群）-更新群资料
 * @param data 包含：
 *     -  tid       [云信服务器产生，群唯一标识，创建群时会返回，最大长度128字节]
 *     -  owner       [群主用户帐号，最大长度32字节]
 *     -  tname     [群主用户帐号，最大长度32字节]
 *     -  announcement [群公告，最大长度1024字节]
 *     -  intro       [群描述，最大长度512字节]
 *     -  joinmode    [群建好后，sdk操作时，0不用验证，1需要验证,2不允许任何人加入。其它返回414]
 *     -  custom      [自定义高级群扩展属性，第三方可以跟据此属性自定义扩展自己的群属性。（建议为json）,最大长度1024字节.]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.updateGroup = function(data,callback){
    var url = 'https://api.netease.im/nimserver/team/update.action';
    var postData = {
        'tid' : data['tid']||'',
        'owner' : data['owner']||'',
        'tname' : data['tname']||'',
        'announcement' : data['announcement']||'',
        'intro' : data['intro']||'',
        'joinmode' : data['joinmode']||'0',
        'custom' : data['custom']||'0'
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 群组功能（高级群）-群信息与成员列表查询
 * @param data 包含：
 *     -  tids       [群tid列表，如[\"3083\",\"3084"]]
 *     -  ope       [1表示带上群成员列表，0表示不带群成员列表，只返回群信息]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.queryGroup = function(data,callback){
    var url = 'https://api.netease.im/nimserver/team/query.action';
    var postData = {
        'tids' : JSON.stringify(data['tids']||[]),
        'ope' : data['ope']||'1'
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 群组功能（高级群）-移交群主
 * @param data 包含：
 *     -  tid       [云信服务器产生，群唯一标识，创建群时会返回，最大长度128字节]
 *     -  owner       [群主用户帐号，最大长度32字节]
 *     -  newowner     [新群主帐号，最大长度32字节]
 *     -  leave       [1:群主解除群主后离开群，2：群主解除群主后成为普通成员。其它414]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.changeGroupOwner = function(data,callback){
    var url = 'https://api.netease.im/nimserver/team/changeOwner.action';
    var postData = {
        'tid' : data['tid']||'',
        'owner' : data['owner']||'',
        'newowner' : data['newowner']||'',
        'leave' : data['leave']||'2'
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 群组功能（高级群）-任命管理员
 * @param data 包含：
 *     -  tid       [云信服务器产生，群唯一标识，创建群时会返回，最大长度128字节]
 *     -  owner       [群主用户帐号，最大长度32字节]
 *     -  members     [["aaa","bbb"](JsonArray对应的accid，如果解析出错会报414)，长度最大1024字节（群成员最多10个）]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.addGroupManager = function(data,callback){
    var url = 'https://api.netease.im/nimserver/team/addManager.action';
    var postData = {
        'tid' : data['tid']||'',
        'owner' : data['owner']||'',
        'members' : JSON.stringify(data['members']||[])
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 群组功能（高级群）-移除管理员
 * @param data 包含：
 *     -  tid       [云信服务器产生，群唯一标识，创建群时会返回，最大长度128字节]
 *     -  owner       [群主用户帐号，最大长度32字节]
 *     -  members     [["aaa","bbb"](JsonArray对应的accid，如果解析出错会报414)，长度最大1024字节（群成员最多10个）]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.removeGroupManager = function(data,callback){
    var url = 'https://api.netease.im/nimserver/team/removeManager.action';
    var postData = {
        'tid' : data['tid']||'',
        'owner' : data['owner']||'',
        'members' : JSON.stringify(data['members']||[])
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 群组功能（高级群）-获取某用户所加入的群信息
 * @param data 包含：
 *     -  accid       [要查询用户的accid]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.joinTeams = function(data,callback){
    var url = 'https://api.netease.im/nimserver/team/joinTeams.action';
    var postData = {
        'accid' : data['accid']||''
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 群组功能（高级群）-修改群昵称
 * @param data 包含：
 *     -  tid       [云信服务器产生，群唯一标识，创建群时会返回，最大长度128字节]
 *     -  owner       [群主用户帐号，最大长度32字节]
 *     -  accid     [要修改群昵称对应群成员的accid]
 *     -  nick     [accid对应的群昵称，最大长度32字节。]     
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.updateGroupNick = function(data,callback){
    var url = 'https://api.netease.im/nimserver/team/updateTeamNick.action';
    var postData = {
        'tid' : data['tid']||'',
        'owner' : data['owner']||'',
        'accid' : data['accid']||'',
        'nick' : data['nick']||''
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 历史记录-单聊
 * @param data 包含：
 *     -  from       [发送者accid]
 *     -  to          [接收者accid]
 *     -  begintime     [开始时间，ms]
 *     -  endtime     [截止时间，ms]
 *     -  limit       [本次查询的消息条数上限(最多100条),小于等于0，或者大于100，会提示参数错误]
 *     -  reverse    [1按时间正序排列，2按时间降序排列。其它返回参数414.默认是按降序排列。]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.querySessionMsg = function(data,callback){
    var url = 'https://api.netease.im/nimserver/history/querySessionMsg.action';
    var postData = {
        'from' : data['from']||'',
        'to' : data['to']||'',
        'begintime' : data['begintime']||'0',
        'endtime' : data['endtime']||(Date.parse(new Date())+''),
        'limit' : data['limit']||'100',
        'reverse' : data['reverse']||'1'
    };
    this.postDataHttps(url,postData,callback);
}

/**
 * 历史记录-群聊
 * @param data 包含：
 *     -  tid       [群id]
 *     -  accid          [查询用户对应的accid.]
 *     -  begintime     [开始时间，ms]
 *     -  endtime     [截止时间，ms]
 *     -  limit       [本次查询的消息条数上限(最多100条),小于等于0，或者大于100，会提示参数错误]
 *     -  reverse    [1按时间正序排列，2按时间降序排列。其它返回参数414.默认是按降序排列。]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.queryGroupMsg = function(data,callback){
    var url = 'https://api.netease.im/nimserver/history/queryTeamMsg.action';
    var postData = {
        'tid' : data['tid']||'',
        'accid' : data['accid']||'',
        'begintime' : data['begintime']||'0',
        'endtime' : data['endtime']||(Date.parse(new Date())+''),
        'limit' : data['limit']||'100',
        'reverse' : data['reverse']||'1'
    };
    this.postDataHttps(url,postData,callback);
}

/**
 * 发送短信验证码
 * @param data 包含：
 *     -  mobile       [目标手机号]
 *     -  deviceId     [目标设备号，可选参数]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.sendSmsCode = function(data,callback){
    var url = 'https://api.netease.im/sms/sendcode.action';
    var postData = {
        'mobile' : data['mobile']||'',
        'deviceId' : data['deviceId']||''
    };
    this.postDataHttps(url,postData,callback);
}

/**
 * 校验验证码
 * @param data 包含：
 *     -  mobile       [目标手机号]
 *     -  code          [验证码]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.verifycode = function(data,callback){
    var url = 'https://api.netease.im/sms/verifycode.action';
    var postData = {
        'mobile' : data['mobile']||'',
        'code' : data['code']||''
    };
    this.postDataHttps(url,postData,callback);
}

/**
 * 发送模板短信
 * @param data 包含：
 *     -  templateid       [模板编号(由客服配置之后告知开发者)]
 *     -  mobiles          [验证码]
 *     -  params          [短信参数列表，用于依次填充模板，JSONArray格式，如["xxx","yyy"];对于不包含变量的模板，不填此参数表示模板即短信全文内容]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.sendSMSTemplate = function(data,callback){
    var url = 'https://api.netease.im/sms/sendtemplate.action';
    var postData = {
        'templateid' : data['templateid']||'',
        'params' : JSON.stringify(data['params']||[]),
        'mobiles' : JSON.stringify(data['mobiles']||[])
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 查询模板短信发送状态
 * @param data 包含：
 *     -  sendid       [发送短信的编号sendid]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.querySMSStatus = function(data,callback){
    var url = 'https://api.netease.im/sms/querystatus.action';
    var postData = {
        'sendid' : data['sendid']||''
    };
    this.postDataHttps(url,postData,callback);
}   

/**
 * 发起单人专线电话
 * @param data 包含：
 *     -  callerAcc       [发起本次请求的用户的accid]
 *     -  caller          [主叫方电话号码(不带+86这类国家码,下同)]
 *     -  callee          [被叫方电话号码]
 *     -  maxDur          [本通电话最大可持续时长,单位秒,超过该时长时通话会自动切断]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.startcall = function(data,callback){
    var url = 'https://api.netease.im/call/ecp/startcall.action';
    var postData = {
        'callerAcc' : data['callerAcc']||'',
        'caller' : data['caller']||'',
        'callee' : data['callee']||'0',
        'maxDur' : data['maxDur']||'60'
    };
    this.postDataHttps(url,postData,callback);
}

/**
 * 发起专线会议电话
 * @param data 包含：
 *     -  callerAcc       [发起本次请求的用户的accid]
 *     -  caller          [主叫方电话号码(不带+86这类国家码,下同)]
 *     -  callee          [所有被叫方电话号码,必须是json格式的字符串,如["13588888888","13699999999"]]
 *     -  maxDur          [本通电话最大可持续时长,单位秒,超过该时长时通话会自动切断]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.startconf = function(data,callback){
    var url = 'https://api.netease.im/call/ecp/startconf.action';
    var postData = {
        'callerAcc' : data['callerAcc']||'',
        'caller' : data['caller']||'',
        'callee' : JSON.stringify(data['callee']||[]),
        'maxDur' : data['maxDur']||'60'
    };
    this.postDataHttps(url,postData,callback);
}

/**
 * 查询单通专线电话或会议的详情
 * @param data 包含：
 *     -  session       [本次通话的id号]
 *     -  type          [通话类型,1:专线电话;2:专线会议]
 * @param  callback     [请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.queryCallsBySession = function(data,callback){
    var url = 'https://api.netease.im/call/ecp/queryBySession.action';
    var postData = {
        'session' : data['session']||'',
        'type' : data['type']||'1'
    };
    this.postDataHttps(url,postData,callback);
}

