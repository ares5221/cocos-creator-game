/*
 * 脚本名(ScriptName)：    TestServer.cs
 * 作者(Author):           小宝
 * 官网(Url):              http://www.youke.pro
 */
using UnityEngine;
using System.Collections;
using YouKe.Data;

public class TestServer : MonoBehaviour,INotifier
{

	// Use this for initialization
    void Start()
    {
        //注册收听器
        GameServerMgr.GetInstance().RegisterNotifier(NetMessageDef.ResFriendList, this);
        GameServerMgr.GetInstance().RegisterNotifier(NetMessageDef.ResLogin, this);
        GameServerMgr.GetInstance().RegisterNotifier(NetMessageDef.ResReturnDefaultInfo, this);
        GameServerMgr.GetInstance().RegisterNotifier(NetMessageDef.ResFindFriendList, this);


        GameServerMgr.GetInstance().RegisterNotifier(NetMessageDef.ResGetTopList, this);

        //protos.Login.ReqLogin loginTest = new protos.Login.ReqLogin();
        //loginTest.account = "s001";
        //loginTest.password = "123456";
        //GameServerMgr.GetInstance().SendMessage(new MuffinMsg(100, loginTest));

        //protos.Login.ReqCreateAccount createAccount = new protos.Login.ReqCreateAccount();
        //createAccount.account = "s003";
        //createAccount.password = "123456";
        //GameServerMgr.GetInstance().SendMessage(new MuffinMsg((int)NetMessageDef.ReqCreateAccount, createAccount));

        //protos.Login.ReqLogin createAccount = new protos.Login.ReqLogin();
        //createAccount.account = "s001";
        //createAccount.password = "123456";
        //GameServerMgr.GetInstance().SendMessage(new MuffinMsg((int)NetMessageDef.ReqLogin, createAccount));

        //测试添加积分
        //protos.integral.ReqAddTop addTop = new protos.integral.ReqAddTop();
        //addTop.userName = "赵五";
        //addTop.integral = 1024;

        //GameServerMgr.GetInstance().SendMessage(new MuffinMsg((int)NetMessageDef.ReqAddTop, addTop));


        protos.integral.ReqGetTopListSan getTopListSan = new protos.integral.ReqGetTopListSan();
        getTopListSan.topNums = 10;

        GameServerMgr.GetInstance().SendMessage(new MuffinMsg((int)NetMessageDef.ReqGetTopListSan, getTopListSan));

        //GameServerMgr.GetInstance().Test();
    }

    // Update is called once per frame
    void Update()
    {

    }

    public void OnReceiveData(uint cmdId, object param1, object param2)
    {
        if (cmdId == NetMessageDef.ResLogin)
        {
            protos.Login.ResLogin info = param1 as protos.Login.ResLogin;
            Debug.Log("结果类型：" + info.results);
            Debug.Log("结果细节：" + info.details);
            
            //protos.friend.ReqGetFriendList getFriendList = new protos.friend.ReqGetFriendList();
            //getFriendList.feiendId = 1;
            //GameServerMgr.GetInstance().SendMessage(new MuffinMsg((int)NetMessageDef.ReqGetFriendList, getFriendList));

            //protos.friend.ReqGiveVigor giveVigor = new protos.friend.ReqGiveVigor();
            //giveVigor.feiendId = 2;
            //GameServerMgr.GetInstance().SendMessage(new MuffinMsg((int)NetMessageDef.ReqGiveVigor, giveVigor));

            //protos.friend.ReqAddFriend addFriend = new protos.friend.ReqAddFriend();
            //addFriend.feiendId = 2;
            //GameServerMgr.GetInstance().SendMessage(new MuffinMsg((int)NetMessageDef.ReqAddFriend, addFriend));

            //protos.friend.ReqDeleteFriend addFriend = new protos.friend.ReqDeleteFriend();
            //addFriend.feiendId = 2;
            //GameServerMgr.GetInstance().SendMessage(new MuffinMsg((int)NetMessageDef.ReqDeleteFriend, addFriend));

            //protos.friend.ReqFindFriend addFriend = new protos.friend.ReqFindFriend();
            //addFriend.name = "王";
            //addFriend.page = 1;
            //addFriend.pageSize = 10;
            //GameServerMgr.GetInstance().SendMessage(new MuffinMsg((int)NetMessageDef.ReqFindFriend, addFriend));


            //protos.integral.ReqAddIntegral addIntegral = new protos.integral.ReqAddIntegral();
            //addIntegral.userId = 1;
            //addIntegral.integral = 10;

            //GameServerMgr.GetInstance().SendMessage(new MuffinMsg((int)NetMessageDef.ReqAddIntegral, addIntegral));


            protos.integral.ReqGetTopList getTopList = new protos.integral.ReqGetTopList();
            getTopList.topNums = 10;

            GameServerMgr.GetInstance().SendMessage(new MuffinMsg((int)NetMessageDef.ReqGetTopList, getTopList));
        }
        else if(cmdId == NetMessageDef.ResFriendList)
        {
            protos.friend.ResFriendList list = param1 as protos.friend.ResFriendList;

            //protos.friend.UserInfo

            foreach (protos.friend.UserInfo info in list.userInfo)
            {
                Debug.Log(string.Format("name={0} lv={1} id={2}", info.name, info.lv, info.uid));
            }

            Debug.Log("好友个数:" + list.userInfo.Count);
        }
        else if(cmdId == NetMessageDef.ResReturnDefaultInfo)
        {
            protos.ReturnMessage.ResDefaultInfo info = param1 as protos.ReturnMessage.ResDefaultInfo;
            Debug.Log("结果："+info.results);
            Debug.Log("细节：" + info.details);
        }
        else if(cmdId == NetMessageDef.ResFindFriendList)
        {
            protos.friend.ResFindFriendList list = param1 as protos.friend.ResFindFriendList;
            foreach (protos.friend.UserInfo info in list.userInfo)
            {
                Debug.Log(string.Format("name={0} lv={1} id={2}", info.name, info.lv, info.uid));
            }
            Debug.Log("符合条件用户个数:" + list.userInfo.Count);
        }
        else if(cmdId == NetMessageDef.ResGetTopList)
        {
            protos.integral.ResGetTopList list = param1 as protos.integral.ResGetTopList;


            foreach (protos.integral.TopInfo info in list.topInfo)
            {
                Debug.Log(string.Format("name={0} lv={1} id={2} integral={3}", info.name, info.lv, info.uid, info.integral));
            }
            Debug.Log("排行榜用户个数:" + list.topInfo.Count);
        }
    }
}
