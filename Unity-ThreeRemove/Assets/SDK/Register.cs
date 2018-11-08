using System;
using System.Collections.Generic;

/// <summary>
/// 消息节点
/// </summary>
public class Register
{
    public uint resId;
    public List<INotifier> notifiers = new List<INotifier>();
}